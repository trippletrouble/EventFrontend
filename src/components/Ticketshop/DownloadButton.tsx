'use client';

import React, { useState } from 'react';

export default function DownloadButton() {
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadError, setDownloadError] = useState<string | null>(null);

    const handleDownload = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        setDownloadError(null);

        try {
            const pdfUrl = '/downloads/Ausstellermappe.pdf';
            
            const response = await fetch(pdfUrl, { method: 'HEAD' });
            
            if (!response.ok) {
                setDownloadError('Die Ausstellermappe ist derzeit nicht verfügbar.');
                setIsDownloading(false);
                return;
            }

            const link = document.createElement('a');
            link.href = pdfUrl;
            link.setAttribute('download', 'Ausstellermappe.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch {
            setDownloadError('Fehler beim Download. Bitte versuchen Sie es erneut.');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="flex flex-col items-start gap-1">
            <div className="flex items-center gap-8 group">
                {/* Text ändert die Farbe, wenn ein Download läuft */}
                <div className={`flex flex-col text-left leading-tight text-base font-extrabold tracking-wide transition-colors duration-200
                ${isDownloading ? 'text-gray-500' : 'text-gray-300'}`}
                >
                    <span>Ausstellermappe</span>
                    <span>herunterladen</span>
                </div>

                {/* Das Icon rechts daneben mit Loading-State Handling */}
                <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    type="button"
                    aria-label={isDownloading ? "Ausstellermappe wird heruntergeladen" : "Ausstellermappe PDF herunterladen"}
                    className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#0AD88E]
                 hover:bg-[#0AD88E] hover:text-black hover:scale-105
                 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#0AD88E]/50
                 disabled:opacity-40 disabled:scale-100 disabled:hover:bg-white/5 disabled:hover:text-[#0AD88E] disabled:cursor-not-allowed"
                >
                    {/* WECHSELNDER STATUS: Spinner vs. Download-Icon */}
                    {isDownloading ? (
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                    ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    )}
                </button>
            </div>

            {/* ERROR STATE HANDLING */}
            {downloadError && (
                <div
                    role="alert"
                    className="text-red-500 text-xs font-bold pl-1 mt-1 flex items-center gap-1 animate-fadeIn"
                >
                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>{downloadError}</span>
                </div>
            )}
        </div>
    );
}