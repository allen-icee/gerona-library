import { useState, useEffect } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Input } from "@/Components/ui/input";
import { Search } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

import AddPatronModal from "./Partials/AddPatronModal";
import PatronActions from "./Partials/PatronActions";

export default function PatronIndex({
    patrons,
    filters,
}: PageProps<{ patrons: any; filters: { search?: string } }>) {
    const [search, setSearch] = useState(filters.search || "");

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

    return (
        <AdminLayout>
            <Head title="Patron Registry" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Area */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-stone-800">
                            Patron Registry
                        </h1>
                        <p className="text-stone-500 text-sm">
                            Manage library borrowers and their access status.
                        </p>
                    </div>

                    <div className="flex w-full sm:w-auto items-center gap-3">
                        <div className="relative w-full sm:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                            <Input
                                placeholder="Search name, card, or school..."
                                className="pl-9 bg-white border-stone-300"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        <AddPatronModal />
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-stone-50">
                            <TableRow>
                                <TableHead className="font-semibold text-stone-700">
                                    Card Number
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    Name
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    Type
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700">
                                    School/Barangay
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700 text-center">
                                    Status
                                </TableHead>
                                <TableHead className="font-semibold text-stone-700 w-[80px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patrons.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="h-32 text-center text-stone-500"
                                    >
                                        No patrons found in the registry.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                patrons.data.map((patron: any) => (
                                    <TableRow
                                        key={patron.id}
                                        className={`hover:bg-stone-50 transition-colors ${patron.status === "Suspended" ? "opacity-60" : ""}`}
                                    >
                                        <TableCell className="font-mono text-slate-900 text-sm">
                                            {patron.library_card_number}
                                        </TableCell>
                                        <TableCell className="font-medium text-slate-900">
                                            {patron.first_name}{" "}
                                            {patron.last_name}
                                        </TableCell>
                                        <TableCell className="text-stone-600">
                                            {patron.type}
                                        </TableCell>
                                        <TableCell className="text-stone-500 text-sm">
                                            {patron.school_or_barangay}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${patron.status === "Active" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"}`}
                                            >
                                                {patron.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <PatronActions patron={patron} />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination Controls */}
                {patrons.total > 15 && (
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-stone-500">
                            Showing{" "}
                            <span className="font-medium">{patrons.from}</span>{" "}
                            to <span className="font-medium">{patrons.to}</span>{" "}
                            of{" "}
                            <span className="font-medium">{patrons.total}</span>{" "}
                            patrons
                        </p>
                        <div className="flex gap-1">
                            {patrons.links.map((link: any, index: number) => (
                                <button
                                    key={index}
                                    onClick={() =>
                                        link.url &&
                                        router.get(
                                            link.url,
                                            { search },
                                            { preserveState: true },
                                        )
                                    }
                                    disabled={!link.url || link.active}
                                    className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                                        link.active
                                            ? "bg-amber-600 text-white border-amber-600"
                                            : !link.url
                                              ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                                              : "bg-white text-stone-700 border-stone-300 hover:bg-stone-50"
                                    }`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label,
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
