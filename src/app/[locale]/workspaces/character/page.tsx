"use client";
export const runtime = 'edge';
import { Link, useRouter } from "@/i18n/routing";
import { getCharacterField, usePageGuard } from "@/lib/character";
import { selectedCharacterIdAtom } from "@/store/action";
import { useAtom } from "jotai";
import { ArrowRightIcon, UserPenIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function page() {
  usePageGuard();
  return (
    <>
      <Header />
      <CharacterNav />
    </>
  );
}

export default page;

const navlists = [
  {
    name: "Character.creator_notes",
    path: "creator_notes",
    desc: "66",
    icon: UserPenIcon,
  },
  {
    name: "Character.first_mes",
    path: "first_mes",
    desc: "66",
    icon: UserPenIcon,
  },
  {
    name: "Character.alternate_greetings",
    path: "alternate_greetings",
    desc: "7",
    icon: UserPenIcon,
  },
  {
    name: "Character.description",
    path: "description",
    desc: "66",
    icon: UserPenIcon,
  },
  {
    name: "Character.mes_example",
    path: "mes_example",
    desc: "5",
    icon: UserPenIcon,
  },
  {
    name: "Character.",
    path: "first_mes",
    desc: "5",
    icon: UserPenIcon,
  }
];

function Header() {
  const [cid] = useAtom(selectedCharacterIdAtom);
  const [name, setName] = useState("");
  const fetchName = async () => {
    try {
      const rows = await getCharacterField(cid, "name");
      if (!rows) return;
      setName(rows);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchName();
  }, [cid]);
  return <div className="font-bold">{name}</div>;
}

function CharacterNav() {
  const t = useTranslations();
  const router = useRouter();
  return (
    <>
      <div className="flex flex-col gap-y-4">
        {navlists.map((item) => {
          const Icon = item.icon;
          return (
            <div
              onClick={() => router.push(`/workspaces/character/${item.path}`)}
            >
              <div className="flex justify-between items-center">
                <div className="flex flex-row gap-x-2 items-center">
                  <Icon />
                  <div className="flex flex-col">
                    <div className="font-bold">{t(item.name)}</div>
                    <div>{item.desc}</div>
                  </div>
                </div>
                <ArrowRightIcon />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
