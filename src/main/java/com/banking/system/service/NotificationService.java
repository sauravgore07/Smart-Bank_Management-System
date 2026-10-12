package com.banking.system.service;

import com.banking.system.entity.Notification;
import com.banking.system.entity.User;
import com.banking.system.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(
            NotificationRepository notificationRepository
    ) {
        this.notificationRepository = notificationRepository;
    }

    public Notification createNotification(
            User recipient,
            User sender,
            String message,
            String type
    ) {

        Notification notification = new Notification();

        notification.setRecipient(recipient);
        notification.setSender(sender);
        notification.setMessage(message);
        notification.setType(type);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());

        return notificationRepository.save(notification);
    }

    public List<Notification> getNotifications(User user) {

        return notificationRepository
                .findByRecipientOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotifications(User user) {

        return notificationRepository
                .findByRecipientAndReadFalseOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {

        return notificationRepository
                .countByRecipientAndReadFalse(user);
    }

    public void markAsReadForUser(
            Long notificationId,
            User user
    ) {

        Notification notification =
                notificationRepository.findById(notificationId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Notification not found"
                                )
                        );

        if (notification.getRecipient() == null
                || !notification.getRecipient()
                .getId()
                .equals(user.getId())) {

            throw new RuntimeException(
                    "You are not allowed to update this notification"
            );
        }

        notification.setRead(true);

        notificationRepository.save(notification);
    }

    public void markAllAsRead(User user) {

        List<Notification> notifications =
                notificationRepository
                        .findByRecipientOrderByCreatedAtDesc(user);

        for (Notification notification : notifications) {
            notification.setRead(true);
        }

        notificationRepository.saveAll(notifications);
    }
}
