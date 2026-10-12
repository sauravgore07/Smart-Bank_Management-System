
import { useState } from "react";
import axios from "axios";

function AdminTransactions() {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [accountNumber, setAccountNumber] = useState("");
    const [searchedAccount, setSearchedAccount] = useState("");

    const searchTransactions = async () => {

        if (!accountNumber.trim()) {
            setMessage("Please enter account number");
            setTransactions([]);
            setSearchedAccount("");
            return;
        }

        try {

            setLoading(true);
            setMessage("");

            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:8080/api/transactions/history/${accountNumber.trim()}`,
{
    headers: {
        Authorization: `Bearer ${token}`
    }
}
);

setTransactions(response.data);
setSearchedAccount(accountNumber.trim());

if (response.data.length === 0) {
    setMessage(
        "No transactions found for this account"
    );
}

} catch (error) {

    console.error(
        "Account Transaction Search Error:",
        error
    );

    setTransactions([]);
    setSearchedAccount("");

    if (error.response) {

        setMessage(
            error.response.data?.message ||
            `Error ${error.response.status}: Unable to find transactions`
        );

    } else {

        setMessage(
            "Backend server is not running"
        );
    }

} finally {

    setLoading(false);
}
};

const refreshTransactions = async () => {

    if (!searchedAccount) {

        setMessage(
            "Please search an account first"
        );

        return;
    }

    try {

        setLoading(true);
        setMessage("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
            `http://localhost:8080/api/transactions/history/${searchedAccount}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setTransactions(response.data);

        if (response.data.length === 0) {

            setMessage(
                "No transactions found for this account"
            );
        }

    } catch (error) {

        console.error(
            "Transaction Refresh Error:",
            error
        );

        if (error.response) {

            setMessage(
                error.response.data?.message ||
                `Error ${error.response.status}: Unable to refresh transactions`
            );

        } else {

            setMessage(
                "Backend server is not running"
            );
        }

    } finally {

        setLoading(false);
    }
};

const downloadStatement = async () => {

    if (!searchedAccount) {

        setMessage(
            "Please search an account first"
        );

        return;
    }

    try {

        setMessage("");

        const token = localStorage.getItem("token");

        const response = await axios.get(
            `http://localhost:8080/api/transactions/statement/${searchedAccount}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: "blob"
            }
        );

        const blob = new Blob(
            [response.data],
            {
                type: "application/pdf"
            }
        );

        const url =
            window.URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        link.href = url;

        link.download =
            `transaction-statement-${searchedAccount}.pdf`;

        document.body.appendChild(link);

        link.click();

        link.remove();

        window.URL.revokeObjectURL(url);

    } catch (error) {

        console.error(
            "Statement Download Error:",
            error
        );

        setMessage(
            "Unable to download transaction statement"
        );
    }
};

const pageStyle = {
    minHeight: "100vh",
    padding: "30px",
    backgroundColor: "#111",
    color: "white",
    boxSizing: "border-box",
    fontFamily: "Arial, sans-serif"
};

const containerStyle = {
    maxWidth: "1100px",
    margin: "auto"
};

const cardStyle = {
    backgroundColor: "#1c1c1c",
    border: "1px solid #333",
    borderRadius: "10px",
    padding: "25px",
    marginBottom: "25px"
};

const inputStyle = {
    flex: 1,
    padding: "12px",
    backgroundColor: "transparent",
    color: "white",
    border: "1px solid #555",
    borderRadius: "6px",
    fontSize: "15px",
    outline: "none"
};

const searchButtonStyle = {
    padding: "12px 22px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    cursor: "pointer"
};

const refreshButtonStyle = {
    padding: "10px 18px",
    backgroundColor: "#333",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

const downloadButtonStyle = {
    padding: "10px 18px",
    backgroundColor: "#f39c12",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

if (loading) {

    return (
        <div style={pageStyle}>

            <div style={containerStyle}>

                <div style={cardStyle}>

                    <h2>
                        Loading Transactions...
                    </h2>

                </div>

            </div>

        </div>
    );
}

return (
    <div style={pageStyle}>

        <div style={containerStyle}>

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    marginBottom: "10px"
                }}
            >

                <div
                    style={{
                        fontSize: "38px"
                    }}
                >
                    💳
                </div>

                <div>

                    <h1
                        style={{
                            margin: "0 0 8px 0"
                        }}
                    >
                        Admin Transaction Management
                    </h1>

                    <p
                        style={{
                            margin: 0,
                            color: "#ccc"
                        }}
                    >
                        Search and manage customer transaction history
                    </p>

                </div>

            </div>

            {message && (
                <div
                    style={{
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #555",
                        padding: "12px",
                        borderRadius: "6px",
                        margin: "20px 0",
                        color: "white"
                    }}
                >
                    ⚠ {message}
                </div>
            )}

            <div style={cardStyle}>

                <h2>
                    🔍 Search Transactions
                </h2>

                <p
                    style={{
                        color: "#ccc"
                    }}
                >
                    Enter an account number to view transaction history.
                </p>

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginTop: "20px",
                        flexWrap: "wrap"
                    }}
                >

                    <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) =>
                            setAccountNumber(e.target.value)
                        }
                        placeholder="Enter Account Number"
                        style={inputStyle}
                    />

                    <button
                        onClick={searchTransactions}
                        style={searchButtonStyle}
                    >
                        Search Transactions 🔎
                    </button>

                </div>

            </div>

            {searchedAccount && (
                <div
                    style={{
                        ...cardStyle,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "20px",
                        flexWrap: "wrap"
                    }}
                >

                    <div>

                        <h2
                            style={{
                                margin: "0 0 10px 0"
                            }}
                        >
                            Transactions for
                        </h2>

                        <span
                            style={{
                                display: "inline-block",
                                backgroundColor: "#333",
                                padding: "8px 14px",
                                borderRadius: "5px",
                                fontWeight: "bold"
                            }}
                        >
                                {searchedAccount}
                            </span>

                    </div>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap"
                        }}
                    >

                        <button
                            onClick={refreshTransactions}
                            style={refreshButtonStyle}
                        >
                            ↻ Refresh Transactions
                        </button>

                        <button
                            onClick={downloadStatement}
                            style={downloadButtonStyle}
                        >
                            ↓ Download Statement
                        </button>

                    </div>

                </div>
            )}

            {!searchedAccount ? (

                <div
                    style={{
                        ...cardStyle,
                        textAlign: "center",
                        padding: "50px 20px"
                    }}
                >

                    <div
                        style={{
                            fontSize: "40px",
                            marginBottom: "15px"
                        }}
                    >
                        🔎
                    </div>

                    <h3>
                        Search an Account
                    </h3>

                    <p
                        style={{
                            color: "#ccc"
                        }}
                    >
                        Enter an account number above to view transactions.
                    </p>

                </div>

            ) : transactions.length === 0 ? (

                <div
                    style={{
                        ...cardStyle,
                        textAlign: "center",
                        padding: "50px 20px"
                    }}
                >

                    <div
                        style={{
                            fontSize: "40px",
                            marginBottom: "15px"
                        }}
                    >
                        📭
                    </div>

                    <h3>
                        No Transactions Found
                    </h3>

                    <p
                        style={{
                            color: "#ccc"
                        }}
                    >
                        No transactions are available for this account.
                    </p>

                </div>

            ) : (

                <div>

                    {transactions.map(
                        (transaction) => (

                            <div
                                key={transaction.id}
                                style={cardStyle}
                            >

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: "10px",
                                        borderBottom: "1px solid #444",
                                        paddingBottom: "15px",
                                        marginBottom: "20px",
                                        flexWrap: "wrap"
                                    }}
                                >

                                        <span>
                                            Transaction #{transaction.id}
                                        </span>

                                    <span
                                        style={{
                                            backgroundColor: "#333",
                                            padding: "6px 12px",
                                            borderRadius: "5px"
                                        }}
                                    >
                                            {transaction.transactionType}
                                        </span>

                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit, minmax(220px, 1fr))",
                                        gap: "20px"
                                    }}
                                >

                                    <div>

                                            <span
                                                style={{
                                                    display: "block",
                                                    color: "#aaa",
                                                    marginBottom: "5px"
                                                }}
                                            >
                                                Account Number
                                            </span>

                                        <strong>
                                            {transaction.accountNumber ||
                                                searchedAccount ||
                                                "N/A"}
                                        </strong>

                                    </div>

                                    <div>

                                            <span
                                                style={{
                                                    display: "block",
                                                    color: "#aaa",
                                                    marginBottom: "5px"
                                                }}
                                            >
                                                Customer Name
                                            </span>

                                        <strong>
                                            {transaction.customerName ||
                                                "N/A"}
                                        </strong>

                                    </div>

                                    <div>

                                            <span
                                                style={{
                                                    display: "block",
                                                    color: "#aaa",
                                                    marginBottom: "5px"
                                                }}
                                            >
                                                Amount
                                            </span>

                                        <strong>
                                            ₹{transaction.amount}
                                        </strong>

                                    </div>

                                    <div>

                                            <span
                                                style={{
                                                    display: "block",
                                                    color: "#aaa",
                                                    marginBottom: "5px"
                                                }}
                                            >
                                                Balance After Transaction
                                            </span>

                                        <strong>
                                            ₹{transaction.balanceAfterTransaction}
                                        </strong>

                                    </div>

                                    <div>

                                            <span
                                                style={{
                                                    display: "block",
                                                    color: "#aaa",
                                                    marginBottom: "5px"
                                                }}
                                            >
                                                Description
                                            </span>

                                        <strong>
                                            {transaction.description ||
                                                "N/A"}
                                        </strong>

                                    </div>

                                    <div>

                                            <span
                                                style={{
                                                    display: "block",
                                                    color: "#aaa",
                                                    marginBottom: "5px"
                                                }}
                                            >
                                                Transaction Date
                                            </span>

                                        <strong>
                                            {transaction.transactionDate}
                                        </strong>

                                    </div>

                                </div>

                            </div>
                        )
                    )}

                </div>
            )}

        </div>

    </div>
);
}

export default AdminTransactions;

