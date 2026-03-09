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

    const {
        data,
        setData,
        post,
        processing,
        recentlySuccessful,
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
        }[],
    });

    /* Fetch Active Visitors */

    useEffect(() => {
        axios
            .get("/api/print-station/active-visitors")
            .then((res) => setActiveVisitors(res.data))
            .catch(() => {});
    }, []);

    /* Submit */

    const submitPrintJob: FormEventHandler = (e) => {
        e.preventDefault();

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

    /* File Upload */

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        if (!e.target.files) return;

        const newDocs = Array.from(e.target.files).map((file) => ({
            id: Math.random().toString(36).substring(2),
            file,
            custom_name: file.name.split(".").slice(0, -1).join("."),
            copies: 1,
            paper_size: "Short (8.5 x 11)",
        }));

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

            <div className="flex flex-col gap-8">

                {/* HEADER (same style as catalog) */}

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-pink-100">

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

                {/* MAIN GRID (same structure as catalog) */}

                <div className="grid grid-cols-12 gap-8">

                    {/* LEFT COLUMN — INFO */}

                    <aside className="col-span-12 lg:col-span-4">

                        <div className="bg-white rounded-2xl border border-fuchsia-100 p-6 shadow-sm space-y-5">

                            <h3 className="font-black text-sm uppercase tracking-wider text-fuchsia-500">
                                How It Works
                            </h3>

                            <ul className="text-sm text-stone-500 space-y-3">

                                <li className="flex gap-2">
                                    <Icon icon="solar:user-bold-duotone" className="w-4 h-4 text-fuchsia-400 mt-0.5"/>
                                    Search your name from the visitor kiosk.
                                </li>

                                <li className="flex gap-2">
                                    <Icon icon="solar:upload-bold-duotone" className="w-4 h-4 text-fuchsia-400 mt-0.5"/>
                                    Upload your document here.
                                </li>

                                <li className="flex gap-2">
                                    <Icon icon="solar:printer-bold-duotone" className="w-4 h-4 text-fuchsia-400 mt-0.5"/>
                                    The librarian will print it for you.
                                </li>

                                <li className="flex gap-2">
                                    <Icon icon="solar:wallet-money-bold-duotone" className="w-4 h-4 text-fuchsia-400 mt-0.5"/>
                                    Pay and collect your printout.
                                </li>

                            </ul>

                            <div className="pt-3 border-t text-xs text-stone-400">
                                Supported files: PDF, Word, Excel, PowerPoint, Images
                            </div>

                        </div>

                    </aside>


                    {/* RIGHT COLUMN — FORM */}

                    <section className="col-span-12 lg:col-span-8">

                        <div className="bg-white rounded-2xl border border-fuchsia-100 p-6 shadow-sm">

                            {recentlySuccessful ? (

                                <div className="text-center py-10">

                                    <Icon
                                        icon="fluent-emoji:check-mark-button"
                                        className="w-16 h-16 mx-auto mb-4"
                                    />

                                    <h2 className="text-2xl font-black text-slate-800">
                                        Files Sent!
                                    </h2>

                                    <p className="text-stone-500 mt-1">
                                        Please approach the librarian to collect your prints.
                                    </p>

                                    <Button
                                        onClick={() => window.location.reload()}
                                        className="mt-6 bg-fuchsia-500 hover:bg-fuchsia-600"
                                    >
                                        Print Another File
                                    </Button>

                                </div>

                            ) : (

                                <form onSubmit={submitPrintJob} className="space-y-6">

                                    {/* Visitor Search */}

                                    <div className="relative">

                                        <Label className="font-bold text-sm mb-2 block">
                                            Find Your Name
                                        </Label>

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
                                            className="h-12"
                                        />

                                        {showDropdown && filteredVisitors.length > 0 && (

                                            <div className="absolute z-20 w-full bg-white border rounded-xl mt-2 shadow-lg max-h-56 overflow-y-auto">

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

                                    </div>

                                    {/* Documents */}

                                    {data.documents.map((doc) => (

                                        <div
                                            key={doc.id}
                                            className="border rounded-xl p-4 bg-fuchsia-50/30 relative"
                                        >

                                            <button
                                                type="button"
                                                onClick={() => removeDoc(doc.id)}
                                                className="absolute top-3 right-3 text-fuchsia-400 hover:text-rose-600"
                                            >
                                                <Icon icon="solar:trash-bin-trash-bold" />
                                            </button>

                                            <div className="grid md:grid-cols-3 gap-4">

                                                <Input
                                                    value={doc.custom_name}
                                                    onChange={(e) =>
                                                        updateDoc(doc.id, "custom_name", e.target.value)
                                                    }
                                                />

                                                <select
                                                    value={doc.paper_size}
                                                    onChange={(e) =>
                                                        updateDoc(doc.id, "paper_size", e.target.value)
                                                    }
                                                    className="border rounded-md px-2 text-sm"
                                                >
                                                    <option>Short (8.5 x 11)</option>
                                                    <option>A4</option>
                                                    <option>Long (8.5 x 13)</option>
                                                </select>

                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={doc.copies}
                                                    onChange={(e) =>
                                                        updateDoc(
                                                            doc.id,
                                                            "copies",
                                                            parseInt(e.target.value)
                                                        )
                                                    }
                                                />

                                            </div>

                                        </div>

                                    ))}

                                    {/* Upload */}

                                    <div>

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            multiple
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full py-5 border-2 border-dashed border-fuchsia-300 rounded-xl text-fuchsia-500 font-bold hover:bg-fuchsia-50"
                                        >
                                            Add Document
                                        </button>

                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={processing || data.documents.length === 0}
                                        className="w-full bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-black h-12"
                                    >

                                        {processing
                                            ? "Sending..."
                                            : `Send ${data.documents.length} File(s)`}

                                    </Button>

                                </form>

                            )}

                        </div>

                    </section>

                </div>

            </div>
        </PublicLayout>
    );
}