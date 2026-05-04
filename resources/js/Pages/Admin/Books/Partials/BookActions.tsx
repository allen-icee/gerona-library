//resources/js/Pages/Admin/Books/Partials/BookActions.tsx
import { useState, FormEventHandler, KeyboardEvent } from "react";
import { useForm, router } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter,
} from "@/Components/ui/dialog";

export default function BookActions({ book }: { book: any }) {
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        title: book.title || "", author: book.author || "", isbn: book.isbn || "",
        publisher: book.publisher || "", year_published: book.year_published || "",
        category: book.category || "", language: book.language || "",
    });

    const handleText = (val: string, field: any) => { if (/^[^<>*!@#$%^&]*$/.test(val)) setData(field, val); };
    const handleName = (val: string, field: any) => { if (/^[a-zA-Z\s.,'-]*$/.test(val)) setData(field, val); };
    const handleISBN = (val: string, field: any) => { if (/^[0-9X-]*$/i.test(val)) setData(field, val); };
    const handleYear = (val: string, field: any) => { if (/^\d{0,4}$/.test(val)) setData(field, val); };

    const focusNext = (e: KeyboardEvent<HTMLInputElement>, nextId: string) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextId === "submit") submitEdit(e as any);
            else document.getElementById(`${nextId}_${book.id}`)?.focus();
        }
    };

    const submitEdit: FormEventHandler = (e) => {
        e?.preventDefault();
        put(route("books.update", book.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditOpen(false);
                toast.success("Master record updated!");
            },
            onError: () => toast.error("Failed to update record."),
        });
    };

    const confirmDelete = () => {
        router.delete(route("books.destroy", book.id), {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                toast.success("Record deleted successfully.");
            },
            onError: () => toast.error("Failed to delete record."),
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
                    <DropdownMenuItem className="cursor-pointer font-medium hover:bg-pink-50 hover:text-pink-600 rounded-lg" onSelect={() => router.get(route("books.copies.index", book.id))}>
                        <Icon icon="solar:eye-bold-duotone" className="mr-2 h-4 w-4 text-pink-500" /> View/Add Copies
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-stone-100" />
                    <DropdownMenuItem className="cursor-pointer font-medium hover:bg-stone-50 rounded-lg" onSelect={() => setIsEditOpen(true)}>
                        <Icon icon="solar:pen-bold-duotone" className="mr-2 h-4 w-4 text-stone-500" /> Edit Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg" onSelect={() => setIsDeleteOpen(true)}>
                        <Icon icon="solar:trash-bin-trash-bold" className="mr-2 h-4 w-4" /> Delete Record
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-125 bg-white rounded-2xl border-pink-100 shadow-xl shadow-stone-200/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black flex items-center gap-2"><Icon icon="solar:pen-bold-duotone" className="text-pink-500 w-6 h-6" /> Edit Record</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor={`edit_title_${book.id}`} className="text-xs font-bold uppercase text-slate-600">Title *</Label>
                            <Input id={`edit_title_${book.id}`} value={data.title} onChange={(e) => handleText(e.target.value, "title")} onKeyDown={(e) => focusNext(e, "edit_author")} required className="h-10 rounded-xl" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_author_${book.id}`} className="text-xs font-bold uppercase text-slate-600">Author *</Label>
                                <Input id={`edit_author_${book.id}`} value={data.author} onChange={(e) => handleName(e.target.value, "author")} onKeyDown={(e) => focusNext(e, "edit_isbn")} required className="h-10 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_isbn_${book.id}`} className="text-xs font-bold uppercase text-slate-600">ISBN</Label>
                                <Input id={`edit_isbn_${book.id}`} value={data.isbn} onChange={(e) => handleISBN(e.target.value, "isbn")} onKeyDown={(e) => focusNext(e, "edit_publisher")} className="h-10 rounded-xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_publisher_${book.id}`} className="text-xs font-bold uppercase text-slate-600">Publisher</Label>
                                <Input id={`edit_publisher_${book.id}`} value={data.publisher} onChange={(e) => handleName(e.target.value, "publisher")} onKeyDown={(e) => focusNext(e, "edit_year")} className="h-10 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_year_${book.id}`} className="text-xs font-bold uppercase text-slate-600">Year</Label>
                                <Input id={`edit_year_${book.id}`} value={data.year_published} onChange={(e) => handleYear(e.target.value, "year_published")} onKeyDown={(e) => focusNext(e, "edit_category")} className="h-10 rounded-xl" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_category_${book.id}`} className="text-xs font-bold uppercase text-slate-600">Category</Label>
                                <Input id={`edit_category_${book.id}`} value={data.category} onChange={(e) => handleText(e.target.value, "category")} onKeyDown={(e) => focusNext(e, "edit_language")} className="h-10 rounded-xl" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor={`edit_language_${book.id}`} className="text-xs font-bold uppercase text-slate-600">Language</Label>
                                <Input id={`edit_language_${book.id}`} value={data.language} onChange={(e) => handleText(e.target.value, "language")} onKeyDown={(e) => focusNext(e, "submit")} className="h-10 rounded-xl" />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl">Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl">Update</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* MISSING Delete Modal HAS BEEN ADDED HERE */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-md bg-white rounded-2xl border-red-100 shadow-xl shadow-stone-200/50">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-red-600 flex items-center gap-2">
                            <Icon icon="solar:danger-triangle-bold-duotone" className="w-6 h-6" /> Confirm Deletion
                        </DialogTitle>
                        <DialogDescription className="text-stone-500 font-medium pt-2">
                            Are you sure you want to delete this master record? This action will archive the book and it will no longer appear in search results.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button type="button" onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-xl">
                            Delete Record
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </>
    );
}