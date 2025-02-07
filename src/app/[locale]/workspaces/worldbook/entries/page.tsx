"use client";
export const runtime = 'edge';
import { useLiveQuery } from 'dexie-react-hooks';
import { useAtom } from 'jotai';
import { EllipsisVerticalIcon, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import {
  Table, TableBody,
  TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { CharacterBookTable, db } from '@/db/schema';
import { useRouter } from '@/i18n/routing';
import {
  addCharacterBookEntries, deleteCharacterBookEntries, updateCharacterBookEntriesEnable,
  usePageGuard
} from '@/lib/worldbook';
import { selectedCharacterBookEntriesAtom, selectedCharacterBookIdAtom } from '@/store/action';

function page() {
  usePageGuard();
  return (
    <>
      <Header />
      <EntrieLists />
    </>
  );
}

export default page;





function Header() {
  const [bookId] = useAtom(selectedCharacterBookIdAtom);
  const handleAddEntries = async () => {
    addCharacterBookEntries(bookId as number);
  };
  return (
    <div className="flex justify-between">
      <div>Entries</div>
      <div className="flex gap-x-2">
        <Button onClick={handleAddEntries} variant="outline" size="icon">
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}

function EntrieLists() {
  const router = useRouter()
  const t = useTranslations()
  const [bookId] = useAtom(selectedCharacterBookIdAtom);
  const [entriesId, setEntriesId] = useAtom(selectedCharacterBookEntriesAtom)
  type EntryType = CharacterBookTable["entries"][number];
  const [entrieLists, setEntrieLists] = useState<EntryType[]>();
  const [deleteCharacterBookEntrieIndex, setDeleteCharacterBookEntrieIndex] =
    useState<number>();
  const [
    isDeleteCharacterBookEntrieModal,
    setIsDeleteCharacterBookEntrieModal,
  ] = useState(false);

  const handleEditEntries = (eid: number) => {
    setEntriesId(eid)
    router.push("/workspaces/worldbook/entries/edit")
  }
  const book = useLiveQuery(() => {
    return db.characterBook.get(bookId).then((item) => {
      if (item) {
        return item.entries;
      }
    });
  });

  const handleDeleteCharacterBookEntrie = (index: number) => {
    setDeleteCharacterBookEntrieIndex(index);
    setIsDeleteCharacterBookEntrieModal(true);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Enable</TableHead>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {book ? (
            <>
              {book.map((list, index) => (
                <TableRow key={index}>
                  <TableCell ><EntriesEnableSwitch isEnabled={list.enabled} eid={list.id as number} /></TableCell>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-medium">{list.name}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="link" size="icon"><EllipsisVerticalIcon /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditEntries(index)}>{t("edit")}</DropdownMenuItem>
                        <DropdownMenuItem>{t("export")}</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCharacterBookEntrie(index)}
                          className="text-red-600 focus:text-red-600"
                        >
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </>
          ) : (
            <TableRow></TableRow>
          )}
        </TableBody>
      </Table>
      <DeleteCharacterBookEntrieModal
        isopen={isDeleteCharacterBookEntrieModal}
        index={deleteCharacterBookEntrieIndex as number}
        setIsOpen={setIsDeleteCharacterBookEntrieModal}
      />
    </>
  );
}

function DeleteCharacterBookEntrieModal({
  isopen,
  setIsOpen,
  index,
}: {
  isopen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
}) {
  const t = useTranslations()
  const [bookId] = useAtom(selectedCharacterBookIdAtom);
  const handleDeleteCharacter = async () => {
    deleteCharacterBookEntries(bookId as number, index);
    setIsOpen(false);
  };
  return (
    <AlertDialog open={isopen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("ays")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("nrb")}
          </AlertDialogDescription>
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

function EntriesEnableSwitch({isEnabled,eid}:{isEnabled:boolean,eid:number}){
  const [bid] = useAtom(selectedCharacterBookIdAtom);
  const handleChange = async () => {
    await updateCharacterBookEntriesEnable(eid,bid)
  }
  return(
    <Switch checked={isEnabled} onChange={handleChange}/>
  )
}