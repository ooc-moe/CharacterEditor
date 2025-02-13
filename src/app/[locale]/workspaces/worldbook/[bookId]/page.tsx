'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CharacterBookTable, db } from '@/db/schema';
import { useRouter } from '@/i18n/routing';
import {
  addCharacterBookEntries,
  deleteCharacterBookEntries,
  updateCharacterBookEntriesEnable,
} from '@/lib/worldbook';
import { useLiveQuery } from 'dexie-react-hooks';
import { EllipsisVerticalIcon, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

export const runtime = 'edge';

function page() {
  return (
    <>
      <Header />
      <EntrieLists />
    </>
  );
}

export default page;

function Header() {
  const t = useTranslations();
  const params = useParams();
  const handleAddEntries = async () => {
    addCharacterBookEntries(Number(params.bookId));
  };
  return (
    <div className="flex justify-between">
      <div>{t('Nav.entries')}</div>
      <div className="flex gap-x-2">
        <Button onClick={handleAddEntries} variant="outline" size="icon">
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}

function EntrieLists() {
  const router = useRouter();
  const t = useTranslations();
  const params = useParams();
  type EntryType = CharacterBookTable['entries'][number];
  const [entrieLists, setEntrieLists] = useState<EntryType[]>();
  const [deleteCharacterBookEntrieIndex, setDeleteCharacterBookEntrieIndex] = useState<number>();
  const [isDeleteCharacterBookEntrieModal, setIsDeleteCharacterBookEntrieModal] = useState(false);

  const handleEditEntries = (entryId: number) => {
    router.push(`/workspaces/worldbook/${params.bookId}/entries/${entryId}`);
  };
  const book = useLiveQuery(() => {
    return db.characterBook.get(Number(params.bookId)).then((item) => {
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
            <TableHead className="w-12">{t('switch')}</TableHead>
            <TableHead>{t('name')}</TableHead>
            <TableHead className="text-right">{t('action')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {book ? (
            <>
              {book.map((list, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <EntriesEnableSwitch isEnabled={list.enabled} entryIndex={index} />
                  </TableCell>
                  <TableCell>{list.comment}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="link" size="icon">
                          <EllipsisVerticalIcon />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditEntries(index)}>
                          {t('edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem>{t('export')}</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCharacterBookEntrie(index)}
                          className="text-red-600 focus:text-red-600"
                        >
                          {t('delete')}
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
  const t = useTranslations();
  const params = useParams();
  const bookId = Number(params.id);
  const handleDeleteCharacter = async () => {
    deleteCharacterBookEntries(bookId as number, index);
    setIsOpen(false);
  };
  return (
    <AlertDialog open={isopen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('ays')}</AlertDialogTitle>
          <AlertDialogDescription>{t('nrb')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteCharacter}
            className={buttonVariants({ variant: 'destructive' })}
          >
            {t('delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function EntriesEnableSwitch({
  isEnabled,
  entryIndex,
}: {
  isEnabled: boolean;
  entryIndex: number;
}) {
  const params = useParams();
  const bookId = Number(params.bookId);
  const handleChange = async () => {
    await updateCharacterBookEntriesEnable(entryIndex, bookId);
  };
  return <Switch checked={isEnabled} onClick={handleChange} />;
}
