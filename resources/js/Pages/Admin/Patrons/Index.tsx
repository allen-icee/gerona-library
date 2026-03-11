// resources/js/Pages/Admin/Patrons/Index.tsx

import { useState, useEffect, useRef } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Input } from "@/Components/ui/input";
import { Icon } from "@iconify/react";
import { toast } from "sonner"; // For notifications
import html2canvas from "html2canvas"; // Add this!

import AddPatronModal from "./Partials/AddPatronModal";
import PatronsTable from "./Partials/PatronTables";
import LibraryCard from "@/Components/LibraryCard";

export default function PatronIndex({
    patrons,
    filters,
}: PageProps<{ patrons: any; filters: { search?: string } }>) {
    const [search, setSearch] = useState(filters.search || "");
    const [patronToPrint, setPatronToPrint] = useState<any>(null);
    const cardRef = useRef<HTMLDivElement>(null); // Ref to target the card

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

    // NEW LOGIC: Captures the card and downloads it as a PNG
    useEffect(() => {
        if (patronToPrint && cardRef.current) {
            // Give React a tiny moment to render the patron data into the off-screen card
            const captureTimeout = setTimeout(async () => {
                try {
                    toast.loading("Generating ID photo...", { id: "generate-id" });

                    const canvas = await html2canvas(cardRef.current!, {
                        scale: 3, // High resolution
                        useCORS: true, // Allows external images/fonts to load
                        backgroundColor: null, // Keeps rounded corners transparent
                    });

                    // Create a virtual link and trigger the download
                    const image = canvas.toDataURL("image/png");
                    const link = document.createElement("a");
                    link.href = image;
                    link.download = `${patronToPrint.library_card_number}_LibraryCard.png`;
                    link.click();

                    toast.success("ID photo saved successfully!", { id: "generate-id" });
                } catch (error) {
                    toast.error("Failed to generate ID photo.", { id: "generate-id" });
                } finally {
                    setPatronToPrint(null);
                }
            }, 300);

            return () => clearTimeout(captureTimeout);
        }
    }, [patronToPrint]);

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

            {/* OFF-SCREEN RENDER CONTAINER */}
            {/* We position it way off-screen instead of "hidden" because html2canvas cannot read "display: none" elements */}
            {patronToPrint && (
                <div className="fixed top-[-10000px] left-[-10000px]">
                    <div ref={cardRef}>
                        <LibraryCard patron={patronToPrint} />
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}