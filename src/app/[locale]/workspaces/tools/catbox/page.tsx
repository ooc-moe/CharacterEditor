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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from '@/i18n/routing';
import { deleteGallery, getGally, newGallery } from '@/lib/gallery';
import { atom, useAtom } from 'jotai';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

export const runtime = 'edge';

const newGalleryModalAtom = atom(false);
const deleteGalleryModalAtom = atom(false);
const deleteGalleryIdAtom = atom<number | null>();

export default function page() {
  return (
    <>
      <Header />
      <Gallery />
      <NewGalleryModal />
      <DeleteGalleryModal />
    </>
  );
}

function Header() {
  const t = useTranslations();
  const [, setNewModal] = useAtom(newGalleryModalAtom);
  const handleNewGallery = () => {
    setNewModal(true);
  };
  return (
    <div className="flex justify-between">
      <div>{t('Nav.CatboxGallery')}</div>
      <div className="flex gap-x-2">
        <Button onClick={handleNewGallery} variant="outline" size="icon">
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}

function Gallery() {
  const t = useTranslations();
  const router = useRouter();
  const lists = getGally();
  const [, setDeleteModal] = useAtom(deleteGalleryModalAtom);
  const [deleteId, setDeleteId] = useAtom(deleteGalleryIdAtom);
  const handleDeleteGallery = (id: number) => {
    setDeleteId(id);
    setDeleteModal(true);
  };
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('name')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists &&
            lists.map((list, index) => (
              <TableRow key={list.id}>
                <TableCell>{list.name}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger>{t('action')}</DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => router.push(`/workspaces/tools/catbox/${list.id}`)}
                      >
                        {t('edit')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteGallery(list.id)}
                        className="text-red-600 focus:text-red-500"
                      >
                        {t('delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
}

function NewGalleryModal() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useAtom(newGalleryModalAtom);
  const [input, setInput] = useState('');
  const handleNewGallery = async () => {
    const rows = await newGallery(input);
    if (rows == '!ERROR') {
      toast.error('Unknow Error');
      setIsOpen(false);
      setInput('');
      return;
    }
    setIsOpen(false);
    toast.success('Add New Gallery' + input);
    setInput('');
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('give_name')}</AlertDialogTitle>
          <AlertDialogDescription>
            <Input value={input} onChange={(e) => setInput(e.target.value)} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>{t('cancel')}</AlertDialogCancel>
          {input.length > 0 ? (
            <AlertDialogAction onClick={handleNewGallery}>{t('new')}</AlertDialogAction>
          ) : (
            <AlertDialogAction disabled>{t('new')}</AlertDialogAction>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteGalleryModal() {
  const t = useTranslations();
  const [isOpen, setIsOpen] = useAtom(deleteGalleryModalAtom);
  const [deleteId, setDeleteId] = useAtom(deleteGalleryIdAtom);
  const handleCancel = () => {
    setDeleteId(null);
    setIsOpen(false);
  };
  const handleDelete = async () => {
    const result = await deleteGallery(deleteId as number);
    if (result == '!ERROR') {
      setIsOpen(false);
      setDeleteId(null);
      toast.error('Unknow Error');
      return;
    }
    setDeleteId(null);
    setIsOpen(false);
    toast.success('Delete it');
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('ays')}</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogDescription>{t('nrb')}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{t('cancel')}</AlertDialogCancel>
          <AlertDialogCancel
            className={buttonVariants({ variant: 'destructive' })}
            onClick={handleDelete}
          >
            {t('delete')}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
