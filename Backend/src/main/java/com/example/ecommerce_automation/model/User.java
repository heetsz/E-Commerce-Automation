package com.example.ecommerce_automation.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    private String pictureUrl;

    @Column(nullable = false)
    private String provider; // "google"

    @Column(nullable = false)
    private String providerId; // Google sub ID

    public User(String name, String email, String pictureUrl, String provider, String providerId) {
        this.name = name;
        this.email = email;
        this.pictureUrl = pictureUrl;
        this.provider = provider;
        this.providerId = providerId;
    }
}
