// resources/js/Pages/Kiosk/Dashboard.tsx

import { useState, FormEventHandler, useEffect, useRef } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function KioskDashboard({
    activeVisitors = [],
}: PageProps<{ activeVisitors: any[] }>) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isGuest, setIsGuest] = useState(false);
    const sigPad = useRef<SignatureCanvas>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
        transform,
    } = useForm({
        patron_id: "",
        visitor_name: "",
        address: "",
        school: "",
        contact_number: "",
        purpose: "Research",
        signature: "",
    });

    transform((currentData) => ({
        ...currentData,
        signature: sigPad.current?.isEmpty()
            ? ""
            : sigPad.current?.getCanvas().toDataURL("image/png"), // Replaced getTrimmedCanvas with getCanvas
    }));

    const handleToggle = (guestMode: boolean) => {
        setIsGuest(guestMode);
        clearErrors();
    };

    const submitLog: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("visitor-logs.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                sigPad.current?.clear();
            },
        });
    };

    const handleTimeOut = (id: number) => {
        router.patch(
            route("visitor-logs.checkout", id),
            {},
            { preserveScroll: true },
        );
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col md:flex-row relative overflow-hidden font-sans">
            <Head title="Library Kiosk" />

            {/* Subtle Aesthetic Pink Blobs */}
            <div className="absolute top-[-10%] right-[-5%] w-[45rem] h-[45rem] bg-pink-200/30 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[25%] w-[35rem] h-[35rem] bg-rose-200/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

            {/* LEFT SIDE: Sidebar Form */}
            <div className="w-full md:w-5/12 lg:w-[32%] bg-white/90 backdrop-blur-2xl text-stone-800 flex flex-col shadow-[15px_0_40px_rgba(236,72,153,0.04)] z-10 border-r border-white relative">

                {/* Clean Floating Header */}
                <div className="pt-10 pb-6 px-8 flex flex-col items-center text-center relative z-20">
                    <img
                        src="/images/GeronaLibraryLogo.png"
                        alt="Logo"
                        className="w-16 h-16 object-contain drop-shadow-sm mb-4 hover:scale-105 transition-transform"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/images/3DMunicipalLogo.png"; }}
                    />
                    <h1 className="text-2xl font-serif font-black tracking-tight text-slate-800 leading-tight">
                        Gerona Municipal <span className="text-pink-500">Library</span>
                    </h1>
                    <p className="text-stone-400 text-[10px] uppercase tracking-[0.25em] font-bold mt-1.5">
                        Self-Service Kiosk
                    </p>
                </div>

                {/* Elegant Clock Widget */}
                <div className="px-8 pb-8 flex flex-col items-center justify-center border-b border-stone-100">
                    <div className="text-5xl font-mono font-black tracking-tighter text-pink-500 drop-shadow-sm">
                        {currentTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                    <div className="text-xs font-bold text-stone-400 mt-1 tracking-widest uppercase">
                        {currentTime.toLocaleDateString([], {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>

                {/* Scrollable Form Area */}
                <div className="p-8 flex-1 overflow-y-auto hide-scrollbar">
                    <form onSubmit={submitLog} className="space-y-6">

                        {/* iOS-Style Segmented Toggle */}
                        <div className="flex p-1.5 bg-stone-100/80 rounded-2xl border border-stone-200/50">
                            <button
                                type="button"
                                onClick={() => handleToggle(false)}
                                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${!isGuest ? "bg-white text-pink-600 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-stone-200/50" : "text-stone-500 hover:text-stone-800"}`}
                            >
                                <Icon icon="solar:card-bold-duotone" className="w-5 h-5 mr-2" />
                                Library Card
                            </button>
                            <button
                                type="button"
                                onClick={() => handleToggle(true)}
                                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${isGuest ? "bg-white text-pink-600 shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-stone-200/50" : "text-stone-500 hover:text-stone-800"}`}
                            >
                                <Icon icon="solar:users-group-two-rounded-bold-duotone" className="w-5 h-5 mr-2" />
                                Guest
                            </button>
                        </div>

                        {/* Dynamic Input Fields */}
                        <div className="min-h-[130px]">
                            {!isGuest ? (
                                <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <Label htmlFor="patron_id" className="text-stone-500 text-xs font-bold uppercase tracking-widest pl-1">
                                        Library Card Number <span className="text-pink-500">*</span>
                                    </Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Icon icon="solar:qr-code-bold-duotone" className="h-6 w-6 text-pink-400" />
                                        </div>
                                        <Input
                                            id="patron_id"
                                            value={data.patron_id}
                                            onChange={(e) => setData("patron_id", e.target.value)}
                                            required={!isGuest}
                                            placeholder="SCAN OR TYPE ID..."
                                            className="uppercase h-14 pl-12 text-xl tracking-widest font-mono font-black bg-white border-stone-200 text-slate-800 focus:bg-white focus:ring-4 focus:ring-pink-500/10 focus:border-pink-300 placeholder:text-stone-300 rounded-xl shadow-sm transition-all"
                                            autoFocus
                                        />
                                    </div>
                                    {errors.patron_id && (
                                        <p className="text-xs text-rose-500 pl-1 font-bold flex items-center gap-1 mt-1.5">
                                            <Icon icon="solar:danger-triangle-bold-duotone" className="w-4 h-4" /> {errors.patron_id}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1.5">
                                        <Label htmlFor="visitor_name" className="text-stone-500 text-xs font-bold uppercase tracking-widest pl-1">Full Name <span className="text-pink-500">*</span></Label>
                                        <Input
                                            id="visitor_name"
                                            value={data.visitor_name}
                                            onChange={(e) => setData("visitor_name", e.target.value)}
                                            required={isGuest}
                                            placeholder="Juan Dela Cruz"
                                            className="bg-white/50 border-stone-200 text-slate-800 focus:bg-white focus:ring-4 focus:ring-pink-500/10 focus:border-pink-300 rounded-xl h-12 text-base font-medium shadow-sm transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <Label htmlFor="address" className="text-stone-500 text-xs font-bold uppercase tracking-widest pl-1">Address <span className="text-pink-500">*</span></Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) => setData("address", e.target.value)}
                                            required={isGuest}
                                            placeholder="Brgy. Poblacion"
                                            className="bg-white/50 border-stone-200 text-slate-800 focus:bg-white focus:ring-4 focus:ring-pink-500/10 focus:border-pink-300 rounded-xl h-12 text-base font-medium shadow-sm transition-all"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="school" className="text-stone-500 text-xs font-bold uppercase tracking-widest pl-1">School</Label>
                                            <Input
                                                id="school"
                                                value={data.school}
                                                onChange={(e) => setData("school", e.target.value)}
                                                placeholder="e.g., GNHS"
                                                className="bg-white/50 border-stone-200 text-slate-800 focus:bg-white focus:ring-4 focus:ring-pink-500/10 focus:border-pink-300 rounded-xl h-12 text-base font-medium shadow-sm transition-all"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="contact_number" className="text-stone-500 text-xs font-bold uppercase tracking-widest pl-1">Contact #</Label>
                                            <Input
                                                id="contact_number"
                                                value={data.contact_number}
                                                onChange={(e) => setData("contact_number", e.target.value)}
                                                placeholder="0912..."
                                                className="bg-white/50 border-stone-200 text-slate-800 focus:bg-white focus:ring-4 focus:ring-pink-500/10 focus:border-pink-300 rounded-xl h-12 text-base font-medium shadow-sm transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Purpose Dropdown */}
                        <div className="space-y-1.5">
                            <Label htmlFor="purpose" className="text-stone-500 text-xs font-bold uppercase tracking-widest pl-1">Purpose of Visit <span className="text-pink-500">*</span></Label>
                            <select
                                id="purpose"
                                value={data.purpose}
                                onChange={(e) => setData("purpose", e.target.value)}
                                className="flex h-12 w-full rounded-xl border border-stone-200 bg-white/50 px-4 py-2 text-base text-slate-800 focus:bg-white focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-300 font-medium shadow-sm transition-all"
                            >
                                <option value="Research">Research / Study</option>
                                <option value="Borrow Books">Borrow / Return Books</option>
                                <option value="Computer Use">Computer / Internet Use</option>
                                <option value="Printing">Printing Services</option>
                                <option value="Reading">Leisure Reading</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Signature Pad */}
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between items-center pl-1">
                                <Label className="text-stone-500 text-xs font-bold uppercase tracking-widest">Signature (Optional)</Label>
                                <button
                                    type="button"
                                    onClick={() => sigPad.current?.clear()}
                                    className="text-[10px] font-bold text-pink-500 hover:text-pink-700 uppercase tracking-widest bg-pink-50 px-3 py-1 rounded-md transition-colors"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="bg-white rounded-xl overflow-hidden border border-stone-200 shadow-sm focus-within:ring-4 focus-within:ring-pink-500/10 focus-within:border-pink-300 transition-all">
                                <SignatureCanvas
                                    ref={sigPad}
                                    canvasProps={{ className: "w-full h-24 cursor-crosshair" }}
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-14 rounded-xl text-base font-black tracking-widest uppercase bg-pink-500 hover:bg-pink-600 text-white shadow-[0_8px_20px_rgba(236,72,153,0.25)] hover:shadow-[0_10px_25px_rgba(236,72,153,0.35)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-6"
                        >
                            {processing ? (
                                <Icon icon="solar:spinner-bold-duotone" className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Icon icon="solar:login-3-bold-duotone" className="w-6 h-6 mr-2" />
                                    Log Time In
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>

            {/* RIGHT SIDE: Active Visitors Grid */}
            <div className="w-full md:w-7/12 lg:w-[68%] p-8 md:p-12 overflow-y-auto relative z-10 flex flex-col">

                {/* Clean Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-stone-200 pb-4">
                    <div>
                        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            Currently Inside
                        </h2>
                        <p className="text-stone-500 text-sm mt-1 font-medium">Real-time view of patrons currently in the library.</p>
                    </div>
                    <div className="bg-white text-pink-600 px-5 py-2.5 rounded-xl text-sm font-black tracking-wide flex items-center shadow-sm border border-pink-100">
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse mr-2.5 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></span>
                        {activeVisitors.length} Active {activeVisitors.length === 1 ? 'Visitor' : 'Visitors'}
                    </div>
                </div>

                {/* Empty State vs Grid */}
                {activeVisitors.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-stone-400 bg-white/40 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-pink-200/50 min-h-[50vh]">
                        <Icon icon="solar:ghost-smile-bold-duotone" className="w-24 h-24 mb-4 text-pink-200" />
                        <p className="text-2xl font-black text-stone-600 tracking-tight">The library is quiet right now.</p>
                        <p className="text-base mt-2 font-medium">No active visitors logged in.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {activeVisitors.map((visitor) => (
                            <div
                                key={visitor.id}
                                className="bg-white backdrop-blur-md border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(236,72,153,0.12)] hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col"
                            >
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-500 shrink-0 border border-pink-100">
                                            <Icon icon="solar:user-bold-duotone" className="w-6 h-6" />
                                        </div>
                                        <div className="overflow-hidden pt-0.5">
                                            <h3 className="text-lg font-black text-slate-800 truncate" title={visitor.visitor_name}>
                                                {visitor.visitor_name}
                                            </h3>
                                            <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest truncate mt-0.5" title={visitor.address}>
                                                {visitor.address}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-50">
                                        <div className="flex items-center text-xs font-bold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-100">
                                            <Icon icon="solar:clock-circle-bold-duotone" className="w-4 h-4 mr-2 text-stone-400" />
                                            {new Date(visitor.time_in).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleTimeOut(visitor.id)}
                                            className="bg-white hover:bg-pink-500 text-pink-600 hover:text-white text-xs font-bold h-8 px-4 rounded-lg shadow-none border border-pink-200 hover:border-pink-500 transition-colors"
                                        >
                                            Time Out
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SECRET STAFF LOGOUT BUTTON */}
            <button
                onClick={() => router.post(route("logout"))}
                className="absolute bottom-6 right-6 text-stone-300 hover:text-pink-500 transition-colors focus:outline-none z-50 p-2"
                title="Staff Access"
            >
                <Icon icon="solar:lock-keyhole-minimalistic-bold-duotone" className="w-6 h-6" />
            </button>
        </div>
    );
}