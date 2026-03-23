// resources/js/Pages/Admin/Books/Partials/AddBookModal.tsx
import { useState, FormEventHandler, KeyboardEvent } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast } from "sonner";
import SearchableSelect from "@/Components/SearchableSelect";
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

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());
const CATEGORY_OPTIONS = [

    "Fiction",
    "Non-Fiction",

    "Fantasy",
    "Science Fiction",
    "Mystery & Thriller",
    "Romance",
    "Horror",
    "Historical Fiction",
    "Young Adult",
    "Children",

    "Poetry",
    "Drama",
    "Comics & Graphic Novels",

    "Mathematics",
    "Science",
    "Physics",
    "Chemistry",
    "Biology",
    "Computer Science",
    "Information Technology",
    "Engineering",
    "Medicine",
    "Nursing",
    "Psychology",
    "Sociology",
    "Economics",
    "Business",
    "Accounting",
    "Law",
    "Political Science",
    "Education",

    "History",
    "Philosophy",
    "Religion & Spirituality",
    "Languages & Linguistics",
    "Art & Design",
    "Music",

    "Self-Help",
    "Health & Wellness",
    "Travel",
    "Cookbooks",

    "Reference",
    "Encyclopedia",
    "Dictionary"
];

const LANGUAGE_OPTIONS = [

    "English",
    "Chinese",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Russian",
    "Portuguese",
    "Italian",
    "Arabic",

    "Filipino",
    "Taglish",
    "Hindi",
    "Bengali",
    "Urdu",
    "Tamil",
    "Thai",
    "Vietnamese",
    "Indonesian",
    "Malay",

    "Korean",

    "Dutch",
    "Swedish",
    "Polish",
    "Turkish",
    "Greek",
    "Czech",
    "Hungarian",
    "Romanian"
];

export default function AddBookModal() {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        title: "", author: "", isbn: "", publisher: "", year_published: "", category: "", language: "",
        copies: [{ shelf_location: "", source: "Donated" }], // Clean initialization
    });

    const handleText = (val: string, field: any) => { if (/^[^<>*!@#$%^&]*$/.test(val)) setData(field, val); };
    const handleName = (val: string, field: any) => { if (/^[a-zA-Z\s.,'-]*$/.test(val)) setData(field, val); };
    const handleISBN = (val: string, field: any) => { if (/^[0-9xX-]*$/.test(val)) setData(field, val); };
    const handleYear = (val: string, field: any) => { if (/^\d{0,4}$/.test(val)) setData(field, val); };

    const focusNext = (e: KeyboardEvent<HTMLInputElement>, nextId: string) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextId === "submit") submitNewBook(e as any);
            else document.getElementById(nextId)?.focus();
        }
    };

    const handleNumCopiesChange = (val: string) => {
        let num = parseInt(val, 10);
        if (isNaN(num) || num < 0) num = 0;
        if (num > 30) num = 30;

        const currentCopies = [...data.copies];
        if (num > currentCopies.length) {

            for (let i = currentCopies.length; i < num; i++) {
                currentCopies.push({
                    shelf_location: "",
                    source: "Donated"
                });
            }
        } else if (num < currentCopies.length) {

            currentCopies.splice(num);
        }
        setData("copies", currentCopies);
    };

    const updateCopyField = (index: number, field: string, value: string) => {
        const newCopies = [...data.copies];
        (newCopies[index] as any)[field] = value;
        setData("copies", newCopies);
    };

    const submitNewBook: FormEventHandler = (e) => {
        e?.preventDefault();
        post(route("books.store"), {
            preserveScroll: true,
            onSuccess: () => {
                setIsOpen(false);
                reset();
                toast.success(`Master record and ${data.copies.length} copies added successfully!`);
            },
            onError: () => toast.error("Failed to save. Please check required fields."),
        });
    };

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (open) {
                    clearErrors();

                    setData("copies", [{ shelf_location: "", source: "Donated" }]);
                } else {
                    reset();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className="bg-linear-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white shadow-md shadow-pink-300/50 border-none font-bold text-xs h-10 rounded-xl flex-1 sm:flex-none">
                    <Icon icon="solar:add-circle-bold-duotone" className="w-4 h-4 mr-2" />
                    Add Master Record
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[40rem] bg-white rounded-2xl border-pink-100 shadow-xl shadow-stone-200/50 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Icon icon="solar:book-bookmark-bold-duotone" className="w-6 h-6 text-pink-500" />
                        Add Master Book Record
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Create a new catalog entry and instantly register multiple physical copies.
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
                            placeholder="e.g. Noli Me Tangere"
                            onChange={(e) => handleText(e.target.value, "title")}
                            onKeyDown={(e) => focusNext(e, "author")}
                            required
                            autoFocus
                            className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm bg-slate-50/50"
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
                                placeholder="e.g. Jose Rizal"
                                onChange={(e) => handleName(e.target.value, "author")}
                                onKeyDown={(e) => focusNext(e, "isbn")}
                                required
                                className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm bg-slate-50/50"
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
                                placeholder="e.g. 978-971-508-032-1"
                                onChange={(e) => handleISBN(e.target.value, "isbn")}
                                onKeyDown={(e) => focusNext(e, "publisher")}
                                className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm font-mono bg-slate-50/50"
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
                                placeholder="e.g. Adarna House"
                                onChange={(e) => handleName(e.target.value, "publisher")}
                                onKeyDown={(e) => focusNext(e, "year_published")}
                                className="h-10 border-pink-200 focus-visible:ring-pink-500 rounded-xl text-sm bg-slate-50/50"
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
                                placeholder="e.g. English"
                            />
                        </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-pink-100 relative z-20">

                        <div className="flex justify-between items-center mb-5 bg-pink-50/50 p-3 rounded-xl border border-pink-100">
                            <div className="flex items-center gap-2">
                                <Icon icon="solar:box-bold-duotone" className="w-5 h-5 text-pink-500" />
                                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Physical Copies</h3>
                            </div>
                            <div className="flex items-center gap-3">
                                <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Qty:</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="30"
                                    value={data.copies.length}
                                    onChange={(e) => handleNumCopiesChange(e.target.value)}
                                    className="w-20 h-9 text-center font-black text-pink-600 border-pink-200 focus-visible:ring-pink-500 rounded-lg shadow-inner"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {data.copies.map((copy, index) => (
                                <div key={index} className="relative grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-stone-200 rounded-xl shadow-sm" style={{ zIndex: 20 - index }}>

                                    <div className="absolute -top-3 -left-3 w-7 h-7 bg-pink-500 text-white rounded-full flex items-center justify-center text-[11px] font-black shadow-md border-2 border-white">
                                        {index + 1}
                                    </div>


                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Accession No.</Label>
                                        <Input
                                            disabled
                                            value="Auto-Generated"
                                            className="h-9 bg-slate-100/50 border-stone-200 text-slate-400 rounded-lg text-xs font-bold text-center"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Shelf Location</Label>
                                        <Input
                                            value={copy.shelf_location}
                                            placeholder="e.g. A1-Top"
                                            onChange={(e) => updateCopyField(index, "shelf_location", e.target.value)}
                                            className="h-9 bg-slate-50/50 border-stone-200 focus-visible:ring-pink-500 rounded-lg text-xs"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <Label className="text-[10px] font-bold uppercase tracking-wider text-slate-600">Source *</Label>
                                        <CustomSelect
                                            options={["Donated", "Purchased", "Replacement"]}
                                            value={copy.source}
                                            onChange={(val) => updateCopyField(index, "source", val)}
                                            theme="pink"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {data.copies.length === 0 && (
                            <p className="text-center text-xs text-stone-400 font-bold py-4 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                                0 Copies. The master record will be saved, but no physical books will be added to inventory.
                            </p>
                        )}
                    </div>

                    <DialogFooter className="pt-6 relative z-10 border-t border-slate-100 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 border-stone-200 h-11 px-6"
                        >
                            Cancel
                        </Button>
                        <Button
                            id="submit"
                            type="submit"
                            disabled={processing}
                            className="bg-linear-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white shadow-md shadow-pink-200 font-bold rounded-xl border-none h-11 px-6"
                        >
                            {processing ? "Saving..." : `Save Record & ${data.copies.length} Copies`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}