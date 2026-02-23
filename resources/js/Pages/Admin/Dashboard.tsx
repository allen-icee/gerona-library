import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";

export default function Dashboard() {
    const user = usePage<PageProps>().props.auth.user;

    return (
        <AdminLayout>
            <Head title="Admin Dashboard" />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Welcome Card */}
                <Card className="border-stone-200 shadow-sm">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-2xl font-bold text-stone-800">
                            Welcome back, {user.name}!
                        </CardTitle>
                        <CardDescription className="text-base text-stone-500">
                            Here is an overview of the Gerona Municipal Library
                            today.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-stone-600">
                            Your security clearance is currently set to:{" "}
                            <span className="font-bold text-amber-600">
                                {user.roles[0]}
                            </span>
                            .
                        </p>
                    </CardContent>
                </Card>

                {/* Placeholder for future statistics (Books, Active Borrowers, Daily Visits) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-stone-200 shadow-sm bg-stone-50/50">
                        <CardContent className="p-6">
                            <p className="text-stone-500 text-sm font-medium uppercase tracking-wider">
                                Total Books
                            </p>
                            <h3 className="text-3xl font-bold text-stone-800 mt-2">
                                --
                            </h3>
                        </CardContent>
                    </Card>
                    <Card className="border-stone-200 shadow-sm bg-stone-50/50">
                        <CardContent className="p-6">
                            <p className="text-stone-500 text-sm font-medium uppercase tracking-wider">
                                Active Borrowers
                            </p>
                            <h3 className="text-3xl font-bold text-stone-800 mt-2">
                                --
                            </h3>
                        </CardContent>
                    </Card>
                    <Card className="border-stone-200 shadow-sm bg-stone-50/50">
                        <CardContent className="p-6">
                            <p className="text-stone-500 text-sm font-medium uppercase tracking-wider">
                                Today's Visitors
                            </p>
                            <h3 className="text-3xl font-bold text-stone-800 mt-2">
                                --
                            </h3>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
