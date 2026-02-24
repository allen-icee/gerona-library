import { FormEventHandler } from "react";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import { Library, UserPlus, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";

export default function RegisterPatron() {
    // We grab the flash session data from the controller to show the new ID!
    const { flash } = usePage<any>().props;

    const {
        data,
        setData,
        post,
        processing,
        errors,
        recentlySuccessful,
        reset,
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

    return (
        <div className="min-h-screen bg-stone-100 flex items-center justify-center p-4 py-10">
            <Head title="Register Library Card" />

            <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden border border-stone-200">
                <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 to-transparent"></div>
                    <UserPlus className="w-12 h-12 text-amber-500 mx-auto mb-4 relative z-10" />
                    <h1 className="text-3xl font-serif font-bold text-white relative z-10">
                        Get Your Library Card
                    </h1>
                    <p className="text-stone-300 mt-2 relative z-10">
                        Register to borrow books and use the fast-lane print
                        station.
                    </p>
                </div>

                <div className="p-8">
                    {/* If registration is successful, show the digital ID card! */}
                    {recentlySuccessful || flash?.success ? (
                        <div className="text-center py-6 space-y-5 animate-in fade-in zoom-in duration-500">
                            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                            <div>
                                <h2 className="text-2xl font-bold text-stone-800">
                                    Registration Complete!
                                </h2>
                                <p className="text-stone-600 mt-1">
                                    Please screenshot your Library Card Number
                                    below.
                                </p>
                            </div>

                            <div className="bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl p-6 my-6">
                                <p className="text-sm font-semibold text-amber-800 uppercase tracking-widest mb-1">
                                    Your Patron ID
                                </p>
                                <p className="text-4xl font-mono font-bold text-amber-600">
                                    {flash?.new_patron_id || "PAT-XXXXX"}
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 mt-6">
                                <Link
                                    href={route("print-station.index")}
                                    className="w-full"
                                >
                                    <Button className="w-full h-12 text-base bg-slate-900 hover:bg-slate-800 text-white">
                                        Go to Print Station
                                    </Button>
                                </Link>
                                <Link
                                    href={route("catalog.index")}
                                    className="w-full"
                                >
                                    <Button
                                        variant="outline"
                                        className="w-full h-12 text-base"
                                    >
                                        Browse Catalog
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form
                            onSubmit={submitRegistration}
                            className="space-y-5"
                        >
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-stone-700"
                                >
                                    Full Name *
                                </Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                    placeholder="e.g., Juan Dela Cruz"
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="type"
                                    className="text-stone-700 font-semibold"
                                >
                                    Patron Type *
                                </Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="flex h-10 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="Student">Student</option>
                                    <option value="Teacher">
                                        Teacher / Educator
                                    </option>
                                    <option value="LGU Employee">
                                        LGU Employee
                                    </option>
                                    <option value="Professional">
                                        Professional
                                    </option>
                                    <option value="Citizen">
                                        Resident / Citizen
                                    </option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="contact_number"
                                    className="text-stone-700"
                                >
                                    Contact Number *
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
                                    placeholder="09XX XXX XXXX"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="address"
                                    className="text-stone-700"
                                >
                                    School or Barangay *
                                </Label>
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    required
                                    placeholder="e.g., Gerona National High School"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 text-lg bg-amber-600 hover:bg-amber-500 text-white shadow-md mt-4"
                            >
                                {processing
                                    ? "Registering..."
                                    : "Create Library Card"}
                            </Button>

                            <div className="text-center pt-4">
                                <Link
                                    href={route("catalog.index")}
                                    className="text-sm font-medium text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                                    to Catalog
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
