import { useState } from "react";
import { Icon } from "@iconify/react";

interface Book {
    id: number;
    title: string;
    author: string;
    isbn: string;
    category: string;
    year_published: string;
    available_copies: number;
}

export default function BookCard({ book }: { book: Book }) {
    const [description, setDescription] = useState<string | null>(null);
    const [loadingDesc, setLoadingDesc] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [imageFailed, setImageFailed] = useState(false);
    const [source, setSource] = useState<string>("Local Record");

    // ENHANCED FETCH-ON-HOVER: Triple-Threat Waterfall Search
    const fetchDescription = async () => {
        if (hasFetched || !book.isbn) return;

        setLoadingDesc(true);
        setHasFetched(true);

        try {
            // ATTEMPT 1: Google Books by EXACT ISBN
            let res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${book.isbn}`);
            let data = await res.json();

            if (data.items && data.items[0].volumeInfo.description) {
                setDescription(data.items[0].volumeInfo.description);
                setSource("Google API (ISBN)");
                setLoadingDesc(false);
                return;
            }

            // ATTEMPT 2: Google Books by TITLE (Broader search if ISBN fails)
            // We encode the first few words of the title to find the "Work" instead of the specific "Edition"
            const cleanTitle = encodeURIComponent(book.title.split(' ').slice(0, 4).join(' '));
            res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${cleanTitle}`);
            data = await res.json();

            if (data.items) {
                // Find the first matching book that actually has a description attached to it
                const itemWithDesc = data.items.find((item: any) => item.volumeInfo.description);
                if (itemWithDesc) {
                    setDescription(itemWithDesc.volumeInfo.description);
                    setSource("Google API (Title)");
                    setLoadingDesc(false);
                    return;
                }
            }

            // ATTEMPT 3: OpenLibrary API Fallback
            res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${book.isbn}&jscmd=details&format=json`);
            data = await res.json();
            const olKey = `ISBN:${book.isbn}`;

            if (data[olKey] && data[olKey].details && data[olKey].details.description) {
                const desc = data[olKey].details.description;
                // OpenLibrary sometimes stores descriptions as objects, sometimes as strings
                setDescription(typeof desc === 'string' ? desc : desc.value);
                setSource("OpenLibrary API");
                setLoadingDesc(false);
                return;
            }

            // If ALL APIs fail (common for highly specific local textbooks)
            setDescription("No digital summary available for this specific local edition in global databases.");

        } catch (e) {
            setDescription("Could not load summary due to network error.");
        } finally {
            setLoadingDesc(false);
        }
    };

    const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg?default=false`;

    return (
        <div
            className="group flex flex-col cursor-pointer h-full relative"
            onMouseEnter={fetchDescription}
        >
            <div className="relative aspect-[2/3] bg-white rounded-xl overflow-hidden border border-rose-100 shadow-sm group-hover:shadow-xl group-hover:-translate-y-1.5 transition-all duration-300">

                {!imageFailed && book.isbn ? (
                    <img
                        src={coverUrl}
                        alt={`Cover for ${book.title}`}
                        className="w-full h-full object-cover"
                        onError={() => setImageFailed(true)}
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 p-4 text-center border-t-4 border-rose-300">
                        <Icon icon="solar:book-bookmark-bold-duotone" className="w-12 h-12 mb-3 text-rose-300 drop-shadow-sm" />
                        <h4 className="text-[11px] font-black text-rose-700 uppercase tracking-wider line-clamp-4 leading-relaxed">
                            {book.title}
                        </h4>
                    </div>
                )}

                {/* HOVER OVERLAY */}
                <div className="absolute inset-0 bg-stone-900/95 backdrop-blur-sm text-white p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col">
                    <h4 className="font-bold text-sm mb-2 line-clamp-2">{book.title}</h4>
                    <div className="flex-1 overflow-hidden relative">
                        {loadingDesc ? (
                            <div className="animate-pulse flex flex-col gap-2 mt-2">
                                <div className="h-2 bg-stone-700 rounded w-full"></div>
                                <div className="h-2 bg-stone-700 rounded w-5/6"></div>
                                <div className="h-2 bg-stone-700 rounded w-4/6"></div>
                            </div>
                        ) : (
                            <>
                                <p className="text-xs text-stone-300 line-clamp-6 leading-relaxed relative z-10">
                                    {description || (!book.isbn ? "No ISBN provided for this record." : "")}
                                </p>
                                <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-stone-900/95 to-transparent z-20"></div>
                            </>
                        )}
                    </div>
                    <div className="mt-auto pt-3 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-rose-400 border-t border-stone-700/50">
                        <span>{book.year_published || "N/A"}</span>
                        <span className="truncate max-w-[100px] text-right">{source}</span>
                    </div>
                </div>

                {/* STOCK BADGE */}
                <div className="absolute top-2 right-2 z-10">
                    <div className={`text-white text-[9px] px-2.5 py-1 rounded-md font-black shadow-md tracking-wider ${book.available_copies > 0 ? "bg-emerald-500" : "bg-slate-800"}`}>
                        {book.available_copies > 0 ? "AVAILABLE" : "BORROWED OUT"}
                    </div>
                </div>
            </div>

            <div className="mt-3 px-1 flex-1 flex flex-col">
                <p className="text-[10px] uppercase text-rose-500 font-bold mb-0.5 tracking-wider truncate">{book.category || "Uncategorized"}</p>
                <h3 className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-rose-600 transition-colors leading-tight">{book.title}</h3>
                <p className="text-xs text-stone-500 font-medium mt-1 line-clamp-1">{book.author}</p>
            </div>
        </div>
    );
}