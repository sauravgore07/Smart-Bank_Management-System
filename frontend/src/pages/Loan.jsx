
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function Loan({ onBack }) {

    const [applications, setApplications] = useState([]);

    const [loanType, setLoanType] = useState("PERSONAL");
    const [loanAmount, setLoanAmount] = useState("");
    const [tenureMonths, setTenureMonths] = useState("");
    const [monthlyIncome, setMonthlyIncome] = useState("");
    const [employmentType, setEmploymentType] = useState("SALARIED");
    const [purpose, setPurpose] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const token = localStorage.getItem("token");

    const headers = {
        Authorization: `Bearer ${token}`
    };

    const interestRates = {
        PERSONAL: 12,
        HOME: 8.5,
        EDUCATION: 7,
        VEHICLE: 9,
        BUSINESS: 11,
        MEDICAL: 10
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {

        try {

            if (!user?.id) {
                setMessage("User information not found");
                setLoading(false);
                return;
            }

            const response = await axios.get(
                `http://localhost:8080/api/loans/user/${user.id}`,
{
    headers
}
);

console.log(
    "Loan API Response:",
    response.data
);

setApplications(response.data);

} catch (error) {

    console.error(
        "Loan Fetch Error:",
        error
    );

    if (error.response) {

        setMessage(
            error.response.data?.message ||
            `Error ${error.response.status}: Unable to load loans`
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

        const response = await axios.post(
            `http://localhost:8080/api/loans/apply/${user.id}`,
            {
                loanType,
                loanAmount: Number(loanAmount),
                tenureMonths: Number(tenureMonths),
                monthlyIncome: Number(monthlyIncome),
                employmentType,
                purpose
            },
            {
                headers
            }
        );

        console.log(
            "Loan Apply Response:",
            response.data
        );

        setMessage(
            `Loan application submitted successfully. Application ID: ${response.data.id}`
        );

        setLoanType("PERSONAL");
        setLoanAmount("");
        setTenureMonths("");
        setMonthlyIncome("");
        setEmploymentType("SALARIED");
        setPurpose("");

        await fetchLoans();

    } catch (error) {

        console.error(
            "Loan Submit Error:",
            error
        );

        if (error.response) {

            setMessage(
                error.response.data?.message ||
                `Error ${error.response.status}: Loan application failed`
            );

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
                    Loading Loans...
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
                    Loan Management
                </h1>

                <p
                    style={{
                        color: "#aaa",
                        marginBottom: "25px"
                    }}
                >
                    Apply for a loan and manage your loan applications
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
                        Apply for Loan
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
                                Loan Type
                            </label>

                            <select
                                value={loanType}
                                onChange={(e) =>
                                    setLoanType(e.target.value)
                                }
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "7px",
                                    color: "white",
                                    backgroundColor: "#111118",
                                    border: "1px solid #444",
                                    borderRadius: "6px",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            >

                                <option value="PERSONAL">
                                    Personal Loan
                                </option>

                                <option value="HOME">
                                    Home Loan
                                </option>

                                <option value="EDUCATION">
                                    Education Loan
                                </option>

                                <option value="VEHICLE">
                                    Vehicle Loan
                                </option>

                                <option value="BUSINESS">
                                    Business Loan
                                </option>

                                <option value="MEDICAL">
                                    Medical Loan
                                </option>

                            </select>

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
                                Interest Rate
                            </label>

                            <input
                                type="text"
                                value={`${interestRates[loanType] ?? 0}%`}
                                readOnly
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "7px",
                                    backgroundColor: "#111118",
                                    color: "white",
                                    WebkitTextFillColor: "white",
                                    border: "1px solid #444",
                                    borderRadius: "6px",
                                    boxSizing: "border-box",
                                    outline: "none",
                                    opacity: 1
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
                                Loan Amount
                            </label>

                            <input
                                type="number"
                                min="1000"
                                value={loanAmount}
                                onChange={(e) =>
                                    setLoanAmount(e.target.value)
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "7px",
                                    color: "white",
                                    backgroundColor: "#111118",
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
                                Tenure (Months)
                            </label>

                            <input
                                type="number"
                                min="6"
                                value={tenureMonths}
                                onChange={(e) =>
                                    setTenureMonths(e.target.value)
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "7px",
                                    color: "white",
                                    backgroundColor: "#111118",
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
                                Monthly Income
                            </label>

                            <input
                                type="number"
                                min="1000"
                                value={monthlyIncome}
                                onChange={(e) =>
                                    setMonthlyIncome(e.target.value)
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "7px",
                                    color: "white",
                                    backgroundColor: "#111118",
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
                                Employment Type
                            </label>

                            <select
                                value={employmentType}
                                onChange={(e) =>
                                    setEmploymentType(e.target.value)
                                }
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "7px",
                                    color: "white",
                                    backgroundColor: "#111118",
                                    border: "1px solid #444",
                                    borderRadius: "6px",
                                    outline: "none",
                                    boxSizing: "border-box"
                                }}
                            >

                                <option value="SALARIED">
                                    Salaried
                                </option>

                                <option value="SELF_EMPLOYED">
                                    Self Employed
                                </option>

                                <option value="BUSINESS">
                                    Business
                                </option>

                                <option value="STUDENT">
                                    Student
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
                                Loan Purpose
                            </label>

                            <textarea
                                value={purpose}
                                onChange={(e) =>
                                    setPurpose(e.target.value)
                                }
                                required
                                rows="3"
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    marginTop: "7px",
                                    color: "white",
                                    backgroundColor: "#111118",
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
                                Apply for Loan
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
                        My Loan Applications
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
                            No loan applications found.
                        </div>

                    ) : (

                        applications.map(
                            (application) => {

                                const applicationInterestRate =
                                    application.interestRate ??
                                    application.interest_rate ??
                                    interestRates[application.loanType] ??
                                    0;

                                return (

                                    <div
                                        key={application.id}
                                        style={{
                                            border: "1px solid #444",
                                            padding: "25px",
                                            marginBottom: "20px",
                                            borderRadius: "12px",
                                            backgroundColor: "#15151d",
                                            boxShadow: "0 4px 15px rgba(0,0,0,0.35)"
                                        }}
                                    >

                                        <h3
                                            style={{
                                                marginTop: "0",
                                                color: "white",
                                                fontSize: "20px"
                                            }}
                                        >
                                            {application.loanType} Loan
                                        </h3>

                                        <div
                                            style={{
                                                display: "grid",
                                                gridTemplateColumns:
                                                    "repeat(auto-fit, minmax(220px, 1fr))",
                                                gap: "15px"
                                            }}
                                        >

                                            <div>

                                                    <span
                                                        style={{
                                                            color: "#888",
                                                            fontSize: "13px"
                                                        }}
                                                    >
                                                        Application ID
                                                    </span>

                                                <p
                                                    style={{
                                                        color: "white",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    {application.id}
                                                </p>

                                            </div>

                                            <div>

                                                    <span
                                                        style={{
                                                            color: "#888",
                                                            fontSize: "13px"
                                                        }}
                                                    >
                                                        Interest Rate
                                                    </span>

                                                <p
                                                    style={{
                                                        color: "#4caf50",
                                                        marginTop: "5px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    {Number(
                                                        applicationInterestRate
                                                    ).toFixed(2)}%
                                                </p>

                                            </div>

                                            <div>

                                                    <span
                                                        style={{
                                                            color: "#888",
                                                            fontSize: "13px"
                                                        }}
                                                    >
                                                        Loan Amount
                                                    </span>

                                                <p
                                                    style={{
                                                        color: "white",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    ₹{application.loanAmount}
                                                </p>

                                            </div>

                                            <div>

                                                    <span
                                                        style={{
                                                            color: "#888",
                                                            fontSize: "13px"
                                                        }}
                                                    >
                                                        Tenure
                                                    </span>

                                                <p
                                                    style={{
                                                        color: "white",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    {application.tenureMonths} months
                                                </p>

                                            </div>

                                            <div>

                                                    <span
                                                        style={{
                                                            color: "#888",
                                                            fontSize: "13px"
                                                        }}
                                                    >
                                                        Monthly Income
                                                    </span>

                                                <p
                                                    style={{
                                                        color: "white",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    ₹{application.monthlyIncome}
                                                </p>

                                            </div>

                                            <div>

                                                    <span
                                                        style={{
                                                            color: "#888",
                                                            fontSize: "13px"
                                                        }}
                                                    >
                                                        Employment Type
                                                    </span>

                                                <p
                                                    style={{
                                                        color: "white",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    {application.employmentType}
                                                </p>

                                            </div>

                                            <div>

                                                    <span
                                                        style={{
                                                            color: "#888",
                                                            fontSize: "13px"
                                                        }}
                                                    >
                                                        Purpose
                                                    </span>

                                                <p
                                                    style={{
                                                        color: "white",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    {application.purpose}
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
                                                        color:
                                                            application.status === "APPROVED"
                                                                ? "#4caf50"
                                                                : application.status === "REJECTED"
                                                                    ? "#f44336"
                                                                    : "#ff9800",
                                                        marginTop: "5px",
                                                        fontWeight: "600"
                                                    }}
                                                >
                                                    {application.status}
                                                </p>

                                            </div>

                                            <div>

                                                    <span
                                                        style={{
                                                            color: "#888",
                                                            fontSize: "13px"
                                                        }}
                                                    >
                                                        Applied At
                                                    </span>

                                                <p
                                                    style={{
                                                        color: "white",
                                                        marginTop: "5px"
                                                    }}
                                                >
                                                    {application.appliedAt
                                                        ? new Date(application.appliedAt).toLocaleString(
                                                            "en-IN",
                                                            {
                                                                day: "2-digit",
                                                                month: "2-digit",
                                                                year: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit"
                                                            }
                                                        )
                                                        : ""}
                                                </p>

                                            </div>

                                        </div>

                                    </div>
                                );
                            }
                        )
                    )}

                </div>

            </div>

        </div>

    </div>
);
}

export default Loan;

