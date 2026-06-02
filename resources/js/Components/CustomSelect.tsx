// resources/js/Components/CustomSelect.tsx
import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";

// 1. New type allows either simple strings OR value/label objects
export type SelectOption = string | { value: string; label: string };

interface Props {
    id?: string;
    nextElementId?: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[]; // 2. Accept the new flexible type
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
    const [placement, setPlacement] = useState<"top" | "bottom">("bottom");
    const listRef = useRef<HTMLUListElement>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const themeStyles = {
        amber: {
            focus: "focus:border-amber-400 focus:ring-amber-400",
            icon: "text-amber-500",
            activeBg: "bg-amber-50 text-amber-700 font-bold",
        },
        fuchsia: {
            focus: "focus:border-fuchsia-500 focus:ring-fuchsia-500",
            icon: "text-fuchsia-500",
            activeBg: "bg-fuchsia-50 text-fuchsia-700 font-bold",
        },
        rose: {
            focus: "focus:border-rose-400 focus:ring-rose-400",
            icon: "text-rose-500",
            activeBg: "bg-rose-50 text-rose-700 font-bold",
        },
        pink: {
            focus: "focus:border-pink-400 focus:ring-pink-400",
            icon: "text-pink-500",
            activeBg: "bg-pink-50 text-pink-700 font-bold",
        },
    };

    const activeTheme = themeStyles[theme];

    // 3. Helpers to extract data safely
    const getOptionValue = (opt: SelectOption) =>
        typeof opt === "string" ? opt : opt.value;
    const getOptionLabel = (opt: SelectOption) =>
        typeof opt === "string" ? opt : opt.label;

    useEffect(() => {
        const index = options.findIndex((opt) => getOptionValue(opt) === value);
        setSelectedIndex(index);
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
                else if (elEnd > blockEnd)
                    list.scrollTop = elEnd - list.clientHeight;
            }
        }
    }, [selectedIndex, isOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const openDropdown = () => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            if (window.innerHeight - rect.bottom < 220 && rect.top > 220) {
                setPlacement("top");
            } else {
                setPlacement("bottom");
            }
        }
        setIsOpen(!isOpen);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isOpen && e.key === "Enter") {
            e.preventDefault();
            if (nextElementId) document.getElementById(nextElementId)?.focus();
            return;
        }

        if (
            !isOpen &&
            (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === " ")
        ) {
            e.preventDefault();
            openDropdown();
            return;
        }

        if (isOpen) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelectedIndex((prev) =>
                    prev < options.length - 1 ? prev + 1 : prev,
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
                // 4. Send back only the string value
                onChange(getOptionValue(options[selectedIndex]));
                setIsOpen(false);
                if (nextElementId) {
                    setTimeout(
                        () => document.getElementById(nextElementId)?.focus(),
                        50,
                    );
                }
                return;
            }
            if (e.key === "Escape") {
                setIsOpen(false);
                return;
            }
        }
    };

    // 5. Determine what label to show in the closed input box
    const selectedOption = options.find((opt) => getOptionValue(opt) === value);
    const displayValue = selectedOption ? getOptionLabel(selectedOption) : "";

    return (
        <div ref={wrapperRef} className="relative w-full">
            <div className="relative">
                <input
                    id={id}
                    type="text"
                    className={`w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm cursor-pointer caret-transparent outline-none transition-all focus:ring-1 ${activeTheme.focus} ${
                        error
                            ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500"
                            : ""
                    }`}
                    value={displayValue || ""} // Use the friendly label here
                    placeholder={placeholder}
                    onClick={openDropdown}
                    onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                    onKeyDown={handleKeyDown}
                    onChange={() => {}}
                    readOnly
                />

                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-stone-400">
                    <Icon
                        icon="solar:alt-arrow-down-bold"
                        className={`transition-transform duration-200 ${isOpen ? (placement === "top" ? "" : "rotate-180") : ""}`}
                        width="18"
                    />
                </div>
            </div>

            {isOpen && options.length > 0 && (
                <ul
                    ref={listRef}
                    className={`absolute z-50 w-full bg-white border border-stone-100 max-h-48 overflow-y-auto shadow-lg rounded-xl text-sm py-1 ${
                        placement === "top"
                            ? "bottom-full mb-2"
                            : "top-full mt-2"
                    }`}
                >
                    {options.map((opt, index) => {
                        const optVal = getOptionValue(opt);
                        const optLbl = getOptionLabel(opt);
                        return (
                            <li
                                key={optVal} // React needs a unique key
                                className={`px-4 py-2.5 cursor-pointer text-slate-700 transition-colors ${
                                    index === selectedIndex || optVal === value
                                        ? activeTheme.activeBg
                                        : "hover:bg-stone-50"
                                }`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    onChange(optVal); // Send back only the string value
                                    setIsOpen(false);
                                    if (nextElementId)
                                        document
                                            .getElementById(nextElementId)
                                            ?.focus();
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                {optLbl}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
