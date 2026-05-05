// resources/js/Components/BookCard.tsx

import { Icon } from "@iconify/react";
import BookCover from "./BookCover";

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

export default function BookCard({ book }: { book: Book }) {
    return (
        <div className="group flex flex-col cursor-pointer h-full relative">
            <div className="relative aspect-[2/3] bg-white rounded-xl overflow-hidden border border-rose-100 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1.5 transition-all duration-300">
                <BookCover coverUrl={book.cover_url} title={book.title} />

                <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-sm text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col">
                    <h4 className="font-bold text-sm mb-2 line-clamp-2">
                        {book.title}
                    </h4>
                    <div className="flex-1 overflow-hidden relative">
                        <p className="text-xs text-stone-300 line-clamp-6 leading-relaxed relative z-10">
                            {book.description ||
                                "No digital summary available for this book in the database."}
                        </p>
                        <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-stone-900/95 to-transparent z-20"></div>
                    </div>
                    <div className="mt-auto pt-3 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-rose-400 border-t border-stone-700/50">
                        <span>{book.year_published || "N/A"}</span>
                        <span className="truncate max-w-[100px] text-right">
                            Database Record
                        </span>
                    </div>
                </div>

                <div className="absolute top-2 right-2 z-10">
                    <div
                        className={`text-white text-[9px] px-2.5 py-1 rounded-md font-black shadow-md tracking-wider ${book.available_copies > 0 ? "bg-emerald-500" : "bg-slate-800"}`}
                    >
                        {book.available_copies > 0
                            ? "AVAILABLE"
                            : "BORROWED OUT"}
                    </div>
                </div>
            </div>

            <div className="mt-3 px-1 flex-1 flex flex-col">
                <p className="text-[10px] uppercase text-rose-500 font-bold mb-0.5 tracking-wider truncate">
                    {book.category || "Uncategorized"}
                </p>
                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-rose-600 transition-colors leading-tight">
                    {book.title}
                </h3>
                <p className="text-xs text-stone-500 font-medium mt-1 line-clamp-1">
                    {book.author}
                </p>
            </div>
        </div>
    );
}
