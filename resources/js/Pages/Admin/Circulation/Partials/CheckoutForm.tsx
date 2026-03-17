//resources\js\Pages\Admin\Circulation\Partials\CheckoutForm.tsx
import { FormEventHandler, useMemo } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";
import CustomSelect from "@/Components/CustomSelect";

export default function CheckoutForm({ patrons, availableCopies }: { patrons: any[]; availableCopies: any[] }) {

    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7);
    const defaultDueString = defaultDueDate.toISOString().split("T")[0] + "T17:00";

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        patron_id: "",
        book_copy_id: "",
        due_at: defaultDueString,
    });

    const patronOptionsMap = useMemo(() => {
        const map = new Map<string, string>();
        patrons.forEach((p) => {
            map.set(`${p.last_name}, ${p.first_name} (${p.library_card_number})`, p.id.toString());
        });
        return map;
    }, [patrons]);

    const patronOptions = Array.from(patronOptionsMap.keys());
    const selectedPatronLabel = patronOptions.find(key => patronOptionsMap.get(key) === data.patron_id?.toString()) || "";

    const copyOptionsMap = useMemo(() => {
        const map = new Map<string, string>();
        availableCopies.forEach((c) => {
            map.set(`[${c.accession_number}] - ${c.book.title}`, c.id.toString());
        });
        return map;
    }, [availableCopies]);

    const copyOptions = Array.from(copyOptionsMap.keys());
    const selectedCopyLabel = copyOptions.find(key => copyOptionsMap.get(key) === data.book_copy_id?.toString()) || "";

    const submitCheckout: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("circulation.checkout"), {
            preserveScroll: true,
            onSuccess: () => {
                reset("book_copy_id");
                clearErrors();
            },
        });
    };

    return (
        <div className="bg-white border border-rose-100 shadow-sm shadow-rose-100/50 rounded-xl overflow-hidden">

            <div className="bg-rose-50/50 border-b border-rose-100 px-5 py-4 flex items-center gap-3">
                <Icon icon="solar:book-arrow-up-bold-duotone" className="w-6 h-6 text-rose-500" />
                <div>
                    <h2 className="text-sm font-bold text-slate-800 leading-tight">Check Out Material</h2>
                    <p className="text-[11px] text-slate-500 font-medium mt-0.5">Scan or select items to issue.</p>
                </div>
            </div>

            <form onSubmit={submitCheckout} className="p-5 space-y-5">
                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 z-40 relative">
                        1. Select Patron *
                    </Label>
                    <CustomSelect
                        value={selectedPatronLabel}
                        onChange={(val) => setData("patron_id", patronOptionsMap.get(val) || "")}
                        options={patronOptions}
                        theme="rose"
                        placeholder="Search library card or name..."
                    />
                    {errors.patron_id && (
                        <p className="text-xs text-red-600 font-medium flex items-center mt-1">
                            <Icon icon="solar:danger-circle-bold" className="w-3 h-3 mr-1" /> {errors.patron_id}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-600 z-30 relative">
                        2. Scan Physical Copy *
                    </Label>
                    <CustomSelect
                        value={selectedCopyLabel}
                        onChange={(val) => setData("book_copy_id", copyOptionsMap.get(val) || "")}
                        options={copyOptions}
                        theme="rose"
                        placeholder="Scan barcode or select book..."
                    />
                    {errors.book_copy_id && (
                        <p className="text-xs text-red-600 font-medium flex items-center mt-1">
                            <Icon icon="solar:danger-circle-bold" className="w-3 h-3 mr-1" /> {errors.book_copy_id}
                        </p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <Label htmlFor="due_at" className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        3. Set Due Date *
                    </Label>
                    <Input
                        id="due_at"
                        type="datetime-local"
                        value={data.due_at}
                        onChange={(e) => setData("due_at", e.target.value)}
                        required
                        className="h-10 border-rose-200 focus-visible:ring-rose-500 rounded-lg text-sm"
                    />
                    {errors.due_at && (
                        <p className="text-xs text-red-600 font-medium flex items-center mt-1">
                            <Icon icon="solar:danger-circle-bold" className="w-3 h-3 mr-1" /> {errors.due_at}
                        </p>
                    )}
                </div>

                <Button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-linear-to-r from-rose-400 to-rose-500 hover:from-rose-500 hover:to-rose-600 text-white shadow-md shadow-rose-200 font-bold rounded-xl border-none h-11 mt-2"
                >
                    {processing ? "Processing..." : "Issue Book"}
                </Button>
            </form>
        </div>
    );
}