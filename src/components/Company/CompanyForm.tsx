'use client';

import React, { useState, useRef } from 'react';
import type { CompanyDto, UpdateCompanyRequestDto } from '@/types/api.types';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { Alert } from '../UI/Alert';
import { Building2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface CompanyFormProps {
  company: CompanyDto;
  onSubmit: (data: UpdateCompanyRequestDto) => Promise<void>;
  isLoading?: boolean;
}

export function CompanyForm({ company, onSubmit, isLoading = false }: CompanyFormProps) {
  const [formData, setFormData] = useState({
    name: company.name || '',
    email: company.email || '',
    address: company.address || '',
    zip: company.zip || '',
    city: company.city || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Input refs for shifting focus on validation failures
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);

  const refs: Record<string, React.RefObject<HTMLInputElement | null>> = {
    name: nameRef,
    email: emailRef,
    address: addressRef,
    zip: zipRef,
    city: cityRef,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 1. Firmenname
    if (!formData.name.trim()) {
      newErrors.name = 'Firmenname ist erforderlich.';
    }

    // 2. E-Mail
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }

    // 3. Adresse
    if (!formData.address.trim()) {
      newErrors.address = 'Adresse ist erforderlich.';
    }

    // 4. PLZ (5-stellig)
    if (!formData.zip.trim()) {
      newErrors.zip = 'Postleitzahl ist erforderlich.';
    } else if (!/^\d{5}$/.test(formData.zip)) {
      newErrors.zip = 'Die Postleitzahl muss genau 5 Ziffern enthalten.';
    }

    // 5. Ort
    if (!formData.city.trim()) {
      newErrors.city = 'Ort ist erforderlich.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Focus the first invalid field
      const firstInvalidField = Object.keys(newErrors)[0];
      const targetRef = refs[firstInvalidField];
      if (targetRef && targetRef.current) {
        targetRef.current.focus();
      }
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    try {
      // Send PATCH payload
      const patchPayload: UpdateCompanyRequestDto = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        zip: formData.zip.trim(),
        city: formData.city.trim(),
      };
      await onSubmit(patchPayload);
      setSubmitSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ein unerwarteter Fehler ist aufgetreten.';
      setSubmitError(message);
    }
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden bg-surface-raised border border-surface-border rounded-xl p-6 md:p-8 space-y-6 shadow-2xl max-w-2xl mx-auto hover:border-surface-border/80 transition-colors duration-300"
      noValidate
    >
      {/* Top Gradient Accent Bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r",
        company.isSponsor 
          ? "from-emerald-500 via-accent to-blue-500" 
          : "from-blue-500 via-primary to-accent"
      )} />

      {/* Header section with icon badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-surface-border pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-bold text-foreground">Unternehmensprofil bearbeiten</h2>
              {company.isSponsor && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-400/10 text-slate-300 border border-slate-400/25 shadow-sm">
                  Platin Aussteller
                </span>
              )}
              {company.isFreundFoerderer && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25 shadow-sm">
                  Freunde & Förderer
                </span>
              )}
            </div>
            <p className="text-sm text-foreground-muted">
              Aktualisieren Sie hier die Daten Ihres Unternehmens. Alle Felder mit einem Stern (*) sind Pflichtfelder.
            </p>
          </div>
        </div>
      </div>

      {/* A11y Live region alerts */}
      <div aria-live="assertive" className="space-y-4">
        {hasErrors && (
          <Alert variant="error" title="Formularfehler">
            Bitte korrigieren Sie die markierten Felder vor dem Speichern.
          </Alert>
        )}

        {submitError && (
          <Alert variant="error" title="Fehler beim Speichern">
            {submitError}
          </Alert>
        )}

        {submitSuccess && (
          <Alert variant="success" title="Erfolgreich aktualisiert">
            Die Änderungen an Ihrem Unternehmensprofil wurden erfolgreich gespeichert.
          </Alert>
        )}
      </div>

      <div className="space-y-6">
        <Input
          ref={nameRef}
          label="Firmenname"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          isRequired
          placeholder="z. B. Muster GmbH"
          disabled={isLoading}
        />

        <Input
          ref={emailRef}
          label="E-Mail-Adresse"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          isRequired
          placeholder="kontakt@mustergmbh.de"
          disabled={isLoading}
        />

        <Input
          ref={addressRef}
          label="Straße und Hausnummer"
          name="address"
          value={formData.address}
          onChange={handleChange}
          error={errors.address}
          isRequired
          placeholder="Musterstraße 123"
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Input
              ref={zipRef}
              label="Postleitzahl"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              error={errors.zip}
              isRequired
              placeholder="12345"
              maxLength={5}
              disabled={isLoading}
            />
          </div>
          <div className="md:col-span-2">
            <Input
              ref={cityRef}
              label="Ort"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              isRequired
              placeholder="Musterstadt"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-surface-border">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          loadingText="Speichert..."
          className="font-bold px-6 py-2.5 flex items-center justify-center hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
        >
          Änderungen speichern
        </Button>
      </div>
    </form>
  );
}

export default CompanyForm;
