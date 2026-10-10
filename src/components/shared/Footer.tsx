import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-center text-sm font-bold text-[#65a30d] sm:text-left"
        >
          বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </Link>

        <p className="text-center text-sm leading-6 text-gray-500">
          সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।
        </p>
      </div>
    </footer>
  );
}