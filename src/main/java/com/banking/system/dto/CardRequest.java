package com.banking.system.dto;

import jakarta.validation.constraints.NotBlank;

public class CardRequest {

    @NotBlank(message = "Card type is required")
    private String cardType;

    @NotBlank(message = "Card variant is required")
    private String cardVariant;

    public CardRequest() {
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public String getCardVariant() {
        return cardVariant;
    }

    public void setCardVariant(String cardVariant) {
        this.cardVariant = cardVariant;
    }
}