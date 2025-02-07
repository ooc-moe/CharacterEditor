"use client";
import { useLiveQuery } from 'dexie-react-hooks';
import { atom, useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { db, RegexScriptsTable } from '@/db/schema';
import {
  updateFind_Regex, updateIsEnable, updateReplaceString, updateScript_Name
} from '@/lib/regex';

const regexAtom = atom<RegexScriptsTable>();

export default function RegexEdit() {
  const [regex, setRegex] = useAtom(regexAtom);
  const t = useTranslations();
  const parmas = useParams();
  useLiveQuery(() => {
    db.regexScripts.get(Number(parmas.id)).then((item) => {
      if (!item) return;
      setRegex(item);
    });
  });

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
        <TabsTrigger value="content">{t("content")}</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Profile />
      </TabsContent>
      <TabsContent value="content">
        <RegexEditor />
      </TabsContent>
    </Tabs>
  );
}

function Profile() {
  const t = useTranslations();
  const [regex, setRegex] = useAtom(regexAtom);
  const handleChangeScriptName = async (value: string) => {
    if (!regex) return;
    updateScript_Name(regex.id, value);
  };
  const handleSwitch = async () => {
    if (!regex) return;
    updateIsEnable(regex.id);
  };
  return (
    <>
      {regex ? (
        <div className="grid grid-cols-1 gap-y-4">
          <div >
          <Label>{t("Regex.switch")}</Label>
          <Switch onClick={handleSwitch} checked={!regex.disabled}/>
          </div>
          <div>
            <Label>{t("Regex.script_name")}</Label>
            <Input
              value={regex.scriptName}
              onChange={(e) => handleChangeScriptName(e.target.value)}
            />
          </div>
          <div></div>
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}

function RegexEditor() {
  const t = useTranslations();
  const parmas = useParams();
  const [regex, setRegex] = useAtom(regexAtom);
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [findRegex, setFindRegex] = useState("");
  const [replaceWith, setReplaceWith] = useState("");
  const handleChangeFindRegex = async (value: string) => {
    if (!regex) return;
    updateFind_Regex(regex.id, value);
  };
  const handleChangeReplaceString = async (value: string) => {
    if (!regex) return;
    updateReplaceString(regex.id, value);
  };
  useEffect(() => {
    try {
      let replaced = before;

      if (findRegex.trim()) {
        let pattern = findRegex;
        let flags = "g";
        const regexMatch = findRegex.match(/^\/(.*)\/([gim]*)$/);
        if (regexMatch) {
          pattern = regexMatch[1];
          flags = regexMatch[2] || "";
        } else {
          flags = "g";
        }

        const regex = new RegExp(pattern, flags);
        replaced = before.replace(regex, replaceWith);
      }

      setAfter(replaced);
    } catch (error: any) {
      setAfter(`Error: ${error.message}`);
    }
  }, [before, findRegex, replaceWith]);

  return (
    <div>
      <div className="grid xs:grid-col-1 grid-col-2 gap-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2">
          <div>
            <Label>{t("Regex.playground")}</Label>
            <Textarea
              value={before}
              onChange={(e) => setBefore(e.target.value)}
            />
          </div>
          <div>
            <Label>
              {t("preview")} <Badge variant="outline">{t("beta")}</Badge>
            </Label>
            <Textarea value={after} disabled />
          </div>
        </div>
        <div>
          <Label>{t("Regex.find_regex")}</Label>
          <Textarea
            value={regex?.findRegex}
            onChange={(e) => handleChangeFindRegex(e.target.value)}
          />
        </div>
        <div>
          <Label>{t("Regex.replace_with")}</Label>
          <Textarea
            value={regex?.replaceString}
            onChange={(e) => handleChangeReplaceString(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
