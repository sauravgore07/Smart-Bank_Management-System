package com.banking.system.service;

import com.banking.system.entity.IssuedCardStatus;
import com.banking.system.entity.LoanStatus;
import com.banking.system.entity.Transaction;
import com.banking.system.repository.AccountRepository;
import com.banking.system.repository.CardRepository;
import com.banking.system.repository.LoanApplicationRepository;
import com.banking.system.repository.TransactionRepository;
import com.banking.system.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AdminStatisticsService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepository;
    private final CardRepository cardRepository;
    private final LoanApplicationRepository loanApplicationRepository;
    private final TransactionRepository transactionRepository;

    public AdminStatisticsService(
            UserRepository userRepository,
            AccountRepository accountRepository,
            CardRepository cardRepository,
            LoanApplicationRepository loanApplicationRepository,
            TransactionRepository transactionRepository
    ) {
        this.userRepository = userRepository;
        this.accountRepository = accountRepository;
        this.cardRepository = cardRepository;
        this.loanApplicationRepository = loanApplicationRepository;
        this.transactionRepository = transactionRepository;
    }

    public Map<String, Object> getStatistics() {

        Map<String, Object> statistics = new LinkedHashMap<>();

        statistics.put(
                "totalUsers",
                userRepository.count()
        );

        statistics.put(
                "totalAccounts",
                accountRepository.count()
        );

        statistics.put(
                "activeCards",
                cardRepository.countByStatus(
                        IssuedCardStatus.ACTIVE
                )
        );

        statistics.put(
                "approvedLoans",
                (long) loanApplicationRepository
                        .findByStatus(LoanStatus.APPROVED)
                        .size()
        );

        List<Transaction> transactions =
                transactionRepository
                        .findAllByOrderByTransactionDateDesc();

        BigDecimal totalTransactionAmount =
                transactions
                        .stream()
                        .map(Transaction::getAmount)
                        .filter(amount -> amount != null)
                        .reduce(
                                BigDecimal.ZERO,
                                BigDecimal::add
                        );

        statistics.put(
                "totalTransactionAmount",
                totalTransactionAmount
        );

        statistics.put(
                "dailyTransactions",
                getDailyTransactions(transactions)
        );

        statistics.put(
                "monthlyTransactions",
                getMonthlyTransactions(transactions)
        );

        statistics.put(
                "yearlyTransactions",
                getYearlyTransactions(transactions)
        );

        return statistics;
    }

    private List<Map<String, Object>> getDailyTransactions(
            List<Transaction> transactions
    ) {

        Map<LocalDate, BigDecimal> dailyMap =
                new LinkedHashMap<>();

        for (Transaction transaction : transactions) {

            if (transaction.getTransactionDate() == null ||
                    transaction.getAmount() == null) {
                continue;
            }

            LocalDate date =
                    transaction.getTransactionDate()
                            .toLocalDate();

            dailyMap.put(
                    date,
                    dailyMap.getOrDefault(
                            date,
                            BigDecimal.ZERO
                    ).add(transaction.getAmount())
            );
        }

        List<Map<String, Object>> result =
                new ArrayList<>();

        dailyMap.forEach((date, amount) -> {

            Map<String, Object> item =
                    new LinkedHashMap<>();

            item.put("date", date.toString());
            item.put("amount", amount);

            result.add(item);
        });

        return result;
    }

    private List<Map<String, Object>> getMonthlyTransactions(
            List<Transaction> transactions
    ) {

        Map<YearMonth, BigDecimal> monthlyMap =
                new LinkedHashMap<>();

        for (Transaction transaction : transactions) {

            if (transaction.getTransactionDate() == null ||
                    transaction.getAmount() == null) {
                continue;
            }

            YearMonth month =
                    YearMonth.from(
                            transaction.getTransactionDate()
                    );

            monthlyMap.put(
                    month,
                    monthlyMap.getOrDefault(
                            month,
                            BigDecimal.ZERO
                    ).add(transaction.getAmount())
            );
        }

        List<Map<String, Object>> result =
                new ArrayList<>();

        monthlyMap.forEach((month, amount) -> {

            Map<String, Object> item =
                    new LinkedHashMap<>();

            item.put("month", month.toString());
            item.put("amount", amount);

            result.add(item);
        });

        return result;
    }

    private List<Map<String, Object>> getYearlyTransactions(
            List<Transaction> transactions
    ) {

        Map<Integer, BigDecimal> yearlyMap =
                new LinkedHashMap<>();

        for (Transaction transaction : transactions) {

            if (transaction.getTransactionDate() == null ||
                    transaction.getAmount() == null) {
                continue;
            }

            int year =
                    transaction.getTransactionDate()
                            .getYear();

            yearlyMap.put(
                    year,
                    yearlyMap.getOrDefault(
                            year,
                            BigDecimal.ZERO
                    ).add(transaction.getAmount())
            );
        }

        List<Map<String, Object>> result =
                new ArrayList<>();

        yearlyMap.forEach((year, amount) -> {

            Map<String, Object> item =
                    new LinkedHashMap<>();

            item.put("year", year);
            item.put("amount", amount);

            result.add(item);
        });

        return result;
    }
}