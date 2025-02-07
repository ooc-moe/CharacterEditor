"use client";
export const runtime = 'edge';
import { useLiveQuery } from 'dexie-react-hooks';
import { debounce } from 'es-toolkit';
import { atom, useAtom } from 'jotai';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Select, SelectContent, SelectGroup, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/db/schema';
import {
  addCharacterGreetings, deleteCharacterGreetings,
  updateCharacterGreeting,
  usePageGuard
} from '@/lib/character';
import { selectedCharacterIdAtom } from '@/store/action';

const greetingIndexAtom = atom<string | null>("null");
const deleteModalAtom = atom(false);
function page() {
  usePageGuard();
  return (
    <>
      <Header />
      <Alternate_Greetings />
      <DeleteModal />
    </>
  );
}

export default page;



function Header() {
  const [cid] = useAtom(selectedCharacterIdAtom);
  const [index, setIndex] = useAtom(greetingIndexAtom);
  const [isShow, setIsShow] = useAtom(deleteModalAtom);
  const lists = useLiveQuery(() => {
    const rows = db.character.get(cid).then((list) => {
      if (list) {
        return list.data.alternate_greetings;
      }
    });
    return rows;
  });
  const handleAddCharacterGreetings = async () => {
    addCharacterGreetings(cid as number);
  };
  const t = useTranslations()
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleAddCharacterGreetings}
        >
          <PlusIcon />
        </Button>
        {lists && lists.length > 0 ? (
          <Select onValueChange={(value) => setIndex(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t("select greetings")} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {lists?.map((list, index) => (
                  <SelectItem value={String(index)}>{index + 1}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <></>
        )}
      </div>
    {lists && lists.length > 0 && index ? (
      <Button onClick={() => setIsShow(true)} variant="outline" size="icon">
      <Trash2Icon />
    </Button>
    ):(
      <></>
    )}

    </div>
  );
}

function Alternate_Greetings() {
  const [cid] = useAtom(selectedCharacterIdAtom);
  const [index, setIndex] = useAtom(greetingIndexAtom);
  const [greeting, setGreeting] = useState("");

  const handleChangeText = debounce(async (value: string) => {
    await updateCharacterGreeting(
      cid as number,
      Number(index),
      value as string
    );
  }, 1000);
  const t = useTranslations()
  useEffect(() => {
    const fetchData = async () => {
      const rows = await db.character.get(cid).then((item) => {
        if (item) {
          return item.data.alternate_greetings[Number(index)];
        }
      });
      if (rows) {
        setGreeting(rows);
      }
    };
    fetchData();
  }, [index]);
  return (
    <>
      {index != "null" ? (
        <Textarea
          onChange={(e) => {
            const value = e.target.value;
            setGreeting(value);
            handleChangeText(value);
          }}
          value={greeting}
          className="h-full mt-4"
          placeholder={t("type messages")}
        />
      ) : (
        <></>
      )}
    </>
  );
}

function DeleteModal() {
  const t = useTranslations();
  const [cid] = useAtom(selectedCharacterIdAtom);
  const [index, setIndex] = useAtom(greetingIndexAtom);
  const [isShow, setIsShow] = useAtom(deleteModalAtom);
  const lists = useLiveQuery(() => {
    const rows = db.character.get(cid).then((list) => {
      if (list) {
        return list.data.alternate_greetings;
      }
    });
    return rows;
  });
  const handleDeleteCharacterGreetings = async () => {
    deleteCharacterGreetings(cid as number, Number(index));
    if (lists && lists.length > 1) {
      const newIndex = index === "0" ? "1" : "0";
      setIndex(newIndex);
    } else {
      setIndex("null");
    }
    setIsShow(false);
  };
  return (
    <AlertDialog open={isShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("ays")}</AlertDialogTitle>
          <AlertDialogDescription>{t("nrb")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsShow(false)}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDeleteCharacterGreetings}
          >
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
