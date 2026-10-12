import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function Transactions({ onBack }) {
const [transactions, setTransactions] = useState([]);
const [message, setMessage] = useState("");
const [loading, setLoading] = useState(true);
const [accountNumber, setAccountNumber] = useState("");
const [search, setSearch] = useState("");

useEffect(() => {
    fetchTransactions();
}, []);

const fetchTransactions = async () => {

    try {

        setLoading(true);
        setMessage("");

        const token =
            localStorage.getItem("token");

        if (!token) {
            setMessage("Login information not found");
            setLoading(false);
            return;
        }

        const profileResponse = await axios.get(
            "http://localhost:8080/api/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const userId =
            profileResponse.data?.id;

        if (!userId) {
            setMessage("User information not found");
            setLoading(false);
            return;
        }

        const accountResponse = await axios.get(
            `http://localhost:8080/api/accounts/user/${userId}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

    const accounts =
        accountResponse.data;

    if (!accounts ||
        accounts.length === 0) {

        setMessage("No account found");
        setLoading(false);
        return;
    }

    const currentAccountNumber =
        accounts[0].accountNumber;

    setAccountNumber(
        currentAccountNumber
    );

    const response = await axios.get(
        `http://localhost:8080/api/transactions/history/${currentAccountNumber}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    setTransactions(
        response.data
    );

} catch (error) {

    console.error(
        "Transaction Error:",
        error
    );

    setTransactions([]);

    if (error.response) {

        setMessage(
            error.response.data?.message ||
            `Error ${error.response.status}: Unable to load transactions`
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

    try {

        const token =
            localStorage.getItem("token");

        if (!accountNumber) {

            setMessage(
                "Account number not found"
            );

            return;
        }

        const response = await axios.get(
            `http://localhost:8080/api/transactions/statement/${accountNumber}`,
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
            `transaction-statement-${accountNumber}.pdf`;

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

const filteredTransactions =
    transactions.filter((transaction) => {

        const searchText =
            search.toLowerCase();

        return (
            String(transaction.id || "")
                .toLowerCase()
                .includes(searchText) ||

            String(transaction.transactionType || "")
                .toLowerCase()
                .includes(searchText) ||

            String(transaction.amount || "")
                .toLowerCase()
                .includes(searchText) ||

            String(transaction.description || "")
                .toLowerCase()
                .includes(searchText) ||

            String(transaction.transactionDate || "")
                .toLowerCase()
                .includes(searchText)
        );
    });

if (loading) {

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#0d0d12",
                color: "white",
                padding: "30px",
                boxSizing: "border-box"
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >
                <BackButton onClick={onBack} />
            </div>

            <div
                style={{
                    maxWidth: "1200px",
                    margin: "40px auto"
                }}
            >

                <h2>
                    Loading transactions...
                </h2>

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
            boxSizing: "border-box"
        }}
    >

        <div
            style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "20px"
            }}
        >
            <BackButton onClick={onBack} />
        </div>

        <div
            style={{
                maxWidth: "1200px",
                margin: "0 auto"
            }}
        >

            <div
                style={{
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "25px",
                    backgroundColor: "#111118",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)"
                }}
            >

                <h1
                    style={{
                        marginTop: "0",
                        marginBottom: "10px",
                        color: "white"
                    }}
                >
                    Transaction History
                </h1>

                <p
                    style={{
                        color: "#aaa",
                        marginBottom: "25px"
                    }}
                >
                    View and download your account transaction history
                </p>

                {message && (
                    <div
                        style={{
                            color: "#ff6b6b",
                            backgroundColor: "#211315",
                            border: "1px solid #5a2929",
                            padding: "12px",
                            borderRadius: "6px",
                            marginBottom: "20px"
                        }}
                    >
                        {message}
                    </div>
                )}

                {accountNumber && (
                    <div
                        style={{
                            border: "1px solid #333",
                            borderRadius: "8px",
                            padding: "15px",
                            marginBottom: "20px",
                            backgroundColor: "#0d0d12"
                        }}
                    >

                        <span
                            style={{
                                color: "#aaa"
                            }}
                        >
                            Account Number
                        </span>

                        <div
                            style={{
                                color: "white",
                                fontSize: "18px",
                                fontWeight: "600",
                                marginTop: "5px"
                            }}
                        >
                            {accountNumber}
                        </div>

                    </div>
                )}

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        marginBottom: "25px",
                        flexWrap: "wrap"
                    }}
                >

                    <input
                        type="text"
                        placeholder="Search transactions..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        style={{
                            flex: "1",
                            minWidth: "250px",
                            padding: "12px 14px",
                            backgroundColor: "#0d0d12",
                            color: "white",
                            border: "1px solid #444",
                            borderRadius: "6px",
                            outline: "none",
                            fontSize: "14px",
                            boxSizing: "border-box"
                        }}
                    />

                    <button
                        onClick={downloadStatement}
                        style={{
                            padding: "12px 20px",
                            backgroundColor: "#1976d2",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600"
                        }}
                    >
                        Download Statement
                    </button>

                </div>

                {transactions.length === 0 ? (

                    <div
                        style={{
                            border: "1px solid #333",
                            borderRadius: "8px",
                            padding: "30px",
                            textAlign: "center",
                            color: "#aaa",
                            backgroundColor: "#0d0d12"
                        }}
                    >
                        No transactions found.
                    </div>

                ) : filteredTransactions.length === 0 ? (

                    <div
                        style={{
                            border: "1px solid #333",
                            borderRadius: "8px",
                            padding: "30px",
                            textAlign: "center",
                            color: "#aaa",
                            backgroundColor: "#0d0d12"
                        }}
                    >
                        No transactions match your search.
                    </div>

                ) : (

                    <div
                        style={{
                            overflowX: "auto",
                            border: "1px solid #333",
                            borderRadius: "8px"
                        }}
                    >

                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                backgroundColor: "#111118",
                                minWidth: "800px"
                            }}
                        >

                            <thead>

                            <tr
                                style={{
                                    backgroundColor: "#1a1a23"
                                }}
                            >

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #333",
                                        color: "#fff",
                                        textAlign: "left"
                                    }}
                                >
                                    ID
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #333",
                                        color: "#fff",
                                        textAlign: "left"
                                    }}
                                >
                                    Type
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #333",
                                        color: "#fff",
                                        textAlign: "left"
                                    }}
                                >
                                    Amount
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #333",
                                        color: "#fff",
                                        textAlign: "left"
                                    }}
                                >
                                    Balance After
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #333",
                                        color: "#fff",
                                        textAlign: "left"
                                    }}
                                >
                                    Description
                                </th>

                                <th
                                    style={{
                                        padding: "14px",
                                        borderBottom: "1px solid #333",
                                        color: "#fff",
                                        textAlign: "left"
                                    }}
                                >
                                    Date
                                </th>

                            </tr>

                            </thead>

                            <tbody>

                            {filteredTransactions.map(
                                (transaction) => (

                                    <tr
                                        key={
                                            transaction.id
                                        }
                                        style={{
                                            backgroundColor: "#111118"
                                        }}
                                    >

                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #292929",
                                                color: "#fff"
                                            }}
                                        >
                                            {
                                                transaction.id
                                            }
                                        </td>

                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #292929",
                                                color: "#fff",
                                                fontWeight: "600"
                                            }}
                                        >
                                            {
                                                transaction.transactionType
                                            }
                                        </td>

                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #292929",
                                                color: "#fff"
                                            }}
                                        >
                                            ₹{" "}
                                            {
                                                transaction.amount
                                            }
                                        </td>

                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #292929",
                                                color: "#fff"
                                            }}
                                        >
                                            ₹{" "}
                                            {
                                                transaction.balanceAfterTransaction
                                            }
                                        </td>

                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #292929",
                                                color: "#ccc"
                                            }}
                                        >
                                            {
                                                transaction.description ||
                                                "-"
                                            }
                                        </td>

                                        <td
                                            style={{
                                                padding: "14px",
                                                borderBottom: "1px solid #292929",
                                                color: "#ccc"
                                            }}
                                        >
                                            {
                                                transaction.transactionDate
                                            }
                                        </td>

                                    </tr>

                                )
                            )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    </div>
);


}

export default Transactions;
