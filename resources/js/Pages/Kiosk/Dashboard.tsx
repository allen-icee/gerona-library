// resources/js/Pages/Kiosk/Dashboard.tsx
import { useState, FormEventHandler, useEffect, useRef } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Icon } from "@iconify/react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import { toast } from "sonner";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";

export default function KioskDashboard({
    activeVisitors = [],
}: PageProps<{ activeVisitors: any[] }>) {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isGuest, setIsGuest] = useState(false);
    const sigPad = useRef<SignatureCanvas>(null);

    const activeVisitorsRef = useRef(activeVisitors);
    useEffect(() => {
        activeVisitorsRef.current = activeVisitors;
    }, [activeVisitors]);

    const [scannedQR, setScannedQR] = useState<string | null>(null);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        
        const pollTimer = setInterval(() => {
            router.get(window.location.pathname, {}, { 
                only: ['activeVisitors'], 
                preserveScroll: true, 
                preserveState: true,
                replace: true 
            });
        }, 10000);

        return () => {
            clearInterval(timer);
            clearInterval(pollTimer);
        };
    }, []);

    const { data, setData, post, processing, errors, reset, clearErrors, transform } = useForm({
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
        signature: sigPad.current?.isEmpty() ? "" : sigPad.current?.getCanvas().toDataURL("image/png"),
    }));

    const handleToggle = (guestMode: boolean) => {
        setIsGuest(guestMode);
        clearErrors();
    };

    const playBeep = () => {
        try {
            const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = "sine";
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch (e) {
            console.error("Audio error", e);
        }
    };

    useEffect(() => {
        if (!isGuest) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
                },
                false
            );

            scannerRef.current.render(
                (decodedText) => {
                    scannerRef.current?.pause(true);
                    playBeep();

                    const isAlreadyInside = activeVisitorsRef.current.some(
                        (v) => v.library_card_number === decodedText || v.patron?.library_card_number === decodedText
                    );

                    if (isAlreadyInside) {
                        toast.loading("Processing Time Out...", { id: "qr-scan" });
                        
                        router.post(route("visitor-logs.smart-scan"), {
                            library_card_number: decodedText,
                    
                        }, {
                            preserveScroll: true,
                            onSuccess: () => {
                                toast.success("Goodbye! Time out recorded successfully.", { id: "qr-scan" });
                                setTimeout(() => scannerRef.current?.resume(), 3000);
                            },
                            onError: () => {
                                toast.error("Error processing Time Out.", { id: "qr-scan" });
                                setTimeout(() => scannerRef.current?.resume(), 3000);
                            }
                        });
                    } else {
                        setScannedQR(decodedText);       
                    }
                },
                (error) => {}
            );
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(e => console.error("Failed to clear scanner", e));
            }
        };
    }, [isGuest]);

    const handlePurposeSelection = (selectedPurpose: string) => {
        if (!scannedQR) return;

        toast.loading("Processing Library Card...", { id: "qr-scan" });

        router.post(route("visitor-logs.smart-scan"), {
            library_card_number: scannedQR,
            purpose: selectedPurpose,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Welcome! Time in successful.", { id: "qr-scan" });
                setScannedQR(null);
                scannerRef.current?.resume();
            },
            onError: () => {
                toast.error("Invalid QR Code or Card not found.", { id: "qr-scan" });
                setScannedQR(null);
                setTimeout(() => scannerRef.current?.resume(), 3000);
            }
        });
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
        router.patch(route("visitor-logs.checkout", id), {}, { preserveScroll: true });
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] flex flex-col md:flex-row relative overflow-hidden font-sans">
            <Head title="Library Kiosk" />

            <div className="absolute top-[-10%] right-[-5%] w-180 h-180 bg-pink-200/30 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-10%] right-[25%] w-140 h-140 bg-rose-200/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

            <div className="w-full md:w-5/12 lg:w-[32%] bg-white/90 backdrop-blur-2xl text-stone-800 flex flex-col shadow-[15px_0_40px_rgba(236,72,153,0.04)] z-10 border-r border-white relative">
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

                <div className="px-8 pb-8 flex flex-col items-center justify-center border-b border-stone-100">
                    <div className="text-5xl font-mono font-black tracking-tighter text-pink-500 drop-shadow-sm">
                        {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                    <div className="text-xs font-bold text-stone-400 mt-1 tracking-widest uppercase">
                        {currentTime.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </div>
                </div>

                <div className="p-8 flex-1 overflow-y-auto hide-scrollbar">
                    <form onSubmit={submitLog} className="space-y-6">
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

                        {isGuest && (
                            <div className="space-y-1.5 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Label htmlFor="purpose" className="text-stone-500 text-xs font-bold uppercase tracking-widest pl-1">
                                    Purpose of Visit <span className="text-pink-500">*</span>
                                </Label>
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
                        )}

                        <div className="min-h-32.5">
                            {!isGuest ? (
                                <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <Label className="text-stone-500 text-xs font-bold uppercase tracking-widest pl-1">
                                        Scan QR Code <span className="text-pink-500">*</span>
                                    </Label>

                                    <div className="w-full bg-black rounded-2xl overflow-hidden border-2 border-pink-100 shadow-inner aspect-video relative">
                                        <div id="reader" className="w-full h-full"></div>
                                    </div>
                                    <p className="text-center text-[10px] text-stone-400 font-bold uppercase tracking-widest mt-2">
                                        Point your library card at the camera to log in/out
                                    </p>
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

                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full h-14 rounded-xl text-base font-black tracking-widest uppercase bg-pink-500 hover:bg-pink-600 text-white shadow-[0_8px_20px_rgba(236,72,153,0.25)] hover:shadow-[0_10px_25px_rgba(236,72,153,0.35)] hover:-translate-y-0.5 transition-all mt-6"
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
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="w-full md:w-7/12 lg:w-[68%] p-8 md:p-12 overflow-y-auto relative z-10 flex flex-col">
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

                {activeVisitors.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-stone-400 bg-white/40 backdrop-blur-sm rounded-[2rem] border-2 border-dashed border-pink-200/50 min-h-[50vh]">
                        <Icon icon="solar:ghost-smile-bold-duotone" className="w-24 h-24 mb-4 text-pink-200" />
                        <p className="text-2xl font-black text-stone-600 tracking-tight">The library is quiet right now.</p>
                        <p className="text-base mt-2 font-medium">No active visitors logged in.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                        {activeVisitors.map((visitor) => (
                            <div key={visitor.id} className="bg-white backdrop-blur-md border border-stone-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(236,72,153,0.12)] hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden flex flex-col">
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
                                            {new Date(visitor.time_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                        <Button size="sm" onClick={() => handleTimeOut(visitor.id)} className="bg-white hover:bg-pink-500 text-pink-600 hover:text-white text-xs font-bold h-8 px-4 rounded-lg shadow-none border border-pink-200 hover:border-pink-500 transition-colors">
                                            Time Out
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                onClick={() => router.post(route("logout"))}
                className="absolute bottom-6 right-6 text-stone-300 hover:text-pink-500 transition-colors focus:outline-none z-50 p-2"
                title="Staff Access"
            >
                <Icon icon="solar:lock-keyhole-minimalistic-bold-duotone" className="w-6 h-6" />
            </button>

            <Dialog 
                open={!!scannedQR} 
                onOpenChange={(open) => { 
                    if (!open) { setScannedQR(null); scannerRef.current?.resume(); } 
                }}
            >
                <DialogContent className="sm:max-w-md bg-white rounded-3xl border-pink-100 shadow-2xl p-6">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black text-slate-800 text-center flex flex-col items-center gap-2">
                            <Icon icon="solar:clipboard-check-bold-duotone" className="w-10 h-10 text-pink-500" />
                            Purpose of Visit
                        </DialogTitle>
                        <DialogDescription className="text-center text-slate-500 font-medium">
                            Please select the primary reason for your visit today.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="grid grid-cols-2 gap-3 mt-4">
                        {["Research", "Borrow Books", "Computer Use", "Printing", "Reading", "Other"].map((purpose) => (
                            <button
                                key={purpose}
                                onClick={() => handlePurposeSelection(purpose)}
                                className="bg-pink-50/50 hover:bg-pink-500 text-pink-600 hover:text-white border border-pink-100 py-3 rounded-xl font-bold text-sm transition-colors duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
                            >
                                {purpose}
                            </button>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>

        </div>
    );
}