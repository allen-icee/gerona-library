// resources/js/Components/CustomSelect.tsx

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    error?: string;
    placeholder?: string;
}

export default function CustomSelect({
    value,
    onChange,
    options,
    error,
    placeholder = "Select...",
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        setSelectedIndex(options.indexOf(value));
    }, [value, options]);

    useEffect(() => {
        if (isOpen && listRef.current && selectedIndex >= 0) {
            const list = listRef.current;
            const element = list.children[selectedIndex] as HTMLElement;
            if (element) {
                const blockStart = list.scrollTop;
                const blockEnd = list.scrollTop + list.clientHeight;
                const elStart = element.offsetTop;
                const elEnd = element.offsetTop + element.clientHeight;

                if (elStart < blockStart) {
                    list.scrollTop = elStart;
                } else if (elEnd > blockEnd) {
                    list.scrollTop = elEnd - list.clientHeight;
                }
            }
        }
    }, [selectedIndex, isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            setIsOpen(true);
            return;
        }

        if (isOpen) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < options.length - 1 ? prev + 1 : prev
                );
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                return;
            }
            if (e.key === "Enter" && selectedIndex >= 0) {
                e.preventDefault();
                onChange(options[selectedIndex]);
                setIsOpen(false);
                return;
            }
            if (e.key === "Escape") {
                setIsOpen(false);
                return;
            }
        }
    };

    return (
        <div className="relative w-full">
            <div className="relative">
                <input
                    type="text"
                    className={`w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400 focus:ring-1 focus:ring-amber-400 cursor-pointer caret-transparent outline-none transition-all ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : ""
                        }`}
                    value={value || ""}
                    placeholder={placeholder}
                    onClick={() => setIsOpen(true)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    onKeyDown={handleKeyDown}
                    onChange={() => { }} // Readonly basically, handled by clicks
                    readOnly
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
                    <Icon
                        icon="solar:alt-arrow-down-bold"
                        className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                            }`}
                        width="18"
                    />
                </div>
            </div>

            {isOpen && (
                <ul
                    ref={listRef}
                    className="absolute z-50 w-full bg-white border border-stone-100 mt-1 max-h-48 overflow-y-auto shadow-lg rounded-xl text-sm py-1"
                >
                    {options.map((opt, index) => (
                        <li
                            key={opt}
                            className={`px-4 py-2.5 cursor-pointer text-slate-700 transition-colors ${index === selectedIndex
                                ? "bg-amber-50 text-amber-700 font-bold"
                                : "hover:bg-stone-50"
                                }`}
                            onMouseDown={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}