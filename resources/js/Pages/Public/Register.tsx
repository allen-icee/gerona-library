// resources/js/Pages/Public/Register.tsx

import { useForm, usePage, Head } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { QRCodeSVG } from "qrcode.react";
import PublicLayout from "@/Layouts/PublicLayout";

// 1. IMPORT LOTTIE AND YOUR ANIMATION JSON
import Lottie from "lottie-react";
// Change this path to whatever Lottie animation you want to use here!
import registerAnimation from "@/assets/lottie/qr-scan.json";

export default function Register() {
    const { props } = usePage<any>();
    const flash = props.flash || {};
    const isSuccess = !!flash.library_card_number;

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        last_name: "",
        email: "",
        type: "Citizen",
        gender: "Male",
        province: "Tarlac",
        municipality: "Gerona",
        barangay: "",
        street: "",
        school: "",
        contact_number: "",
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

            <div className="flex flex-col gap-8">

                {/* HEADER (matching Print.tsx style with bottom border) */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-amber-100">
                    <div>
                        <div className="inline-flex items-center gap-2 text-amber-500 font-potta text-[10px] uppercase tracking-widest mb-1">
                            <Icon
                                icon="solar:card-bold-duotone"
                                className="w-4 h-4"
                            />
                            Library Service
                        </div>

                        <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-800">
                            Library Card <span className="text-amber-500">Registration</span>
                        </h1>

                        <p className="text-sm text-stone-400 mt-1">
                            Register and instantly receive your digital QR library card.
                        </p>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-12 gap-8">

                    {/* LEFT COLUMN — HOW IT WORKS & LOTTIE */}
                    {/* Changed to flex-col to stack the How it works and the Lottie properly */}
                    <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">

                        {/* HOW IT WORKS CARD */}
                        <div className="bg-white rounded-2xl border border-amber-100 p-6 shadow-sm space-y-5">
                            <h3 className="font-black text-sm uppercase tracking-wider text-amber-500">
                                How It Works
                            </h3>

                            <ul className="text-sm text-stone-500 space-y-3">
                                <li className="flex gap-2">
                                    <Icon icon="solar:pen-bold-duotone" className="w-4 h-4 text-amber-400 mt-0.5" />
                                    Fill out the registration form with your complete details.
                                </li>
                                <li className="flex gap-2">
                                    <Icon icon="solar:letter-bold-duotone" className="w-4 h-4 text-amber-400 mt-0.5" />
                                    Ensure your email address is active to receive notifications.
                                </li>
                                <li className="flex gap-2">
                                    <Icon icon="solar:qr-code-bold-duotone" className="w-4 h-4 text-amber-400 mt-0.5" />
                                    Submit to instantly generate your digital QR library card.
                                </li>
                                <li className="flex gap-2">
                                    <Icon icon="solar:smartphone-bold-duotone" className="w-4 h-4 text-amber-400 mt-0.5" />
                                    Save or screenshot your QR code for kiosk and borrowing access.
                                </li>
                            </ul>
                        </div>

                        {/* 2. LOTTIE ANIMATION CARD */}
                        <div className="bg-amber-50/50 rounded-2xl border border-amber-100 shadow-sm overflow-hidden flex justify-center items-center w-full h-56 md:h-64">
                            <Lottie
                                animationData={registerAnimation}
                                loop={true}
                                /* scale-[1.8] acts like a magnifying glass! 
                                  It zooms the animation in by 80% without making the div bigger.
                                */
                                className="w-full h-full object-contain scale-[1.8] hover:scale-[1.9] transition-transform duration-500"
                            />
                        </div>

                    </aside>

                    {/* RIGHT COLUMN — FORM / SUCCESS STATE */}
                    <section className="col-span-12 lg:col-span-8">
                        {isSuccess ? (
                            /* SUCCESS STATE */
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

                                    <div className="grid md:grid-cols-2 gap-4">
                                        {/* TYPE */}
                                        <div>
                                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                                Patron Type *
                                            </label>
                                            <select
                                                value={data.type}
                                                onChange={(e) => setData("type", e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                            >
                                                <option value="Citizen">Citizen</option>
                                                <option value="Student">Student</option>
                                                <option value="Teacher/LGU Staff">Teacher / LGU Staff</option>
                                            </select>
                                            {errors.type && <span className="text-rose-500 text-xs">{errors.type}</span>}
                                        </div>

                                        {/* EMAIL */}
                                        <div>
                                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData("email", e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                                required
                                                placeholder="user@example.com"
                                            />
                                            {errors.email && <span className="text-rose-500 text-xs">{errors.email}</span>}
                                        </div>
                                    </div>

                                    {/* CONDITIONAL SCHOOL FIELD */}
                                    {data.type === "Student" && (
                                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                                School *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.school}
                                                onChange={(e) => setData("school", e.target.value)}
                                                placeholder="e.g. Gerona National High School"
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                                required={data.type === "Student"}
                                            />
                                            {errors.school && <span className="text-rose-500 text-xs">{errors.school}</span>}
                                        </div>
                                    )}

                                    {/* NAME */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                                First Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.first_name}
                                                onChange={(e) => setData("first_name", e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                                required
                                            />
                                            {errors.first_name && <span className="text-rose-500 text-xs">{errors.first_name}</span>}
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                                Last Name *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.last_name}
                                                onChange={(e) => setData("last_name", e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                                required
                                            />
                                            {errors.last_name && <span className="text-rose-500 text-xs">{errors.last_name}</span>}
                                        </div>
                                    </div>

                                    {/* CONTACT & GENDER */}
                                    <div className="grid md:grid-cols-2 gap-4">
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
                                            {errors.contact_number && <span className="text-rose-500 text-xs">{errors.contact_number}</span>}
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                                Gender
                                            </label>
                                            <select
                                                value={data.gender}
                                                onChange={(e) => setData("gender", e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.gender && <span className="text-rose-500 text-xs">{errors.gender}</span>}
                                        </div>
                                    </div>

                                    {/* ADDRESS LINE 1 */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                                Province *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.province}
                                                onChange={(e) => setData("province", e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                                required
                                            />
                                            {errors.province && <span className="text-rose-500 text-xs">{errors.province}</span>}
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                                Municipality *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.municipality}
                                                onChange={(e) => setData("municipality", e.target.value)}
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                                required
                                            />
                                            {errors.municipality && <span className="text-rose-500 text-xs">{errors.municipality}</span>}
                                        </div>
                                    </div>

                                    {/* ADDRESS LINE 2 */}
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                                Barangay *
                                            </label>
                                            <input
                                                type="text"
                                                value={data.barangay}
                                                onChange={(e) => setData("barangay", e.target.value)}
                                                placeholder="e.g. Poblacion 1"
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                                required
                                            />
                                            {errors.barangay && <span className="text-rose-500 text-xs">{errors.barangay}</span>}
                                        </div>

                                        <div>
                                            <label className="text-xs font-bold text-stone-600 uppercase mb-1 block">
                                                Street (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={data.street}
                                                onChange={(e) => setData("street", e.target.value)}
                                                placeholder="House No. / Street Name"
                                                className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:border-amber-400"
                                            />
                                            {errors.street && <span className="text-rose-500 text-xs">{errors.street}</span>}
                                        </div>
                                    </div>

                                    {/* SUBMIT */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-amber-400 text-amber-950 font-bold text-sm py-3 rounded-xl hover:bg-amber-300 transition flex items-center justify-center gap-2 mt-4"
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
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}