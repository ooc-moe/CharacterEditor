"use client";
export const runtime = 'edge';
import { useAtom } from 'jotai';
import { ArrowRightIcon, ClapperboardIcon, FileUserIcon, HammerIcon, HistoryIcon, MessageSquareIcon, MessageSquareTextIcon, MessagesSquareIcon, NotebookTextIcon, TagIcon, VenetianMaskIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { useRouter } from '@/i18n/routing';
import { getCharacterField, usePageGuard } from '@/lib/character';
import { selectedCharacterIdAtom } from '@/store/action';

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
    desc: "Creator Notes",
    icon: NotebookTextIcon,
  },
  {
    name: "Character.first_mes",
    path: "first_mes",
    desc: "First Message",
    icon: MessageSquareIcon,
  },
  {
    name: "Character.alternate_grettings",
    path: "alternate_greetings",
    desc: "Alternate Greetings",
    icon: MessagesSquareIcon,
  },
  {
    name: "Character.description",
    path: "description",
    desc: "Description",
    icon: FileUserIcon,
  },
  {
    name: "Character.mes_example",
    path: "mes_example",
    desc: "Mes Example",
    icon: MessageSquareTextIcon,
  },
  {
    name: "Character.personality",
    path: "personality",
    desc: "Personality",
    icon: VenetianMaskIcon,
  },
  {
    name: "Character.post_history_instructions",
    path: "post_history_instructions",
    desc: "Post History Instructions",
    icon: HistoryIcon,
  },
  {
    name: "Character.scenario",
    path: "scenario",
    desc: "Scenario",
    icon: ClapperboardIcon,
  },
  {
    name: "Character.system_prompt",
    path: "system_prompt",
    desc: "System_prompt",
    icon: HammerIcon,
  },
  {
    name: "Character.tags",
    path: "tags",
    desc: "Tags",
    icon: TagIcon,
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
