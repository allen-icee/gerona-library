import { FormEventHandler } from "react";
import PublicLayout from "@/Layouts/PublicLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Input } from "@/Components/ui/input";

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    available_copies: number;
}

export default function Catalog({ books, filters, categories }: any) {
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

    return (
        <PublicLayout>
            <Head title="Library Catalog" />

            <div className="flex flex-col gap-8">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-pink-100">

                    <div>
                        <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-800">
                            Browse <span className="text-rose-500">Catalog</span>
                        </h1>

                        <p className="text-sm text-stone-400 mt-1">
                            Showing {books.total || 0} items in our collection
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
                            className="h-12 pl-12 pr-4 rounded-xl border-2 border-pink-100 focus:border-rose-300 text-sm"
                        />

                        <Icon
                            icon="solar:magnifer-bold-duotone"
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400"
                        />
                    </form>
                </div>

                {/* MAIN LAYOUT */}
                <div className="grid grid-cols-12 gap-8">

                    {/* SIDEBAR FILTERS */}
                    <aside className="col-span-12 lg:col-span-3">

                        <div className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm space-y-6">

                            <h3 className="font-black text-sm uppercase tracking-wider text-rose-500">
                                Filters
                            </h3>

                            {/* CATEGORY */}
                            <div>
                                <label className="text-xs font-bold uppercase text-stone-400">
                                    Category
                                </label>

                                <select
                                    value={data.category}
                                    onChange={(e) => {
                                        setData("category", e.target.value);
                                        applyFilters();
                                    }}
                                    className="w-full mt-1 border rounded-lg p-2 text-sm"
                                >
                                    <option value="">All Categories</option>

                                    {categories?.map((cat: string) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* AVAILABILITY */}
                            <div>
                                <label className="text-xs font-bold uppercase text-stone-400">
                                    Availability
                                </label>

                                <select
                                    value={data.available}
                                    onChange={(e) => {
                                        setData("available", e.target.value);
                                        applyFilters();
                                    }}
                                    className="w-full mt-1 border rounded-lg p-2 text-sm"
                                >
                                    <option value="">All</option>
                                    <option value="1">Available Only</option>
                                </select>
                            </div>

                            {/* SORT */}
                            <div>
                                <label className="text-xs font-bold uppercase text-stone-400">
                                    Sort By
                                </label>

                                <select
                                    value={data.sort}
                                    onChange={(e) => {
                                        setData("sort", e.target.value);
                                        applyFilters();
                                    }}
                                    className="w-full mt-1 border rounded-lg p-2 text-sm"
                                >
                                    <option value="">Default</option>
                                    <option value="title">Title</option>
                                    <option value="author">Author</option>
                                    <option value="newest">Newest</option>
                                </select>
                            </div>

                        </div>
                    </aside>

                    {/* BOOK GRID */}
                    <section className="col-span-12 lg:col-span-9">

                        {books.data.length === 0 ? (
                            <div className="text-center py-20">

                                <Icon
                                    icon="solar:ghost-bold-duotone"
                                    className="w-16 h-16 text-rose-200 mx-auto mb-4"
                                />

                                <h3 className="text-xl font-black text-stone-700">
                                    No books found
                                </h3>

                                <p className="text-stone-400 text-sm">
                                    Try a different search or filter.
                                </p>

                            </div>
                        ) : (

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">

                                {books.data.map((book: Book) => (

                                    <div
                                        key={book.id}
                                        className="group flex flex-col cursor-pointer"
                                    >

                                        {/* COVER */}
                                        <div className="aspect-[2/3] bg-white rounded-xl overflow-hidden border border-pink-100 shadow-sm group-hover:shadow-md transition">

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

                                            {/* AVAILABILITY */}
                                            <div className="absolute top-2 right-2">

                                                <div
                                                    className={`text-white text-[9px] px-2 py-1 rounded-md font-bold ${
                                                        book.available_copies > 0
                                                            ? "bg-emerald-500"
                                                            : "bg-gray-700"
                                                    }`}
                                                >
                                                    {book.available_copies > 0
                                                        ? "IN"
                                                        : "OUT"}
                                                </div>

                                            </div>

                                        </div>

                                        {/* INFO */}
                                        <div className="mt-3">

                                            <p className="text-[10px] uppercase text-rose-400 font-bold">
                                                {book.category}
                                            </p>

                                            <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-rose-500">
                                                {book.title}
                                            </h3>

                                            <p className="text-xs text-stone-400">
                                                {book.author}
                                            </p>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                        {/* PAGINATION */}
                        {books.links && (

                            <div className="flex justify-center mt-12 gap-2 flex-wrap">

                                {books.links.map((link: any, i: number) => (

                                    <Link
                                        key={i}
                                        href={link.url || "#"}
                                        className={`px-4 py-2 text-xs rounded-lg ${
                                            link.active
                                                ? "bg-rose-500 text-white"
                                                : "bg-white border hover:border-rose-300"
                                        }`}
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