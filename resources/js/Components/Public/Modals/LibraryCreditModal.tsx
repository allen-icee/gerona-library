import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Icon } from "@iconify/react";

export default function LibraryCreditModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-white border-4 border-rose-200 rounded-[2rem] sm:max-w-[450px] text-center">
                <div className="p-4">
                    <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon
                            icon="solar:buildings-bold-duotone"
                            className="w-10 h-10"
                        />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-serif font-black text-slate-800 text-center">
                            Gerona LGU
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-stone-500 mt-4 leading-relaxed font-medium">
                        This digital library portal is an initiative by the
                        Gerona Municipal Government to provide free, accessible
                        knowledge and modern services to all its citizens.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
