import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Icon } from "@iconify/react";

export default function DevCreditModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-none rounded-[2rem] sm:max-w-[400px] text-center text-white">
                <div className="p-4">
                    <div className="w-20 h-20 bg-slate-800 text-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                        <Icon
                            icon="solar:code-square-bold-duotone"
                            className="w-10 h-10"
                        />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-serif font-black text-center text-white">
                            The Dev Team
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-6 space-y-4">
                        <div className="bg-slate-800 p-4 rounded-2xl">
                            <p className="text-xs text-slate-400 uppercase tracking-widest font-bold mb-1">
                                Lead Developer
                            </p>
                            <p className="text-xl font-black text-pink-400">
                                Allen Icee A. Dequiros
                            </p>
                        </div>
                        <p className="text-sm text-slate-500 font-medium italic">
                            MIS Internship Team • Class of 2026
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
