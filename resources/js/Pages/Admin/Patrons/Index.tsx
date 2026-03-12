// resources/js/Pages/Admin/Patrons/Index.tsx

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom"; // <-- Imported React Portal!
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Input } from "@/Components/ui/input";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import * as htmlToImage from "html-to-image";

import AddPatronModal from "./Partials/AddPatronModal";
import PatronsTable from "./Partials/PatronTables";
import LibraryCard from "@/Components/LibraryCard";

export default function PatronIndex({
    patrons,
    filters,
}: PageProps<{ patrons: any; filters: { search?: string } }>) {
    const [search, setSearch] = useState(filters.search || "");
    const [patronToPrint, setPatronToPrint] = useState<any>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Debounced Search
    useEffect(() => {
        const delayBounceFn = setTimeout(() => {
            if (search !== filters.search) {
                router.get(
                    route("patrons.index"),
                    { search },
                    { preserveState: true, replace: true },
                );
            }
        }, 500);
        return () => clearTimeout(delayBounceFn);
    }, [search]);

    // Generate Photo Logic
    const downloadPhoto = async () => {
        if (!cardRef.current) return;

        try {
            toast.loading("Capturing high-res photo...", { id: "generate-id" });

            const dataUrl = await htmlToImage.toPng(cardRef.current, {
                pixelRatio: 4, // Max sharpness
                backgroundColor: 'transparent',
                skipFonts: false,
            });

            const link = document.createElement("a");
            link.download = `${patronToPrint.library_card_number}_LibraryCard.png`;
            link.href = dataUrl;
            link.click();

            toast.success("ID photo saved perfectly!", { id: "generate-id" });
        } catch (error) {
            console.error("Image generation failed:", error);
            toast.error("Failed to generate photo. Check console.", { id: "generate-id" });
        }
    };

    return (
        <AdminLayout>
            <Head title="Patron Registry" />

            <div className="max-w-full space-y-6">
                {/* COMPACT HEADER */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-2xl border border-fuchsia-100 shadow-sm shadow-fuchsia-100/50">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-md shadow-fuchsia-200 text-white">
                            <Icon icon="solar:users-group-two-rounded-bold-duotone" className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">
                                Patron Registry
                            </h1>
                            <p className="text-slate-500 text-xs font-medium mt-1">
                                Manage library borrowers and their access status.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full lg:w-auto items-center gap-3">
                        <div className="relative w-full sm:w-72">
                            <Icon icon="solar:magnifer-linear" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <Input
                                placeholder="Search name or card..."
                                className="pl-9 h-10 bg-stone-50 border-stone-200 focus-visible:ring-fuchsia-500 rounded-xl text-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <a
                            href={route("patrons.export")}
                            className="inline-flex items-center justify-center h-10 px-4 w-full sm:w-auto text-xs font-bold transition-all bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-500 hover:text-white rounded-xl border border-fuchsia-200 shadow-sm group whitespace-nowrap"
                        >
                            <Icon icon="solar:download-square-bold-duotone" className="w-4 h-4 mr-2 group-hover:-translate-y-0.5 transition-transform" />
                            Export CSV
                        </a>

                        <AddPatronModal />
                    </div>
                </div>

                {/* DATA TABLE */}
                <PatronsTable patrons={patrons} onPrint={setPatronToPrint} />
            </div>

            {/* PORTALED PHOTO PREVIEW MODAL */}
            {/* This completely bypasses the AdminLayout stacking issues */}
            {patronToPrint && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">

                    <div className="bg-stone-50 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 md:p-8 flex flex-col items-center">

                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                    <Icon icon="solar:gallery-bold-duotone" className="w-8 h-8" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Save ID Photo</h2>
                                <p className="text-slate-500 text-xs mt-2 leading-relaxed max-w-[250px] mx-auto">
                                    Download a perfectly cropped, high-resolution PNG image ready for ID badge software.
                                </p>
                            </div>

                            {/* The Card */}
                            <div className="shadow-2xl shadow-rose-900/15 rounded-md mb-8 ring-1 ring-slate-900/5">
                                <div ref={cardRef} className="bg-white overflow-hidden rounded-md">
                                    <LibraryCard patron={patronToPrint} />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setPatronToPrint(null)}
                                    className="flex-1 py-3 bg-white border border-stone-200 text-stone-600 text-sm font-bold rounded-xl hover:bg-stone-100 hover:text-stone-800 transition-colors shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={downloadPhoto}
                                    className="flex-1 py-3 bg-rose-500 text-white text-sm font-bold rounded-xl shadow-md shadow-rose-500/30 hover:bg-rose-600 hover:shadow-rose-600/40 transition-all flex items-center justify-center gap-2"
                                >
                                    <Icon icon="solar:download-square-bold-duotone" className="w-5 h-5" />
                                    Save as PNG
                                </button>
                            </div>

                        </div>
                    </div>
                </div>,
                document.body // <-- Attaches it directly to the HTML body!
            )}
        </AdminLayout>
    );
}