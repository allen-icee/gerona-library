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
    onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
}

export default function SearchableSelect({
    id, value, onChange, options, placeholder = "Select an option...", disabled = false, error, onKeyDown
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
    const wrapperRef = useRef<HTMLDivElement>(null);

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
                    // EXACT MATCH to your Input component styling:
                    className={`w-full bg-white border border-pink-200 focus:border-pink-500 focus:ring-pink-500 focus-visible:ring-pink-500 focus-visible:outline-none text-slate-800 rounded-xl h-10 text-sm pl-3 pr-10 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-red-600 focus:ring-red-600" : ""}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
                    <Icon icon="solar:alt-arrow-down-bold" className={`transition-transform duration-200 ${isOpen ? (placement === "top" ? "" : "rotate-180") : ""}`} width="16" />
                </div>
            </div>

            {isOpen && !disabled && (
                <ul className={`absolute z-50 w-full bg-white border border-pink-100 max-h-48 overflow-y-auto shadow-xl shadow-stone-200/50 rounded-xl text-sm py-1 hide-scrollbar ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}>
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
                                className={`px-4 py-2.5 cursor-pointer text-slate-700 transition-colors ${value === opt ? "bg-pink-50 text-pink-600 font-bold" : "hover:bg-pink-50/50 hover:text-pink-600"}`}
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