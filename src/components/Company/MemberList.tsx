'use client';

import type { UserDto } from '@/types/api.types';
import { Users, ShieldCheck } from 'lucide-react';

interface MemberListProps {
  members: UserDto[];
}

export function MemberList({ members }: MemberListProps) {
  return (
    <section
      aria-labelledby="member-list-heading"
      className="bg-surface-raised border border-surface-border rounded-xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6"
    >

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-surface border border-surface-border text-[#0AD88E] inline-flex">
            <Users className="h-5 w-5 shrink-0" aria-hidden="true" />
          </div>
          <h2 id="member-list-heading" className="text-xl font-bold text-white tracking-tight font-sans">
            Ihre Mitglieder
          </h2>
        </div>
        <span className="bg-surface border border-surface-border text-zinc-400 px-3 py-1 rounded-full text-xs font-semibold select-none flex items-center gap-1.5 shadow-inner">
          <span aria-hidden="true">Anz. {members.length}</span>
          <span className="sr-only">Anzahl: {members.length}</span>
        </span>
      </div>

      {members.length === 0 ? (
        <div className="border border-dashed border-surface-border rounded-xl p-6 text-center">
          <p className="text-sm text-zinc-400">Noch keine Mitglieder vorhanden.</p>
        </div>
      ) : (
        <ul className="divide-y divide-surface-border bg-surface border border-surface-border rounded-xl overflow-hidden shadow-inner" aria-label="Mitgliederliste">
          {[...members].sort((a, b) => (a.role === 'ADMIN' ? -1 : b.role === 'ADMIN' ? 1 : 0)).map((member) => {
            const isCompanyAdmin = member.role === 'ADMIN';
            const initials = (member.firstName && member.lastName)
              ? `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()
              : member.email.substring(0, 2).toUpperCase();

            return (
              <li key={member.userId} className="flex items-center justify-between p-4 hover:bg-surface-overlay transition-colors">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-xs text-zinc-300 shrink-0 select-none shadow-inner">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">
                      {member.firstName && member.lastName
                        ? `${member.firstName} ${member.lastName}`
                        : member.email}
                    </p>
                    {member.firstName && member.lastName && (
                      <p className="text-xs text-zinc-400 truncate mt-0.5">{member.email}</p>
                    )}
                  </div>
                </div>
                {isCompanyAdmin && (
                  <span className="inline-flex items-center gap-1.5 bg-[#2860F8]/10 text-[#2860F8] border border-[#2860F8]/20 px-2.5 py-1 rounded-lg text-xs font-bold shrink-0">
                    <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Admin</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
