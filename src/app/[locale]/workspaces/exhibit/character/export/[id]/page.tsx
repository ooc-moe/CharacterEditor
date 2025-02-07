"use client";
export const runtime = 'edge';
import { db } from "@/db/schema";
import { useRouter } from "@/i18n/routing";
import {
  exportCharacter,
  getCharacter,
  getCharacterField,
} from "@/lib/character";
import { selectedCharacterIdAtom } from "@/store/action";
import { useLiveQuery } from "dexie-react-hooks";
import { useAtom } from "jotai";
import Image from "next/image";
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllCharacterBookLists } from "@/lib/worldbook";
import { DownloadIcon } from "lucide-react";
import { getAllRegexScriptLists } from "@/lib/regex";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { useParams } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

function page() {
  return (
    <>
      <Header />
      <Preview />
    </>
  );
}

export default page;

function Header() {
  const t = useTranslations();
  const [isShowModal, setIsShowModal] = useState(false);
  const handleExport = () => {
    setIsShowModal(true);
  };
  return (
    <>
      <div className="flex justify-between">
        <div>{t("preview")}</div>
        <div className="flex gap-x-2">
          <Button onClick={handleExport} variant="outline" size="icon">
            <DownloadIcon />
          </Button>
        </div>
      </div>
      <ExportModal isShow={isShowModal} setIsShow={setIsShowModal} />
    </>
  );
}

function Preview() {
  const t = useTranslations();
  const params = useParams();
  const cid = Number(params.id);
  const lists = useLiveQuery(() => {
    return db.character.get(cid);
  });
  return (
    <>
      {lists ? (
        <>
          <Accordion type="multiple">
            <AccordionItem value="details">
              <AccordionTrigger>{t("Character.details")}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-2 gap-4 items-center">
                  {lists?.cover ? (
                    <>
                      <div>
                        <Image
                          className="w-32"
                          src={lists.cover}
                          alt={lists.name}
                          width={500}
                          height={500}
                        />
                      </div>
                      <div>
                        <div>{lists.name}</div>
                        <div>{lists.data.creator}</div>
                        <div>{lists.data.character_version}</div>
                      </div>
                    </>
                  ) : (
                    <div></div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="description">
              <AccordionTrigger>{t("Character.description")}</AccordionTrigger>
              <AccordionContent>{lists.description}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="first_mes">
              <AccordionTrigger>{t("Character.first_mes")}</AccordionTrigger>
              <AccordionContent>{lists.first_mes}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="creator_notes">
              <AccordionTrigger>
                {t("Character.creator_notes")}
              </AccordionTrigger>
              <AccordionContent>{lists.data.creator_notes}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="mes_example">
              <AccordionTrigger>{t("Character.mes_example")}</AccordionTrigger>
              <AccordionContent>{lists.mes_example}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="personality">
              <AccordionTrigger>{t("Character.personality")}</AccordionTrigger>
              <AccordionContent>{lists.personality}</AccordionContent>
            </AccordionItem>
            <AccordionItem value="scenario">
              <AccordionTrigger>{t("Character.scenario")}</AccordionTrigger>
              <AccordionContent>{lists.scenario}</AccordionContent>
            </AccordionItem>
          </Accordion>
        </>
      ) : (
        <div></div>
      )}
    </>
  );
}

function ExportModal({
  isShow,
  setIsShow,
}: {
  isShow: boolean;
  setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const t = useTranslations();
  const params = useParams();
  const cid = Number(params.id);
  const worldbookLists = getAllCharacterBookLists();
  const regexLists = getAllRegexScriptLists();
  const [worldbookId, setWorldBookId] = useState<string>();
  const [regexId, setRegexId] = useState<string[]>([]);

  const handleExport = () => {
    exportCharacter(cid as number, worldbookId, regexId);
  };

  const handleCheckboxChange = (id: number, checked: boolean) => {
    setRegexId((prev) =>
      checked ? [...prev, String(id)] : prev.filter((item) => item !== String(id))
    );
  };

  return (
    <AlertDialog open={isShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle></AlertDialogTitle>
          <AlertDialogDescription>
            <Label>{t("worldbook")}</Label>
            <Select
              defaultValue="null"
              onValueChange={(value) => setWorldBookId(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="WorldBook" defaultValue="null" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="null">Null</SelectItem>
                {worldbookLists?.map((list) => (
                  <SelectItem key={list.id} value={String(list.id)}>
                    {list.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Label>{t("regex_scripts")}</Label>
            <div>
              {regexLists?.map((list) => (
                <div
                  className="grid grid-cols-1 gap-y-1 overflow-y-hidden"
                  key={list.id}
                >
                  <div>
                    <Checkbox
                      value={String(list.id)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(list.id, checked as boolean)
                      }
                    />
                    <Label>{list.scriptName}</Label>
                  </div>
                </div>
              ))}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsShow(false)}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleExport}>
            {t("export")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
