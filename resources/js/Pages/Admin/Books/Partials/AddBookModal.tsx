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

export default function AddBookModal() {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            title: "",
            author: "",
            isbn: "",
            publisher: "",
            year_published: "",
            category: "",
            language: "",
        });

    const submitNewBook: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("books.store"), {
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
                    Add Master Record
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white">
                <DialogHeader>
                    <DialogTitle>Add Master Book Record</DialogTitle>
                    <DialogDescription>
                        Create a new catalog entry.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submitNewBook} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title" className="text-stone-700">
                            Title *
                        </Label>
                        <Input
                            id="title"
                            value={data.title}
                            onChange={(e) => setData("title", e.target.value)}
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
                            <Label htmlFor="author" className="text-stone-700">
                                Author *
                            </Label>
                            <Input
                                id="author"
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
                            <Label htmlFor="isbn" className="text-stone-700">
                                ISBN
                            </Label>
                            <Input
                                id="isbn"
                                value={data.isbn}
                                onChange={(e) =>
                                    setData("isbn", e.target.value)
                                }
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="publisher"
                                className="text-stone-700"
                            >
                                Publisher
                            </Label>
                            <Input
                                id="publisher"
                                value={data.publisher}
                                onChange={(e) =>
                                    setData("publisher", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="year_published"
                                className="text-stone-700"
                            >
                                Year
                            </Label>
                            <Input
                                id="year_published"
                                value={data.year_published}
                                onChange={(e) =>
                                    setData("year_published", e.target.value)
                                }
                                placeholder="e.g. 2024"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="category"
                                className="text-stone-700"
                            >
                                Category
                            </Label>
                            <Input
                                id="category"
                                value={data.category}
                                onChange={(e) =>
                                    setData("category", e.target.value)
                                }
                                placeholder="e.g. Fiction"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="language"
                                className="text-stone-700"
                            >
                                Language
                            </Label>
                            <Input
                                id="language"
                                value={data.language}
                                onChange={(e) =>
                                    setData("language", e.target.value)
                                }
                                placeholder="e.g. English"
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
                            {processing ? "Saving..." : "Save Record"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
