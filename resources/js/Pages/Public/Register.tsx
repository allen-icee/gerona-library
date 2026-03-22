// resources/js/Pages/Public/Register.tsx

import { useState, useEffect } from "react";
import { useForm, usePage, Head } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import PublicLayout from "@/Layouts/PublicLayout";
import Lottie from "lottie-react";
import registerAnimation from "@/assets/lottie/qr-scan.json";
import SuffixSelect from "@/Components/SuffixSelect";
import CustomSelect from "@/Components/CustomSelect";
import SearchableSelect from "@/Components/SearchableSelect";
import SuccessCardModal from "@/Components/Public/Modals/SuccessCardModal";

const PATRON_TYPES = ["Citizen", "Student", "Teacher/LGU Staff"];
const GENDERS = ["Male", "Female", "Other"];

export default function Register() {
    const { props } = usePage<any>();
    const flash = props.flash || {};
    const isSuccess = !!flash.patron;

    const { data, setData, post, processing, errors, reset } = useForm({
        first_name: "",
        middle_initial: "",
        last_name: "",
        suffix: "",
        email: "",
        type: "Citizen",
        gender: "Male",
        province: "",
        municipality: "",
        barangay: "",
        street: "",
        school: "",
        contact_number: "",
    });

    const [locationData, setLocationData] = useState<any>(null);
    const [provinces, setProvinces] = useState<string[]>([]);
    const [municipalities, setMunicipalities] = useState<string[]>([]);
    const [barangays, setBarangays] = useState<string[]>([]);

    useEffect(() => {
        fetch("/data/locations.json")
            .then((res) => res.json())
            .then((json) => {
                setLocationData(json);
                const provList: string[] = [];
                Object.keys(json).forEach((regionKey) => {
                    const provs = Object.keys(json[regionKey].province_list);
                    provList.push(...provs);
                });
                setProvinces(provList.sort());
            });
    }, []);

    const handleProvinceChange = (prov: string) => {
        setData("province", prov);
        setData("municipality", "");
        setData("barangay", "");
        setBarangays([]);

        if (!prov || !locationData) {
            setMunicipalities([]);
            return;
        }

        for (const regionKey in locationData) {
            const provs = locationData[regionKey].province_list;
            if (provs[prov]) {
                setMunicipalities(
                    Object.keys(provs[prov].municipality_list).sort(),
                );
                break;
            }
        }
    };

    const handleMunicipalityChange = (mun: string) => {
        setData("municipality", mun);
        setData("barangay", "");

        if (!mun || !locationData || !data.province) {
            setBarangays([]);
            return;
        }

        for (const regionKey in locationData) {
            const provs = locationData[regionKey].province_list;
            if (provs[data.province]) {
                const muns = provs[data.province].municipality_list;
                if (muns[mun]) {
                    setBarangays(muns[mun].barangay_list.sort());
                    break;
                }
            }
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        post(route("register-patron.store"), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            const target = e.target as HTMLElement;
            if (target.tagName === "BUTTON") return;
            if (e.defaultPrevented) return;
            e.preventDefault();

            const form = e.currentTarget;
            const focusableElements = Array.from(
                form.querySelectorAll(
                    'input:not([disabled]), select:not([disabled]), button[type="submit"]',
                ),
            ) as HTMLElement[];

            const index = focusableElements.indexOf(target);
            if (index > -1 && index < focusableElements.length - 1) {
                focusableElements[index + 1].focus();
            }
        }
    };

    const inputClass =
        "w-full bg-stone-50 border border-stone-200 rounded-xl h-12 px-4 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all";

    return (
        <PublicLayout>
            <Head title="Library Card Registration - Gerona Library" />

            <SuccessCardModal
                isOpen={isSuccess}
                onClose={() => window.location.reload()}
                patronData={flash.patron}
            />

            <div className="flex flex-col gap-6 md:gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 w-full py-2">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6 pb-6 border-b border-amber-100">
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full font-potta text-[10px] uppercase tracking-widest border border-amber-100 shadow-sm mb-3 md:mb-2">
                            <Icon
                                icon="solar:card-bold-duotone"
                                className="w-3 h-3 text-amber-500"
                            />
                            Library Service
                        </div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-slate-800 tracking-tight leading-tight">
                            Library Card{" "}
                            <span className="text-transparent bg-clip-text bg-linear-to-r from-amber-400 to-orange-500">
                                Registration
                            </span>
                        </h1>

                        <p className="text-sm text-stone-500 font-medium mt-1.5 md:mt-2">
                            Register and instantly receive your digital QR
                            library card.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    <aside className="lg:col-span-4 flex flex-col gap-6 w-full">
                        <div className="bg-white rounded-3xl border border-amber-100 p-5 md:p-6 shadow-sm space-y-5">
                            <h3 className="font-serif font-black text-lg text-slate-800 flex items-center gap-2">
                                <Icon
                                    icon="solar:info-circle-bold-duotone"
                                    className="w-5 h-5 text-amber-500"
                                />
                                How It Works
                            </h3>

                            <ul className="text-sm text-stone-600 space-y-4">
                                <li className="flex gap-3 items-start">
                                    <Icon
                                        icon="solar:pen-bold-duotone"
                                        className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
                                    />
                                    <span className="leading-relaxed">
                                        Fill out the registration form with your
                                        complete details.
                                    </span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Icon
                                        icon="solar:letter-bold-duotone"
                                        className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
                                    />
                                    <span className="leading-relaxed">
                                        Ensure your email address is active to
                                        receive notifications.
                                    </span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Icon
                                        icon="solar:qr-code-bold-duotone"
                                        className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
                                    />
                                    <span className="leading-relaxed">
                                        Submit to instantly generate your
                                        digital QR library card.
                                    </span>
                                </li>
                                <li className="flex gap-3 items-start">
                                    <Icon
                                        icon="solar:smartphone-bold-duotone"
                                        className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
                                    />
                                    <span className="leading-relaxed">
                                        Save or screenshot your QR code for
                                        kiosk and borrowing access.
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-amber-50/50 rounded-3xl border border-amber-100 shadow-sm overflow-hidden flex justify-center items-center w-full h-64 md:h-72">
                            <Lottie
                                animationData={registerAnimation}
                                loop={true}
                                className="w-full h-full object-contain scale-[1.8] hover:scale-[1.9] transition-transform duration-500"
                            />
                        </div>
                    </aside>

                    <section className="lg:col-span-8 w-full">
                        <div className="bg-white border border-amber-100 rounded-3xl p-5 md:p-8 shadow-sm">
                            <form
                                onSubmit={submit}
                                onKeyDown={handleFormKeyDown}
                                className="space-y-5 md:space-y-6"
                            >
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-12 md:col-span-5">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.first_name}
                                            onChange={(e) =>
                                                setData(
                                                    "first_name",
                                                    e.target.value.replace(
                                                        /[^a-zA-ZñÑ\s\-,]/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="e.g. Maria Theresa"
                                            required
                                        />
                                        {errors.first_name && (
                                            <span className="text-rose-500 text-xs mt-1 block">
                                                {errors.first_name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="col-span-6 md:col-span-2">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block text-center">
                                            M.I.
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={2}
                                            value={data.middle_initial}
                                            onChange={(e) =>
                                                setData(
                                                    "middle_initial",
                                                    e.target.value
                                                        .replace(
                                                            /[^a-zA-ZñÑ]/g,
                                                            "",
                                                        )
                                                        .toUpperCase(),
                                                )
                                            }
                                            placeholder="e.g. C"
                                            className={`${inputClass} text-center px-1`}
                                        />
                                    </div>

                                    <div className="col-span-12 md:col-span-3">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.last_name}
                                            onChange={(e) =>
                                                setData(
                                                    "last_name",
                                                    e.target.value.replace(
                                                        /[^a-zA-ZñÑ\s\-,]/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            placeholder="e.g. Yu"
                                            className={inputClass}
                                            required
                                        />
                                        {errors.last_name && (
                                            <span className="text-rose-500 text-xs mt-1 block">
                                                {errors.last_name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="col-span-6 md:col-span-2 pt-0.5">
                                        <SuffixSelect
                                            value={data.suffix}
                                            onChange={(val) =>
                                                setData("suffix", val)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="z-30 relative">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                            Patron Type *
                                        </label>
                                        <CustomSelect
                                            value={data.type}
                                            onChange={(val) =>
                                                setData("type", val)
                                            }
                                            options={PATRON_TYPES}
                                            error={errors.type}
                                        />
                                    </div>

                                    <div className="z-20 relative">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                            Gender *
                                        </label>
                                        <CustomSelect
                                            value={data.gender}
                                            onChange={(val) =>
                                                setData("gender", val)
                                            }
                                            options={GENDERS}
                                            error={errors.gender}
                                        />
                                    </div>
                                </div>

                                {data.type === "Student" && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                            School *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.school}
                                            onChange={(e) =>
                                                setData(
                                                    "school",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g. Gerona National High School"
                                            className={inputClass}
                                            required={data.type === "Student"}
                                        />
                                        {errors.school && (
                                            <span className="text-rose-500 text-xs mt-1 block">
                                                {errors.school}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                            Email Address *
                                        </label>
                                        <div className="flex bg-stone-50 border border-stone-200 rounded-xl overflow-hidden focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all h-12">
                                            <input
                                                type="text"
                                                value={
                                                    data.email
                                                        ? data.email.replace(
                                                              "@gmail.com",
                                                              "",
                                                          )
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        "email",
                                                        `${e.target.value.replace(/@.*$/, "")}@gmail.com`,
                                                    )
                                                }
                                                className="w-full bg-transparent border-none outline-none px-4 text-sm focus:ring-0"
                                                required
                                                placeholder="juandelacruz"
                                            />
                                            <div className="flex items-center justify-center px-4 bg-stone-100 text-stone-500 text-[11px] font-bold tracking-wider border-l border-stone-200 select-none">
                                                @gmail.com
                                            </div>
                                        </div>
                                        {errors.email && (
                                            <span className="text-rose-500 text-xs mt-1 block">
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                            Contact Number (11 Digits)
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={11}
                                            value={data.contact_number}
                                            onChange={(e) =>
                                                setData(
                                                    "contact_number",
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        "",
                                                    ),
                                                )
                                            }
                                            placeholder="09..."
                                            className={inputClass}
                                        />
                                        {errors.contact_number && (
                                            <span className="text-rose-500 text-xs mt-1 block">
                                                {errors.contact_number}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-4 z-10 relative">
                                    <div>
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                            Province *
                                        </label>
                                        <SearchableSelect
                                            value={data.province}
                                            onChange={(val) =>
                                                handleProvinceChange(val)
                                            }
                                            options={provinces}
                                            placeholder="Select Province"
                                            error={errors.province}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                            Municipality *
                                        </label>
                                        <SearchableSelect
                                            value={data.municipality}
                                            onChange={(val) =>
                                                handleMunicipalityChange(val)
                                            }
                                            options={municipalities}
                                            placeholder="Select Municipality"
                                            disabled={!data.province}
                                            error={errors.municipality}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                            Barangay *
                                        </label>
                                        <SearchableSelect
                                            value={data.barangay}
                                            onChange={(val) =>
                                                setData("barangay", val)
                                            }
                                            options={barangays}
                                            placeholder="Select Barangay"
                                            disabled={!data.municipality}
                                            error={errors.barangay}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5 block">
                                        Street / House No. (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.street}
                                        onChange={(e) =>
                                            setData("street", e.target.value)
                                        }
                                        placeholder="House No. / Street Name"
                                        className={inputClass}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full font-bold md:font-black h-12 md:h-14 text-sm md:text-base rounded-2xl transition-all duration-300 bg-linear-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white shadow-lg shadow-amber-200/50 hover:shadow-xl hover:-translate-y-0.5 border-0 flex items-center justify-center gap-2 mt-6 md:mt-8"
                                >
                                    {processing ? (
                                        <Icon
                                            icon="solar:spinner-bold-duotone"
                                            className="w-6 h-6 animate-spin"
                                        />
                                    ) : (
                                        <>
                                            <Icon
                                                icon="solar:qr-code-bold-duotone"
                                                className="w-5 h-5 md:w-6 md:h-6"
                                            />
                                            Generate My QR Card
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </PublicLayout>
    );
}
