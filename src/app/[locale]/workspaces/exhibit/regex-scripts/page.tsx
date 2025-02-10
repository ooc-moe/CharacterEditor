"use client";
export const runtime = 'edge';
import { atom, useAtom } from 'jotai';
import { EllipsisVerticalIcon, ImportIcon, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody,
  TableCell,
  TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { useRouter } from '@/i18n/routing';
import {
  addRegexScript, deleteRegexxScript, getAllRegexScriptLists, importRegex
} from '@/lib/regex';

const addRegexScriptModalAtom = atom(false);

function page() {
  return (
    <>
      <Header />
      <RegexList />
      <AddRegexScriptModal />
    </>
  );
}

export default page;

function Header() {
  const t = useTranslations()
  const [, setIsShowAddRegexScriptModal] = useAtom(addRegexScriptModalAtom);

  return (
    <div className="flex justify-between">
      <div>{t("regex_scripts")}🚧</div>
      <div className="flex gap-x-2">
        <Button
          onClick={() => setIsShowAddRegexScriptModal(true)}
          variant="outline"
          size="icon"
        >
          <PlusIcon />
        </Button>
        <Button onClick={importRegex} variant="outline" size="icon">
          <ImportIcon />
        </Button>
      </div>
    </div>
  );
}

function RegexList() {
  const t = useTranslations()
  const lists = getAllRegexScriptLists();
  const router = useRouter()
  const handleDeleteRegexScript = (id: number) => {
    deleteRegexxScript(id);
    toast.success(t("dis"));
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("name")}</TableHead>
          <TableHead className='text-right'>{t("action")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lists?.map((list, index) => (
          <TableRow key={list.id}>
            <TableCell>{list.scriptName}</TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger><Button variant="link" size="icon"><EllipsisVerticalIcon /></Button></DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => router.push(`/workspaces/regex/${list.id}`)}
                  >
                    {t("edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600 focus:text-red-500"
                    onClick={() => handleDeleteRegexScript(list.id)}
                  >
                    {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function AddRegexScriptModal() {
  const t = useTranslations()
  const [isShowModal, setIsShowModal] = useAtom(addRegexScriptModalAtom);
  const [scriptName, setScriptName] = useState("");
  const handleAddRegexScript = () => {
    addRegexScript(scriptName);
    setScriptName("");
    setIsShowModal(false)
    toast.success(t("ais"));
  };
  return (
    <AlertDialog open={isShowModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("give_name")}</AlertDialogTitle>
          <AlertDialogDescription>
            <Input
              value={scriptName}
              onChange={(e) => setScriptName(e.target.value)}
            />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsShowModal(false)}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleAddRegexScript}>
            {t("new")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
