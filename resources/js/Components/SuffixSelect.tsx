//resources\js\Components\SuffixSelect.tsx
import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

interface Props {
    value: string;
    onChange: (value: string) => void;
    error?: string;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const SUFFIXES = ["", "JR.", "SR.", "I", "II", "III", "IV", "V"];

export default function SuffixSelect({ value, onChange, error, onKeyDown }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);

    useEffect(() => { setSelectedIndex(SUFFIXES.indexOf(value)); }, [value]);

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
        if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
            e.preventDefault();
            setIsOpen(true);
            return;
        }

        if (isOpen) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) => prev < SUFFIXES.length - 1 ? prev + 1 : prev);
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
            } else if (e.key === "Enter" && selectedIndex >= 0) {
                e.preventDefault();
                onChange(SUFFIXES[selectedIndex]);
                setIsOpen(false);
            } else if (e.key === "Escape") {
                setIsOpen(false);
            }
        }
        if (onKeyDown) onKeyDown(e);
    };

    return (
        <div className="relative">
            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">Suffix</label>
            <div className="relative">
                <input
                    type="text"
                    className={`w-full bg-stone-50 border-stone-200 text-slate-800 rounded-lg h-10 text-sm px-3 focus:ring-pink-500 focus:border-pink-500 cursor-pointer caret-transparent shadow-sm transition-all ${error ? "border-rose-500 focus:ring-rose-500" : ""}`}
                    value={value || "N/A"}
                    onClick={() => setIsOpen(true)}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    onKeyDown={handleKeyDown}
                    onChange={() => { }}
                    readOnly={false}
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
                    <Icon icon="solar:alt-arrow-down-bold" className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} width="18" />
                </div>
            </div>

            {isOpen && (
                <ul ref={listRef} className="absolute z-50 w-full bg-white border border-stone-100 mt-1 max-h-40 overflow-y-auto shadow-lg rounded-xl text-sm py-1">
                    {SUFFIXES.map((opt, index) => (
                        <li
                            key={opt}
                            className={`px-4 py-2.5 cursor-pointer text-slate-700 transition-colors ${index === selectedIndex ? "bg-pink-50 text-pink-600 font-bold" : "hover:bg-stone-50"}`}
                            onMouseDown={() => { onChange(opt); setIsOpen(false); }}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            {opt === "" ? "N/A" : opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}