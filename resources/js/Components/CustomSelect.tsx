// resources/js/Components/CustomSelect.tsx

import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

interface Props {
    id?: string;               // <-- Added ID
    nextElementId?: string;    // <-- Added this for Enter logic
    value: string;
    onChange: (value: string) => void;
    options: string[];
    error?: string;
    placeholder?: string;
    theme?: "amber" | "fuchsia" | "rose" | "pink";
}

export default function CustomSelect({
    id,
    nextElementId,
    value,
    onChange,
    options,
    error,
    placeholder = "Select...",
    theme = "amber",
}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);

    const themeStyles = {
        amber: { focus: "focus:border-amber-400 focus:ring-amber-400", icon: "text-amber-500", activeBg: "bg-amber-50 text-amber-700 font-bold" },
        fuchsia: { focus: "focus:border-fuchsia-500 focus:ring-fuchsia-500", icon: "text-fuchsia-500", activeBg: "bg-fuchsia-50 text-fuchsia-700 font-bold" },
        rose: { focus: "focus:border-rose-400 focus:ring-rose-400", icon: "text-rose-500", activeBg: "bg-rose-50 text-rose-700 font-bold" },
        pink: { focus: "focus:border-pink-400 focus:ring-pink-400", icon: "text-pink-500", activeBg: "bg-pink-50 text-pink-700 font-bold" },
    };

    const activeTheme = themeStyles[theme];

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

                if (elStart < blockStart) list.scrollTop = elStart;
                else if (elEnd > blockEnd) list.scrollTop = elEnd - list.clientHeight;
            }
        }
    }, [selectedIndex, isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // If closed and user presses Enter, jump to next field instead of opening
        if (!isOpen && e.key === "Enter") {
            e.preventDefault();
            if (nextElementId) document.getElementById(nextElementId)?.focus();
            return;
        }

        if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " ")) {
            e.preventDefault();
            setIsOpen(true);
            return;
        }

        if (isOpen) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => prev < options.length - 1 ? prev + 1 : prev);
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
                // Jump to next field after making a selection
                if (nextElementId) {
                    setTimeout(() => document.getElementById(nextElementId)?.focus(), 50);
                }
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
                    id={id} // <-- Applied ID here
                    type="text"
                    className={`w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm cursor-pointer caret-transparent outline-none transition-all focus:ring-1 ${activeTheme.focus} ${error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500" : ""}`}
                    value={value || ""}
                    placeholder={placeholder}
                    onClick={() => setIsOpen(!isOpen)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    onKeyDown={handleKeyDown}
                    onChange={() => { }}
                    readOnly
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
                    <Icon
                        icon="solar:alt-arrow-down-bold"
                        className={`transition-transform duration-200 ${isOpen ? `rotate-180 ${activeTheme.icon}` : ""}`}
                        width="18"
                    />
                </div>
            </div>

            {isOpen && options.length > 0 && (
                <ul
                    ref={listRef}
                    className="absolute z-50 w-full bg-white border border-stone-100 mt-1 max-h-48 overflow-y-auto shadow-lg rounded-xl text-sm py-1"
                >
                    {options.map((opt, index) => (
                        <li
                            key={opt}
                            className={`px-4 py-2.5 cursor-pointer text-slate-700 transition-colors ${index === selectedIndex || opt === value
                                ? activeTheme.activeBg
                                : "hover:bg-stone-50"
                                }`}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onChange(opt);
                                setIsOpen(false);
                                // Jump to next field on mouse click selection too
                                if (nextElementId) document.getElementById(nextElementId)?.focus();
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