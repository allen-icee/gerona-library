import { useState, FormEventHandler, KeyboardEvent } from "react";
import { useForm, router } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import CustomSelect from "@/Components/CustomSelect";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/Components/ui/dialog";

export default function CopyActions({ copy }: { copy: any }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        accession_number: copy.accession_number || "",
        shelf_location: copy.shelf_location || "",
        status: copy.status || "Available",
        source: copy.source || "Purchased",
        donator_name: copy.donator_name || "",
        date_acquired: copy.date_acquired || new Date().toISOString().split("T")[0],
    });

    const handleText = (val: string, field: any) => { if (/^[^<>*!@#$%^&]*$/.test(val)) setData(field, val); };
    const handleName = (val: string, field: any) => { if (/^[a-zA-Z\s.,'-]*$/.test(val)) setData(field, val); };
    const handleBarcode = (val: string, field: any) => { if (/^[a-zA-Z0-9-]*$/.test(val)) setData(field, val); };

    const focusNext = (e: KeyboardEvent<HTMLInputElement>, nextId: string) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextId === "submit") submitEdit(e as any);
            else document.getElementById(`${nextId}_${copy.id}`)?.focus();
        }
    };

    const submitEdit: FormEventHandler = (e) => {
        e?.preventDefault();
        put(route("copies.update", copy.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditOpen(false);
                toast.success("Copy details updated!");
            },
            onError: () => toast.error("Failed to update copy."),
        });
    };

    const confirmDelete = () => {
        router.delete(route("copies.destroy", copy.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                toast.success("Physical copy permanently removed.");
            },
            onError: () => toast.error("Failed to delete copy."),
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-stone-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg">
                        <Icon icon="solar:menu-dots-bold" className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 bg-white z-50 rounded-xl border-pink-100 shadow-lg">
                    <DropdownMenuItem className="cursor-pointer font-medium hover:bg-stone-50 rounded-lg" onSelect={() => setIsEditOpen(true)}>
                        <Icon icon="solar:pen-bold-duotone" className="mr-2 h-4 w-4 text-stone-500" /> Edit Copy
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg" onSelect={() => setIsDeleteOpen(true)}>
                        <Icon icon="solar:trash-bin-trash-bold" className="mr-2 h-4 w-4" /> Delete Copy
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* EDIT MODAL REMAINS SIMILAR TO AddCopyModal BUT USING `put` and DYNAMIC IDs */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-pink-100 shadow-xl">
                    <DialogHeader><DialogTitle className="flex items-center gap-2"><Icon icon="solar:pen-bold-duotone" className="w-6 h-6 text-pink-500" /> Edit Copy</DialogTitle></DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase text-slate-600">Accession Number *</Label>
                            <Input id={`edit_acc_${copy.id}`} value={data.accession_number} onChange={(e) => handleBarcode(e.target.value, "accession_number")} onKeyDown={(e) => focusNext(e, `edit_shelf_${copy.id}`)} required className="h-10 rounded-xl font-mono" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-600">Shelf</Label>
                                <Input id={`edit_shelf_${copy.id}`} value={data.shelf_location} onChange={(e) => handleText(e.target.value, "shelf_location")} onKeyDown={(e) => focusNext(e, `edit_date_${copy.id}`)} className="h-10 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-600 z-40 relative">Status</Label>
                                <CustomSelect value={data.status} onChange={(val) => { setData("status", val); document.getElementById(`edit_date_${copy.id}`)?.focus(); }} options={["Available", "Maintenance"]} theme="pink" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-600 z-30 relative">Source</Label>
                                <CustomSelect value={data.source} onChange={(val) => setData("source", val)} options={["Purchased", "LGU Grant", "Donated"]} theme="pink" />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-xs font-bold uppercase text-slate-600">Date Acquired</Label>
                                <Input type="date" id={`edit_date_${copy.id}`} value={data.date_acquired} onChange={(e) => setData("date_acquired", e.target.value)} onKeyDown={(e) => focusNext(e, "submit")} className="h-10 rounded-xl" />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl">Update Copy</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* CUSTOM DELETE MODAL */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-sm bg-white rounded-2xl border-red-100 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2"><Icon icon="solar:danger-triangle-bold-duotone" className="w-6 h-6" /> Delete Copy</DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">Are you sure you want to permanently delete this physical copy?</DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <button type="button" onClick={() => setIsDeleteOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 border border-stone-200 hover:bg-slate-100 rounded-xl">Cancel</button>
                        <button type="button" onClick={confirmDelete} className="px-4 py-2 text-sm font-bold bg-red-500 text-white hover:bg-red-600 rounded-xl">Delete Copy</button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}