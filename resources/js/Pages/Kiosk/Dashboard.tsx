import { Head, usePage, useForm, router } from "@inertiajs/react";
import { PageProps } from "@/types";
import { FormEventHandler, useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";

// Shadcn UI Components
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

export default function Dashboard() {
    // 1. Grab the active visitors from Laravel
    const { activeVisitors = [] } = usePage<
        PageProps & { activeVisitors: any[] }
    >().props;

    // 2. State for the Signature Pad and Time Out Search
    const sigPad = useRef<SignatureCanvas>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // 3. Instantly filter visitors as the user types
    const filteredVisitors = activeVisitors.filter((v) =>
        v.visitor_name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    // 4. Form handling for the Time In tab
    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        recentlySuccessful,
        transform,
    } = useForm({
        visitor_name: "",
        address: "",
        school: "",
        contact_number: "",
        purpose: "",
        signature: "",
    });

    transform((currentData) => ({
        ...currentData,
        signature: sigPad.current?.isEmpty()
            ? ""
            : sigPad.current?.getTrimmedCanvas().toDataURL("image/png"),
    }));

    const submitVisitorLog: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("visitor-logs.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                sigPad.current?.clear();
            },
        });
    };

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 sm:p-8 relative">
            <Head title="Library Kiosk" />

            <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[800px] border border-stone-200">
                {/* LEFT SIDE - The "Librarian Vibe" Branding */}
                <div className="md:w-5/12 bg-slate-900 text-stone-100 p-12 flex flex-col justify-center relative">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-400 to-transparent"></div>
                    <div className="relative z-10 space-y-6">
                        <div className="w-16 h-1 bg-amber-600 mb-8"></div>
                        <h1 className="text-5xl font-serif font-bold leading-tight tracking-tight">
                            Gerona Municipal Library
                        </h1>
                        <p className="text-xl text-stone-400 font-serif italic">
                            Where knowledge meets the community.
                        </p>
                        <p className="text-stone-300 mt-8 leading-relaxed">
                            Please sign the registry before entering the reading
                            rooms. Your information helps us secure funding to
                            bring more books to our municipality.
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE - The Interactive Forms */}
                <div className="md:w-7/12 bg-[#FDFCF8] p-8 md:p-12 overflow-y-auto">
                    <Tabs defaultValue="time-in" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 h-14 bg-stone-200/50">
                            <TabsTrigger
                                value="time-in"
                                className="text-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                Time In
                            </TabsTrigger>
                            <TabsTrigger
                                value="time-out"
                                className="text-lg font-semibold data-[state=active]:bg-white data-[state=active]:shadow-sm"
                            >
                                Time Out
                            </TabsTrigger>
                        </TabsList>

                        {/* ================= TIME IN TAB ================= */}
                        <TabsContent
                            value="time-in"
                            className="focus-visible:outline-none"
                        >
                            <Card className="border-none shadow-none bg-transparent">
                                <CardHeader className="px-0 pt-0">
                                    <CardTitle className="text-3xl font-serif text-stone-800">
                                        Visitor Registry
                                    </CardTitle>
                                    <CardDescription className="text-stone-500 text-base">
                                        Please fill out all required fields to
                                        begin your visit.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="px-0">
                                    {recentlySuccessful && (
                                        <div className="mb-6 p-4 bg-emerald-100/50 border border-emerald-200 text-emerald-800 text-center font-medium rounded-lg">
                                            Visit logged successfully. Enjoy
                                            your reading!
                                        </div>
                                    )}

                                    <form
                                        onSubmit={submitVisitorLog}
                                        className="space-y-5"
                                    >
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="visitor_name"
                                                className="text-stone-700"
                                            >
                                                Full Name *
                                            </Label>
                                            <Input
                                                id="visitor_name"
                                                className="h-12 bg-white"
                                                value={data.visitor_name}
                                                onChange={(e) =>
                                                    setData(
                                                        "visitor_name",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                placeholder="e.g., Juan Dela Cruz"
                                            />
                                            {errors.visitor_name && (
                                                <p className="text-sm text-red-600">
                                                    {errors.visitor_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="address"
                                                className="text-stone-700"
                                            >
                                                Address (Barangay/Municipality)
                                                *
                                            </Label>
                                            <Input
                                                id="address"
                                                className="h-12 bg-white"
                                                value={data.address}
                                                onChange={(e) =>
                                                    setData(
                                                        "address",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                                placeholder="e.g., Brgy. Poblacion"
                                            />
                                            {errors.address && (
                                                <p className="text-sm text-red-600">
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="school"
                                                    className="text-stone-700"
                                                >
                                                    School{" "}
                                                    <span className="text-stone-400 font-normal">
                                                        (Optional)
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="school"
                                                    className="h-12 bg-white"
                                                    value={data.school}
                                                    onChange={(e) =>
                                                        setData(
                                                            "school",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g., GNHS"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="contact_number"
                                                    className="text-stone-700"
                                                >
                                                    Contact Number{" "}
                                                    <span className="text-stone-400 font-normal">
                                                        (Optional)
                                                    </span>
                                                </Label>
                                                <Input
                                                    id="contact_number"
                                                    className="h-12 bg-white"
                                                    value={data.contact_number}
                                                    onChange={(e) =>
                                                        setData(
                                                            "contact_number",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="0912..."
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="purpose"
                                                className="text-stone-700"
                                            >
                                                Purpose of Visit *
                                            </Label>
                                            <select
                                                id="purpose"
                                                className="flex h-12 w-full items-center justify-between rounded-md border border-stone-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2"
                                                value={data.purpose}
                                                onChange={(e) =>
                                                    setData(
                                                        "purpose",
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            >
                                                <option value="" disabled>
                                                    Select a purpose...
                                                </option>
                                                <option value="Study">
                                                    Study
                                                </option>
                                                <option value="Research">
                                                    Research / Assignment
                                                </option>
                                                <option value="Read Books">
                                                    Read Books
                                                </option>
                                                <option value="Print / Computer Use">
                                                    Print / Computer Use
                                                </option>
                                                <option value="Other">
                                                    Other
                                                </option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-stone-700">
                                                    Signature{" "}
                                                    <span className="text-stone-400 font-normal">
                                                        (Optional)
                                                    </span>
                                                </Label>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        sigPad.current?.clear()
                                                    }
                                                    className="text-xs text-amber-600 hover:underline"
                                                >
                                                    Clear Canvas
                                                </button>
                                            </div>
                                            <div className="border border-stone-200 rounded-md bg-white overflow-hidden shadow-sm">
                                                <SignatureCanvas
                                                    ref={sigPad}
                                                    canvasProps={{
                                                        className:
                                                            "w-full h-28",
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white shadow-md"
                                        >
                                            {processing
                                                ? "Recording Entry..."
                                                : "Log Time In"}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* ================= TIME OUT TAB ================= */}
                        <TabsContent
                            value="time-out"
                            className="focus-visible:outline-none"
                        >
                            <Card className="border-none shadow-none bg-transparent">
                                <CardHeader className="px-0 pt-0">
                                    <CardTitle className="text-3xl font-serif text-stone-800">
                                        Log Departure
                                    </CardTitle>
                                    <CardDescription className="text-stone-500 text-base">
                                        Search for your name to log your time
                                        out.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="px-0 space-y-6">
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="search"
                                            className="text-stone-700"
                                        >
                                            Search Name
                                        </Label>
                                        <Input
                                            id="search"
                                            type="text"
                                            className="h-14 bg-white text-lg"
                                            placeholder="Type your name..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            autoComplete="off"
                                        />
                                    </div>

                                    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden min-h-[300px] max-h-[400px] overflow-y-auto">
                                        {filteredVisitors.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-[300px] text-stone-400 space-y-3">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="40"
                                                    height="40"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle
                                                        cx="11"
                                                        cy="11"
                                                        r="8"
                                                    />
                                                    <path d="m21 21-4.3-4.3" />
                                                </svg>
                                                <p>No active sessions found.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-stone-100">
                                                {filteredVisitors.map(
                                                    (visitor) => (
                                                        <div
                                                            key={visitor.id}
                                                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-stone-50 transition-colors gap-4"
                                                        >
                                                            <div>
                                                                <h4 className="font-semibold text-stone-800 text-lg">
                                                                    {
                                                                        visitor.visitor_name
                                                                    }
                                                                </h4>
                                                                <p className="text-sm text-stone-500">
                                                                    {
                                                                        visitor.address
                                                                    }{" "}
                                                                    • Time In:{" "}
                                                                    {new Date(
                                                                        visitor.time_in,
                                                                    ).toLocaleTimeString(
                                                                        [],
                                                                        {
                                                                            hour: "2-digit",
                                                                            minute: "2-digit",
                                                                        },
                                                                    )}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                onClick={() =>
                                                                    router.patch(
                                                                        route(
                                                                            "visitor-logs.checkout",
                                                                            visitor.id,
                                                                        ),
                                                                    )
                                                                }
                                                                variant="outline"
                                                                className="border-amber-600 text-amber-700 hover:bg-amber-50 hover:text-amber-800 min-w-[100px]"
                                                            >
                                                                Log Out
                                                            </Button>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
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
