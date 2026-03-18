// resources/js/Pages/Admin/Dashboard/Partials/DashboardHeader.tsx
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

export default function DashboardHeader({ user }: { user: { name: string } }) {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hour = currentTime.getHours();
    let greeting = "Good evening";
    let iconName = "solar:moon-stars-bold-duotone";
    let iconColor = "text-indigo-500";
    let bgGradient = "from-indigo-500 to-purple-600";

    if (hour < 12) {
        greeting = "Good morning";
        iconName = "solar:sun-2-bold-duotone";
        iconColor = "text-amber-500";
        bgGradient = "from-amber-400 to-orange-500";
    } else if (hour < 18) {
        greeting = "Good afternoon";
        iconName = "solar:sun-fog-bold-duotone";
        iconColor = "text-orange-500";
        bgGradient = "from-orange-400 to-rose-500";
    }

    return (
        <div className="relative overflow-hidden flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-sm">

            <div className={`absolute top-0 right-0 w-64 h-64 bg-linear-to-br ${bgGradient} opacity-[0.03] rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none`}></div>

            <div className="flex items-center gap-5 z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm shrink-0 bg-linear-to-br ${bgGradient} bg-opacity-10 text-white`}>
                    <Icon icon={iconName} className="w-8 h-8 drop-shadow-sm" />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                        {greeting}, <span className="text-transparent bg-clip-text bg-linear-to-r from-rose-500 to-pink-600">{user.name}</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium mt-1">
                        Here is what is happening at the Gerona Municipal Library today.
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full xl:w-auto z-10">

                <div className="flex items-center gap-2.5 bg-rose-50/50 border border-rose-100 text-rose-700 px-4 py-2.5 rounded-2xl w-full sm:w-auto">
                    <Icon icon="solar:calendar-minimalistic-bold-duotone" className="w-5 h-5 text-rose-500" />
                    <span className="font-bold text-sm tracking-wide">
                        {currentTime.toLocaleDateString("en-PH", {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </span>
                </div>

                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 text-slate-700 px-4 py-2.5 rounded-2xl w-full sm:w-auto shadow-sm">
                    <Icon icon="solar:clock-circle-bold-duotone" className="w-5 h-5 text-slate-400" />
                    <span className="font-black font-mono text-base tracking-widest text-slate-800">
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