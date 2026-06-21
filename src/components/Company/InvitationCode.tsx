'use client';

import { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { renewInvitationCode } from '@/services/invitation.service';
import { Modal } from '@/components/UI/Modal';

interface InvitationCodeProps {
  code: string;
}

export function InvitationCode({ code: initialCode }: InvitationCodeProps) {
  const [code, setCode] = useState(initialCode);
  const [copied, setCopied] = useState(false);
  const [renewing, setRenewing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCopy() {
    setError(null);
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Code konnte nicht kopiert werden. Bitte markieren und manuell kopieren.');
    }
  }

  async function handleRenew() {
    setConfirmOpen(false);
    setRenewing(true);
    setError(null);
    try {
      const newCode = await renewInvitationCode();
      setCode(newCode);
    } catch {
      setError('Code konnte nicht erneuert werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setRenewing(false);
    }
  }

  return (
    <section
      aria-labelledby="invitation-code-heading"
      className="bg-surface-raised border border-surface-border rounded-xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6"
    >

      <div className="space-y-1">
        <h2 id="invitation-code-heading" className="text-xl font-bold text-white tracking-tight font-sans">
          Einladungscode
        </h2>
        <p className="text-xs text-foreground-muted leading-relaxed">
          Teilen Sie diesen Code mit Ihren Mitarbeitern, um sie zu Ihrem Firmenprofil hinzuzufügen.
        </p>
      </div>

      <div className="space-y-3">
        <div className="relative flex items-center justify-between gap-3 bg-surface border border-surface-border rounded-xl px-4 py-3 shadow-inner focus-within:border-[#3B82F6]/40 transition-colors">
          <span className="flex-1 select-all font-mono text-base font-bold tracking-[0.2em] text-white pl-1">{code}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="relative shrink-0 p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-surface-overlay transition-all focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11"
            aria-label={copied ? 'Kopiert' : 'Code kopieren'}
          >
            {copied ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Copy className="h-4.5 w-4.5" />}
          </button>
        </div>

        {copied && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-fade-in" role="status">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Kopiert!</span>
          </div>
        )}

        {error && (
          <p className="text-xs text-red-400 font-medium" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="pt-2">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          disabled={renewing}
          className="relative inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#3B82F6]/40 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#3B82F6] after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${renewing ? 'animate-spin' : ''}`} aria-hidden="true" />
          {renewing ? 'Wird erneuert…' : 'Neuen Code generieren'}
        </button>
      </div>

      <Modal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Einladungscode erneuern?"
        size="sm"
        actions={
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="relative px-4 py-2 text-sm font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700/80 rounded-lg transition-all focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-zinc-500 after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleRenew}
              className="relative px-4 py-2 text-sm font-bold text-black bg-red-600 hover:bg-red-500 rounded-lg transition-all focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-600 after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11"
            >
              Ja, Code erneuern
            </button>
          </div>
        }
      >
        <p className="text-sm text-zinc-300 leading-relaxed">
          Der aktuelle Einladungscode wird ungültig. Alle Mitglieder müssen den neuen Code erneut bestätigen, um wieder Zugang zu erhalten.
        </p>
      </Modal>
    </section>
  );
}