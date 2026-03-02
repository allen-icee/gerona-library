import { FormEventHandler, useRef, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function PrintModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Kiosk Search State
    const [activeVisitors, setActiveVisitors] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        recentlySuccessful,
        reset,
        clearErrors,
    } = useForm({
        visitor_name: "",
        school_or_barangay: "",
        documents: [] as {
            id: string;
            file: File;
            custom_name: string;
            copies: number;
            paper_size: string;
        }[],
    });

    // Fetch active visitors from Kiosk when modal opens
    useEffect(() => {
        if (isOpen) {
            axios
                .get("/api/print-station/active-visitors")
                .then((res) => setActiveVisitors(res.data))
                .catch((err) => console.error("Could not fetch visitors", err));
        } else {
            clearErrors();
            setSearchTerm("");
            reset();
        }
    }, [isOpen]);

    const submitPrintJob: FormEventHandler = (e) => {
        e.preventDefault();

        // Ensure they selected a name
        if (!data.visitor_name) {
            setData("visitor_name", searchTerm || "Guest");
        }

        post(route("print-station.upload"), {
            preserveScroll: true,
            forceFormData: true, // This is crucial for uploading arrays of files!
            onSuccess: () => {
                reset();
                setSearchTerm("");
                if (fileInputRef.current) fileInputRef.current.value = "";
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newDocs = Array.from(e.target.files).map((file) => ({
                id: Math.random().toString(36).substring(7), // Unique ID for React map rendering
                file: file,
                custom_name: file.name.split(".").slice(0, -1).join("."), // Remove extension for clean renaming
                copies: 1,
                paper_size: "Short (8.5 x 11)",
            }));
            setData("documents", [...data.documents, ...newDocs]);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Helper functions for dynamic array
    const updateDoc = (id: string, field: string, value: any) => {
        setData(
            "documents",
            data.documents.map((doc) =>
                doc.id === id ? { ...doc, [field]: value } : doc,
            ),
        );
    };

    const removeDoc = (id: string) => {
        setData(
            "documents",
            data.documents.filter((doc) => doc.id !== id),
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white border-4 border-pink-200 rounded-[2rem] shadow-2xl sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-2xl font-serif font-black text-slate-800 flex items-center gap-2">
                        <Icon
                            icon="solar:printer-minimalistic-bold-duotone"
                            className="w-8 h-8 text-rose-500"
                        />
                        Print Station
                    </DialogTitle>
                    <DialogDescription className="text-stone-500 font-medium">
                        Search your name from the Kiosk and upload your files!
                        🖨️
                    </DialogDescription>
                </DialogHeader>

                {recentlySuccessful ? (
                    <div className="text-center py-6 space-y-4 animate-in zoom-in duration-300">
                        <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                            <Icon
                                icon="fluent-emoji:check-mark-button"
                                className="w-14 h-14"
                            />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">
                            Files Sent!
                        </h2>
                        <p className="text-stone-600 text-sm">
                            Please approach the librarian's desk to collect and
                            pay for your printouts.
                        </p>
                        <Button
                            onClick={() => onClose(false)}
                            className="w-full h-12 bg-rose-500 hover:bg-rose-600 rounded-2xl text-lg font-bold shadow-md mt-4"
                        >
                            Awesome!
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={submitPrintJob} className="space-y-5">
                        {/* 1. Kiosk Search Box */}
                        <div className="relative">
                            <Label className="text-stone-700 font-bold text-sm">
                                Find Your Name (Currently Time-In) *
                            </Label>
                            <Input
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setData("visitor_name", e.target.value);
                                    setShowDropdown(true);
                                }}
                                onFocus={() => setShowDropdown(true)}
                                onBlur={() =>
                                    setTimeout(
                                        () => setShowDropdown(false),
                                        200,
                                    )
                                }
                                placeholder="Type to search..."
                                required
                                className="h-12 rounded-2xl bg-pink-50/50 border-pink-200 focus-visible:ring-pink-400 font-medium"
                            />

                            {/* Dropdown Results */}
                            {showDropdown &&
                                activeVisitors.filter((v) =>
                                    v.visitor_name
                                        .toLowerCase()
                                        .includes(searchTerm.toLowerCase()),
                                ).length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border border-stone-200 rounded-xl mt-1 shadow-lg max-h-40 overflow-y-auto overflow-hidden">
                                        {activeVisitors
                                            .filter((v) =>
                                                v.visitor_name
                                                    .toLowerCase()
                                                    .includes(
                                                        searchTerm.toLowerCase(),
                                                    ),
                                            )
                                            .map((v) => (
                                                <div
                                                    key={v.id}
                                                    className="px-4 py-3 hover:bg-pink-50 cursor-pointer border-b border-stone-50 last:border-0"
                                                    onClick={() => {
                                                        setSearchTerm(
                                                            v.visitor_name,
                                                        );
                                                        setData(
                                                            "visitor_name",
                                                            v.visitor_name,
                                                        );
                                                        setData(
                                                            "school_or_barangay",
                                                            v.school ||
                                                                v.address ||
                                                                "Guest",
                                                        );
                                                        setShowDropdown(false);
                                                    }}
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
                        </div>

                        {/* 2. Dynamic Document List */}
                        <div className="space-y-3">
                            <Label className="text-stone-700 font-bold text-sm">
                                Your Documents to Print
                            </Label>

                            {data.documents.map((doc, index) => (
                                <div
                                    key={doc.id}
                                    className="relative p-4 bg-pink-50/50 rounded-2xl border border-pink-200 animate-in fade-in slide-in-from-top-2"
                                >
                                    <button
                                        type="button"
                                        onClick={() => removeDoc(doc.id)}
                                        className="absolute top-3 right-3 text-pink-400 hover:text-rose-600 transition-colors p-1"
                                        title="Remove File"
                                    >
                                        <Icon
                                            icon="solar:trash-bin-trash-bold"
                                            className="w-5 h-5"
                                        />
                                    </button>

                                    <div className="pr-8 mb-3">
                                        <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                                            Rename File (Optional)
                                        </Label>
                                        <Input
                                            value={doc.custom_name}
                                            onChange={(e) =>
                                                updateDoc(
                                                    doc.id,
                                                    "custom_name",
                                                    e.target.value,
                                                )
                                            }
                                            className="h-9 text-sm font-medium bg-white"
                                            placeholder="e.g. Assignment 1"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                                                Paper Size
                                            </Label>
                                            <select
                                                value={doc.paper_size}
                                                onChange={(e) =>
                                                    updateDoc(
                                                        doc.id,
                                                        "paper_size",
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full h-9 px-3 text-sm rounded-md border border-stone-200 bg-white"
                                            >
                                                <option value="Short (8.5 x 11)">
                                                    Short (8.5 x 11)
                                                </option>
                                                <option value="A4">A4</option>
                                                <option value="Long (8.5 x 13)">
                                                    Long (8.5 x 13)
                                                </option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1 block">
                                                Copies
                                            </Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={doc.copies}
                                                onChange={(e) =>
                                                    updateDoc(
                                                        doc.id,
                                                        "copies",
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="h-9 text-sm bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {/* Add File Button */}
                            <div className="relative overflow-hidden group">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                    multiple
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="w-full py-4 border-2 border-dashed border-pink-300 rounded-2xl text-pink-500 font-bold hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Icon
                                        icon="solar:document-add-bold-duotone"
                                        className="w-6 h-6"
                                    />
                                    Add Document
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing || data.documents.length === 0}
                            className="w-full h-14 text-lg bg-rose-500 hover:bg-rose-600 disabled:bg-pink-300 text-white rounded-2xl font-black shadow-lg shadow-pink-200 mt-6"
                        >
                            {processing
                                ? "Sending..."
                                : `Send ${data.documents.length} File(s) to Librarian`}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
