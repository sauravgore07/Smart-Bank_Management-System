package com.banking.system.entity;

import com.banking.system.entity.*;
import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String cardNumber;

    @Column(nullable = false)
    private String cvv;

    @Column(nullable = false)
    private LocalDate expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardType cardType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardVariant cardVariant;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IssuedCardStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Application from which this card was generated
    @OneToOne
    @JoinColumn(
            name = "application_id",
            unique = true,
            nullable = false
    )
    private CardApplication cardApplication;

    // Constructor
    public Card() {
    }

    // ID
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    // Card Number
    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    // CVV
    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    // Expiry Date
    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    // Card Type
    public CardType getCardType() {
        return cardType;
    }

    public void setCardType(CardType cardType) {
        this.cardType = cardType;
    }

    // Card Variant
    public CardVariant getCardVariant() {
        return cardVariant;
    }

    public void setCardVariant(CardVariant cardVariant) {
        this.cardVariant = cardVariant;
    }

    // Status
    public IssuedCardStatus getStatus() {
        return status;
    }

    public void setStatus(IssuedCardStatus status) {
        this.status = status;
    }

    // User
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Card Application
    public CardApplication getCardApplication() {
        return cardApplication;
    }

    public void setCardApplication(CardApplication cardApplication) {
        this.cardApplication = cardApplication;
    }
}