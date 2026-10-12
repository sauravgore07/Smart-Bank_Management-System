import { useEffect, useState } from "react";
import axios from "axios";

function AdminCards() {

    const [applications, setApplications] = useState([]);
    const [issuedCards, setIssuedCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState([]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState("");
    const [searchedEmail, setSearchedEmail] = useState("");

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        fetchApplications();
        fetchIssuedCards();
    }, []);

    const fetchApplications = async () => {
        try {

            const response = await axios.get(
                "http://localhost:8080/api/cards/all",
                {
                    headers
                }
            );

            setApplications(response.data);

        } catch (error) {

            console.error("Applications Error:", error);

            setMessage(
                error.response?.data?.message ||
                "Unable to load card applications"
            );

        } finally {

            setLoading(false);
        }
    };

    const fetchIssuedCards = async () => {
        try {

            const response = await axios.get(
                "http://localhost:8080/api/cards/issued",
                {
                    headers
                }
            );

            console.log(
                "Issued Cards From Backend:",
                response.data
            );

            setIssuedCards(response.data);

        } catch (error) {

            console.error("Issued Cards Error:", error);

            setMessage(
                error.response?.data?.message ||
                "Unable to load issued cards"
            );
        }
    };

    const getCardEmail = (card) => {

        return (
            card.cardApplication?.user?.email ||
            card.user?.email ||
            card.email ||
            ""
        );
    };

    const searchCardsByEmail = () => {

        if (!email.trim()) {

            setMessage("Please enter user email");
            setFilteredCards([]);
            setSearchedEmail("");

            return;
        }

        const searchEmail =
            email.trim().toLowerCase();

        const matchedCards =
            issuedCards.filter((card) => {

                const cardEmail =
                    getCardEmail(card)
                        .trim()
                        .toLowerCase();

                return cardEmail === searchEmail;
            });

        console.log(
            "Searching Email:",
            searchEmail
        );

        console.log(
            "Matched Cards:",
            matchedCards
        );

        setFilteredCards(matchedCards);
        setSearchedEmail(email.trim());

        if (matchedCards.length === 0) {

            setMessage(
                "No issued cards found for this email"
            );

        } else {

            setMessage("");
        }
    };

    const refreshCards = async () => {

        try {

            setMessage("");

            const [
                applicationsResponse,
                issuedCardsResponse
            ] = await Promise.all([

                axios.get(
                    "http://localhost:8080/api/cards/all",
                    {
                        headers
                    }
                ),

                axios.get(
                    "http://localhost:8080/api/cards/issued",
                    {
                        headers
                    }
                )

            ]);

            setApplications(
                applicationsResponse.data
            );

            const updatedIssuedCards =
                issuedCardsResponse.data;

            console.log(
                "Refreshed Issued Cards:",
                updatedIssuedCards
            );

            setIssuedCards(
                updatedIssuedCards
            );

            if (searchedEmail) {

                const searchEmail =
                    searchedEmail.trim().toLowerCase();

                const matchedCards =
                    updatedIssuedCards.filter(
                        (card) => {

                            const cardEmail =
                                getCardEmail(card)
                                    .trim()
                                    .toLowerCase();

                            return cardEmail === searchEmail;
                        }
                    );

                setFilteredCards(
                    matchedCards
                );

                if (matchedCards.length === 0) {

                    setMessage(
                        "No issued cards found for this email"
                    );

                } else {

                    setMessage(
                        "Cards refreshed successfully"
                    );
                }

            } else {

                setFilteredCards([]);
            }

        } catch (error) {

            console.error(
                "Refresh Cards Error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Unable to refresh cards"
            );
        }
    };

    const updateStatus = async (
        applicationId,
        status
    ) => {

        try {

            setMessage("");

            await axios.put(
                `http://localhost:8080/api/cards/${applicationId}/status?status=${status}`,
                {},
                {
                    headers
                }
            );

            setMessage(
                `Application ${status.toLowerCase()} successfully`
            );

            await fetchApplications();

        } catch (error) {

            console.error(
                "Update Status Error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Unable to update application status"
            );
        }
    };

    const generateCard = async (
        applicationId
    ) => {

        try {

            setMessage("");

            const response = await axios.post(
                `http://localhost:8080/api/cards/generate/${applicationId}`,
                {},
                {
                    headers
                }
            );

            console.log(
                "Generated Card:",
                response.data
            );

            setMessage(
                "Card generated successfully"
            );

            await fetchApplications();

            const issuedResponse =
                await axios.get(
                    "http://localhost:8080/api/cards/issued",
                    {
                        headers
                    }
                );

            const updatedCards =
                issuedResponse.data;

            setIssuedCards(
                updatedCards
            );

            if (searchedEmail) {

                const matchedCards =
                    updatedCards.filter(
                        (card) => {

                            const cardEmail =
                                getCardEmail(card)
                                    .trim()
                                    .toLowerCase();

                            return (
                                cardEmail ===
                                searchedEmail
                                    .trim()
                                    .toLowerCase()
                            );
                        }
                    );

                setFilteredCards(
                    matchedCards
                );
            }

        } catch (error) {

            console.error(
                "Generate Card Error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to generate card"
            );
        }
    };

    const handleBlock = async (
        cardId
    ) => {

        try {

            setMessage("");

            const response = await axios.put(
                `http://localhost:8080/api/cards/issued/${cardId}/block`,
                {},
                {
                    headers
                }
            );

            console.log(
                "Block Card Response:",
                response.data
            );

            setMessage(
                "Card blocked successfully"
            );

            const updatedCard =
                response.data;

            setIssuedCards(
                (previousCards) =>
                    previousCards.map(
                        (card) =>
                            card.id === cardId
                                ? updatedCard
                                : card
                    )
            );

            setFilteredCards(
                (previousCards) =>
                    previousCards.map(
                        (card) =>
                            card.id === cardId
                                ? updatedCard
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
                "Unable to block card"
            );
        }
    };

    const handleUnblock = async (
        cardId
    ) => {

        try {

            setMessage("");

            const response = await axios.put(
                `http://localhost:8080/api/cards/issued/${cardId}/unblock`,
                {},
                {
                    headers
                }
            );

            console.log(
                "Unblock Card Response:",
                response.data
            );

            setMessage(
                "Card unblocked successfully"
            );

            const updatedCard =
                response.data;

            setIssuedCards(
                (previousCards) =>
                    previousCards.map(
                        (card) =>
                            card.id === cardId
                                ? updatedCard
                                : card
                    )
            );

            setFilteredCards(
                (previousCards) =>
                    previousCards.map(
                        (card) =>
                            card.id === cardId
                                ? updatedCard
                                : card
                    )
            );

        } catch (error) {

            console.error(
                "Unblock Card Error:",
                error
            );

            setMessage(
                error.response?.data?.message ||
                "Unable to unblock card"
            );
        }
    };

    const isCardGenerated = (
        applicationId
    ) => {

        return issuedCards.some(
            (card) =>
                card.cardApplication?.id ===
                applicationId
        );
    };

    if (loading) {

        return (
            <div
                style={{
                    padding: "40px",
                    maxWidth: "1000px",
                    margin: "auto",
                    color: "#fff"
                }}
            >

                <h2
                    style={{
                        color: "#fff"
                    }}
                >
                    Loading Admin Card Management...
                </h2>

            </div>
        );
    }

    return (
        <div
            style={{
                padding: "30px",
                maxWidth: "1000px",
                margin: "auto",
                color: "#fff"
            }}
        >

            <div
                style={{
                    border: "1px solid #ccc",
                    borderRadius: "12px",
                    padding: "25px"
                }}
            >

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
                            fontSize: "40px"
                        }}
                    >
                        💳
                    </div>

                    <div>

                        <h1
                            style={{
                                margin: "0 0 5px 0",
                                color: "#fff"
                            }}
                        >
                            Admin Card Management
                        </h1>

                        <p
                            style={{
                                margin: 0,
                                color: "#fff"
                            }}
                        >
                            Manage card applications and issued cards
                        </p>

                    </div>

                </div>

                {message && (
                    <div
                        style={{
                            padding: "12px",
                            margin: "20px 0",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            color: "#fff"
                        }}
                    >
                        {message}
                    </div>
                )}

                <hr />

                <div
                    style={{
                        marginTop: "25px",
                        padding: "20px",
                        border: "1px solid #ccc",
                        borderRadius: "10px"
                    }}
                >

                    <h2
                        style={{
                            marginTop: 0,
                            color: "#fff"
                        }}
                    >
                        🔍 Search Issued Cards
                    </h2>

                    <p
                        style={{
                            color: "#fff"
                        }}
                    >
                        Enter user's email to view their issued cards.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            flexWrap: "wrap"
                        }}
                    >

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter User Email"
                            style={{
                                padding: "11px",
                                width: "280px",
                                border: "1px solid #aaa",
                                borderRadius: "6px",
                                fontSize: "15px",
                                color: "#fff",
                                backgroundColor: "transparent"
                            }}
                        />

                        <button
                            type="button"
                            onClick={searchCardsByEmail}
                            style={{
                                padding: "11px 20px",
                                border: "none",
                                borderRadius: "6px",
                                backgroundColor: "#333",
                                color: "#fff",
                                cursor: "pointer"
                            }}
                        >
                            Search Cards
                        </button>

                        {searchedEmail && (
                            <button
                                type="button"
                                onClick={refreshCards}
                                style={{
                                    padding: "11px 20px",
                                    border: "none",
                                    borderRadius: "6px",
                                    backgroundColor: "#f39c12",
                                    color: "#fff",
                                    cursor: "pointer"
                                }}
                            >
                                ↻ Refresh
                            </button>
                        )}

                    </div>

                </div>

                <hr
                    style={{
                        margin: "30px 0"
                    }}
                />

                {searchedEmail && (
                    <p
                        style={{
                            color: "#fff",
                            marginBottom: "5px"
                        }}
                    >
                        Showing cards for:{" "}
                        <strong>
                            {searchedEmail}
                        </strong>
                    </p>
                )}

                <h2
                    style={{
                        color: "#fff",
                        marginTop: "5px"
                    }}
                >
                    Issued Cards
                </h2>

                {!searchedEmail ? (

                    <div
                        style={{
                            textAlign: "center",
                            padding: "30px",
                            border: "1px solid #ccc",
                            borderRadius: "10px"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "35px",
                                marginBottom: "10px"
                            }}
                        >
                            🔍
                        </div>

                        <h3
                            style={{
                                color: "#fff"
                            }}
                        >
                            Search for Issued Cards
                        </h3>

                        <p
                            style={{
                                color: "#fff"
                            }}
                        >
                            Enter a user's email above to view their issued cards.
                        </p>

                    </div>

                ) : filteredCards.length === 0 ? (

                    <div
                        style={{
                            textAlign: "center",
                            padding: "30px",
                            border: "1px solid #ccc",
                            borderRadius: "10px"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "35px",
                                marginBottom: "10px"
                            }}
                        >
                            💳
                        </div>

                        <h3
                            style={{
                                color: "#fff"
                            }}
                        >
                            No Issued Cards Found
                        </h3>

                        <p
                            style={{
                                color: "#fff"
                            }}
                        >
                            No issued cards found for this email.
                        </p>

                    </div>

                ) : (

                    filteredCards.map(
                        (card) => (

                            <div
                                key={card.id}
                                style={{
                                    border: "1px solid #333",
                                    padding: "20px",
                                    marginBottom: "15px",
                                    borderRadius: "10px"
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

                                    <strong
                                        style={{
                                            color: "#fff"
                                        }}
                                    >
                                        💳 Card #{card.id}
                                    </strong>

                                    <span
                                        style={{
                                            padding: "6px 12px",
                                            borderRadius: "5px",
                                            backgroundColor:
                                                card.status === "ACTIVE"
                                                    ? "#d4edda"
                                                    : "#f8d7da",
                                            color:
                                                card.status === "ACTIVE"
                                                    ? "#155724"
                                                    : "#721c24",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        {card.status}
                                    </span>

                                </div>

                                <p style={{ color: "#fff" }}>
                                    <strong>Card Number:</strong>{" "}
                                    {card.cardNumber}
                                </p>

                                <p style={{ color: "#fff" }}>
                                    <strong>Card Type:</strong>{" "}
                                    {card.cardType}
                                </p>

                                <p style={{ color: "#fff" }}>
                                    <strong>Card Variant:</strong>{" "}
                                    {card.cardVariant}
                                </p>

                                <p style={{ color: "#fff" }}>
                                    <strong>Expiry Date:</strong>{" "}
                                    {card.expiryDate}
                                </p>

                                <p style={{ color: "#fff" }}>
                                    <strong>Customer Email:</strong>{" "}
                                    {getCardEmail(card) ||
                                        searchedEmail}
                                </p>

                                {card.status === "ACTIVE" && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleBlock(card.id)
                                        }
                                        style={{
                                            padding: "10px 20px",
                                            border: "none",
                                            borderRadius: "6px",
                                            backgroundColor: "#333",
                                            color: "#fff",
                                            cursor: "pointer",
                                            marginTop: "10px"
                                        }}
                                    >
                                        🔒 Block Card
                                    </button>

                                )}

                                {card.status === "BLOCKED" && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleUnblock(card.id)
                                        }
                                        style={{
                                            padding: "10px 20px",
                                            border: "none",
                                            borderRadius: "6px",
                                            backgroundColor: "#f39c12",
                                            color: "#fff",
                                            cursor: "pointer",
                                            marginTop: "10px"
                                        }}
                                    >
                                        🔓 Unblock Card
                                    </button>

                                )}

                            </div>
                        )
                    )
                )}

                <hr
                    style={{
                        margin: "30px 0"
                    }}
                />

                <h2
                    style={{
                        color: "#fff"
                    }}
                >
                    Card Applications
                </h2>

                {applications.length === 0 ? (

                    <p
                        style={{
                            color: "#fff"
                        }}
                    >
                        No card applications found.
                    </p>

                ) : (

                    applications.map(
                        (application) => (

                            <div
                                key={application.id}
                                style={{
                                    border: "1px solid #ccc",
                                    padding: "20px",
                                    marginBottom: "15px",
                                    borderRadius: "10px"
                                }}
                            >

                                <p style={{ color: "#fff" }}>
                                    <strong>Application ID:</strong>{" "}
                                    {application.id}
                                </p>

                                <p style={{ color: "#fff" }}>
                                    <strong>User:</strong>{" "}
                                    {application.user?.name}
                                </p>

                                <p style={{ color: "#fff" }}>
                                    <strong>Email:</strong>{" "}
                                    {application.user?.email}
                                </p>

                                <p style={{ color: "#fff" }}>
                                    <strong>Card Type:</strong>{" "}
                                    {application.cardType}
                                </p>

                                <p style={{ color: "#fff" }}>
                                    <strong>Card Variant:</strong>{" "}
                                    {application.cardVariant}
                                </p>

                                <p style={{ color: "#fff" }}>
                                    <strong>Status:</strong>{" "}
                                    {application.status}
                                </p>

                                <p style={{ color: "#fff" }}>
                                    <strong>Applied At:</strong>{" "}
                                    {application.appliedAt}
                                </p>

                                {application.status === "PENDING" && (

                                    <div
                                        style={{
                                            marginTop: "15px"
                                        }}
                                    >

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateStatus(
                                                    application.id,
                                                    "APPROVED"
                                                )
                                            }
                                            style={{
                                                padding: "10px 20px",
                                                marginRight: "10px",
                                                border: "none",
                                                borderRadius: "6px",
                                                backgroundColor: "#333",
                                                color: "#fff",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Approve
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                updateStatus(
                                                    application.id,
                                                    "REJECTED"
                                                )
                                            }
                                            style={{
                                                padding: "10px 20px",
                                                marginRight: "10px",
                                                border: "none",
                                                borderRadius: "6px",
                                                backgroundColor: "#777",
                                                color: "#fff",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Reject
                                        </button>

                                    </div>
                                )}

                                {application.status === "APPROVED" && (

                                    isCardGenerated(
                                        application.id
                                    ) ? (

                                        <p
                                            style={{
                                                marginTop: "15px",
                                                fontWeight: "bold",
                                                color: "#fff"
                                            }}
                                        >
                                            Card Already Generated
                                        </p>

                                    ) : (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                generateCard(
                                                    application.id
                                                )
                                            }
                                            style={{
                                                padding: "10px 20px",
                                                marginTop: "10px",
                                                border: "none",
                                                borderRadius: "6px",
                                                backgroundColor: "#333",
                                                color: "#fff",
                                                cursor: "pointer"
                                            }}
                                        >
                                            Generate Card
                                        </button>
                                    )
                                )}

                            </div>
                        )
                    )
                )}

            </div>

        </div>
    );
}

export default AdminCards;