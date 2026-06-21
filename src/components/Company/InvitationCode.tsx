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
    <section aria-labelledby="invitation-code-heading" className="pb-6 border-b border-surface-border space-y-4">
      <h2 id="invitation-code-heading" className="text-lg font-bold text-foreground">
        Einladungscode
      </h2>

      <div className="flex items-center gap-2 bg-surface-raised border border-surface-border px-4 py-3 font-mono text-sm text-foreground tracking-wider">
        <span className="flex-1 select-all" aria-label={`Einladungscode: ${code}`}>{code}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="relative shrink-0 p-1.5 text-foreground-muted hover:text-brand-blue transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11"
          aria-label={copied ? 'Kopiert' : 'Code kopieren'}
        >
          {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      {copied && (
        <p className="text-xs text-success font-medium" role="status">Kopiert!</p>
      )}

      {error && (
        <p className="text-xs text-destructive font-medium" role="alert">{error}</p>
      )}

      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        disabled={renewing}
        className="relative inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:text-brand-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${renewing ? 'animate-spin' : ''}`} aria-hidden="true" />
        {renewing ? 'Wird erneuert…' : 'Neuen Code generieren'}
      </button>

      <Modal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Einladungscode erneuern?"
        size="sm"
        actions={
          <>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="relative px-4 py-2 text-base font-semibold text-foreground hover:bg-surface-overlay rounded-lg transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11"
            >
              Abbrechen
            </button>
            <button
              type="button"
              onClick={handleRenew}
              className="relative px-4 py-2 text-base font-semibold text-red-900 bg-white hover:bg-red-50 rounded-lg transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-red-900 after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11"
            >
              Ja, Code erneuern
            </button>
          </>
        }
      >
        <p className="text-base text-foreground">
          Der aktuelle Einladungscode wird ungültig. Alle Mitglieder müssen den neuen Code erneut bestätigen, um wieder Zugang zu erhalten.
        </p>
      </Modal>
    </section>
  );
}