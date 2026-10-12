
import { useEffect, useState } from "react";
import axios from "axios";

function AdminAccounts() {

    const [accounts, setAccounts] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const [userId, setUserId] = useState("");
    const [accountType, setAccountType] = useState("SAVINGS");
    const [initialBalance, setInitialBalance] = useState("");
    const [creatingAccount, setCreatingAccount] = useState(false);

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        fetchAccounts();
        fetchUsers();
    }, []);

    const fetchAccounts = async () => {

        try {

            setLoading(true);
            setMessage("");
            setMessageType("");

            const response = await axios.get(
                "http://localhost:8080/api/accounts",
                {
                    headers
                }
            );

            setAccounts(response.data);

        } catch (error) {

            console.error(
                "Admin Account Fetch Error:",
                error
            );

            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    `Error ${error.response.status}: Unable to load accounts`
                );

            } else {

                setMessage(
                    "Backend server is not running"
                );
            }

            setMessageType("error");

        } finally {

            setLoading(false);
        }
    };

    const fetchUsers = async () => {

        try {

            const response = await axios.get(
                "http://localhost:8080/api/admin/users",
                {
                    headers
                }
            );

            setUsers(response.data);

        } catch (error) {

            console.error(
                "Admin User Fetch Error:",
                error
            );

            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    `Error ${error.response.status}: Unable to load users`
                );

            } else {

                setMessage(
                    "Backend server is not running"
                );
            }

            setMessageType("error");
        }
    };

    const getAccountUserId = (account) => {

        if (account.user?.id) {
            return Number(account.user.id);
        }

        if (account.userId) {
            return Number(account.userId);
        }

        return null;
    };

    const availableUsers = users.filter(
        (user) =>
            user.role === "USER" &&
            user.active &&
            !accounts.some(
                (account) =>
                    getAccountUserId(account) === Number(user.id) &&
                    account.accountType === accountType
            )
    );

    const handleCreateAccount = async (e) => {

        e.preventDefault();

        setMessage("");
        setMessageType("");

        if (!userId) {

            setMessage("Please select a user");
            setMessageType("error");

            return;
        }

        const alreadyHasSameAccountType = accounts.some(
            (account) =>
                getAccountUserId(account) === Number(userId) &&
                account.accountType === accountType
        );

        if (alreadyHasSameAccountType) {

            setMessage(
                `This user already has a ${accountType} account. Duplicate account cannot be created.`
            );

            setMessageType("error");

            setUserId("");

            return;
        }

        if (!initialBalance) {

            setMessage("Please enter initial balance");
            setMessageType("error");

            return;
        }

        if (Number(initialBalance) < 0) {

            setMessage("Initial balance cannot be negative");
            setMessageType("error");

            return;
        }

        try {

            setCreatingAccount(true);

            const response = await axios.post(
                "http://localhost:8080/api/accounts",
                {
                    userId: Number(userId),
                    accountType: accountType,
                    initialBalance: Number(initialBalance)
                },
                {
                    headers
                }
            );

            setMessage(
                `Account created successfully. Account Number: ${response.data.accountNumber}`
            );

            setMessageType("success");

            setUserId("");
            setInitialBalance("");

            await fetchAccounts();

        } catch (error) {

            console.error(
                "Create Account Error:",
                error
            );

            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    `Error ${error.response.status}: Unable to create account`
                );

            } else {

                setMessage(
                    "Backend server is not running"
                );
            }

            setMessageType("error");

        } finally {

            setCreatingAccount(false);
        }
    };

    if (loading) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    backgroundColor: "#0d0d12",
                    color: "white",
                    padding: "30px",
                    boxSizing: "border-box",
                    fontFamily: "Arial, sans-serif"
                }}
            >

                <div
                    style={{
                        maxWidth: "1100px",
                        margin: "0 auto"
                    }}
                >

                    <div
                        style={{
                            backgroundColor: "#17171d",
                            border: "1px solid #333",
                            borderRadius: "14px",
                            padding: "35px",
                            textAlign: "center"
                        }}
                    >

                        <h2
                            style={{
                                color: "white",
                                margin: "0"
                            }}
                        >
                            Loading Accounts...
                        </h2>

                    </div>

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
                padding: "30px",
                boxSizing: "border-box",
                fontFamily: "Arial, sans-serif"
            }}
        >

            <div
                style={{
                    maxWidth: "1100px",
                    margin: "0 auto"
                }}
            >

                <div
                    style={{
                        marginBottom: "30px"
                    }}
                >

                    <h1
                        style={{
                            color: "white",
                            margin: "0 0 8px 0",
                            fontSize: "30px"
                        }}
                    >
                        Account Management
                    </h1>

                    <p
                        style={{
                            color: "#aaa",
                            margin: "0"
                        }}
                    >
                        Create and manage customer bank accounts
                    </p>

                </div>

                {message && (

                    <div
                        style={{
                            padding: "14px 18px",
                            marginBottom: "25px",
                            borderRadius: "8px",
                            backgroundColor:
                                messageType === "success"
                                    ? "#173d27"
                                    : "#3d2020",
                            border:
                                messageType === "success"
                                    ? "1px solid #2e8b57"
                                    : "1px solid #b94a48",
                            color:
                                messageType === "success"
                                    ? "#7ff0a8"
                                    : "#ff8f8f",
                            fontSize: "15px"
                        }}
                    >
                        {message}
                    </div>

                )}

                <div
                    style={{
                        backgroundColor: "#17171d",
                        border: "1px solid #333",
                        borderRadius: "14px",
                        padding: "30px",
                        marginBottom: "35px",
                        boxSizing: "border-box"
                    }}
                >

                    <div
                        style={{
                            marginBottom: "25px"
                        }}
                    >

                        <h2
                            style={{
                                color: "white",
                                margin: "0 0 8px 0",
                                fontSize: "22px"
                            }}
                        >
                            Create New Account
                        </h2>

                        <p
                            style={{
                                color: "#999",
                                margin: "0"
                            }}
                        >
                            Create a bank account for an existing user
                        </p>

                    </div>

                    <form onSubmit={handleCreateAccount}>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                gap: "20px"
                            }}
                        >

                            <div>

                                <label
                                    style={{
                                        display: "block",
                                        color: "#ddd",
                                        marginBottom: "8px",
                                        fontSize: "14px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Select User
                                </label>

                                <select
                                    value={userId}
                                    onChange={(e) =>
                                        setUserId(e.target.value)
                                    }
                                    required
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        padding: "13px",
                                        backgroundColor: "#101014",
                                        color: "white",
                                        border: "1px solid #444",
                                        borderRadius: "7px",
                                        outline: "none",
                                        fontSize: "14px"
                                    }}
                                >

                                    <option value="">
                                        {availableUsers.length === 0
                                            ? `No users available for ${accountType}`
                                            : "Select Registered User"}
                                    </option>

                                    {availableUsers.map((user) => (

                                        <option
                                            key={user.id}
                                            value={user.id}
                                        >
                                            {user.name} - {user.email}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div>

                                <label
                                    style={{
                                        display: "block",
                                        color: "#ddd",
                                        marginBottom: "8px",
                                        fontSize: "14px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Account Type
                                </label>

                                <select
                                    value={accountType}
                                    onChange={(e) => {
                                        setAccountType(e.target.value);
                                        setUserId("");
                                    }}
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        padding: "13px",
                                        backgroundColor: "#101014",
                                        color: "white",
                                        border: "1px solid #444",
                                        borderRadius: "7px",
                                        outline: "none",
                                        fontSize: "14px"
                                    }}
                                >

                                    <option value="SAVINGS">
                                        SAVINGS
                                    </option>

                                    <option value="CURRENT">
                                        CURRENT
                                    </option>

                                </select>

                            </div>

                            <div>

                                <label
                                    style={{
                                        display: "block",
                                        color: "#ddd",
                                        marginBottom: "8px",
                                        fontSize: "14px",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Initial Balance
                                </label>

                                <input
                                    type="number"
                                    placeholder="Enter Initial Balance"
                                    value={initialBalance}
                                    onChange={(e) =>
                                        setInitialBalance(e.target.value)
                                    }
                                    min="0"
                                    required
                                    style={{
                                        width: "100%",
                                        boxSizing: "border-box",
                                        padding: "13px",
                                        backgroundColor: "#101014",
                                        color: "white",
                                        border: "1px solid #444",
                                        borderRadius: "7px",
                                        outline: "none",
                                        fontSize: "14px"
                                    }}
                                />

                            </div>

                        </div>

                        <button
                            type="submit"
                            disabled={
                                creatingAccount ||
                                availableUsers.length === 0
                            }
                            style={{
                                marginTop: "25px",
                                padding: "13px 25px",
                                backgroundColor: "#cddc39",
                                color: "black",
                                border: "none",
                                borderRadius: "7px",
                                fontSize: "15px",
                                fontWeight: "bold",
                                cursor:
                                    creatingAccount ||
                                    availableUsers.length === 0
                                        ? "not-allowed"
                                        : "pointer",
                                opacity:
                                    creatingAccount ||
                                    availableUsers.length === 0
                                        ? 0.7
                                        : 1
                            }}
                        >
                            {creatingAccount
                                ? "Creating Account..."
                                : "Create Account"}
                        </button>

                    </form>

                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "20px",
                        flexWrap: "wrap",
                        gap: "15px"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                color: "white",
                                margin: "0 0 5px 0"
                            }}
                        >
                            All Bank Accounts
                        </h2>

                        <p
                            style={{
                                color: "#888",
                                margin: "0"
                            }}
                        >
                            Total Accounts: {accounts.length}
                        </p>

                    </div>

                    <button
                        onClick={fetchAccounts}
                        style={{
                            padding: "11px 20px",
                            backgroundColor: "#25252d",
                            color: "white",
                            border: "1px solid #444",
                            borderRadius: "7px",
                            cursor: "pointer",
                            fontSize: "14px"
                        }}
                    >
                        Refresh Accounts
                    </button>

                </div>

                {accounts.length === 0 ? (

                    <div
                        style={{
                            backgroundColor: "#17171d",
                            border: "1px solid #333",
                            borderRadius: "14px",
                            padding: "35px",
                            textAlign: "center"
                        }}
                    >

                        <p
                            style={{
                                color: "#aaa",
                                margin: "0"
                            }}
                        >
                            No bank accounts found.
                        </p>

                    </div>

                ) : (

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(300px, 1fr))",
                            gap: "20px"
                        }}
                    >

                        {accounts.map((account) => (

                            <div
                                key={account.accountNumber}
                                style={{
                                    backgroundColor: "#17171d",
                                    border: "1px solid #333",
                                    borderRadius: "14px",
                                    padding: "22px",
                                    boxSizing: "border-box"
                                }}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "20px"
                                    }}
                                >

                                    <div>

                                        <p
                                            style={{
                                                color: "#888",
                                                margin: "0 0 5px 0",
                                                fontSize: "12px"
                                            }}
                                        >
                                            ACCOUNT NUMBER
                                        </p>

                                        <h3
                                            style={{
                                                color: "#cddc39",
                                                margin: "0",
                                                fontSize: "18px"
                                            }}
                                        >
                                            {account.accountNumber}
                                        </h3>

                                    </div>

                                    <span
                                        style={{
                                            padding: "6px 10px",
                                            backgroundColor: "#25252d",
                                            borderRadius: "20px",
                                            color: "#ddd",
                                            fontSize: "12px"
                                        }}
                                    >
                                        {account.accountType}
                                    </span>

                                </div>

                                <div
                                    style={{
                                        borderTop: "1px solid #333",
                                        paddingTop: "15px"
                                    }}
                                >

                                    <p
                                        style={{
                                            color: "#ddd",
                                            margin: "10px 0"
                                        }}
                                    >
                                        <strong>
                                            Customer:
                                        </strong>{" "}
                                        {account.customerName}
                                    </p>

                                    <p
                                        style={{
                                            color: "#aaa",
                                            margin: "10px 0"
                                        }}
                                    >
                                        <strong>
                                            Email:
                                        </strong>{" "}
                                        {account.email}
                                    </p>

                                    <p
                                        style={{
                                            color: "#aaa",
                                            margin: "10px 0"
                                        }}
                                    >
                                        <strong>
                                            Phone:
                                        </strong>{" "}
                                        {account.phone || "N/A"}
                                    </p>

                                    <p
                                        style={{
                                            color: "#cddc39",
                                            margin: "15px 0 10px 0",
                                            fontSize: "20px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        ₹{account.balance}
                                    </p>

                                    {account.user && (

                                        <p
                                            style={{
                                                color: "#888",
                                                margin: "10px 0 0 0",
                                                fontSize: "13px"
                                            }}
                                        >
                                            User ID: {account.user.id}
                                        </p>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default AdminAccounts;

