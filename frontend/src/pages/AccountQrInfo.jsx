import { useEffect, useState } from "react";
import axios from "axios";

function AccountQrInfo() {

    const [account, setAccount] = useState(null);
    const [photoUrl, setPhotoUrl] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const accountNumber =
        window.location.pathname.split("/").pop();

    const API_URL =
        "http://localhost:8080/api/accounts/qr";

    const loadAccountInfo = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await axios.get(
                `${API_URL}/${accountNumber}`
            );

            setAccount(response.data);

            if (response.data.profilePhotoUrl) {

                const photoResponse = await axios.get(
                    `http://localhost:8080${response.data.profilePhotoUrl}`,
                    {
                        responseType: "blob"
                    }
                );

                const imageUrl =
                    URL.createObjectURL(photoResponse.data);

                setPhotoUrl(imageUrl);
            }

        } catch (err) {

            console.error(err);
            setError("Account information not found");

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        loadAccountInfo();

        return () => {

            if (photoUrl) {
                URL.revokeObjectURL(photoUrl);
            }

        };

    }, []);


    if (loading) {

        return (
            <div style={{
                textAlign: "center",
                marginTop: "80px"
            }}>
                <h2>Loading Account Information...</h2>
            </div>
        );
    }


    if (error || !account) {

        return (
            <div style={{
                width: "400px",
                margin: "80px auto",
                padding: "30px",
                textAlign: "center",
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                backgroundColor: "white"
            }}>

                <h2>Account Not Found</h2>

                <p style={{ color: "red" }}>
                    {error}
                </p>

            </div>
        );
    }


    return (

        <div style={{
            width: "420px",
            margin: "40px auto",
            padding: "30px",
            borderRadius: "15px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            backgroundColor: "white",
            textAlign: "center"
        }}>

            <h1>Account Information</h1>


            <div style={{
                marginTop: "25px",
                marginBottom: "25px"
            }}>

                {photoUrl ? (

                    <img
                        src={photoUrl}
                        alt="Profile"
                        style={{
                            width: "150px",
                            height: "150px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            border: "4px solid #ddd"
                        }}
                    />

                ) : (

                    <div style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        backgroundColor: "#ddd",
                        margin: "auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "60px",
                        color: "#777"
                    }}>
                        👤
                    </div>

                )}

            </div>


            <div style={{
                textAlign: "left",
                marginTop: "20px"
            }}>

                <p>
                    <strong>Customer Name:</strong>{" "}
                    {account.customerName}
                </p>

                <p>
                    <strong>Account Number:</strong>{" "}
                    {account.accountNumber}
                </p>

                <p>
                    <strong>Account Type:</strong>{" "}
                    {account.accountType}
                </p>

                <p>
                    <strong>Email:</strong>{" "}
                    {account.email}
                </p>

                <p>
                    <strong>Phone:</strong>{" "}
                    {account.phone || "Not Available"}
                </p>

            </div>


            <div style={{
                marginTop: "25px",
                padding: "12px",
                borderRadius: "8px",
                backgroundColor: "#f1f3f5",
                color: "#555",
                fontSize: "14px"
            }}>
                Banking Management System
            </div>

        </div>
    );
}

export default AccountQrInfo;