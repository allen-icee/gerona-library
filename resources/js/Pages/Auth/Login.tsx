// resources/js/Pages/Auth/Login.tsx

import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";
import { Icon } from "@iconify/react";

export default function Login({
    status,
}: {
    status?: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: "",
        password: "",
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Login" />

            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-pink-50 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-pink-100">
                    <Icon icon="solar:book-bookmark-bold" className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Welcome Back Head Librarian</h2>
            </div>

            {status && (
                <div className="mb-6 text-sm font-bold text-emerald-600 bg-emerald-50 p-4 rounded-2xl text-center border border-emerald-100 flex items-center justify-center gap-2">
                    <Icon icon="solar:check-circle-bold-duotone" className="w-5 h-5" />
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <label htmlFor="username" className="text-xs font-bold text-stone-600 uppercase mb-1.5 block">
                        Username
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Icon icon="solar:user-bold-duotone" className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            value={data.username}
                            className="pl-11 w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-pink-400 focus:ring focus:ring-pink-100 transition-all font-medium text-slate-800"
                            autoComplete="username"
                            autoFocus
                            placeholder="Enter your username"
                            onChange={(e) => setData("username", e.target.value)}
                        />
                    </div>
                    {errors.username && (
                        <span className="text-rose-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                            <Icon icon="solar:danger-triangle-bold-duotone" /> {errors.username}
                        </span>
                    )}
                </div>

                <div>
                    <label htmlFor="password" className="text-xs font-bold text-stone-600 uppercase mb-1.5 block">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Icon icon="solar:lock-password-bold-duotone" className="h-5 w-5 text-stone-400" />
                        </div>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="pl-11 w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3.5 text-sm focus:border-pink-400 focus:ring focus:ring-pink-100 transition-all font-medium text-slate-800"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            onChange={(e) => setData("password", e.target.value)}
                        />
                    </div>
                    {errors.password && (
                        <span className="text-rose-500 text-xs font-bold mt-1.5 flex items-center gap-1">
                            <Icon icon="solar:danger-triangle-bold-duotone" /> {errors.password}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-pink-500 text-white font-black tracking-wide text-sm py-4 rounded-xl hover:bg-pink-600 transition-all flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(236,72,153,0.3)] hover:shadow-[0_8px_20px_rgba(236,72,153,0.4)] hover:-translate-y-0.5 mt-4 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                    {processing ? (
                        <Icon icon="solar:spinner-bold-duotone" className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            Login
                            <Icon icon="solar:alt-arrow-right-bold-duotone" className="w-5 h-5" />
                        </>
                    )}
                </button>
            </form>
        </GuestLayout>
    );
}