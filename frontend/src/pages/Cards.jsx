import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function Cards({ onBack }) {

    const [applications, setApplications] = useState([]);
    const [issuedCards, setIssuedCards] = useState([]);

    const [cardType, setCardType] = useState("DEBIT");
    const [cardVariant, setCardVariant] = useState("VISA");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const [unblockEmails, setUnblockEmails] = useState({});
    const [unblockMessages, setUnblockMessages] = useState({});
    const [requestSent, setRequestSent] = useState({});

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {

        try {

            if (!user?.id) {
                setMessage("User information not found");
                setLoading(false);
                return;
            }

            const applicationResponse = await axios.get(
                `http://localhost:8080/api/cards/user/${user.id}`,
                {
                    headers
                }
            );

            const userApplications =
                applicationResponse.data;

            setApplications(
                userApplications
            );

            const issuedCardsList = [];

            for (const application of userApplications) {

                if (application.status !== "APPROVED") {
                    continue;
                }

                try {

                    const response = await axios.get(
                        `http://localhost:8080/api/cards/issued/application/${application.id}`,
                        {
                            headers
                        }
                    );

                    console.log(
                        `Application ${application.id} Issued Card:`,
                        response.data
                    );

                    if (response.data) {

                        issuedCardsList.push(
                            response.data
                        );
                    }

                } catch (error) {

                    console.error(
                        `Issued Card Error for Application ${application.id}:`,
                        error
                    );

                    console.error(
                        "Status:",
                        error.response?.status
                    );

                    console.error(
                        "Response:",
                        error.response?.data
                    );
                }
            }

            setIssuedCards(
                issuedCardsList
            );

        } catch (error) {

            console.error(
                "Cards Error:",
                error
            );

            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    `Error ${error.response.status}: Unable to load cards`
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

    const handleApply = async (e) => {

        e.preventDefault();

        try {

            setMessage("");

            const response = await axios.post(
                `http://localhost:8080/api/cards/apply/${user.id}`,
                {
                    cardType: cardType,
                    cardVariant: cardVariant
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setMessage(
                `Card application submitted successfully. Application ID: ${response.data.id}`
            );

            await fetchCards();

        } catch (error) {

            console.error(
                "Card Application Error:",
                error
            );

            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    `Error ${error.response.status}: Card application failed`
                );

            } else {

                setMessage(
                    "Backend server is not running"
                );
            }
        }
    };

    const handleBlock = async (cardId) => {

        try {

            const response = await axios.put(
                `http://localhost:8080/api/cards/issued/${cardId}/block`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setMessage(
                "Card blocked successfully"
            );

            setIssuedCards(
                (previousCards) =>
                    previousCards.map(
                        (card) =>
                            card.id === cardId
                                ? response.data
                                : card
                    )
            );

        } catch (error) {

            console.error(
                "Block Card Error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to block card"
            );
        }
    };

    const handleUnblockRequest = async (cardId) => {

        const requestEmail =
            unblockEmails[cardId]?.trim() ||
            user?.email?.trim();

        const requestMessage =
            unblockMessages[cardId]?.trim();

        if (!requestEmail) {

            setMessage(
                "Please enter your Email ID"
            );

            return;
        }

        if (!requestMessage) {

            setMessage(
                "Please enter a message for Admin"
            );

            return;
        }

        try {

            setMessage("");

            console.log(
                "Sending Unblock Request:",
                {
                    cardId: cardId,
                    email: requestEmail,
                    message: requestMessage
                }
            );

            const response = await axios.post(
                `http://localhost:8080/api/cards/issued/${cardId}/unblock-request`,
                {
                    email: requestEmail,
                    message: requestMessage
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log(
                "Unblock Request Response:",
                response.data
            );

            setRequestSent(
                (previousRequests) => ({
                    ...previousRequests,
                    [cardId]: true
                })
            );

            setMessage(
                "Unblock request sent to Admin successfully"
            );

        } catch (error) {

            console.error(
                "Unblock Request Error:",
                error
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Response:",
                error.response?.data
            );

            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to send unblock request"
            );
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
                        maxWidth: "1100px",
                        margin: "40px auto"
                    }}
                >

                    <h2>
                        Loading cards...
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
                    maxWidth: "1100px",
                    margin: "0 auto"
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
                            color: "white"
                        }}
                    >
                        My Cards
                    </h1>

                    <p
                        style={{
                            color: "#aaa",
                            marginBottom: "25px"
                        }}
                    >
                        Manage your card applications and issued cards
                    </p>

                    {message && (
                        <div
                            style={{
                                padding: "12px",
                                marginBottom: "25px",
                                borderRadius: "6px",
                                backgroundColor: "#1b1b24",
                                border: "1px solid #444",
                                color: "#fff"
                            }}
                        >
                            {message}
                        </div>
                    )}

                    <div
                        style={{
                            border: "1px solid #333",
                            borderRadius: "10px",
                            padding: "22px",
                            marginBottom: "30px",
                            backgroundColor: "#0d0d12"
                        }}
                    >

                        <h2
                            style={{
                                marginTop: "0",
                                color: "white"
                            }}
                        >
                            Apply for New Card
                        </h2>

                        <form onSubmit={handleApply}>

                            <div
                                style={{
                                    marginBottom: "18px"
                                }}
                            >

                                <label
                                    style={{
                                        color: "#ccc",
                                        fontWeight: "600"
                                    }}
                                >
                                    Card Type
                                </label>

                                <select
                                    value={cardType}
                                    onChange={(e) =>
                                        setCardType(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        backgroundColor: "#111118",
                                        color: "white",
                                        border: "1px solid #444",
                                        borderRadius: "6px",
                                        outline: "none",
                                        boxSizing: "border-box"
                                    }}
                                >

                                    <option value="DEBIT">
                                        Debit Card
                                    </option>

                                    <option value="CREDIT">
                                        Credit Card
                                    </option>

                                </select>

                            </div>

                            <div
                                style={{
                                    marginBottom: "20px"
                                }}
                            >

                                <label
                                    style={{
                                        color: "#ccc",
                                        fontWeight: "600"
                                    }}
                                >
                                    Card Variant
                                </label>

                                <select
                                    value={cardVariant}
                                    onChange={(e) =>
                                        setCardVariant(
                                            e.target.value
                                        )
                                    }
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        backgroundColor: "#111118",
                                        color: "white",
                                        border: "1px solid #444",
                                        borderRadius: "6px",
                                        outline: "none",
                                        boxSizing: "border-box"
                                    }}
                                >

                                    <option value="VISA">
                                        Visa
                                    </option>

                                    <option value="MASTERCARD">
                                        Mastercard
                                    </option>

                                </select>

                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "flex-end"
                                }}
                            >

                                <button
                                    type="submit"
                                    style={{
                                        padding: "12px 22px",
                                        backgroundColor: "#1976d2",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "600"
                                    }}
                                >
                                    Apply for Card
                                </button>

                            </div>

                        </form>

                    </div>

                    <div
                        style={{
                            border: "1px solid #333",
                            borderRadius: "10px",
                            padding: "22px",
                            marginBottom: "30px",
                            backgroundColor: "#0d0d12"
                        }}
                    >

                        <h2
                            style={{
                                marginTop: "0",
                                color: "white"
                            }}
                        >
                            My Card Applications
                        </h2>

                        {applications.length === 0 ? (

                            <div
                                style={{
                                    padding: "20px",
                                    border: "1px solid #333",
                                    borderRadius: "8px",
                                    color: "#aaa",
                                    textAlign: "center"
                                }}
                            >
                                No card applications found.
                            </div>

                        ) : (

                            applications.map(
                                (application) => (

                                    <div
                                        key={application.id}
                                        style={{
                                            border: "1px solid #333",
                                            padding: "20px",
                                            marginBottom: "15px",
                                            borderRadius: "10px",
                                            backgroundColor: "#111118"
                                        }}
                                    >

                                        <p>
                                            <strong>
                                                Application ID:
                                            </strong>{" "}
                                            {application.id}
                                        </p>

                                        <p>
                                            <strong>
                                                Card Type:
                                            </strong>{" "}
                                            {application.cardType}
                                        </p>

                                        <p>
                                            <strong>
                                                Card Variant:
                                            </strong>{" "}
                                            {application.cardVariant}
                                        </p>

                                        <p>
                                            <strong>
                                                Status:
                                            </strong>{" "}
                                            <span
                                                style={{
                                                    color:
                                                        application.status === "APPROVED"
                                                            ? "#4caf50"
                                                            : application.status === "REJECTED"
                                                                ? "#f44336"
                                                                : "#ff9800",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {application.status}
                                            </span>
                                        </p>

                                        <p>
                                            <strong>
                                                Applied At:
                                            </strong>{" "}
                                            {application.appliedAt}
                                        </p>

                                    </div>
                                )
                            )
                        )}

                    </div>

                    <div
                        style={{
                            border: "1px solid #333",
                            borderRadius: "10px",
                            padding: "22px",
                            backgroundColor: "#0d0d12"
                        }}
                    >

                        <h2
                            style={{
                                marginTop: "0",
                                color: "white"
                            }}
                        >
                            Issued Cards
                        </h2>

                        {issuedCards.length === 0 ? (

                            <div
                                style={{
                                    padding: "20px",
                                    border: "1px solid #333",
                                    borderRadius: "8px",
                                    color: "#aaa",
                                    textAlign: "center"
                                }}
                            >
                                No issued cards found.
                            </div>

                        ) : (

                            issuedCards.map(
                                (card) => (

                                    <div
                                        key={card.id}
                                        style={{
                                            border: "1px solid #444",
                                            padding: "25px",
                                            marginBottom: "20px",
                                            borderRadius: "12px",
                                            backgroundColor: "#15151d",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.35)"
                                        }}
                                    >

                                        <h3
                                            style={{
                                                marginTop: "0",
                                                color: "white",
                                                fontSize: "20px"
                                            }}
                                        >
                                            {card.cardType}{" "}
                                            {card.cardVariant}
                                        </h3>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                                gap: "15px"
                                            }}
                                        >

                                            <div>

                                                <span
                                                    style={{
                                                        color: "#888",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    Card Number
                                                </span>

                                                <p
                                                    style={{
                                                        color: "white",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    {card.cardNumber}
                                                </p>

                                            </div>

                                            <div>

                                                <span
                                                    style={{
                                                        color: "#888",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    CVV
                                                </span>

                                                <p
                                                    style={{
                                                        color: "white",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    {card.cvv}
                                                </p>

                                            </div>

                                            <div>

                                                <span
                                                    style={{
                                                        color: "#888",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    Expiry Date
                                                </span>

                                                <p
                                                    style={{
                                                        color: "white",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    {card.expiryDate}
                                                </p>

                                            </div>

                                            <div>

                                                <span
                                                    style={{
                                                        color: "#888",
                                                        fontSize: "13px"
                                                    }}
                                                >
                                                    Status
                                                </span>

                                                <p
                                                    style={{
                                                        color:
                                                            card.status === "ACTIVE"
                                                                ? "#4caf50"
                                                                : "#f44336",
                                                        marginTop: "5px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    {card.status}
                                                </p>

                                            </div>

                                        </div>

                                        {card.status === "ACTIVE" && (

                                            <div
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "flex-end",
                                                    marginTop: "15px"
                                                }}
                                            >

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleBlock(
                                                            card.id
                                                        )
                                                    }
                                                    style={{
                                                        padding: "10px 20px",
                                                        backgroundColor: "#c62828",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        cursor: "pointer",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    Block Card
                                                </button>

                                            </div>

                                        )}

                                        {card.status === "BLOCKED" && (

                                            <div
                                                style={{
                                                    marginTop: "20px",
                                                    padding: "20px",
                                                    border: "1px solid #444",
                                                    borderRadius: "10px",
                                                    backgroundColor: "#111118",
                                                    maxWidth: "650px",
                                                    width: "100%",
                                                    boxSizing: "border-box"
                                                }}
                                            >

                                                <h4
                                                    style={{
                                                        marginTop: "0",
                                                        color: "white",
                                                        marginBottom: "8px",
                                                        fontSize: "18px"
                                                    }}
                                                >
                                                    Card is Blocked
                                                </h4>

                                                <p
                                                    style={{
                                                        color: "#aaa",
                                                        fontSize: "14px",
                                                        lineHeight: "1.5",
                                                        marginTop: "0",
                                                        marginBottom: "18px"
                                                    }}
                                                >
                                                    If you want to unblock your card,
                                                    send a request to Admin.
                                                </p>

                                                {requestSent[card.id] ? (

                                                    <div
                                                        style={{
                                                            padding: "12px",
                                                            borderRadius: "6px",
                                                            backgroundColor: "#1b3a1f",
                                                            border: "1px solid #4caf50",
                                                            color: "#8df59a"
                                                        }}
                                                    >
                                                        Unblock request sent to Admin.
                                                    </div>

                                                ) : (

                                                    <div
                                                        style={{
                                                            width: "100%",
                                                            boxSizing: "border-box"
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                marginBottom: "15px"
                                                            }}
                                                        >

                                                            <label
                                                                style={{
                                                                    display: "block",
                                                                    color: "#ccc",
                                                                    fontSize: "14px",
                                                                    fontWeight: "600",
                                                                    marginBottom: "7px"
                                                                }}
                                                            >
                                                                Email ID *
                                                            </label>

                                                            <input
                                                                type="email"
                                                                value={
                                                                    unblockEmails[card.id] !== undefined
                                                                        ? unblockEmails[card.id]
                                                                        : user?.email || ""
                                                                }
                                                                onChange={(e) =>
                                                                    setUnblockEmails(
                                                                        (previousEmails) => ({
                                                                            ...previousEmails,
                                                                            [card.id]:
                                                                            e.target.value
                                                                        })
                                                                    )
                                                                }
                                                                placeholder="Enter your Email ID"
                                                                required
                                                                style={{
                                                                    width: "100%",
                                                                    padding: "12px",
                                                                    backgroundColor: "#0d0d12",
                                                                    color: "white",
                                                                    border: "1px solid #444",
                                                                    borderRadius: "6px",
                                                                    outline: "none",
                                                                    boxSizing: "border-box",
                                                                    fontSize: "14px"
                                                                }}
                                                            />

                                                        </div>

                                                        <div
                                                            style={{
                                                                marginBottom: "15px"
                                                            }}
                                                        >

                                                            <label
                                                                style={{
                                                                    display: "block",
                                                                    color: "#ccc",
                                                                    fontSize: "14px",
                                                                    fontWeight: "600",
                                                                    marginBottom: "7px"
                                                                }}
                                                            >
                                                                Message *
                                                            </label>

                                                            <textarea
                                                                value={
                                                                    unblockMessages[card.id] || ""
                                                                }
                                                                onChange={(e) =>
                                                                    setUnblockMessages(
                                                                        (previousMessages) => ({
                                                                            ...previousMessages,
                                                                            [card.id]:
                                                                            e.target.value
                                                                        })
                                                                    )
                                                                }
                                                                placeholder="Enter message for Admin"
                                                                rows="4"
                                                                required
                                                                style={{
                                                                    width: "100%",
                                                                    minHeight: "110px",
                                                                    padding: "12px",
                                                                    backgroundColor: "#0d0d12",
                                                                    color: "white",
                                                                    border: "1px solid #444",
                                                                    borderRadius: "6px",
                                                                    outline: "none",
                                                                    boxSizing: "border-box",
                                                                    resize: "vertical",
                                                                    fontFamily: "inherit",
                                                                    fontSize: "14px"
                                                                }}
                                                            />

                                                        </div>

                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                justifyContent: "flex-end"
                                                            }}
                                                        >

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleUnblockRequest(
                                                                        card.id
                                                                    )
                                                                }
                                                                style={{
                                                                    padding: "11px 22px",
                                                                    backgroundColor: "#1976d2",
                                                                    color: "white",
                                                                    border: "none",
                                                                    borderRadius: "6px",
                                                                    cursor: "pointer",
                                                                    fontWeight: "600",
                                                                    fontSize: "14px"
                                                                }}
                                                            >
                                                                Request Unblock
                                                            </button>

                                                        </div>

                                                    </div>
                                                )}

                                            </div>

                                        )}

                                    </div>
                                )
                            )
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Cards;