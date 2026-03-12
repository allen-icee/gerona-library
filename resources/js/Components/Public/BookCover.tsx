// resources/js/Components/BookCover.tsx

import { useState } from "react";
import { Icon } from "@iconify/react";

interface Props {
    coverUrl?: string | null;
    title: string;
}

export default function BookCover({ coverUrl, title }: Props) {
    const [imageError, setImageError] = useState(false);

    // If there is no cover URL at all, or the image failed to load (404), show fallback
    if (!coverUrl || imageError) {
        return <FallbackCover title={title} />;
    }

    return (
        <img
            src={coverUrl}
            alt={`Cover for ${title}`}
            className="w-full h-full object-cover bg-white transition-opacity duration-300"
            // If the image link is dead, this triggers and shows the CSS fallback instead
            onError={() => setImageError(true)}
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