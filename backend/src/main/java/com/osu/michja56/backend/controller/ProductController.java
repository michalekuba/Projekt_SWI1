package com.osu.michja56.backend.controller;

import com.osu.michja56.backend.dto.StockUpdateRequest;
import com.osu.michja56.backend.dto.ProductUpdateRequest;
import com.osu.michja56.backend.model.Product;
import com.osu.michja56.backend.service.ProductService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody ProductUpdateRequest request) {
        if (request == null
                || request.getName() == null || request.getName().isBlank()
                || request.getPrice() == null
                || request.getStockQuantity() == null || request.getStockQuantity() < 0) {
            return ResponseEntity.badRequest().body("Neplatná data produktu.");
        }

        Product update = new Product();
        update.setName(request.getName());
        update.setDescription(request.getDescription());
        update.setPrice(request.getPrice());
        update.setStockQuantity(request.getStockQuantity());
        update.setImageUrl(request.getImageUrl());

        return productService.updateProduct(id, update)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable Long id, @RequestBody StockUpdateRequest request) {
        if (request == null || request.getStockQuantity() == null || request.getStockQuantity() < 0) {
            return ResponseEntity.badRequest().body("Neplatné množství skladem.");
        }

        return productService.updateStock(id, request.getStockQuantity())
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}