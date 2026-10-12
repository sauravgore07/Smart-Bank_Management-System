import { useEffect, useState } from "react";
import axios from "axios";

function AdminUsers() {

    const [users, setUsers] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {

        try {

            setLoading(true);
            setMessage("");

            const response = await axios.get(
                "http://localhost:8080/api/admin/users",
                {
                    headers
                }
            );

            setUsers(response.data);

        } catch (error) {

            console.error("Admin User Fetch Error:", error);

            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    `Error ${error.response.status}: Unable to load users`
                );

            } else {

                setMessage("Backend server is not running");
            }

        } finally {

            setLoading(false);
        }
    };

    const searchUsers = async () => {

        try {

            setMessage("");

            if (!keyword.trim()) {
                await fetchUsers();
                return;
            }

            const response = await axios.get(
                "http://localhost:8080/api/admin/users/search",
                {
                    params: {
                        keyword: keyword.trim()
                    },
                    headers
                }
            );

            setUsers(response.data);

        } catch (error) {

            console.error("User Search Error:", error);

            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    `Error ${error.response.status}: Search failed`
                );

            } else {

                setMessage("Backend server is not running");
            }
        }
    };

    const updateUserStatus = async (userId, active) => {

        try {

            setMessage("");

            const url = active
                ? `http://localhost:8080/api/admin/users/${userId}/activate`
                : `http://localhost:8080/api/admin/users/${userId}/deactivate`;

            console.log("Updating User ID:", userId);
            console.log("Active:", active);
            console.log("API URL:", url);

            const response = await axios.put(
                url,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("Status Update Response:", response.data);

            setMessage(
                active
                    ? "User activated successfully"
                    : "User deactivated successfully"
            );

            await fetchUsers();

        } catch (error) {

            console.error("User Status Error:", error);
            console.error("Response:", error.response?.data);
            console.error("Status:", error.response?.status);

            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    `Error ${error.response.status}: Unable to update user`
                );

            } else {

                setMessage("Backend server is not running");
            }
        }
    };

    if (loading) {

        return (
            <div
                style={{
                    padding: "40px",
                    color: "#fff"
                }}
            >

                <h2>
                    Loading Users...
                </h2>

            </div>
        );
    }

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "1100px",
                margin: "auto",
                color: "#fff"
            }}
        >

            <h1>
                Admin User Management
            </h1>

            {message && (
                <p
                    style={{
                        padding: "10px",
                        border: "1px solid #ccc",
                        color: "#fff"
                    }}
                >
                    {message}
                </p>
            )}

            <hr />

            <div
                style={{
                    marginBottom: "20px"
                }}
            >

                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={keyword}
                    onChange={(e) =>
                        setKeyword(e.target.value)
                    }
                    style={{
                        padding: "10px",
                        width: "300px",
                        backgroundColor: "transparent",
                        color: "#fff",
                        border: "1px solid #aaa"
                    }}
                />

                <button
                    onClick={searchUsers}
                    style={{
                        marginLeft: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#333",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Search
                </button>

                <button
                    onClick={fetchUsers}
                    style={{
                        marginLeft: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#f39c12",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer"
                    }}
                >
                    Show All
                </button>

            </div>

            <h2>
                Registered Users
            </h2>

            {users.length === 0 ? (

                <p>
                    No users found.
                </p>

            ) : (

                users.map((user) => (

                    <div
                        key={user.id}
                        style={{
                            border: "1px solid #555",
                            padding: "20px",
                            marginBottom: "15px",
                            borderRadius: "10px"
                        }}
                    >

                        <p>
                            <strong>User ID:</strong>{" "}
                            {user.id}
                        </p>

                        <p>
                            <strong>Name:</strong>{" "}
                            {user.name}
                        </p>

                        <p>
                            <strong>Email:</strong>{" "}
                            {user.email}
                        </p>

                        <p>
                            <strong>Phone:</strong>{" "}
                            {user.phoneNumber || "N/A"}
                        </p>

                        <p>
                            <strong>Role:</strong>{" "}
                            {user.role}
                        </p>

                        <p>
                            <strong>Status:</strong>{" "}
                            {user.active
                                ? "ACTIVE"
                                : "INACTIVE"
                            }
                        </p>

                        {user.active ? (

                            <button
                                onClick={() =>
                                    updateUserStatus(
                                        user.id,
                                        false
                                    )
                                }
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#333",
                                    color: "#fff",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Deactivate
                            </button>

                        ) : (

                            <button
                                onClick={() =>
                                    updateUserStatus(
                                        user.id,
                                        true
                                    )
                                }
                                style={{
                                    padding: "10px 20px",
                                    backgroundColor: "#f39c12",
                                    color: "#fff",
                                    border: "none",
                                    cursor: "pointer"
                                }}
                            >
                                Activate
                            </button>

                        )}

                    </div>
                ))
            )}

        </div>
    );
}

export default AdminUsers;