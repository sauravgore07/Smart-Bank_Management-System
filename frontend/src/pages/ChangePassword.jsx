import { useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function ChangePassword({ onBack }) {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e) => {

        e.preventDefault();

        setMessage("");
        setError("");

        if (!currentPassword.trim()) {
            setError("Please enter current password");
            return;
        }

        if (!newPassword.trim()) {
            setError("Please enter new password");
            return;
        }

        if (!confirmPassword.trim()) {
            setError("Please confirm new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New password and confirm password do not match");
            return;
        }

        if (newPassword === currentPassword) {
            setError("New password must be different from current password");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setError("You are not logged in. Please login again.");
            return;
        }

        try {

            setLoading(true);

            const response = await axios.post(
                "http://localhost:8080/api/auth/change-password",
                {
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setMessage(
                response.data || "Password changed successfully"
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (error) {

            console.error("Change Password Error:", error);

            if (error.response) {

                if (typeof error.response.data === "string") {

                    setError(error.response.data);

                } else {

                    setError(
                        error.response.data?.message ||
                        "Unable to change password"
                    );
                }

            } else if (error.request) {

                setError(
                    "Unable to connect to backend server"
                );

            } else {

                setError(
                    "Something went wrong"
                );
            }

        } finally {

            setLoading(false);
        }
    };

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
                    maxWidth: "700px",
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
                        padding: "30px",
                        backgroundColor: "#111118",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                        position: "relative",
                        zIndex: 1
                    }}
                >

                    <h1
                        style={{
                            marginTop: "0",
                            marginBottom: "8px",
                            color: "white"
                        }}
                    >
                        Change Password
                    </h1>

                    <p
                        style={{
                            color: "#aaa",
                            marginTop: "0",
                            marginBottom: "25px"
                        }}
                    >
                        Update your account password securely.
                    </p>

                    <hr
                        style={{
                            border: "none",
                            borderTop: "1px solid #333",
                            marginBottom: "25px"
                        }}
                    />

                    {message && (
                        <div
                            style={{
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "6px",
                                backgroundColor: "#132519",
                                border: "1px solid #2e7d32",
                                color: "#4caf50"
                            }}
                        >
                            {message}
                        </div>
                    )}

                    {error && (
                        <div
                            style={{
                                padding: "12px",
                                marginBottom: "20px",
                                borderRadius: "6px",
                                backgroundColor: "#281416",
                                border: "1px solid #8b2c32",
                                color: "#ff6b6b"
                            }}
                        >
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleChangePassword}>

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    color: "white",
                                    fontWeight: "600",
                                    marginBottom: "8px"
                                }}
                            >
                                Current Password
                            </label>

                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) =>
                                    setCurrentPassword(e.target.value)
                                }
                                placeholder="Enter current password"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "13px",
                                    boxSizing: "border-box",
                                    backgroundColor: "#0d0d12",
                                    color: "white",
                                    border: "1px solid #444",
                                    borderRadius: "6px",
                                    outline: "none",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <div
                            style={{
                                marginBottom: "20px"
                            }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    color: "white",
                                    fontWeight: "600",
                                    marginBottom: "8px"
                                }}
                            >
                                New Password
                            </label>

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) =>
                                    setNewPassword(e.target.value)
                                }
                                placeholder="Enter new password"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "13px",
                                    boxSizing: "border-box",
                                    backgroundColor: "#0d0d12",
                                    color: "white",
                                    border: "1px solid #444",
                                    borderRadius: "6px",
                                    outline: "none",
                                    fontSize: "14px"
                                }}
                            />
                        </div>

                        <div
                            style={{
                                marginBottom: "25px"
                            }}
                        >
                            <label
                                style={{
                                    display: "block",
                                    color: "white",
                                    fontWeight: "600",
                                    marginBottom: "8px"
                                }}
                            >
                                Confirm New Password
                            </label>

                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                placeholder="Confirm new password"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    padding: "13px",
                                    boxSizing: "border-box",
                                    backgroundColor: "#0d0d12",
                                    color: "white",
                                    border: "1px solid #444",
                                    borderRadius: "6px",
                                    outline: "none",
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
                                type="submit"
                                disabled={loading}
                                style={{
                                    padding: "12px 25px",
                                    border: "none",
                                    borderRadius: "6px",
                                    backgroundColor: loading
                                        ? "#555"
                                        : "#6f42c1",
                                    color: "white",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    cursor: loading
                                        ? "not-allowed"
                                        : "pointer"
                                }}
                            >
                                {loading
                                    ? "Changing Password..."
                                    : "Change Password"}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default ChangePassword;