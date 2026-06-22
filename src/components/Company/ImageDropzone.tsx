'use client';

import type { DragEvent, KeyboardEvent, ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ImageDropzoneProps {
  onFileSelect: (file: File) => void;
  isUploading?: boolean;
}

export function ImageDropzone({ onFileSelect, isUploading = false }: ImageDropzoneProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isUploading) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onButtonClick();
    }
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      onClick={onButtonClick}
      tabIndex={isUploading ? -1 : 0}
      role="button"
      aria-label="Bild per Drag and Drop ablegen oder klicken zum Auswählen"
      aria-disabled={isUploading}
      className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 select-none min-h-[140px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EAB308] ${
        isDragActive
          ? 'border-[#EAB308] bg-[#EAB308]/5'
          : 'border-surface-border bg-black hover:border-zinc-500/50 hover:bg-zinc-900/30'
      } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        id="logo-file-input"
        accept="image/png, image/jpeg, image/gif, image/svg+xml"
        onChange={handleChange}
        disabled={isUploading}
        className="sr-only"
        tabIndex={-1}
      />
      
      <div className="flex flex-col items-center justify-center space-y-2 text-center">
        {isDragActive ? (
          <>
            <Upload className="h-8 w-8 text-[#EAB308] animate-bounce" aria-hidden="true" />
            <p className="text-sm font-semibold text-[#EAB308]">Datei hier ablegen...</p>
          </>
        ) : (
          <>
            <div className="p-2 rounded-lg bg-zinc-800/80 border border-zinc-700 text-[#EAB308]">
              <ImageIcon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">
                Logo hochladen
              </p>
              <p className="text-xs text-zinc-400">
                Drag & Drop oder <span className="text-[#3B82F6] hover:underline">durchsuchen</span>
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">
                PNG, JPEG, GIF oder SVG (max. 2MB)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ImageDropzone;
