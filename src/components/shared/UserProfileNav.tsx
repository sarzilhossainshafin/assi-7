
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function UserProfileNav() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    const result = await authClient.signOut();

    if (!result.error) {
      router.push("/");
      router.refresh();
    }
  };

  if (isPending) {
    return <div className="h-10 w-24 animate-pulse rounded-lg bg-gray-100" />;
  }

  if (!session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/signin"
          className="hidden rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#65a30d] hover:text-[#65a30d] sm:inline-flex"
        >
          সাইন ইন
        </Link>

        <Link
          href="/signup"
          className="rounded-lg bg-[#65a30d] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#4d7c0f] sm:px-4"
        >
          সাইন আপ
        </Link>
      </div>
    );
  }

  const user = session.user;
  const initial = user.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/profile"
        aria-label="Open your profile"
        className="flex min-w-0 items-center gap-2 rounded-xl p-1.5 transition hover:bg-gray-100"
      >
        {user.image ? (
          <Image
  src={user.image}
  alt={user.name || "User profile"}
  width={40}
  height={40}
  unoptimized
  className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
/>
        ) : (
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#65a30d] text-lg font-bold text-white">
            {initial}
          </span>
        )}

        <span className="max-w-36 min-w-0">
          <span className="block text-xs text-gray-500">
            Welcome,
          </span>
          <span className="block truncate text-sm font-semibold text-gray-900">
            {user.name || user.email}
          </span>
        </span>
      </Link>

      <button
        type="button"
        onClick={handleSignOut}
        className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-red-500 hover:text-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}

