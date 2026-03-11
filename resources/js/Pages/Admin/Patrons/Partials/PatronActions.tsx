// resources/js/Pages/Admin/Patrons/Partials/PatronActions.tsx

import { useState, FormEventHandler } from "react";
import { useForm, router } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import CustomSelect from "@/Components/CustomSelect";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";

export default function PatronActions({ patron, onPrint }: { patron: any; onPrint: () => void }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        library_card_number: patron.library_card_number || "",
        first_name: patron.first_name || "",
        last_name: patron.last_name || "",
        type: patron.type || "Citizen",
        email: patron.email || "",
        gender: patron.gender || "Male",
        province: patron.province || "",
        municipality: patron.municipality || "",
        barangay: patron.barangay || "",
        street: patron.street || "",
        school: patron.school || "",
        contact_number: patron.contact_number || "",
        status: patron.status || "Active",
    });

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("patrons.update", patron.id), {
            preserveScroll: true,
            onSuccess: () => setIsEditOpen(false),
        });
    };

    const confirmDelete = () => {
        router.delete(route("patrons.destroy", patron.id), {
            preserveScroll: true,
            onSuccess: () => setIsDeleteOpen(false),
        });
    };

    const toggleStatus = () => {
        const newStatus = patron.status === "Active" ? "Suspended" : "Active";
        router.put(
            route("patrons.update", patron.id),
            { ...data, status: newStatus },
            { preserveScroll: true }
        );
    };

    return (
        <>
            {/* ACTION DROPDOWN */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-stone-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 focus:outline-none rounded-lg">
                        <Icon icon="solar:menu-dots-bold" className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white z-50 rounded-xl shadow-lg border-stone-100 p-1">
                    <DropdownMenuLabel className="text-xs text-stone-400 font-bold uppercase tracking-wider py-2">Actions</DropdownMenuLabel>

                    <DropdownMenuItem className="cursor-pointer font-bold text-amber-600 focus:text-amber-700 focus:bg-amber-50 rounded-lg py-2" onSelect={onPrint}>
                        <Icon icon="solar:printer-bold-duotone" className="mr-2 h-4 w-4" /> Print ID Card
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer font-bold text-stone-600 focus:bg-stone-50 rounded-lg py-2" onSelect={toggleStatus}>
                        {patron.status === "Active" ? (
                            <><Icon icon="solar:forbidden-circle-bold-duotone" className="mr-2 h-4 w-4 text-red-500" /> Suspend Patron</>
                        ) : (
                            <><Icon icon="solar:check-circle-bold-duotone" className="mr-2 h-4 w-4 text-emerald-500" /> Reactivate Patron</>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-stone-100" />

                    <DropdownMenuItem className="cursor-pointer font-bold text-stone-600 focus:bg-stone-50 rounded-lg py-2" onSelect={() => setIsEditOpen(true)}>
                        <Icon icon="solar:pen-bold-duotone" className="mr-2 h-4 w-4 text-fuchsia-500" /> Edit Details
                    </DropdownMenuItem>

                    <DropdownMenuItem className="cursor-pointer font-bold text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg py-2" onSelect={() => setIsDeleteOpen(true)}>
                        <Icon icon="solar:trash-bin-trash-bold-duotone" className="mr-2 h-4 w-4" /> Delete Patron
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* EDIT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border-fuchsia-100 shadow-xl shadow-stone-200/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Icon icon="solar:pen-bold-duotone" className="w-6 h-6 text-fuchsia-500" />
                            Edit Patron Details
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium">
                            Update {patron.first_name}'s registry information.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_lib_num_${patron.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Card Number *</Label>
                                <Input
                                    id={`edit_lib_num_${patron.id}`}
                                    value={data.library_card_number}
                                    onChange={(e) => setData("library_card_number", e.target.value)}
                                    required
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1.5 relative z-40">
                                <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">Type *</Label>
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
                                <Label htmlFor={`edit_school_${patron.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">School *</Label>
                                <Input
                                    id={`edit_school_${patron.id}`}
                                    value={data.school}
                                    onChange={(e) => setData("school", e.target.value)}
                                    required={data.type === "Student"}
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_fn_${patron.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">First Name *</Label>
                                <Input
                                    id={`edit_fn_${patron.id}`}
                                    value={data.first_name}
                                    onChange={(e) => setData("first_name", e.target.value)}
                                    required
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_ln_${patron.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Last Name *</Label>
                                <Input
                                    id={`edit_ln_${patron.id}`}
                                    value={data.last_name}
                                    onChange={(e) => setData("last_name", e.target.value)}
                                    required
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_email_${patron.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Email *</Label>
                                <Input
                                    id={`edit_email_${patron.id}`}
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1.5">
                                    <Label htmlFor={`edit_contact_${patron.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Contact #</Label>
                                    <Input
                                        id={`edit_contact_${patron.id}`}
                                        value={data.contact_number}
                                        onChange={(e) => setData("contact_number", e.target.value)}
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
                                <Label htmlFor={`edit_prov_${patron.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Province</Label>
                                <Input
                                    id={`edit_prov_${patron.id}`}
                                    value={data.province}
                                    onChange={(e) => setData("province", e.target.value)}
                                    required
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_mun_${patron.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Municipality</Label>
                                <Input
                                    id={`edit_mun_${patron.id}`}
                                    value={data.municipality}
                                    onChange={(e) => setData("municipality", e.target.value)}
                                    required
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_brgy_${patron.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Barangay</Label>
                                <Input
                                    id={`edit_brgy_${patron.id}`}
                                    value={data.barangay}
                                    onChange={(e) => setData("barangay", e.target.value)}
                                    required
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_street_${patron.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Street (Opt)</Label>
                                <Input
                                    id={`edit_street_${patron.id}`}
                                    value={data.street}
                                    onChange={(e) => setData("street", e.target.value)}
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                        </div>

                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 border-stone-200">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={processing} className="bg-gradient-to-r from-fuchsia-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-600 text-white shadow-md font-bold rounded-xl border-none">
                                {processing ? "Updating..." : "Update Patron"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* CUSTOM DELETE MODAL */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-sm bg-white rounded-2xl border-red-100 shadow-xl shadow-stone-200/50">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 font-black text-lg flex items-center gap-2">
                            <Icon icon="solar:danger-triangle-bold-duotone" className="w-6 h-6" /> Delete Patron
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium mt-2">
                            Are you sure you want to completely delete <strong className="text-red-500">{patron.first_name} {patron.last_name}</strong>? They will lose all borrowing history. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <button
                            type="button"
                            onClick={() => setIsDeleteOpen(false)}
                            className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-stone-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={confirmDelete}
                            className="px-4 py-2 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md shadow-red-200 transition-all border-none"
                        >
                            Delete Record
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}