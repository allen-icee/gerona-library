import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import Lottie from "lottie-react";
// 1. IMPORT HTML-TO-IMAGE INSTEAD OF HTML2CANVAS
import { toPng, toBlob } from "html-to-image";
import loadingAnimation from "@/assets/lottie/qr-scan.json";
import LibraryCard, { Patron } from "@/Components/LibraryCard";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    patronData: Patron | null;
}

export default function SuccessCardModal({ isOpen, onClose, patronData }: Props) {
    const [isGenerating, setIsGenerating] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setIsGenerating(true);
            const timer = setTimeout(() => setIsGenerating(false), 2500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen || !patronData) return null;

    // DOWNLOAD FUNCTION USING HTML-TO-IMAGE
    const downloadCard = async () => {
        const cardElement = document.getElementById("export-library-card");
        if (!cardElement) return;

        try {
            // toPng handles modern CSS, SVGs, and oklch colors natively!
            const dataUrl = await toPng(cardElement, {
                pixelRatio: 3,
                backgroundColor: '#ffffff'
            });

            const downloadLink = document.createElement("a");
            downloadLink.href = dataUrl;
            downloadLink.download = `GeronaLibraryCard_${patronData.library_card_number}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        } catch (error) {
            console.error("Failed to generate image:", error);
        }
    };

    // NATIVE SHARE FUNCTION USING HTML-TO-IMAGE
    const shareCard = async () => {
        const cardElement = document.getElementById("export-library-card");
        if (!cardElement) return;

        try {
            const blob = await toBlob(cardElement, {
                pixelRatio: 3,
                backgroundColor: '#ffffff'
            });
            if (!blob) throw new Error("Could not generate image");

            const file = new File([blob], `GeronaLibraryCard_${patronData.library_card_number}.png`, { type: 'image/png' });

            if (navigator.share) {
                await navigator.share({
                    title: 'My Gerona Library Card',
                    text: `Here is my Digital Library Card! ID: ${patronData.library_card_number}`,
                    files: [file]
                });
            } else {
                alert("Your browser doesn't support native sharing. Please use the Save button instead.");
            }
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    const ModalContent = (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-0 bg-stone-900/70 backdrop-blur-md animate-in fade-in duration-500">

            {/* PHASE 1: Loading Overlay */}
            {isGenerating ? (
                <div className="flex flex-col items-center justify-center animate-in zoom-in duration-500">
                    <div className="w-64 h-64 md:w-80 md:h-80 drop-shadow-2xl">
                        <Lottie animationData={loadingAnimation} loop={true} className="w-full h-full" />
                    </div>
                    <h2 className="text-white text-2xl md:text-3xl font-black tracking-widest mt-6 animate-pulse font-serif drop-shadow-lg">
                        Generating Card...
                    </h2>
                </div>
            ) : (

                /* PHASE 2: Success Modal */
                <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-[28rem] overflow-hidden flex flex-col items-center p-8 relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-700">

                    <div className="text-center space-y-1 mb-6 w-full">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner border border-emerald-200">
                            <Icon icon="solar:check-circle-bold-duotone" className="w-10 h-10" />
                        </div>
                        <h2 className="text-3xl font-serif font-black text-slate-800 tracking-tight">
                            Registration Complete!
                        </h2>
                    </div>

                    {/* THE ACTUAL LIBRARY CARD PREVIEW */}
                    <div className="w-full flex justify-center py-4 bg-stone-50 rounded-3xl border border-stone-200 shadow-inner mb-6">
                        <div style={{ transform: "scale(0.85)", transformOrigin: "center" }}>
                            <LibraryCard patron={patronData} cardId="export-library-card" />
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold px-5 py-3.5 rounded-2xl flex items-center gap-3 w-full shadow-sm">
                        <Icon icon="solar:letter-opened-bold-duotone" className="w-8 h-8 shrink-0 text-emerald-500" />
                        <p className="leading-relaxed">
                            A copy of this digital library card has also been sent to your <span className="font-black">@gmail.com</span> address.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 w-full mt-6">
                        <div className="flex gap-3">
                            <button
                                onClick={downloadCard}
                                className="flex-1 bg-amber-400 text-amber-950 font-black text-sm py-4 rounded-xl hover:bg-amber-300 hover:shadow-[0_8px_20px_rgba(251,191,36,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                <Icon icon="solar:download-square-bold-duotone" className="w-5 h-5" />
                                Save ID Card
                            </button>

                            <button
                                onClick={shareCard}
                                className="flex-1 bg-pink-50 text-pink-600 border border-pink-200 font-black text-sm py-4 rounded-xl hover:bg-pink-500 hover:text-white hover:shadow-[0_8px_20px_rgba(236,72,153,0.3)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                <Icon icon="solar:share-circle-bold-duotone" className="w-5 h-5" />
                                Share
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full bg-stone-100 text-stone-500 font-bold text-sm py-3.5 rounded-xl hover:bg-stone-200 hover:text-stone-800 transition-colors flex items-center justify-center gap-2 mt-2"
                        >
                            <Icon icon="solar:user-plus-rounded-bold-duotone" className="w-5 h-5" />
                            Register Another Person
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    return createPortal(ModalContent, document.body);
}