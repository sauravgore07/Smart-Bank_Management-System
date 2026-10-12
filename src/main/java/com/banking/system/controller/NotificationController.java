package com.banking.system.controller;

import com.banking.system.entity.Notification;
import com.banking.system.entity.User;
import com.banking.system.security.SecurityUtil;
import com.banking.system.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationService notificationService;
    private final SecurityUtil securityUtil;

    public NotificationController(
            NotificationService notificationService,
            SecurityUtil securityUtil
    ) {
        this.notificationService = notificationService;
        this.securityUtil = securityUtil;
    }

    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications() {

        User user = securityUtil.getCurrentUser();

        return ResponseEntity.ok(
                notificationService.getNotifications(user)
        );
    }

    @GetMapping("/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications() {

        User user = securityUtil.getCurrentUser();

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(user)
        );
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {

        User user = securityUtil.getCurrentUser();

        return ResponseEntity.ok(
                notificationService.getUnreadCount(user)
        );
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<String> markAsRead(
            @PathVariable Long id
    ) {

        User user = securityUtil.getCurrentUser();

        notificationService.markAsReadForUser(id, user);

        return ResponseEntity.ok(
                "Notification marked as read"
        );
    }

    @PutMapping("/read-all")
    public ResponseEntity<String> markAllAsRead() {

        User user = securityUtil.getCurrentUser();

        notificationService.markAllAsRead(user);

        return ResponseEntity.ok(
                "All notifications marked as read"
        );
    }
}
