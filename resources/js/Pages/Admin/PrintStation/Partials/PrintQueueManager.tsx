//resources\js\Pages\Admin\PrintStation\Partials\PrintQueueManager.tsx
import { useState, useMemo } from "react";
import { useForm, router } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { PrintJob } from "../Index";

interface GroupedPrintJob {
    visitor_name: string;
    school_or_barangay: string;
    time_uploaded: string;
    jobs: PrintJob[];
}

const TailwindCheckbox = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <label className="flex items-center cursor-pointer relative">
        <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
        <div className="w-5 h-5 rounded-lg border-2 border-pink-300 bg-white peer-checked:bg-pink-500 peer-checked:border-pink-500 flex items-center justify-center transition-all">
            <svg className={`w-3.5 h-3.5 text-white ${checked ? 'block' : 'hidden'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </div>
    </label>
);

export default function PrintQueueManager({ queue }: { queue: PrintJob[] }) {

    const groupedQueue = useMemo(() => {
        const groups: Record<string, GroupedPrintJob> = {};
        queue.forEach((job) => {
            const key = job.visitor_name;
            if (!groups[key]) {
                groups[key] = {
                    visitor_name: job.visitor_name,
                    school_or_barangay: job.school_or_barangay,
                    time_uploaded: job.time_uploaded,
                    jobs: [],
                };
            }
            groups[key].jobs.push(job);
        });
        return Object.values(groups);
    }, [queue]);

    const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
    const [logModalOpen, setLogModalOpen] = useState(false);
    const [discardModalOpen, setDiscardModalOpen] = useState(false);
    const [activeJobs, setActiveJobs] = useState<PrintJob[]>([]);

    const { data, setData, post, processing, reset } = useForm({
        filenames: [] as string[],
        visitor_name: "",
        school_or_barangay: "",
        pages_printed: 1,
    });

    const isGroupSelected = (jobs: PrintJob[]) => jobs.length > 0 && jobs.every(j => selectedFiles.includes(j.filename));

    const handleSelectGroup = (jobs: PrintJob[]) => {
        if (isGroupSelected(jobs)) {
            setSelectedFiles(prev => prev.filter(f => !jobs.find(j => j.filename === f)));
        } else {
            const newFiles = jobs.map(j => j.filename).filter(f => !selectedFiles.includes(f));
            setSelectedFiles(prev => [...prev, ...newFiles]);
        }
    };

    const handleSelectFile = (filename: string) => {
        setSelectedFiles(prev => prev.includes(filename) ? prev.filter(f => f !== filename) : [...prev, filename]);
    };

    const openLogModal = (jobs: PrintJob[], visitor_name: string, school_or_barangay: string) => {
        const toLog = jobs.filter(j => selectedFiles.includes(j.filename));
        if (toLog.length === 0) return;
        setActiveJobs(toLog);
        const estimatedPapers = toLog.reduce((total, job) => total + (Number(job.copies) || 1), 0);

        setData({
            filenames: toLog.map(j => j.filename),
            visitor_name,
            school_or_barangay,
            pages_printed: estimatedPapers,
        });
        setLogModalOpen(true);
    };

    const openDiscardModal = (jobs: PrintJob[]) => {
        const toDiscard = jobs.filter(j => selectedFiles.includes(j.filename));
        if (toDiscard.length === 0) return;
        setActiveJobs(toDiscard);
        setDiscardModalOpen(true);
    };

    const submitPrintLog = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        post(route("print-queue.log"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Log saved and queue cleared!");
                setLogModalOpen(false);
                setSelectedFiles(prev => prev.filter(f => !activeJobs.find(j => j.filename === f)));
                reset();
            },
            onError: () => {
                toast.error("Failed to save log. Please check your inputs.");
            }
        });
    };

    const confirmDiscard = () => {
        router.delete(route("print-queue.destroy"), {
            data: { filenames: activeJobs.map(j => j.filename) },
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Files discarded successfully!");
                setDiscardModalOpen(false);
                setSelectedFiles(prev => prev.filter(f => !activeJobs.find(j => j.filename === f)));
            },
            onError: () => {
                toast.error("Failed to discard files.");
            }
        });
    };

    return (
        <div className="space-y-4">

            <div className="flex items-center gap-2 mb-2">
                <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <Icon icon="solar:inbox-in-bold-duotone" className="w-5 h-5 mr-2 text-pink-500" />
                    Incoming Queue
                </h2>
                <span className="bg-pink-100 text-pink-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {queue.length} Files
                </span>
            </div>

            {groupedQueue.length === 0 ? (
                <div className="border-dashed border-2 border-pink-200 bg-pink-50/50 rounded-2xl flex flex-col items-center justify-center py-16 text-pink-400">
                    <Icon icon="solar:ghost-smile-bold-duotone" className="w-12 h-12 mb-3 text-pink-300" />
                    <p className="text-sm font-bold text-slate-600">All caught up!</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {groupedQueue.map((group) => {
                        const groupSelectedCount = group.jobs.filter(j => selectedFiles.includes(j.filename)).length;

                        return (
                            <div key={group.visitor_name} className="bg-white border border-pink-100 shadow-sm shadow-pink-100/50 rounded-xl overflow-hidden">

                                <div className="bg-pink-50/50 border-b border-pink-100 px-4 py-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <TailwindCheckbox checked={isGroupSelected(group.jobs)} onChange={() => handleSelectGroup(group.jobs)} />
                                        <div>
                                            <h3 className="font-bold text-slate-800 text-sm leading-none">{group.visitor_name}</h3>
                                            <p className="text-[11px] text-slate-500 mt-1 font-medium">
                                                {group.school_or_barangay} • {group.time_uploaded}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            disabled={groupSelectedCount === 0}
                                            onClick={() => openDiscardModal(group.jobs)}
                                            className="h-8 px-3 text-xs font-bold rounded-lg border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-50 flex items-center transition-colors"
                                        >
                                            <Icon icon="solar:trash-bin-trash-bold" className="w-3.5 h-3.5 mr-1.5" /> Discard
                                        </button>
                                        <button
                                            disabled={groupSelectedCount === 0}
                                            onClick={() => openLogModal(group.jobs, group.visitor_name, group.school_or_barangay)}
                                            className="h-8 px-3 text-xs font-bold rounded-lg bg-linear-to-r from-pink-400 to-pink-500 text-white shadow-md shadow-pink-200 hover:from-pink-500 hover:to-pink-600 disabled:opacity-50 flex items-center transition-all"
                                        >
                                            <Icon icon="solar:check-read-bold-duotone" className="w-4 h-4 mr-1.5" /> Log & Clear
                                        </button>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm whitespace-nowrap">
                                        <thead className="bg-white border-b border-stone-100 text-[10px] uppercase text-stone-400 font-bold tracking-wider">
                                            <tr>
                                                <th className="px-4 py-2 w-10"></th>
                                                <th className="px-4 py-2">Document Name</th>
                                                <th className="px-4 py-2">Size</th>
                                                <th className="px-4 py-2">Pages</th>
                                                <th className="px-4 py-2 text-center">Copies</th>
                                                <th className="px-4 py-2 text-right">File</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-stone-50">
                                            {group.jobs.map((job) => (
                                                <tr key={job.filename} className="hover:bg-pink-50/30 transition-colors">
                                                    <td className="px-4 py-2.5">
                                                        <TailwindCheckbox checked={selectedFiles.includes(job.filename)} onChange={() => handleSelectFile(job.filename)} />
                                                    </td>
                                                    <td className="px-4 py-2.5">
                                                        <div className="flex items-center gap-2 text-slate-700 font-semibold max-w-50 truncate">
                                                            <Icon icon="solar:document-text-bold-duotone" className="w-4 h-4 text-pink-400 shrink-0" />
                                                            <span className="truncate" title={job.original_name}>{job.original_name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-xs text-slate-500">{job.paper_size}</td>
                                                    <td className="px-4 py-2.5 text-xs text-slate-500">{job.pages || "All"}</td>
                                                    <td className="px-4 py-2.5 text-center">
                                                        <span className="bg-pink-100 text-pink-700 px-2 py-0.5 rounded text-[10px] font-black">x{job.copies}</span>
                                                    </td>
                                                    <td className="px-4 py-2.5 text-right">
                                                        <a href={route("print-queue.download", job.filename)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold text-pink-500 bg-pink-50 hover:bg-pink-500 hover:text-white border border-pink-100 rounded-lg transition-all" title="Download">
                                                            <Icon icon="solar:download-bold-duotone" className="w-3.5 h-3.5" />
                                                            Download
                                                        </a>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* LOG MODAL */}
            <Dialog open={logModalOpen} onOpenChange={setLogModalOpen}>
                <DialogContent className="sm:max-w-sm bg-white rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-black text-slate-800 flex items-center gap-2">
                            <Icon icon="solar:printer-bold-duotone" className="w-5 h-5 text-pink-500" /> Log Service
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Enter the total papers used for the <strong className="text-pink-500">{activeJobs.length}</strong> selected file(s).
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitPrintLog} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="pages_printed" className="text-xs font-bold uppercase text-slate-600 tracking-wider">Total Papers Used *</Label>
                            <Input
                                id="pages_printed"
                                type="number" min="1" required autoFocus
                                value={data.pages_printed}
                                onChange={(e) => {
                                    // Strip out everything except numbers
                                    const val = e.target.value.replace(/[^0-9]/g, "");
                                    setData("pages_printed", parseInt(val) || 1);
                                }}
                                onKeyDown={(e) => {
                                    // Final field acts as submit
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        submitPrintLog();
                                    }
                                }}
                                className="h-10 border-pink-200 focus-visible:ring-pink-500"
                            />
                        </div>
                        <DialogFooter className="pt-2">
                            <button type="button" onClick={() => setLogModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button type="submit" disabled={processing} className="px-4 py-2 text-sm font-bold bg-pink-500 hover:bg-pink-600 text-white rounded-lg shadow-sm shadow-pink-200 disabled:opacity-50">
                                {processing ? "Processing..." : "Confirm & Clear"}
                            </button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DISCARD MODAL */}
            <Dialog open={discardModalOpen} onOpenChange={setDiscardModalOpen}>
                <DialogContent className="sm:max-w-sm bg-white rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-red-600 font-black text-lg flex items-center gap-2">
                            <Icon icon="solar:danger-triangle-bold-duotone" className="w-5 h-5" /> Discard Files
                        </DialogTitle>
                        <DialogDescription className="text-xs text-slate-500">
                            Are you sure you want to discard <strong className="text-red-500">{activeJobs.length}</strong> selected file(s)? This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="pt-2">
                        <button type="button" onClick={() => setDiscardModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                        <button type="button" onClick={confirmDiscard} className="px-4 py-2 text-sm font-bold bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm shadow-red-200">
                            Discard Files
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}