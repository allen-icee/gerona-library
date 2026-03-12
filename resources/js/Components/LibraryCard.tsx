import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export interface Patron {
    first_name: string;
    last_name: string;
    middle_initial?: string;
    suffix?: string;
    library_card_number: string;
    type: string;
    barangay: string;
    municipality: string;
    province: string;
    street?: string;
    contact_number?: string;
}

interface Props {
    patron: Patron;
    cardId?: string;
}

export default function LibraryCard({ patron, cardId = "library-card-element" }: Props) {
    const mi = patron.middle_initial ? `${patron.middle_initial}. ` : "";
    const sfx = patron.suffix ? ` ${patron.suffix}` : "";
    const fullName = `${patron.first_name} ${mi}${patron.last_name}${sfx}`;

    const streetInfo = patron.street ? `${patron.street}, ` : "";
    const fullAddress = `${streetInfo}Brgy. ${patron.barangay}, ${patron.municipality}, ${patron.province}`;

    return (
        <div
            id={cardId}
            // REMOVED TAILWIND CLASSES HERE TO PREVENT OKLCH INHERITANCE CRASH
            style={{
                fontFamily: "ui-sans-serif, system-ui, sans-serif", // Replaces font-sans
                color: "#000000", // Replaces text-black
                width: "3.375in",
                height: "2.125in",
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #fbcfe8",
                backgroundColor: "#ffffff",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                padding: "16px",
            }}
        >
            <img
                src="/images/GeronaLibraryLogo.png"
                alt="Library Watermark"
                style={{
                    position: "absolute",
                    left: "-75px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: "320px",
                    width: "320px",
                    objectFit: "contain",
                    opacity: 0.06,
                    zIndex: 0,
                    pointerEvents: "none",
                }}
            />

            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 64 64"
                width="128"
                height="128"
                style={{
                    position: "absolute",
                    right: "-16px",
                    bottom: "-16px",
                    width: "128px",
                    height: "128px",
                    opacity: 0.06,
                    zIndex: 0,
                    pointerEvents: "none"
                }}
                fill="#f43f5e" /* CHANGED FROM currentColor TO HARDCODED HEX TO STOP PARSE CRASHES */
            >
                <path d="M62 14c-2-1-10-3-22-1l-8 2-8-2c-12-2-20 0-22 1a2 2 0 0 0-1 2v36c0 1 1 2 2 1 2-1 10-2 21 0l8 3 8-3c11-2 19-1 21 0 1 1 2 0 2-1V16a2 2 0 0 0-1-2z" />
            </svg>

            <div style={{ flex: 1, zIndex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <img
                        src="/images/GeronaLibraryLogo.png"
                        alt="Gerona Library"
                        style={{ width: "26px", height: "26px", objectFit: "contain" }}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                    <div>
                        <h1 style={{ fontSize: "11px", fontWeight: "900", margin: 0, color: "#be185d", letterSpacing: "0.02em", lineHeight: "1" }}>
                            GERONA MUNICIPAL LIBRARY
                        </h1>
                        <p style={{ fontSize: "7px", fontWeight: "bold", margin: "2px 0 0 0", color: "#db2777", letterSpacing: "0.05em" }}>
                            Dr. Jorge Cleofas Bocobo Library
                        </p>
                    </div>
                </div>

                <div style={{ marginBottom: "2px", marginTop: "8px" }}>
                    <h2 style={{ fontSize: "16px", fontWeight: "900", margin: "0 0 4px 0", color: "#0f172a", lineHeight: "1.1" }}>
                        {fullName}
                    </h2>
                    <p style={{ fontSize: "9px", fontWeight: "600", margin: "0 0 2px 0", color: "#334155" }}>
                        {patron.type}
                    </p>
                    {patron.contact_number && (
                        <p style={{ fontSize: "8px", fontWeight: "600", margin: "0 0 4px 0", color: "#475569" }}>
                            {patron.contact_number}
                        </p>
                    )}
                    <p style={{ fontSize: "7px", margin: 0, color: "#64748b", lineHeight: "1.3", maxWidth: "95%" }}>
                        {fullAddress}
                    </p>
                </div>
            </div>

            <div style={{ width: "105px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 1 }}>

                <QRCodeCanvas
                    value={patron.library_card_number}
                    size={380}
                    level="M"
                    includeMargin={false}
                    fgColor="#be185d"
                    style={{
                        width: "95px",
                        height: "95px"
                    }}
                />

                <p style={{
                    fontSize: "11px",
                    fontWeight: "900",
                    margin: "8px 0 0 0",
                    fontFamily: "monospace",
                    color: "#be185d",
                    letterSpacing: "0.05em"
                }}>
                    {patron.library_card_number}
                </p>
            </div>
        </div>
    );
}