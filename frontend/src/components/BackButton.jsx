function BackButton({ onClick }) {
const handleBack = () => {

    if (onClick) {
        onClick();
        return;
    }

    window.history.back();
};

return (
    <div
        style={{
            marginTop: "30px",
            paddingTop: "20px",
            borderTop: "1px solid #ddd",
            textAlign: "left"
        }}
    >
        <button
            type="button"
            onClick={handleBack}
            style={{
                padding: "10px 20px",
                cursor: "pointer",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#f39c12",
                color: "#fff",
                fontSize: "15px",
                fontWeight: "bold"
            }}
        >
            ← Back
        </button>
    </div>
);


}

export default BackButton;
