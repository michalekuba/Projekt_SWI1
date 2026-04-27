package com.osu.michja56.backend.config;

import com.osu.michja56.backend.model.Product;
import com.osu.michja56.backend.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.util.List;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(ProductRepository repository) {
        return args -> {
            if (repository.count() == 0) {
                Product p1 = new Product();
                p1.setName("Herní notebook");
                p1.setDescription("Výkonný notebook pro práci i zábavu.");
                p1.setPrice(new BigDecimal("25000.00"));
                p1.setImageUrl("https://placehold.co/400x400?text=Notebook");

                Product p2 = new Product();
                p2.setName("Mechanická klávesnice");
                p2.setDescription("RGB podsvícení a tiché spínače.");
                p2.setPrice(new BigDecimal("1800.00"));
                p2.setImageUrl("https://placehold.co/400x400?text=Klavesnice");

                Product p3 = new Product();
                p3.setName("Bezdrátová myš");
                p3.setDescription("Ergonomický design a dlouhá výdrž.");
                p3.setPrice(new BigDecimal("950.00"));
                p3.setImageUrl("https://placehold.co/400x400?text=Mys");

                repository.saveAll(List.of(p1, p2, p3));
                System.out.println(">> Databáze byla úspěšně naplněna ukázkovými produkty.");
            } else {
                System.out.println(">> Produkty již v databázi existují, přeskakuji inicializaci.");
            }
        };
    }
}