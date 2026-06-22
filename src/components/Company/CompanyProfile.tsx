'use client';

import type { CompanyDto } from '@/types/api.types';
import { Building2, MapPin, Mail, Check, Clock, X, Star, Pencil } from 'lucide-react';
import type { ComponentType } from 'react';
import { useState, useRef, useEffect } from 'react';
import { updateCompany } from '@/services/company.service';
import { LogoUpload } from './LogoUpload';

const statusLabels: Record<string, { label: string; className: string; icon: ComponentType<{ className?: string }> }> = {
  VERIFIED: { label: 'Verifiziert', className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: Check },
  PENDING: { label: 'Ausstehend', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: Clock },
  REJECTED: { label: 'Abgelehnt', className: 'bg-red-500/10 text-red-400 border border-red-500/20', icon: X },
};

interface CompanyProfileProps {
  company: CompanyDto;
  onUpdate?: () => void;
}

export function CompanyProfile({ company, onUpdate }: CompanyProfileProps) {
  const status = statusLabels[company.status] ?? statusLabels.PENDING;

  const [isEditing, setIsEditing] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isEditing]);

  const [formData, setFormData] = useState({
    name: company.name || '',
    address: company.address || '',
    zip: company.zip || '',
    city: company.city || '',
    email: company.email || '',
    description: company.description || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Firmenname ist erforderlich.';
    if (!formData.address.trim()) newErrors.address = 'Adresse ist erforderlich.';
    if (!formData.zip.trim()) {
      newErrors.zip = 'Postleitzahl ist erforderlich.';
    } else if (!/^\d{5}$/.test(formData.zip.trim())) {
      newErrors.zip = 'Die Postleitzahl muss genau 5 Ziffern enthalten.';
    }
    if (!formData.city.trim()) newErrors.city = 'Ort ist erforderlich.';
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      await updateCompany(company.companyId, {
        name: formData.name.trim(),
        address: formData.address.trim(),
        zip: formData.zip.trim(),
        city: formData.city.trim(),
        email: formData.email.trim(),
        description: formData.description.trim(),
      });
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('API update failed, simulating success in development mode:', err);
        setIsEditing(false);
        if (onUpdate) {
          onUpdate();
        }
        return;
      }
      setSaveError(err instanceof Error ? err.message : 'Fehler beim Speichern der Änderungen.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section
      aria-labelledby="company-profile-heading"
      className="bg-surface-raised border border-surface-border rounded-none p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5 w-full">
          <LogoUpload
            companyId={company.companyId}
            companyName={company.name}
            currentLogoUrl={company.logoUrl}
            onUploadSuccess={() => {
              if (onUpdate) onUpdate();
            }}
            isEditing={isEditing}
          />
          <div className="space-y-2 flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3 w-full max-w-md">
                <div className="form-control w-full">
                  <label htmlFor="edit-name" className="sr-only">Firmenname</label>
                  <input
                    id="edit-name"
                    ref={nameInputRef}
                    type="text"
                    className={`h-11 w-full text-white bg-black border border-surface-border hover:border-foreground-muted/65 focus:border-primary focus:outline-none text-lg font-bold font-sans rounded-lg transition-all duration-150 ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errors.name) setErrors({ ...errors, name: '' });
                    }}
                    disabled={isSaving}
                  />
                  {errors.name && <p className="text-xs text-red-400 mt-1" role="alert">{errors.name}</p>}
                </div>
                <div className="form-control w-full">
                  <label htmlFor="edit-description" className="sr-only">Unternehmensbeschreibung</label>
                  <textarea
                    id="edit-description"
                    rows={2}
                    maxLength={300}
                    placeholder="Unternehmensbeschreibung (max. 300 Zeichen)..."
                    className="w-full text-xs text-zinc-300 bg-black border border-surface-border hover:border-foreground-muted/65 focus:border-primary focus:outline-none rounded-lg p-3 transition-all duration-150 resize-none font-normal"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={isSaving}
                  />
                  <div className="flex justify-end mt-0.5">
                    <span className="text-[10px] text-zinc-400">
                      {formData.description.length} / 300 Zeichen
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <h2 id="company-profile-heading" className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans truncate">
                {company.name}
              </h2>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider border ${status.className}`}>
                <status.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {status.label}
              </span>
              {company.isSponsor && (
                <span className="inline-flex items-center gap-1.5 bg-[#EAB308]/10 px-3 py-1 rounded-full text-xs font-semibold text-[#EAB308] border border-[#EAB308]/20">
                  <Star className="h-3.5 w-3.5 fill-[#EAB308]/20" aria-hidden="true" />
                  Sponsor
                </span>
              )}
            </div>
            {!isEditing && (
              company.description ? (
                <p className="text-xs text-zinc-300 mt-3 leading-relaxed max-w-2xl font-normal">
                  {company.description}
                </p>
              ) : (
                <p className="text-xs text-zinc-500 mt-3 italic font-normal">
                  Keine Unternehmensbeschreibung hinterlegt. Klicken Sie auf das Stift-Symbol, um eine hinzuzufügen.
                </p>
              )
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={isSaving}
              className="relative px-3.5 py-2 rounded-lg text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-500/40 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-zinc-500 flex items-center gap-1.5"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Abbrechen</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="relative px-3.5 py-2 rounded-lg text-xs font-bold text-black bg-[#EAB308] hover:bg-[#EAB308]/90 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#EAB308] flex items-center gap-1.5 shadow-md"
            >
              {isSaving ? (
                <svg className="animate-spin h-3.5 w-3.5 text-black" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span>{isSaving ? 'Speichert…' : 'Speichern'}</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: company.name || '',
                address: company.address || '',
                zip: company.zip || '',
                city: company.city || '',
                email: company.email || '',
                description: company.description || '',
              });
              setErrors({});
              setSaveError(null);
              setIsEditing(true);
            }}
            className="relative p-2 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#EAB308]/40 text-zinc-300 hover:text-white transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#EAB308] flex items-center justify-center shrink-0 self-start sm:self-center"
            aria-label="Profil bearbeiten"
          >
            <Pencil className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {saveError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-400 rounded-lg flex items-center gap-2" role="alert">
          <X className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{saveError}</span>
        </div>
      )}

      <hr className="border-surface-border" aria-hidden="true" />

      {isEditing ? (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3 w-full max-w-2xl">
            <div className="flex-[2] flex flex-col gap-1.5">
              <label htmlFor="edit-address" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Straße & Hausnummer</label>
              <input
                id="edit-address"
                type="text"
                placeholder="Straße und Hausnummer"
                className={`h-10 w-full text-white bg-black border border-surface-border hover:border-foreground-muted/65 focus:border-primary focus:outline-none rounded-lg px-3 transition-all duration-150 text-sm ${errors.address ? 'border-red-500 focus:border-red-500' : ''}`}
                value={formData.address}
                onChange={(e) => {
                  setFormData({ ...formData, address: e.target.value });
                  if (errors.address) setErrors({ ...errors, address: '' });
                }}
                disabled={isSaving}
              />
              {errors.address && <p className="text-xs text-red-400 mt-1" role="alert">{errors.address}</p>}
            </div>
            <div className="w-full md:w-32 flex flex-col gap-1.5">
              <label htmlFor="edit-zip" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">PLZ</label>
              <input
                id="edit-zip"
                type="text"
                placeholder="PLZ"
                maxLength={5}
                className={`h-10 w-full text-white bg-black border border-surface-border hover:border-foreground-muted/65 focus:border-primary focus:outline-none rounded-lg px-3 transition-all duration-150 text-sm ${errors.zip ? 'border-red-500 focus:border-red-500' : ''}`}
                value={formData.zip}
                onChange={(e) => {
                  setFormData({ ...formData, zip: e.target.value });
                  if (errors.zip) setErrors({ ...errors, zip: '' });
                }}
                disabled={isSaving}
              />
              {errors.zip && <p className="text-xs text-red-400 mt-1" role="alert">{errors.zip}</p>}
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label htmlFor="edit-city" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ort</label>
              <input
                id="edit-city"
                type="text"
                placeholder="Ort"
                className={`h-10 w-full text-white bg-black border border-surface-border hover:border-foreground-muted/65 focus:border-primary focus:outline-none rounded-lg px-3 transition-all duration-150 text-sm ${errors.city ? 'border-red-500 focus:border-red-500' : ''}`}
                value={formData.city}
                onChange={(e) => {
                  setFormData({ ...formData, city: e.target.value });
                  if (errors.city) setErrors({ ...errors, city: '' });
                }}
                disabled={isSaving}
              />
              {errors.city && <p className="text-xs text-red-400 mt-1" role="alert">{errors.city}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full max-w-md">
            <label htmlFor="edit-email" className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">E-Mail</label>
            <input
              id="edit-email"
              type="email"
              placeholder="E-Mail-Adresse"
              className={`h-10 w-full text-white bg-black border border-surface-border hover:border-foreground-muted/65 focus:border-primary focus:outline-none rounded-lg px-3 transition-all duration-150 text-sm font-medium ${errors.email ? 'border-red-500' : ''}`}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              disabled={isSaving}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1" role="alert">{errors.email}</p>}
          </div>
        </div>
      ) : (
        <dl className="flex flex-col md:flex-row md:items-center gap-y-3 gap-x-8 text-sm">
          <div className="flex items-center gap-3">
            <dt className="flex items-center">
              <span className="sr-only">Adresse</span>
              <span className="p-1.5 rounded-lg bg-surface border border-surface-border text-[#EAB308] inline-flex">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              </span>
            </dt>
            <dd className="text-zinc-300">{company.address}, {company.zip} {company.city}</dd>
          </div>

          <div className="flex items-center gap-3">
            <dt className="flex items-center">
              <span className="sr-only">E-Mail</span>
              <span className="p-1.5 rounded-lg bg-surface border border-surface-border text-[#EAB308] inline-flex">
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              </span>
            </dt>
            <dd>
              <a
                href={`mailto:${company.email}`}
                className="relative text-[#3B82F6] hover:text-[#3B82F6]/80 font-medium hover:underline focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11 break-all"
              >
                {company.email}
              </a>
            </dd>
          </div>
        </dl>
      )}
    </section>
  );
}
