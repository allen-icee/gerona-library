import { useState, FormEventHandler } from "react";
import { useForm, router } from "@inertiajs/react";
import { Icon } from "@iconify/react";
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
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
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

    const confirmDelete = () => {
        router.delete(route("books.destroy", book.id), {
            preserveScroll: true,
            onSuccess: () => setIsDeleteOpen(false)
        });
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-stone-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors">
                        <Icon icon="solar:menu-dots-bold" className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 bg-white z-50 rounded-xl border-pink-100 shadow-lg shadow-stone-200/50">
                    <DropdownMenuLabel className="text-xs font-bold uppercase text-stone-400 tracking-wider">Actions</DropdownMenuLabel>

                    <DropdownMenuItem
                        className="cursor-pointer font-medium hover:bg-pink-50 hover:text-pink-600 rounded-lg"
                        onSelect={() => router.get(route("books.copies.index", book.id))}
                    >
                        <Icon icon="solar:eye-bold-duotone" className="mr-2 h-4 w-4 text-pink-500" /> View/Add Copies
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-stone-100" />

                    <DropdownMenuItem
                        className="cursor-pointer font-medium hover:bg-stone-50 rounded-lg"
                        onSelect={() => setIsEditOpen(true)}
                    >
                        <Icon icon="solar:pen-bold-duotone" className="mr-2 h-4 w-4 text-stone-500" /> Edit Details
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        className="cursor-pointer font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg"
                        onSelect={() => setIsDeleteOpen(true)}
                    >
                        <Icon icon="solar:trash-bin-trash-bold" className="mr-2 h-4 w-4" /> Delete Record
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* EDIT MODAL */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-pink-100 shadow-xl shadow-stone-200/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                            <Icon icon="solar:pen-bold-duotone" className="w-6 h-6 text-pink-500" /> Edit Master Record
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium">
                            Update the details for this book.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={submitEdit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor={`edit_title_${book.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Title *</Label>
                            <Input id={`edit_title_${book.id}`} value={data.title} onChange={(e) => setData("title", e.target.value)} required className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl" />
                            {errors.title && <p className="text-xs text-red-600 font-medium">{errors.title}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_author_${book.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Author *</Label>
                                <Input id={`edit_author_${book.id}`} value={data.author} onChange={(e) => setData("author", e.target.value)} required className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_isbn_${book.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">ISBN</Label>
                                <Input id={`edit_isbn_${book.id}`} value={data.isbn} onChange={(e) => setData("isbn", e.target.value)} className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_publisher_${book.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Publisher</Label>
                                <Input id={`edit_publisher_${book.id}`} value={data.publisher} onChange={(e) => setData("publisher", e.target.value)} className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_year_${book.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Year</Label>
                                <Input id={`edit_year_${book.id}`} value={data.year_published} onChange={(e) => setData("year_published", e.target.value)} className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_category_${book.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Category</Label>
                                <Input id={`edit_category_${book.id}`} value={data.category} onChange={(e) => setData("category", e.target.value)} className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_language_${book.id}`} className="text-xs font-bold uppercase tracking-wider text-slate-600">Language</Label>
                                <Input id={`edit_language_${book.id}`} value={data.language} onChange={(e) => setData("language", e.target.value)} className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl" />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl font-bold text-slate-500 border-stone-200">Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-gradient-to-r from-pink-400 to-pink-600 text-white font-bold rounded-xl border-none shadow-md shadow-pink-200">
                                {processing ? "Updating..." : "Update Record"}
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
                            <Icon icon="solar:danger-triangle-bold-duotone" className="w-6 h-6" /> Delete Master Record
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500 font-medium mt-2">
                            Are you sure you want to permanently delete <strong>{book.title}</strong>? This action cannot be undone.
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