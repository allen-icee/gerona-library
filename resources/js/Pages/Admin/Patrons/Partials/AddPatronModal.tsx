import { useState, FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { Plus } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/Components/ui/dialog";

export default function AddPatronModal() {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            library_card_number: "",
            first_name: "",
            last_name: "",
            type: "Student", // Default value
            school_or_barangay: "",
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
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Register Patron
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                    <DialogTitle>Register New Patron</DialogTitle>
                    <DialogDescription>
                        Add a new borrower to the Gerona Library system.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitNewPatron} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="library_card_number"
                            className="text-stone-700"
                        >
                            Library Card / QR Code Number *
                        </Label>
                        <Input
                            id="library_card_number"
                            value={data.library_card_number}
                            onChange={(e) =>
                                setData("library_card_number", e.target.value)
                            }
                            required
                            placeholder="e.g. PAT-2026-001"
                        />
                        {errors.library_card_number && (
                            <p className="text-sm text-red-600">
                                {errors.library_card_number}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="first_name"
                                className="text-stone-700"
                            >
                                First Name *
                            </Label>
                            <Input
                                id="first_name"
                                value={data.first_name}
                                onChange={(e) =>
                                    setData("first_name", e.target.value)
                                }
                                required
                            />
                            {errors.first_name && (
                                <p className="text-sm text-red-600">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="last_name"
                                className="text-stone-700"
                            >
                                Last Name *
                            </Label>
                            <Input
                                id="last_name"
                                value={data.last_name}
                                onChange={(e) =>
                                    setData("last_name", e.target.value)
                                }
                                required
                            />
                            {errors.last_name && (
                                <p className="text-sm text-red-600">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type" className="text-stone-700">
                                Patron Type *
                            </Label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="flex h-9 w-full items-center justify-between rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-950"
                            >
                                <option value="Student">Student</option>
                                <option value="Teacher">Teacher</option>
                                <option value="General Public">
                                    General Public
                                </option>
                                <option value="LGU Official">
                                    LGU Official
                                </option>
                            </select>
                            {errors.type && (
                                <p className="text-sm text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="school_or_barangay"
                                className="text-stone-700"
                            >
                                School / Barangay *
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
                                required
                                placeholder="e.g. Gerona North"
                            />
                            {errors.school_or_barangay && (
                                <p className="text-sm text-red-600">
                                    {errors.school_or_barangay}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="contact_number"
                                className="text-stone-700"
                            >
                                Contact Number
                            </Label>
                            <Input
                                id="contact_number"
                                value={data.contact_number}
                                onChange={(e) =>
                                    setData("contact_number", e.target.value)
                                }
                                placeholder="09..."
                            />
                            {errors.contact_number && (
                                <p className="text-sm text-red-600">
                                    {errors.contact_number}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-stone-700">
                                Status *
                            </Label>
                            <select
                                id="status"
                                value={data.status}
                                onChange={(e) =>
                                    setData("status", e.target.value)
                                }
                                className="flex h-9 w-full items-center justify-between rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-950"
                            >
                                <option value="Active">Active</option>
                                <option value="Suspended">Suspended</option>
                            </select>
                            {errors.status && (
                                <p className="text-sm text-red-600">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-amber-600 hover:bg-amber-500 text-white"
                        >
                            {processing ? "Saving..." : "Register Patron"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
