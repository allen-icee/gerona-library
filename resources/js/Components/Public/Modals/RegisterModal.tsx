import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { QRCodeSVG } from "qrcode.react";

interface Props {
    isOpen: boolean;
    onClose: (value: boolean) => void;
}

export default function RegisterModal({ isOpen, onClose }: Props) {
    const { props } = usePage<any>();
    const flash = props.flash || {};

    // If flash data has a library card number, it means registration was successful!
    const isSuccess = !!flash.library_card_number;

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            first_name: "",
            last_name: "",
            type: "General Public",
            contact_number: "",
            school_or_barangay: "",
        });

    // Reset everything when the modal closes
    const handleClose = () => {
        onClose(false);
        setTimeout(() => {
            reset();
            clearErrors();
            // Clear flash data visually by reloading the page state without it (optional, but good UX)
        }, 300);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("register-patron.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-[9999]"
                onClose={handleClose}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-rose-950/40 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95 translate-y-8"
                            enterTo="opacity-100 scale-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100 translate-y-0"
                            leaveTo="opacity-0 scale-95 translate-y-8"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white p-6 md:p-8 text-left align-middle shadow-[0_20px_60px_rgba(0,0,0,0.15)] border-4 border-pink-100 transition-all relative">
                                {/* Close Button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors"
                                >
                                    <Icon
                                        icon="solar:close-circle-bold"
                                        className="w-6 h-6"
                                    />
                                </button>

                                {/* ================= STATE 1: SUCCESS & QR CODE ================= */}
                                {isSuccess ? (
                                    <div className="flex flex-col items-center justify-center py-4 animate-in zoom-in-95 duration-500">
                                        <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mb-4 border-2 border-emerald-200">
                                            <Icon
                                                icon="solar:check-circle-bold-duotone"
                                                className="w-10 h-10"
                                            />
                                        </div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl font-serif font-black text-slate-800 mb-1 text-center"
                                        >
                                            Registration Complete!
                                        </Dialog.Title>
                                        <p className="text-stone-500 text-sm text-center mb-8">
                                            Welcome, {flash.patron_name}! Here
                                            is your official Digital Library
                                            Card. Take a screenshot to save it.
                                        </p>

                                        {/* The Digital Card UI */}
                                        <div className="bg-gradient-to-br from-rose-50 to-pink-100 p-6 rounded-[2rem] border-2 border-pink-200 shadow-inner flex flex-col items-center w-full max-w-[280px]">
                                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-pink-100 mb-4">
                                                {/* React automatically draws the SVG QR Code here! */}
                                                <QRCodeSVG
                                                    id="qr-code-svg"
                                                    value={
                                                        flash.library_card_number
                                                    }
                                                    size={160}
                                                    level="H"
                                                    includeMargin={true}
                                                    fgColor="#1c1917" // stone-900
                                                />
                                            </div>
                                            <div className="bg-white/80 px-4 py-1.5 rounded-full font-potta text-sm tracking-widest text-rose-600 shadow-sm border border-rose-200">
                                                {flash.library_card_number}
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleClose}
                                            className="mt-8 w-full bg-stone-800 text-white font-bold py-3.5 rounded-2xl hover:bg-stone-700 transition-colors"
                                        >
                                            Done
                                        </button>
                                    </div>
                                ) : (
                                    /* ================= STATE 2: REGISTRATION FORM ================= */
                                    <div className="animate-in fade-in duration-500">
                                        <div className="w-12 h-12 bg-amber-100 text-amber-500 rounded-2xl flex items-center justify-center mb-4 border-2 border-amber-200">
                                            <Icon
                                                icon="fluent-emoji:star"
                                                className="w-6 h-6"
                                            />
                                        </div>
                                        <Dialog.Title
                                            as="h3"
                                            className="text-2xl font-serif font-black text-slate-800 mb-1"
                                        >
                                            Get a Library Card
                                        </Dialog.Title>
                                        <p className="text-stone-500 text-sm mb-6">
                                            Register below to instantly receive
                                            your digital QR code ID.
                                        </p>

                                        <form
                                            onSubmit={submit}
                                            className="space-y-4"
                                        >
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 ml-1">
                                                        First Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.first_name}
                                                        onChange={(e) =>
                                                            setData(
                                                                "first_name",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-0 transition-colors"
                                                        required
                                                    />
                                                    {errors.first_name && (
                                                        <span className="text-rose-500 text-xs mt-1 ml-1">
                                                            {errors.first_name}
                                                        </span>
                                                    )}
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 ml-1">
                                                        Last Name
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={data.last_name}
                                                        onChange={(e) =>
                                                            setData(
                                                                "last_name",
                                                                e.target.value,
                                                            )
                                                        }
                                                        className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-0 transition-colors"
                                                        required
                                                    />
                                                    {errors.last_name && (
                                                        <span className="text-rose-500 text-xs mt-1 ml-1">
                                                            {errors.last_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 ml-1">
                                                    Patron Type
                                                </label>
                                                <select
                                                    value={data.type}
                                                    onChange={(e) =>
                                                        setData(
                                                            "type",
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-0 transition-colors appearance-none"
                                                >
                                                    <option value="General Public">
                                                        General Public
                                                    </option>
                                                    <option value="Student">
                                                        Student
                                                    </option>
                                                    <option value="Teacher">
                                                        Teacher / LGU Staff
                                                    </option>
                                                </select>
                                                {errors.type && (
                                                    <span className="text-rose-500 text-xs mt-1 ml-1">
                                                        {errors.type}
                                                    </span>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 ml-1">
                                                    School / Barangay
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        data.school_or_barangay
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            "school_or_barangay",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="e.g. Brgy. Poblacion"
                                                    className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-0 transition-colors"
                                                    required
                                                />
                                                {errors.school_or_barangay && (
                                                    <span className="text-rose-500 text-xs mt-1 ml-1">
                                                        {
                                                            errors.school_or_barangay
                                                        }
                                                    </span>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-stone-600 uppercase tracking-wider mb-1.5 ml-1">
                                                    Contact Number (Optional)
                                                </label>
                                                <input
                                                    type="text"
                                                    value={data.contact_number}
                                                    onChange={(e) =>
                                                        setData(
                                                            "contact_number",
                                                            e.target.value,
                                                        )
                                                    }
                                                    placeholder="09123456789"
                                                    className="w-full bg-stone-50 border-2 border-stone-200 rounded-xl px-4 py-3 focus:border-amber-400 focus:ring-0 transition-colors"
                                                />
                                                {errors.contact_number && (
                                                    <span className="text-rose-500 text-xs mt-1 ml-1">
                                                        {errors.contact_number}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={processing}
                                                    className="w-full bg-amber-400 text-amber-950 font-black tracking-widest uppercase text-sm py-4 rounded-2xl hover:bg-amber-300 hover:-translate-y-0.5 transition-all shadow-md shadow-amber-200 disabled:opacity-50 flex justify-center items-center gap-2"
                                                >
                                                    {processing ? (
                                                        <Icon
                                                            icon="solar:spinner-bold-duotone"
                                                            className="w-5 h-5 animate-spin"
                                                        />
                                                    ) : (
                                                        "Generate My QR Card"
                                                    )}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
