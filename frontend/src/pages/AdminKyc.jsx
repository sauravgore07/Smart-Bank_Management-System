import { useEffect, useState } from "react";
import axios from "axios";

function AdminKyc() {

    const [applications, setApplications] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        fetchKycHistory();
    }, []);

    const fetchKycHistory = async (clearMessage = true) => {

        try {

            setLoading(true);

            if (clearMessage) {
                setMessage("");
            }

            const response = await axios.get(
                "http://localhost:8080/api/kyc/admin/history",
                {
                    headers
                }
            );

            setApplications(response.data);

        } catch (error) {

            console.error(
                "Admin KYC History Fetch Error:",
                error
            );

            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    `Error ${error.response.status}: Unable to load KYC history`
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

    const updateStatus = async (kycId, status) => {

        try {

            setMessage("");

            await axios.put(
                `http://localhost:8080/api/kyc/${kycId}/status`,
    null,
        {
            params: {
                status: status
            },
            headers
        }
);

setMessage(
    `KYC application ${kycId} ${status.toLowerCase()} successfully`
);

await fetchKycHistory(false);

} catch (error) {

    console.error(
        "Admin KYC Status Error:",
        error
    );

    if (error.response) {

        setMessage(
            error.response.data?.message ||
            `Error ${error.response.status}: Unable to update KYC status`
        );

    } else {

        setMessage(
            "Backend server is not running"
        );
    }
}
};

const filteredApplications = applications.filter(
    (application) => {

        const userName =
            application.user?.name || "";

        const fullName =
            application.fullName || "";

        const search =
            searchName.toLowerCase().trim();

        return (
            userName.toLowerCase().includes(search) ||
            fullName.toLowerCase().includes(search)
        );
    }
);

if (loading) {

    return (
        <div
            style={{
                padding: "40px",
                maxWidth: "1000px",
                margin: "auto",
                color: "white"
            }}
        >

            <h2>
                Loading KYC History...
            </h2>

        </div>
    );
}

return (
    <div
        style={{
            padding: "40px",
            maxWidth: "1000px",
            margin: "auto",
            color: "white"
        }}
    >

        <h1>
            Admin KYC Management
        </h1>

        {message && (
            <p
                style={{
                    padding: "10px",
                    color: "#cddc39",
                    backgroundColor: "transparent",
                    border: "none",
                    margin: "15px 0"
                }}
            >
                {message}
            </p>
        )}

        <hr />

        <h2>
            KYC Application History
        </h2>

        <div
            style={{
                marginBottom: "25px",
                marginTop: "15px"
            }}
        >

            <input
                type="text"
                placeholder="Search by user name..."
                value={searchName}
                onChange={(e) =>
                    setSearchName(e.target.value)
                }
                style={{
                    width: "100%",
                    maxWidth: "450px",
                    padding: "12px 15px",
                    borderRadius: "8px",
                    border: "1px solid #555",
                    backgroundColor: "#202027",
                    color: "white",
                    fontSize: "16px",
                    outline: "none",
                    boxSizing: "border-box"
                }}
            />

        </div>

        {applications.length === 0 ? (

            <p>
                No KYC applications found.
            </p>

        ) : filteredApplications.length === 0 ? (

            <p
                style={{
                    color: "#f1c40f"
                }}
            >
                No KYC application found for "{searchName}".
            </p>

        ) : (

            filteredApplications.map(
                (application) => (

                    <div
                        key={application.id}
                        style={{
                            border: "1px solid #444",
                            padding: "20px",
                            marginBottom: "20px",
                            borderRadius: "10px",
                            backgroundColor: "#17171d"
                        }}
                    >

                        <h3>
                            Application ID: {application.id}
                        </h3>

                        <p>
                            <strong>
                                User Name:
                            </strong>{" "}
                            {application.user?.name ||
                                application.fullName ||
                                "N/A"}
                        </p>

                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {application.user?.email || "N/A"}
                        </p>

                        <p>
                            <strong>
                                Phone:
                            </strong>{" "}
                            {application.phoneNumber ||
                                application.user?.phoneNumber ||
                                "N/A"}
                        </p>

                        <p>
                            <strong>
                                Full Name:
                            </strong>{" "}
                            {application.fullName || "N/A"}
                        </p>

                        <p>
                            <strong>
                                Date of Birth:
                            </strong>{" "}
                            {application.dateOfBirth || "N/A"}
                        </p>

                        <p>
                            <strong>
                                Address:
                            </strong>{" "}
                            {application.address || "N/A"}
                        </p>

                        <p>
                            <strong>
                                City:
                            </strong>{" "}
                            {application.city || "N/A"}
                        </p>

                        <p>
                            <strong>
                                State:
                            </strong>{" "}
                            {application.state || "N/A"}
                        </p>

                        <p>
                            <strong>
                                Pincode:
                            </strong>{" "}
                            {application.pincode || "N/A"}
                        </p>

                        <p>
                            <strong>
                                Identity Type:
                            </strong>{" "}
                            {application.identityType || "N/A"}
                        </p>

                        <p>
                            <strong>
                                Identity Number:
                            </strong>{" "}
                            {application.identityNumber || "N/A"}
                        </p>

                        <p>
                            <strong>
                                Status:
                            </strong>{" "}
                            <span
                                style={{
                                    fontWeight: "bold",
                                    color:
                                        application.status === "APPROVED"
                                            ? "#cddc39"
                                            : application.status === "REJECTED"
                                                ? "#e74c3c"
                                                : "#f1c40f"
                                }}
                            >
                                    {application.status}
                                </span>
                        </p>

                        <p>
                            <strong>
                                Submitted At:
                            </strong>{" "}
                            {application.submittedAt
                                ? new Date(
                                    application.submittedAt
                                ).toLocaleString()
                                : "N/A"}
                        </p>

                        <p>
                            <strong>
                                Updated At:
                            </strong>{" "}
                            {application.updatedAt
                                ? new Date(
                                    application.updatedAt
                                ).toLocaleString()
                                : "N/A"}
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
                                        marginRight: "10px",
                                        padding: "10px 20px",
                                        backgroundColor: "#cddc39",
                                        color: "#17171d",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
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
                                        backgroundColor: "#c0392b",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        fontWeight: "bold",
                                        cursor: "pointer"
                                    }}
                                >
                                    Reject
                                </button>

                            </div>
                        )}

                    </div>
                )
            )
        )}

    </div>
);
}

export default AdminKyc;

