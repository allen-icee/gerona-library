// resources/js/Pages/Admin/Donations/Partials/AddDonationModal.tsx

import { useState, FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import CustomSelect from "@/Components/CustomSelect";
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
            },
        });
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

            {/* Reduced the shadow/glow on the modal */}
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
                            onChange={(e) => setData("donator_name", e.target.value)}
                            required
                            placeholder="e.g., Mayor Dela Cruz or Rotary Club"
                            autoFocus
                            className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                        />
                        {errors.donator_name && <p className="text-xs text-red-600 font-medium">{errors.donator_name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 z-30 relative">
                                Donator Type
                            </Label>
                            <CustomSelect
                                value={data.donator_type}
                                onChange={(val) => setData("donator_type", val)}
                                options={["Individual", "LGU Official", "NGO / Foundation", "Private Company"]}
                                theme="fuchsia"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 z-30 relative">
                                Category
                            </Label>
                            <CustomSelect
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
                            required
                            placeholder="e.g., 50 Assorted Filipiniana Books"
                            className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="estimated_value" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Est. Value (₱) <span className="text-stone-400 normal-case tracking-normal">(Optional)</span>
                            </Label>
                            <Input
                                id="estimated_value"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.estimated_value}
                                onChange={(e) => setData("estimated_value", e.target.value)}
                                placeholder="0.00"
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                            />
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
                                required
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                            />
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