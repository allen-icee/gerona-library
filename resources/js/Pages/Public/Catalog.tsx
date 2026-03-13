// resources/js/Pages/Public/Catalog.tsx
import { FormEventHandler } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Input } from "@/Components/ui/input";
import CustomSelect from "@/Components/CustomSelect";
import BookCard from "@/Components/Public/BookCard";

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    year_published: string;
    available_copies: number;
    cover_url?: string | null;
    description?: string | null;
}

interface CatalogProps {
    books: {
        data: Book[];
        total: number;
        links: any[];
    };
    filters: any;
    categories: string[];
}

export default function Catalog({ books, filters = {}, categories = [] }: CatalogProps) {
    const { data, setData, get } = useForm({
        search: filters.search || "",
        category: filters.category || "",
        available: filters.available || "",
        sort: filters.sort || "newest",
    });

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        get(route("catalog.index"), { preserveState: true });
    };

    const applyFilters = () => {
        get(route("catalog.index"), { preserveState: true });
    };

    const clearFilters = () => {
        setData({ search: "", category: "", available: "", sort: "newest" });
        // Small timeout ensures state updates before fetching
        setTimeout(() => applyFilters(), 50);
    };

    const sortValueMap: Record<string, string> = {
        "Recently Added": "newest",
        "Title (A-Z)": "title",
        "Author (A-Z)": "author",
        "Year Published": "year"
    };

    const sortDisplayMap: Record<string, string> = {
        "newest": "Recently Added",
        "title": "Title (A-Z)",
        "author": "Author (A-Z)",
        "year": "Year Published"
    };

    return (
        <PublicLayout>
            <Head title="Library Catalog" />

            {/* Added animation wrapper and max-w to match Home.tsx */}
            <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full py-2">

                {/* HEADER & SEARCH */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 pb-6 border-b border-rose-100">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-600 rounded-full font-potta text-[10px] uppercase tracking-widest border border-rose-100 shadow-sm mb-3 md:mb-2">
                            <Icon icon="solar:book-bookmark-bold-duotone" className="w-3 h-3 text-rose-500" />
                            Library Service
                        </div>
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-slate-800 tracking-tight leading-tight">
                            Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">Catalog</span>
                        </h1>
                        <p className="text-sm text-stone-500 font-medium mt-1.5 md:mt-2">
                            Showing {books.total || 0} items in our collection.
                        </p>
                    </div>

                    <form onSubmit={handleSearch} className="w-full md:w-80 lg:w-96 relative group shrink-0 mt-2 md:mt-0">
                        <Input
                            value={data.search}
                            onChange={(e) => setData("search", e.target.value)}
                            placeholder="Search title, author, ISBN..."
                            className="h-12 pl-12 pr-4 rounded-2xl border border-rose-200 focus-visible:border-rose-400 focus-visible:ring-rose-400 text-sm bg-white shadow-sm transition-all w-full"
                        />
                        <Icon icon="solar:magnifer-bold-duotone" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400" />
                    </form>
                </div>

                {/* MAIN CONTENT GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                    {/* SIDEBAR FILTERS 
                        Notice `lg:sticky lg:top-6`. This saves mobile users from a stuck, screen-blocking filter box.
                    */}
                    <aside className="lg:col-span-3 lg:sticky lg:top-6 w-full">
                        <div className="bg-white rounded-3xl border border-rose-100 p-5 md:p-6 shadow-sm space-y-5">
                            <h3 className="font-serif font-black text-lg text-slate-800 flex items-center gap-2 mb-4">
                                <Icon icon="solar:filter-bold-duotone" className="w-5 h-5 text-rose-500" />
                                Filters
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-[11px] font-bold uppercase text-stone-500 mb-1.5 block tracking-wider">Category</label>
                                    <CustomSelect
                                        value={data.category || "All Categories"}
                                        onChange={(val) => setData("category", val === "All Categories" ? "" : val)}
                                        options={["All Categories", ...categories]}
                                        theme="rose"
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold uppercase text-stone-500 mb-1.5 block tracking-wider">Availability</label>
                                    <CustomSelect
                                        value={data.available === "1" ? "Available Now" : "Show All"}
                                        onChange={(val) => setData("available", val === "Available Now" ? "1" : "")}
                                        options={["Show All", "Available Now"]}
                                        theme="rose"
                                    />
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold uppercase text-stone-500 mb-1.5 block tracking-wider">Sort By</label>
                                    <CustomSelect
                                        value={sortDisplayMap[data.sort] || "Recently Added"}
                                        onChange={(val) => setData("sort", sortValueMap[val])}
                                        options={["Recently Added", "Title (A-Z)", "Author (A-Z)", "Year Published"]}
                                        theme="rose"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={applyFilters}
                                className="w-full bg-rose-500 text-white font-bold text-sm py-3 rounded-xl hover:bg-rose-600 transition shadow-sm hover:shadow-md hover:-translate-y-0.5 duration-300 mt-2 flex items-center justify-center gap-2"
                            >
                                <Icon icon="solar:tuning-square-2-bold-duotone" className="w-4 h-4" />
                                Apply Filters
                            </button>
                        </div>
                    </aside>

                    {/* BOOK GRID */}
                    <section className="lg:col-span-9 w-full">
                        {books.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 md:py-24 bg-rose-50/50 rounded-3xl border border-dashed border-rose-200 px-4">
                                <Icon icon="solar:ghost-bold-duotone" className="w-16 h-16 text-rose-300 mb-4" />
                                <h3 className="text-xl font-serif font-black text-slate-800">No books found</h3>
                                <p className="text-stone-500 text-sm mt-2 max-w-sm text-center leading-relaxed">
                                    We couldn't find anything matching your current filters. Try adjusting your search or clearing the filters.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-6 px-6 py-2.5 bg-white border border-rose-200 text-rose-600 font-bold text-sm rounded-full hover:bg-rose-50 transition-all shadow-sm hover:shadow active:scale-95"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {books.data.map((book) => (
                                    <BookCard key={book.id} book={book} />
                                ))}
                            </div>
                        )}

                        {/* PAGINATION */}
                        {books.links && books.links.length > 3 && (
                            <div className="flex justify-center mt-10 md:mt-12 gap-1.5 md:gap-2 flex-wrap pb-4 md:pb-0">
                                {books.links.map((link, i) => (
                                    <Link
                                        key={i}
                                        href={link.url || "#"}
                                        className={`px-3 md:px-4 py-2 text-xs md:text-sm font-medium rounded-xl transition-all duration-300 ${link.active
                                            ? "bg-gradient-to-br from-rose-400 to-rose-500 text-white shadow-md shadow-rose-200 border-rose-500"
                                            : "bg-white text-stone-600 border border-stone-200 hover:border-rose-300 hover:text-rose-500 hover:-translate-y-0.5 hover:shadow-sm"
                                            } ${!link.url && "opacity-50 cursor-not-allowed hover:translate-y-0 hover:shadow-none"}`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}