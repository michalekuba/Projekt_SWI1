package com.osu.michja56.backend.service;

import com.osu.michja56.backend.model.Product;
import com.osu.michja56.backend.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class    ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Optional<Product> updateStock(Long id, int stockQuantity) {
        return productRepository.findById(id).map(product -> {
            product.setStockQuantity(stockQuantity);
            return productRepository.save(product);
        });
    }
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    public Optional<Product> updateProduct(Long id, Product update) {
        return productRepository.findById(id).map(product -> {
            product.setName(update.getName());
            product.setDescription(update.getDescription());
            product.setPrice(update.getPrice());
            product.setStockQuantity(update.getStockQuantity());
            product.setImageUrl(update.getImageUrl());
            return productRepository.save(product);
        });
    }
}