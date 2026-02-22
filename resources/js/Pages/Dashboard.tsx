import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";

export default function Dashboard() {
    // 1. Grab the current user and their roles from Inertia
    const user = usePage<PageProps>().props.auth.user;

    // 2. Check if the logged-in user is the Kiosk
    const isKiosk = user.roles.includes("Kiosk");

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {isKiosk
                        ? "Library Entrance Kiosk"
                        : "Circulation Dashboard"}
                </h2>
            }
        >
            <Head title={isKiosk ? "Kiosk" : "Dashboard"} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 text-lg">
                            {/* 3. Render completely different UI based on the role! */}
                            {isKiosk ? (
                                <div className="text-center py-10 space-y-4">
                                    <h1 className="text-3xl font-bold text-blue-600">
                                        Welcome to the Gerona Municipal Library
                                    </h1>
                                    <p className="text-gray-500">
                                        Please log your visit on the screen
                                        below.
                                    </p>
                                    {/* Later, we will put the Visitor Form right here */}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <h1 className="text-2xl font-bold">
                                        Welcome back, {user.name}!
                                    </h1>
                                    <p className="text-gray-600">
                                        Security Clearance:{" "}
                                        <span className="font-bold text-indigo-600">
                                            {user.roles[0]}
                                        </span>
                                    </p>
                                    {/* Later, we will put the Book Search and Borrowing Stats here */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
