//resources\js\Components\Public\Footer.tsx
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
            <footer className="mt-6 pb-6 px-4 relative z-20">
                <div className="max-w-[100rem] mx-auto bg-white rounded-2xl border border-pink-100 shadow-sm px-5 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Icon
                                icon="solar:book-bookmark-bold-duotone"
                                className="w-5 h-5 text-pink-500"
                            />

                            <span className="font-serif font-black text-slate-800 text-sm">
                                Dr. Jorge Cleofas Bocobo Library
                            </span>

                            <span className="text-xs text-stone-400 hidden sm:inline">
                                - Gerona Municipal Library
                            </span>
                        </div>

                        <div className="flex items-center gap-5 text-xs font-bold text-stone-500">
                            <button
                                onClick={() => setContactOpen(true)}
                                className="hover:text-pink-500 transition flex items-center gap-1"
                            >
                                <Icon
                                    icon="solar:chat-round-dots-bold-duotone"
                                    className="w-4 h-4"
                                />
                                Contacts
                            </button>

                            <button
                                onClick={() => setLibraryCreditOpen(true)}
                                className="hover:text-pink-500 transition flex items-center gap-1"
                            >
                                <Icon
                                    icon="solar:medal-ribbons-star-bold"
                                    className="w-4 h-4"
                                />
                                LGU Credits
                            </button>

                            <button
                                onClick={() => setDevCreditOpen(true)}
                                className="hover:text-pink-500 transition flex items-center gap-1"
                            >
                                <Icon
                                    icon="solar:people-nearby-bold"
                                    className="w-4 h-4"
                                />
                                Library Team
                            </button>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-stone-400 font-bold">
                            <span>© {new Date().getFullYear()}</span>

                            <Link
                                href={route("login")}
                                className="opacity-20 hover:opacity-100 hover:text-pink-500 transition p-1"
                                title="Staff Login"
                            >
                                <Icon
                                    icon="solar:lock-keyhole-minimalistic-bold-duotone"
                                    className="w-4 h-4"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

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
