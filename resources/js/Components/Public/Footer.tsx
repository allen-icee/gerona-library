import { useState } from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import ContactModal from "./Modals/ContactModal";
import LibraryCreditModal from "./Modals/LibraryCreditModal";
import DevCreditModal from "./Modals/DevCreditModal";

export default function Footer() {
    const [isContactOpen, setContactOpen] = useState(false);
    const [isLibraryCreditOpen, setLibraryCreditOpen] = useState(false);
    const [isDevCreditOpen, setDevCreditOpen] = useState(false);

    return (
        <>
            <footer className="mt-16 pb-8 px-4 relative z-20">
                <div className="max-w-6xl mx-auto bg-white rounded-[2rem] p-8 shadow-sm border border-pink-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Left: Branding */}
                    <div className="flex items-center gap-3">
                        <div className="bg-pink-100 p-2.5 rounded-2xl">
                            <Icon
                                icon="solar:book-bookmark-bold-duotone"
                                className="w-6 h-6 text-pink-500"
                            />
                        </div>
                        <div>
                            <h3 className="font-serif font-black text-slate-800 text-lg leading-tight">
                                Gerona Library
                            </h3>
                            <p className="text-xs text-stone-400 font-medium">
                                Read. Discover. Grow.
                            </p>
                        </div>
                    </div>

                    {/* Middle: Interactive Links */}
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setContactOpen(true)}
                            className="text-sm font-bold text-stone-500 hover:text-pink-500 transition-colors"
                        >
                            Ask Us
                        </button>
                        <button
                            onClick={() => setLibraryCreditOpen(true)}
                            className="text-sm font-bold text-stone-500 hover:text-pink-500 transition-colors"
                        >
                            About LGU
                        </button>
                        <button
                            onClick={() => setDevCreditOpen(true)}
                            className="text-sm font-bold text-stone-500 hover:text-pink-500 transition-colors"
                        >
                            Developers
                        </button>
                    </div>

                    {/* Right: Discrete Login & Copyright */}
                    <div className="flex items-center gap-2 text-stone-400 text-xs font-bold">
                        <span>© 2026</span>
                        {/* DISCRETE STAFF LOGIN - Looks like a tiny decorative dot/icon! */}
                        <Link
                            href={route("login")}
                            className="opacity-20 hover:opacity-100 hover:text-pink-500 transition-all ml-1 p-1"
                        >
                            <Icon
                                icon="solar:lock-keyhole-minimalistic-bold-duotone"
                                className="w-4 h-4"
                            />
                        </Link>
                    </div>
                </div>
            </footer>

            {/* Render Footer's Modals */}
            <ContactModal isOpen={isContactOpen} onClose={setContactOpen} />
            <LibraryCreditModal
                isOpen={isLibraryCreditOpen}
                onClose={setLibraryCreditOpen}
            />
            <DevCreditModal
                isOpen={isDevCreditOpen}
                onClose={setDevCreditOpen}
            />
        </>
    );
}
