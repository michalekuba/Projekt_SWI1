package com.osu.michja56.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    private String firstName;

    private String lastName;

    @Column(nullable = false)
    private String street;

    @Column(nullable = false)
    private String city;

    @Column(nullable = false)
    private String postalCode;

    @Column(name = "address", nullable = false)
    private String legacyAddress;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String role;

    @PrePersist
    @PreUpdate
    private void syncLegacyAddress() {
        if (legacyAddress == null || legacyAddress.isBlank()) {
            String streetValue = street == null ? "" : street.trim();
            String cityValue = city == null ? "" : city.trim();
            String postalValue = postalCode == null ? "" : postalCode.trim();
            legacyAddress = String.format("%s, %s %s", streetValue, cityValue, postalValue).trim();
        }
    }
}