import { useState } from "react";
import axios from "axios";
import BackButton from "../components/BackButton";

function Transfer({ onBack }) {
const [toAccount, setToAccount] = useState("");
const [amount, setAmount] = useState("");
const [description, setDescription] = useState("");
const [message, setMessage] = useState("");

const user = JSON.parse(
    localStorage.getItem("user")
);

const handleTransfer = async (e) => {

    e.preventDefault();

    try {

        const token = localStorage.getItem("token");

        const accountResponse = await axios.get(
            `http://localhost:8080/api/accounts/user/${user.id}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
);

    const accounts = accountResponse.data;

    if (!accounts || accounts.length === 0) {
        setMessage("No account found");
        return;
    }

    const fromAccount =
        accounts[0].accountNumber;

    const response = await axios.post(
        "http://localhost:8080/api/transactions/transfer",
        null,
        {
            params: {
                fromAccount: fromAccount,
                toAccount: toAccount,
                amount: Number(amount),
                description: description
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    setMessage(
        `Transfer successful. New Balance: ₹${response.data.balanceAfterTransfer}`
    );

    setToAccount("");
    setAmount("");
    setDescription("");

} catch (error) {

    console.error(
        "Transfer Error:",
        error
    );

    if (error.response) {

        setMessage(
            error.response.data?.message ||
            `Error ${error.response.status}: Transfer failed`
        );

    } else {

        setMessage(
            "Backend server is not running"
        );
    }
}
};

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
                    Transfer Money
                </h1>

                <form onSubmit={handleTransfer}>

                    <input
                        type="text"
                        placeholder="Enter Receiver Account Number"
                        value={toAccount}
                        onChange={(e) =>
                            setToAccount(e.target.value)
                        }
                        required
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "12px",
                            marginBottom: "15px",
                            backgroundColor: "#1c1c1c",
                            color: "white",
                            border: "1px solid #555",
                            borderRadius: "4px",
                            outline: "none",
                            fontSize: "14px"
                        }}
                    />

                    <input
                        type="number"
                        placeholder="Enter Amount"
                        value={amount}
                        onChange={(e) =>
                            setAmount(e.target.value)
                        }
                        min="1"
                        required
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "12px",
                            marginBottom: "15px",
                            backgroundColor: "#1c1c1c",
                            color: "white",
                            border: "1px solid #555",
                            borderRadius: "4px",
                            outline: "none",
                            fontSize: "14px"
                        }}
                    />

                    <input
                        type="text"
                        placeholder="Enter Description"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        style={{
                            width: "100%",
                            boxSizing: "border-box",
                            padding: "12px",
                            marginBottom: "15px",
                            backgroundColor: "#1c1c1c",
                            color: "white",
                            border: "1px solid #555",
                            borderRadius: "4px",
                            outline: "none",
                            fontSize: "14px"
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            padding: "12px 25px",
                            backgroundColor: "#cddc39",
                            color: "black",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "15px",
                            fontWeight: "bold",
                            cursor: "pointer"
                        }}
                    >
                        Transfer
                    </button>

                </form>

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

export default Transfer;
