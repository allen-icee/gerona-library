import { FormEventHandler, useRef, useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import {
    Printer,
    UploadCloud,
    File as FileIcon,
    CheckCircle2,
    Files,
    UserCircle,
    Users,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function PrintStation() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isGuest, setIsGuest] = useState(false); // Toggle between Registered and Guest

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
        patron_id: "",
        visitor_name: "",
        school_or_barangay: "",
        paper_size: "Short (8.5 x 11)",
        copies: 1,
        documents: [] as File[],
    });

    const submitPrintJob: FormEventHandler = (e) => {
        e.preventDefault();

        // Clear irrelevant data based on the selected mode
        if (isGuest) {
            setData("patron_id", "");
        } else {
            setData("visitor_name", "");
            setData("school_or_barangay", "");
        }

        post(route("print-station.upload"), {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                reset();
                if (fileInputRef.current) fileInputRef.current.value = "";
            },
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setData("documents", Array.from(e.target.files));
        }
    };

    // Toggle handler that clears errors when switching modes
    const handleToggle = (guestMode: boolean) => {
        setIsGuest(guestMode);
        clearErrors();
    };

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 py-10">
            <Head title="Public Print Station" />

            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
                <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 to-transparent"></div>
                    <Printer className="w-12 h-12 text-amber-500 mx-auto mb-4 relative z-10" />
                    <h1 className="text-3xl font-serif font-bold text-white relative z-10">
                        Print Station
                    </h1>
                    <p className="text-stone-300 mt-2 relative z-10">
                        Send your documents directly to the librarian.
                    </p>
                </div>

                <div className="p-8">
                    {recentlySuccessful ? (
                        <div className="text-center py-8 space-y-4 animate-in fade-in zoom-in duration-500">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                            <h2 className="text-2xl font-bold text-stone-800">
                                Files Sent Successfully!
                            </h2>
                            <p className="text-stone-600">
                                Please approach the librarian's desk to collect
                                and pay for your printouts.
                            </p>
                            <Button
                                className="mt-4 bg-slate-900"
                                onClick={() => window.location.reload()}
                            >
                                Send Another File
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={submitPrintJob} className="space-y-6">
                            {/* Mode Toggle Switch */}
                            <div className="flex p-1 bg-stone-100 rounded-lg border border-stone-200">
                                <button
                                    type="button"
                                    onClick={() => handleToggle(false)}
                                    className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-md transition-all ${!isGuest ? "bg-white text-amber-600 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                                >
                                    <UserCircle className="w-4 h-4 mr-2" />{" "}
                                    Registered Patron
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleToggle(true)}
                                    className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-md transition-all ${isGuest ? "bg-white text-slate-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
                                >
                                    <Users className="w-4 h-4 mr-2" /> Walk-in
                                    Guest
                                </button>
                            </div>

                            {/* Conditional Inputs based on toggle */}
                            <div className="min-h-[80px]">
                                {!isGuest ? (
                                    <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                        <Label
                                            htmlFor="patron_id"
                                            className="text-stone-700 font-bold"
                                        >
                                            Library Card Number *
                                        </Label>
                                        <Input
                                            id="patron_id"
                                            value={data.patron_id}
                                            onChange={(e) =>
                                                setData(
                                                    "patron_id",
                                                    e.target.value,
                                                )
                                            }
                                            required={!isGuest}
                                            placeholder="e.g., PAT-00001"
                                            className="uppercase h-12 text-lg text-center tracking-widest font-mono font-bold"
                                        />
                                        {errors.patron_id && (
                                            <p className="text-sm text-red-600 text-center font-medium mt-2">
                                                {errors.patron_id}
                                            </p>
                                        )}
                                        <p className="text-xs text-stone-500 text-center mt-2">
                                            Don't have a card?{" "}
                                            <Link
                                                href={route(
                                                    "register-patron.create",
                                                )}
                                                className="text-amber-600 font-bold hover:underline"
                                            >
                                                Register here
                                            </Link>
                                            .
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="visitor_name"
                                                className="text-stone-700"
                                            >
                                                Full Name *
                                            </Label>
                                            <Input
                                                id="visitor_name"
                                                value={data.visitor_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "visitor_name",
                                                        e.target.value,
                                                    )
                                                }
                                                required={isGuest}
                                                placeholder="e.g., Juan Dela Cruz"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="school_or_barangay"
                                                className="text-stone-700"
                                            >
                                                School / Barangay *
                                            </Label>
                                            <Input
                                                id="school_or_barangay"
                                                value={data.school_or_barangay}
                                                onChange={(e) =>
                                                    setData(
                                                        "school_or_barangay",
                                                        e.target.value,
                                                    )
                                                }
                                                required={isGuest}
                                                placeholder="e.g., Gerona NHS"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Print Settings & File Upload (Shared) */}
                            <div className="grid grid-cols-2 gap-4 bg-stone-50 p-4 rounded-lg border border-stone-200">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="paper_size"
                                        className="text-stone-700 font-semibold"
                                    >
                                        Paper Size *
                                    </Label>
                                    <select
                                        id="paper_size"
                                        value={data.paper_size}
                                        onChange={(e) =>
                                            setData(
                                                "paper_size",
                                                e.target.value,
                                            )
                                        }
                                        className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="Short (8.5 x 11)">
                                            Short (8.5" x 11")
                                        </option>
                                        <option value="A4">A4</option>
                                        <option value="Long (8.5 x 13)">
                                            Long (8.5" x 13")
                                        </option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="copies"
                                        className="text-stone-700 font-semibold"
                                    >
                                        Copies per file *
                                    </Label>
                                    <Input
                                        id="copies"
                                        type="number"
                                        min="1"
                                        value={data.copies}
                                        onChange={(e) =>
                                            setData(
                                                "copies",
                                                parseInt(e.target.value),
                                            )
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="documents"
                                    className="text-stone-700 font-semibold"
                                >
                                    Attach Documents (Select multiple) *
                                </Label>
                                <div className="border-2 border-dashed border-amber-300 bg-amber-50/30 rounded-lg p-6 text-center hover:bg-amber-50 transition-colors">
                                    <input
                                        type="file"
                                        id="documents"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        required
                                        multiple
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.png"
                                    />
                                    <Label
                                        htmlFor="documents"
                                        className="cursor-pointer flex flex-col items-center justify-center space-y-3"
                                    >
                                        {data.documents.length > 0 ? (
                                            <>
                                                <Files className="w-10 h-10 text-amber-500" />
                                                <span className="text-sm font-medium text-amber-700">
                                                    {data.documents.length}{" "}
                                                    file(s) selected
                                                </span>
                                                <ul className="text-xs text-stone-500 text-left list-disc pl-5 max-h-24 overflow-y-auto w-full">
                                                    {data.documents.map(
                                                        (file, i) => (
                                                            <li
                                                                key={i}
                                                                className="truncate"
                                                            >
                                                                {file.name}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </>
                                        ) : (
                                            <>
                                                <UploadCloud className="w-10 h-10 text-stone-400" />
                                                <span className="text-sm font-medium text-stone-600">
                                                    Click to browse your
                                                    computer
                                                </span>
                                                <span className="text-xs text-stone-400">
                                                    Up to 200MB per file
                                                </span>
                                            </>
                                        )}
                                    </Label>
                                </div>
                                {errors.documents && (
                                    <p className="text-sm text-red-600">
                                        {errors.documents}
                                    </p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-500 text-white shadow-md"
                            >
                                {processing
                                    ? "Uploading Files..."
                                    : "Send to Librarian"}
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
