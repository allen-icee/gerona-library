import { useState, FormEventHandler, useEffect, useRef } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { Library, UserCheck, Clock, UserCircle, Users } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";

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

    // Capture signature data before sending to server
    transform((currentData) => ({
        ...currentData,
        signature: sigPad.current?.isEmpty()
            ? ""
            : sigPad.current?.getTrimmedCanvas().toDataURL("image/png"),
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
        <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
            <Head title="Library Kiosk" />

            {/* Left Side: The Check-in Form */}
            <div className="w-full md:w-5/12 lg:w-1/3 bg-slate-900 text-white flex flex-col shadow-2xl z-10 overflow-y-auto">
                <div className="p-8 pb-4 flex items-center space-x-3">
                    <Library className="w-8 h-8 text-amber-500" />
                    <div>
                        <h1 className="text-xl font-serif font-bold tracking-tight">
                            Gerona Municipal Library
                        </h1>
                        <p className="text-slate-400 text-xs uppercase tracking-widest">
                            Self-Service Kiosk
                        </p>
                    </div>
                </div>

                <div className="px-8 py-4 bg-slate-950/50 text-center">
                    <div className="text-4xl font-mono font-light tracking-tight text-amber-500">
                        {currentTime.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                    <div className="text-sm text-slate-400 mt-1">
                        {currentTime.toLocaleDateString([], {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                        })}
                    </div>
                </div>

                <div className="p-8 flex-1">
                    <h2 className="text-2xl font-bold mb-6">
                        Welcome! Please sign in.
                    </h2>

                    <form onSubmit={submitLog} className="space-y-5">
                        {/* Mode Toggle Switch */}
                        <div className="flex p-1 bg-slate-800 rounded-lg border border-slate-700">
                            <button
                                type="button"
                                onClick={() => handleToggle(false)}
                                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-md transition-all ${!isGuest ? "bg-amber-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
                            >
                                <UserCircle className="w-4 h-4 mr-2" /> Library
                                Card
                            </button>
                            <button
                                type="button"
                                onClick={() => handleToggle(true)}
                                className={`flex-1 flex items-center justify-center py-2.5 text-sm font-semibold rounded-md transition-all ${isGuest ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-white"}`}
                            >
                                <Users className="w-4 h-4 mr-2" /> Walk-in Guest
                            </button>
                        </div>

                        <div className="min-h-[140px]">
                            {!isGuest ? (
                                <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-300">
                                    <Label
                                        htmlFor="patron_id"
                                        className="text-slate-300"
                                    >
                                        Library Card Number *
                                    </Label>
                                    <Input
                                        id="patron_id"
                                        value={data.patron_id}
                                        onChange={(e) =>
                                            setData("patron_id", e.target.value)
                                        }
                                        required={!isGuest}
                                        placeholder="e.g., PAT-00001"
                                        className="uppercase h-14 text-xl text-center tracking-widest font-mono font-bold bg-slate-800 border-slate-700 text-white focus-visible:ring-amber-500 placeholder:text-slate-600"
                                        autoFocus
                                    />
                                    {errors.patron_id && (
                                        <p className="text-sm text-red-400 text-center font-medium">
                                            {errors.patron_id}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="visitor_name"
                                            className="text-slate-300 text-xs uppercase tracking-wider"
                                        >
                                            Full Name *
                                        </Label>
                                        <Input
                                            id="visitor_name"
                                            value={data.visitor_name}
                                            onChange={(e) =>
                                                setData(
                                                    "visitor_name",
                                                    e.target.value,
                                                )
                                            }
                                            required={isGuest}
                                            placeholder="Juan Dela Cruz"
                                            className="bg-slate-800 border-slate-700 text-white focus-visible:ring-amber-500 placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor="address"
                                            className="text-slate-300 text-xs uppercase tracking-wider"
                                        >
                                            Address (Barangay/Municipality) *
                                        </Label>
                                        <Input
                                            id="address"
                                            value={data.address}
                                            onChange={(e) =>
                                                setData(
                                                    "address",
                                                    e.target.value,
                                                )
                                            }
                                            required={isGuest}
                                            placeholder="Brgy. Poblacion"
                                            className="bg-slate-800 border-slate-700 text-white focus-visible:ring-amber-500 placeholder:text-slate-600"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="school"
                                                className="text-slate-300 text-xs uppercase tracking-wider"
                                            >
                                                School
                                            </Label>
                                            <Input
                                                id="school"
                                                value={data.school}
                                                onChange={(e) =>
                                                    setData(
                                                        "school",
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="e.g., GNHS"
                                                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-amber-500 placeholder:text-slate-600"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="contact_number"
                                                className="text-slate-300 text-xs uppercase tracking-wider"
                                            >
                                                Contact #
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
                                                placeholder="0912..."
                                                className="bg-slate-800 border-slate-700 text-white focus-visible:ring-amber-500 placeholder:text-slate-600"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1 pt-2">
                            <Label
                                htmlFor="purpose"
                                className="text-slate-300 text-xs uppercase tracking-wider"
                            >
                                Purpose of Visit *
                            </Label>
                            <select
                                id="purpose"
                                value={data.purpose}
                                onChange={(e) =>
                                    setData("purpose", e.target.value)
                                }
                                className="flex h-10 w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                <option value="Research">
                                    Research / Study
                                </option>
                                <option value="Borrow Books">
                                    Borrow / Return Books
                                </option>
                                <option value="Computer Use">
                                    Computer / Internet Use
                                </option>
                                <option value="Printing">
                                    Printing Services
                                </option>
                                <option value="Reading">Leisure Reading</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <Label className="text-slate-300 text-xs uppercase tracking-wider">
                                    Signature (Optional)
                                </Label>
                                <button
                                    type="button"
                                    onClick={() => sigPad.current?.clear()}
                                    className="text-[10px] text-amber-500 hover:underline"
                                >
                                    Clear
                                </button>
                            </div>
                            <div className="bg-white rounded-md overflow-hidden">
                                <SignatureCanvas
                                    ref={sigPad}
                                    canvasProps={{ className: "w-full h-24" }}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full h-14 text-lg bg-amber-600 hover:bg-amber-500 text-white shadow-md"
                        >
                            {processing ? "Logging..." : "Log Time In"}
                        </Button>
                    </form>
                </div>
            </div>

            {/* Right Side: Active Visitors Grid */}
            <div className="w-full md:w-7/12 lg:w-2/3 p-8 md:p-12 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-stone-800 flex items-center">
                        <Users className="w-6 h-6 mr-3 text-stone-500" />{" "}
                        Currently Inside
                    </h2>
                    <div className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-bold flex items-center shadow-sm border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2"></span>
                        {activeVisitors.length} Active
                    </div>
                </div>

                {activeVisitors.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                        <UserCheck className="w-16 h-16 mb-4 opacity-50" />
                        <p className="text-lg">
                            No active visitors at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {activeVisitors.map((visitor) => (
                            <Card
                                key={visitor.id}
                                className="border-stone-200 shadow-sm hover:shadow-md transition-shadow bg-white"
                            >
                                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                                    <div className="truncate pr-2">
                                        <CardTitle className="text-base font-bold text-stone-800 truncate">
                                            {visitor.visitor_name}
                                        </CardTitle>
                                        <p className="text-xs text-stone-500 mt-0.5 truncate">
                                            {visitor.address}
                                        </p>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center text-[10px] text-stone-500 bg-stone-100 px-2 py-1 rounded">
                                            <Clock className="w-3 h-3 mr-1" />
                                            In at{" "}
                                            {new Date(
                                                visitor.time_in,
                                            ).toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                handleTimeOut(visitor.id)
                                            }
                                            className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] h-7 px-3"
                                        >
                                            Time Out
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* SECRET STAFF LOGOUT BUTTON */}
            <button
                onClick={() => router.post(route("logout"))}
                className="absolute bottom-4 right-6 text-stone-300 hover:text-stone-500 transition-colors focus:outline-none"
                title="Staff Access"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
}
