// resources/js/Pages/Admin/Donations/Partials/AddDonationModal.tsx

import { useState, FormEventHandler, KeyboardEvent } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import CustomSelect from "@/Components/CustomSelect";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/Components/ui/dialog";

export default function AddDonationModal() {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            donator_name: "",
            donator_type: "Individual",
            donation_category: "Books",
            description: "",
            estimated_value: "",
            date_received: new Date().toISOString().split("T")[0],
        });

    const submitDonation: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("donations.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                reset();
                toast.success("Donation logged successfully!");
            },
            onError: () => {
                toast.error("Failed to log donation. Please check the form.");
            }
        });
    };

    // Handler to move focus to the next field on Enter key press
    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, nextElementId: string) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent accidental form submission
            const nextEl = document.getElementById(nextElementId);
            if (nextEl) nextEl.focus();
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) {
                    reset();
                    clearErrors();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-600 text-white shadow-md border-none font-bold text-xs h-[38px] rounded-lg w-full sm:w-auto">
                    <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2" />
                    Log Donation
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-fuchsia-100 shadow-xl shadow-stone-200/50">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Icon icon="solar:gift-bold-duotone" className="w-6 h-6 text-fuchsia-500" />
                        Log New Donation
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Record a new asset or grant given to the municipal library.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitDonation} className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="donator_name" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Donator Name / Organization *
                        </Label>
                        <Input
                            id="donator_name"
                            value={data.donator_name}
                            onChange={(e) => {
                                // Restriction: Allow letters, numbers, spaces, and basic punctuation
                                const val = e.target.value.replace(/[^a-zA-Z0-9\s\-\.,&']/g, "");
                                setData("donator_name", val);
                            }}
                            onKeyDown={(e) => handleKeyDown(e, "donator_type")}
                            required
                            placeholder="e.g., Mayor Dela Cruz or Rotary Club"
                            autoFocus
                            className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                        />
                        {errors.donator_name && <p className="text-xs text-red-600 font-medium">{errors.donator_name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="donator_type" className="text-xs font-bold uppercase tracking-wider text-slate-600 z-30 relative">
                                Donator Type
                            </Label>
                            <CustomSelect
                                id="donator_type"
                                value={data.donator_type}
                                onChange={(val) => {
                                    setData("donator_type", val);
                                    document.getElementById("donation_category")?.focus();
                                }}
                                options={["Individual", "LGU Official", "NGO / Foundation", "Private Company"]}
                                theme="fuchsia"
                            />
                            {/* Donator Type Field */}
                            <CustomSelect
                                id="donator_type"
                                nextElementId="donation_category" // <-- Tells it where to jump next!
                                value={data.donator_type}
                                onChange={(val) => setData("donator_type", val)}
                                options={["Individual", "LGU Official", "NGO / Foundation", "Private Company"]}
                                theme="fuchsia"
                            />

                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="donation_category" className="text-xs font-bold uppercase tracking-wider text-slate-600 z-30 relative">
                                Category
                            </Label>

                            {/* Category Field */}
                            <CustomSelect
                                id="donation_category"
                                nextElementId="description" // <-- Tells it where to jump next!
                                value={data.donation_category}
                                onChange={(val) => setData("donation_category", val)}
                                options={["Books", "Equipment", "Furniture", "Cash Grant", "Other"]}
                                theme="fuchsia"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Item Description *
                        </Label>
                        <Input
                            id="description"
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, "estimated_value")}
                            required
                            placeholder="e.g., 50 Assorted Filipiniana Books"
                            className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                        />
                        {errors.description && <p className="text-xs text-red-600 font-medium">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="estimated_value" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Est. Value (₱) <span className="text-stone-400 normal-case tracking-normal">(Optional)</span>
                            </Label>
                            <Input
                                id="estimated_value"
                                type="text"
                                value={data.estimated_value}
                                onChange={(e) => {
                                    // Restriction: Allow only numbers and one decimal point
                                    let val = e.target.value.replace(/[^0-9.]/g, "");
                                    if (val.split('.').length > 2) {
                                        val = val.replace(/\.+$/, "");
                                    }
                                    setData("estimated_value", val);
                                }}
                                onKeyDown={(e) => handleKeyDown(e, "date_received")}
                                placeholder="0.00"
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                            />
                            {errors.estimated_value && <p className="text-xs text-red-600 font-medium">{errors.estimated_value}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="date_received" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Date Received *
                            </Label>
                            <Input
                                id="date_received"
                                type="date"
                                value={data.date_received}
                                onChange={(e) => setData("date_received", e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        submitDonation(e);
                                    }
                                }}
                                required
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                            />
                            {errors.date_received && <p className="text-xs text-red-600 font-medium">{errors.date_received}</p>}
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 border-stone-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-600 text-white shadow-md font-bold rounded-xl border-none"
                        >
                            {processing ? "Saving..." : "Save Record"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}