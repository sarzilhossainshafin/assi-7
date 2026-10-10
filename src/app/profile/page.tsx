
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/signin");
    }
  }, [isPending, session?.user, router]);

  if (isPending || !session?.user) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </main>
    );
  }


  return (
    <ProfileForm
      key={session.user.id}
      initialName={session.user.name || ""}
      email={session.user.email}
      image={session.user.image}
    />
  );
}

type ProfileFormProps = {
  initialName: string;
  email: string;
  image?: string | null;
};

function ProfileForm({ initialName, email, image }: ProfileFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialName);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  const initial = initialName.trim().charAt(0).toUpperCase() || "U";

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName) {
      setMessage("Please enter your name.");
      setIsSuccess(false);
      return;
    }

    if (trimmedName === initialName) {
      setMessage("No changes to save.");
      setIsSuccess(false);
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const result = await authClient.updateUser({
        name: trimmedName,
      });

      if (result.error) {
        setMessage(result.error.message || "Profile update failed.");
        setIsSuccess(false);
        return;
      }

      setMessage("Profile updated successfully!");
      setIsSuccess(true);

      // Refresh the current route after updating the profile.
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
      setIsSuccess(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-[70vh] bg-gray-50 px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-block text-sm font-medium text-[#65a30d] hover:underline"
        >
          ← Back to Home
        </Link>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-8 text-center">
            {image ? (
              <Image
                src={image}
                alt={initialName || "User profile"}
                width={96}
                height={96}
                unoptimized
                className="mx-auto mb-4 h-24 w-24 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-[#65a30d] text-3xl font-bold text-white">
                {initial}
              </div>
            )}

            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              My Profile
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Manage your account information.
            </p>
          </div>

          <form onSubmit={handleUpdate} className="space-y-5">
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                maxLength={100}
                autoComplete="name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 outline-none transition focus:border-[#65a30d] focus:ring-2 focus:ring-[#65a30d]/20"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
              />

              <p className="mt-1 text-xs text-gray-500">
                Email address cannot be changed here.
              </p>
            </div>

            {message && (
              <p
                role="status"
                aria-live="polite"
                className={`text-sm ${
                  isSuccess ? "text-green-700" : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || !name.trim() || name.trim() === initialName}
              className="w-full rounded-lg bg-[#65a30d] px-5 py-3 font-semibold text-white transition hover:bg-[#4d7c0f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
