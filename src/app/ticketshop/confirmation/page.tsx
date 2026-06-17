'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingResult from '@/components/Ticketshop/BookingResult';

function ConfirmationContent() {
    const searchParams = useSearchParams();
    const status = searchParams ? searchParams.get('status') : null;

    return <BookingResult status={status} />;
}
export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="w-full min-h-screen bg-[#0b111e] flex items-center justify-center text-white">
                <p className="animate-pulse">Lädt Bestellstatus...</p>
            </div>
        }>
            <ConfirmationContent />
        </Suspense>
    );
}