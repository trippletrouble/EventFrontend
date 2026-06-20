'use client';

import type { UserDto } from '@/types/api.types';
import { Users, ShieldCheck } from 'lucide-react';

interface MemberListProps {
  members: UserDto[];
}

export function MemberList({ members }: MemberListProps) {
  return (
    <section aria-labelledby="member-list-heading" className="bg-white pb-6 border-b border-[#2860F9]/20 space-y-4">
      <div className="flex items-center gap-3">
        <h2 id="member-list-heading" className="text-lg font-bold text-slate-900">
          Ihre Mitglieder
        </h2>
        <Users className="h-5 w-5 text-[#2860F9]" aria-hidden="true" />
        <span className="ml-auto text-xs font-semibold text-slate-500" aria-label={`Anzahl: ${members.length}`}>
          Anz. {members.length}
        </span>
      </div>

      {members.length === 0 ? (
        <p className="text-sm text-slate-500">Noch keine Mitglieder vorhanden.</p>
      ) : (
        <ul className="divide-y divide-slate-100" aria-label="Mitgliederliste">
          {[...members].sort((a, b) => (a.role === 'ADMIN' ? -1 : b.role === 'ADMIN' ? 1 : 0)).map((member) => (
            <li key={member.userId} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
              <div>
                <p className="text-sm font-medium text-slate-900">
                  {member.firstName && member.lastName
                    ? `${member.firstName} ${member.lastName}`
                    : member.email}
                </p>
                {member.firstName && member.lastName && (
                  <p className="text-xs text-slate-500">{member.email}</p>
                )}
              </div>
              {member.role === 'ADMIN' && (
                <span className="inline-flex items-center gap-1 bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                  Admin
                </span>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
