// resources/js/Pages/Admin/Dashboard/Partials/DashboardHeader.tsx

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function DashboardHeader({ user }: { user: { name: string } }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-rose-100 shadow-sm shadow-rose-100/50">
            <div className="flex items-center gap-4">
                <div className="bg-gradient-to-br from-rose-400 to-rose-600 w-14 h-14 rounded-xl flex items-center justify-center shadow-lg shadow-rose-300/50 text-white shrink-0">
                    <Icon icon="solar:widget-5-bold-duotone" className="w-7 h-7" />
                </div>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
                        Welcome back, {user.name} 👋
                    </h1>
                    <p className="text-slate-500 text-xs font-medium mt-1.5">
                        Here is what is happening at the Gerona Municipal Library today.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-inner w-full xl:w-auto">
                <div className="flex items-center gap-2 sm:border-r sm:border-stone-700 pr-4">
                    <Icon icon="solar:calendar-bold-duotone" className="w-5 h-5 text-rose-400" />
                    <span className="font-bold text-sm tracking-wide">
                        {currentTime.toLocaleDateString("en-PH", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                </div>
                <div className="flex items-center gap-2 pl-1">
                    <Icon icon="solar:clock-circle-bold-duotone" className="w-5 h-5 text-emerald-400" />
                    <span className="font-black font-mono text-lg tracking-widest text-emerald-50">
                        {currentTime.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                        })}
                    </span>
                </div>
            </div>
        </div>
    );
}