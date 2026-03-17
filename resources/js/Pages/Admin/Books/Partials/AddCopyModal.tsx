//resources\js\Pages\Admin\Books\Partials\AddCopyModal.tsx
import { useState, FormEventHandler, KeyboardEvent } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import CustomSelect from "@/Components/CustomSelect";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/Components/ui/dialog";

export default function AddCopyModal({ bookId }: { bookId: number }) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        accession_number: "", shelf_location: "", status: "Available", source: "Purchased", donator_name: "", date_acquired: new Date().toISOString().split("T")[0],
    });

    const handleText = (val: string, field: any) => { if (/^[^<>*!@#$%^&]*$/.test(val)) setData(field, val); };
    const handleName = (val: string, field: any) => { if (/^[a-zA-Z\s.,'-]*$/.test(val)) setData(field, val); };
    const handleBarcode = (val: string, field: any) => { if (/^[a-zA-Z0-9-]*$/.test(val)) setData(field, val); };

    const focusNext = (e: KeyboardEvent<HTMLInputElement>, nextId: string) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextId === "submit") submitNewCopy(e as any);
            else document.getElementById(nextId)?.focus();
        }
    };

    const submitNewCopy: FormEventHandler = (e) => {
        e?.preventDefault();
        post(route("books.copies.store", bookId), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                reset();
                toast.success("Physical copy added to inventory!");
            },
            onError: () => toast.error("Failed to add physical copy."),
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) { reset(); clearErrors(); } }}>
            <DialogTrigger asChild>
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-stone-300 font-bold text-xs h-10 rounded-xl w-full sm:w-auto">
                    <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2 text-pink-400" /> Add Physical Copy
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 bg-white rounded-2xl border-pink-100 shadow-xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black flex items-center gap-2"><Icon icon="solar:qr-code-bold-duotone" className="w-6 h-6 text-pink-500" /> Add Copy</DialogTitle>
                </DialogHeader>

                <form onSubmit={submitNewCopy} className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="accession_number" className="text-xs font-bold uppercase text-slate-600">Accession Number *</Label>
                        <Input id="accession_number" value={data.accession_number} onChange={(e) => handleBarcode(e.target.value, "accession_number")} onKeyDown={(e) => focusNext(e, "shelf_location")} required autoFocus className="h-10 rounded-xl font-mono" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="shelf_location" className="text-xs font-bold uppercase text-slate-600">Shelf</Label>
                            <Input id="shelf_location" value={data.shelf_location} onChange={(e) => handleText(e.target.value, "shelf_location")} onKeyDown={(e) => focusNext(e, "date_acquired")} className="h-10 rounded-xl" />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase text-slate-600 z-40 relative">Status</Label>

                            <CustomSelect value={data.status} onChange={(val) => { setData("status", val); document.getElementById('date_acquired')?.focus(); }} options={["Available", "Maintenance"]} theme="pink" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase text-slate-600 z-30 relative">Source</Label>

                            <CustomSelect value={data.source} onChange={(val) => { setData("source", val); document.getElementById(val === 'Donated' ? 'donator_name' : 'submit_copy_btn')?.focus(); }} options={["Purchased", "LGU Grant", "Donated"]} theme="pink" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="date_acquired" className="text-xs font-bold uppercase text-slate-600">Date Acquired</Label>
                            <Input id="date_acquired" type="date" value={data.date_acquired} onChange={(e) => setData("date_acquired", e.target.value)} onKeyDown={(e) => focusNext(e, data.source === 'Donated' ? 'donator_name' : 'submit')} className="h-10 rounded-xl" />
                        </div>
                    </div>

                    {data.source === "Donated" && (
                        <div className="space-y-1.5">
                            <Label htmlFor="donator_name" className="text-xs font-bold uppercase text-pink-600">Donator Name</Label>
                            <Input id="donator_name" value={data.donator_name} onChange={(e) => handleName(e.target.value, "donator_name")} onKeyDown={(e) => focusNext(e, "submit")} className="h-10 rounded-xl bg-pink-50/50" />
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button id="submit_copy_btn" type="submit" disabled={processing} className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl">Save Copy</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}