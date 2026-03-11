import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

interface Props {
    id?: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder?: string;
    disabled?: boolean;
    error?: string;
}

export default function SearchableSelect({
    id,
    value,
    onChange,
    options,
    placeholder = "Select an option...",
    disabled = false,
    error,
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm(value);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [value]);

    const openDropdown = () => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            // Auto-flip upwards if there is no space below
            if (window.innerHeight - rect.bottom < 220 && rect.top > 220) {
                setPlacement("top");
            } else {
                setPlacement("bottom");
            }
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
                        openDropdown();
                    }}
                    onFocus={openDropdown}
                    disabled={disabled}
                    placeholder={placeholder}
                    className={`w-full bg-stone-50 border-stone-200 text-slate-800 rounded-lg h-10 text-sm pl-3 pr-10 focus:ring-amber-500 focus:border-amber-500 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-rose-500 focus:ring-rose-500" : ""}`}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
                    <Icon
                        icon="solar:alt-arrow-down-bold"
                        className={`transition-transform duration-200 ${isOpen ? (placement === "top" ? "" : "rotate-180") : ""}`}
                        width="16"
                    />
                </div>
            </div>

            {isOpen && !disabled && (
                <ul className={`absolute z-50 w-full bg-white border border-stone-100 max-h-48 overflow-y-auto shadow-lg rounded-xl text-sm py-1 hide-scrollbar ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"
                    }`}>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((opt) => (
                            <li
                                key={opt}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange(opt);
                                    setSearchTerm(opt);
                                    setIsOpen(false);
                                }}
                                className={`px-4 py-2.5 cursor-pointer text-slate-700 transition-colors ${value === opt ? "bg-amber-50 text-amber-600 font-bold" : "hover:bg-stone-50"}`}
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