import React from "react";
import Link from "next/link";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex">
            <aside className="w-64 bg-green-900 text-white p-6 space-y-4">
                <h2 className="text-xl font-semibold mb-6">Student Panel</h2>

                <nav className="space-y-2">
                    <Link href="/student" className="block hover:text-gray-300">
                        Dashboard
                    </Link>
                    <Link href="/student/attendance" className="block hover:text-gray-300">
                        Attendance
                    </Link>
                    <Link href="/student/homework" className="block hover:text-gray-300">
                        Homework
                    </Link>
                </nav>
            </aside>

            <main className="flex-1 p-8 bg-gray-100">
                {children}
            </main>
        </div>
    );
}