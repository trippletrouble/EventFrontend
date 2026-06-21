'use client';

import React, { useState, useEffect, useRef } from 'react';

interface CancelDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmSuccess: () => void;
    bookingId: number;
}

export default function CancelDialog({ isOpen = true, onClose, onConfirmSuccess, bookingId }: CancelDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showToast, setShowToast] = useState(false);
    
    const dialogRef = useRef<HTMLDivElement>(null);
    const previousActiveElementRef = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isOpen) {
            previousActiveElementRef.current = document.activeElement as HTMLElement;

            setTimeout(() => {
                const firstButton = dialogRef.current?.querySelector('button');
                if (firstButton) {
                    firstButton.focus();
                }
            }, 0);
        }

        return () => {
            if (previousActiveElementRef.current) {
                previousActiveElementRef.current.focus();
            }
        };
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && !isSubmitting) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
    }, [isOpen, isSubmitting, onClose]);

    useEffect(() => {
        if (!isOpen) return;

        const handleTabKey = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            const focusableElements = dialogRef.current?.querySelectorAll(
                'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (!focusableElements || focusableElements.length === 0) return;

            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (event.shiftKey) {
                if (document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTabKey);
        return () => document.removeEventListener('keydown', handleTabKey);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleCancelBooking = async () => {
        setIsSubmitting(true);
        setErrorMessage(null);

        try {
            const response = await fetch('/api/bookings', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: bookingId
                }),
            });

            if (!response.ok) {
            if (response.status === 401) {
                setErrorMessage('Sie müssen eingeloggt sein, um eine Buchung zu stornieren.');
                setIsSubmitting(false);
                return;
            }
            
            setErrorMessage('Die Stornierung konnte nicht durchgeführt werden.');
            setIsSubmitting(false);
            return;
        }

            setShowToast(true);

            setTimeout(() => {
                setShowToast(false);
                onConfirmSuccess();
                onClose();
            }, 2000);

        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : 'Ein unerwarteter Fehler ist aufgetreten.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* US-A2.7.1: Confirmation Dialog (Overlay + Modal) */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm motion-safe:animate-fadeIn">
                <div
                    ref={dialogRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                    className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-6"
                >
                    <div className="space-y-2">
                        <h3 id="modal-title" className="text-xl font-bold text-white">
                            Buchung stornieren?
                        </h3>
                        <p id="modal-description" className="text-gray-400 text-sm leading-relaxed">
                            Möchten Sie dieses Standpaket wirklich stornieren? Diese Aktion kann nicht rückgängig gemacht werden.
                        </p>
                    </div>

                    {/* Error-State Handling */}
                    {errorMessage && (
                        <div role="alert" aria-live="assertive" className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold rounded-lg flex items-center gap-2">
                            <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    {/* Buttons mit Tastatur-Fokus-Unterstützung - Verbesserte Touch-Targets (44x44px) */}
                    <div className="flex items-center justify-end gap-3">
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            type="button"
                            className="min-h-[44px] px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white border border-white/10 rounded-xl hover:bg-white/5 transition-all focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Abbrechen
                        </button>
                        <button
                            onClick={handleCancelBooking}
                            disabled={isSubmitting}
                            type="button"
                            className="min-h-[44px] px-4 py-3 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all shadow-lg shadow-red-600/20 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-zinc-900 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="h-4 w-4 motion-safe:animate-spin" viewBox="0 0 24 24" aria-hidden="true">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <span>Wird storniert...</span>
                                </>
                            ) : (
                                <span>Ja, stornieren</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* US-A2.7.2: Toast Feedback Notification */}
            {showToast && (
                <div
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 bg-zinc-900 border border-[#0AD88E]/30 text-white rounded-xl shadow-2xl motion-safe:animate-slideInRight"
                >
                    <div className="p-1 rounded-full bg-[#0AD88E]/10 text-[#0AD88E]">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <span className="text-sm font-medium tracking-wide">Buchung erfolgreich storniert!</span>
                </div>
            )}
        </>
    );
}