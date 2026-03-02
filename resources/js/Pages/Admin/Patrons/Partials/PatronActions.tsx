import { useState, FormEventHandler } from "react";
import { useForm, router } from "@inertiajs/react";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Ban,
    CheckCircle,
    Printer,
} from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";

export default function PatronActions({
    patron,
    onPrint,
}: {
    patron: any;
    onPrint: () => void;
}) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Updated to match the new Database Schema from Step 1
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

    const handleDelete = () => {
        if (
            confirm(
                "Are you sure you want to completely delete this patron? They will lose all borrowing history.",
            )
        ) {
            router.delete(route("patrons.destroy", patron.id), {
                preserveScroll: true,
            });
        }
    };

    const toggleStatus = () => {
        const newStatus = patron.status === "Active" ? "Suspended" : "Active";
        router.put(
            route("patrons.update", patron.id),
            { ...data, status: newStatus },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-stone-500 hover:text-stone-800 focus:outline-none"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white z-50">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>

                    {/* NEW PRINT BUTTON */}
                    <DropdownMenuItem
                        className="cursor-pointer font-medium text-amber-700"
                        onSelect={onPrint}
                    >
                        <Printer className="mr-2 h-4 w-4" /> Print ID Card
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={toggleStatus}
                    >
                        {patron.status === "Active" ? (
                            <>
                                <Ban className="mr-2 h-4 w-4 text-red-500" />{" "}
                                Suspend Patron
                            </>
                        ) : (
                            <>
                                <CheckCircle className="mr-2 h-4 w-4 text-emerald-500" />{" "}
                                Reactivate Patron
                            </>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        className="cursor-pointer"
                        onSelect={() => setIsEditOpen(true)}
                    >
                        <Edit className="mr-2 h-4 w-4 text-slate-600" /> Edit
                        Details
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-700"
                        onSelect={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Patron
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* EDIT MODAL - UPDATED SCHEMA */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Patron Details</DialogTitle>
                        <DialogDescription>
                            Update {patron.first_name}'s registry information.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`edit_lib_num_${patron.id}`}>
                                    Library Card Number *
                                </Label>
                                <Input
                                    id={`edit_lib_num_${patron.id}`}
                                    value={data.library_card_number}
                                    onChange={(e) =>
                                        setData(
                                            "library_card_number",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                                {errors.library_card_number && (
                                    <p className="text-sm text-red-600">
                                        {errors.library_card_number}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`edit_type_${patron.id}`}>
                                    Type *
                                </Label>
                                <select
                                    id={`edit_type_${patron.id}`}
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
                            </div>
                        </div>

                        {data.type === "Student" && (
                            <div className="space-y-2">
                                <Label htmlFor={`edit_school_${patron.id}`}>
                                    School *
                                </Label>
                                <Input
                                    id={`edit_school_${patron.id}`}
                                    value={data.school}
                                    onChange={(e) =>
                                        setData("school", e.target.value)
                                    }
                                    required={data.type === "Student"}
                                />
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`edit_fn_${patron.id}`}>
                                    First Name *
                                </Label>
                                <Input
                                    id={`edit_fn_${patron.id}`}
                                    value={data.first_name}
                                    onChange={(e) =>
                                        setData("first_name", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`edit_ln_${patron.id}`}>
                                    Last Name *
                                </Label>
                                <Input
                                    id={`edit_ln_${patron.id}`}
                                    value={data.last_name}
                                    onChange={(e) =>
                                        setData("last_name", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`edit_email_${patron.id}`}>
                                    Email *
                                </Label>
                                <Input
                                    id={`edit_email_${patron.id}`}
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor={`edit_contact_${patron.id}`}
                                    >
                                        Contact #
                                    </Label>
                                    <Input
                                        id={`edit_contact_${patron.id}`}
                                        value={data.contact_number}
                                        onChange={(e) =>
                                            setData(
                                                "contact_number",
                                                e.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`edit_gender_${patron.id}`}>
                                        Gender
                                    </Label>
                                    <select
                                        id={`edit_gender_${patron.id}`}
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`edit_prov_${patron.id}`}>
                                    Province
                                </Label>
                                <Input
                                    id={`edit_prov_${patron.id}`}
                                    value={data.province}
                                    onChange={(e) =>
                                        setData("province", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`edit_mun_${patron.id}`}>
                                    Municipality
                                </Label>
                                <Input
                                    id={`edit_mun_${patron.id}`}
                                    value={data.municipality}
                                    onChange={(e) =>
                                        setData("municipality", e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`edit_brgy_${patron.id}`}>
                                    Barangay
                                </Label>
                                <Input
                                    id={`edit_brgy_${patron.id}`}
                                    value={data.barangay}
                                    onChange={(e) =>
                                        setData("barangay", e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`edit_street_${patron.id}`}>
                                    Street (Optional)
                                </Label>
                                <Input
                                    id={`edit_street_${patron.id}`}
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
                                onClick={() => setIsEditOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="bg-amber-600 hover:bg-amber-500 text-white"
                            >
                                {processing ? "Updating..." : "Update Patron"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
