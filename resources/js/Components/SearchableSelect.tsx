// resources/js/Components/SearchableSelect.tsx

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { Icon } from "@iconify/react";

interface Props {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
    theme?: "amber" | "fuchsia" | "rose" | "pink";
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export default function SearchableSelect({
    id,
    value,
    onChange,
    options,
    placeholder = "Select an option...",
    disabled = false,
    error,
    theme = "amber",
    onKeyDown
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Matching the theme styles from CustomSelect.tsx
    const themeStyles = {
        amber: { focus: "focus:border-amber-400 focus:ring-amber-400", activeBg: "bg-amber-50 text-amber-700 font-bold", hoverBg: "hover:bg-amber-50/50 hover:text-amber-600" },
        fuchsia: { focus: "focus:border-fuchsia-500 focus:ring-fuchsia-500", activeBg: "bg-fuchsia-50 text-fuchsia-700 font-bold", hoverBg: "hover:bg-fuchsia-50/50 hover:text-fuchsia-600" },
        rose: { focus: "focus:border-rose-400 focus:ring-rose-400", activeBg: "bg-rose-50 text-rose-700 font-bold", hoverBg: "hover:bg-rose-50/50 hover:text-rose-600" },
        pink: { focus: "focus:border-pink-400 focus:ring-pink-400", activeBg: "bg-pink-50 text-pink-700 font-bold", hoverBg: "hover:bg-pink-50/50 hover:text-pink-600" },
    };

    const activeTheme = themeStyles[theme];

    useEffect(() => { setSearchTerm(value); }, [value]);

    const filteredOptions = options.filter((opt) => opt.toLowerCase().includes(searchTerm.toLowerCase()));

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value]);

    const openDropdown = () => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            setPlacement((window.innerHeight - rect.bottom < 220 && rect.top > 220) ? "top" : "bottom");
        }
        setIsOpen(true);
    };

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    id={id}
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        onChange(e.target.value); // Syncs state back to inertia form!
                        openDropdown();
                    }}
                    onFocus={openDropdown}
                    onKeyDown={onKeyDown}
                    disabled={disabled}
                    placeholder={placeholder}
                    // Base input styles synced with Register.tsx inputs + Dynamic Theme support
                    className={`w-full bg-stone-50 border border-stone-200 text-slate-800 rounded-xl h-12 pl-4 pr-10 text-sm shadow-sm transition-all focus:outline-none focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed ${activeTheme.focus} ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : ""}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-stone-400">
                    <Icon icon="solar:alt-arrow-down-bold" className={`transition-transform duration-200 ${isOpen ? (placement === "top" ? "" : "rotate-180") : ""}`} width="18" />
                </div>
            </div>

            {isOpen && !disabled && (
                <ul className={`absolute z-50 w-full bg-white border border-stone-100 max-h-48 overflow-y-auto shadow-xl shadow-stone-200/50 rounded-xl text-sm py-1 hide-scrollbar ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <li
                                key={opt}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange(opt);
                                    setSearchTerm(opt);
                                    setIsOpen(false);
                                    document.getElementById(id || "")?.focus();
                                }}
                                className={`px-4 py-2.5 cursor-pointer text-slate-700 transition-colors ${value === opt ? activeTheme.activeBg : `hover:bg-stone-50 ${activeTheme.hoverBg}`}`}
                            >
                                {opt}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 text-stone-400 italic text-center">No matches found</li>
                    )}
                </ul>
            )}
        </div>
    );
}