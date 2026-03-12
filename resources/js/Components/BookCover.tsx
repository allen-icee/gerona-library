// resources/js/Components/BookCover.tsx

import { useState } from "react";
import { Icon } from "@iconify/react";

interface Props {
    isbn?: string;
    title: string;
}

export default function BookCover({ isbn, title }: Props) {
    const [attempt, setAttempt] = useState(0);

    // If there is no ISBN at all, immediately show the beautiful CSS fallback
    if (!isbn) {
        return <FallbackCover title={title} />;
    }

    // The API Waterfall: It will try these in order until one works.
    const imageSources = [
        // 1st Priority: OpenLibrary (High quality). `default=false` forces a 404 error if missing, preventing the "white space" bug.
        `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`,

        // 2nd Priority: Google Books API (Great fallback for newer books)
        `https://books.google.com/books/content?vid=isbn:${isbn}&printsec=frontcover&img=1&zoom=1`
    ];

    // If all APIs fail (attempt count exceeds our sources), show the CSS fallback
    if (attempt >= imageSources.length) {
        return <FallbackCover title={title} />;
    }

    return (
        <img
            src={imageSources[attempt]}
            alt={`Cover for ${title}`}
            className="w-full h-full object-cover bg-white transition-opacity duration-300"
            // If the current image fails to load, increment the attempt counter to try the next API in the array!
            onError={() => setAttempt((prev) => prev + 1)}
        />
    );
}

// A sleek, dynamic CSS fallback that displays the actual book title instead of just saying "No Cover"
function FallbackCover({ title }: { title: string }) {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 p-4 text-center border-t-4 border-rose-300">
            <Icon icon="solar:book-bookmark-bold-duotone" className="w-10 h-10 mb-3 text-rose-300 drop-shadow-sm" />
            <h4 className="text-[11px] font-black text-rose-700 uppercase tracking-wider line-clamp-4 leading-relaxed">
                {title}
            </h4>
        </div>
    );
}