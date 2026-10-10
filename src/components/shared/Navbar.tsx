
import Image from "next/image";
import Link from "next/link";
import { getCategories } from "@/lib/api";
import CategoryNavigation from "@/components/shared/CategoryNavigation";
import UserProfileNav from "@/components/shared/UserProfileNav";

export default async function Navbar() {
  const categories = await getCategories();

  const today = new Date();

  const banglaDate = today.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  });

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-20 items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/images/logo-icon.png"
              alt="বাজার দর"
              width={42}
              height={42}
              priority
              className="h-10 w-10 object-contain"
            />

            <div>
              <h1 className="text-xl font-bold leading-tight text-gray-900 sm:text-2xl">
                বাজার দর
              </h1>

              <p className="text-xs text-gray-500">
                {banglaDate}
              </p>
            </div>
          </Link>

          <UserProfileNav />
        </div>

        <CategoryNavigation categories={categories} />
      </div>
    </header>
  );
}
