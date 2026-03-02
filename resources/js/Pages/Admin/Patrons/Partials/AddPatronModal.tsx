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
            type: "Citizen", // Default changed
            email: "",
            gender: "Male",
            province: "Tarlac", // Default for convenience
            municipality: "Gerona", // Default for convenience
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
                <Button className="bg-slate-900 hover:bg-slate-800 text-white shadow-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Register Patron
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Register New Patron</DialogTitle>
                    <DialogDescription>
                        Add a new borrower. A QR code will be sent to their
                        email.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitNewPatron} className="space-y-4 py-4">
                    {/* ID & Type */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="library_card_number">
                                Library Card Number *
                            </Label>
                            <Input
                                id="library_card_number"
                                value={data.library_card_number}
                                onChange={(e) =>
                                    setData(
                                        "library_card_number",
                                        e.target.value,
                                    )
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
                        <div className="space-y-2">
                            <Label htmlFor="type">Patron Type *</Label>
                            <select
                                id="type"
                                value={data.type}
                                onChange={(e) =>
                                    setData("type", e.target.value)
                                }
                                className="flex h-9 w-full rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-stone-950"
                            >
                                <option value="Citizen">Citizen</option>
                                <option value="Student">Student</option>
                                <option value="Teacher/LGU Staff">
                                    Teacher / LGU Staff
                                </option>
                            </select>
                            {errors.type && (
                                <p className="text-sm text-red-600">
                                    {errors.type}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Conditional School Field - Smoothly reveals if Student is selected */}
                    {data.type === "Student" && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label htmlFor="school">School *</Label>
                            <Input
                                id="school"
                                value={data.school}
                                onChange={(e) =>
                                    setData("school", e.target.value)
                                }
                                placeholder="e.g. Gerona National High School"
                                required={data.type === "Student"}
                            />
                            {errors.school && (
                                <p className="text-sm text-red-600">
                                    {errors.school}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Name */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="first_name">First Name *</Label>
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
                            <Label htmlFor="last_name">Last Name *</Label>
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

                    {/* Contact & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                required
                                placeholder="user@example.com"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-2">
                                <Label htmlFor="contact_number">
                                    Contact #
                                </Label>
                                <Input
                                    id="contact_number"
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData(
                                            "contact_number",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="09..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    value={data.gender}
                                    onChange={(e) =>
                                        setData("gender", e.target.value)
                                    }
                                    className="flex h-9 w-full rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-sm"
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Address Line 1 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="province">Province *</Label>
                            <Input
                                id="province"
                                value={data.province}
                                onChange={(e) =>
                                    setData("province", e.target.value)
                                }
                                required
                            />
                            {errors.province && (
                                <p className="text-sm text-red-600">
                                    {errors.province}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="municipality">Municipality *</Label>
                            <Input
                                id="municipality"
                                value={data.municipality}
                                onChange={(e) =>
                                    setData("municipality", e.target.value)
                                }
                                required
                            />
                            {errors.municipality && (
                                <p className="text-sm text-red-600">
                                    {errors.municipality}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Address Line 2 */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="barangay">Barangay *</Label>
                            <Input
                                id="barangay"
                                value={data.barangay}
                                onChange={(e) =>
                                    setData("barangay", e.target.value)
                                }
                                required
                            />
                            {errors.barangay && (
                                <p className="text-sm text-red-600">
                                    {errors.barangay}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="street">Street (Optional)</Label>
                            <Input
                                id="street"
                                value={data.street}
                                onChange={(e) =>
                                    setData("street", e.target.value)
                                }
                            />
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
                            {processing
                                ? "Saving & Emailing..."
                                : "Register Patron"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
