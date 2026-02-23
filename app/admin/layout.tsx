import React from "react";
import Link from "next/link";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-gray-900 text-white p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-6">Admin Panel</h2>

                <nav className="space-y-2">
                    <Link href="/admin" className="block hover:text-gray-300">
                        Dashboard
                    </Link>
                    <Link href="/admin/students" className="block hover:text-gray-300">
                        Students
                    </Link>
                    <Link href="/admin/teachers" className="block hover:text-gray-300">
                        Teachers
                    </Link>
                    <Link href="/admin/classes" className="block hover:text-gray-300">
                        Classes
                    </Link>
                    <Link href="/admin/attendance" className="block hover:text-gray-300">
                        Attendance
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 p-8 bg-gray-100">
                {children}
            </main>
        </div>
    );
}