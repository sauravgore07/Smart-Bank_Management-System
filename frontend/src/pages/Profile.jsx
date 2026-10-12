
import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import BackButton from "../components/BackButton";

function Profile({ onChangePassword }) {

    const [profile, setProfile] = useState(null);
    const [photoUrl, setPhotoUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [accounts, setAccounts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const API_URL = "http://localhost:8080/api/profile";
    const ACCOUNT_API_URL = "http://localhost:8080/api/accounts";

    const user = JSON.parse(localStorage.getItem("user"));

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setProfile(response.data);
        } catch (err) {
            console.error(err);
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const loadPhoto = async () => {
        try {
            const response = await axios.get(
                `${API_URL}/photo`,
{
    headers: {
        Authorization: `Bearer ${token}`
    },
    responseType: "blob"
}
);

const imageUrl = URL.createObjectURL(response.data);

setPhotoUrl((oldUrl) => {
    if (oldUrl) {
        URL.revokeObjectURL(oldUrl);
    }

    return imageUrl;
});
} catch (err) {
    setPhotoUrl("");
}
};

const loadAccounts = async () => {
    try {
        if (!user || !user.id) {
            return;
        }

        const response = await axios.get(
            `${ACCOUNT_API_URL}/user/${user.id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setAccounts(response.data);
    } catch (err) {
        console.error(err);
        setError("Failed to load accounts");
    }
};

useEffect(() => {
    if (token) {
        loadProfile();
        loadPhoto();
        loadAccounts();
    } else {
        setLoading(false);
        setError("Please login first");
    }
}, []);

useEffect(() => {
    return () => {
        if (photoUrl) {
            URL.revokeObjectURL(photoUrl);
        }
    };
}, [photoUrl]);

const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        setSelectedFile(null);
        return;
    }

    setSelectedFile(file);
    setError("");
    setMessage("");
};

const handleUploadPhoto = async () => {
    if (!selectedFile) {
        setError("Please select a photo first");
        return;
    }

    try {
        setError("");
        setMessage("");

        const formData = new FormData();
        formData.append("file", selectedFile);

        const response = await axios.post(
            `${API_URL}/photo`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setMessage(response.data);
        setSelectedFile(null);

        await loadPhoto();
    } catch (err) {
        console.error(err);

        if (err.response && err.response.data) {
            setError(err.response.data);
        } else {
            setError("Failed to upload profile photo");
        }
    }
};

const handleRemovePhoto = async () => {
    try {
        setError("");
        setMessage("");

        const response = await axios.delete(
            `${API_URL}/photo`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setMessage(response.data);
        setPhotoUrl("");
        setSelectedFile(null);
    } catch (err) {
        console.error(err);
        setError("Failed to remove profile photo");
    }
};

const getQrUrl = (accountNumber) => {
    return `${window.location.origin}/account-info/${accountNumber}`;
};

if (loading) {
    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#0d0d12",
                color: "white",
                padding: "30px",
                boxSizing: "border-box",
                overflowX: "hidden"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >
                <BackButton />
            </div>

            <div
                style={{
                    maxWidth: "1100px",
                    width: "100%",
                    margin: "40px auto",
                    boxSizing: "border-box"
                }}
            >
                <h2>Loading Profile...</h2>
            </div>
        </div>
    );
}

if (!profile) {
    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                backgroundColor: "#0d0d12",
                color: "white",
                padding: "30px",
                boxSizing: "border-box",
                overflowX: "hidden"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >
                <BackButton />
            </div>

            <div
                style={{
                    maxWidth: "1100px",
                    width: "100%",
                    margin: "40px auto",
                    textAlign: "center",
                    boxSizing: "border-box"
                }}
            >
                <h2>Profile not found</h2>

                <p style={{ color: "#f44336" }}>
                    {error}
                </p>
            </div>
        </div>
    );
}

return (
    <div
        style={{
            minHeight: "100vh",
            width: "100%",
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
                width: "100%",
                margin: "0 auto",
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
                <BackButton />
            </div>

            <div
                style={{
                    border: "1px solid #333",
                    borderRadius: "12px",
                    padding: "25px",
                    backgroundColor: "#111118",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                    width: "100%",
                    boxSizing: "border-box",
                    overflow: "hidden"
                }}
            >

                <h1
                    style={{
                        marginTop: "0",
                        marginBottom: "8px",
                        color: "white",
                        wordBreak: "break-word"
                    }}
                >
                    My Profile
                </h1>

                <p
                    style={{
                        color: "#aaa",
                        marginBottom: "25px",
                        lineHeight: "1.6"
                    }}
                >
                    Manage your profile information and account QR codes
                </p>

                {message && (
                    <div
                        style={{
                            padding: "12px",
                            marginBottom: "20px",
                            borderRadius: "6px",
                            backgroundColor: "#1b1b24",
                            border: "1px solid #444",
                            color: "#4caf50",
                            overflowWrap: "anywhere",
                            lineHeight: "1.5"
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
                            backgroundColor: "#1b1b24",
                            border: "1px solid #444",
                            color: "#f44336",
                            overflowWrap: "anywhere",
                            lineHeight: "1.5"
                        }}
                    >
                        {error}
                    </div>
                )}

                <div
                    style={{
                        border: "1px solid #444",
                        borderRadius: "12px",
                        padding: "25px",
                        marginBottom: "25px",
                        backgroundColor: "#15151d",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                >
                    <h2
                        style={{
                            marginTop: "0",
                            color: "white",
                            fontSize: "20px"
                        }}
                    >
                        Profile Photo
                    </h2>

                    <div
                        style={{
                            textAlign: "center",
                            marginTop: "20px",
                            marginBottom: "20px"
                        }}
                    >
                        {photoUrl ? (
                            <img
                                src={photoUrl}
                                alt="Profile"
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    maxWidth: "100%",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "4px solid #444"
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: "150px",
                                    height: "150px",
                                    maxWidth: "100%",
                                    borderRadius: "50%",
                                    backgroundColor: "#252530",
                                    margin: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: "60px",
                                    color: "#888",
                                    border: "4px solid #444",
                                    boxSizing: "border-box"
                                }}
                            >
                                👤
                            </div>
                        )}
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: "10px",
                            flexWrap: "wrap",
                            width: "100%",
                            boxSizing: "border-box"
                        }}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{
                                color: "#ccc",
                                maxWidth: "100%",
                                minWidth: "0"
                            }}
                        />

                        <button
                            onClick={handleUploadPhoto}
                            style={{
                                padding: "11px 20px",
                                border: "none",
                                borderRadius: "6px",
                                backgroundColor: "#1976d2",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: "600",
                                whiteSpace: "nowrap"
                            }}
                        >
                            {photoUrl ? "Change Photo" : "Upload Photo"}
                        </button>

                        {photoUrl && (
                            <button
                                onClick={handleRemovePhoto}
                                style={{
                                    padding: "11px 20px",
                                    border: "none",
                                    borderRadius: "6px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Remove Photo
                            </button>
                        )}
                    </div>

                    {selectedFile && (
                        <p
                            style={{
                                marginTop: "12px",
                                color: "#aaa",
                                textAlign: "right",
                                overflowWrap: "anywhere"
                            }}
                        >
                            Selected: {selectedFile.name}
                        </p>
                    )}
                </div>

                <div
                    style={{
                        border: "1px solid #444",
                        borderRadius: "12px",
                        padding: "25px",
                        marginBottom: "25px",
                        backgroundColor: "#15151d",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                >
                    <h2
                        style={{
                            marginTop: "0",
                            color: "white",
                            fontSize: "20px"
                        }}
                    >
                        Profile Information
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fit, minmax(min(250px, 100%), 1fr))",
                            gap: "20px",
                            width: "100%"
                        }}
                    >
                        <div
                            style={{
                                minWidth: "0",
                                padding: "5px 0"
                            }}
                        >
                                <span
                                    style={{
                                        color: "#888",
                                        fontSize: "13px"
                                    }}
                                >
                                    Name
                                </span>

                            <p
                                style={{
                                    color: "white",
                                    marginTop: "7px",
                                    marginBottom: "0",
                                    fontWeight: "500",
                                    overflowWrap: "anywhere",
                                    wordBreak: "break-word",
                                    lineHeight: "1.5"
                                }}
                            >
                                {profile.name || "N/A"}
                            </p>
                        </div>

                        <div
                            style={{
                                minWidth: "0",
                                padding: "5px 0"
                            }}
                        >
                                <span
                                    style={{
                                        color: "#888",
                                        fontSize: "13px"
                                    }}
                                >
                                    Email
                                </span>

                            <p
                                style={{
                                    color: "white",
                                    marginTop: "7px",
                                    marginBottom: "0",
                                    fontWeight: "500",
                                    overflowWrap: "anywhere",
                                    wordBreak: "break-word",
                                    lineHeight: "1.5"
                                }}
                            >
                                {profile.email || "N/A"}
                            </p>
                        </div>

                        <div
                            style={{
                                minWidth: "0",
                                padding: "5px 0"
                            }}
                        >
                                <span
                                    style={{
                                        color: "#888",
                                        fontSize: "13px"
                                    }}
                                >
                                    Role
                                </span>

                            <p
                                style={{
                                    color: "#4caf50",
                                    marginTop: "7px",
                                    marginBottom: "0",
                                    fontWeight: "600",
                                    overflowWrap: "anywhere"
                                }}
                            >
                                {profile.role || "N/A"}
                            </p>
                        </div>

                        <div
                            style={{
                                minWidth: "0",
                                padding: "5px 0"
                            }}
                        >
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
                                    color: profile.active
                                        ? "#4caf50"
                                        : "#f44336",
                                    marginTop: "7px",
                                    marginBottom: "0",
                                    fontWeight: "600"
                                }}
                            >
                                {profile.active
                                    ? "Active"
                                    : "Inactive"}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        border: "1px solid #444",
                        borderRadius: "12px",
                        padding: "25px",
                        marginBottom: "25px",
                        backgroundColor: "#15151d",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                >
                    <h2
                        style={{
                            marginTop: "0",
                            color: "white",
                            fontSize: "20px"
                        }}
                    >
                        My Account QR Codes
                    </h2>

                    <p
                        style={{
                            color: "#aaa",
                            fontSize: "14px",
                            marginBottom: "25px",
                            lineHeight: "1.5"
                        }}
                    >
                        Scan the QR code to view account information
                    </p>

                    {accounts.length === 0 ? (
                        <div
                            style={{
                                padding: "20px",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "#aaa",
                                textAlign: "center",
                                overflowWrap: "anywhere"
                            }}
                        >
                            No accounts found
                        </div>
                    ) : (
                        accounts.map((account) => (
                            <div
                                key={account.id}
                                style={{
                                    marginTop: "20px",
                                    padding: "25px",
                                    border: "1px solid #444",
                                    borderRadius: "12px",
                                    backgroundColor: "#0d0d12",
                                    textAlign: "center",
                                    width: "100%",
                                    boxSizing: "border-box",
                                    overflow: "hidden"
                                }}
                            >
                                <h3
                                    style={{
                                        color: "white",
                                        marginTop: "0",
                                        marginBottom: "20px",
                                        overflowWrap: "anywhere",
                                        wordBreak: "break-word"
                                    }}
                                >
                                    {account.accountNumber}
                                </h3>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginBottom: "20px",
                                        maxWidth: "100%"
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: "15px",
                                            backgroundColor: "white",
                                            borderRadius: "10px",
                                            maxWidth: "100%",
                                            boxSizing: "border-box"
                                        }}
                                    >
                                        <QRCodeCanvas
                                            value={getQrUrl(
                                                account.accountNumber
                                            )}
                                            size={200}
                                            level="H"
                                        />
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
                                        gap: "20px",
                                        textAlign: "center",
                                        width: "100%"
                                    }}
                                >
                                    <div style={{ minWidth: "0" }}>
                                            <span
                                                style={{
                                                    color: "#888",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                Account Type
                                            </span>

                                        <p
                                            style={{
                                                color: "white",
                                                marginTop: "7px",
                                                marginBottom: "0",
                                                overflowWrap: "anywhere",
                                                wordBreak: "break-word",
                                                fontWeight: "500"
                                            }}
                                        >
                                            {account.accountType}
                                        </p>
                                    </div>

                                    <div style={{ minWidth: "0" }}>
                                            <span
                                                style={{
                                                    color: "#888",
                                                    fontSize: "13px"
                                                }}
                                            >
                                                Customer
                                            </span>

                                        <p
                                            style={{
                                                color: "white",
                                                marginTop: "7px",
                                                marginBottom: "0",
                                                overflowWrap: "anywhere",
                                                wordBreak: "break-word",
                                                fontWeight: "500"
                                            }}
                                        >
                                            {account.customerName}
                                        </p>
                                    </div>
                                </div>

                                <p
                                    style={{
                                        fontSize: "12px",
                                        color: "#777",
                                        marginTop: "20px",
                                        marginBottom: "0",
                                        lineHeight: "1.5"
                                    }}
                                >
                                    Scan this QR to view account details
                                </p>
                            </div>
                        ))
                    )}
                </div>

                <div
                    style={{
                        border: "1px solid #444",
                        borderRadius: "12px",
                        padding: "25px",
                        backgroundColor: "#15151d",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.35)",
                        width: "100%",
                        boxSizing: "border-box"
                    }}
                >
                    <h2
                        style={{
                            marginTop: "0",
                            color: "white",
                            fontSize: "20px"
                        }}
                    >
                        Security
                    </h2>

                    <p
                        style={{
                            color: "#aaa",
                            marginBottom: "20px",
                            lineHeight: "1.6"
                        }}
                    >
                        Keep your account secure by changing your password regularly.
                    </p>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            width: "100%"
                        }}
                    >
                        <button
                            onClick={onChangePassword}
                            style={{
                                padding: "12px 25px",
                                border: "none",
                                borderRadius: "6px",
                                backgroundColor: "#6f42c1",
                                color: "white",
                                fontSize: "15px",
                                fontWeight: "600",
                                cursor: "pointer",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Change Password
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
);
}

export default Profile;
