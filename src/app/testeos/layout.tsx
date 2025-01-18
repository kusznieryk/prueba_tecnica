"use client"
import React from 'react';
import Link from 'next/link';
import { FaHouse, FaFileLines, FaFileArrowUp } from "react-icons/fa6";
import { usePathname } from 'next/navigation'

export default function TesteosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname()

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className=" breadcrumbs mb-4">
        <ul>
          <li>
            <Link href="/" className="flex items-center gap-2">
              <FaHouse />
              {" "} Inicio
            </Link>
          </li>
          <li>
            <Link href="/testeos" className="flex items-center gap-2">
              <FaFileLines />
              Testeos
            </Link>
          </li>
          {pathname === '/testeos/nuevo_testeo' && (
            <li>
              <FaFileArrowUp />
              Nuevo Testeo
            </li>)
          }
        </ul>
      </div>

      <h1 className="text-2xl font-bold mb-6">Testeos</h1>

      <div className="bg-base-100 rounded-lg shadow">
        {children}
      </div>
    </div>
  );
};