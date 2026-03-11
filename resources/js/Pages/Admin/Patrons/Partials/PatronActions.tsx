// resources/js/Pages/Admin/Patrons/Partials/PatronActions.tsx

import { useState, useEffect, FormEventHandler } from "react";
import { useForm, router } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import CustomSelect from "@/Components/CustomSelect";
import SuffixSelect from "@/Components/SuffixSelect";
import SearchableSelect from "@/Components/SearchableSelect";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";

export default function PatronActions({ patron, onPrint }: { patron: any; onPrint: () => void }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        first_name: patron.first_name || "",
        middle_initial: patron.middle_initial || "",
        last_name: patron.last_name || "",
        suffix: patron.suffix || "",
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

    // --- JSON LOCATION STATE ---
    const [locationData, setLocationData] = useState<any>(null);
    const [provinces, setProvinces] = useState<string[]>([]);
    const [municipalities, setMunicipalities] = useState<string[]>([]);
    const [barangays, setBarangays] = useState<string[]>([]);

    useEffect(() => {
        if (isEditOpen && !locationData) {
            fetch("/data/locations.json")
                .then((res) => res.json())
                .then((json) => {
                    setLocationData(json);
                    const provList: string[] = [];
                    Object.keys(json).forEach((regionKey) => {
                        const provs = Object.keys(json[regionKey].province_list);
                        provList.push(...provs);
                    });
                    setProvinces(provList.sort());

                    // Populate existing locations if available
                    if (patron.province) {
                        for (const regionKey in json) {
                            const provs = json[regionKey].province_list;
                            if (provs[patron.province]) {
                                setMunicipalities(Object.keys(provs[patron.province].municipality_list).sort());
                                if (patron.municipality && provs[patron.province].municipality_list[patron.municipality]) {
                                    setBarangays(provs[patron.province].municipality_list[patron.municipality].barangay_list.sort());
                                }
                                break;
                            }
                        }
                    }
                });
        }
    }, [isEditOpen]);

    const handleProvinceChange = (prov: string) => {
        setData("province", prov);
        setData("municipality", "");
        setData("barangay", "");
        setBarangays([]);

        if (!prov || !locationData) {
            setMunicipalities([]);
            return;
        }
        for (const regionKey in locationData) {
            const provs = locationData[regionKey].province_list;
            if (provs[prov]) {
                setMunicipalities(Object.keys(provs[prov].municipality_list).sort());
                break;
            }
        }
    };

    const handleMunicipalityChange = (mun: string) => {
        setData("municipality", mun);
        setData("barangay", "");

        if (!mun || !locationData || !data.province) {
            setBarangays([]);
            return;
        }
        for (const regionKey in locationData) {
            const provs = locationData[regionKey].province_list;
            if (provs[data.province]) {
                const muns = provs[data.province].municipality_list;
                if (muns[mun]) {
                    setBarangays(muns[mun].barangay_list.sort());
                    break;
                }
            }
        }
    };

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("patrons.update", patron.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Patron details updated successfully.");
                setIsEditOpen(false);
            },
            onError: () => toast.error("Failed to update patron details."),
        });
    };

    const confirmDelete = () => {
        router.delete(route("patrons.destroy", patron.id), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Patron deleted entirely from the registry.");
                setIsDeleteOpen(false);
            },
            onError: () => toast.error("Failed to delete patron."),
        });
    };

    const toggleStatus = () => {
        const newStatus = patron.status === "Active" ? "Suspended" : "Active";
        router.put(
            route("patrons.update", patron.id),
            { ...data, status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => toast.success(`Patron status changed to ${newStatus}.`),
                onError: () => toast.error("Failed to toggle status.")
            }
        );
    };

    const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            const target = e.target as HTMLElement;
            if (target.tagName === "BUTTON") return;
            if (e.defaultPrevented) return;
            e.preventDefault();

            const form = e.currentTarget;
            const focusableElements = Array.from(
                form.querySelectorAll('input:not([disabled]), select:not([disabled]), button[type="submit"]')
            ) as HTMLElement[];

            const index = focusableElements.indexOf(target);
            if (index > -1 && index < focusableElements.length - 1) {
                focusableElements[index + 1].focus();
            }
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-stone-400 hover:text-fuchsia-600 hover:bg-fuchsia-50 focus:outline-none rounded-lg">
                        <Icon icon="solar:menu-dots-bold" className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white z-50 rounded-xl shadow-lg border-stone-100 p-1">
                    <DropdownMenuLabel className="text-xs text-stone-400 font-bold uppercase tracking-wider py-2">Actions</DropdownMenuLabel>

                    <DropdownMenuItem className="cursor-pointer font-bold text-amber-600 focus:text-amber-700 focus:bg-amber-50 rounded-lg py-2" onSelect={onPrint}>
                        <Icon icon="solar:gallery-download-bold-duotone" className="mr-2 h-4 w-4" /> Save ID Photo
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
            <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) reset();
            }}>
                <DialogContent className="sm:max-w-[700px] bg-white rounded-2xl border-fuchsia-100 shadow-xl shadow-stone-200/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Icon icon="solar:pen-bold-duotone" className="w-6 h-6 text-fuchsia-500" />
                            Edit Patron Details
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium">
                            Update {patron.first_name}'s registry information. ID Numbers are immutable.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} onKeyDown={handleFormKeyDown} className="space-y-5 py-2">

                        <div className="grid grid-cols-12 gap-4">
                            <div className="col-span-12 sm:col-span-4 space-y-1.5">
                                <Label htmlFor={`edit_fn_${patron.id}`} className="text-xs font-bold uppercase text-slate-600">First Name *</Label>
                                <Input
                                    id={`edit_fn_${patron.id}`}
                                    value={data.first_name}
                                    onChange={(e) => setData("first_name", e.target.value.replace(/[^a-zA-ZñÑ\s\-,]/g, ""))}
                                    required
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                                {errors.first_name && <p className="text-xs text-red-600">{errors.first_name}</p>}
                            </div>
                            <div className="col-span-6 sm:col-span-2 space-y-1.5">
                                <Label htmlFor={`edit_mi_${patron.id}`} className="text-xs font-bold uppercase text-slate-600 text-center block">M.I.</Label>
                                <Input
                                    id={`edit_mi_${patron.id}`}
                                    maxLength={2}
                                    value={data.middle_initial}
                                    onChange={(e) => setData("middle_initial", e.target.value.replace(/[^a-zA-ZñÑ]/g, "").toUpperCase())}
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg text-center"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-4 space-y-1.5">
                                <Label htmlFor={`edit_ln_${patron.id}`} className="text-xs font-bold uppercase text-slate-600">Last Name *</Label>
                                <Input
                                    id={`edit_ln_${patron.id}`}
                                    value={data.last_name}
                                    onChange={(e) => setData("last_name", e.target.value.replace(/[^a-zA-ZñÑ\s\-,]/g, ""))}
                                    required
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                                {errors.last_name && <p className="text-xs text-red-600">{errors.last_name}</p>}
                            </div>
                            <div className="col-span-6 sm:col-span-2 space-y-1.5 pt-1">
                                <Label className="text-xs font-bold uppercase text-slate-600">Suffix</Label>
                                <SuffixSelect value={data.suffix} onChange={(val) => setData("suffix", val)} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 relative z-40">
                                <Label className="text-xs font-bold uppercase text-slate-600">Type *</Label>
                                <CustomSelect
                                    id={`edit_type_${patron.id}`}
                                    value={data.type}
                                    onChange={(val) => setData("type", val)}
                                    options={["Citizen", "Student", "Teacher/LGU Staff"]}
                                    theme="fuchsia"
                                />
                            </div>
                            <div className="space-y-1.5 relative z-30">
                                <Label className="text-xs font-bold uppercase text-slate-600">Gender</Label>
                                <CustomSelect
                                    id={`edit_gender_${patron.id}`}
                                    value={data.gender}
                                    onChange={(val) => setData("gender", val)}
                                    options={["Male", "Female", "Other"]}
                                    theme="fuchsia"
                                />
                            </div>
                        </div>

                        {data.type === "Student" && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                <Label htmlFor={`edit_school_${patron.id}`} className="text-xs font-bold uppercase text-slate-600">School *</Label>
                                <Input
                                    id={`edit_school_${patron.id}`}
                                    value={data.school}
                                    onChange={(e) => setData("school", e.target.value.replace(/[^a-zA-Z0-9\s\-\.,#]/g, ""))}
                                    required={data.type === "Student"}
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_email_${patron.id}`} className="text-xs font-bold uppercase text-slate-600">Email *</Label>
                                <Input
                                    id={`edit_email_${patron.id}`}
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    required
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_contact_${patron.id}`} className="text-xs font-bold uppercase text-slate-600">Contact #</Label>
                                <Input
                                    id={`edit_contact_${patron.id}`}
                                    maxLength={11}
                                    value={data.contact_number}
                                    onChange={(e) => setData("contact_number", e.target.value.replace(/\D/g, ""))}
                                    className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-20">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-600">Province *</Label>
                                <SearchableSelect
                                    id={`edit_prov_${patron.id}`}
                                    value={data.province}
                                    onChange={(val) => handleProvinceChange(val)}
                                    options={provinces}
                                    placeholder="Select Province"
                                    error={errors.province}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-600">Municipality *</Label>
                                <SearchableSelect
                                    id={`edit_mun_${patron.id}`}
                                    value={data.municipality}
                                    onChange={(val) => handleMunicipalityChange(val)}
                                    options={municipalities}
                                    disabled={!data.province}
                                    placeholder="Select Municipality"
                                    error={errors.municipality}
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-600">Barangay *</Label>
                                <SearchableSelect
                                    id={`edit_brgy_${patron.id}`}
                                    value={data.barangay}
                                    onChange={(val) => setData("barangay", val)}
                                    options={barangays}
                                    disabled={!data.municipality}
                                    placeholder="Select Barangay"
                                    error={errors.barangay}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor={`edit_street_${patron.id}`} className="text-xs font-bold uppercase text-slate-600">Street (Opt)</Label>
                            <Input
                                id={`edit_street_${patron.id}`}
                                value={data.street}
                                onChange={(e) => setData("street", e.target.value.replace(/[^a-zA-Z0-9\s\-\.,#]/g, ""))}
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
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

            {/* DELETE MODAL (Unchanged but using Toast inside action block above) */}
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
                        <button type="button" onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors border border-stone-200">
                            Cancel
                        </button>
                        <button type="button" onClick={confirmDelete} className="px-4 py-2 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md shadow-red-200 transition-all border-none">
                            Delete Record
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}