"use client";
export const runtime = 'edge';
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslations } from "next-intl";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAtom } from "jotai";
import {
  selectedCharacterBookEntriesAtom,
  selectedCharacterBookIdAtom,
} from "@/store/action";
import { getCharacterBook } from "@/lib/worldbook";
import { useLiveQuery } from "dexie-react-hooks";
import { CharacterBookTable, db } from "@/db/schema";
import { Label } from "@/components/ui/label";

function page() {
  return <Header />;
}

export default page;

function Header() {
  const t = useTranslations();
  const [bid] = useAtom(selectedCharacterBookIdAtom);
  const [eid] = useAtom(selectedCharacterBookEntriesAtom);
  const entries = useLiveQuery(() =>
    db.characterBook.get(bid).then((item) => {
      if (item) {
        return item.entries[eid];
      }
    })
  );
  return (
    <Tabs  defaultValue="profile">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
        <TabsTrigger value="content">{t("content")}</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Profile
          bid={bid as number}
          eid={eid as number}
          entries={entries as CharacterBookEntries}
        />
      </TabsContent>
      <TabsContent   value="content">
        <Content
          bid={bid as number}
          eid={eid as number}
          entries={entries as CharacterBookEntries}
        />
      </TabsContent>
    </Tabs>
  );
}

interface CharacterBookEntries {
  keys: Array<string>;
  content: string;
  extensions: Record<string, any>;
  enabled: boolean;
  insertion_order: number;
  case_sensitive?: boolean;
  name?: string;
  priority?: number;
  id?: number;
  comment?: string;
  selective?: boolean;
  secondary_keys?: Array<string>;
  constant?: boolean;
  position?: string;
}

function Profile({
  bid,
  eid,
  entries,
}: {
  bid: number;
  eid: number;
  entries: CharacterBookEntries;
}) {
  const t = useTranslations();
  return (
    <>
      <div className="grid w-full items-center gap-1.5">
        <Label>{t("WorldBook.keys")}</Label>
        <Textarea
          value={entries?.keys}
          placeholder={t("WorldBook.keys_placeholder")}
        />
        <Label>{t("WorldBook.second_keys")}</Label>
        <Textarea
          value={entries?.keys}
          placeholder={t("WorldBook.keys_placeholder")}
        />
      </div>
    </>
  );
}

function Content({
  bid,
  eid,
  entries,
}: {
  bid: number;
  eid: number;
  entries: CharacterBookEntries;
}) {
  return <Textarea className="h-[83vh]" value={entries.content} />;
}
