// resources/js/Pages/Public/Register.tsx

import { useForm, usePage, Head } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { QRCodeSVG } from "qrcode.react";
import PublicLayout from "@/Layouts/PublicLayout";

export default function Register() {
    const { props } = usePage<any>();
    const flash = props.flash || {};
    const isSuccess = !!flash.library_card_number;

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        type: "General Public",
        contact_number: "",
        school_or_barangay: "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("register-patron.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout>
            <Head title="Library Card Registration - Gerona Library" />

            <div className="w-full space-y-6">

                {/* PAGE HEADER — SAME STYLE AS CATALOG */}

                <div className="flex items-end justify-between flex-wrap gap-4">

                    <div>
                        <h1 className="text-2xl md:text-3xl font-serif font-black text-slate-800 flex items-center gap-2">
                            <Icon icon="fluent-emoji:star" className="w-7 h-7" />
                            Library Card Registration
                        </h1>

                        <p className="text-stone-500 text-sm font-medium mt-1">
                            Register and instantly receive your digital QR library card.
                        </p>
                    </div>

                </div>


                {/* SUCCESS STATE */}

                {isSuccess ? (

                    <div className="bg-white border border-emerald-100 rounded-2xl p-8 shadow-sm flex flex-col items-center text-center">

                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                            <Icon icon="solar:check-circle-bold-duotone" className="w-10 h-10" />
                        </div>

                        <h2 className="text-2xl font-serif font-black text-slate-800 mb-2">
                            Registration Complete
                        </h2>

                        <p className="text-sm text-stone-500 mb-6">
                            Welcome <span className="font-bold">{flash.patron_name}</span>.
                            Save your digital library card below.
                        </p>

                        <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 flex flex-col items-center">

                            <div className="bg-white p-4 rounded-xl border mb-4">
                                <QRCodeSVG
                                    value={flash.library_card_number}
                                    size={150}
                                    level="H"
                                    includeMargin
                                />
                            </div>

                            <div className="px-4 py-1 rounded-full bg-white border text-amber-700 font-mono text-sm">
                                {flash.library_card_number}
                            </div>

                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-6 px-6 py-3 bg-stone-800 text-white text-sm font-bold rounded-xl hover:bg-stone-700 transition"
                        >
                            Register Another Person
                        </button>

                    </div>

                ) : (

                    /* FORM CARD */

                    <div className="bg-white border border-amber-100 rounded-2xl p-6 md:p-8 shadow-sm">

                        <form onSubmit={submit} className="space-y-5">

                            {/* NAME */}

                            <div className="grid md:grid-cols-2 gap-4">

                                <div>
                                    <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                        First Name
                                    </label>

                                    <input
                                        type="text"
                                        value={data.first_name}
                                        onChange={(e) => setData("first_name", e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                        required
                                    />

                                    {errors.first_name && (
                                        <span className="text-rose-500 text-xs">{errors.first_name}</span>
                                    )}
                                </div>


                                <div>
                                    <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                        Last Name
                                    </label>

                                    <input
                                        type="text"
                                        value={data.last_name}
                                        onChange={(e) => setData("last_name", e.target.value)}
                                        className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                        required
                                    />

                                    {errors.last_name && (
                                        <span className="text-rose-500 text-xs">{errors.last_name}</span>
                                    )}
                                </div>

                            </div>


                            {/* TYPE */}

                            <div>
                                <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                    Patron Type
                                </label>

                                <select
                                    value={data.type}
                                    onChange={(e) => setData("type", e.target.value)}
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                >
                                    <option value="General Public">General Public</option>
                                    <option value="Student">Student</option>
                                    <option value="Teacher">Teacher / LGU Staff</option>
                                </select>

                                {errors.type && (
                                    <span className="text-rose-500 text-xs">{errors.type}</span>
                                )}
                            </div>


                            {/* LOCATION */}

                            <div>
                                <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                    School / Barangay
                                </label>

                                <input
                                    type="text"
                                    value={data.school_or_barangay}
                                    onChange={(e) => setData("school_or_barangay", e.target.value)}
                                    placeholder="e.g. Brgy. Poblacion"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                    required
                                />

                                {errors.school_or_barangay && (
                                    <span className="text-rose-500 text-xs">
                                        {errors.school_or_barangay}
                                    </span>
                                )}
                            </div>


                            {/* CONTACT */}

                            <div>
                                <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                    Contact Number
                                </label>

                                <input
                                    type="text"
                                    value={data.contact_number}
                                    onChange={(e) => setData("contact_number", e.target.value)}
                                    placeholder="Optional"
                                    className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                />

                                {errors.contact_number && (
                                    <span className="text-rose-500 text-xs">
                                        {errors.contact_number}
                                    </span>
                                )}
                            </div>


                            {/* SUBMIT */}

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-amber-400 text-amber-950 font-bold text-sm py-3 rounded-xl hover:bg-amber-300 transition flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <Icon
                                        icon="solar:spinner-bold-duotone"
                                        className="w-5 h-5 animate-spin"
                                    />
                                ) : (
                                    "Generate My QR Card"
                                )}
                            </button>

                        </form>

                    </div>

                )}

            </div>

        </PublicLayout>
    );
}