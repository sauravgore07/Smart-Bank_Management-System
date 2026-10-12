import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard({
                       onLogout,
                       onAccount,
                       onBalance,
                       onDeposit,
                       onWithdraw,
                       onTransfer,
                       onTransactions,
                       onCards,
                       onKyc,
                       onLoan,
                       onNotifications,
                   }) {

    const [unreadCount, setUnreadCount] = useState(0);

    let user = null;

    try {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            user = JSON.parse(savedUser);
        }
    } catch (error) {
        console.error("User data error:", error);
        user = null;
    }

    useEffect(() => {

        const loadUnreadCount = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                return;
            }

            try {

                const response = await axios.get(
                    "http://localhost:8080/api/notifications/unread-count",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUnreadCount(response.data);

            } catch (error) {

                console.error(
                    "Notification Count Error:",
                    error
                );

            }
        };

        loadUnreadCount();

    }, []);

    const menuItems = [

        { label: "Deposit", onClick: onDeposit },
        { label: "Withdraw", onClick: onWithdraw },
        { label: "Transfer", onClick: onTransfer },
        { label: "Transactions", onClick: onTransactions },
        { label: "Cards", onClick: onCards },
        { label: "KYC", onClick: onKyc },
        { label: "Loan", onClick: onLoan },
        { label: "Account", onClick: onAccount },
        { label: "Balance", onClick: onBalance }

    ];

    return (
        <div className="admin-dashboard">

            <div className="admin-content">

                <div className="admin-header">

                    <div>

                        <h1>
                            Banking Management System
                        </h1>

                        <h2>
                            User Dashboard
                        </h2>

                        <p>
                            Welcome, <strong>{user?.name}</strong>
                        </p>

                        <p>
                            Email: <strong>{user?.email}</strong>
                        </p>

                        <p>
                            Role: <strong>{user?.role}</strong>
                        </p>

                    </div>

                    <button
                        type="button"
                        className="logout-btn"
                        onClick={onLogout}
                    >
                        Logout
                    </button>

                </div>

                <div className="card">

                    <h3>
                        User Services
                    </h3>

                    <div className="admin-menu">

                        {menuItems.map((item) => (

                            <button
                                type="button"
                                key={item.label}
                                onClick={item.onClick}
                            >
                                {item.label}
                            </button>

                        ))}

                        <button
                            type="button"
                            onClick={onNotifications}
                            style={{
                                position: "relative"
                            }}
                        >
                            🔔 Notifications

                            {unreadCount > 0 && (

                                <span
                                    style={{
                                        position: "absolute",
                                        top: "-8px",
                                        right: "-8px",
                                        minWidth: "22px",
                                        height: "22px",
                                        padding: "0 6px",
                                        borderRadius: "50%",
                                        backgroundColor: "#e74c3c",
                                        color: "white",
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxSizing: "border-box"
                                    }}
                                >
                                    {unreadCount}
                                </span>

                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;