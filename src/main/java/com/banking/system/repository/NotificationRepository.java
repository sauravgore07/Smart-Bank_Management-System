package com.banking.system.repository;

import com.banking.system.entity.Notification;
import com.banking.system.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);

    List<Notification> findByRecipientAndReadFalseOrderByCreatedAtDesc(User recipient);

    long countByRecipientAndReadFalse(User recipient);
}

