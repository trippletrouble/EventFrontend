'use client';

import { useState, useEffect } from 'react';
import { Building2, Upload, X, Check, Camera } from 'lucide-react';
import { ImageDropzone } from './ImageDropzone';
import { getLogoUploadUrl, updateCompany } from '@/services/company.service';

interface LogoUploadProps {
  companyId: number;
  companyName: string;
  currentLogoUrl?: string;
  onUploadSuccess: (newLogoUrl: string) => void;
  isEditing: boolean;
}

type UploadMode = 'view' | 'select' | 'preview' | 'uploading';

export function LogoUpload({
  companyId,
  companyName,
  currentLogoUrl,
  onUploadSuccess,
  isEditing,
}: LogoUploadProps) {
  const [mode, setMode] = useState<UploadMode>('view');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Reset to view mode if editing state changes to false
  useEffect(() => {
    if (!isEditing) {
      setMode('view');
      setSelectedFile(null);
      setError(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
    }
  }, [isEditing, previewUrl]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelect = (file: File) => {
    setError(null);
    
    // Validate file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      setError('Die Datei ist zu groß. Maximale Größe ist 2MB.');
      return;
    }

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setError('Ungültiges Format. Erlaubt sind PNG, JPEG, GIF oder SVG.');
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setMode('preview');
  };

  const handleCancelSelect = () => {
    setSelectedFile(null);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setMode('view');
  };

  const simulateDevUpload = (finalLogoUrl: string) => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        // Simulate updating company details
        updateCompany(companyId, { logoUrl: finalLogoUrl })
          .then(() => {
            onUploadSuccess(finalLogoUrl);
            setMode('view');
            setSelectedFile(null);
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
            }
          })
          .catch((err) => {
            console.warn('Simulated update error:', err);
            // Even if updateCompany mock fails, call success in dev mode
            onUploadSuccess(finalLogoUrl);
            setMode('view');
          });
      }
    }, 100);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setMode('uploading');
    setProgress(0);
    setError(null);

    try {
      // 1. Get presigned URL from backend
      const { uploadUrl, logoUrl } = await getLogoUploadUrl(
        companyId,
        selectedFile.name,
        selectedFile.type
      );

      // 2. Upload file directly to MinIO using XMLHttpRequest to track progress
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', selectedFile.type);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });

      xhr.onload = async () => {
        if (xhr.status === 200 || xhr.status === 201 || xhr.status === 204) {
          try {
            // 3. Update company profile with new logo URL
            await updateCompany(companyId, { logoUrl });
            onUploadSuccess(logoUrl);
            setMode('view');
            setSelectedFile(null);
            if (previewUrl) {
              URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
            }
          } catch (patchErr) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('API PATCH failed, simulating success in dev mode:', patchErr);
              onUploadSuccess(logoUrl);
              setMode('view');
              return;
            }
            setError('Fehler beim Aktualisieren der Firmendaten.');
            setMode('preview');
          }
        } else {
          setError(`Upload fehlgeschlagen. Server antwortete mit: ${xhr.statusText}`);
          setMode('preview');
        }
      };

      xhr.onerror = () => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('PUT upload failed, simulating success in dev mode');
          simulateDevUpload(logoUrl);
          return;
        }
        setError('Netzwerkfehler beim Logo-Upload.');
        setMode('preview');
      };

      xhr.send(selectedFile);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Requesting presigned URL failed, simulating upload in dev mode:', err);
        // Create a local data URL as finalLogoUrl so it renders the preview as the logo
        simulateDevUpload(previewUrl || '/logos/mock-logo.png');
        return;
      }
      setError(err instanceof Error ? err.message : 'Upload-Berechtigung konnte nicht abgerufen werden.');
      setMode('preview');
    }
  };

  return (
    <div className="space-y-4">
      {/* View Mode */}
      {mode === 'view' && (
        <div className="relative group h-24 w-24 md:h-28 md:w-28 shrink-0 bg-surface border border-surface-border rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
          {currentLogoUrl ? (
            <img
              src={currentLogoUrl}
              alt={`${companyName} Logo`}
              className="h-full w-full object-contain p-2"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-1">
              <Building2 className="h-10 w-10 text-[#EAB308]" aria-hidden="true" />
              <span className="text-[10px] font-medium text-zinc-400 leading-tight text-center px-1">
                Logo fehlt
              </span>
            </div>
          )}

          {isEditing && (
            <button
              type="button"
              onClick={() => setMode('select')}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 flex flex-col items-center justify-center gap-1 text-white font-bold text-[10px] uppercase tracking-wider transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-[#EAB308]"
              aria-label="Firmenlogo ändern"
            >
              <Camera className="h-5 w-5 text-[#EAB308]" aria-hidden="true" />
              <span>Ändern</span>
            </button>
          )}
        </div>
      )}

      {/* Select Mode */}
      {mode === 'select' && (
        <div className="space-y-2 max-w-sm">
          <ImageDropzone onFileSelect={handleFileSelect} />
          <button
            type="button"
            onClick={handleCancelSelect}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white bg-zinc-850 hover:bg-zinc-800 border border-zinc-700/50 transition-colors"
          >
            Abbrechen
          </button>
        </div>
      )}

      {/* Preview Mode */}
      {mode === 'preview' && previewUrl && (
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 bg-surface border border-surface-border rounded-xl overflow-hidden flex items-center justify-center shrink-0">
              <img
                src={previewUrl}
                alt="Vorschau des ausgewählten Logos"
                className="h-full w-full object-contain p-1.5"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {selectedFile?.name}
              </p>
              <p className="text-[10px] text-zinc-400">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : ''}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleUpload}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-black bg-[#EAB308] hover:bg-[#EAB308]/90 transition-all duration-150 flex items-center gap-1"
            >
              <Upload className="h-3.5 w-3.5" aria-hidden="true" />
              Logo hochladen
            </button>
            <button
              type="button"
              onClick={handleCancelSelect}
              className="px-3.5 py-2 rounded-lg text-xs font-bold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 transition-all duration-150 flex items-center gap-1"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Verwerfen
            </button>
          </div>
        </div>
      )}

      {/* Uploading Mode */}
      {mode === 'uploading' && previewUrl && (
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="h-20 w-20 bg-surface border border-surface-border rounded-xl overflow-hidden flex items-center justify-center shrink-0 relative">
              <img
                src={previewUrl}
                alt="Vorschau des ausgewählten Logos"
                className="h-full w-full object-contain p-1.5 opacity-40"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-[#EAB308]" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-zinc-300">Wird hochgeladen...</span>
                <span className="font-bold text-[#EAB308]">{progress}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-[#EAB308] h-full rounded-full transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div
          className="p-3 bg-red-500/10 border border-red-500/20 text-xs text-red-400 rounded-lg flex items-center gap-2 max-w-sm"
          role="alert"
        >
          <X className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

export default LogoUpload;
