// resources/js/Pages/Public/Catalog.tsx

import { FormEventHandler } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Input } from "@/Components/ui/input";
import CustomSelect from "@/Components/CustomSelect"; // Import our new dropdown

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    available_copies: number;
}

export default function Catalog({ books, filters = {}, categories = [] }: any) {
    const { data, setData, get } = useForm({
        search: filters.search || "",
        category: filters.category || "",
        available: filters.available || "",
        sort: filters.sort || "",
    });

    const handleSearch: FormEventHandler = (e) => {
        e.preventDefault();
        get(route("catalog.index"), { preserveState: true });
    };

    const applyFilters = () => {
        get(route("catalog.index"), { preserveState: true });
    };

    // Helper dictionaries for the Sort Select to map labels <-> values
    const sortValueMap: Record<string, string> = {
        "Default": "",
        "Title": "title",
        "Author": "author",
        "Newest": "newest",
    };
    const sortDisplayMap: Record<string, string> = {
        "": "Default",
        "title": "Title",
        "author": "Author",
        "newest": "Newest",
    };

    return (
        <PublicLayout>
            <Head title="Library Catalog" />

            <div className="flex flex-col gap-8">

                {/* HEADER (matching Print/Register style with bottom border) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-rose-100">

                    <div>
                        <div className="inline-flex items-center gap-2 text-rose-500 font-potta text-[10px] uppercase tracking-widest mb-1">
                            <Icon
                                icon="solar:book-bookmark-bold-duotone"
                                className="w-4 h-4"
                            />
                            Library Service
                        </div>

                        <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-800">
                            Browse <span className="text-rose-500">Catalog</span>
                        </h1>

                        <p className="text-sm text-stone-400 mt-1">
                            Showing {books.total || 0} items in our collection.
                        </p>
                    </div>

                    {/* SEARCH */}
                    <form
                        onSubmit={handleSearch}
                        className="w-full md:w-96 relative group"
                    >
                        <Input
                            value={data.search}
                            onChange={(e) => setData("search", e.target.value)}
                            placeholder="Search title, author, ISBN..."
                            className="h-12 pl-12 pr-4 rounded-xl border-2 border-rose-100 focus-visible:border-rose-400 focus-visible:ring-rose-400 text-sm bg-white shadow-sm"
                        />

                        <Icon
                            icon="solar:magnifer-bold-duotone"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-400"
                        />
                    </form>
                </div>

                {/* MAIN LAYOUT */}
                <div className="grid grid-cols-12 gap-8">

                    {/* LEFT COLUMN — SIDEBAR FILTERS */}
                    <aside className="col-span-12 lg:col-span-3">

                        <div className="bg-white rounded-2xl border border-rose-100 p-6 shadow-sm space-y-6">

                            <h3 className="font-black text-sm uppercase tracking-wider text-rose-500 flex items-center gap-2">
                                <Icon icon="solar:filter-bold-duotone" className="w-5 h-5" />
                                Filters
                            </h3>

                            {/* CATEGORY */}
                            <div>
                                <label className="text-xs font-bold uppercase text-stone-600 mb-2 block relative z-30">
                                    Category
                                </label>
                                <CustomSelect
                                    value={data.category || "All Categories"}
                                    onChange={(val) => setData("category", val === "All Categories" ? "" : val)}
                                    options={["All Categories", ...(categories || [])]}
                                    theme="rose"
                                />
                            </div>

                            {/* AVAILABILITY */}
                            <div>
                                <label className="text-xs font-bold uppercase text-stone-600 mb-2 block relative z-20">
                                    Availability
                                </label>
                                <CustomSelect
                                    value={data.available === "1" ? "Available Only" : "All"}
                                    onChange={(val) => setData("available", val === "Available Only" ? "1" : "")}
                                    options={["All", "Available Only"]}
                                    theme="rose"
                                />
                            </div>

                            {/* SORT */}
                            <div>
                                <label className="text-xs font-bold uppercase text-stone-600 mb-2 block relative z-10">
                                    Sort By
                                </label>
                                <CustomSelect
                                    value={sortDisplayMap[data.sort || ""]}
                                    onChange={(val) => setData("sort", sortValueMap[val])}
                                    options={["Default", "Title", "Author", "Newest"]}
                                    theme="rose"
                                />
                            </div>

                            <button
                                onClick={applyFilters}
                                className="w-full bg-rose-50 text-rose-600 font-bold text-sm py-3 rounded-xl hover:bg-rose-100 transition border border-rose-200 mt-2 shadow-sm"
                            >
                                Apply Filters
                            </button>

                        </div>
                    </aside>

                    {/* RIGHT COLUMN — BOOK GRID */}
                    <section className="col-span-12 lg:col-span-9">

                        {books.data.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-rose-200">

                                <Icon
                                    icon="solar:ghost-bold-duotone"
                                    className="w-16 h-16 text-rose-200 mx-auto mb-4"
                                />

                                <h3 className="text-xl font-black text-stone-700">
                                    No books found
                                </h3>

                                <p className="text-stone-400 text-sm mt-1">
                                    Try a different search or filter.
                                </p>

                            </div>
                        ) : (

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                                {books.data.map((book: Book) => (

                                    <div
                                        key={book.id}
                                        className="group flex flex-col cursor-pointer"
                                    >

                                        {/* COVER */}
                                        <div className="relative aspect-[2/3] bg-white rounded-xl overflow-hidden border border-rose-100 shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-300">

                                            {book.isbn ? (

                                                <img
                                                    src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (
                                                            e.target as HTMLImageElement
                                                        ).src =
                                                            "https://placehold.co/400x600/fff1f2/e11d48?text=No+Cover";
                                                    }}
                                                />

                                            ) : (

                                                <div className="w-full h-full flex items-center justify-center bg-rose-50">

                                                    <Icon
                                                        icon="solar:book-2-bold-duotone"
                                                        className="w-10 h-10 text-rose-200"
                                                    />

                                                </div>
                                            )}

                                            {/* AVAILABILITY BADGE */}
                                            <div className="absolute top-2 right-2">
                                                <div
                                                    className={`text-white text-[9px] px-2 py-1 rounded-md font-bold shadow-sm ${book.available_copies > 0
                                                        ? "bg-emerald-500"
                                                        : "bg-slate-700"
                                                        }`}
                                                >
                                                    {book.available_copies > 0
                                                        ? "IN"
                                                        : "OUT"}
                                                </div>
                                            </div>

                                        </div>

                                        {/* INFO */}
                                        <div className="mt-3 px-1">

                                            <p className="text-[10px] uppercase text-rose-500 font-bold mb-0.5 tracking-wider">
                                                {book.category}
                                            </p>

                                            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-rose-500 transition-colors">
                                                {book.title}
                                            </h3>

                                            <p className="text-xs text-stone-400 mt-1 line-clamp-1">
                                                {book.author}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                        {/* PAGINATION */}
                        {books.links && books.links.length > 3 && (

                            <div className="flex justify-center mt-12 gap-2 flex-wrap">

                                {books.links.map((link: any, i: number) => (

                                    <Link
                                        key={i}
                                        href={link.url || "#"}
                                        className={`px-4 py-2 text-sm font-medium rounded-lg transition ${link.active
                                            ? "bg-rose-500 text-white shadow-sm"
                                            : "bg-white text-stone-600 border border-stone-200 hover:border-rose-300 hover:text-rose-500"
                                            } ${!link.url && "opacity-50 cursor-not-allowed"}`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
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