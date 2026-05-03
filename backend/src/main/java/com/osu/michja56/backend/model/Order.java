package com.osu.michja56.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private List<OrderItem> items = new ArrayList<>();

    @Column(nullable = false)
    private BigDecimal total;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String billingFirstName;

    @Column(nullable = false)
    private String billingLastName;

    @Column(nullable = false)
    private String billingStreet;

    @Column(nullable = false)
    private String billingCity;

    @Column(nullable = false)
    private String billingPostalCode;

    @Column(name = "billing_address", nullable = false)
    private String legacyBillingAddress;

    @Column(nullable = false)
    private String billingEmail;

    @Column(nullable = false)
    private String billingPhone;

    @Column(nullable = false)
    private String shippingMethod;

    private LocalDateTime createdAt = LocalDateTime.now();

    @PrePersist
    @PreUpdate
    private void syncLegacyBillingAddress() {
        if (legacyBillingAddress == null || legacyBillingAddress.isBlank()) {
            String streetValue = billingStreet == null ? "" : billingStreet.trim();
            String cityValue = billingCity == null ? "" : billingCity.trim();
            String postalValue = billingPostalCode == null ? "" : billingPostalCode.trim();
            legacyBillingAddress = String.format("%s, %s %s", streetValue, cityValue, postalValue).trim();
        }
    }
}
