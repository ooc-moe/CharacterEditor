import { ActivityIcon, Code, PenIcon, TentTree } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ModeToggle } from '@/components/mode-toggle';
import { Link } from '@/i18n/routing';

export const runtime = "edge";
export default function Home() {
  const t = useTranslations();
  return (
    <>
      <div className="flex flex-1 justify-end p-4">
        <ModeToggle />
      </div>

      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-center gap-6">
          <Link
            className="group flex gap-y-6 size-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-lg p-5 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            href="/workspaces/exhibit/character"
          >
            <svg
              className="shrink-0 size-8 text-gray-800 mt-0.5 me-6 dark:text-neutral-200"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <PenIcon />
            </svg>

            <div>
              <div>
                <h3 className="block font-bold text-gray-800 dark:text-white">
                  {t("edit character")}
                </h3>
              </div>

              <p className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                {t("workspaces")}
                <svg
                  className="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </p>
            </div>
          </Link>
          <Link
            className="group flex gap-y-6 size-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-lg p-5 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            href="https://github.com/ooc-moe/CharacterEditor"
            target="_blanks"
          >
            <svg
              className="shrink-0 size-8 text-gray-800 mt-0.5 me-6 dark:text-neutral-200"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <Code />
            </svg>

            <div>
              <div>
                <h3 className="block font-bold text-gray-800 dark:text-white">
                  {t("code")}
                </h3>
                <p className="text-gray-600 dark:text-neutral-400"></p>
              </div>

              <p className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                Github
                <svg
                  className="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </p>
            </div>
          </Link>

          <Link
            className="group flex gap-y-6 size-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-lg p-5 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            href="https://status.ooc.moe"
            target="_blank"
          >
            <svg
              className=" shrink-0 size-8 text-gray-800 mt-0.5 me-6 dark:text-neutral-200"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <ActivityIcon  />
            </svg>

            <div>
              <div>
                <h3 className="block font-bold text-gray-800 dark:text-white">
                  {t("status")}
                </h3>
                <p className="text-gray-600 dark:text-neutral-400"></p>
              </div>

              <p className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                Status
                <svg
                  className="shrink-0 size-4 transition ease-in-out group-hover:translate-x-1 group-focus:translate-x-1"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}
