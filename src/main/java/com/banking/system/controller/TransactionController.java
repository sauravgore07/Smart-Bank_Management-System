package com.banking.system.controller;

import com.banking.system.dto.TransactionRequest;
import com.banking.system.dto.TransactionResponse;
import com.banking.system.entity.Transaction;
import com.banking.system.service.TransactionService;

import jakarta.validation.Valid;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.common.PDRectangle;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {

        this.transactionService = transactionService;
    }

    @PostMapping("/deposit/{accountNumber}")
    public ResponseEntity<Transaction> deposit(
            @PathVariable String accountNumber,
            @Valid @RequestBody TransactionRequest request) {

        return ResponseEntity.ok(
                transactionService.deposit(
                        accountNumber,
                        request
                )
        );
    }

    @PostMapping("/withdraw/{accountNumber}")
    public ResponseEntity<Transaction> withdraw(
            @PathVariable String accountNumber,
            @Valid @RequestBody TransactionRequest request) {

        return ResponseEntity.ok(
                transactionService.withdraw(
                        accountNumber,
                        request
                )
        );
    }

    @PostMapping("/transfer")
    public ResponseEntity<Map<String, Object>> transfer(
            @RequestParam String fromAccount,
            @RequestParam String toAccount,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false)
            String description) {

        Transaction transaction =
                transactionService.transfer(
                        fromAccount,
                        toAccount,
                        amount,
                        description
                );

        Map<String, Object> response =
                new LinkedHashMap<>();

        response.put(
                "message",
                "Fund transfer successful"
        );

        response.put(
                "fromAccount",
                fromAccount
        );

        response.put(
                "toAccount",
                toAccount
        );

        response.put(
                "amount",
                amount
        );

        response.put(
                "description",
                description
        );

        response.put(
                "balanceAfterTransfer",
                transaction
                        .getBalanceAfterTransaction()
        );

        response.put(
                "transactionType",
                transaction
                        .getTransactionType()
                        .name()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/balance/{accountNumber}")
    public ResponseEntity<BigDecimal> getBalance(
            @PathVariable String accountNumber) {

        return ResponseEntity.ok(
                transactionService.getBalance(
                        accountNumber
                )
        );
    }

    @GetMapping("/history/{accountNumber}")
    public ResponseEntity<List<TransactionResponse>> getHistory(
            @PathVariable String accountNumber) {

        List<Transaction> transactions =
                transactionService
                        .getTransactionHistory(accountNumber);

        List<TransactionResponse> response =
                transactions.stream()
                        .map(t -> new TransactionResponse(
                                t.getId(),
                                t.getAccount().getAccountNumber(),
                                t.getAccount().getCustomerName(),
                                t.getTransactionType(),
                                t.getAmount(),
                                t.getBalanceAfterTransaction(),
                                t.getTransactionDate(),
                                t.getDescription()
                        ))
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {

        List<Transaction> transactions =
                transactionService.getAllTransactions();

        List<TransactionResponse> response =
                transactions.stream()
                        .map(t -> new TransactionResponse(
                                t.getId(),
                                t.getAccount().getAccountNumber(),
                                t.getAccount().getCustomerName(),
                                t.getTransactionType(),
                                t.getAmount(),
                                t.getBalanceAfterTransaction(),
                                t.getTransactionDate(),
                                t.getDescription()
                        ))
                        .toList();

        return ResponseEntity.ok(response);
    }

    @GetMapping("/statement/{accountNumber}")
    public ResponseEntity<byte[]> downloadStatement(
            @PathVariable String accountNumber) {

        List<Transaction> transactions =
                transactionService
                        .getTransactionHistory(accountNumber);

        try {

            ByteArrayOutputStream outputStream =
                    new ByteArrayOutputStream();

            PDDocument document =
                    new PDDocument();

            PDPage page =
                    new PDPage(PDRectangle.A4);

            document.addPage(page);

            PDType1Font boldFont =
                    new PDType1Font(
                            Standard14Fonts.FontName.HELVETICA_BOLD
                    );

            PDType1Font normalFont =
                    new PDType1Font(
                            Standard14Fonts.FontName.HELVETICA
                    );

            float pageWidth =
                    PDRectangle.A4.getWidth();

            float leftMargin = 40;
            float rightMargin = 40;

            float y = 800;

            PDPageContentStream contentStream =
                    new PDPageContentStream(
                            document,
                            page
                    );

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern(
                            "dd-MM-yyyy HH:mm"
                    );

            String customerName = "";

            if (!transactions.isEmpty()
                    && transactions.get(0).getAccount() != null
                    && transactions.get(0)
                    .getAccount()
                    .getCustomerName() != null) {

                customerName =
                        cleanText(
                                transactions
                                        .get(0)
                                        .getAccount()
                                        .getCustomerName()
                        );
            }

            drawHeader(
                    contentStream,
                    boldFont,
                    normalFont,
                    accountNumber,
                    customerName,
                    pageWidth,
                    y
            );

            y = 655;

            drawTableHeader(
                    contentStream,
                    boldFont,
                    y,
                    leftMargin
            );

            y -= 25;

            for (Transaction transaction : transactions) {

                if (y < 100) {

                    contentStream.close();

                    page =
                            new PDPage(
                                    PDRectangle.A4
                            );

                    document.addPage(page);

                    contentStream =
                            new PDPageContentStream(
                                    document,
                                    page
                            );

                    y = 800;

                    drawPageHeader(
                            contentStream,
                            boldFont,
                            normalFont,
                            accountNumber,
                            pageWidth
                    );

                    y = 700;

                    drawTableHeader(
                            contentStream,
                            boldFont,
                            y,
                            leftMargin
                    );

                    y -= 25;
                }

                String date = "";

                if (transaction.getTransactionDate() != null) {

                    date =
                            transaction
                                    .getTransactionDate()
                                    .format(formatter);
                }

                String type =
                        transaction.getTransactionType() != null
                                ? transaction
                                .getTransactionType()
                                .name()
                                : "";

                String amount =
                        transaction.getAmount() != null
                                ? transaction
                                .getAmount()
                                .toString()
                                : "0.00";

                String balance =
                        transaction.getBalanceAfterTransaction() != null
                                ? transaction
                                .getBalanceAfterTransaction()
                                .toString()
                                : "0.00";

                String description =
                        transaction.getDescription() != null
                                ? cleanText(
                                transaction.getDescription()
                        )
                                : "-";

                contentStream.beginText();

                contentStream.setFont(
                        normalFont,
                        8
                );

                contentStream.newLineAtOffset(
                        42,
                        y
                );

                contentStream.showText(
                        String.valueOf(
                                transaction.getId()
                        )
                );

                contentStream.endText();

                contentStream.beginText();

                contentStream.setFont(
                        normalFont,
                        8
                );

                contentStream.newLineAtOffset(
                        72,
                        y
                );

                contentStream.showText(
                        date
                );

                contentStream.endText();

                contentStream.beginText();

                contentStream.setFont(
                        normalFont,
                        8
                );

                contentStream.newLineAtOffset(
                        170,
                        y
                );

                contentStream.showText(
                        type
                );

                contentStream.endText();

                contentStream.beginText();

                contentStream.setFont(
                        normalFont,
                        8
                );

                contentStream.newLineAtOffset(
                        245,
                        y
                );

                contentStream.showText(
                        "Rs. " + amount
                );

                contentStream.endText();

                contentStream.beginText();

                contentStream.setFont(
                        normalFont,
                        8
                );

                contentStream.newLineAtOffset(
                        335,
                        y
                );

                contentStream.showText(
                        "Rs. " + balance
                );

                contentStream.endText();

                contentStream.beginText();

                contentStream.setFont(
                        normalFont,
                        8
                );

                contentStream.newLineAtOffset(
                        425,
                        y
                );

                String shortDescription =
                        description.length() > 28
                                ? description.substring(0, 28)
                                : description;

                contentStream.showText(
                        shortDescription
                );

                contentStream.endText();

                contentStream.setLineWidth(0.5f);

                contentStream.moveTo(
                        leftMargin,
                        y - 8
                );

                contentStream.lineTo(
                        pageWidth - rightMargin,
                        y - 8
                );

                contentStream.stroke();

                y -= 28;
            }

            if (transactions.isEmpty()) {

                contentStream.beginText();

                contentStream.setFont(
                        normalFont,
                        10
                );

                contentStream.newLineAtOffset(
                        40,
                        y
                );

                contentStream.showText(
                        "No transactions found."
                );

                contentStream.endText();
            }

            contentStream.close();

            document.save(outputStream);

            document.close();

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=transaction-statement-"
                                    + accountNumber
                                    + ".pdf"
                    )
                    .contentType(
                            MediaType.APPLICATION_PDF
                    )
                    .body(
                            outputStream.toByteArray()
                    );

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException(
                    "Unable to generate transaction statement",
                    e
            );
        }
    }

    private void drawHeader(
            PDPageContentStream contentStream,
            PDType1Font boldFont,
            PDType1Font normalFont,
            String accountNumber,
            String customerName,
            float pageWidth,
            float y) throws Exception {

        contentStream.beginText();

        contentStream.setFont(
                boldFont,
                20
        );

        contentStream.newLineAtOffset(
                40,
                y
        );

        contentStream.showText(
                "BANKING MANAGEMENT SYSTEM"
        );

        contentStream.endText();

        contentStream.beginText();

        contentStream.setFont(
                boldFont,
                14
        );

        contentStream.newLineAtOffset(
                40,
                y - 35
        );

        contentStream.showText(
                "TRANSACTION STATEMENT"
        );

        contentStream.endText();

        contentStream.beginText();

        contentStream.setFont(
                normalFont,
                10
        );

        contentStream.newLineAtOffset(
                40,
                y - 65
        );

        contentStream.showText(
                "Customer Name: "
                        + customerName
        );

        contentStream.endText();

        contentStream.beginText();

        contentStream.setFont(
                normalFont,
                10
        );

        contentStream.newLineAtOffset(
                40,
                y - 82
        );

        contentStream.showText(
                "Account Number: "
                        + accountNumber
        );

        contentStream.endText();

        contentStream.setLineWidth(1);

        contentStream.moveTo(
                40,
                y - 100
        );

        contentStream.lineTo(
                pageWidth - 40,
                y - 100
        );

        contentStream.stroke();
    }

    private void drawPageHeader(
            PDPageContentStream contentStream,
            PDType1Font boldFont,
            PDType1Font normalFont,
            String accountNumber,
            float pageWidth) throws Exception {

        contentStream.beginText();

        contentStream.setFont(
                boldFont,
                14
        );

        contentStream.newLineAtOffset(
                40,
                800
        );

        contentStream.showText(
                "BANKING MANAGEMENT SYSTEM"
        );

        contentStream.endText();

        contentStream.beginText();

        contentStream.setFont(
                normalFont,
                9
        );

        contentStream.newLineAtOffset(
                40,
                780
        );

        contentStream.showText(
                "Transaction Statement - Account: "
                        + accountNumber
        );

        contentStream.endText();

        contentStream.moveTo(
                40,
                765
        );

        contentStream.lineTo(
                pageWidth - 40,
                765
        );

        contentStream.stroke();
    }

    private void drawTableHeader(
            PDPageContentStream contentStream,
            PDType1Font boldFont,
            float y,
            float leftMargin) throws Exception {

        contentStream.beginText();

        contentStream.setFont(
                boldFont,
                9
        );

        contentStream.newLineAtOffset(
                42,
                y
        );

        contentStream.showText("ID");

        contentStream.endText();

        contentStream.beginText();

        contentStream.setFont(
                boldFont,
                9
        );

        contentStream.newLineAtOffset(
                72,
                y
        );

        contentStream.showText("DATE / TIME");

        contentStream.endText();

        contentStream.beginText();

        contentStream.setFont(
                boldFont,
                9
        );

        contentStream.newLineAtOffset(
                170,
                y
        );

        contentStream.showText("TYPE");

        contentStream.endText();

        contentStream.beginText();

        contentStream.setFont(
                boldFont,
                9
        );

        contentStream.newLineAtOffset(
                245,
                y
        );

        contentStream.showText("AMOUNT");

        contentStream.endText();

        contentStream.beginText();

        contentStream.setFont(
                boldFont,
                9
        );

        contentStream.newLineAtOffset(
                335,
                y
        );

        contentStream.showText("BALANCE");

        contentStream.endText();

        contentStream.beginText();

        contentStream.setFont(
                boldFont,
                9
        );

        contentStream.newLineAtOffset(
                425,
                y
        );

        contentStream.showText("DESCRIPTION");

        contentStream.endText();

        contentStream.setLineWidth(1);

        contentStream.moveTo(
                leftMargin,
                y - 8
        );

        contentStream.lineTo(
                PDRectangle.A4.getWidth() - 40,
                y - 8
        );

        contentStream.stroke();
    }

    private String cleanText(String text) {

        if (text == null) {
            return "";
        }

        return text.replaceAll(
                "[^\\x20-\\x7E]",
                ""
        );
    }
}