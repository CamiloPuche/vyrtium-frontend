'use client';

import React from 'react';
import { AuthSliderCard } from '../../components/auth/AuthSliderCard';

export default function RegistroPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 selection:bg-indigo-500 selection:text-white">
      <AuthSliderCard initialMode="register" />
    </main>
  );
}
