package com.osu.michja56.backend.service;

import com.osu.michja56.backend.dto.OrderCreateRequest;
import com.osu.michja56.backend.model.Cart;
import com.osu.michja56.backend.model.CartItem;
import com.osu.michja56.backend.model.Product;
import com.osu.michja56.backend.model.User;
import com.osu.michja56.backend.repository.CartItemRepository;
import com.osu.michja56.backend.repository.CartRepository;
import com.osu.michja56.backend.repository.ProductRepository;
import com.osu.michja56.backend.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@Transactional
class OrderServiceTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Test
    void createsOrderFromCartAndClearsCart() {
        User user = new User();
        user.setUsername("order_test_user");
        user.setPassword("test");
        user.setEmail("order_test_user@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setStreet("Testovací 1");
        user.setCity("Olomouc");
        user.setPostalCode("77900");
        user.setPhone("+420777000333");
        user.setRole("USER");
        user = userRepository.save(user);

        Product product = new Product();
        product.setName("Test produkt");
        product.setPrice(new BigDecimal("199.00"));
        product.setStockQuantity(5);
        product = productRepository.save(product);

        Cart cart = new Cart();
        cart.setUser(user);
        cart = cartRepository.save(cart);

        CartItem item = new CartItem();
        item.setCart(cart);
        item.setProduct(product);
        item.setQuantity(2);
        item.setPriceAtAdd(product.getPrice());
        cartItemRepository.save(item);

        OrderCreateRequest request = new OrderCreateRequest();
        request.setUseProfile(true);
        request.setShippingMethod("ZASILKOVNA");

        var orderResponse = orderService.createOrderFromCart(user.getId(), request);

        assertEquals(new BigDecimal("398.00"), orderResponse.getTotal());
        assertEquals(1, orderResponse.getItems().size());
        assertTrue(cartItemRepository.findByCartId(cart.getId()).isEmpty());

        Product updated = productRepository.findById(product.getId()).orElseThrow();
        assertEquals(3, updated.getStockQuantity());
    }
}
