
import { useEffect, useState } from "react";
import axios from "axios";

function AdminLoan() {

    const [applications, setApplications] = useState([]);
    const [searchName, setSearchName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    useEffect(() => {
        fetchLoanHistory();
    }, []);

    const fetchLoanHistory = async (clearMessage = true) => {

        try {

            setLoading(true);

            if (clearMessage) {
                setMessage("");
            }

            const response = await axios.get(
                "http://localhost:8080/api/loans/admin/history",
                {
                    headers
                }
            );

            setApplications(response.data);

        } catch (error) {

            console.error(
                "Admin Loan History Fetch Error:",
                error
            );

            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    `Error ${error.response.status}: Unable to load loan history`
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

    const updateStatus = async (loanId, status) => {

        try {

            setMessage("");

            await axios.put(
                `http://localhost:8080/api/loans/${loanId}/status`,
    null,
        {
            params: {
                status: status
            },
            headers
        }
);

setMessage(
    `Loan application ${loanId} ${status.toLowerCase()} successfully`
);

await fetchLoanHistory(false);

} catch (error) {

    console.error(
        "Admin Loan Status Error:",
        error
    );

    if (error.response) {

        setMessage(
            error.response.data?.message ||
            `Error ${error.response.status}: Unable to update loan status`
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

        const applicationName =
            application.name || "";

        const search =
            searchName.toLowerCase().trim();

        return (
            userName.toLowerCase().includes(search) ||
            applicationName.toLowerCase().includes(search)
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
                Loading Loan History...
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
            Admin Loan Management
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
            Loan Application History
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
                No loan applications found.
            </p>

        ) : filteredApplications.length === 0 ? (

            <p
                style={{
                    color: "#f1c40f"
                }}
            >
                No loan application found for "{searchName}".
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
                                application.name ||
                                "N/A"}
                        </p>

                        <p>
                            <strong>
                                Email:
                            </strong>{" "}
                            {application.user?.email ||
                                application.email ||
                                "N/A"}
                        </p>

                        <p>
                            <strong>
                                Loan Type:
                            </strong>{" "}
                            {application.loanType || "N/A"}
                        </p>

                        <p>
                            <strong>
                                Loan Amount:
                            </strong>{" "}
                            ₹{application.loanAmount ?? "N/A"}
                        </p>

                        <p>
                            <strong>
                                Interest Rate:
                            </strong>{" "}
                            {application.interestRate ?? "N/A"}%
                        </p>

                        <p>
                            <strong>
                                Tenure:
                            </strong>{" "}
                            {application.tenureMonths ?? "N/A"} months
                        </p>

                        <p>
                            <strong>
                                Monthly Income:
                            </strong>{" "}
                            ₹{application.monthlyIncome ?? "N/A"}
                        </p>

                        <p>
                            <strong>
                                Employment Type:
                            </strong>{" "}
                            {application.employmentType || "N/A"}
                        </p>

                        <p>
                            <strong>
                                Purpose:
                            </strong>{" "}
                            {application.purpose || "N/A"}
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
                                Applied At:
                            </strong>{" "}
                            {application.appliedAt
                                ? new Date(
                                    application.appliedAt
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

export default AdminLoan;

