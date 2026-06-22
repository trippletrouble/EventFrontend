'use client';

import type { UserDto } from '@/types/api.types';
import { Mail, Plus, Pencil } from 'lucide-react';
import { useState } from 'react';
import { Modal } from '@/components/UI/Modal';
import { Input } from '@/components/UI/Input';

interface MemberListProps {
  members: UserDto[];
  isWritable?: boolean;
  companyId?: number;
}

const MAX_MEMBERS = 5;

export function MemberList({ members, isWritable = true, companyId }: MemberListProps) {
  const [addedMembers, setAddedMembers] = useState<UserDto[]>(() => {
    if (typeof window !== 'undefined' && companyId) {
      const saved = localStorage.getItem(`ev_company_added_members_${companyId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse added members:', e);
        }
      }
    }
    return [];
  });

  const [deletedMemberIds, setDeletedMemberIds] = useState<number[]>(() => {
    if (typeof window !== 'undefined' && companyId) {
      const saved = localStorage.getItem(`ev_company_deleted_members_${companyId}`);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse deleted member IDs:', e);
        }
      }
    }
    return [];
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<UserDto | null>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    linkedin: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (displayedMembers.length >= MAX_MEMBERS) {
      newErrors.firstName = 'Maximale Anzahl von Ansprechpartnern erreicht.';
      setErrors(newErrors);
      return;
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich.';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }

    if (formData.linkedin.trim()) {
      const val = formData.linkedin.trim();
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        newErrors.linkedin = 'Bitte geben Sie einen vollständigen Link inklusive https:// ein.';
      } else if (!val.includes('linkedin.com')) {
        newErrors.linkedin = 'Bitte geben Sie eine gültige LinkedIn-URL ein.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newMember: UserDto = {
      userId: Date.now(),
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      linkedin: formData.linkedin.trim() || null,
      role: 'COMPANY_USER',
    };

    const updatedAdded = [...addedMembers, newMember];
    setAddedMembers(updatedAdded);
    if (typeof window !== 'undefined' && companyId) {
      localStorage.setItem(`ev_company_added_members_${companyId}`, JSON.stringify(updatedAdded));
    }

    setIsAddModalOpen(false);
    setFormData({ firstName: '', lastName: '', email: '', linkedin: '' });
    setErrors({});
  };

  const handleEditMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Vorname ist erforderlich.';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Nachname ist erforderlich.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'E-Mail-Adresse ist erforderlich.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
    }

    if (formData.linkedin.trim()) {
      const val = formData.linkedin.trim();
      if (!val.startsWith('http://') && !val.startsWith('https://')) {
        newErrors.linkedin = 'Bitte geben Sie einen vollständigen Link inklusive https:// ein.';
      } else if (!val.includes('linkedin.com')) {
        newErrors.linkedin = 'Bitte geben Sie eine gültige LinkedIn-URL ein.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const isAdded = addedMembers.some((m) => m.userId === editingMember.userId);
    if (isAdded) {
      const updatedAdded = addedMembers.map((m) =>
        m.userId === editingMember.userId
          ? {
              ...m,
              firstName: formData.firstName.trim(),
              lastName: formData.lastName.trim(),
              email: formData.email.trim(),
              linkedin: formData.linkedin.trim() || null,
            }
          : m
      );
      setAddedMembers(updatedAdded);
      if (typeof window !== 'undefined' && companyId) {
        localStorage.setItem(`ev_company_added_members_${companyId}`, JSON.stringify(updatedAdded));
      }
    } else {
      // It's a member from props. We can simulate editing by saving it to addedMembers list, or keep it simple.
      // Let's add it to the deleted list and add the modified version to the addedMembers list!
      // This is a robust workaround that simulates editing original members correctly in front-end.
      const updatedDeleted = [...deletedMemberIds, editingMember.userId];
      setDeletedMemberIds(updatedDeleted);
      
      const newMember: UserDto = {
        ...editingMember,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        linkedin: formData.linkedin.trim() || null,
      };
      const updatedAdded = [...addedMembers, newMember];
      setAddedMembers(updatedAdded);

      if (typeof window !== 'undefined' && companyId) {
        localStorage.setItem(`ev_company_deleted_members_${companyId}`, JSON.stringify(updatedDeleted));
        localStorage.setItem(`ev_company_added_members_${companyId}`, JSON.stringify(updatedAdded));
      }
    }

    setIsEditModalOpen(false);
    setEditingMember(null);
    setFormData({ firstName: '', lastName: '', email: '', linkedin: '' });
    setErrors({});
  };

  const handleDeleteMember = (userId: number) => {
    if (addedMembers.some((m) => m.userId === userId)) {
      const updatedAdded = addedMembers.filter((m) => m.userId !== userId);
      setAddedMembers(updatedAdded);
      if (typeof window !== 'undefined' && companyId) {
        localStorage.setItem(`ev_company_added_members_${companyId}`, JSON.stringify(updatedAdded));
      }
    } else {
      const updatedDeleted = [...deletedMemberIds, userId];
      setDeletedMemberIds(updatedDeleted);
      if (typeof window !== 'undefined' && companyId) {
        localStorage.setItem(`ev_company_deleted_members_${companyId}`, JSON.stringify(updatedDeleted));
      }
    }
    setIsEditModalOpen(false);
    setEditingMember(null);
  };

  const openEditModal = (member: UserDto) => {
    setEditingMember(member);
    setFormData({
      firstName: member.firstName || '',
      lastName: member.lastName || '',
      email: member.email || '',
      linkedin: member.linkedin || '',
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const displayedMembers = [
    ...members.filter((m) => !deletedMemberIds.includes(m.userId)),
    ...addedMembers,
  ];

  return (
    <>
      <section
        aria-labelledby="member-list-heading"
        className="bg-surface-raised border-2 border-surface-border rounded-none p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6 animate-fade-in"
      >
        <div className="space-y-1">
          <h2 id="member-list-heading" className="text-xl font-bold text-white tracking-tight font-sans">
            <span>{isWritable ? 'Ihre Mitglieder' : 'Unsere Ansprechpartner'}</span>
          </h2>
          <p className="text-xs text-foreground-muted leading-relaxed">
            {isWritable
              ? 'Verwalten Sie die Personen, die als Ansprechpartner für Ihr Unternehmen hinterlegt sind.'
              : 'Hier finden Sie Ihre Ansprechpartner, die Ihnen bei Fragen zur Verfügung stehen.'}
          </p>
        </div>

        {displayedMembers.length === 0 ? (
          <div className="border-2 border-dashed border-surface-border rounded-xl p-6 text-center">
            <p className="text-sm text-zinc-400">Noch keine Mitglieder vorhanden.</p>
          </div>
        ) : (
          <ul className="space-y-3" aria-label="Mitgliederliste">
            {[...displayedMembers].sort((a, b) => (a.role === 'ADMIN' ? -1 : b.role === 'ADMIN' ? 1 : 0)).map((member) => {
              const initials = (member.firstName && member.lastName)
                ? `${member.firstName[0]}${member.lastName[0]}`.toUpperCase()
                : member.email.substring(0, 2).toUpperCase();
              const fullName = member.firstName && member.lastName
                ? `${member.firstName} ${member.lastName}`
                : member.email;

              return (
                <li
                  key={member.userId}
                  className="flex items-center justify-between p-4 bg-surface border-2 border-surface-border hover:border-zinc-500 rounded-xl transition-all duration-200"
                >
                  <div className="flex items-center gap-5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center font-bold text-xs text-zinc-300 shrink-0 select-none shadow-inner">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {fullName}
                      </p>
                      {member.firstName && member.lastName && (
                        <p className="text-xs text-zinc-400 truncate mt-0.5">{member.email}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    {isWritable ? (
                      <button
                        type="button"
                        onClick={() => openEditModal(member)}
                        className="relative p-2 rounded-lg bg-transparent border-2 border-zinc-700 hover:border-[#EAB308] text-zinc-300 hover:text-white transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#EAB308] flex items-center justify-center after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11"
                        aria-label={`Ansprechpartner ${fullName} bearbeiten`}
                        title={`Ansprechpartner ${fullName} bearbeiten`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                    ) : (
                      <>
                        <a
                          href={`mailto:${member.email}`}
                          className="relative p-2 rounded-lg bg-transparent border-2 border-zinc-700 hover:border-[#EAB308] text-zinc-300 hover:text-white transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary flex items-center justify-center after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11"
                          aria-label={`E-Mail an ${fullName} senden`}
                          title={`E-Mail an ${fullName} senden`}
                        >
                          <Mail className="h-4.5 w-4.5" aria-hidden="true" />
                        </a>
                        {member.linkedin && (
                          <a
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative p-2 rounded-lg bg-transparent border-2 border-zinc-700 hover:border-[#0077B5] text-zinc-300 hover:text-white transition-all duration-200 active:scale-[0.98] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#0077B5] flex items-center justify-center after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11"
                            aria-label={`LinkedIn-Profil von ${fullName} öffnen`}
                            title={`LinkedIn-Profil von ${fullName} öffnen`}
                          >
                            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                            </svg>
                          </a>
                        )}
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {isWritable && (
          <div className="pt-2">
            <button
              type="button"
              disabled={displayedMembers.length >= MAX_MEMBERS}
              onClick={() => {
                setFormData({ firstName: '', lastName: '', email: '', linkedin: '' });
                setErrors({});
                setIsAddModalOpen(true);
              }}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-[#EAB308] hover:text-black hover:bg-[#EAB308] border-2 border-[#EAB308] transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-[#EAB308] disabled:hover:bg-transparent disabled:hover:border-[#EAB308] focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#EAB308] after:content-[''] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:w-11 after:h-11 cursor-pointer w-full bg-transparent"
              aria-label="Ansprechpartner hinzufügen"
            >
              <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>Ansprechpartner hinzufügen</span>
            </button>
            {displayedMembers.length >= MAX_MEMBERS && (
              <p className="text-[11px] text-zinc-500 text-center mt-2" role="alert">
                Maximale Anzahl von {MAX_MEMBERS} Ansprechpartnern erreicht.
              </p>
            )}
          </div>
        )}
      </section>

      {/* Add Modal */}
      <Modal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        title="Ansprechpartner hinzufügen"
        actions={
          <div className="flex justify-end gap-2 w-full">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="relative px-4 py-2 text-sm font-bold text-zinc-300 hover:text-white bg-transparent border-2 border-zinc-700 hover:border-zinc-500 rounded-lg transition-all focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-zinc-500 after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11 cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              form="add-contact-form"
              className="relative px-4 py-2 text-sm font-bold text-black bg-[#EAB308] hover:bg-yellow-500 border-2 border-[#EAB308] hover:border-yellow-500 rounded-lg transition-all focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#EAB308] after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11 cursor-pointer"
            >
              Hinzufügen
            </button>
          </div>
        }
      >
        <form id="add-contact-form" onSubmit={handleAddMember} className="space-y-4" noValidate>
          <Input
            label="Vorname"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
              if (errors.firstName) setErrors({ ...errors, firstName: '' });
            }}
            error={errors.firstName}
            isRequired
            placeholder="z. B. Max"
          />
          <Input
            label="Nachname"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
              if (errors.lastName) setErrors({ ...errors, lastName: '' });
            }}
            error={errors.lastName}
            isRequired
            placeholder="z. B. Mustermann"
          />
          <Input
            label="E-Mail-Adresse"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            isRequired
            placeholder="z. B. max.mustermann@firma.de"
          />
          <Input
            label="LinkedIn-Profil (Optional)"
            name="linkedin"
            type="url"
            value={formData.linkedin}
            onChange={(e) => {
              setFormData({ ...formData, linkedin: e.target.value });
              if (errors.linkedin) setErrors({ ...errors, linkedin: '' });
            }}
            error={errors.linkedin}
            placeholder="z. B. https://www.linkedin.com/in/maxmustermann"
          />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        title="Ansprechpartner bearbeiten"
        actions={
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              onClick={() => {
                if (editingMember) {
                  handleDeleteMember(editingMember.userId);
                }
              }}
              className="relative px-4 py-2 text-sm font-bold text-red-500 hover:text-white bg-transparent border-2 border-red-500 hover:border-red-600 hover:bg-red-600 rounded-lg transition-all focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-destructive after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11 cursor-pointer mr-auto"
            >
              Entfernen
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="relative px-4 py-2 text-sm font-bold text-zinc-300 hover:text-white bg-transparent border-2 border-zinc-700 hover:border-zinc-500 rounded-lg transition-all focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-zinc-500 after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11 cursor-pointer"
              >
                Abbrechen
              </button>
              <button
                type="submit"
                form="edit-contact-form"
                className="relative px-4 py-2 text-sm font-bold text-black bg-[#EAB308] hover:bg-yellow-500 border-2 border-[#EAB308] hover:border-yellow-500 rounded-lg transition-all focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#EAB308] after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11 cursor-pointer"
              >
                Speichern
              </button>
            </div>
          </div>
        }
      >
        <form id="edit-contact-form" onSubmit={handleEditMember} className="space-y-4" noValidate>
          <Input
            label="Vorname"
            name="firstName"
            value={formData.firstName}
            onChange={(e) => {
              setFormData({ ...formData, firstName: e.target.value });
              if (errors.firstName) setErrors({ ...errors, firstName: '' });
            }}
            error={errors.firstName}
            isRequired
            placeholder="z. B. Max"
          />
          <Input
            label="Nachname"
            name="lastName"
            value={formData.lastName}
            onChange={(e) => {
              setFormData({ ...formData, lastName: e.target.value });
              if (errors.lastName) setErrors({ ...errors, lastName: '' });
            }}
            error={errors.lastName}
            isRequired
            placeholder="z. B. Mustermann"
          />
          <Input
            label="E-Mail-Adresse"
            name="email"
            type="email"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: '' });
            }}
            error={errors.email}
            isRequired
            placeholder="z. B. max.mustermann@firma.de"
          />
          <Input
            label="LinkedIn-Profil (Optional)"
            name="linkedin"
            type="url"
            value={formData.linkedin}
            onChange={(e) => {
              setFormData({ ...formData, linkedin: e.target.value });
              if (errors.linkedin) setErrors({ ...errors, linkedin: '' });
            }}
            error={errors.linkedin}
            placeholder="z. B. https://www.linkedin.com/in/maxmustermann"
          />
        </form>
      </Modal>
    </>
  );
}


