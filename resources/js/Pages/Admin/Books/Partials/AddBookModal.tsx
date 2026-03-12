import { useState, FormEventHandler, KeyboardEvent } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import SearchableSelect from "@/Components/SearchableSelect";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/Components/ui/dialog";

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
const CATEGORY_OPTIONS = ["Fiction", "Non-Fiction", "Science & Technology", "History", "Biography", "Children", "Reference", "Philosophy"];
const LANGUAGE_OPTIONS = ["English", "Filipino", "Taglish", "Spanish", "French", "Japanese"];

export default function AddBookModal() {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: "", author: "", isbn: "", publisher: "", year_published: "", category: "", language: "",
    });

    // --- STRICT REGEX HANDLERS ---
    const handleText = (val: string, field: any) => { if (/^[^<>*!@#$%^&]*$/.test(val)) setData(field, val); };
    const handleName = (val: string, field: any) => { if (/^[a-zA-Z\s.,'-]*$/.test(val)) setData(field, val); };
    const handleISBN = (val: string, field: any) => { if (/^[0-9xX-]*$/.test(val)) setData(field, val); };
    const handleYear = (val: string, field: any) => { if (/^\d{0,4}$/.test(val)) setData(field, val); };

    // --- ENTER KEY JUMPING ---
    const focusNext = (e: KeyboardEvent<HTMLInputElement>, nextId: string) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextId === "submit") submitNewBook(e as any);
            else document.getElementById(nextId)?.focus();
        }
    };

    const submitNewBook: FormEventHandler = (e) => {
        e?.preventDefault();
        post(route("books.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                reset();
                toast.success("Master record added successfully!");
            },
            onError: () => toast.error("Failed to save. Please check required fields."),
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
                <Button className="bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white shadow-md shadow-pink-300/50 border-none font-bold text-xs h-10 rounded-xl flex-1 sm:flex-none">
                    <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2" />
                    Add Master Record
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white rounded-2xl border-pink-100 shadow-xl shadow-stone-200/50">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Icon icon="solar:book-bookmark-bold-duotone" className="w-6 h-6 text-pink-500" />
                        Add Master Book Record
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Create a new catalog entry. Physical copies can be added later.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitNewBook} className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                            Title *
                        </Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => handleText(e.target.value, "title")}
                            onKeyDown={(e) => focusNext(e, "author")}
                            required
                            autoFocus
                            className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm"
                        />
                        {errors.title && <p className="text-xs text-red-600 font-medium">{errors.title}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="author" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Author *
                            </Label>
                            <Input
                                id="author"
                                value={data.author}
                                onChange={(e) => handleName(e.target.value, "author")}
                                onKeyDown={(e) => focusNext(e, "isbn")}
                                required
                                className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm"
                            />
                            {errors.author && <p className="text-xs text-red-600 font-medium">{errors.author}</p>}
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="isbn" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                ISBN
                            </Label>
                            <Input
                                id="isbn"
                                value={data.isbn}
                                onChange={(e) => handleISBN(e.target.value, "isbn")}
                                onKeyDown={(e) => focusNext(e, "publisher")}
                                className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm font-mono"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-40">
                        <div className="space-y-1.5">
                            <Label htmlFor="publisher" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Publisher
                            </Label>
                            <Input
                                id="publisher"
                                value={data.publisher}
                                onChange={(e) => handleName(e.target.value, "publisher")}
                                onKeyDown={(e) => focusNext(e, "year_published")}
                                className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Year
                            </Label>
                            <SearchableSelect
                                id="year_published"
                                value={data.year_published}
                                onChange={(val) => handleYear(val, "year_published")}
                                options={YEAR_OPTIONS}
                                onKeyDown={(e) => focusNext(e, "category")}
                                placeholder="e.g. 2024"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 relative z-30">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Category
                            </Label>
                            <SearchableSelect
                                id="category"
                                value={data.category}
                                onChange={(val) => handleText(val, "category")}
                                options={CATEGORY_OPTIONS}
                                onKeyDown={(e) => focusNext(e, "language")}
                                placeholder="e.g. Fiction"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                                Language
                            </Label>
                            <SearchableSelect
                                id="language"
                                value={data.language}
                                onChange={(val) => handleText(val, "language")}
                                options={LANGUAGE_OPTIONS}
                                onKeyDown={(e) => focusNext(e, "submit")}
                                placeholder="e.g. English"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 relative z-10">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 border-stone-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            id="submit"
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white shadow-md shadow-pink-200 font-bold rounded-xl border-none"
                        >
                            {processing ? "Saving..." : "Save Record"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}