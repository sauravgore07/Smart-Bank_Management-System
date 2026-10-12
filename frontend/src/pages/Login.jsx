import { useState } from "react";

function Login({ onLoginSuccess, onRegister }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password
                    })
                }
            );

            const contentType =
                response.headers.get("content-type") || "";

            let data = {};

            if (contentType.includes("application/json")) {
                data = await response.json();
            } else {
                const text = await response.text();

                data = {
                    message: text
                };
            }

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Invalid email or password."
                );
            }

            const userData = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role
            };

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(userData)
            );

            onLoginSuccess(userData);

        } catch (err) {

            console.error("Login Error:", err);

            if (
                err instanceof TypeError &&
                err.message.includes("fetch")
            ) {

                setError(
                    "Unable to connect to server. Please make sure the Spring Boot backend is running on port 8080."
                );

            } else {

                setError(
                    err.message ||
                    "Something went wrong. Please try again."
                );
            }

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="login-container">

            <div className="login-box">

                <h2>Welcome Back</h2>

                <h3>
                    Login to continue to your account
                </h3>

                {error && (
                    <p
                        style={{
                            color: "var(--danger)",
                            background: "var(--danger-bg)",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            fontSize: "13px",
                            marginTop: 0,
                            marginBottom: "16px",
                        }}
                    >
                        {error}
                    </p>
                )}

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        autoComplete="username"
                    />

                    <div
                        style={{
                            position: "relative"
                        }}
                    >

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="current-password"
                            style={{
                                paddingRight: "42px"
                            }}
                        />

                        <span
                            onClick={() =>
                                setShowPassword(
                                    (prev) => !prev
                                )
                            }
                            style={{
                                position: "absolute",
                                right: "14px",
                                top: "13px",
                                cursor: "pointer",
                                fontSize: "13px",
                                color: "var(--text-muted)",
                                userSelect: "none"
                            }}
                        >
                            {showPassword
                                ? "Hide"
                                : "Show"}
                        </span>

                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Login"}
                    </button>

                </form>

                <p>
                    Forgot your password?
                </p>

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
                        Don't have an account?
                    </p>

                    <button
                        type="button"
                        onClick={onRegister}
                        style={{
                            width: "100%",
                            padding: "12px",
                            borderRadius: "10px",
                            border: "1px solid #6f42c1",
                            background: "transparent",
                            color: "#ffffff",
                            cursor: "pointer",
                            fontSize: "14px",
                            fontWeight: "600",
                            boxSizing: "border-box",
                            transition: "0.2s"
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                                "#6f42c1";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background =
                                "transparent";
                        }}
                    >
                        Register
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Login;