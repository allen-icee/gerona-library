// resources/js/Pages/Public/Print.tsx
import { FormEventHandler, useRef, useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import axios from "axios";
import PublicLayout from "@/Layouts/PublicLayout";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function Print() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [activeVisitors, setActiveVisitors] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    const { data, setData, post, processing, recentlySuccessful, reset, clearErrors } = useForm({
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

    useEffect(() => {
        axios
            .get("/api/print-station/active-visitors")
            .then((res) => setActiveVisitors(res.data))
            .catch((err) => console.error("Could not fetch visitors", err));
    }, []);

    const submitPrintJob: FormEventHandler = (e) => {
        e.preventDefault();
        if (!data.visitor_name) setData("visitor_name", searchTerm || "Guest");

        post(route("print-station.upload"), {
            preserveScroll: true,
            forceFormData: true,
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
                id: Math.random().toString(36).substring(7),
                file: file,
                custom_name: file.name.split(".").slice(0, -1).join("."),
                copies: 1,
                paper_size: "Short (8.5 x 11)",
            }));
            setData("documents", [...data.documents, ...newDocs]);
        }
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const updateDoc = (id: string, field: string, value: any) => {
        setData("documents", data.documents.map((doc) => doc.id === id ? { ...doc, [field]: value } : doc));
    };

    const removeDoc = (id: string) => {
        setData("documents", data.documents.filter((doc) => doc.id !== id));
    };

    return (
        <PublicLayout>
            <Head title="Print Station - Gerona Library" />

            <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8">
                <div className="mb-8 text-center md:text-left">
                    <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-800 flex items-center justify-center md:justify-start gap-3">
                        <Icon icon="solar:printer-minimalistic-bold-duotone" className="w-10 h-10 text-fuchsia-500" />
                        Print Station
                    </h1>
                    <p className="text-stone-500 font-medium mt-2">
                        Search your name from the Kiosk and upload your files directly to the librarian's desk. 🖨️
                    </p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-fuchsia-100 shadow-xl shadow-fuchsia-100/50">
                    {recentlySuccessful ? (
                        <div className="text-center py-12 space-y-4 animate-in zoom-in duration-300">
                            <div className="bg-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                                <Icon icon="fluent-emoji:check-mark-button" className="w-14 h-14" />
                            </div>
                            <h2 className="text-3xl font-black text-slate-800">Files Sent!</h2>
                            <p className="text-stone-600 text-base">
                                Please approach the librarian's desk to collect and pay for your printouts.
                            </p>
                            <Button
                                onClick={() => window.location.reload()}
                                className="w-full md:w-auto px-8 h-12 bg-fuchsia-500 hover:bg-fuchsia-600 rounded-2xl text-lg font-bold shadow-md mt-6"
                            >
                                Print Another File
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={submitPrintJob} className="space-y-6">
                            {/* Kiosk Search Box */}
                            <div className="relative">
                                <Label className="text-stone-700 font-bold text-sm mb-2 block">
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
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    placeholder="Type to search..."
                                    required
                                    className="h-14 rounded-2xl bg-fuchsia-50/50 border-fuchsia-200 focus-visible:ring-fuchsia-400 font-medium text-base px-4"
                                />

                                {showDropdown && activeVisitors.filter((v) => v.visitor_name.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 && (
                                    <div className="absolute z-10 w-full bg-white border border-stone-200 rounded-xl mt-2 shadow-xl max-h-48 overflow-y-auto">
                                        {activeVisitors
                                            .filter((v) => v.visitor_name.toLowerCase().includes(searchTerm.toLowerCase()))
                                            .map((v) => (
                                                <div
                                                    key={v.id}
                                                    className="px-5 py-3 hover:bg-fuchsia-50 cursor-pointer border-b border-stone-50 last:border-0"
                                                    onClick={() => {
                                                        setSearchTerm(v.visitor_name);
                                                        setData("visitor_name", v.visitor_name);
                                                        setData("school_or_barangay", v.school || v.address || "Guest");
                                                        setShowDropdown(false);
                                                    }}
                                                >
                                                    <p className="font-bold text-slate-800">{v.visitor_name}</p>
                                                    <p className="text-xs text-stone-500">{v.school || v.address}</p>
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>

                            {/* Document List */}
                            <div className="space-y-4">
                                <Label className="text-stone-700 font-bold text-sm">Your Documents to Print</Label>

                                {data.documents.map((doc) => (
                                    <div key={doc.id} className="relative p-5 bg-fuchsia-50/50 rounded-2xl border border-fuchsia-200 animate-in fade-in slide-in-from-top-2">
                                        <button
                                            type="button"
                                            onClick={() => removeDoc(doc.id)}
                                            className="absolute top-4 right-4 text-fuchsia-400 hover:text-rose-600 transition-colors"
                                            title="Remove File"
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold" className="w-6 h-6" />
                                        </button>

                                        <div className="pr-10 mb-4">
                                            <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Rename File (Optional)</Label>
                                            <Input
                                                value={doc.custom_name}
                                                onChange={(e) => updateDoc(doc.id, "custom_name", e.target.value)}
                                                className="h-10 text-sm font-medium bg-white"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Paper Size</Label>
                                                <select
                                                    value={doc.paper_size}
                                                    onChange={(e) => updateDoc(doc.id, "paper_size", e.target.value)}
                                                    className="w-full h-10 px-3 text-sm rounded-md border border-stone-200 bg-white"
                                                >
                                                    <option value="Short (8.5 x 11)">Short (8.5 x 11)</option>
                                                    <option value="A4">A4</option>
                                                    <option value="Long (8.5 x 13)">Long (8.5 x 13)</option>
                                                </select>
                                            </div>
                                            <div>
                                                <Label className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">Copies</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={doc.copies}
                                                    onChange={(e) => updateDoc(doc.id, "copies", parseInt(e.target.value))}
                                                    className="h-10 text-sm bg-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Add File Button */}
                                <div className="relative overflow-hidden group mt-2">
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
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full py-5 border-2 border-dashed border-fuchsia-300 rounded-2xl text-fuchsia-500 font-bold hover:bg-fuchsia-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Icon icon="solar:document-add-bold-duotone" className="w-6 h-6" />
                                        Add Document
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={processing || data.documents.length === 0}
                                className="w-full h-14 text-lg bg-fuchsia-500 hover:bg-fuchsia-600 disabled:bg-fuchsia-300 text-white rounded-2xl font-black shadow-lg shadow-fuchsia-200 mt-6"
                            >
                                {processing ? "Sending..." : `Send ${data.documents.length} File(s) to Librarian`}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}