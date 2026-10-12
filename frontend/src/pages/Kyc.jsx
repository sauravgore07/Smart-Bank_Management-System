import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function Kyc({ onBack }) {

    const [applications, setApplications] = useState([]);

    const [fullName, setFullName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [identityType, setIdentityType] = useState("AADHAAR");
    const [identityNumber, setIdentityNumber] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        fetchKyc();
    }, []);

    const fetchKyc = async () => {

        try {

            if (!user?.id) {
                setMessage("User information not found");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/kyc/user/${user.id}`,
                {
                    headers
                }
            );

            setApplications(response.data);

        } catch (error) {

            console.error("KYC Fetch Error:", error);
            console.error("Status:", error.response?.status);
            console.error("Response Data:", error.response?.data);

            if (error.response) {

                const data = error.response.data;

                setMessage(
                    data?.message ||
                    data?.error ||
                    `Error ${error.response.status}: Unable to load KYC`
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

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setMessage("");

            if (!user?.id) {
                setMessage("User information not found");
                return;
            }

            const response = await axios.post(
                `http://localhost:8080/api/kyc/submit/${user.id}`,
                {
                    fullName,
                    dateOfBirth,
                    phoneNumber,
                    address,
                    city,
                    state,
                    pincode,
                    identityType,
                    identityNumber
                },
                {
                    headers
                }
            );

            setMessage(
                `KYC submitted successfully. Application ID: ${response.data.id}`
            );

            setFullName("");
            setDateOfBirth("");
            setPhoneNumber("");
            setAddress("");
            setCity("");
            setState("");
            setPincode("");
            setIdentityType("AADHAAR");
            setIdentityNumber("");

            await fetchKyc();

        } catch (error) {

            console.error("KYC Submit Error:", error);
            console.error("Status:", error.response?.status);
            console.error("Response Data:", error.response?.data);

            if (error.response) {

                const data = error.response.data;

                if (
                    data?.errors &&
                    Array.isArray(data.errors)
                ) {

                    setMessage(
                        data.errors
                            .map(
                                item =>
                                    item.defaultMessage
                            )
                            .join(", ")
                    );

                } else if (
                    data &&
                    typeof data === "object"
                ) {

                    const validationMessages =
                        Object.values(data)
                            .filter(
                                value =>
                                    typeof value === "string"
                            )
                            .join(", ");

                    setMessage(
                        data.message ||
                        data.error ||
                        validationMessages ||
                        `Error ${error.response.status}: KYC submission failed`
                    );

                } else {

                    setMessage(
                        data ||
                        `Error ${error.response.status}: KYC submission failed`
                    );
                }

            } else {

                setMessage(
                    "Backend server is not running"
                );
            }
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
                        Loading KYC...
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
                        KYC Management
                    </h1>

                    <p
                        style={{
                            color: "#aaa",
                            marginBottom: "25px"
                        }}
                    >
                        Submit and manage your KYC verification
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
                            Submit KYC
                        </h2>

                        <form onSubmit={handleSubmit}>

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
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(
                                            e.target.value
                                        )
                                    }
                                    required
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
                                />

                            </div>

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
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    value={dateOfBirth}
                                    onChange={(e) =>
                                        setDateOfBirth(
                                            e.target.value
                                        )
                                    }
                                    required
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        backgroundColor: "#111118",
                                        color: "white",
                                        border: "1px solid #444",
                                        borderRadius: "6px",
                                        outline: "none",
                                        boxSizing: "border-box",
                                        colorScheme: "dark"
                                    }}
                                />

                            </div>

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
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) =>
                                        setPhoneNumber(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 10)
                                        )
                                    }
                                    required
                                    maxLength="10"
                                    placeholder="Enter 10 digit phone number"
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
                                />

                            </div>

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
                                    Address
                                </label>

                                <textarea
                                    value={address}
                                    onChange={(e) =>
                                        setAddress(
                                            e.target.value
                                        )
                                    }
                                    required
                                    rows="3"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        marginTop: "7px",
                                        backgroundColor: "#111118",
                                        color: "white",
                                        border: "1px solid #444",
                                        borderRadius: "6px",
                                        outline: "none",
                                        resize: "vertical",
                                        boxSizing: "border-box"
                                    }}
                                />

                            </div>

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
                                    City
                                </label>

                                <input
                                    type="text"
                                    value={city}
                                    onChange={(e) =>
                                        setCity(
                                            e.target.value
                                        )
                                    }
                                    required
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
                                />

                            </div>

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
                                    State
                                </label>

                                <input
                                    type="text"
                                    value={state}
                                    onChange={(e) =>
                                        setState(
                                            e.target.value
                                        )
                                    }
                                    required
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
                                />

                            </div>

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
                                    Pincode
                                </label>

                                <input
                                    type="text"
                                    value={pincode}
                                    onChange={(e) =>
                                        setPincode(
                                            e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 6)
                                        )
                                    }
                                    required
                                    maxLength="6"
                                    placeholder="Enter 6 digit pincode"
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
                                />

                            </div>

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
                                    Identity Type
                                </label>

                                <select
                                    value={identityType}
                                    onChange={(e) =>
                                        setIdentityType(
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

                                    <option value="AADHAAR">
                                        Aadhaar
                                    </option>

                                    <option value="PAN">
                                        PAN
                                    </option>

                                    <option value="PASSPORT">
                                        Passport
                                    </option>

                                    <option value="DRIVING_LICENSE">
                                        Driving License
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
                                    Identity Number
                                </label>

                                <input
                                    type="text"
                                    value={identityNumber}
                                    onChange={(e) =>
                                        setIdentityNumber(
                                            e.target.value
                                        )
                                    }
                                    required
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
                                    style={{
                                        padding: "12px 25px",
                                        backgroundColor: "#1976d2",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer",
                                        fontSize: "14px",
                                        fontWeight: "600"
                                    }}
                                >
                                    Submit KYC
                                </button>

                            </div>

                        </form>

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
                            My KYC Applications
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
                                No KYC applications found.
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
                                                Full Name:
                                            </strong>{" "}
                                            {application.fullName}
                                        </p>

                                        <p>
                                            <strong>
                                                Date of Birth:
                                            </strong>{" "}
                                            {application.dateOfBirth}
                                        </p>

                                        <p>
                                            <strong>
                                                Phone Number:
                                            </strong>{" "}
                                            {application.phoneNumber}
                                        </p>

                                        <p>
                                            <strong>
                                                Address:
                                            </strong>{" "}
                                            {application.address}
                                        </p>

                                        <p>
                                            <strong>
                                                City:
                                            </strong>{" "}
                                            {application.city}
                                        </p>

                                        <p>
                                            <strong>
                                                State:
                                            </strong>{" "}
                                            {application.state}
                                        </p>

                                        <p>
                                            <strong>
                                                Pincode:
                                            </strong>{" "}
                                            {application.pincode}
                                        </p>

                                        <p>
                                            <strong>
                                                Identity Type:
                                            </strong>{" "}
                                            {application.identityType}
                                        </p>

                                        <p>
                                            <strong>
                                                Identity Number:
                                            </strong>{" "}
                                            {application.identityNumber}
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

export default Kyc;