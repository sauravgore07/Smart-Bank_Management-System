import { useEffect, useState } from "react";
import axios from "axios";

function AdminNotifications() {

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
                "Admin Notification Error:",
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

            setMessage("Notification marked as read");

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

            setMessage("All notifications marked as read");

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

    return (
        <div
            style={{
                backgroundColor: "#17171d",
                border: "1px solid #333",
                borderRadius: "14px",
                padding: "30px",
                color: "white"
            }}
        >

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "15px",
                    marginBottom: "25px"
                }}
            >

                <div>

                    <h2
                        style={{
                            margin: "0 0 8px 0",
                            color: "white"
                        }}
                    >
                        🔔 Notifications
                    </h2>

                    <p
                        style={{
                            margin: "0",
                            color: "#aaa"
                        }}
                    >
                        Total Notifications: {notifications.length}
                    </p>

                    <p
                        style={{
                            margin: "5px 0 0 0",
                            color: "#cddc39"
                        }}
                    >
                        Unread Notifications: {unreadCount}
                    </p>

                </div>

                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        style={{
                            padding: "10px 18px",
                            backgroundColor: "#cddc39",
                            color: "#111",
                            border: "none",
                            borderRadius: "7px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Mark All as Read
                    </button>
                )}

            </div>

            {message && (
                <div
                    style={{
                        backgroundColor: "#1f3d24",
                        border: "1px solid #4caf50",
                        color: "#8df59a",
                        padding: "12px",
                        borderRadius: "7px",
                        marginBottom: "15px"
                    }}
                >
                    {message}
                </div>
            )}

            {error && (
                <div
                    style={{
                        backgroundColor: "#3d1f1f",
                        border: "1px solid #e74c3c",
                        color: "#ff8a80",
                        padding: "12px",
                        borderRadius: "7px",
                        marginBottom: "15px"
                    }}
                >
                    {error}
                </div>
            )}

            {loading ? (

                <p style={{ color: "#aaa" }}>
                    Loading notifications...
                </p>

            ) : notifications.length === 0 ? (

                <div
                    style={{
                        textAlign: "center",
                        padding: "40px 20px",
                        color: "#888",
                        border: "1px solid #333",
                        borderRadius: "10px"
                    }}
                >
                    <div
                        style={{
                            fontSize: "40px",
                            marginBottom: "10px"
                        }}
                    >
                        🔔
                    </div>

                    <p>
                        No notifications found.
                    </p>
                </div>

            ) : (

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px"
                    }}
                >

                    {notifications.map((notification) => (

                        <div
                            key={notification.id}
                            style={{
                                backgroundColor:
                                    notification.read
                                        ? "#202027"
                                        : "#29291f",
                                border:
                                    notification.read
                                        ? "1px solid #333"
                                        : "1px solid #cddc39",
                                borderRadius: "10px",
                                padding: "18px"
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
                                        flex: "1"
                                    }}
                                >

                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            marginBottom: "8px"
                                        }}
                                    >

                                        <strong
                                            style={{
                                                color: "white",
                                                fontSize: "16px"
                                            }}
                                        >
                                            {notification.message}
                                        </strong>

                                        {!notification.read && (
                                            <span
                                                style={{
                                                    backgroundColor: "#cddc39",
                                                    color: "#111",
                                                    padding: "3px 8px",
                                                    borderRadius: "12px",
                                                    fontSize: "11px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                NEW
                                            </span>
                                        )}

                                    </div>

                                    <p
                                        style={{
                                            margin: "5px 0",
                                            color: "#aaa",
                                            fontSize: "13px"
                                        }}
                                    >
                                        Type: {notification.type}
                                    </p>

                                    <p
                                        style={{
                                            margin: "5px 0",
                                            color: "#888",
                                            fontSize: "13px"
                                        }}
                                    >
                                        Date:{" "}
                                        {notification.createdAt
                                            ? new Date(
                                                notification.createdAt
                                            ).toLocaleString()
                                            : "N/A"}
                                    </p>

                                </div>

                                {!notification.read && (

                                    <button
                                        onClick={() =>
                                            markAsRead(
                                                notification.id
                                            )
                                        }
                                        style={{
                                            padding: "8px 14px",
                                            backgroundColor: "#333",
                                            color: "white",
                                            border: "1px solid #555",
                                            borderRadius: "6px",
                                            cursor: "pointer",
                                            fontSize: "13px"
                                        }}
                                    >
                                        Mark as Read
                                    </button>

                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default AdminNotifications;