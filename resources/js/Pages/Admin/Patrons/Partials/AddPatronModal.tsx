// resources/js/Pages/Admin/Patrons/Partials/AddPatronModal.tsx

import { useState, FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import CustomSelect from "@/Components/CustomSelect";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/Components/ui/dialog";

export default function AddPatronModal() {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        library_card_number: "",
        first_name: "",
        last_name: "",
        type: "Citizen",
        email: "",
        gender: "Male",
        province: "Tarlac",
        municipality: "Gerona",
        barangay: "",
        street: "",
        school: "",
        contact_number: "",
        status: "Active",
    });

    const submitNewPatron: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("patrons.store"), {
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
                <Button className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-600 hover:from-fuchsia-500 hover:to-fuchsia-700 text-white shadow-md shadow-fuchsia-200 border-none font-bold text-xs h-10 rounded-xl w-full sm:w-auto">
                    <Icon icon="solar:user-plus-bold-duotone" className="w-4 h-4 mr-2" />
                    Register Patron
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border-fuchsia-100 shadow-xl shadow-stone-200/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Icon icon="solar:user-id-bold-duotone" className="w-6 h-6 text-fuchsia-500" />
                        Register New Patron
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Add a new borrower. A QR code will be sent to their email automatically.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitNewPatron} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="library_card_number" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Card Number *
                            </Label>
                            <Input
                                id="library_card_number"
                                value={data.library_card_number}
                                onChange={(e) => setData("library_card_number", e.target.value)}
                                required
                                placeholder="e.g. PAT-2026-001"
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                            {errors.library_card_number && <p className="text-xs text-red-600 font-medium">{errors.library_card_number}</p>}
                        </div>
                        <div className="space-y-1.5 relative z-40">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">Patron Type *</Label>
                            <CustomSelect
                                value={data.type}
                                onChange={(val) => setData("type", val)}
                                options={["Citizen", "Student", "Teacher/LGU Staff"]}
                                theme="fuchsia"
                            />
                        </div>
                    </div>

                    {data.type === "Student" && (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label htmlFor="school" className="text-xs font-bold uppercase tracking-wider text-slate-600">School *</Label>
                            <Input
                                id="school"
                                value={data.school}
                                onChange={(e) => setData("school", e.target.value)}
                                placeholder="e.g. Gerona National High School"
                                required={data.type === "Student"}
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="first_name" className="text-xs font-bold uppercase tracking-wider text-slate-600">First Name *</Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) => setData("first_name", e.target.value)}
                                required
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="last_name" className="text-xs font-bold uppercase tracking-wider text-slate-600">Last Name *</Label>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) => setData("last_name", e.target.value)}
                                required
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-600">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData("email", e.target.value)}
                                required
                                placeholder="user@example.com"
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1.5">
                                <Label htmlFor="contact_number" className="text-xs font-bold uppercase tracking-wider text-slate-600">Contact #</Label>
                                <Input
                                    id="contact_number"
                                    value={data.contact_number}
                                    onChange={(e) => setData("contact_number", e.target.value)}
                                    placeholder="09..."
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1.5 relative z-30">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">Gender</Label>
                                <CustomSelect
                                    value={data.gender}
                                    onChange={(val) => setData("gender", val)}
                                    options={["Male", "Female", "Other"]}
                                    theme="fuchsia"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="province" className="text-xs font-bold uppercase tracking-wider text-slate-600">Province *</Label>
                            <Input
                                id="province"
                                value={data.province}
                                onChange={(e) => setData("province", e.target.value)}
                                required
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="municipality" className="text-xs font-bold uppercase tracking-wider text-slate-600">Municipality *</Label>
                            <Input
                                id="municipality"
                                value={data.municipality}
                                onChange={(e) => setData("municipality", e.target.value)}
                                required
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="barangay" className="text-xs font-bold uppercase tracking-wider text-slate-600">Barangay *</Label>
                            <Input
                                id="barangay"
                                value={data.barangay}
                                onChange={(e) => setData("barangay", e.target.value)}
                                required
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="street" className="text-xs font-bold uppercase tracking-wider text-slate-600">Street <span className="normal-case text-stone-400 font-medium">(Opt)</span></Label>
                            <Input
                                id="street"
                                value={data.street}
                                onChange={(e) => setData("street", e.target.value)}
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 border-stone-200">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-600 text-white shadow-md font-bold rounded-xl border-none">
                            {processing ? "Saving..." : "Register Patron"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}