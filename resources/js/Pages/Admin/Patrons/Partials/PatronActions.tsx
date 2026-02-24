import { useState, FormEventHandler } from "react";
import { useForm, router } from "@inertiajs/react";
import { MoreHorizontal, Edit, Trash2, Ban, CheckCircle } from "lucide-react";
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

export default function PatronActions({ patron }: { patron: any }) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        library_card_number: patron.library_card_number || "",
        first_name: patron.first_name || "",
        last_name: patron.last_name || "",
        type: patron.type || "Student",
        school_or_barangay: patron.school_or_barangay || "",
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

            {/* EDIT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Edit Patron Details</DialogTitle>
                        <DialogDescription>
                            Update {patron.first_name}'s registry information.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="space-y-4 py-4">
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
                                <Label htmlFor={`edit_type_${patron.id}`}>
                                    Type
                                </Label>
                                <select
                                    id={`edit_type_${patron.id}`}
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="flex h-9 w-full rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm shadow-sm"
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
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`edit_sb_${patron.id}`}>
                                    School / Barangay
                                </Label>
                                <Input
                                    id={`edit_sb_${patron.id}`}
                                    value={data.school_or_barangay}
                                    onChange={(e) =>
                                        setData(
                                            "school_or_barangay",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`edit_contact_${patron.id}`}>
                                Contact Number
                            </Label>
                            <Input
                                id={`edit_contact_${patron.id}`}
                                value={data.contact_number}
                                onChange={(e) =>
                                    setData("contact_number", e.target.value)
                                }
                            />
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
