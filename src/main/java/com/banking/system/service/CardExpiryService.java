package com.banking.system.service;

import com.banking.system.entity.Card;
import com.banking.system.entity.IssuedCardStatus;
import com.banking.system.repository.CardRepository;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CardExpiryService {

    private final CardRepository cardRepository;

    public CardExpiryService(CardRepository cardRepository) {
        this.cardRepository = cardRepository;
    }

    // Runs every day at midnight
    @Scheduled(cron = "0 0 0 * * *")
    public void checkExpiredCards() {

        List<Card> cards = cardRepository.findAll();

        LocalDate today = LocalDate.now();

        for (Card card : cards) {

            if (card.getExpiryDate() != null
                    && card.getExpiryDate().isBefore(today)
                    && card.getStatus() != IssuedCardStatus.EXPIRED) {

                card.setStatus(IssuedCardStatus.EXPIRED);

                cardRepository.save(card);
            }
        }
    }
}