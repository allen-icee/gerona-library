// resources/js/Pages/Public/Print.tsx

import { FormEventHandler, useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Head, useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import axios from "axios";

import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import CustomSelect from "@/Components/CustomSelect";

import Lottie from "lottie-react";
import printAnimation from "@/assets/lottie/public-print.json";
import successAnimation from "@/assets/lottie/print-success.json";

export default function Print() {

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [activeVisitors, setActiveVisitors] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // State to control the full-screen success overlay
    const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        reset,
    } = useForm({
        visitor_name: "",
        school_or_barangay: "",
        documents: [] as {
            id: string;
            file: File;
            custom_name: string;
            copies: number;
            paper_size: string;
            pages: string;
            extension: string;
        }[],
    });

    /* Fetch Active Visitors */
    useEffect(() => {
        axios
            .get("/api/print-station/active-visitors")
            .then((res) => setActiveVisitors(res.data))
            .catch(() => { });
    }, []);

    // SECURITY CHECK: Is the currently typed/selected name exactly matching an active visitor?
    const isValidVisitor = data.visitor_name.trim() !== "" && activeVisitors.some(
        (v) => v.visitor_name.toLowerCase() === data.visitor_name.trim().toLowerCase()
    );

    /* Submit */
    const submitPrintJob: FormEventHandler = (e) => {
        e.preventDefault();

        // Extra layer of protection in case they hack the disabled button
        if (!isValidVisitor) return;

        post(route("print-station.upload"), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                // Clear the form fields
                reset();
                setSearchTerm("");
                if (fileInputRef.current) fileInputRef.current.value = "";

                // Show the full-screen overlay
                setShowSuccessOverlay(true);

                // Hide the overlay after 4 seconds automatically
                setTimeout(() => setShowSuccessOverlay(false), 4000);
            },
        });
    };

    /* File Upload */
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newDocs = Array.from(e.target.files).map((file) => {
            const nameParts = file.name.split(".");
            const extension = nameParts.length > 1 ? nameParts.pop()?.toUpperCase() || "FILE" : "FILE";
            const baseName = nameParts.join(".");

            return {
                id: Math.random().toString(36).substring(2),
                file,
                custom_name: baseName,
                copies: 1,
                paper_size: "Short (8.5 x 11)",
                pages: "All",
                extension: extension,
            };
        });

        setData("documents", [...data.documents, ...newDocs]);

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const updateDoc = (id: string, field: string, value: any) => {
        setData(
            "documents",
            data.documents.map((doc) =>
                doc.id === id ? { ...doc, [field]: value } : doc
            )
        );
    };

    const removeDoc = (id: string) => {
        setData(
            "documents",
            data.documents.filter((doc) => doc.id !== id)
        );
    };

    const filteredVisitors = activeVisitors.filter((v) =>
        v.visitor_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    /* ======================================================= */

    return (
        <PublicLayout>
            <Head title="Print Station" />

            {/* FULL SCREEN SUCCESS OVERLAY RENDERED IN A PORTAL */}
            {showSuccessOverlay && typeof window !== "undefined" && createPortal(
                <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-500 animate-in fade-in zoom-in">
                    <div className="w-80 h-80 md:w-96 md:h-96 relative">
                        <Lottie
                            animationData={successAnimation}
                            loop={false}
                            className="w-full h-full object-contain scale-150"
                        />
                    </div>
                    <div className="absolute flex flex-col items-center mt-32">
                        <h2 className="text-4xl md:text-5xl font-black text-fuchsia-500 drop-shadow-sm font-potta">
                            Files Sent!
                        </h2>
                        <p className="text-stone-600 font-bold mt-3 bg-white/90 px-6 py-2 rounded-full shadow-sm border border-fuchsia-100 text-center">
                            Please approach the librarian to collect your prints.
                        </p>
                    </div>
                </div>,
                document.body
            )}

            <div className="flex flex-col gap-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-fuchsia-100">
                    <div>
                        <div className="inline-flex items-center gap-2 text-fuchsia-500 font-potta text-[10px] uppercase tracking-widest mb-1">
                            <Icon
                                icon="solar:printer-minimalistic-bold-duotone"
                                className="w-4 h-4"
                            />
                            Library Service
                        </div>
                        <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-800">
                            Print <span className="text-fuchsia-500">Station</span>
                        </h1>
                        <p className="text-sm text-stone-400 mt-1">
                            Upload your documents directly to the librarian's desk.
                        </p>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-12 gap-8">

                    {/* LEFT COLUMN — INFO & LOTTIE */}
                    <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl border border-fuchsia-100 p-6 shadow-sm space-y-5">
                            <h3 className="font-black text-sm uppercase tracking-wider text-fuchsia-500">
                                How It Works
                            </h3>
                            <ul className="text-sm text-stone-500 space-y-3">
                                <li className="flex gap-2">
                                    <Icon icon="solar:user-bold-duotone" className="w-4 h-4 text-fuchsia-400 mt-0.5" />
                                    Search your name (Make sure you are "Logged In" in the visitor Kiosk).
                                </li>
                                <li className="flex gap-2">
                                    <Icon icon="solar:upload-bold-duotone" className="w-4 h-4 text-fuchsia-400 mt-0.5" />
                                    Upload your document here.
                                </li>
                                <li className="flex gap-2">
                                    <Icon icon="solar:printer-bold-duotone" className="w-4 h-4 text-fuchsia-400 mt-0.5" />
                                    Bring your paper then the librarian will print it for you.
                                </li>
                                <li className="flex gap-2">
                                    <Icon icon="solar:wallet-money-bold-duotone" className="w-4 h-4 text-fuchsia-400 mt-0.5" />
                                    Collect your printout.
                                </li>
                            </ul>
                            <div className="pt-3 border-t text-xs text-stone-400">
                                Supported files: PDF, Word, Excel, PowerPoint, Images
                            </div>
                        </div>

                        <div className="bg-fuchsia-50/50 rounded-2xl border border-fuchsia-100 p-2 flex justify-center items-center shadow-sm">
                            <div className="w-38 h-38 md:w-43 md:h-43 -scale-x-100">
                                <Lottie
                                    animationData={printAnimation}
                                    loop={true}
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT COLUMN — FORM */}
                    <section className="col-span-12 lg:col-span-8">
                        <div className="bg-white rounded-2xl border border-fuchsia-100 p-6 shadow-sm">
                            <form onSubmit={submitPrintJob} className="space-y-6">

                                {/* Action Bar: Search & Upload combined */}
                                <div className="flex flex-col md:flex-row gap-4 md:items-end z-30 relative">

                                    {/* Visitor Search */}
                                    <div className="relative flex-1">
                                        <Label className="font-bold text-sm mb-2 block flex items-center justify-between">
                                            <span>Find Your Name</span>
                                            {isValidVisitor && (
                                                <span className="text-xs text-emerald-500 flex items-center gap-1 font-black bg-emerald-50 px-2 py-0.5 rounded-full">
                                                    <Icon icon="solar:check-circle-bold" /> Verified Visitor
                                                </span>
                                            )}
                                        </Label>
                                        <div className="relative w-full">
                                            <Input
                                                value={searchTerm}
                                                required
                                                placeholder="Start typing your name..."
                                                onFocus={() => setShowDropdown(true)}
                                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                    setData("visitor_name", e.target.value);
                                                    setShowDropdown(true);
                                                }}
                                                className={`h-12 w-full pr-10 transition-colors focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500 ${isValidVisitor ? "border-emerald-300 bg-emerald-50/30" : ""}`}
                                            />
                                            {isValidVisitor && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                                                    <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        {showDropdown && filteredVisitors.length > 0 && (
                                            <div className="absolute z-50 w-full bg-white border rounded-xl mt-2 shadow-lg max-h-56 overflow-y-auto">
                                                {filteredVisitors.map((v) => (
                                                    <div
                                                        key={v.id}
                                                        onClick={() => {
                                                            setSearchTerm(v.visitor_name);
                                                            setData("visitor_name", v.visitor_name);
                                                            setData(
                                                                "school_or_barangay",
                                                                v.school || v.address || "Guest"
                                                            );
                                                            setShowDropdown(false);
                                                        }}
                                                        className="px-4 py-3 hover:bg-fuchsia-50 cursor-pointer border-b last:border-0"
                                                    >
                                                        <p className="font-bold text-slate-800">
                                                            {v.visitor_name}
                                                        </p>
                                                        <p className="text-xs text-stone-500">
                                                            {v.school || v.address}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {showDropdown && searchTerm.length > 0 && filteredVisitors.length === 0 && (
                                            <div className="absolute z-50 w-full bg-white border rounded-xl mt-2 shadow-lg p-4 text-center">
                                                <p className="text-sm font-bold text-rose-500">Not found or not logged in.</p>
                                                <p className="text-xs text-stone-500 mt-1">Please log in at the Kiosk first.</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upload Trigger (Moved beside the search bar) */}
                                    <div className="w-full md:w-auto shrink-0">
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                        <button
                                            type="button"
                                            disabled={!isValidVisitor}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={`h-12 px-6 w-full md:w-auto border rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${isValidVisitor
                                                ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-100 hover:border-fuchsia-400 cursor-pointer"
                                                : "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
                                                }`}
                                        >
                                            <Icon icon="solar:document-add-bold-duotone" className="w-5 h-5" />
                                            Add Document
                                        </button>
                                    </div>
                                </div>

                                {/* Documents List - Scrollable Fixed Height Container */}
                                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
                                    {data.documents.length === 0 ? (
                                        <div className="py-12 text-center border-2 border-dashed border-stone-200 rounded-xl bg-stone-50 flex flex-col items-center justify-center gap-3">
                                            <Icon icon="solar:document-text-line-duotone" className="w-12 h-12 text-stone-300" />
                                            {isValidVisitor ? (
                                                <p className="text-stone-500 text-sm font-medium">No documents added yet. Click "Add Document" above.</p>
                                            ) : (
                                                <p className="text-stone-500 text-sm font-medium">Select your name above to unlock adding documents.</p>
                                            )}
                                        </div>
                                    ) : (
                                        data.documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="border border-stone-200 rounded-xl p-5 bg-white shadow-sm relative transition-all hover:border-fuchsia-200 hover:shadow-md"
                                            >
                                                <div className="flex items-start justify-between border-b border-stone-100 pb-4 mb-4">
                                                    <div className="flex items-center gap-3 pr-2 overflow-hidden">
                                                        <span className="bg-fuchsia-500 text-white text-xs font-black px-3 py-1.5 rounded-md tracking-widest shrink-0">
                                                            {doc.extension}
                                                        </span>
                                                        <h4 className="font-bold text-slate-700 truncate text-sm md:text-base" title={doc.file.name}>
                                                            {doc.file.name}
                                                        </h4>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDoc(doc.id)}
                                                        className="flex items-center gap-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors text-xs font-bold shrink-0"
                                                    >
                                                        <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Remove</span>
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Document Name</Label>
                                                        <Input
                                                            value={doc.custom_name}
                                                            onChange={(e) => updateDoc(doc.id, "custom_name", e.target.value)}
                                                            className="bg-stone-50 h-10 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500"
                                                            placeholder="Rename file..."
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider z-20 relative">Paper Size</Label>
                                                        <CustomSelect
                                                            value={doc.paper_size}
                                                            onChange={(val) => updateDoc(doc.id, "paper_size", val)}
                                                            options={["Short (8.5 x 11)", "A4", "Long (8.5 x 13)"]}
                                                            theme="fuchsia"
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pages</Label>
                                                        <Input
                                                            type="text"
                                                            value={doc.pages}
                                                            onChange={(e) => updateDoc(doc.id, "pages", e.target.value)}
                                                            className="bg-stone-50 h-10 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500"
                                                            placeholder="e.g. 1-3, 5, All"
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Copies</Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={doc.copies}
                                                            onChange={(e) => updateDoc(doc.id, "copies", parseInt(e.target.value) || 1)}
                                                            className="bg-stone-50 h-10 focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing || data.documents.length === 0 || !isValidVisitor}
                                    className={`w-full font-black h-12 text-base transition-all ${!isValidVisitor
                                        ? "bg-stone-200 text-stone-500 cursor-not-allowed shadow-none hover:bg-stone-200"
                                        : "bg-fuchsia-500 hover:bg-fuchsia-600 text-white shadow-lg shadow-fuchsia-200"
                                        }`}
                                >
                                    {processing
                                        ? "Sending to Printer..."
                                        : !isValidVisitor
                                            ? "Select a Valid Visitor Name to Print"
                                            : data.documents.length === 0
                                                ? "Add at least one Document"
                                                : `Send ${data.documents.length} File(s)`}
                                </Button>

                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}