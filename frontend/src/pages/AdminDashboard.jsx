import { useEffect, useState } from "react";
import axios from "axios";

import AdminCards from "./AdminCards";
import AdminKyc from "./AdminKyc";
import AdminLoan from "./AdminLoan";
import AdminUsers from "./AdminUsers";
import AdminAccounts from "./AdminAccounts";
import AdminTransactions from "./AdminTransactions";
import AdminNotifications from "./AdminNotifications";

function AdminDashboard() {

    const [activeSection, setActiveSection] = useState("dashboard");

    const [statistics, setStatistics] = useState({
        totalUsers: 0,
        totalAccounts: 0,
        activeCards: 0,
        approvedLoans: 0,
        totalTransactionAmount: 0,
        dailyTransactions: [],
        monthlyTransactions: [],
        yearlyTransactions: []
    });

    const [graphType, setGraphType] = useState("daily");

    let user = null;

    try {

        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            user = JSON.parse(savedUser);
        }

    } catch (error) {

        console.error("Admin user data error:", error);

        user = null;
    }

    useEffect(() => {

        const loadStatistics = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {

                const response = await axios.get(
                    "http://localhost:8080/api/admin/statistics",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setStatistics({
                    totalUsers: response.data.totalUsers ?? 0,
                    totalAccounts: response.data.totalAccounts ?? 0,
                    activeCards: response.data.activeCards ?? 0,
                    approvedLoans: response.data.approvedLoans ?? 0,
                    totalTransactionAmount:
                        response.data.totalTransactionAmount ?? 0,
                    dailyTransactions:
                        response.data.dailyTransactions ?? [],
                    monthlyTransactions:
                        response.data.monthlyTransactions ?? [],
                    yearlyTransactions:
                        response.data.yearlyTransactions ?? []
                });

            } catch (error) {

                console.error(
                    "Admin Statistics Error:",
                    error
                );
            }
        };

        loadStatistics();

    }, []);

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.reload();
    };

    const handleBack = () => {
        setActiveSection("dashboard");
    };

    const downloadBankReport = () => {

        const rows = [];

        rows.push([
            "Bank Management Report"
        ]);

        rows.push([]);

        rows.push([
            "Total Users",
            statistics.totalUsers
        ]);

        rows.push([
            "Total Accounts",
            statistics.totalAccounts
        ]);

        rows.push([
            "Active Cards",
            statistics.activeCards
        ]);

        rows.push([
            "Approved Loans",
            statistics.approvedLoans
        ]);

        rows.push([
            "Total Transaction Amount",
            statistics.totalTransactionAmount
        ]);

        rows.push([]);

        rows.push([
            "Daily Transaction Report"
        ]);

        rows.push([
            "Date",
            "Amount"
        ]);

        statistics.dailyTransactions.forEach(
            (transaction) => {

                rows.push([
                    transaction.date,
                    transaction.amount
                ]);
            }
        );

        rows.push([]);

        rows.push([
            "Monthly Transaction Report"
        ]);

        rows.push([
            "Month",
            "Amount"
        ]);

        statistics.monthlyTransactions.forEach(
            (transaction) => {

                rows.push([
                    transaction.month,
                    transaction.amount
                ]);
            }
        );

        rows.push([]);

        rows.push([
            "Yearly Transaction Report"
        ]);

        rows.push([
            "Year",
            "Amount"
        ]);

        statistics.yearlyTransactions.forEach(
            (transaction) => {

                rows.push([
                    transaction.year,
                    transaction.amount
                ]);
            }
        );

        const csvContent = rows
            .map((row) =>
                row
                    .map((value) => `"${value ?? ""}"`)
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "Bank_Report.csv";

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    const getGraphData = () => {

        if (graphType === "daily") {
            return statistics.dailyTransactions;
        }

        if (graphType === "monthly") {
            return statistics.monthlyTransactions;
        }

        return statistics.yearlyTransactions;
    };

    const graphData = getGraphData();

    const getLabel = (item) => {

        if (graphType === "daily") {
            return item.date;
        }

        if (graphType === "monthly") {
            return item.month;
        }

        return item.year;
    };

    const getMaxAmount = () => {

        if (!graphData || graphData.length === 0) {
            return 1;
        }

        const values = graphData.map(
            (item) => Number(item.amount || 0)
        );

        const max = Math.max(...values);

        return max > 0 ? max : 1;
    };

    const maxAmount = getMaxAmount();

    if (activeSection !== "dashboard") {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#0d0d12",
                    color: "white",
                    fontFamily: "Arial, sans-serif",
                    padding: "30px",
                    boxSizing: "border-box"
                }}
            >

                <div
                    style={{
                        maxWidth: "1200px",
                        margin: "0 auto"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            marginBottom: "20px"
                        }}
                    >

                        <button
                            type="button"
                            onClick={handleBack}
                            style={orangeBackButtonStyle}
                        >
                            ← Back
                        </button>

                    </div>

                    {activeSection === "cards" && (
                        <AdminCards />
                    )}

                    {activeSection === "kyc" && (
                        <AdminKyc />
                    )}

                    {activeSection === "loans" && (
                        <AdminLoan />
                    )}

                    {activeSection === "users" && (
                        <AdminUsers />
                    )}

                    {activeSection === "accounts" && (
                        <AdminAccounts />
                    )}

                    {activeSection === "transactions" && (
                        <AdminTransactions />
                    )}

                    {activeSection === "notifications" && (
                        <AdminNotifications />
                    )}

                </div>

            </div>
        );
    }

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0d0d12",
                color: "white",
                fontFamily: "Arial, sans-serif",
                padding: "30px",
                boxSizing: "border-box"
            }}
        >

            <div
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto"
                }}
            >

                <div
                    style={{
                        backgroundColor: "#17171d",
                        border: "1px solid #333",
                        borderRadius: "14px",
                        padding: "25px 30px",
                        marginBottom: "25px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap"
                    }}
                >

                    <div>

                        <h1
                            style={{
                                margin: "0 0 8px 0",
                                color: "white",
                                fontSize: "28px"
                            }}
                        >
                            Banking Management System
                        </h1>

                        <h2
                            style={{
                                margin: "0 0 15px 0",
                                color: "#cddc39",
                                fontSize: "20px"
                            }}
                        >
                            Admin Dashboard
                        </h2>

                        <p
                            style={{
                                margin: "5px 0",
                                color: "#ccc"
                            }}
                        >
                            Welcome,{" "}
                            <strong style={{ color: "white" }}>
                                {user?.name}
                            </strong>
                        </p>

                        <p
                            style={{
                                margin: "5px 0",
                                color: "#aaa"
                            }}
                        >
                            Email:{" "}
                            <strong style={{ color: "white" }}>
                                {user?.email}
                            </strong>
                        </p>

                        <p
                            style={{
                                margin: "5px 0",
                                color: "#aaa"
                            }}
                        >
                            Role:{" "}
                            <strong style={{ color: "#cddc39" }}>
                                {user?.role}
                            </strong>
                        </p>

                    </div>

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "11px 22px",
                            backgroundColor: "#c0392b",
                            color: "white",
                            border: "none",
                            borderRadius: "7px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Logout
                    </button>

                </div>

                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: "18px",
                        marginBottom: "25px"
                    }}
                >

                    <div style={statisticsCardStyle}>

                        <div style={statisticsIconStyle}>
                            👥
                        </div>

                        <div style={statisticsTitleStyle}>
                            Total Users
                        </div>

                        <div style={statisticsNumberStyle}>
                            {statistics.totalUsers}
                        </div>

                    </div>

                    <div style={statisticsCardStyle}>

                        <div style={statisticsIconStyle}>
                            🏦
                        </div>

                        <div style={statisticsTitleStyle}>
                            Total Accounts
                        </div>

                        <div style={statisticsNumberStyle}>
                            {statistics.totalAccounts}
                        </div>

                    </div>

                    <div style={statisticsCardStyle}>

                        <div style={statisticsIconStyle}>
                            💳
                        </div>

                        <div style={statisticsTitleStyle}>
                            Active Cards
                        </div>

                        <div style={statisticsNumberStyle}>
                            {statistics.activeCards}
                        </div>

                    </div>

                    <div style={statisticsCardStyle}>

                        <div style={statisticsIconStyle}>
                            💰
                        </div>

                        <div style={statisticsTitleStyle}>
                            Approved Loans
                        </div>

                        <div style={statisticsNumberStyle}>
                            {statistics.approvedLoans}
                        </div>

                    </div>

                    <div
                        style={{
                            ...statisticsCardStyle,
                            border: "1px solid #cddc39"
                        }}
                    >

                        <div style={statisticsIconStyle}>
                            💵
                        </div>

                        <div style={statisticsTitleStyle}>
                            Total Transaction Amount
                        </div>

                        <div
                            style={{
                                ...statisticsNumberStyle,
                                fontSize: "26px"
                            }}
                        >
                            ₹ {Number(
                            statistics.totalTransactionAmount || 0
                        ).toLocaleString("en-IN")}
                        </div>

                    </div>

                </div>

                <div
                    style={{
                        backgroundColor: "#17171d",
                        border: "1px solid #333",
                        borderRadius: "14px",
                        padding: "30px",
                        marginBottom: "25px"
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "15px",
                            flexWrap: "wrap",
                            marginBottom: "25px"
                        }}
                    >

                        <div>

                            <h3
                                style={{
                                    color: "white",
                                    margin: "0 0 8px 0",
                                    fontSize: "22px"
                                }}
                            >
                                Transaction Analysis
                            </h3>

                            <p
                                style={{
                                    color: "#888",
                                    margin: "0"
                                }}
                            >
                                Transaction amount analysis
                            </p>

                        </div>

                        <button
                            onClick={downloadBankReport}
                            style={downloadButtonStyle}
                        >
                            📥 Download Bank Report
                        </button>

                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "25px",
                            flexWrap: "wrap"
                        }}
                    >

                        <button
                            onClick={() => setGraphType("daily")}
                            style={
                                graphType === "daily"
                                    ? activeGraphButtonStyle
                                    : graphButtonStyle
                            }
                        >
                            Daily
                        </button>

                        <button
                            onClick={() => setGraphType("monthly")}
                            style={
                                graphType === "monthly"
                                    ? activeGraphButtonStyle
                                    : graphButtonStyle
                            }
                        >
                            Monthly
                        </button>

                        <button
                            onClick={() => setGraphType("yearly")}
                            style={
                                graphType === "yearly"
                                    ? activeGraphButtonStyle
                                    : graphButtonStyle
                            }
                        >
                            Yearly
                        </button>

                    </div>

                    <div
                        style={{
                            width: "100%",
                            overflowX: "auto",
                            paddingBottom: "10px"
                        }}
                    >

                        {graphData.length === 0 ? (

                            <div
                                style={{
                                    height: "280px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    color: "#888"
                                }}
                            >
                                No transaction data available
                            </div>

                        ) : (

                            <div
                                style={{
                                    minWidth:
                                        Math.max(
                                            700,
                                            graphData.length * 90
                                        ),
                                    height: "300px",
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "20px",
                                    padding:
                                        "20px 20px 35px 20px",
                                    boxSizing: "border-box",
                                    borderBottom: "1px solid #444"
                                }}
                            >

                                {graphData.map(
                                    (item, index) => {

                                        const amount =
                                            Number(
                                                item.amount || 0
                                            );

                                        const height =
                                            Math.max(
                                                5,
                                                (amount /
                                                    maxAmount) *
                                                220
                                            );

                                        return (
                                            <div
                                                key={index}
                                                style={{
                                                    flex: "1",
                                                    minWidth: "55px",
                                                    height: "100%",
                                                    display: "flex",
                                                    flexDirection:
                                                        "column",
                                                    justifyContent:
                                                        "flex-end",
                                                    alignItems:
                                                        "center"
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        color: "#cddc39",
                                                        fontSize: "12px",
                                                        marginBottom:
                                                            "7px",
                                                        whiteSpace:
                                                            "nowrap"
                                                    }}
                                                >
                                                    ₹{" "}
                                                    {amount.toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </div>

                                                <div
                                                    style={{
                                                        width: "45px",
                                                        height: `${height}px`,
                                                        backgroundColor:
                                                            "#cddc39",
                                                        borderRadius:
                                                            "6px 6px 0 0",
                                                        transition:
                                                            "height 0.3s"
                                                    }}
                                                />

                                                <div
                                                    style={{
                                                        color: "#aaa",
                                                        fontSize: "12px",
                                                        marginTop:
                                                            "8px",
                                                        whiteSpace:
                                                            "nowrap"
                                                    }}
                                                >
                                                    {getLabel(item)}
                                                </div>

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        )}

                    </div>

                </div>

                <div
                    style={{
                        backgroundColor: "#17171d",
                        border: "1px solid #333",
                        borderRadius: "14px",
                        padding: "30px"
                    }}
                >

                    <h3
                        style={{
                            color: "white",
                            marginTop: "0",
                            marginBottom: "25px",
                            fontSize: "22px"
                        }}
                    >
                        Admin Management
                    </h3>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "18px"
                        }}
                    >

                        <button
                            onClick={() =>
                                setActiveSection("cards")
                            }
                            style={buttonStyle}
                        >
                            Card Management

                            <span style={descriptionStyle}>
                                Manage card applications and cards
                            </span>

                        </button>

                        <button
                            onClick={() =>
                                setActiveSection("kyc")
                            }
                            style={buttonStyle}
                        >
                            KYC Management

                            <span style={descriptionStyle}>
                                Review and manage KYC requests
                            </span>

                        </button>

                        <button
                            onClick={() =>
                                setActiveSection("loans")
                            }
                            style={buttonStyle}
                        >
                            Loan Management

                            <span style={descriptionStyle}>
                                Manage loan applications
                            </span>

                        </button>

                        <button
                            onClick={() =>
                                setActiveSection("users")
                            }
                            style={buttonStyle}
                        >
                            User Management

                            <span style={descriptionStyle}>
                                Manage registered users
                            </span>

                        </button>

                        <button
                            onClick={() =>
                                setActiveSection("accounts")
                            }
                            style={{
                                ...buttonStyle,
                                border: "1px solid #cddc39"
                            }}
                        >
                            🏦 Create Account

                            <span
                                style={{
                                    ...descriptionStyle,
                                    color: "#cddc39"
                                }}
                            >
                                Create and manage bank accounts
                            </span>

                        </button>

                        <button
                            onClick={() =>
                                setActiveSection("transactions")
                            }
                            style={buttonStyle}
                        >
                            Transaction Management

                            <span style={descriptionStyle}>
                                View banking transactions
                            </span>

                        </button>

                        <button
                            onClick={() =>
                                setActiveSection("notifications")
                            }
                            style={buttonStyle}
                        >
                            🔔 Notifications

                            <span style={descriptionStyle}>
                                View new user and system notifications
                            </span>

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

const orangeBackButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#f39c12",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "bold",
    cursor: "pointer"
};

const statisticsCardStyle = {
    backgroundColor: "#17171d",
    border: "1px solid #333",
    borderRadius: "14px",
    padding: "22px",
    textAlign: "center"
};

const statisticsIconStyle = {
    fontSize: "28px",
    marginBottom: "8px"
};

const statisticsTitleStyle = {
    color: "#aaa",
    fontSize: "15px",
    fontWeight: "600",
    marginBottom: "10px"
};

const statisticsNumberStyle = {
    color: "#cddc39",
    fontSize: "32px",
    fontWeight: "bold"
};

const graphButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#202027",
    color: "#ccc",
    border: "1px solid #444",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer"
};

const activeGraphButtonStyle = {
    padding: "10px 20px",
    backgroundColor: "#cddc39",
    color: "#111",
    border: "1px solid #cddc39",
    borderRadius: "6px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer"
};

const downloadButtonStyle = {
    padding: "12px 20px",
    backgroundColor: "#27ae60",
    color: "white",
    border: "none",
    borderRadius: "7px",
    fontSize: "14px",
    fontWeight: "bold",
    cursor: "pointer"
};

const buttonStyle = {
    padding: "22px",
    backgroundColor: "#202027",
    color: "white",
    border: "1px solid #444",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    textAlign: "left"
};

const descriptionStyle = {
    display: "block",
    marginTop: "8px",
    color: "#888",
    fontSize: "13px",
    fontWeight: "normal"
};

export default AdminDashboard;