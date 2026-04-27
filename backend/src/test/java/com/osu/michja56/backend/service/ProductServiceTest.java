package com.osu.michja56.backend.service;

import com.osu.michja56.backend.model.Product;
import com.osu.michja56.backend.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProductServiceTest {

    @Mock
    private ProductRepository productRepository; // Simulujeme databázi

    @InjectMocks
    private ProductService productService; // Testovaná služba

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllProducts() {
        // Příprava dat (Arrange)
        Product p = new Product();
        p.setName("Test Product");
        when(productRepository.findAll()).thenReturn(List.of(p));

        // Akce (Act)
        List<Product> products = productService.getAllProducts();

        // Ověření (Assert)
        assertEquals(1, products.size());
        assertEquals("Test Product", products.get(0).getName());
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void testGetProductById() {
        // Příprava (Arrange)
        Product p = new Product();
        p.setId(1L);
        p.setName("Mobil");
        when(productRepository.findById(1L)).thenReturn(Optional.of(p));

        // Akce (Act)
        Optional<Product> found = productService.getProductById(1L);

        // Ověření (Assert)
        assertTrue(found.isPresent());
        assertEquals("Mobil", found.get().getName());
    }

    @Test
    void testCreateProduct() {
        // Příprava (Arrange)
        Product p = new Product();
        p.setName("Novinka");
        p.setPrice(new BigDecimal("100"));
        when(productRepository.save(any(Product.class))).thenReturn(p);

        // Akce (Act)
        Product saved = productService.createProduct(p);

        // Ověření (Assert)
        assertNotNull(saved);
        assertEquals("Novinka", saved.getName());
    }
}