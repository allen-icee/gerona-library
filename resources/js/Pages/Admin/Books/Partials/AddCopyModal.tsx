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

export default function AddCopyModal({ bookId }: { bookId: number }) {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        accession_number: "",
        shelf_location: "",
        status: "Available",
        source: "Purchased",
        donator_name: "",
        date_acquired: new Date().toISOString().split("T")[0],
        remarks: "",
    });

    const submitNewCopy: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("books.copies.store", bookId), {
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
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-md shadow-stone-300 font-bold text-xs h-10 rounded-xl w-full sm:w-auto">
                    <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2 text-pink-400" />
                    Add Physical Copy
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-pink-100 shadow-xl shadow-stone-200/50">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Icon icon="solar:qr-code-bold-duotone" className="w-6 h-6 text-pink-500" />
                        Add Accession Number
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Register a physical barcode or copy of this book into circulation.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitNewCopy} className="space-y-4 py-2">
                    <div className="space-y-1.5 relative">
                        <Label htmlFor="accession_number" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Accession Number (Barcode) *
                        </Label>
                        <div className="relative">
                            <Icon icon="solar:qr-code-bold-duotone" className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-pink-400" />
                            <Input
                                id="accession_number"
                                className="pl-10 h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl font-mono font-bold text-sm"
                                value={data.accession_number}
                                onChange={(e) => setData("accession_number", e.target.value)}
                                required
                                autoFocus
                                placeholder="Scan or type barcode..."
                            />
                        </div>
                        {errors.accession_number && <p className="text-xs text-red-600 font-medium">{errors.accession_number}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="shelf_location" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Shelf Location
                            </Label>
                            <Input
                                id="shelf_location"
                                value={data.shelf_location}
                                onChange={(e) => setData("shelf_location", e.target.value)}
                                placeholder="e.g. Shelf A2"
                                className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 z-40 relative">
                                Initial Status
                            </Label>
                            <CustomSelect
                                value={data.status}
                                onChange={(val) => setData("status", val)}
                                options={["Available", "Maintenance"]}
                                theme="pink"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 z-30 relative">
                                Source
                            </Label>
                            <CustomSelect
                                value={data.source}
                                onChange={(val) => setData("source", val)}
                                options={["Purchased", "LGU Grant", "Donated"]}
                                theme="pink"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="date_acquired" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Date Acquired
                            </Label>
                            <Input
                                id="date_acquired"
                                type="date"
                                value={data.date_acquired}
                                onChange={(e) => setData("date_acquired", e.target.value)}
                                className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm"
                            />
                        </div>
                    </div>

                    {data.source === "Donated" && (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label htmlFor="donator_name" className="text-xs font-bold uppercase tracking-wider text-pink-600">
                                Donator Name
                            </Label>
                            <Input
                                id="donator_name"
                                className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm bg-pink-50/50"
                                value={data.donator_name}
                                onChange={(e) => setData("donator_name", e.target.value)}
                                placeholder="Who donated this?"
                            />
                        </div>
                    )}

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 border-stone-200">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white shadow-md shadow-pink-200 font-bold rounded-xl border-none">
                            {processing ? "Saving..." : "Save Copy"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}