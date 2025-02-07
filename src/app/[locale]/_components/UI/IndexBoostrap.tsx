"use client";
import { Link } from "../../../../i18n/routing";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { ActivityIcon, Code, PenIcon, TentTree } from "lucide-react";

function IndexBoostrap() {
  const t = useTranslations("IndexBoostrap");

  const [greeting, setGreeting] = useState(
    "CharacterEditorByOoCTalk,If you see this message for a long time, change your browser",
  );

  useEffect(() => {
    const currentHour = new Date().getHours();

    if (currentHour >= 5 && currentHour < 12) {
      setGreeting(t("good-morning"));
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting(t("good-afternoon"));
    } else if (currentHour >= 18 && currentHour < 22) {
      setGreeting(t("good-evening"));
    } else {
      setGreeting(t("its-late-at-night"));
    }
  }, []);

  return (
    <>
      <div className="animate-fade animate-delay-500 px-6 py-24 sm:py-32 lg:px-8 ">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            {greeting}
            <span className="">.</span>
          </h2>
        </div>
      </div>

      <div className=" max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 items-center gap-6">
          <Link
            className="animate-fade-up animate-delay-100 group flex gap-y-6 size-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-lg p-5 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            href="/workspaces"
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
                  {t("edit-character")}
                </h3>
                <p className="text-gray-600 dark:text-neutral-400"></p>
              </div>
              <p className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                {t('workbenches')}
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
            className="animate-fade-up animate-delay-200 group flex gap-y-6 size-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-lg p-5 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
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
            className="animate-fade-up animate-delay-300 group flex gap-y-6 size-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-lg p-5 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            href="https://ooc.moe"
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
              <TentTree />
            </svg>

            <div>
              <div>
                <h3 className="block font-bold text-gray-800 dark:text-white">
                  {t("community")}
                </h3>
                <p className="text-gray-600 dark:text-neutral-400">

                </p>
              </div>

              <p className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                OoC Moe
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
            className="animate-fade-up animate-delay-[400ms] group flex gap-y-6 size-full hover:bg-gray-100 focus:outline-none focus:bg-gray-100 rounded-lg p-5 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
            href="https://status.ooc.moe"
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
              <ActivityIcon />
            </svg>

            <div>
              <div>
                <h3 className="block font-bold text-gray-800 dark:text-white">
                  {t("uptime")}
                </h3>
                <p className="text-gray-600 dark:text-neutral-400"></p>
              </div>

              <p className="mt-3 inline-flex items-center gap-x-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                Stauts
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

export default IndexBoostrap;
