// resources/js/Components/Public/Modals/ContactModal.tsx
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";
import { Icon } from "@iconify/react";

export default function ContactModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white border-4 border-rose-100 rounded-[2rem] sm:max-w-[420px] p-6 md:p-8 shadow-2xl [&>button]:absolute [&>button]:right-4 [&>button]:top-4 [&>button]:bg-white [&>button]:text-rose-500 [&>button]:p-2 [&>button]:rounded-full [&>button]:shadow-md hover:[&>button]:bg-rose-50 hover:[&>button]:scale-110 [&>button]:transition-all [&>button]:border [&>button]:border-rose-100 [&>button]:z-50 [&>button>svg]:w-5 [&>button>svg]:h-5">
                <DialogDescription className="sr-only">
                    Contact information, location, operating hours, and social
                    media links for the Gerona Municipal Library.
                </DialogDescription>

                <DialogHeader className="mt-2">
                    <DialogTitle className="text-2xl md:text-3xl font-serif font-black text-slate-800 flex items-center gap-3">
                        <Icon
                            icon="fluent-emoji:waving-hand"
                            className="w-8 h-8 md:w-10 md:h-10 animate-in spin-in-12 duration-700"
                        />
                        Contact Us
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 mt-2">
                    <p className="text-stone-500 text-sm font-medium leading-relaxed">
                        Have questions about our library, books, or modules?
                        Reach out to us via the options below. We’re here to
                        help!
                    </p>

                    <div className="bg-rose-50 p-5 rounded-3xl border border-rose-100 space-y-4 shadow-sm">
                        <a
                            href="https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&fbclid=IwY2xjawQbRaNleHRuA2FlbQIxMABicmlkETF1QmNrbUJUZTd0eDJRUXFFc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHu9orueJ5eLWdV6I7h88kpnWCKSFyIeX_Q2PIRLTuBt06_LHFO2Yddu24R1d_aem_psVKRP0jvt0dHx1liIJYuA&FORM=FBKPL1&q=poblacion+3%2C+Gerona%2C+Philippines%2C+2302&cp=15.601229%7E120.751755&lvl=11&style=r"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-start gap-4 text-stone-700 group cursor-pointer hover:bg-white/60 p-2 -m-2 rounded-2xl transition-colors"
                        >
                            <div className="bg-white p-2.5 rounded-xl shadow-sm text-rose-500 group-hover:scale-110 group-hover:-rotate-12 transition-transform shrink-0">
                                <Icon
                                    icon="solar:map-point-bold-duotone"
                                    className="w-6 h-6"
                                />
                            </div>
                            <div className="mt-0.5">
                                <p className="text-[10px] text-rose-400 uppercase tracking-widest font-bold mb-0.5">
                                    Location
                                </p>
                                <p className="font-bold text-sm leading-tight text-slate-800 group-hover:text-rose-600 transition-colors">
                                    Poblacion 3, Gerona, Philippines, 2302
                                </p>
                            </div>
                        </a>

                        <div className="h-px bg-rose-200/50 w-full rounded-full"></div>

                        <div className="flex items-start gap-4 text-stone-700 p-2 -m-2">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm text-rose-500 shrink-0">
                                <Icon
                                    icon="solar:clock-circle-bold-duotone"
                                    className="w-6 h-6"
                                />
                            </div>
                            <div className="mt-0.5">
                                <p className="text-[10px] text-rose-400 uppercase tracking-widest font-bold mb-0.5">
                                    Operating Hours
                                </p>
                                <p className="font-bold text-sm text-slate-800">
                                    Monday to Friday
                                </p>
                                <p className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex mt-1">
                                    8:00 AM - 5:00 PM
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <a
                            href="mailto:elibrarygerona@gmail.com"
                            className="flex items-center gap-4 bg-white border border-stone-200 p-3 rounded-2xl hover:border-rose-300 hover:shadow-sm transition-all group"
                        >
                            <div className="bg-rose-50 p-2.5 rounded-xl text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                <Icon
                                    icon="solar:letter-bold-duotone"
                                    className="w-5 h-5"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">
                                    Email Us
                                </p>
                                <p className="font-bold text-sm text-slate-800 group-hover:text-rose-600 transition-colors">
                                    elibrarygerona@gmail.com
                                </p>
                            </div>
                        </a>

                        <div className="grid grid-cols-2 gap-3">
                            <a
                                href="https://www.facebook.com/profile.php?id=61587989192473"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 p-3 rounded-2xl hover:bg-[#1877F2] hover:text-white transition-all group shadow-sm hover:shadow-md"
                            >
                                <Icon
                                    icon="mdi:facebook"
                                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                                />
                                <span className="font-bold text-sm tracking-wide">
                                    Facebook
                                </span>
                            </a>

                            <a
                                href="https://www.instagram.com/elibrary_gerona/"
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 bg-gradient-to-tr from-[#FD1D1D]/10 to-[#833AB4]/10 text-[#C13584] border border-[#C13584]/20 p-3 rounded-2xl hover:from-[#FD1D1D] hover:to-[#833AB4] hover:border-transparent hover:text-white transition-all group shadow-sm hover:shadow-md"
                            >
                                <Icon
                                    icon="mdi:instagram"
                                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                                />
                                <span className="font-bold text-sm tracking-wide">
                                    Instagram
                                </span>
                            </a>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
