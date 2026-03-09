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
            <Head title="Get a Library Card - Gerona Library" />

            <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 mt-8">
                
                {isSuccess ? (
                    <div className="bg-white p-8 md:p-12 rounded-[2rem] border-2 border-emerald-100 shadow-xl shadow-emerald-100/50 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-6 border-4 border-emerald-50">
                            <Icon icon="solar:check-circle-bold-duotone" className="w-12 h-12" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-black text-slate-800 mb-2">
                            Registration Complete!
                        </h2>
                        <p className="text-stone-500 text-base mb-8 max-w-md">
                            Welcome to the library, <span className="font-bold text-stone-700">{flash.patron_name}</span>! Here is your official Digital Library Card. Take a screenshot to save it.
                        </p>

                        <div className="bg-gradient-to-br from-amber-50 to-orange-100 p-8 rounded-[2.5rem] border-2 border-amber-200 shadow-inner flex flex-col items-center w-full max-w-[320px]">
                            <div className="bg-white p-5 rounded-3xl shadow-sm border border-amber-100 mb-5">
                                <QRCodeSVG
                                    id="qr-code-svg"
                                    value={flash.library_card_number}
                                    size={180}
                                    level="H"
                                    includeMargin={true}
                                    fgColor="#1c1917"
                                />
                            </div>
                            <div className="bg-white/90 px-6 py-2 rounded-full font-potta text-base tracking-widest text-amber-700 shadow-sm border border-amber-200">
                                {flash.library_card_number}
                            </div>
                        </div>

                        <button
                            onClick={() => window.location.reload()}
                            className="mt-10 px-10 bg-stone-800 text-white font-bold py-4 rounded-2xl hover:bg-stone-700 transition-colors"
                        >
                            Register Another Person
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="mb-8 text-center md:text-left">
                            <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-800 flex items-center justify-center md:justify-start gap-3">
                                <Icon icon="fluent-emoji:star" className="w-10 h-10" />
                                Get a Library Card
                            </h1>
                            <p className="text-stone-500 font-medium mt-2">
                                Register below to instantly receive your digital QR code ID. Valid for all library services.
                            </p>
                        </div>

                        <div className="bg-white p-6 md:p-8 rounded-[2rem] border-2 border-amber-100 shadow-xl shadow-amber-100/50">
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 ml-1">First Name</label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) => setData("first_name", e.target.value)}
                                            className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3.5 focus:border-amber-400 focus:ring-0 transition-colors"
                                            required
                                        />
                                        {errors.first_name && <span className="text-rose-500 text-xs mt-1 ml-1 block">{errors.first_name}</span>}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 ml-1">Last Name</label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) => setData("last_name", e.target.value)}
                                            className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3.5 focus:border-amber-400 focus:ring-0 transition-colors"
                                            required
                                        />
                                        {errors.last_name && <span className="text-rose-500 text-xs mt-1 ml-1 block">{errors.last_name}</span>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 ml-1">Patron Type</label>
                                    <select
                                        value={data.type}
                                        onChange={(e) => setData("type", e.target.value)}
                                        className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3.5 focus:border-amber-400 focus:ring-0 transition-colors appearance-none"
                                    >
                                        <option value="General Public">General Public</option>
                                        <option value="Student">Student</option>
                                        <option value="Teacher">Teacher / LGU Staff</option>
                                    </select>
                                    {errors.type && <span className="text-rose-500 text-xs mt-1 ml-1 block">{errors.type}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 ml-1">School / Barangay</label>
                                    <input
                                        type="text"
                                        value={data.school_or_barangay}
                                        onChange={(e) => setData("school_or_barangay", e.target.value)}
                                        placeholder="e.g. Brgy. Poblacion"
                                        className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3.5 focus:border-amber-400 focus:ring-0 transition-colors"
                                        required
                                    />
                                    {errors.school_or_barangay && <span className="text-rose-500 text-xs mt-1 ml-1 block">{errors.school_or_barangay}</span>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-2 ml-1">Contact Number (Optional)</label>
                                    <input
                                        type="text"
                                        value={data.contact_number}
                                        onChange={(e) => setData("contact_number", e.target.value)}
                                        placeholder="09123456789"
                                        className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3.5 focus:border-amber-400 focus:ring-0 transition-colors"
                                    />
                                    {errors.contact_number && <span className="text-rose-500 text-xs mt-1 ml-1 block">{errors.contact_number}</span>}
                                </div>

                                <div className="pt-6">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-amber-400 text-amber-950 font-black tracking-widest uppercase text-base py-5 rounded-2xl hover:bg-amber-300 hover:-translate-y-1 transition-all shadow-lg shadow-amber-200/50 disabled:opacity-50 disabled:hover:translate-y-0 flex justify-center items-center gap-2"
                                    >
                                        {processing ? <Icon icon="solar:spinner-bold-duotone" className="w-6 h-6 animate-spin" /> : "Generate My QR Card"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </PublicLayout>
    );
}