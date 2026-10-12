package com.banking.system.service;

import com.banking.system.dto.CardRequest;
import com.banking.system.entity.Card;
import com.banking.system.entity.CardApplication;
import com.banking.system.entity.CardStatus;
import com.banking.system.entity.CardType;
import com.banking.system.entity.CardVariant;
import com.banking.system.entity.IssuedCardStatus;
import com.banking.system.entity.Role;
import com.banking.system.entity.User;
import com.banking.system.repository.CardApplicationRepository;
import com.banking.system.repository.CardRepository;
import com.banking.system.repository.UserRepository;
import com.banking.system.security.SecurityUtil;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Random;

@Service
public class CardService {

    private final CardApplicationRepository cardApplicationRepository;
    private final CardRepository cardRepository;
    private final UserRepository userRepository;
    private final SecurityUtil securityUtil;
    private final NotificationService notificationService;

    public CardService(
            CardApplicationRepository cardApplicationRepository,
            CardRepository cardRepository,
            UserRepository userRepository,
            SecurityUtil securityUtil,
            NotificationService notificationService) {

        this.cardApplicationRepository = cardApplicationRepository;
        this.cardRepository = cardRepository;
        this.userRepository = userRepository;
        this.securityUtil = securityUtil;
        this.notificationService = notificationService;
    }

    public CardApplication applyCard(
            Long userId,
            CardRequest request) {

        User currentUser =
                securityUtil.getCurrentUser();

        if (!securityUtil.isAdmin()
                && !currentUser.getId().equals(userId)) {

            throw new IllegalArgumentException(
                    "You can apply for a card only for yourself"
            );
        }

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found: "
                                                + userId
                                )
                        );

        CardApplication card =
                new CardApplication();

        card.setUser(user);

        card.setCardType(
                request.getCardType()
        );

        card.setCardVariant(
                request.getCardVariant()
        );

        card.setStatus(
                CardStatus.PENDING
        );

        CardApplication savedCard =
                cardApplicationRepository.save(card);

        List<User> admins =
                userRepository.findAll()
                        .stream()
                        .filter(u -> u.getRole() == Role.ADMIN)
                        .toList();

        for (User admin : admins) {

            notificationService.createNotification(
                    admin,
                    user,
                    user.getName()
                            + " has submitted a new "
                            + request.getCardType()
                            + " card application.",
                    "CARD_APPLICATION_SUBMITTED"
            );
        }

        return savedCard;
    }

    public List<CardApplication> getUserCards(
            Long userId) {

        User currentUser =
                securityUtil.getCurrentUser();

        if (!securityUtil.isAdmin()
                && !currentUser.getId().equals(userId)) {

            throw new IllegalArgumentException(
                    "You can access only your own card applications"
            );
        }

        return cardApplicationRepository.findByUserId(userId);
    }

    public CardApplication getCardById(
            Long cardId) {

        CardApplication card =
                cardApplicationRepository.findById(cardId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Card application not found: "
                                                + cardId
                                )
                        );

        if (securityUtil.isAdmin()) {
            return card;
        }

        if (card.getUser() == null
                || !card.getUser()
                .getId()
                .equals(
                        securityUtil.getCurrentUserId()
                )) {

            throw new IllegalArgumentException(
                    "You can access only your own card application"
            );
        }

        return card;
    }

    public List<CardApplication> getPendingCards() {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can view pending card applications"
            );
        }

        return cardApplicationRepository
                .findByStatus(CardStatus.PENDING);
    }

    public CardApplication updateCardStatus(
            Long cardId,
            CardStatus status) {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can update card status"
            );
        }

        CardApplication card =
                cardApplicationRepository.findById(cardId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Card application not found: "
                                                + cardId
                                )
                        );

        card.setStatus(status);

        CardApplication savedCard =
                cardApplicationRepository.save(card);

        User admin =
                securityUtil.getCurrentUser();

        User user =
                card.getUser();

        String message;

        if (status == CardStatus.APPROVED) {

            message =
                    "Your "
                            + card.getCardType()
                            + " card application has been approved by Admin.";

        } else if (status == CardStatus.REJECTED) {

            message =
                    "Your "
                            + card.getCardType()
                            + " card application has been rejected by Admin.";

        } else {

            message =
                    "Your "
                            + card.getCardType()
                            + " card application status has been updated to "
                            + status
                            + ".";
        }

        notificationService.createNotification(
                user,
                admin,
                message,
                "CARD_STATUS_UPDATED"
        );

        return savedCard;
    }

    public Card generateCard(
            Long applicationId) {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can generate cards"
            );
        }

        CardApplication application =
                cardApplicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Card application not found: "
                                                + applicationId
                                )
                        );

        if (application.getStatus()
                != CardStatus.APPROVED) {

            throw new IllegalArgumentException(
                    "Card can be generated only for APPROVED application"
            );
        }

        if (cardRepository
                .existsByCardApplicationId(applicationId)) {

            throw new IllegalArgumentException(
                    "Card already generated for this application"
            );
        }

        Card card = new Card();

        card.setCardNumber(
                generateCardNumber()
        );

        card.setCvv(
                generateCVV()
        );

        card.setExpiryDate(
                LocalDate.now().plusYears(4)
        );

        try {

            card.setCardType(
                    CardType.valueOf(
                            application.getCardType()
                                    .toUpperCase()
                    )
            );

            card.setCardVariant(
                    CardVariant.valueOf(
                            application.getCardVariant()
                                    .toUpperCase()
                    )
            );

        } catch (IllegalArgumentException e) {

            throw new IllegalArgumentException(
                    "Invalid card type or card variant"
            );
        }

        card.setStatus(
                IssuedCardStatus.ACTIVE
        );

        card.setUser(
                application.getUser()
        );

        card.setCardApplication(
                application
        );

        Card savedCard =
                cardRepository.save(card);

        User admin =
                securityUtil.getCurrentUser();

        User user =
                application.getUser();

        notificationService.createNotification(
                user,
                admin,
                "Your "
                        + application.getCardType()
                        + " card has been generated successfully by Admin.",
                "CARD_GENERATED"
        );

        return savedCard;
    }

    private String generateCardNumber() {

        Random random = new Random();

        StringBuilder cardNumber =
                new StringBuilder();

        for (int i = 0; i < 16; i++) {

            cardNumber.append(
                    random.nextInt(10)
            );
        }

        return cardNumber.toString();
    }

    private String generateCVV() {

        Random random = new Random();

        int cvv =
                100 + random.nextInt(900);

        return String.valueOf(cvv);
    }

    public List<Card> getAllIssuedCards() {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can view all issued cards"
            );
        }

        return cardRepository.findAll();
    }

    public Card getIssuedCardById(
            Long cardId) {

        Card card =
                cardRepository.findById(cardId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Issued card not found: "
                                                + cardId
                                )
                        );

        if (securityUtil.isAdmin()) {
            return card;
        }

        if (card.getUser() == null
                || !card.getUser()
                .getId()
                .equals(
                        securityUtil.getCurrentUserId()
                )) {

            throw new IllegalArgumentException(
                    "You can access only your own card"
            );
        }

        return card;
    }

    public Card getIssuedCardByApplicationId(
            Long applicationId) {

        Card card =
                cardRepository
                        .findByCardApplicationId(applicationId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Issued card not found for application: "
                                                + applicationId
                                )
                        );

        if (securityUtil.isAdmin()) {
            return card;
        }

        if (card.getUser() == null
                || !card.getUser()
                .getId()
                .equals(
                        securityUtil.getCurrentUserId()
                )) {

            throw new IllegalArgumentException(
                    "You can access only your own card"
            );
        }

        return card;
    }

    public Card blockCard(
            Long cardId) {

        Card card =
                cardRepository.findById(cardId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Issued card not found: "
                                                + cardId
                                )
                        );

        if (!securityUtil.isAdmin()
                && (card.getUser() == null
                || !card.getUser()
                .getId()
                .equals(
                        securityUtil.getCurrentUserId()
                ))) {

            throw new IllegalArgumentException(
                    "You can block only your own card"
            );
        }

        if (card.getStatus()
                == IssuedCardStatus.EXPIRED) {

            throw new IllegalArgumentException(
                    "Expired card cannot be blocked"
            );
        }

        card.setStatus(
                IssuedCardStatus.BLOCKED
        );

        Card savedCard =
                cardRepository.save(card);

        User currentUser =
                securityUtil.getCurrentUser();

        User cardOwner =
                card.getUser();

        if (securityUtil.isAdmin()) {

            notificationService.createNotification(
                    cardOwner,
                    currentUser,
                    "Your card has been blocked by Admin.",
                    "CARD_BLOCKED"
            );

        } else {

            List<User> admins =
                    userRepository.findAll()
                            .stream()
                            .filter(u -> u.getRole() == Role.ADMIN)
                            .toList();

            for (User admin : admins) {

                notificationService.createNotification(
                        admin,
                        currentUser,
                        currentUser.getName()
                                + " has blocked their card.",
                        "CARD_BLOCKED"
                );
            }
        }

        return savedCard;
    }

    public void requestCardUnblock(
            Long cardId,
            String email,
            String message) {

        Card card =
                cardRepository.findById(cardId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Issued card not found: "
                                                + cardId
                                )
                        );

        User currentUser =
                securityUtil.getCurrentUser();

        if (card.getUser() == null
                || !card.getUser()
                .getId()
                .equals(currentUser.getId())) {

            throw new IllegalArgumentException(
                    "You can request unblock only for your own card"
            );
        }

        if (card.getStatus()
                != IssuedCardStatus.BLOCKED) {

            throw new IllegalArgumentException(
                    "Only blocked card can be requested for unblock"
            );
        }

        if (email == null
                || email.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Email is required"
            );
        }

        if (message == null
                || message.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Unblock request message is required"
            );
        }

        List<User> admins =
                userRepository.findAll()
                        .stream()
                        .filter(u -> u.getRole() == Role.ADMIN)
                        .toList();

        for (User admin : admins) {

            notificationService.createNotification(
                    admin,
                    currentUser,
                    currentUser.getName()
                            + " requested to unblock their card."
                            + " Email: "
                            + email.trim()
                            + ". Message: "
                            + message.trim(),
                    "CARD_UNBLOCK_REQUEST"
            );
        }
    }

    public Card unblockCard(
            Long cardId) {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can unblock card"
            );
        }

        Card card =
                cardRepository.findById(cardId)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Issued card not found: "
                                                + cardId
                                )
                        );

        if (card.getStatus()
                == IssuedCardStatus.EXPIRED) {

            throw new IllegalArgumentException(
                    "Expired card cannot be unblocked"
            );
        }

        card.setStatus(
                IssuedCardStatus.ACTIVE
        );

        Card savedCard =
                cardRepository.save(card);

        User admin =
                securityUtil.getCurrentUser();

        User user =
                card.getUser();

        notificationService.createNotification(
                user,
                admin,
                "Your card has been unblocked by Admin.",
                "CARD_UNBLOCKED"
        );

        return savedCard;
    }

    public List<CardApplication> getAllCardApplications() {

        if (!securityUtil.isAdmin()) {

            throw new IllegalArgumentException(
                    "Only ADMIN can view all card applications"
            );
        }

        return cardApplicationRepository.findAll();
    }
}