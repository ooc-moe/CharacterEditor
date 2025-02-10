"use client";
export const runtime = 'edge';
import { atom, useAtom } from 'jotai';
import { EllipsisVerticalIcon, ImportIcon, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { db } from '@/db/schema';
import { useRouter } from '@/i18n/routing';
import {
  addCharacter,
  copyCharacter, deleteCharacter, getAllCharacterLists,
  importCharacter
} from '@/lib/character';
import { selectedCharacterIdAtom } from '@/store/action';

const addCharacterModalAtom = atom(false);
const characterCoverModalAtom = atom(false);

function page() {
  return (
    <>
      <Header />
      <div className="overflow-y-auto h-full mt-4">
        <CharacterLists />
      </div>
      <AddCharacterModal />
      <ChangeCoverModal />
    </>
  );
}

export default page;

function Header() {
  const t = useTranslations();
  const [, setIsAddCharacterModalShow] = useAtom(addCharacterModalAtom);
  return (
    <div className="flex justify-between items-center sticky">
      <div className="font-bold">{t("character")}</div>
      <div className="flex gap-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsAddCharacterModalShow(true)}
        >
          <PlusIcon />
        </Button>
        <Button variant="outline" size="icon" onClick={importCharacter}>
          <ImportIcon />
        </Button>
      </div>
    </div>
  );
}

function CharacterLists() {
  const router = useRouter();
  const t = useTranslations();
  const [actionCharacterid, setActionCharacterId] = useAtom(
    selectedCharacterIdAtom
  );
  const [deleteCid, setDeleteCid] = useState<Number>();
  const [isDeleteCharacterModal, setIsDeleteCharacterModal] = useState(false);
  const [, setIsChangeCoverModal] = useAtom(characterCoverModalAtom);
  const handleDeleteCharacter = (id: number) => {
    setDeleteCid(id);
    setIsDeleteCharacterModal(true);
  };
  const handleActionCharacter = (id: number, name: string) => {
    setActionCharacterId(id);
    toast.success(t("selected") + name, {
      id: "actionCharacter",
    });
  };
  const handleExportCharacter = (id: number) => {
    router.push(`/workspaces/exhibit/character/export/${id}`);
  };
  const handleChangeCover = (id: number) => {
    setIsChangeCoverModal(true);
    setActionCharacterId(id);
  };
  const lists = getAllCharacterLists();
  return (
    <>
      <ul className="md:grid hidden gap-x-4 gap-y-8 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-9 5xl:grid-cols-10 6xl:grid-cols-11 7xl:grid-cols-12">
        {lists?.map((list) => {
          if (list.id === actionCharacterid)
            return (
              <li key={list.id}>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div className="relative inline-block">
                      <span className="absolute right-2 top-2 flex size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex size-3 rounded-full bg-amber-500"></span>
                      </span>
                      <Image
                        className="rounded-xl h-full object-cover aspect-[3/4]"
                        src={list.cover}
                        alt={list.name}
                        width={521}
                        height={521}
                      />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => handleActionCharacter(list.id, list.name)}
                    >
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExportCharacter(list.id)}
                    >
                      {t("export")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    onClick={()=>copyCharacter(list.id)}
                  >
                    {t("copy")}
                  </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleChangeCover(list.id)}
                    >
                      {t("Character.change_cover")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 hove:text-red-400"
                      onClick={() => handleDeleteCharacter(list.id)}
                    >
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="truncate pointer-events-none text-xs font-medium">
                  {list.name}
                </div>
                <div className="truncate pointer-events-none text-xs">
                  {list.character_version}
                </div>
              </li>
            );
          return (
            <li key={list.id} className="group hover:opacity-90">
              <DropdownMenu >
                <DropdownMenuTrigger>
                  <Image
                    className="rounded-xl h-full object-cover aspect-[3/4]"
                    src={list.cover}
                    alt={list.name}
                    width={521}
                    height={521}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                    onClick={() => handleActionCharacter(list.id, list.name)}
                  >
                    {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExportCharacter(list.id)}
                  >
                    {t("export")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={()=>copyCharacter(list.id)}
                  >
                    {t("copy")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleChangeCover(list.id)}>
                    {t("Character.change_cover")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500 hove:text-red-400"
                    onClick={() => handleDeleteCharacter(list.id)}
                  >
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <div className="truncate pointer-events-none text-xs font-medium">
                {list.name}
              </div>
              <div className="truncate pointer-events-none text-xs">
                {list.character_version}
              </div>
            </li>
          );
        })}
      </ul>

      <ul className="md:hidden grid grid-cols-1 gap-y-2">
        {lists?.map((list) => {
          if (list.id === actionCharacterid)
            return (
              <li
                key={list.id}
                className="grid grid-cols-2 justify-between items-center"
              >
                <div className="grid grid-cols-2 gap-x-2">
                  <div className="relative inline-block">
                    <Image
                    className="w-full object-cover aspect-[1/1]"
                      src={list.cover}
                      alt={list.name}
                      width={521}
                      height={521}
                    />
                    <span className="absolute top-2 right-2 flex size-3">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex size-3 rounded-full bg-amber-500"></span>
                    </span>
                  </div>
                  <div className="grid grid-rows-2">
                    <div>{list.name}</div>
                    <div>{list.character_version}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger className="ml-auto">
                    <EllipsisVerticalIcon />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleActionCharacter(list.id, list.name)}
                    >
                      {t("edit")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExportCharacter(list.id)}
                    >
                      {t("export")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                    onClick={()=>copyCharacter(list.id)}
                  >
                    {t("copy")}
                  </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleChangeCover(list.id)}
                    >
                      {t("Character.change_cover")}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-500 hove:text-red-400"
                      onClick={() => handleDeleteCharacter(list.id)}
                    >
                      {t("delete")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            );
          return (
            <li
              key={list.id}
              className="grid grid-cols-2 justify-between items-center"
            >
              <div className="grid grid-cols-2 gap-x-2">
                <Image
                  className="w-full object-cover aspect-[1/1]"
                  src={list.cover}
                  alt={list.name}
                  width={521}
                  height={521}
                />

                <div className="grid grid-rows-2">
                  <div>{list.name}</div>
                  <div>{list.character_version}</div>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto">
                  <EllipsisVerticalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleActionCharacter(list.id, list.name)}
                  >
                    {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleExportCharacter(list.id)}
                  >
                    {t("export")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={()=>copyCharacter(list.id)}
                  >
                    {t("copy")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleChangeCover(list.id)}>
                    {t("Character.change_cover")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-500 hove:text-red-400"
                    onClick={() => handleDeleteCharacter(list.id)}
                  >
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          );
        })}
      </ul>

      <DeleteCharacterModal
        isopen={isDeleteCharacterModal}
        setIsOpen={setIsDeleteCharacterModal}
        cid={deleteCid as number}
      />
    </>
  );
}

function DeleteCharacterModal({
  isopen,
  setIsOpen,
  cid,
}: {
  isopen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cid: number;
}) {
  const t = useTranslations();
  const handleDeleteCharacter = async () => {
    deleteCharacter(cid);
    setIsOpen(false);
    toast.error("delete it ");
  };
  return (
    <AlertDialog open={isopen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("ays")}</AlertDialogTitle>
          <AlertDialogDescription>{t("nrb")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteCharacter}
            className={buttonVariants({ variant: "destructive" })}
          >
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function AddCharacterModal() {
  const t = useTranslations();
  const [isModalShow, setIsModalShow] = useAtom(addCharacterModalAtom);
  const [name, setName] = useState("");
  const [cover, setCover] = useState("");

  useEffect(() => {
    const loadImage = async () => {
      try {
        const response = await fetch("/Character.png");
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setCover(reader.result as string);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error loading image:", error);
      }
    };
    loadImage();
  }, []);

  const handleAddCharacter = () => {
    addCharacter(name, cover);
    setIsModalShow(false);
    toast.success("Add it" + name);
    setName("");
  };
  return (
    <AlertDialog open={isModalShow}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("give_name")}</AlertDialogTitle>
          <AlertDialogDescription>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsModalShow(false)}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAddCharacter}>
            {t("new")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ChangeCoverModal() {
  const t = useTranslations();
  const [isShow, setIsShow] = useAtom(characterCoverModalAtom);
  const [cid] = useAtom(selectedCharacterIdAtom);
  const [cover, setCover] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const item = await db.character.get(cid);
      const cover = item?.cover;

      if (cover) {
        setCover(cover);
      }
    };

    fetchData();
  }, [cid]);
  const handleChangeCover = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".png";
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64 = reader.result as string;
          setCover(base64);
        };
        reader.readAsDataURL(file);
      } catch (e) {
        console.error("Error reading file:", e);
      }
    };
    input.click();
  };
  const handleUpdateCover = () =>{
    db.character.update(cid,{
      "cover" :cover
    })
    setIsShow(false)
    toast.success("OK")
  }
  return (
    <>
      <AlertDialog open={isShow}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("Character.change_cover")}</AlertDialogTitle>
            <AlertDialogDescription>
              <Image
                onClick={handleChangeCover}
                src={cover}
                alt="changeCover"
                width={521}
                height={521}
                className="w-48 h-64"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsShow(false)}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateCover}>{t("ok")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
