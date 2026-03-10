import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
}

export default function SearchableSelect({
    value,
    onChange,
    options,
    placeholder = "Select an option...",
    disabled = false,
    error,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Keep the input text in sync if the parent changes the value (e.g., resetting the form or cascading clears)
    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    // Filter options based on what the user is typing
    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close the dropdown if the user clicks outside of it
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // If they clicked away without selecting, revert the text back to the actual saved value
                setSearchTerm(value);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value]);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full bg-stone-50 border-stone-200 text-slate-800 rounded-lg h-10 text-sm pl-3 pr-10 focus:ring-amber-500 focus:border-amber-500 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-rose-500 focus:ring-rose-500" : ""
                        }`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
                    <Icon
                        icon="solar:alt-arrow-down-bold"
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        width="16"
                    />
                </div>
            </div>

            {/* Custom Floating Dropdown Menu */}
            {isOpen && !disabled && (
                <ul className="absolute z-50 w-full bg-white border border-stone-100 mt-1 max-h-48 overflow-y-auto shadow-lg rounded-xl text-sm py-1 hide-scrollbar">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <li
                                key={opt}
                                onMouseDown={() => {
                                    onChange(opt);
                                    setSearchTerm(opt);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 cursor-pointer text-slate-700 transition-colors ${value === opt
                                        ? "bg-amber-50 text-amber-600 font-bold"
                                        : "hover:bg-stone-50"
                                    }`}
                            >
                                {opt}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-3 text-stone-400 italic text-center">
                            No matches found
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}