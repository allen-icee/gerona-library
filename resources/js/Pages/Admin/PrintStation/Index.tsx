import { useState } from "react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Head, useForm } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Printer, Download, CheckCircle, History } from "lucide-react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/Components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

interface PrintJob {
    filename: string;
    time_uploaded: string;
    visitor_name: string;
    school_or_barangay: string;
    paper_size: string;
    copies: string;
    original_name: string;
}

export default function PrintServices({
    printQueue = [],
    printLogs,
}: PageProps<{ printQueue: PrintJob[]; printLogs: any }>) {
    const [selectedJob, setSelectedJob] = useState<PrintJob | null>(null);

    const { data, setData, post, processing, reset } = useForm({
        filename: "",
        visitor_name: "",
        school_or_barangay: "",
        pages_printed: 1,
    });

    const openLogModal = (job: PrintJob) => {
        setSelectedJob(job);
        setData({
            filename: job.filename,
            visitor_name: job.visitor_name,
            school_or_barangay: job.school_or_barangay,
            pages_printed: 1,
        });
    };

    const submitPrintLog = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("print-queue.log"), {
            preserveScroll: true,
            onSuccess: () => {
                setSelectedJob(null);
                reset();
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Print Services" />

            <div className="max-w-7xl mx-auto space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">
                        Print Services
                    </h1>
                    <p className="text-stone-500 text-sm">
                        Manage incoming file drops and view printing history.
                    </p>
                </div>

                {/* Print Queue Section */}
                <Card className="shadow-sm border-stone-200">
                    <CardHeader className="bg-slate-900 text-white rounded-t-lg flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center text-lg">
                                <Printer className="w-5 h-5 mr-2 text-amber-500" />
                                Incoming Print Queue
                            </CardTitle>
                            <CardDescription className="text-slate-300 mt-1">
                                Files sent by students from the public station.
                            </CardDescription>
                        </div>
                        <div className="bg-amber-500 text-slate-900 font-bold px-3 py-1 rounded-full text-sm">
                            {printQueue.length} Pending
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {printQueue.length === 0 ? (
                            <div className="text-center py-12 text-stone-500">
                                <Printer className="w-12 h-12 mx-auto text-stone-300 mb-3" />
                                <p>The print queue is currently empty.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-stone-100">
                                {printQueue.map((job, index) => (
                                    <div
                                        key={index}
                                        className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-stone-50 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-bold text-stone-800 text-lg">
                                                {job.visitor_name}
                                            </h4>
                                            <p className="text-sm text-stone-500">
                                                {job.school_or_barangay} •
                                                Uploaded {job.time_uploaded}
                                            </p>

                                            <div className="mt-2 flex flex-wrap gap-2 items-center">
                                                <span className="text-sm font-mono bg-stone-100 text-stone-600 px-2 py-1 rounded inline-block truncate max-w-[250px]">
                                                    File: {job.original_name}
                                                </span>
                                                <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                    {job.paper_size}
                                                </span>
                                                <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2 py-1 rounded">
                                                    {job.copies} Copies
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 w-full md:w-auto">
                                            <a
                                                href={route(
                                                    "print-queue.download",
                                                    job.filename,
                                                )}
                                                className="flex items-center justify-center px-4 py-2 bg-white border border-stone-300 rounded-md text-sm font-medium text-stone-700 hover:bg-stone-50 hover:text-amber-600 transition-colors"
                                            >
                                                <Download className="w-4 h-4 mr-2" />{" "}
                                                Download File
                                            </a>
                                            <Button
                                                onClick={() =>
                                                    openLogModal(job)
                                                }
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white"
                                            >
                                                <CheckCircle className="w-4 h-4 mr-2" />{" "}
                                                Log & Clear
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Print History Logs */}
                <Card className="shadow-sm border-stone-200 mt-8">
                    <CardHeader className="bg-white border-b border-stone-100">
                        <CardTitle className="text-lg text-stone-800 flex items-center">
                            <History className="w-5 h-5 mr-2 text-stone-500" />{" "}
                            Historical Logs
                        </CardTitle>
                        <CardDescription>
                            Recently completed print services for LGU auditing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-stone-50">
                                <TableRow>
                                    <TableHead className="font-semibold text-stone-700">
                                        Visitor / Student
                                    </TableHead>
                                    <TableHead className="font-semibold text-stone-700">
                                        School / Barangay
                                    </TableHead>
                                    <TableHead className="font-semibold text-stone-700 text-center">
                                        Pages
                                    </TableHead>
                                    <TableHead className="font-semibold text-stone-700">
                                        Logged By
                                    </TableHead>
                                    <TableHead className="font-semibold text-stone-700">
                                        Date & Time
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {printLogs.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="h-32 text-center text-stone-500"
                                        >
                                            No print records logged yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    printLogs.data.map((log: any) => (
                                        <TableRow
                                            key={log.id}
                                            className="hover:bg-stone-50 transition-colors"
                                        >
                                            <TableCell className="font-medium text-slate-900">
                                                {log.visitor_name}
                                            </TableCell>
                                            <TableCell className="text-stone-600 text-sm">
                                                {log.school_or_barangay}
                                            </TableCell>
                                            <TableCell className="text-center font-bold text-stone-800">
                                                {log.pages_printed}
                                            </TableCell>
                                            <TableCell className="text-stone-600 text-sm">
                                                {log.logger?.name}
                                            </TableCell>
                                            <TableCell className="text-stone-500 text-sm">
                                                {new Date(
                                                    log.printed_at,
                                                ).toLocaleDateString([], {
                                                    month: "short",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Log Print Dialog */}
                <Dialog
                    open={!!selectedJob}
                    onOpenChange={(open) => !open && setSelectedJob(null)}
                >
                    <DialogContent className="sm:max-w-[425px] bg-white">
                        <DialogHeader>
                            <DialogTitle>Log Print Service</DialogTitle>
                            <DialogDescription>
                                Enter the total pages printed. This will save to
                                the history logs and clear the file from the
                                queue.
                            </DialogDescription>
                        </DialogHeader>
                        <form
                            onSubmit={submitPrintLog}
                            className="space-y-4 py-4"
                        >
                            <div className="space-y-2">
                                <Label
                                    htmlFor="pages_printed"
                                    className="text-stone-700 font-semibold"
                                >
                                    Total Pages Printed *
                                </Label>
                                <Input
                                    id="pages_printed"
                                    type="number"
                                    min="1"
                                    value={data.pages_printed}
                                    onChange={(e) =>
                                        setData(
                                            "pages_printed",
                                            parseInt(e.target.value),
                                        )
                                    }
                                    required
                                    autoFocus
                                />
                            </div>
                            <DialogFooter className="pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setSelectedJob(null)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-amber-600 hover:bg-amber-500 text-white"
                                >
                                    {processing
                                        ? "Processing..."
                                        : "Log Transaction"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
