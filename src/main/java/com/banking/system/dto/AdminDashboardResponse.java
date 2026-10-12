package com.banking.system.dto;

import java.math.BigDecimal;

public class AdminDashboardResponse {

    private long totalUsers;
    private long totalAccounts;
    private BigDecimal totalBalance;

    private long pendingKyc;
    private long pendingLoans;
    private long pendingCards;

    public AdminDashboardResponse() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalAccounts() {
        return totalAccounts;
    }

    public void setTotalAccounts(long totalAccounts) {
        this.totalAccounts = totalAccounts;
    }

    public BigDecimal getTotalBalance() {
        return totalBalance;
    }

    public void setTotalBalance(BigDecimal totalBalance) {
        this.totalBalance = totalBalance;
    }

    public long getPendingKyc() {
        return pendingKyc;
    }

    public void setPendingKyc(long pendingKyc) {
        this.pendingKyc = pendingKyc;
    }

    public long getPendingLoans() {
        return pendingLoans;
    }

    public void setPendingLoans(long pendingLoans) {
        this.pendingLoans = pendingLoans;
    }

    public long getPendingCards() {
        return pendingCards;
    }

    public void setPendingCards(long pendingCards) {
        this.pendingCards = pendingCards;
    }
}