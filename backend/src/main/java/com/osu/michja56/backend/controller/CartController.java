package com.osu.michja56.backend.controller;

import com.osu.michja56.backend.dto.AddToCartRequest;
import com.osu.michja56.backend.dto.CartResponse;
import com.osu.michja56.backend.dto.UpdateCartItemRequest;
import com.osu.michja56.backend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getCart(@PathVariable Long userId) {
        try {
            CartResponse response = cartService.getCart(userId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/{userId}/items")
    public ResponseEntity<?> addItem(@PathVariable Long userId, @RequestBody AddToCartRequest request) {
        if (request == null || request.getProductId() == null || request.getQuantity() == null) {
            return ResponseEntity.badRequest().body("Neplatna data kosiku.");
        }

        try {
            CartResponse response = cartService.addItem(userId, request.getProductId(), request.getQuantity());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PatchMapping("/{userId}/items/{itemId}")
    public ResponseEntity<?> updateItem(@PathVariable Long userId,
                                        @PathVariable Long itemId,
                                        @RequestBody UpdateCartItemRequest request) {
        if (request == null || request.getQuantity() == null) {
            return ResponseEntity.badRequest().body("Neplatne mnozstvi.");
        }

        try {
            CartResponse response = cartService.updateItemQuantity(userId, itemId, request.getQuantity());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{userId}/items/{itemId}")
    public ResponseEntity<?> removeItem(@PathVariable Long userId, @PathVariable Long itemId) {
        try {
            CartResponse response = cartService.removeItem(userId, itemId);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}

