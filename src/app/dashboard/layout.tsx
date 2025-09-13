"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname?.includes('/admin') ? 'admin' : 'player';
  return (
    <div className="min-h-screen text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/dashboard/player" className={`px-4 py-2 rounded-lg border ${active==='player'?'bg-gray-800 border-gray-700':'border-gray-800 bg-transparent'}`}>Player</Link>
          <Link href="/dashboard/admin" className={`px-4 py-2 rounded-lg border ${active==='admin'?'bg-gray-800 border-gray-700':'border-gray-800 bg-transparent'}`}>Admin</Link>
        </div>
        {children}
      </div>
    </div>
  );
}
