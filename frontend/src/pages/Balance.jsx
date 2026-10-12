
import { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function Balance({ onBack }) {

    const [balance, setBalance] = useState(null);
    const [message, setMessage] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    useEffect(() => {

        const loadBalance = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await axios.get(
                    `http://localhost:8080/api/accounts/user/${user.id}`,
{
    headers: {
        Authorization: `Bearer ${token}`
    }
}
);

const accounts = response.data;

if (!accounts || accounts.length === 0) {

    setMessage("No account found");
    return;
}

setBalance(accounts[0].balance);

} catch (error) {

    console.error(
        "Balance Error:",
        error
    );

    if (error.response) {

        setMessage(
            error.response.data?.message ||
            `Error ${error.response.status}: Unable to fetch balance`
        );

    } else {

        setMessage(
            "Backend server is not running"
        );
    }
}
};

if (user?.id) {
    loadBalance();
} else {
    setMessage("User information not found");
}

}, []);

return (
    <div
        style={{
            minHeight: "100vh",
            backgroundColor: "#0d0d12",
            color: "white",
            padding: "30px",
            boxSizing: "border-box",
            fontFamily: "Arial, sans-serif"
        }}
    >

        <div
            style={{
                maxWidth: "850px",
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
                    backgroundColor: "#0d0d12",
                    border: "1px solid #aaa",
                    borderRadius: "10px",
                    padding: "30px",
                    boxSizing: "border-box"
                }}
            >

                <h1
                    style={{
                        color: "white",
                        marginTop: "0",
                        marginBottom: "25px"
                    }}
                >
                    Account Balance
                </h1>

                {balance !== null && (
                    <div
                        style={{
                            padding: "25px",
                            backgroundColor: "#1c1c1c",
                            border: "1px solid #555",
                            borderRadius: "8px",
                            textAlign: "center"
                        }}
                    >

                        <p
                            style={{
                                color: "#ccc",
                                fontSize: "16px",
                                marginBottom: "10px"
                            }}
                        >
                            Available Balance
                        </p>

                        <h2
                            style={{
                                color: "#cddc39",
                                fontSize: "32px",
                                margin: "0"
                            }}
                        >
                            ₹{Number(balance).toFixed(2)}
                        </h2>

                    </div>
                )}

                {message && (
                    <p
                        style={{
                            marginTop: "20px",
                            color: "white",
                            fontSize: "16px"
                        }}
                    >
                        {message}
                    </p>
                )}

            </div>

        </div>

    </div>
);
}

export default Balance;

