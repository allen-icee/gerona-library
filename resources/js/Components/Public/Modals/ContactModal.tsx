import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
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
            <DialogContent className="bg-white border-4 border-pink-200 rounded-[2rem] sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-serif font-black text-slate-800 flex items-center gap-2">
                        <Icon
                            icon="fluent-emoji:waving-hand"
                            className="w-8 h-8"
                        />{" "}
                        Hello there!
                    </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                    <p className="text-stone-600 text-sm font-medium">
                        Need help finding a specific book or module? We'd love
                        to hear from you!
                    </p>
                    <div className="bg-pink-50 p-5 rounded-3xl border-2 border-pink-100 space-y-4 shadow-inner">
                        <div className="flex items-center gap-4 text-stone-700 group cursor-pointer">
                            <div className="bg-white p-3 rounded-2xl shadow-sm text-pink-500 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                                <Icon
                                    icon="solar:phone-bold-duotone"
                                    className="w-6 h-6"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] text-pink-400 uppercase tracking-widest font-bold">
                                    Front Desk
                                </p>
                                <span className="font-black text-lg">
                                    (045) 123 4567
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-stone-700 group cursor-pointer">
                            <div className="bg-white p-3 rounded-2xl shadow-sm text-pink-500 group-hover:scale-110 group-hover:-rotate-12 transition-transform">
                                <Icon
                                    icon="solar:map-point-bold-duotone"
                                    className="w-6 h-6"
                                />
                            </div>
                            <div>
                                <p className="text-[10px] text-pink-400 uppercase tracking-widest font-bold">
                                    Location
                                </p>
                                <span className="font-bold">
                                    Gerona Municipal Hall
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
