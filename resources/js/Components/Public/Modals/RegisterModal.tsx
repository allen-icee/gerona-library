import { FormEventHandler, useEffect } from "react";
import { useForm, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Button } from "@/Components/ui/button";

export default function RegisterModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}) {
    const { flash } = usePage<any>().props;

    const {
        data,
        setData,
        post,
        processing,
        errors,
        recentlySuccessful,
        reset,
        clearErrors,
    } = useForm({
        name: "",
        type: "Student",
        contact_number: "",
        address: "",
    });

    const submitRegistration: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("register-patron.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    useEffect(() => {
        if (!isOpen) clearErrors();
    }, [isOpen]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white border-4 border-pink-200 rounded-[2rem] shadow-2xl sm:max-w-[450px]">
                <DialogHeader className="mb-2">
                    <DialogTitle className="text-2xl font-serif font-black text-slate-800 flex items-center gap-2">
                        <Icon
                            icon="fluent-emoji:sparkling-heart"
                            className="w-8 h-8"
                        />
                        Get a Library Card
                    </DialogTitle>
                    <DialogDescription className="text-stone-500 font-medium">
                        Register to unlock all library perks and fast-lane
                        printing! 🌸
                    </DialogDescription>
                </DialogHeader>

                {recentlySuccessful || flash?.success ? (
                    <div className="text-center py-6 space-y-4 animate-in zoom-in duration-300">
                        <div className="bg-pink-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                            <Icon
                                icon="fluent-emoji:party-popper"
                                className="w-14 h-14"
                            />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800">
                            Yay! You're in!
                        </h2>
                        <p className="text-stone-600 text-sm">
                            Please screenshot your shiny new ID below.
                        </p>

                        <div className="bg-pink-50 border-4 border-dashed border-pink-300 rounded-3xl p-6 my-4 transform rotate-1 hover:rotate-0 transition-transform">
                            <p className="text-xs font-bold text-pink-500 uppercase tracking-widest mb-1">
                                Your Patron ID
                            </p>
                            <p className="text-4xl font-mono font-black text-rose-500 drop-shadow-sm">
                                {flash?.new_patron_id || "PAT-XXXXX"}
                            </p>
                        </div>
                        <Button
                            onClick={() => onClose(false)}
                            className="w-full h-12 bg-rose-500 hover:bg-rose-600 rounded-2xl text-lg font-bold shadow-md shadow-pink-200"
                        >
                            Awesome, thanks!
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={submitRegistration} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="name"
                                className="text-stone-700 font-bold text-sm"
                            >
                                Full Name ✨
                            </Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                required
                                placeholder="e.g. Juan Dela Cruz"
                                className="h-12 rounded-2xl bg-pink-50/50 border-pink-200 focus-visible:ring-pink-400"
                            />
                            {errors.name && (
                                <p className="text-xs text-rose-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="type"
                                    className="text-stone-700 font-bold text-sm"
                                >
                                    I am a... 🎒
                                </Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="flex h-12 w-full rounded-2xl border border-pink-200 bg-pink-50/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="LGU Employee">
                                        LGU Employee
                                    </option>
                                    <option value="Professional">
                                        Professional
                                    </option>
                                    <option value="Citizen">Resident</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="contact_number"
                                    className="text-stone-700 font-bold text-sm"
                                >
                                    Contact # 📱
                                </Label>
                                <Input
                                    id="contact_number"
                                    value={data.contact_number}
                                    onChange={(e) =>
                                        setData(
                                            "contact_number",
                                            e.target.value,
                                        )
                                    }
                                    required
                                    placeholder="09XX..."
                                    className="h-12 rounded-2xl bg-pink-50/50 border-pink-200 focus-visible:ring-pink-400"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="address"
                                className="text-stone-700 font-bold text-sm"
                            >
                                School / Barangay 🏫
                            </Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) =>
                                    setData("address", e.target.value)
                                }
                                required
                                placeholder="e.g. Gerona NHS"
                                className="h-12 rounded-2xl bg-pink-50/50 border-pink-200 focus-visible:ring-pink-400"
                            />
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl text-lg font-black shadow-lg shadow-pink-200 mt-4 group"
                        >
                            {processing ? "Making Magic..." : "Create My Card!"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
