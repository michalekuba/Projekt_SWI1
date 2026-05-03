package com.osu.michja56.backend.controller;

import com.osu.michja56.backend.dto.OrderResponse;
import com.osu.michja56.backend.dto.OrderStatusUpdateRequest;
import com.osu.michja56.backend.dto.OrderCreateRequest;
import com.osu.michja56.backend.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/{userId}/from-cart")
    public ResponseEntity<?> createOrderFromCart(@PathVariable Long userId, @RequestBody(required = false) OrderCreateRequest request) {
        try {
            OrderResponse response = orderService.createOrderFromCart(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getOrders(@PathVariable Long userId) {
        try {
            List<OrderResponse> orders = orderService.getOrdersForUser(userId);
            return ResponseEntity.ok(orders);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/admin/{adminUserId}")
    public ResponseEntity<?> getAllOrders(@PathVariable Long adminUserId) {
        try {
            List<OrderResponse> orders = orderService.getAllOrders(adminUserId);
            return ResponseEntity.ok(orders);
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PatchMapping("/admin/{adminUserId}/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long adminUserId,
                                               @PathVariable Long orderId,
                                               @RequestBody OrderStatusUpdateRequest request) {
        if (request == null || request.getStatus() == null) {
            return ResponseEntity.badRequest().body("Stav objednávky je povinný.");
        }

        try {
            OrderResponse response = orderService.updateOrderStatus(adminUserId, orderId, request.getStatus());
            return ResponseEntity.ok(response);
        } catch (SecurityException ex) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
