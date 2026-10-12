import { useEffect, useState } from "react";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import BackButton from "../components/BackButton";

function Account({ onChangePassword, onBack }) {

    const [accounts, setAccounts] = useState([]);
    const [profile, setProfile] = useState(null);
    const [photoUrl, setPhotoUrl] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    let user = null;

    try {
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
            user = JSON.parse(savedUser);
        }
    } catch (error) {
        console.error("User data error:", error);
        user = null;
    }

    const token = localStorage.getItem("token");

    const API_URL = "http://localhost:8080/api/profile";
    const ACCOUNT_API_URL = "http://localhost:8080/api/accounts";

    useEffect(() => {
        fetchAccounts();
        fetchProfile();
        loadPhoto();
    }, []);

    useEffect(() => {
        return () => {
            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }
        };
    }, [photoUrl]);

    const fetchAccounts = async () => {

        try {

            if (!user?.id) {
                setMessage("User information not found");
                setLoading(false);
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

        } catch (error) {

            console.error("Account Error:", error);

            if (error.response) {

                setMessage(
                    `Error ${error.response.status}: Unable to load accounts`
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

    const fetchProfile = async () => {

        try {

            const response = await axios.get(
                API_URL,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProfile(response.data);

        } catch (error) {

            console.error("Profile Error:", error);
            setError("Failed to load profile");

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

            const imageUrl = URL.createObjectURL(
                response.data
            );

            setPhotoUrl((oldUrl) => {

                if (oldUrl) {
                    URL.revokeObjectURL(oldUrl);
                }

                return imageUrl;
            });

        } catch (error) {

            setPhotoUrl("");
        }
    };

    const handleFileChange = (event) => {

        const file = event.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {

            setError(
                "Please select an image file"
            );

            setSelectedFile(null);

            return;
        }

        setSelectedFile(file);
        setError("");
        setMessage("");
    };

    const handleUploadPhoto = async () => {

        if (!selectedFile) {

            setError(
                "Please select a photo first"
            );

            return;
        }

        try {

            setError("");
            setMessage("");

            const formData = new FormData();

            formData.append(
                "file",
                selectedFile
            );

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

        } catch (error) {

            console.error(
                "Upload Photo Error:",
                error
            );

            if (
                error.response &&
                error.response.data
            ) {

                setError(
                    error.response.data
                );

            } else {

                setError(
                    "Failed to upload profile photo"
                );
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

        } catch (error) {

            console.error(
                "Remove Photo Error:",
                error
            );

            setError(
                "Failed to remove profile photo"
            );
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
                        Loading account...
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

                    <h1
                        style={{
                            marginTop: "0",
                            marginBottom: "8px",
                            color: "white"
                        }}
                    >
                        My Account
                    </h1>

                    <p
                        style={{
                            color: "#aaa",
                            marginBottom: "25px"
                        }}
                    >
                        View and manage your account and profile information
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

                    {profile && (

                        <div
                            style={{
                                border: "1px solid #444",
                                padding: "25px",
                                marginBottom: "25px",
                                borderRadius: "12px",
                                backgroundColor: "#15151d",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.35)"
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
                                    flexWrap: "wrap"
                                }}
                            >

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{
                                        color: "#ccc",
                                        maxWidth: "100%"
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
                                        fontWeight: "600"
                                    }}
                                >
                                    {photoUrl
                                        ? "Change Photo"
                                        : "Upload Photo"}
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
                                            fontWeight: "600"
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
                    )}

                    {accounts.length === 0 ? (

                        <div
                            style={{
                                padding: "20px",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "#aaa",
                                textAlign: "center",
                                backgroundColor: "#0d0d12",
                                marginBottom: "25px"
                            }}
                        >
                            No account found.
                        </div>

                    ) : (

                        <div
                            style={{
                                border: "1px solid #444",
                                padding: "25px",
                                marginBottom: "25px",
                                borderRadius: "12px",
                                backgroundColor: "#15151d",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.35)"
                            }}
                        >

                            <h2
                                style={{
                                    marginTop: "0",
                                    color: "white",
                                    fontSize: "20px"
                                }}
                            >
                                Account Details
                            </h2>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "18px"
                                }}
                            >

                                <div>
                                    <span
                                        style={{
                                            color: "#888",
                                            fontSize: "13px"
                                        }}
                                    >
                                        Account Number
                                    </span>

                                    <p
                                        style={{
                                            color: "white",
                                            marginTop: "5px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        {accounts[0].accountNumber}
                                    </p>
                                </div>

                                <div>
                                    <span
                                        style={{
                                            color: "#888",
                                            fontSize: "13px"
                                        }}
                                    >
                                        Customer Name
                                    </span>

                                    <p
                                        style={{
                                            color: "white",
                                            marginTop: "5px"
                                        }}
                                    >
                                        {accounts[0].customerName}
                                    </p>
                                </div>

                                <div>
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
                                            marginTop: "5px",
                                            overflowWrap: "anywhere"
                                        }}
                                    >
                                        {accounts[0].email}
                                    </p>
                                </div>

                                <div>
                                    <span
                                        style={{
                                            color: "#888",
                                            fontSize: "13px"
                                        }}
                                    >
                                        Phone
                                    </span>

                                    <p
                                        style={{
                                            color: "white",
                                            marginTop: "5px"
                                        }}
                                    >
                                        {accounts[0].phone}
                                    </p>
                                </div>

                                <div>
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
                                            color: "#4caf50",
                                            marginTop: "5px",
                                            fontWeight: "600"
                                        }}
                                    >
                                        {accounts[0].accountType}
                                    </p>
                                </div>

                                {profile && (
                                    <>
                                        <div>
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
                                                    marginTop: "5px",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {profile.role || "N/A"}
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
                                                    color: profile.active
                                                        ? "#4caf50"
                                                        : "#f44336",
                                                    marginTop: "5px",
                                                    fontWeight: "600"
                                                }}
                                            >
                                                {profile.active
                                                    ? "Active"
                                                    : "Inactive"}
                                            </p>
                                        </div>
                                    </>
                                )}

                            </div>

                        </div>
                    )}

                    {profile && (

                        <div
                            style={{
                                border: "1px solid #444",
                                padding: "25px",
                                marginBottom: "25px",
                                borderRadius: "12px",
                                backgroundColor: "#15151d",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.35)"
                            }}
                        >

                            <h2
                                style={{
                                    marginTop: "0",
                                    color: "white",
                                    fontSize: "20px"
                                }}
                            >
                                Personal Details
                            </h2>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "18px"
                                }}
                            >

                                <div>
                                    <span style={{ color: "#888", fontSize: "13px" }}>
                                        Full Name
                                    </span>

                                    <p style={{ color: "white", marginTop: "5px" }}>
                                        {profile.name || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <span style={{ color: "#888", fontSize: "13px" }}>
                                        Date of Birth
                                    </span>

                                    <p style={{ color: "white", marginTop: "5px" }}>
                                        {profile.dateOfBirth || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <span style={{ color: "#888", fontSize: "13px" }}>
                                        Address
                                    </span>

                                    <p style={{ color: "white", marginTop: "5px" }}>
                                        {profile.address || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <span style={{ color: "#888", fontSize: "13px" }}>
                                        City
                                    </span>

                                    <p style={{ color: "white", marginTop: "5px" }}>
                                        {profile.city || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <span style={{ color: "#888", fontSize: "13px" }}>
                                        State
                                    </span>

                                    <p style={{ color: "white", marginTop: "5px" }}>
                                        {profile.state || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <span style={{ color: "#888", fontSize: "13px" }}>
                                        Pincode
                                    </span>

                                    <p style={{ color: "white", marginTop: "5px" }}>
                                        {profile.pincode || "N/A"}
                                    </p>
                                </div>

                            </div>

                        </div>
                    )}

                    {profile && (

                        <div
                            style={{
                                border: "1px solid #444",
                                padding: "25px",
                                marginBottom: "25px",
                                borderRadius: "12px",
                                backgroundColor: "#15151d",
                                boxShadow: "0 4px 15px rgba(0,0,0,0.35)"
                            }}
                        >

                            <h2
                                style={{
                                    marginTop: "0",
                                    color: "white",
                                    fontSize: "20px"
                                }}
                            >
                                Identity Details
                            </h2>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fit, minmax(250px, 1fr))",
                                    gap: "18px"
                                }}
                            >

                                <div>
                                    <span style={{ color: "#888", fontSize: "13px" }}>
                                        Identity Type
                                    </span>

                                    <p style={{ color: "white", marginTop: "5px" }}>
                                        {profile.identityType || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <span style={{ color: "#888", fontSize: "13px" }}>
                                        Identity Number
                                    </span>

                                    <p style={{ color: "white", marginTop: "5px" }}>
                                        {profile.identityNumber || "N/A"}
                                    </p>
                                </div>

                            </div>

                        </div>
                    )}

                    <div
                        style={{
                            border: "1px solid #444",
                            padding: "25px",
                            marginBottom: "25px",
                            borderRadius: "12px",
                            backgroundColor: "#15151d",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.35)"
                        }}
                    >

                        <h2
                            style={{
                                marginTop: "0",
                                color: "white",
                                fontSize: "20px"
                            }}
                        >
                            My Account QR Code
                        </h2>

                        <p
                            style={{
                                color: "#aaa",
                                fontSize: "14px",
                                marginBottom: "25px"
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
                                    textAlign: "center"
                                }}
                            >
                                No accounts found
                            </div>

                        ) : (

                            <div
                                style={{
                                    marginTop: "20px",
                                    padding: "25px",
                                    border: "1px solid #444",
                                    borderRadius: "12px",
                                    backgroundColor: "#0d0d12",
                                    textAlign: "center"
                                }}
                            >

                                <h3
                                    style={{
                                        color: "white",
                                        marginTop: "0",
                                        marginBottom: "20px"
                                    }}
                                >
                                    {accounts[0].accountNumber}
                                </h3>

                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        marginBottom: "20px"
                                    }}
                                >

                                    <div
                                        style={{
                                            padding: "15px",
                                            backgroundColor: "white",
                                            borderRadius: "10px"
                                        }}
                                    >

                                        <QRCodeCanvas
                                            value={getQrUrl(
                                                accounts[0].accountNumber
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
                                            "repeat(auto-fit, minmax(220px, 1fr))",
                                        gap: "20px",
                                        textAlign: "center"
                                    }}
                                >

                                    <div>
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
                                                fontWeight: "500"
                                            }}
                                        >
                                            {accounts[0].accountType}
                                        </p>
                                    </div>

                                    <div>
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
                                                fontWeight: "500"
                                            }}
                                        >
                                            {accounts[0].customerName}
                                        </p>
                                    </div>

                                </div>

                                <p
                                    style={{
                                        fontSize: "12px",
                                        color: "#777",
                                        marginTop: "20px"
                                    }}
                                >
                                    Scan this QR to view account details
                                </p>

                            </div>
                        )}

                    </div>

                    <div
                        style={{
                            border: "1px solid #444",
                            borderRadius: "12px",
                            padding: "25px",
                            backgroundColor: "#15151d",
                            boxShadow: "0 4px 15px rgba(0,0,0,0.35)"
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
                                justifyContent: "flex-end"
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
                                    cursor: "pointer"
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

export default Account;