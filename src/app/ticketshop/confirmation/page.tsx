'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import BookingResult from '@/components/Ticketshop/BookingResult';

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const status = searchParams ? searchParams.get('status') : null;

    return (
        <BookingResult status={status} />
    );
}