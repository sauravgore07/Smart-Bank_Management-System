
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function Notifications({ onBack }) {

    const [notifications, setNotifications] = useState([]);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                "http://localhost:8080/api/notifications",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setNotifications(response.data);

        } catch (error) {

            console.error(
                "Notification Error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load notifications"
            );

        } finally {

            setLoading(false);

        }
    };

    const markAsRead = async (id) => {

        try {

            setError("");
            setMessage("");

            await axios.put(
                `http://localhost:8080/api/notifications/${id}/read`,
{},
{
    headers: {
        Authorization: `Bearer ${token}`
    }
}
);

setMessage(
    "Notification marked as read"
);

await loadNotifications();

} catch (error) {

    console.error(
        "Mark Read Error:",
        error
    );

    setError(
        error.response?.data?.message ||
        "Failed to mark notification as read"
    );
}
};

const markAllAsRead = async () => {

    try {

        setError("");
        setMessage("");

        await axios.put(
            "http://localhost:8080/api/notifications/read-all",
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setMessage(
            "All notifications marked as read"
        );

        await loadNotifications();

    } catch (error) {

        console.error(
            "Mark All Read Error:",
            error
        );

        setError(
            error.response?.data?.message ||
            "Failed to mark notifications as read"
        );
    }
};

const unreadCount = notifications.filter(
    (notification) => !notification.read
).length;

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
                    Loading notifications...
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
            boxSizing: "border-box",
            overflowX: "hidden"
        }}
    >

        <div
            style={{
                maxWidth: "1100px",
                margin: "0 auto",
                width: "100%"
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
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                    boxSizing: "border-box"
                }}
            >

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "15px",
                        flexWrap: "wrap",
                        marginBottom: "8px"
                    }}
                >

                    <div>

                        <h1
                            style={{
                                marginTop: "0",
                                marginBottom: "8px",
                                color: "white"
                            }}
                        >
                            Notifications
                        </h1>

                        <p
                            style={{
                                color: "#aaa",
                                marginBottom: "0"
                            }}
                        >
                            View your account notifications and updates
                        </p>

                    </div>

                    {unreadCount > 0 && (

                        <div
                            style={{
                                padding: "10px 16px",
                                borderRadius: "20px",
                                backgroundColor: "#6f42c1",
                                color: "white",
                                fontWeight: "600"
                            }}
                        >
                            {unreadCount} Unread
                        </div>
                    )}

                </div>

                {message && (

                    <div
                        style={{
                            padding: "12px",
                            marginTop: "25px",
                            marginBottom: "20px",
                            borderRadius: "6px",
                            backgroundColor: "#1b1b24",
                            border: "1px solid #444",
                            color: "#4caf50",
                            overflowWrap: "anywhere"
                        }}
                    >
                        {message}
                    </div>
                )}

                {error && (

                    <div
                        style={{
                            padding: "12px",
                            marginTop: "25px",
                            marginBottom: "20px",
                            borderRadius: "6px",
                            backgroundColor: "#1b1b24",
                            border: "1px solid #444",
                            color: "#f44336",
                            overflowWrap: "anywhere"
                        }}
                    >
                        {error}
                    </div>
                )}

                {notifications.length > 0 && (

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            marginTop: "25px",
                            marginBottom: "20px"
                        }}
                    >

                        <button
                            onClick={markAllAsRead}
                            style={{
                                padding: "11px 20px",
                                border: "none",
                                borderRadius: "6px",
                                backgroundColor: "#6f42c1",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Mark All as Read
                        </button>

                    </div>
                )}

                {notifications.length === 0 ? (

                    <div
                        style={{
                            padding: "30px 20px",
                            border: "1px solid #333",
                            borderRadius: "8px",
                            color: "#aaa",
                            textAlign: "center",
                            backgroundColor: "#0d0d12",
                            marginTop: "25px"
                        }}
                    >
                        No notifications found.
                    </div>

                ) : (

                    <div
                        style={{
                            marginTop: "10px"
                        }}
                    >

                        {notifications.map(
                            (notification) => (

                                <div
                                    key={notification.id}
                                    style={{
                                        border: notification.read
                                            ? "1px solid #444"
                                            : "1px solid #6f42c1",
                                        padding: "25px",
                                        marginBottom: "20px",
                                        borderRadius: "12px",
                                        backgroundColor: "#15151d",
                                        boxShadow: "0 4px 15px rgba(0,0,0,0.35)"
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "flex-start",
                                            gap: "15px",
                                            flexWrap: "wrap"
                                        }}
                                    >

                                        <div
                                            style={{
                                                flex: "1",
                                                minWidth: "250px"
                                            }}
                                        >

                                            <h2
                                                style={{
                                                    marginTop: "0",
                                                    color: "white",
                                                    fontSize: "18px",
                                                    lineHeight: "1.5"
                                                }}
                                            >
                                                {notification.message}
                                            </h2>

                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "repeat(auto-fit, minmax(220px, 1fr))",
                                                    gap: "18px",
                                                    marginTop: "20px"
                                                }}
                                            >

                                                <div>

                                                        <span
                                                            style={{
                                                                color: "#888",
                                                                fontSize: "13px"
                                                            }}
                                                        >
                                                            Notification Type
                                                        </span>

                                                    <p
                                                        style={{
                                                            color: "white",
                                                            marginTop: "5px"
                                                        }}
                                                    >
                                                        {notification.type}
                                                    </p>

                                                </div>

                                                <div>

                                                        <span
                                                            style={{
                                                                color: "#888",
                                                                fontSize: "13px"
                                                            }}
                                                        >
                                                            Date
                                                        </span>

                                                    <p
                                                        style={{
                                                            color: "white",
                                                            marginTop: "5px"
                                                        }}
                                                    >
                                                        {notification.createdAt
                                                            ? new Date(
                                                                notification.createdAt
                                                            ).toLocaleString()
                                                            : "N/A"}
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
                                                            color: notification.read
                                                                ? "#4caf50"
                                                                : "#ff9800",
                                                            marginTop: "5px",
                                                            fontWeight: "600"
                                                        }}
                                                    >
                                                        {notification.read
                                                            ? "Read"
                                                            : "Unread"}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                        {!notification.read && (

                                            <button
                                                onClick={() =>
                                                    markAsRead(
                                                        notification.id
                                                    )
                                                }
                                                style={{
                                                    padding: "11px 20px",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    backgroundColor: "#1976d2",
                                                    color: "white",
                                                    cursor: "pointer",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                Mark as Read
                                            </button>

                                        )}

                                    </div>

                                </div>
                            )
                        )}

                    </div>
                )}

            </div>

        </div>

    </div>
);
}

export default Notifications;

