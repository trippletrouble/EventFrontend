'use client';

import React from 'react';
import { useAuth } from '../providers/AuthProvider';

export default function LoginPage() {
  const { login } = useAuth();

  return (
    <main className="flex flex-col flex-1 items-center justify-center min-h-[80vh] px-4 bg-zinc-50 dark:bg-black font-sans">
      <div className="max-w-md w-full p-8 rounded-2xl border border-zinc-200/50 bg-white/70 shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-900/70 transition-all duration-300 hover:shadow-2xl text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-2">
          Willkommen zurück
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Bitte melden Sie sich an, um auf die Plattform zuzugreifen.
        </p>
        <button
          onClick={login}
          className="w-full flex items-center justify-center py-3 px-5 text-sm font-medium text-white bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 rounded-lg shadow-md transition-colors duration-200 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950 dark:focus-visible:outline-zinc-50"
          >
          Mit Keycloak anmelden
        </button>
      </div>
    </main>
  );
}
