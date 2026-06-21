'use client';

import type { BookingDto, TierDto } from '@/types/api.types';
import { Clock, ArrowUpCircle, Ticket, Sparkles, Crown, Gem } from 'lucide-react';
import Link from 'next/link';

interface BookingStatusProps {
  bookings: BookingDto[];
  tiers: TierDto[];
}

const tierContent: Record<number, { title: string; textColor: string; borderColor: string; bgStyles: string; icon: any }> = {
  1: { title: 'Basis Ticket', textColor: 'text-[#EAB308]', borderColor: 'border-[#EAB308]/30', bgStyles: 'bg-[#EAB308]/5', icon: Ticket },
  2: { title: 'Basis Plus Ticket', textColor: 'text-[#3B82F6]', borderColor: 'border-[#3B82F6]/30', bgStyles: 'bg-[#3B82F6]/5', icon: Sparkles },
  3: { title: 'Premium Ticket', textColor: 'text-[#EF4444]', borderColor: 'border-[#EF4444]/30', bgStyles: 'bg-[#EF4444]/5', icon: Crown },
  4: { title: 'Premium Deluxe Ticket', textColor: 'text-[#10B981]', borderColor: 'border-[#10B981]/30', bgStyles: 'bg-[#10B981]/5', icon: Gem },
};

export function BookingStatus({ bookings, tiers }: BookingStatusProps) {
  const booking = bookings[0];

  return (
    <section
      aria-labelledby="booking-status-heading"
      className="bg-surface-raised border border-surface-border rounded-xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6"
    >
      <div className="flex items-center justify-between">
        <h2 id="booking-status-heading" className="text-xl font-bold text-white font-sans">
          Ihre Buchung
        </h2>
        {!booking && (
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Keine Buchung</span>
        )}
      </div>

      {!booking ? (
        <div className="border-2 border-dashed border-surface-border rounded-xl p-8 text-center space-y-4 hover:border-[#EAB308]/40 transition-colors">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-surface-border flex items-center justify-center mx-auto text-zinc-400">
            <Ticket className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-zinc-300 font-semibold">Noch keine Buchung vorhanden.</p>
            <p className="text-xs text-zinc-400">Buchen Sie ein Standpaket im Ticketshop, um an der Hochschulmesse teilzunehmen.</p>
          </div>
          <Link
            href="/ticketshop"
            className="inline-flex items-center justify-center px-5 py-2 text-sm font-bold text-black bg-[#EAB308] hover:bg-[#EAB308]/90 rounded-lg transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            Paket buchen
          </Link>
        </div>
      ) : (
        <BookedTier booking={booking} tiers={tiers} />
      )}
    </section>
  );
}

function BookedTier({ booking, tiers }: { booking: BookingDto; tiers: TierDto[] }) {
  const config = tierContent[booking.tierId] ?? tierContent[1];
  const tier = tiers.find((t) => t.tierId === booking.tierId);

  if (!tier) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Clock className="h-4 w-4 text-[#EAB308]" aria-hidden="true" />
          <span>
            Gebucht am {new Date(booking.createdAt).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className={`rounded-xl border ${config.borderColor} ${config.bgStyles} p-6 flex flex-col gap-6 relative overflow-hidden`}>
          <div className="space-y-2">
            <h3 className={`text-2xl font-extrabold ${config.textColor} flex items-center gap-2 font-sans`}>
              <config.icon className="h-6 w-6 shrink-0 animate-pulse" aria-hidden="true" />
              <span>{config.title}</span>
            </h3>
            <p className="text-sm text-zinc-400 mt-2">Paketdetails werden geladen…</p>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-xs text-zinc-400">
        <Clock className="h-4 w-4 text-[#EAB308]" aria-hidden="true" />
        <span>
          Gebucht am {new Date(booking.createdAt).toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </span>
      </div>

      <div className={`rounded-xl border ${config.borderColor} ${config.bgStyles} p-6 flex flex-col gap-6 relative overflow-hidden group`}>
        <div className="space-y-4">
          <div>
            <h3 className={`text-2xl font-extrabold ${config.textColor} flex items-center gap-2 font-sans`}>
              <config.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span>{config.title}</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-1.5">Dieses Ticket beinhaltet folgende Leistungen:</p>
            {standInfo && (
              <div className="inline-flex items-center gap-2 mt-2.5 px-3 py-1 rounded-lg bg-surface border border-surface-border text-xs font-semibold text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0AD88E]" />
                {standInfo}
              </div>
            )}
          </div>
          <ul className="space-y-2 text-xs text-zinc-400" aria-label="Enthaltene Leistungen">
            {bullets.map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-zinc-500 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Separator row with left/right circular ticket cutouts */}
        <div className="relative my-2">
          <div className="absolute -left-[36px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050505] border-r border-surface-border" />
          <div className="absolute -right-[36px] top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050505] border-l border-surface-border" />
          <div className="w-full border-t border-dashed border-surface-border" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Preis</p>
            <p className="text-3xl font-black text-white font-sans">
              {price.toLocaleString('de-DE')}€
            </p>
          </div>
          {booking.tierId < 4 && (
            <Link
              href="/ticketshop"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-black bg-[#EAB308] hover:bg-[#EAB308]/90 transition-all duration-200 active:scale-[0.98] shadow-md focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#EAB308]"
            >
              <span>Aufwerten</span>
              <ArrowUpCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
