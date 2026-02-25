import { FormEventHandler, useRef, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
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
    const [isGuest, setIsGuest] = useState(false);

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

        // Clear irrelevant data
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

    const handleToggle = (guestMode: boolean) => {
        setIsGuest(guestMode);
        clearErrors();
    };

    // Reset when modal closes
    useEffect(() => {
        if (!isOpen) clearErrors();
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white border-4 border-pink-200 rounded-[2rem] shadow-2xl sm:max-w-[500px] overflow-hidden">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-2xl font-serif font-black text-slate-800 flex items-center gap-2">
                        <Icon
                            icon="solar:printer-minimalistic-bold-duotone"
                            className="w-8 h-8 text-rose-500"
                        />
                        Print Station
                    </DialogTitle>
                    <DialogDescription className="text-stone-500 font-medium">
                        Send documents directly to the front desk printer! 🖨️
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
                        {/* Interactive Toggle Switch */}
                        <div className="flex p-1 bg-pink-100/50 rounded-2xl border-2 border-pink-100">
                            <button
                                type="button"
                                onClick={() => handleToggle(false)}
                                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all ${!isGuest ? "bg-white text-rose-500 shadow-sm" : "text-pink-400 hover:text-rose-500"}`}
                            >
                                <Icon
                                    icon="solar:user-circle-bold-duotone"
                                    className="w-5 h-5 mr-2"
                                />
                                Library Card
                            </button>
                            <button
                                type="button"
                                onClick={() => handleToggle(true)}
                                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all ${isGuest ? "bg-white text-slate-700 shadow-sm" : "text-pink-400 hover:text-slate-600"}`}
                            >
                                <Icon
                                    icon="solar:users-group-two-rounded-bold-duotone"
                                    className="w-5 h-5 mr-2"
                                />
                                Guest
                            </button>
                        </div>

                        {/* Conditional Inputs */}
                        <div className="min-h-[80px]">
                            {!isGuest ? (
                                <div className="space-y-1.5 animate-in fade-in duration-300">
                                    <Label
                                        htmlFor="patron_id"
                                        className="text-stone-700 font-bold text-sm"
                                    >
                                        Library Card Number ✨
                                    </Label>
                                    <Input
                                        id="patron_id"
                                        value={data.patron_id}
                                        onChange={(e) =>
                                            setData("patron_id", e.target.value)
                                        }
                                        required={!isGuest}
                                        placeholder="PAT-XXXXX"
                                        className="uppercase h-12 text-center tracking-widest font-mono font-black rounded-2xl bg-pink-50/50 border-pink-200 focus-visible:ring-pink-400 text-rose-600 text-lg"
                                    />
                                    {errors.patron_id && (
                                        <p className="text-xs text-rose-500 text-center mt-1">
                                            {errors.patron_id}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 animate-in fade-in duration-300">
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="visitor_name"
                                            className="text-stone-700 font-bold text-sm"
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
                                            placeholder="Juan Dela Cruz"
                                            className="h-12 rounded-2xl bg-pink-50/50 border-pink-200 focus-visible:ring-pink-400"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label
                                            htmlFor="school_or_barangay"
                                            className="text-stone-700 font-bold text-sm"
                                        >
                                            School / Brgy *
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
                                            placeholder="Gerona NHS"
                                            className="h-12 rounded-2xl bg-pink-50/50 border-pink-200 focus-visible:ring-pink-400"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Print Settings */}
                        <div className="grid grid-cols-2 gap-4 bg-pink-50 p-4 rounded-2xl border-2 border-pink-100">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="paper_size"
                                    className="text-stone-700 font-bold text-sm"
                                >
                                    Paper Size *
                                </Label>
                                <select
                                    id="paper_size"
                                    value={data.paper_size}
                                    onChange={(e) =>
                                        setData("paper_size", e.target.value)
                                    }
                                    className="flex h-10 w-full rounded-xl border border-pink-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
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
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="copies"
                                    className="text-stone-700 font-bold text-sm"
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
                                    className="h-10 rounded-xl border-pink-200 focus-visible:ring-rose-400"
                                />
                            </div>
                        </div>

                        {/* File Upload Area */}
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="documents"
                                className="text-stone-700 font-bold text-sm"
                            >
                                Attach Documents (Select multiple) 📎
                            </Label>
                            <div className="border-4 border-dashed border-pink-200 bg-pink-50/30 rounded-2xl p-6 text-center hover:bg-pink-100 transition-colors group">
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
                                    className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                                >
                                    {data.documents.length > 0 ? (
                                        <>
                                            <Icon
                                                icon="fluent-emoji:file-folder"
                                                className="w-12 h-12 mb-2"
                                            />
                                            <span className="text-sm font-black text-rose-600">
                                                {data.documents.length} file(s)
                                                selected
                                            </span>
                                            <ul className="text-xs text-stone-500 list-disc text-left pl-5 max-h-20 overflow-y-auto w-full font-medium">
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
                                            <Icon
                                                icon="solar:upload-square-bold-duotone"
                                                className="w-10 h-10 text-pink-300 group-hover:text-rose-400 transition-colors"
                                            />
                                            <span className="text-sm font-bold text-stone-600">
                                                Click to browse files
                                            </span>
                                            <span className="text-[10px] text-pink-400 font-black uppercase tracking-widest">
                                                Up to 200MB per file
                                            </span>
                                        </>
                                    )}
                                </Label>
                            </div>
                            {errors.documents && (
                                <p className="text-xs text-rose-500 font-bold">
                                    {errors.documents}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-14 text-lg bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-black shadow-lg shadow-pink-200"
                        >
                            {processing
                                ? "Sending to Printer..."
                                : "Send to Librarian"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
