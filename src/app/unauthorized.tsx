'use client';

import React from 'react';
import { useAuth } from './providers/AuthProvider';

export default function UnauthorizedPage() {
  const { login } = useAuth();

  return (
    <main id="main-content" className="flex flex-col flex-1 items-center justify-center min-h-[70vh] px-4 bg-zinc-50 text-center dark:bg-black font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl border border-zinc-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/70 transition-all duration-300 hover:shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 dark:text-red-400">
            <svg
              className="w-12 h-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
          Zugriff verweigert
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
          Bitte melden Sie sich an, um auf diese geschützten Ressourcen zuzugreifen.
        </p>
        <button
          onClick={login}
          className="w-full flex items-center justify-center py-3 px-5 text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-lg shadow transition-colors duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-zinc-50"
        >
          Jetzt anmelden
        </button>
      </div>
    </main>
  );
}
