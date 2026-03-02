import React from "react";
import QRCode from "react-qr-code";

interface Patron {
    first_name: string;
    last_name: string;
    library_card_number: string;
    type: string;
}

interface Props {
    patron: Patron;
}

export default function LibraryCard({ patron }: Props) {
    return (
        <div
            className="library-card-container font-sans text-black bg-white"
            style={{
                width: "3.375in",
                height: "2.125in",
                boxSizing: "border-box",
                border: "1px solid #000" /* Visible border for cutting */,
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Header / Banner - Using inline styles to force background printing */}
            <div
                style={{
                    backgroundColor: "#d97706",
                    color: "white",
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    height: "3rem",
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact",
                }}
            >
                <img
                    src="/images/3DMunicipalLogo.png"
                    alt="Gerona Logo"
                    style={{
                        height: "2rem",
                        width: "2rem",
                        marginRight: "0.5rem",
                        objectFit: "contain",
                    }}
                />
                <div>
                    <h1
                        style={{
                            fontSize: "10px",
                            fontWeight: "bold",
                            lineHeight: "1.2",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            margin: 0,
                        }}
                    >
                        Gerona Municipal Library
                    </h1>
                    <p
                        style={{
                            fontSize: "7px",
                            lineHeight: "1.2",
                            opacity: 0.9,
                            margin: 0,
                        }}
                    >
                        Tarlac, Philippines
                    </p>
                </div>
            </div>

            {/* Body */}
            <div
                style={{
                    padding: "0.5rem 0.75rem",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "calc(100% - 3rem)",
                }}
            >
                {/* User Details */}
                <div style={{ flex: 1, paddingRight: "0.5rem" }}>
                    <p
                        style={{
                            fontSize: "8px",
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginBottom: "2px",
                            marginTop: 0,
                        }}
                    >
                        Patron Name
                    </p>
                    <h2
                        style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                            lineHeight: "1.1",
                            marginBottom: "4px",
                            marginTop: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {patron.first_name} {patron.last_name}
                    </h2>

                    <p
                        style={{
                            fontSize: "8px",
                            color: "#6b7280",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            marginTop: "6px",
                            marginBottom: "2px",
                        }}
                    >
                        Category
                    </p>
                    <p
                        style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            margin: 0,
                        }}
                    >
                        {patron.type}
                    </p>
                </div>

                {/* QR Code */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            padding: "4px",
                            backgroundColor: "white",
                            border: "1px solid #e5e7eb",
                            borderRadius: "4px",
                        }}
                    >
                        <QRCode
                            value={patron.library_card_number}
                            size={56} // Perfectly sized for the remaining space
                            level="M"
                        />
                    </div>
                    <p
                        style={{
                            fontSize: "7px",
                            marginTop: "4px",
                            fontFamily: "monospace",
                            letterSpacing: "0.05em",
                        }}
                    >
                        {patron.library_card_number}
                    </p>
                </div>
            </div>

            {/* Print Styles */}
            <style>
                {`
                    @media print {
                        @page {
                            margin: 0.5in;
                        }
                        body * {
                            visibility: hidden;
                        }
                        .library-card-container, .library-card-container * {
                            visibility: visible;
                        }
                        .library-card-container {
                            position: absolute;
                            left: 0;
                            top: 0;
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                        }
                    }
                `}
            </style>
        </div>
    );
}
