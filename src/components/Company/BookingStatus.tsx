'use client';

import type { BookingDto } from '@/types/api.types';
import { Clock, ArrowUpCircle } from 'lucide-react';
import Link from 'next/link';
import { mockTiers } from '@/__tests__/mocks/data/bookings';

interface BookingStatusProps {
  bookings: BookingDto[];
}

const tierContent: Record<number, { title: string; textColor: string; borderColor: string; btnStyles: string }> = {
  1: { title: 'Basis Ticket', textColor: 'text-yellow-500', borderColor: 'border-yellow-500', btnStyles: 'bg-white text-black hover:bg-white/90 border-[#EAB308] border-2 shadow-lg font-bold' },
  2: { title: 'Basis Plus Ticket', textColor: 'text-blue-500', borderColor: 'border-blue-500', btnStyles: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent font-semibold' },
  3: { title: 'Premium Ticket', textColor: 'text-red-500', borderColor: 'border-red-500', btnStyles: 'bg-red-500 text-white hover:bg-red-600 border-transparent font-semibold' },
  4: { title: 'Premium Deluxe Ticket', textColor: 'text-emerald-400', borderColor: 'border-emerald-400', btnStyles: 'bg-emerald-400 text-black hover:bg-emerald-500 border-transparent font-bold' },
};

export function BookingStatus({ bookings }: BookingStatusProps) {
  const booking = bookings[0];

  return (
    <section aria-labelledby="booking-status-heading" className="pb-6 border-t-4 border-surface-border pt-6 space-y-0">
      <h2 id="booking-status-heading" className="text-lg font-bold text-foreground">
        Ihre Buchung
      </h2>

      {!booking ? (
        <p className="text-sm text-foreground-muted">Noch keine Buchung vorhanden.</p>
      ) : (
        <BookedTier booking={booking} />
      )}
    </section>
  );
}

function BookedTier({ booking }: { booking: BookingDto }) {
  const config = tierContent[booking.tierId] ?? tierContent[1];
  const tier = mockTiers.find((t) => t.tierId === booking.tierId) ?? mockTiers[0];

  const features = tier.features || [];
  const standFeature = features.find(
    (f) => f.toLowerCase().includes('messestand') || f.toLowerCase().includes('m²')
  );
  const bullets = features.filter((f) => f !== standFeature);

  let standInfo = '';
  if (standFeature) {
    if (standFeature.toLowerCase().includes('3m²')) {
      standInfo = 'Ein Messestand mit 3m² im Lagebereich 2';
    } else if (standFeature.toLowerCase().includes('6m²')) {
      standInfo = booking.tierId === 2
        ? 'Ein Messestand mit 6m² im Lagebereich 2'
        : 'Ein Messestand mit 6m² im Lagebereich 1';
    } else {
      standInfo = `Ein ${standFeature}`;
    }
  }

  const price = tier.basePrice / 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2 text-xs text-foreground-muted">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <time dateTime={booking.createdAt}>
            Gebucht am {new Date(booking.createdAt).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </time>
        </div>
      </div>

      <div className={`rounded-xl border-2 ${config.borderColor} p-8 bg-surface-raised transition-all duration-200 flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6`}>
        <div className="flex-1 space-y-4">
          <div>
            <h3 className={`text-2xl font-bold ${config.textColor}`}>{config.title}</h3>
            <p className="text-xs text-foreground-muted mt-1">Dieses Ticket beinhaltet folgende Leistungen:</p>
            {standInfo && (
              <p className="text-sm font-bold text-foreground mt-2">{standInfo}</p>
            )}
          </div>
          <ul className="space-y-1.5 list-disc list-inside text-sm text-foreground-muted" aria-label="Enthaltene Leistungen">
            {bullets.map((feature, idx) => (
              <li key={idx} className="marker:text-current">{feature}</li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-between items-end min-w-50 self-stretch text-right gap-6">
          <div className="space-y-1 w-full">
            <p className="text-2xl font-extrabold text-foreground">
              {price.toLocaleString('de-DE')}€
            </p>
          </div>
          {booking.tierId < 4 && (
            <Link
              href="/ticketshop"
              className={`relative inline-flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 rounded-lg text-sm transition-transform hover:scale-[1.02] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11 ${config.btnStyles}`}
            >
              Aufwerten
              <ArrowUpCircle className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
