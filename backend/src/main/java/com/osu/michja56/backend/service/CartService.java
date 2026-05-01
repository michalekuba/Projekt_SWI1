package com.osu.michja56.backend.service;

import com.osu.michja56.backend.dto.CartItemResponse;
import com.osu.michja56.backend.dto.CartResponse;
import com.osu.michja56.backend.model.Cart;
import com.osu.michja56.backend.model.CartItem;
import com.osu.michja56.backend.model.Product;
import com.osu.michja56.backend.model.User;
import com.osu.michja56.backend.repository.CartItemRepository;
import com.osu.michja56.backend.repository.CartRepository;
import com.osu.michja56.backend.repository.ProductRepository;
import com.osu.michja56.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository,
                       CartItemRepository cartItemRepository,
                       ProductRepository productRepository,
                       UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public CartResponse getCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return buildResponse(cart);
    }

    @Transactional
    public CartResponse addItem(Long userId, Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Mnozstvi musi byt kladne.");
        }

        Cart cart = getOrCreateCart(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Produkt neexistuje."));

        CartItem item = cartItemRepository.findByCartIdAndProductId(cart.getId(), productId)
                .orElse(null);

        int existingQty = item != null ? item.getQuantity() : 0;
        int newQty = existingQty + quantity;
        ensureStockAvailable(product, newQty);

        if (item == null) {
            item = new CartItem();
            item.setCart(cart);
            item.setProduct(product);
            item.setPriceAtAdd(product.getPrice());
        }

        item.setQuantity(newQty);
        cartItemRepository.save(item);

        return buildResponse(cart);
    }

    @Transactional
    public CartResponse updateItemQuantity(Long userId, Long itemId, int quantity) {
        if (quantity < 0) {
            throw new IllegalArgumentException("Mnozstvi nesmi byt zaporne.");
        }

        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new IllegalArgumentException("Polozka v kosiku neexistuje."));

        if (quantity == 0) {
            cartItemRepository.delete(item);
            return buildResponse(cart);
        }

        ensureStockAvailable(item.getProduct(), quantity);
        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return buildResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {
        Cart cart = getOrCreateCart(userId);
        CartItem item = cartItemRepository.findByIdAndCartId(itemId, cart.getId())
                .orElseThrow(() -> new IllegalArgumentException("Polozka v kosiku neexistuje."));
        cartItemRepository.delete(item);
        return buildResponse(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Uzivatel neexistuje."));

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    return cartRepository.save(cart);
                });
    }

    private void ensureStockAvailable(Product product, int requested) {
        Integer stock = product.getStockQuantity();
        if (stock != null && stock < requested) {
            throw new IllegalArgumentException("Nedostatecna zasoba na sklade.");
        }
    }

    private CartResponse buildResponse(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

        CartResponse response = new CartResponse();
        response.setId(cart.getId());
        response.setUserId(cart.getUser().getId());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : items) {
            CartItemResponse itemResponse = new CartItemResponse();
            itemResponse.setId(item.getId());
            itemResponse.setProductId(item.getProduct().getId());
            itemResponse.setProductName(item.getProduct().getName());
            itemResponse.setPrice(item.getPriceAtAdd());
            itemResponse.setQuantity(item.getQuantity());

            BigDecimal lineTotal = item.getPriceAtAdd()
                    .multiply(BigDecimal.valueOf(item.getQuantity()));
            itemResponse.setLineTotal(lineTotal);
            response.getItems().add(itemResponse);

            total = total.add(lineTotal);
        }

        response.setTotal(total);
        return response;
    }
}

