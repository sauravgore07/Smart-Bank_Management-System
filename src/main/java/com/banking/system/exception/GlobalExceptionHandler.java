package com.banking.system.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==========================================
    // ACCOUNT NOT FOUND
    // ==========================================

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<?> handleAccountNotFound(
            AccountNotFoundException ex) {

        return createResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage()
        );
    }

    // ==========================================
    // INSUFFICIENT BALANCE
    // ==========================================

    @ExceptionHandler(InsufficientBalanceException.class)
    public ResponseEntity<?> handleInsufficientBalance(
            InsufficientBalanceException ex) {

        return createResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    // ==========================================
    // VALIDATION ERROR
    // ==========================================

    @ExceptionHandler(
            MethodArgumentNotValidException.class
    )
    public ResponseEntity<?> handleValidation(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors =
                new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return ResponseEntity
                .badRequest()
                .body(errors);
    }

    // ==========================================
    // ILLEGAL ARGUMENT
    // Card module errors will come here
    // ==========================================

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> handleIllegalArgument(
            IllegalArgumentException ex) {

        return createResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage()
        );
    }

    // ==========================================
    // GENERAL EXCEPTION
    // ==========================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGeneral(
            Exception ex) {

        return createResponse(
                HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getMessage()
        );
    }

    // ==========================================
    // COMMON RESPONSE
    // ==========================================

    private ResponseEntity<Map<String, Object>>
    createResponse(
            HttpStatus status,
            String message) {

        Map<String, Object> response =
                new HashMap<>();

        response.put(
                "timestamp",
                LocalDateTime.now()
        );

        response.put(
                "status",
                status.value()
        );

        response.put(
                "message",
                message
        );

        return ResponseEntity
                .status(status)
                .body(response);
    }
}
