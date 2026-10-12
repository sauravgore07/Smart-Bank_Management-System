package com.banking.system.controller;

import com.banking.system.dto.CardRequest;
import com.banking.system.entity.Card;
import com.banking.system.entity.CardApplication;
import com.banking.system.entity.CardStatus;
import com.banking.system.service.CardService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cards")
public class CardController {

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    @PostMapping("/apply/{userId}")
    public ResponseEntity<CardApplication> applyCard(
            @PathVariable Long userId,
            @Valid @RequestBody CardRequest request) {

        CardApplication card =
                cardService.applyCard(userId, request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(card);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<CardApplication>> getUserCards(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                cardService.getUserCards(userId)
        );
    }

    @GetMapping("/{cardId}")
    public ResponseEntity<CardApplication> getCardById(
            @PathVariable Long cardId) {

        return ResponseEntity.ok(
                cardService.getCardById(cardId)
        );
    }

    @GetMapping("/pending")
    public ResponseEntity<List<CardApplication>> getPendingCards() {

        return ResponseEntity.ok(
                cardService.getPendingCards()
        );
    }

    @PutMapping("/{cardId}/status")
    public ResponseEntity<CardApplication> updateCardStatus(
            @PathVariable Long cardId,
            @RequestParam CardStatus status) {

        return ResponseEntity.ok(
                cardService.updateCardStatus(
                        cardId,
                        status
                )
        );
    }

    @PostMapping("/generate/{applicationId}")
    public ResponseEntity<Card> generateCard(
            @PathVariable Long applicationId) {

        Card card =
                cardService.generateCard(applicationId);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(card);
    }

    @GetMapping("/issued")
    public ResponseEntity<List<Card>> getAllIssuedCards() {

        return ResponseEntity.ok(
                cardService.getAllIssuedCards()
        );
    }

    @GetMapping("/issued/{cardId}")
    public ResponseEntity<Card> getIssuedCardById(
            @PathVariable Long cardId) {

        return ResponseEntity.ok(
                cardService.getIssuedCardById(cardId)
        );
    }

    @GetMapping("/issued/application/{applicationId}")
    public ResponseEntity<Card> getIssuedCardByApplicationId(
            @PathVariable Long applicationId) {

        return ResponseEntity.ok(
                cardService.getIssuedCardByApplicationId(
                        applicationId
                )
        );
    }

    @PutMapping("/issued/{cardId}/block")
    public ResponseEntity<Card> blockCard(
            @PathVariable Long cardId) {

        return ResponseEntity.ok(
                cardService.blockCard(cardId)
        );
    }

    @PutMapping("/issued/{cardId}/unblock")
    public ResponseEntity<Card> unblockCard(
            @PathVariable Long cardId) {

        return ResponseEntity.ok(
                cardService.unblockCard(cardId)
        );
    }

    @PostMapping("/issued/{cardId}/unblock-request")
    public ResponseEntity<String> requestCardUnblock(
            @PathVariable Long cardId,
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String message = request.get("message");

        cardService.requestCardUnblock(
                cardId,
                email,
                message
        );

        return ResponseEntity.ok(
                "Card unblock request sent to Admin successfully"
        );
    }

    @GetMapping("/all")
    public ResponseEntity<List<CardApplication>> getAllCardApplications() {

        return ResponseEntity.ok(
                cardService.getAllCardApplications()
        );
    }
}