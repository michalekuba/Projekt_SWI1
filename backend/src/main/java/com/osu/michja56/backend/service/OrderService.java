package com.osu.michja56.backend.service;

import com.osu.michja56.backend.dto.OrderCreateRequest;
import com.osu.michja56.backend.dto.OrderItemResponse;
import com.osu.michja56.backend.dto.OrderResponse;
import com.osu.michja56.backend.model.*;
import com.osu.michja56.backend.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public OrderResponse createOrderFromCart(Long userId, OrderCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Uživatel neexistuje."));

        if (!"USER".equalsIgnoreCase(user.getRole())) {
            throw new SecurityException("Objednávky jsou dostupné pouze pro roli USER.");
        }

        BillingInfo billing = resolveBillingInfo(user, request);
        String shippingMethod = resolveShippingMethod(request);

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Košík neexistuje."));

        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        if (items.isEmpty()) {
            throw new IllegalArgumentException("Košík je prázdný.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus("NEW");
        order.setTotal(BigDecimal.ZERO);
        order.setBillingFirstName(billing.firstName());
        order.setBillingLastName(billing.lastName());
        order.setBillingStreet(billing.street());
        order.setBillingCity(billing.city());
        order.setBillingPostalCode(billing.postalCode());
        order.setBillingEmail(billing.email());
        order.setBillingPhone(billing.phone());
        order.setShippingMethod(shippingMethod);
        order = orderRepository.save(order);

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : items) {
            Product product = item.getProduct();
            int requested = item.getQuantity();
            int stock = product.getStockQuantity() == null ? 0 : product.getStockQuantity();
            if (stock < requested) {
                throw new IllegalArgumentException("Nedostatečná zásoba pro produkt: " + product.getName());
            }

            product.setStockQuantity(stock - requested);
            productRepository.save(product);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setProduct(product);
            orderItem.setQuantity(requested);
            orderItem.setPriceAtOrder(item.getPriceAtAdd());
            BigDecimal lineTotal = item.getPriceAtAdd().multiply(BigDecimal.valueOf(requested));
            orderItem.setLineTotal(lineTotal);
            orderItemRepository.save(orderItem);
            order.getItems().add(orderItem);

            total = total.add(lineTotal);
        }

        order.setTotal(total);
        orderRepository.save(order);

        cartItemRepository.deleteAll(items);
        return buildResponse(order, order.getItems());
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getOrdersForUser(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Uživatel neexistuje."));

        List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return orders.stream().map(order -> buildResponse(order, order.getItems())).toList();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> getAllOrders(Long adminUserId) {
        ensureAdmin(adminUserId);
        List<Order> orders = orderRepository.findAllByOrderByCreatedAtDesc();
        return orders.stream().map(order -> buildResponse(order, order.getItems())).toList();
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long adminUserId, Long orderId, String status) {
        ensureAdmin(adminUserId);
        if (!StringUtils.hasText(status)) {
            throw new IllegalArgumentException("Stav objednávky nesmí být prázdný.");
        }

        String normalized = status.trim().toUpperCase();
        if (!isAllowedStatus(normalized)) {
            throw new IllegalArgumentException("Neplatný stav objednávky.");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Objednávka neexistuje."));
        order.setStatus(normalized);
        orderRepository.save(order);

        return buildResponse(order, order.getItems());
    }

    private void ensureAdmin(Long adminUserId) {
        User user = userRepository.findById(adminUserId)
                .orElseThrow(() -> new IllegalArgumentException("Uživatel neexistuje."));
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            throw new SecurityException("Akce je dostupná pouze pro roli ADMIN.");
        }
    }

    private boolean isAllowedStatus(String status) {
        return List.of("NEW", "PAID", "SHIPPED", "CANCELED").contains(status);
    }

    private OrderResponse buildResponse(Order order, List<OrderItem> items) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUser().getId());
        response.setStatus(order.getStatus());
        response.setTotal(order.getTotal());
        response.setCreatedAt(order.getCreatedAt());
        response.setBillingFirstName(order.getBillingFirstName());
        response.setBillingLastName(order.getBillingLastName());
        response.setBillingStreet(order.getBillingStreet());
        response.setBillingCity(order.getBillingCity());
        response.setBillingPostalCode(order.getBillingPostalCode());
        response.setBillingEmail(order.getBillingEmail());
        response.setBillingPhone(order.getBillingPhone());
        response.setShippingMethod(order.getShippingMethod());

        for (OrderItem item : items) {
            OrderItemResponse itemResponse = new OrderItemResponse();
            itemResponse.setId(item.getId());
            itemResponse.setProductId(item.getProduct().getId());
            itemResponse.setProductName(item.getProduct().getName());
            itemResponse.setQuantity(item.getQuantity());
            itemResponse.setPriceAtOrder(item.getPriceAtOrder());
            itemResponse.setLineTotal(item.getLineTotal());
            response.getItems().add(itemResponse);
        }

        return response;
    }

    private String resolveShippingMethod(OrderCreateRequest request) {
        if (request == null || !StringUtils.hasText(request.getShippingMethod())) {
            throw new IllegalArgumentException("Zvolte způsob dopravy.");
        }
        return request.getShippingMethod().trim();
    }

    private BillingInfo resolveBillingInfo(User user, OrderCreateRequest request) {
        boolean useProfile = request == null || request.getUseProfile() == null || request.getUseProfile();
        if (useProfile) {
            if (!StringUtils.hasText(user.getFirstName())
                    || !StringUtils.hasText(user.getLastName())
                    || !StringUtils.hasText(user.getStreet())
                    || !StringUtils.hasText(user.getCity())
                    || !StringUtils.hasText(user.getPostalCode())
                    || !StringUtils.hasText(user.getEmail())
                    || !StringUtils.hasText(user.getPhone())) {
                throw new IllegalArgumentException("Fakturační údaje nejsou kompletní. Aktualizujte profil.");
            }
            return new BillingInfo(user.getFirstName(), user.getLastName(), user.getStreet(), user.getCity(),
                    user.getPostalCode(), user.getEmail(), user.getPhone());
        }

        if (request == null
                || !StringUtils.hasText(request.getFirstName())
                || !StringUtils.hasText(request.getLastName())
                || !StringUtils.hasText(request.getStreet())
                || !StringUtils.hasText(request.getCity())
                || !StringUtils.hasText(request.getPostalCode())
                || !StringUtils.hasText(request.getEmail())
                || !StringUtils.hasText(request.getPhone())) {
            throw new IllegalArgumentException("Vyplňte všechny fakturační údaje.");
        }

        return new BillingInfo(request.getFirstName().trim(), request.getLastName().trim(),
                request.getStreet().trim(), request.getCity().trim(), request.getPostalCode().trim(),
                request.getEmail().trim(), request.getPhone().trim());
    }

    private record BillingInfo(String firstName, String lastName, String street, String city, String postalCode,
                               String email, String phone) {
    }
}
