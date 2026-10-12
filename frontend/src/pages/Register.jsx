import { useState } from "react";
import axios from "axios";

function Register({ onLogin }) {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {

            const response = await axios.post(
                "http://localhost:8080/api/auth/register",
                {
                    name: name,
                    email: email,
                    password: password
                }
            );

            setMessage("Registration successful! Please login.");

            setName("");
            setEmail("");
            setPassword("");

            console.log("Register Response:", response.data);

        } catch (error) {

            if (error.response) {
                setMessage(
                    error.response.data.message ||
                    "Registration failed"
                );
            } else {
                setMessage(
                    "Backend server is not running"
                );
            }
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h2>Banking Management System</h2>

                <h3>Register</h3>

                <form onSubmit={handleRegister}>

                    <input
                        type="text"
                        placeholder="Enter Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Register
                    </button>

                </form>

                {message && (
                    <p
                        style={{
                            color: "#4caf50",
                            backgroundColor: "#1b1b24",
                            border: "1px solid #333",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            textAlign: "center",
                            marginTop: "15px",
                            fontSize: "14px"
                        }}
                    >
                        {message}
                    </p>
                )}

                <div
                    style={{
                        marginTop: "22px",
                        paddingTop: "20px",
                        borderTop: "1px solid #333",
                        textAlign: "center"
                    }}
                >

                    <p
                        style={{
                            margin: "0 0 12px 0",
                            color: "var(--text-muted)",
                            fontSize: "14px"
                        }}
                    >
                        Already have an account?
                    </p>

                    <button
                        type="button"
                        onClick={onLogin}
                        style={{
                            width: "100%",
                            padding: "12px 16px",
                            marginTop: "0",
                            borderRadius: "10px",
                            border: "1px solid #6f42c1",
                            backgroundColor: "#6f42c1",
                            color: "#ffffff",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600",
                            boxSizing: "border-box",
                            transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "#59339d";
                            e.currentTarget.style.borderColor =
                                "#59339d";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                                "#6f42c1";
                            e.currentTarget.style.borderColor =
                                "#6f42c1";
                        }}
                    >
                        Login
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Register;