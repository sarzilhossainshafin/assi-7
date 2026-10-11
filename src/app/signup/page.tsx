
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("সবগুলো ঘর পূরণ করো।");
      return;
    }

    if (password.length < 8) {
      toast.error("Password কমপক্ষে ৮ অক্ষরের হতে হবে।");
      return;
    }

    try {
      setLoading(true);

      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("Signup failed:", error);
        toast.error(error.message || "Registration করা যায়নি।");
        return;
      }

      toast.success("Registration সফল হয়েছে!");
      router.push("/signin");
    } catch (error) {
      console.error("Signup request error:", error);
      toast.error("সমস্যা হয়েছে। আবার চেষ্টা করো।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex flex-1 items-center justify-center bg-[#f1f6f1] px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-green-100 bg-white p-6 shadow-lg sm:p-8">
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-3xl">
            🛒
          </div>

          <h1 className="text-3xl font-extrabold text-[#203b29]">
            Create Account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            বাজারদর দেখতে আপনার অ্যাকাউন্ট তৈরি করুন।
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Name
            </label>

            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="আপনার নাম লিখুন"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="কমপক্ষে ৮ অক্ষর"
              minLength={8}
              required
              disabled={loading}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-green-700 px-4 py-3 font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          আগে থেকেই account আছে?{" "}
          <Link
            href="/signin"
            className="font-bold text-green-700 hover:text-green-900"
          >
            Sign In
          </Link>
        </p>
      </section>
    </main>
  );
}
