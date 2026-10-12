        package com.banking.system.dto;

import com.banking.system.entity.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TransactionResponse {

    private Long id;
    private String accountNumber;
    private String customerName;
    private TransactionType transactionType;
    private BigDecimal amount;
    private BigDecimal balanceAfterTransaction;
    private LocalDateTime transactionDate;
    private String description;

    public TransactionResponse() {
    }

    public TransactionResponse(
            Long id,
            String accountNumber,
            String customerName,
            TransactionType transactionType,
            BigDecimal amount,
            BigDecimal balanceAfterTransaction,
            LocalDateTime transactionDate,
            String description) {

        this.id = id;
        this.accountNumber = accountNumber;
        this.customerName = customerName;
        this.transactionType = transactionType;
        this.amount = amount;
        this.balanceAfterTransaction =
                balanceAfterTransaction;
        this.transactionDate = transactionDate;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getBalanceAfterTransaction() {
        return balanceAfterTransaction;
    }

    public LocalDateTime getTransactionDate() {
        return transactionDate;
    }

    public String getDescription() {
        return description;
    }
}

