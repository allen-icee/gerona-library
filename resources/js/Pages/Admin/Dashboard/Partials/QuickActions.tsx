// resources/js/Pages/Admin/Dashboard/Partials/QuickActions.tsx

import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export default function QuickActions() {
    return (
        <div>
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-4 ml-1">
                Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <Link
                    href={route("admin.kiosk.index")}
                    className="flex flex-col items-center justify-center p-5 bg-white border border-stone-200 rounded-2xl hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100/50 transition-all group"
                >
                    <div className="bg-emerald-50 p-3.5 rounded-xl group-hover:bg-linear-to-br group-hover:from-emerald-400 group-hover:to-emerald-600 group-hover:text-white transition-all mb-3 text-emerald-500 shadow-sm">
                        <Icon icon="lucide:monitor-play" className="w-7 h-7" />
                    </div>
                    <span className="font-bold text-xs text-stone-600 group-hover:text-emerald-700 uppercase tracking-wider">
                        Active Kiosk
                    </span>
                </Link>

                <Link
                    href={route("patrons.index")}
                    className="flex flex-col items-center justify-center p-5 bg-white border border-stone-200 rounded-2xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all group"
                >
                    <div className="bg-blue-50 p-3.5 rounded-xl group-hover:bg-linear-to-br group-hover:from-blue-400 group-hover:to-blue-600 group-hover:text-white transition-all mb-3 text-blue-500 shadow-sm">
                        <Icon icon="solar:users-group-two-rounded-bold-duotone" className="w-7 h-7" />
                    </div>
                    <span className="font-bold text-xs text-stone-600 group-hover:text-blue-700 uppercase tracking-wider">
                        Patrons
                    </span>
                </Link>

                <Link
                    href={route("circulation.index")}
                    className="flex flex-col items-center justify-center p-5 bg-white border border-stone-200 rounded-2xl hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 transition-all group"
                >
                    <div className="bg-rose-50 p-3.5 rounded-xl group-hover:bg-linear-to-br group-hover:from-rose-400 group-hover:to-rose-600 group-hover:text-white transition-all mb-3 text-rose-500 shadow-sm">
                        <Icon icon="solar:round-transfer-horizontal-bold-duotone" className="w-7 h-7" />
                    </div>
                    <span className="font-bold text-xs text-stone-600 group-hover:text-rose-700 uppercase tracking-wider">
                        Circulation
                    </span>
                </Link>

                <Link
                    href={route("print-services.index")}
                    className="flex flex-col items-center justify-center p-5 bg-white border border-stone-200 rounded-2xl hover:border-fuchsia-300 hover:shadow-lg hover:shadow-fuchsia-100/50 transition-all group"
                >
                    <div className="bg-fuchsia-50 p-3.5 rounded-xl group-hover:bg-linear-to-br group-hover:from-fuchsia-400 group-hover:to-fuchsia-600 group-hover:text-white transition-all mb-3 text-fuchsia-500 shadow-sm">
                        <Icon icon="solar:printer-minimalistic-bold-duotone" className="w-7 h-7" />
                    </div>
                    <span className="font-bold text-xs text-stone-600 group-hover:text-fuchsia-700 uppercase tracking-wider">
                        Print Station
                    </span>
                </Link>

            </div>
        </div>
    );
}