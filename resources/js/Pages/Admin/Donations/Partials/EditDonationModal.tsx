// resources/js/Pages/Admin/Donations/Partials/EditDonationModal.tsx

import { FormEventHandler, KeyboardEvent, useEffect } from "react";
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
    DialogFooter,
} from "@/Components/ui/dialog";

export default function EditDonationModal({ donation, isOpen, onClose }: { donation: any, isOpen: boolean, onClose: () => void }) {
    const { data, setData, put, processing, errors, reset, clearErrors } =
        useForm({
            donator_name: "",
            donator_type: "Individual",
            donation_category: "Books",
            description: "",
            estimated_value: "",
            date_received: "",
        });

    // Populate data when a record is passed to the modal
    useEffect(() => {
        if (donation && isOpen) {
            setData({
                donator_name: donation.donator_name || "",
                donator_type: donation.donator_type || "Individual",
                donation_category: donation.donation_category || "Books",
                description: donation.description || "",
                estimated_value: donation.estimated_value || "",
                date_received: donation.date_received ? donation.date_received.split("T")[0] : "",
            });
        }
    }, [donation, isOpen]);

    const submitUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("donations.update", donation.id), {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
                toast.success("Donation updated successfully!");
            },
            onError: () => {
                toast.error("Failed to update donation. Please check the form.");
            }
        });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, nextElementId: string) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const nextEl = document.getElementById(nextElementId);
            if (nextEl) nextEl.focus();
        }
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) {
                    onClose();
                    clearErrors();
                }
            }}
        >
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-fuchsia-100 shadow-xl shadow-stone-200/50">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Icon icon="solar:pen-bold-duotone" className="w-6 h-6 text-fuchsia-500" />
                        Edit Donation Record
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Modify the details for this donation record.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitUpdate} className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="edit_donator_name" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Donator Name / Organization *
                        </Label>
                        <Input
                            id="edit_donator_name"
                            value={data.donator_name}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^a-zA-Z0-9\s\-.,&']/g, "");
                                setData("donator_name", val);
                            }}
                            onKeyDown={(e) => handleKeyDown(e, "edit_donator_type")}
                            required
                            autoFocus
                            className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                        />
                        {errors.donator_name && <p className="text-xs text-red-600 font-medium">{errors.donator_name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit_donator_type" className="text-xs font-bold uppercase tracking-wider text-slate-600 z-30 relative">
                                Donator Type
                            </Label>
                            <CustomSelect
                                id="edit_donator_type"
                                nextElementId="edit_donation_category"
                                value={data.donator_type}
                                onChange={(val) => setData("donator_type", val)}
                                options={["Individual", "LGU Official", "NGO / Foundation", "Private Company"]}
                                theme="fuchsia"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit_donation_category" className="text-xs font-bold uppercase tracking-wider text-slate-600 z-30 relative">
                                Category
                            </Label>
                            <CustomSelect
                                id="edit_donation_category"
                                nextElementId="edit_description"
                                value={data.donation_category}
                                onChange={(val) => setData("donation_category", val)}
                                options={["Books", "Equipment", "Furniture", "Cash Grant", "Other"]}
                                theme="fuchsia"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="edit_description" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Item Description *
                        </Label>
                        <Input
                            id="edit_description"
                            value={data.description}
                            onChange={(e) => {
                                const val = e.target.value.replace(/[^a-zA-Z0-9\s\-.,&'()]/g, "");
                                setData("description", val);
                            }}
                            onKeyDown={(e) => handleKeyDown(e, "edit_estimated_value")}
                            required
                            className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                        />
                        {errors.description && <p className="text-xs text-red-600 font-medium">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit_estimated_value" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Est. Value (₱) <span className="text-stone-400 normal-case tracking-normal">(Optional)</span>
                            </Label>
                            <Input
                                id="edit_estimated_value"
                                type="text"
                                value={data.estimated_value}
                                onChange={(e) => {
                                    let val = e.target.value.replace(/[^0-9.]/g, "");
                                    val = val.replace(/(\..*?)\..*/g, '$1');
                                    setData("estimated_value", val);
                                }}
                                onKeyDown={(e) => handleKeyDown(e, "edit_date_received")}
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500"
                            />
                            {errors.estimated_value && <p className="text-xs text-red-600 font-medium">{errors.estimated_value}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="edit_date_received" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Date Received *
                            </Label>
                            <Input
                                id="edit_date_received"
                                type="date"
                                value={data.date_received}
                                onChange={(e) => setData("date_received", e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        submitUpdate(e);
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
                            onClick={onClose}
                            className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 border-stone-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-600 text-white shadow-md font-bold rounded-xl border-none"
                        >
                            {processing ? "Updating..." : "Update Record"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}