package com.osu.michja56.backend.config;

import com.osu.michja56.backend.model.Product;
import com.osu.michja56.backend.model.User; // Nový import
import com.osu.michja56.backend.repository.ProductRepository;
import com.osu.michja56.backend.repository.UserRepository; // Nový import
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductRepository productRepo, UserRepository userRepo) {
        return args -> {
            // --- INICIALIZACE PRODUKTŮ ---
            if (productRepo.count() == 0) {
                Product p1 = new Product();
                p1.setName("Herní Notebook");
                p1.setPrice(new BigDecimal("25000.00"));
                p1.setImageUrl("https://placehold.co/400x400?text=Notebook");

                Product p2 = new Product();
                p2.setName("Mechanická klávesnice");
                p2.setPrice(new BigDecimal("1800.00"));
                p2.setImageUrl("https://placehold.co/400x400?text=Klavesnice");

                productRepo.saveAll(List.of(p1, p2));
                System.out.println(">> Produkty vloženy.");
            }

            // --- INICIALIZACE UŽIVATELŮ ---
            if (userRepo.count() == 0) {
                BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
                // Admin
                User admin = new User();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setEmail("admin@eshop.cz");
                admin.setRole("ADMIN");
                userRepo.save(admin);

                // Běžný uživatel
                User user = new User();
                user.setUsername("pepa");
                user.setPassword(passwordEncoder.encode("pepa123"));
                user.setEmail("pepa@email.cz");
                user.setRole("USER");
                userRepo.save(user);

                System.out.println(">> Testovací uživatelé vytvořeni (admin/admin123, pepa/pepa123).");
            }
        };
    }
}