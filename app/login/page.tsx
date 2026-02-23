"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            identifier,
            password,
            redirect: false,
        });

        if (!result || result.error) {
            setError("Invalid credentials");
            return;
        }

        const sessionRes = await fetch("/api/auth/session");
        const session = await sessionRes.json();

        const role = session?.user?.role;

        if (role === "ADMIN") {
            router.push("/admin");
        } else if (role === "TEACHER") {
            router.push("/teacher");
        } else if (role === "STUDENT") {
            router.push("/student");
        } else {
            router.push("/");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-xl shadow-md w-96 space-y-4"
            >
                <h1 className="text-2xl font-semibold text-center">Login</h1>

                <input
                    type="text"
                    placeholder="Email or Admission Number"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                />

                {error && (
                    <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded"
                >
                    Login
                </button>
            </form>
        </div>
    );
}