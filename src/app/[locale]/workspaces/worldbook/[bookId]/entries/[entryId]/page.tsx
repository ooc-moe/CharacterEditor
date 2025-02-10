"use client";
export const runtime = "edge";
import { useLiveQuery } from "dexie-react-hooks";
import { useTranslations } from "next-intl";

import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/db/schema";
import { useParams } from "next/navigation";

function page() {
  return <Header />;
}

export default page;

function Header() {
  const t = useTranslations();
  const params = useParams();
  const entries = useLiveQuery(() =>
    db.characterBook.get(Number(params.bookId)).then((item) => {
      if (item) {
        return item.entries[Number(params.entryId)];
      }
    })
  );
  return (
    <Tabs defaultValue="profile">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
        <TabsTrigger value="content">{t("content")}</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Profile entries={entries as CharacterBookEntries} />
      </TabsContent>
      <TabsContent value="content">
        <Content entries={entries as CharacterBookEntries} />
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

function Profile({ entries }: { entries: CharacterBookEntries }) {
  const t = useTranslations();
  return (
    <>
      <div className="grid w-full items-center gap-1.5">
        <Label>{t("WorldBook.keys")}</Label>
        <Textarea
          disabled
          value={entries?.keys}
          placeholder={t("WorldBook.keys_placeholder")}
        />
        <Label>{t("WorldBook.second_keys")}</Label>
        <Textarea
          disabled
          value={entries?.secondary_keys}
          placeholder={t("WorldBook.keys_placeholder")}
        />
      </div>
    </>
  );
}

function Content({ entries }: { entries: CharacterBookEntries }) {
  return <Textarea disabled className="h-[83vh]" value={entries.content} />;
}
