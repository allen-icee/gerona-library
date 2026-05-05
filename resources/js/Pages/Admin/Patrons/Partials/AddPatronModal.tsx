// resources/js/Pages/Admin/Patrons/Partials/AddPatronModal.tsx

import { useState, useEffect, FormEventHandler } from "react";
import { useForm } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import CustomSelect from "@/Components/CustomSelect";
import SuffixSelect from "@/Components/SuffixSelect";
import SearchableSelect from "@/Components/SearchableSelect";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/Components/ui/dialog";

export default function AddPatronModal() {
    const [isOpen, setIsOpen] = useState(false);

    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            first_name: "",
            middle_initial: "",
            last_name: "",
            suffix: "",
            type: "Citizen",
            email: "",
            gender: "Male",
            province: "",
            municipality: "",
            barangay: "",
            street: "",
            school: "",
            contact_number: "",
            status: "Active",
        });

    // --- JSON LOCATION STATE ---
    const [locationData, setLocationData] = useState<any>(null);
    const [provinces, setProvinces] = useState<string[]>([]);
    const [municipalities, setMunicipalities] = useState<string[]>([]);
    const [barangays, setBarangays] = useState<string[]>([]);

    useEffect(() => {
        if (isOpen && !locationData) {
            fetch("/data/locations.json")
                .then((res) => res.json())
                .then((json) => {
                    setLocationData(json);
                    const provList: string[] = [];
                    Object.keys(json).forEach((regionKey) => {
                        const provs = Object.keys(
                            json[regionKey].province_list,
                        );
                        provList.push(...provs);
                    });
                    setProvinces(provList.sort());
                });
        }
    }, [isOpen]);

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

    const submitNewPatron: FormEventHandler = (e) => {
        e.preventDefault();
        post(route("patrons.store"), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Patron registered successfully!");
                setIsOpen(false);
                reset();
            },
            onError: (err) => {
                toast.error(
                    "Failed to register patron. Please check the form.",
                );
            },
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

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) {
                    reset();
                    clearErrors();
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className="bg-linear-to-r from-fuchsia-400 to-fuchsia-600 hover:from-fuchsia-500 hover:to-fuchsia-700 text-white shadow-md shadow-fuchsia-200 border-none font-bold text-xs h-10 rounded-xl w-full sm:w-auto">
                    <Icon
                        icon="solar:user-plus-bold-duotone"
                        className="w-4 h-4 mr-2"
                    />
                    Register Patron
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-175 bg-white rounded-2xl border-fuchsia-100 shadow-xl shadow-stone-200/50 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <Icon
                            icon="solar:user-id-bold-duotone"
                            className="w-6 h-6 text-fuchsia-500"
                        />
                        Register New Patron
                    </DialogTitle>
                    <DialogDescription className="text-xs text-slate-500 font-medium">
                        Add a new borrower. The system will auto-generate their
                        Library Card Number.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={submitNewPatron}
                    onKeyDown={handleFormKeyDown}
                    className="space-y-5 py-2"
                >
                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 sm:col-span-4 space-y-1.5">
                            <Label
                                htmlFor="first_name"
                                className="text-xs font-bold uppercase text-slate-600"
                            >
                                First Name *
                            </Label>
                            <Input
                                id="first_name"
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
                                required
                                placeholder="e.g. Maria Theresa"
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                            {errors.first_name && (
                                <p className="text-xs text-red-600">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>
                        <div className="col-span-6 sm:col-span-2 space-y-1.5">
                            <Label
                                htmlFor="middle_initial"
                                className="text-xs font-bold uppercase text-slate-600 text-center block"
                            >
                                M.I.
                            </Label>
                            <Input
                                id="middle_initial"
                                maxLength={2}
                                value={data.middle_initial}
                                onChange={(e) =>
                                    setData(
                                        "middle_initial",
                                        e.target.value
                                            .replace(/[^a-zA-ZñÑ]/g, "")
                                            .toUpperCase(),
                                    )
                                }
                                placeholder="e.g. C"
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg text-center"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-4 space-y-1.5">
                            <Label
                                htmlFor="last_name"
                                className="text-xs font-bold uppercase text-slate-600"
                            >
                                Last Name *
                            </Label>
                            <Input
                                id="last_name"
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
                                required
                                placeholder="e.g. Yu"
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                            {errors.last_name && (
                                <p className="text-xs text-red-600">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>
                        <div className="col-span-6 sm:col-span-2 space-y-1.5 pt-1">
                            <SuffixSelect
                                value={data.suffix}
                                onChange={(val) => setData("suffix", val)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 relative z-40">
                            <Label className="text-xs font-bold uppercase text-slate-600">
                                Patron Type *
                            </Label>
                            <CustomSelect
                                id="type"
                                value={data.type}
                                onChange={(val) => setData("type", val)}
                                options={[
                                    "Citizen",
                                    "Student",
                                    "Teacher/LGU Staff",
                                ]}
                                theme="fuchsia"
                            />
                        </div>
                        <div className="space-y-1.5 relative z-30">
                            <Label className="text-xs font-bold uppercase text-slate-600">
                                Gender *
                            </Label>
                            <CustomSelect
                                id="gender"
                                value={data.gender}
                                onChange={(val) => setData("gender", val)}
                                options={["Male", "Female", "Other"]}
                                theme="fuchsia"
                            />
                        </div>
                    </div>

                    {data.type === "Student" && (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                            <Label
                                htmlFor="school"
                                className="text-xs font-bold uppercase text-slate-600"
                            >
                                School *
                            </Label>
                            <Input
                                id="school"
                                value={data.school}
                                onChange={(e) =>
                                    setData(
                                        "school",
                                        e.target.value.replace(
                                            /[^a-zA-Z0-9\s\-\.,#]/g,
                                            "",
                                        ),
                                    )
                                }
                                placeholder="e.g. Gerona National High School"
                                required={data.type === "Student"}
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="email"
                                className="text-xs font-bold uppercase text-slate-600"
                            >
                                Email Address *
                            </Label>
                            <div className="flex items-center border border-fuchsia-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-fuchsia-500 h-10">
                                <input
                                    id="email"
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
                                    required
                                    placeholder="juandelacruz"
                                    className="flex-1 bg-transparent border-none outline-none px-3 text-sm focus:ring-0"
                                />
                                <div className="bg-slate-50 border-l border-fuchsia-200 px-3 h-full flex items-center text-slate-500 text-xs font-bold select-none">
                                    @gmail.com
                                </div>
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-600">
                                    {errors.email}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="contact_number"
                                className="text-xs font-bold uppercase text-slate-600"
                            >
                                Contact #
                            </Label>
                            <Input
                                id="contact_number"
                                maxLength={11}
                                value={data.contact_number}
                                onChange={(e) =>
                                    setData(
                                        "contact_number",
                                        e.target.value.replace(/\D/g, ""),
                                    )
                                }
                                placeholder="09..."
                                className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-20">
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase text-slate-600">
                                Province *
                            </Label>
                            <SearchableSelect
                                id="province"
                                value={data.province}
                                onChange={(val) => handleProvinceChange(val)}
                                options={provinces}
                                placeholder="Select Province"
                                error={errors.province}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase text-slate-600">
                                Municipality *
                            </Label>
                            <SearchableSelect
                                id="municipality"
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
                        <div className="space-y-1.5">
                            <Label className="text-xs font-bold uppercase text-slate-600">
                                Barangay *
                            </Label>
                            <SearchableSelect
                                id="barangay"
                                value={data.barangay}
                                onChange={(val) => setData("barangay", val)}
                                options={barangays}
                                placeholder="Select Barangay"
                                disabled={!data.municipality}
                                error={errors.barangay}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label
                            htmlFor="street"
                            className="text-xs font-bold uppercase text-slate-600"
                        >
                            Street / House No. (Optional)
                        </Label>
                        <Input
                            id="street"
                            value={data.street}
                            onChange={(e) =>
                                setData(
                                    "street",
                                    e.target.value.replace(
                                        /[^a-zA-Z0-9\s\-\.,#]/g,
                                        "",
                                    ),
                                )
                            }
                            placeholder="House No. / Street Name"
                            className="h-10 border-fuchsia-200 focus-visible:ring-fuchsia-500 rounded-lg"
                        />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            className="rounded-xl font-bold text-slate-500 hover:bg-slate-100 border-stone-200"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-linear-to-r from-fuchsia-400 to-fuchsia-500 hover:from-fuchsia-500 hover:to-fuchsia-600 text-white shadow-md font-bold rounded-xl border-none"
                        >
                            {processing ? "Saving..." : "Register Patron"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
