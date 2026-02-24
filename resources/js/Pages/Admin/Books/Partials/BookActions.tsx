import { useState, FormEventHandler } from "react";
import { useForm, router } from "@inertiajs/react";
import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
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

export default function BookActions({ book }: { book: any }) {
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data, setData, put, processing, errors, reset } = useForm({
        title: book.title || "",
        author: book.author || "",
        isbn: book.isbn || "",
        publisher: book.publisher || "",
        year_published: book.year_published || "",
        category: book.category || "",
        language: book.language || "",
    });

    const submitEdit: FormEventHandler = (e) => {
        e.preventDefault();
        put(route("books.update", book.id), {
            preserveScroll: true,
            onSuccess: () => setIsEditOpen(false),
        });
    };

    const handleDelete = () => {
        if (
            confirm(
                "Are you sure you want to permanently delete this master record?",
            )
        ) {
            router.delete(route("books.destroy", book.id), {
                preserveScroll: true,
            });
        }
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
                        onSelect={() =>
                            router.get(route("books.copies.index", book.id))
                        }
                    >
                        <Eye className="mr-2 h-4 w-4 text-amber-600" /> View/Add
                        Copies
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {/* onSelect fixes the Shadcn bug! */}
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
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Record
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {/* EDIT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white">
                    <DialogHeader>
                        <DialogTitle>Edit Master Record</DialogTitle>
                        <DialogDescription>
                            Update the details for this book.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor={`edit_title_${book.id}`}>
                                Title *
                            </Label>
                            <Input
                                id={`edit_title_${book.id}`}
                                value={data.title}
                                onChange={(e) =>
                                    setData("title", e.target.value)
                                }
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-red-600">
                                    {errors.title}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`edit_author_${book.id}`}>
                                    Author *
                                </Label>
                                <Input
                                    id={`edit_author_${book.id}`}
                                    value={data.author}
                                    onChange={(e) =>
                                        setData("author", e.target.value)
                                    }
                                    required
                                />
                                {errors.author && (
                                    <p className="text-sm text-red-600">
                                        {errors.author}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`edit_isbn_${book.id}`}>
                                    ISBN
                                </Label>
                                <Input
                                    id={`edit_isbn_${book.id}`}
                                    value={data.isbn}
                                    onChange={(e) =>
                                        setData("isbn", e.target.value)
                                    }
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor={`edit_publisher_${book.id}`}>
                                    Publisher
                                </Label>
                                <Input
                                    id={`edit_publisher_${book.id}`}
                                    value={data.publisher}
                                    onChange={(e) =>
                                        setData("publisher", e.target.value)
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`edit_year_${book.id}`}>
                                    Year
                                </Label>
                                <Input
                                    id={`edit_year_${book.id}`}
                                    value={data.year_published}
                                    onChange={(e) =>
                                        setData(
                                            "year_published",
                                            e.target.value,
                                        )
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
                                {processing ? "Updating..." : "Update Record"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
