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

    useEffect(() => {
        axios
            .get("/api/print-station/active-visitors")
            .then((res) => setActiveVisitors(res.data))
            .catch(() => { });
    }, []);

    const isValidVisitor = data.visitor_name.trim() !== "" && activeVisitors.some(
        (v) => v.visitor_name.toLowerCase() === data.visitor_name.trim().toLowerCase()
    );

    const submitPrintJob: FormEventHandler = (e) => {
        e.preventDefault();

        if (!isValidVisitor) return;

        post(route("print-station.upload"), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setSearchTerm("");
                if (fileInputRef.current) fileInputRef.current.value = "";

                setShowSuccessOverlay(true);

                setTimeout(() => setShowSuccessOverlay(false), 4000);
            },
        });
    };

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

    return (
        <PublicLayout>
            <Head title="Print Station" />

            {showSuccessOverlay && typeof window !== "undefined" && createPortal(
                <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-500 animate-in fade-in zoom-in px-4">
                    <div className="flex flex-col items-center max-w-lg mx-auto text-center">
                        <div className="w-64 h-64 md:w-80 md:h-80 -mt-10 md:-mt-20">
                            <Lottie
                                animationData={successAnimation}
                                loop={false}
                                className="w-full h-full object-contain scale-125 md:scale-150"
                            />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-fuchsia-500 drop-shadow-sm font-serif tracking-tight mt-4 md:mt-8">
                            Files Sent!
                        </h2>
                        <p className="text-stone-600 text-sm md:text-base font-bold mt-4 bg-white/90 px-6 py-3 rounded-2xl shadow-sm border border-fuchsia-100">
                            Please approach the librarian to collect your prints.
                        </p>
                    </div>
                </div>,
                document.body
            )}

            <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full ">

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 pb-6 border-b border-fuchsia-100">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-fuchsia-50 text-fuchsia-600 rounded-full font-potta text-[10px] uppercase tracking-widest border border-fuchsia-100 shadow-sm mb-3 md:mb-2">
                            <Icon
                                icon="solar:printer-minimalistic-bold-duotone"
                                className="w-3 h-3 text-fuchsia-500"
                            />
                            Library Service
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-slate-800 tracking-tight leading-tight">
                            Print <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-500 to-purple-500">Station</span>
                        </h1>
                        <p className="text-sm text-stone-500 font-medium mt-1.5 md:mt-2">
                            Upload your documents directly to the librarian's desk.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                    <aside className="lg:col-span-4 flex flex-col gap-6 w-full">
                        <div className="bg-white rounded-3xl border border-fuchsia-100 p-5 md:p-6 shadow-sm space-y-5">
                            <h3 className="font-serif font-black text-lg text-slate-800 flex items-center gap-2">
                                <Icon icon="solar:info-circle-bold-duotone" className="w-5 h-5 text-fuchsia-500" />
                                How It Works
                            </h3>
                            <ul className="text-sm text-stone-600 space-y-4">
                                <li className="flex gap-3 items-start">
                                    <Icon icon="solar:user-bold-duotone" className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">Search your name (Make sure you are "Logged In" in the visitor Kiosk).</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Icon icon="solar:upload-bold-duotone" className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">Upload your document here.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Icon icon="solar:printer-bold-duotone" className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">Bring your paper then the librarian will print it for you.</span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Icon icon="solar:wallet-money-bold-duotone" className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
                                    <span className="leading-relaxed">Collect your printout.</span>
                                </li>
                            </ul>
                            <div className="pt-4 border-t border-fuchsia-50 text-[11px] font-bold tracking-wide uppercase text-stone-400">
                                Supported files: PDF, Word, Excel, PowerPoint, Images
                            </div>
                        </div>

                        <div className="bg-fuchsia-50/50 rounded-3xl border border-fuchsia-100 p-4 flex justify-center items-center shadow-sm">
                            <div className="w-40 h-40 md:w-48 md:h-48 -scale-x-100">
                                <Lottie
                                    animationData={printAnimation}
                                    loop={true}
                                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </aside>

                    <section className="lg:col-span-8 w-full">
                        <div className="bg-white rounded-3xl border border-fuchsia-100 p-5 md:p-6 shadow-sm">
                            <form onSubmit={submitPrintJob} className="space-y-6 md:space-y-8">

                                <div className="flex flex-col md:flex-row gap-4 md:items-end z-30 relative">

                                    <div className="relative flex-1">
                                        <Label className="font-bold text-sm mb-2 block flex items-center justify-between text-stone-600">
                                            <span>Find Your Name</span>
                                            {isValidVisitor && (
                                                <span className="text-[10px] md:text-xs text-emerald-600 flex items-center gap-1 font-black bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
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
                                                className={`h-12 w-full pr-10 rounded-2xl transition-colors focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500 text-sm ${isValidVisitor ? "border-emerald-300 bg-emerald-50/30" : ""}`}
                                            />
                                            {isValidVisitor && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500">
                                                    <Icon icon="solar:check-circle-bold" className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        {showDropdown && filteredVisitors.length > 0 && (
                                            <div className="absolute z-50 w-full bg-white border border-stone-100 rounded-2xl mt-2 shadow-xl max-h-56 overflow-y-auto overflow-x-hidden">
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
                                                        className="px-4 py-3 hover:bg-fuchsia-50 cursor-pointer border-b border-stone-50 last:border-0 transition-colors"
                                                    >
                                                        <p className="font-bold text-slate-800 text-sm">
                                                            {v.visitor_name}
                                                        </p>
                                                        <p className="text-xs text-stone-500 mt-0.5 truncate">
                                                            {v.school || v.address}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                        {showDropdown && searchTerm.length > 0 && filteredVisitors.length === 0 && (
                                            <div className="absolute z-50 w-full bg-white border border-rose-100 rounded-2xl mt-2 shadow-xl p-5 text-center">
                                                <p className="text-sm font-bold text-rose-500">Not found or not logged in.</p>
                                                <p className="text-xs text-stone-500 mt-1">Please log in at the Kiosk first.</p>
                                            </div>
                                        )}
                                    </div>

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
                                            className={`h-12 px-6 w-full md:w-auto border rounded-2xl font-bold transition-all flex items-center justify-center gap-2 shadow-sm ${isValidVisitor
                                                ? "border-fuchsia-300 bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-100 hover:border-fuchsia-400 hover:-translate-y-0.5 hover:shadow-md cursor-pointer duration-300"
                                                : "border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed"
                                                }`}
                                        >
                                            <Icon icon="solar:document-add-bold-duotone" className="w-5 h-5" />
                                            Add Document
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 md:pr-2 custom-scrollbar">
                                    {data.documents.length === 0 ? (
                                        <div className="py-12 md:py-16 text-center border-2 border-dashed border-stone-200 rounded-3xl bg-stone-50 flex flex-col items-center justify-center gap-3 px-4">
                                            <Icon icon="solar:document-text-line-duotone" className="w-12 h-12 text-stone-300" />
                                            {isValidVisitor ? (
                                                <p className="text-stone-500 text-sm font-medium">No documents added yet. Click "Add Document" above.</p>
                                            ) : (
                                                <p className="text-stone-500 text-sm font-medium text-center">Select your name above to unlock adding documents.</p>
                                            )}
                                        </div>
                                    ) : (
                                        data.documents.map((doc) => (
                                            <div
                                                key={doc.id}
                                                className="border border-stone-200 rounded-2xl p-4 md:p-5 bg-white shadow-sm relative transition-all hover:border-fuchsia-200 hover:shadow-md"
                                            >
                                                <div className="flex items-start justify-between border-b border-stone-100 pb-4 mb-4">
                                                    <div className="flex items-center gap-3 pr-2 overflow-hidden">
                                                        <span className="bg-fuchsia-500 text-white text-[10px] md:text-xs font-black px-2.5 py-1 md:px-3 md:py-1.5 rounded-lg tracking-widest shrink-0 uppercase">
                                                            {doc.extension}
                                                        </span>
                                                        <h4 className="font-bold text-slate-700 truncate text-sm md:text-base" title={doc.file.name}>
                                                            {doc.file.name}
                                                        </h4>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeDoc(doc.id)}
                                                        className="flex items-center gap-1.5 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 md:px-3 py-1.5 rounded-xl transition-colors text-xs font-bold shrink-0"
                                                    >
                                                        <Icon icon="solar:trash-bin-trash-bold" className="w-4 h-4" />
                                                        <span className="hidden sm:inline">Remove</span>
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] md:text-xs font-bold text-stone-500 uppercase tracking-wider block">Document Name</Label>
                                                        <Input
                                                            value={doc.custom_name}
                                                            onChange={(e) => updateDoc(doc.id, "custom_name", e.target.value)}
                                                            className="bg-stone-50 h-10 md:h-11 rounded-xl focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500 text-sm"
                                                            placeholder="Rename file..."
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] md:text-xs font-bold text-stone-500 uppercase tracking-wider block z-20 relative">Paper Size</Label>
                                                        <CustomSelect
                                                            value={doc.paper_size}
                                                            onChange={(val) => updateDoc(doc.id, "paper_size", val)}
                                                            options={["Short (8.5 x 11)", "A4", "Long (8.5 x 13)"]}
                                                            theme="fuchsia"
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] md:text-xs font-bold text-stone-500 uppercase tracking-wider block">Pages</Label>
                                                        <Input
                                                            type="text"
                                                            value={doc.pages}
                                                            onChange={(e) => updateDoc(doc.id, "pages", e.target.value)}
                                                            className="bg-stone-50 h-10 md:h-11 rounded-xl focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500 text-sm"
                                                            placeholder="e.g. 1-3, 5, All"
                                                        />
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <Label className="text-[10px] md:text-xs font-bold text-stone-500 uppercase tracking-wider block">Copies</Label>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            value={doc.copies}
                                                            onChange={(e) => updateDoc(doc.id, "copies", parseInt(e.target.value) || 1)}
                                                            className="bg-stone-50 h-10 md:h-11 rounded-xl focus-visible:ring-fuchsia-500 focus-visible:border-fuchsia-500 text-sm"
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
                                    className={`w-full font-bold md:font-black h-12 md:h-14 text-sm md:text-base rounded-2xl transition-all duration-300 ${!isValidVisitor
                                        ? "bg-stone-200 text-stone-500 cursor-not-allowed shadow-none hover:bg-stone-200"
                                        : "bg-linear-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 text-white shadow-lg shadow-fuchsia-200/50 hover:shadow-xl hover:-translate-y-0.5 border-0"
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