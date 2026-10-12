package com.banking.system.dto;

public class AccountQrResponse {

    private String accountNumber;
    private String customerName;
    private String email;
    private String phone;
    private String accountType;
    private String profilePhotoUrl;

    public AccountQrResponse() {
    }

    public AccountQrResponse(
            String accountNumber,
            String customerName,
            String email,
            String phone,
            String accountType,
            String profilePhotoUrl) {

        this.accountNumber = accountNumber;
        this.customerName = customerName;
        this.email = email;
        this.phone = phone;
        this.accountType = accountType;
        this.profilePhotoUrl = profilePhotoUrl;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }

    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }
}