// resources/js/Components/Public/Modals/LibraryCreditModal.tsx

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/Components/ui/dialog";

export default function LibraryCreditModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: (open: boolean) => void;
}) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            {/* Outer border is now Pink. Default font is Arial. */}
            {/* Outer border is now Pink. Default font is Arial. */}
            <DialogContent className="font-['Arial',sans-serif] bg-gradient-to-br from-[#d4af37] via-[#fdf5d3] to-[#c7a445] border-[6px] border-pink-300 rounded-xl sm:max-w-[750px] max-h-[90vh] p-0 shadow-2xl overflow-hidden flex justify-center [&>button]:absolute [&>button]:right-4 [&>button]:top-4 [&>button]:bg-white [&>button]:text-rose-500 [&>button]:p-2 [&>button]:rounded-full [&>button]:shadow-lg hover:[&>button]:bg-rose-50 hover:[&>button]:scale-110 [&>button]:transition-all [&>button]:border [&>button]:border-rose-200 [&>button]:z-[100] [&>button>svg]:w-5 [&>button>svg]:h-5">
                <DialogDescription className="sr-only">
                    Dedication and credits for the Dr. Jorge Cleofas Bocobo Library.
                </DialogDescription>

                {/* RED VELVET DRAPES (Curtains) */}
                <div className="absolute top-0 left-0 w-8 md:w-12 h-full bg-gradient-to-r from-red-950 via-red-800 to-red-950 shadow-[inset_-4px_0_10px_rgba(0,0,0,0.5)] z-0 border-r-2 border-red-950">
                    <div className="absolute top-0 left-1/3 w-px h-full bg-red-700/40"></div>
                    <div className="absolute top-0 left-2/3 w-px h-full bg-red-950/80"></div>
                </div>
                <div className="absolute top-0 right-0 w-8 md:w-12 h-full bg-gradient-to-l from-red-950 via-red-800 to-red-950 shadow-[inset_4px_0_10px_rgba(0,0,0,0.5)] z-0 border-l-2 border-red-950">
                    <div className="absolute top-0 right-1/3 w-px h-full bg-red-700/40"></div>
                    <div className="absolute top-0 right-2/3 w-px h-full bg-red-950/80"></div>
                </div>

                {/* SCROLLABLE AREA (Hidden Scrollbars) */}
                <div className="relative z-10 w-full px-12 md:px-20 py-10 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

                    {/* BLACK INNER BORDER WITH INWARD "U" CORNERS */}
                    <div className="relative p-6 md:p-8 bg-white/10 backdrop-blur-sm shadow-inner">

                        {/* Straight Border Lines */}
                        <div className="absolute top-0 left-6 right-6 h-[4px] bg-slate-900"></div>
                        <div className="absolute bottom-0 left-6 right-6 h-[4px] bg-slate-900"></div>
                        <div className="absolute left-0 top-6 bottom-6 w-[4px] bg-slate-900"></div>
                        <div className="absolute right-0 top-6 bottom-6 w-[4px] bg-slate-900"></div>

                        {/* Inward U Corners (Scalloped cutouts) */}
                        <div className="absolute top-0 left-0 w-6 h-6 border-b-[4px] border-r-[4px] border-slate-900 rounded-br-2xl"></div>
                        <div className="absolute top-0 right-0 w-6 h-6 border-b-[4px] border-l-[4px] border-slate-900 rounded-bl-2xl"></div>
                        <div className="absolute bottom-0 left-0 w-6 h-6 border-t-[4px] border-r-[4px] border-slate-900 rounded-tr-2xl"></div>
                        <div className="absolute bottom-0 right-0 w-6 h-6 border-t-[4px] border-l-[4px] border-slate-900 rounded-tl-2xl"></div>

                        {/* CONTENT */}
                        <div className="flex flex-col items-center text-center w-full text-slate-900 ">

                            {/* LOGO */}
                            <img
                                src="/images/3DMunicipalLogo.png"
                                alt="Gerona Municipal Logo"
                                className="w-[70pt] h-[70pt] object-contain mb-2 drop-shadow-md"
                            />

                            {/* HEADER */}
                            <div className="text-[8pt] md:text-[9pt] font-light uppercase tracking-[0.2em] leading-[1.2] mb-5">
                                Republic of the Philippines<br />
                                Province of Tarlac<br />
                                Municipality of Gerona
                            </div>

                            <DialogHeader className="w-full">
                                {/* TIMES NEW ROMAN APPLIED VIA STYLE */}
                                <DialogTitle
                                    className="text-[15pt] md:text-[17pt] font-black text-slate-900 text-center leading-tight tracking-tight drop-shadow-sm"
                                    style={{ fontFamily: '"Times New Roman", Times, serif' }}
                                >
                                    DR. JORGE CLEOFAS BOCOBO LIBRARY
                                </DialogTitle>
                            </DialogHeader>

                            <p className="italic text-[8pt] md:text-[10pt] font-semibold tracking-tight mt-1 mb-4">
                                (Gerona Municipal Library)
                            </p>

                            {/* PARAGRAPHS - Compact Justified Text */}
                            <div className="text-[8pt] md:text-[10pt] text-center space-y-3 leading-[1.2] font-normal px-1 md:px-1 mb-1">
                                <p>Named in honor of <span className="font-black">Dr. Jorge Cleofas Bocobo</span>, a distinguished son of Gerona, Tarlac, whose life and work greatly enriched the nation's legal, academic, and literary heritage. As one of the principal authors of the Philippine Civil Code and the translator of Noli Me Tangere and El Filibusterismo, he helped make the ideals of justice, freedom, and nationalism accessible to generations of Filipinos.</p>
                                <p>Dr. Bocobo served with distinction at the University of the Philippines College of Law, where he rose from instructor to professor and later became Acting Dean in 1917. His unwavering commitment to public service, education, and intellectual excellence stands as an enduring inspiration to the people of Gerona and the Filipino nation.</p>
                                <p>This Library is also dedicated to all Geronians—past, present, and future—whose love for learning, culture, and community continues to shape the town's shared identity and hopes for progress.</p>
                            </div>

                            {/* LEADERSHIP */}
                            <div className="w-full pt-4 px-2">
                                <p className="text-[8pt] md:text-[10pt] tracking-normal mb-4 font-light italic">
                                    Established through the leadership of:
                                </p>

                                <div className="space-y-3 mb-1">
                                    <div>
                                        {/* TIMES NEW ROMAN APPLIED VIA STYLE */}
                                        <p
                                            className="font-black text-[14pt] md:text-[16pt] tracking-tight drop-shadow-sm"
                                            style={{ fontFamily: '"Times New Roman", Times, serif' }}
                                        >
                                            HON. MAY B. ECLAR, Ph.D.
                                        </p>
                                        <p className="text-[8pt] md:text-[9pt] tracking-[0.2em] font-normal">Municipal Mayor</p>
                                    </div>
                                    <div>
                                        {/* TIMES NEW ROMAN APPLIED VIA STYLE */}
                                        <p
                                            className="font-black text-[14pt] md:text-[16pt] tracking-tight drop-shadow-sm"
                                            style={{ fontFamily: '"Times New Roman", Times, serif' }}
                                        >
                                            HON. ENGR. ELOY C. ECLAR
                                        </p>
                                        <p className="text-[8pt] md:text-[9pt] tracking-[0.2em] font-bold">Vice Mayor</p>
                                    </div>
                                </div>

                                <div className="my-2">
                                    {/* TIMES NEW ROMAN APPLIED VIA STYLE */}
                                    <span
                                        className="text-[12pt] font-normal"
                                        style={{ fontFamily: '"Times New Roman", Times, serif' }}
                                    >
                                        &amp;
                                    </span>
                                </div>

                                <p className="text-[10pt] md:text-[11pt] uppercase tracking-tight font-black mb-3">
                                    SANGGUNIANG BAYAN MEMBERS
                                </p>

                                {/* 2-COLUMN LEFT ALIGNED LIST (Centered as a block) */}
                                <div className="flex justify-center w-full">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-1 gap-y-3 text-[7pt] md:text-[8pt] font-normal tracking-tight">

                                        {/* Column 1 */}
                                        <div className="space-y-0 text-left uppercase">
                                            <p>Hon. Holden N. Sembrano</p>
                                            <p>Hon. Blaine Joy A. Antonio, RPH</p>
                                            <p>Hon. Jason Benar G. Palomar</p>
                                            <p>Hon. William R. Yamoyam</p>
                                            <p>Hon. Alfredo O. Acob, Jr.</p>
                                        </div>

                                        {/* Column 2 */}
                                        <div className="space-y-0 text-left uppercase">
                                            <p>Hon. Eufrocino A. Bartolome, Jr.</p>
                                            <p>Hon. Jorge A. Mamba, Jr. CPA</p>
                                            <p>Hon. Ronjie L. Daquigan</p>
                                            <p>
                                                Hon. Philip G. Ines, <span className="normal-case italic">LNB President</span>
                                            </p>
                                            <p>
                                                Hon. Jo Dylan G. Palomar, <span className="normal-case italic">SKF President</span>
                                            </p>
                                        </div>

                                    </div>
                                </div>
                            </div>

                            {/* DATE */}
                            <div className="mt-1 pt-1">
                                {/* TIMES NEW ROMAN APPLIED VIA STYLE */}
                                <p
                                    className="text-[10pt] md:text-[12pt] italic font-bold tracking-tight"
                                    style={{ fontFamily: '"Times New Roman", Times, serif' }}
                                >
                                    February 2, 2026
                                </p>
                            </div>

                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}