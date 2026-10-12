import { useEffect, useState } from "react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";

import Account from "./pages/Account";
import Balance from "./pages/Balance";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import Cards from "./pages/Cards";
import Kyc from "./pages/Kyc";
import Loan from "./pages/Loan";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";

function App() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    const [page, setPage] = useState("dashboard");

    const [user, setUser] = useState(null);

    useEffect(() => {

        const token = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {

            try {

                const parsedUser = JSON.parse(savedUser);

                if (!parsedUser || !parsedUser.role) {

                    localStorage.removeItem("token");
                    localStorage.removeItem("user");

                    setUser(null);
                    setIsLoggedIn(false);

                    return;
                }

                setUser(parsedUser);
                setIsLoggedIn(true);

            } catch (error) {

                console.error("User data error:", error);

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                setUser(null);
                setIsLoggedIn(false);
            }
        }

    }, []);

    const handleLoginSuccess = (userData) => {

        if (!userData || !userData.role) {

            console.error("Invalid login user data:", userData);

            return;
        }

        localStorage.setItem(
            "user",
            JSON.stringify(userData)
        );

        setUser(userData);
        setIsLoggedIn(true);
        setPage("dashboard");
    };

    const handleRegister = () => {
        setShowRegister(false);
    };

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setIsLoggedIn(false);
        setUser(null);
        setPage("dashboard");
        setShowRegister(false);
    };

    if (!isLoggedIn) {

        if (showRegister) {

            return (
                <Register
                    onRegisterSuccess={handleRegister}
                    onLogin={() => setShowRegister(false)}
                />
            );
        }

        return (
            <Login
                onLoginSuccess={handleLoginSuccess}
                onRegister={() => setShowRegister(true)}
            />
        );
    }

    const userRole = String(
        user?.role || ""
    ).trim().toUpperCase();

    if (userRole === "ADMIN") {

        return <AdminDashboard />;
    }

    if (userRole !== "USER") {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return (
            <Login
                onLoginSuccess={handleLoginSuccess}
                onRegister={() => setShowRegister(true)}
            />
        );
    }

    if (page === "account") {
        return (
            <Account
                onBack={() => setPage("dashboard")}
                onChangePassword={() => setPage("change-password")}
            />
        );
    }

    if (page === "balance") {
        return (
            <Balance
                onBack={() => setPage("dashboard")}
            />
        );
    }

    if (page === "deposit") {
        return (
            <Deposit
                onBack={() => setPage("dashboard")}
            />
        );
    }

    if (page === "withdraw") {
        return (
            <Withdraw
                onBack={() => setPage("dashboard")}
            />
        );
    }

    if (page === "transfer") {
        return (
            <Transfer
                onBack={() => setPage("dashboard")}
            />
        );
    }

    if (page === "transactions") {
        return (
            <Transactions
                onBack={() => setPage("dashboard")}
            />
        );
    }

    if (page === "cards") {
        return (
            <Cards
                onBack={() => setPage("dashboard")}
            />
        );
    }

    if (page === "kyc") {
        return (
            <Kyc
                onBack={() => setPage("dashboard")}
            />
        );
    }

    if (page === "loan") {
        return (
            <Loan
                onBack={() => setPage("dashboard")}
            />
        );
    }

    if (page === "change-password") {
        return (
            <ChangePassword
                onBack={() => setPage("dashboard")}
            />
        );
    }

    if (page === "profile") {
        return (
            <Profile
                onBack={() => setPage("dashboard")}
            />
        );
    }

    if (page === "notifications") {
        return (
            <Notifications
                onBack={() => setPage("dashboard")}
            />
        );
    }

    return (
        <Dashboard
            onLogout={handleLogout}
            onAccount={() => setPage("account")}
            onDeposit={() => setPage("deposit")}
            onWithdraw={() => setPage("withdraw")}
            onTransfer={() => setPage("transfer")}
            onTransactions={() => setPage("transactions")}
            onCards={() => setPage("cards")}
            onKyc={() => setPage("kyc")}
            onLoan={() => setPage("loan")}
            onBalance={() => setPage("balance")}
            onNotifications={() => setPage("notifications")}
        />
    );

}

export default App;