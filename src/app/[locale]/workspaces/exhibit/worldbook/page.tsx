"use client";
import { atom, useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  addCharacterBook,
  copyWorldBook,
  deleteCharacterBook,
  exportWorldBook,
  getAllCharacterBookLists,
  importCharacterBook,
} from "@/lib/worldbook";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { selectedCharacterBookIdAtom } from "@/store/action";
import { EllipsisVerticalIcon, ImportIcon, PlusIcon } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

const newWorldBookModalAtom = atom(false)

function page() {
  return (
    <>
      <Header />
      <WorldbookLists />
      <NewCharacterBookModal />
    </>
  );
}

export default page;

function Header() {
  const t = useTranslations()
  const [,setNewModal] = useAtom(newWorldBookModalAtom)

  return (
    <div className="flex justify-between">
      <div className="font-bold">{t("worldbook")}</div>
      <div className="flex gap-x-2">
        <Button onClick={()=>setNewModal(true)} variant="outline" size="icon">
          <PlusIcon />
        </Button>
        <Button variant="outline" size="icon" onClick={importCharacterBook}>
          <ImportIcon />
        </Button>
      </div>
    </div>
  );
}

function WorldbookLists() {
  const t = useTranslations()
  const lists = getAllCharacterBookLists();
  const router = useRouter()
  const [actionCharacterBookid, setActionCharacterBookId] = useAtom(
    selectedCharacterBookIdAtom
  );
  const [deleteCharacterBookId, setDeleteCharacterBookId] = useState<Number>();
  const [isDeleteCharacterBookModal, setIsDeleteCharacterBookModal] =
    useState(false);
  const handleDeleteCharacterBook = (id: number) => {
    setDeleteCharacterBookId(id);
    setIsDeleteCharacterBookModal(true);
  };
  const handleActionCharacterBook = (id: number) => {
    setActionCharacterBookId(id);
    router.push("/workspaces/worldbook/entries")
  };
  const handleExportWorldBook = (id:number) =>{
    exportWorldBook(id)
    toast.success("OK")
  }
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("name")}</TableHead>
            <TableHead className="text-right">{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lists?.map((list) => (
            <TableRow key={list.id}>
              <TableCell className="font-medium">{list.name}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="link"><EllipsisVerticalIcon /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleActionCharacterBook(list.id)}
                    >
                      {t("edit")}
                    </DropdownMenuItem>
                      <DropdownMenuItem
                      onClick={()=>copyWorldBook(list.id)}
                    >
                      {t("copy")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>handleExportWorldBook(list.id)}>{t("export")}</DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteCharacterBook(list.id)}
                      className="text-red-600 focus:text-red-600"
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
      <DeleteCharacterBookModal
        isopen={isDeleteCharacterBookModal}
        id={deleteCharacterBookId as number}
        setIsOpen={setIsDeleteCharacterBookModal}
      />
    </>
  );
}

function NewCharacterBookModal(){
  const t = useTranslations()
  const [isOpen,setIsOpen] = useAtom(newWorldBookModalAtom)
  const [inputValue , setInputValue] = useState("")
  const handleNewCharacterBook = async () =>{
    await addCharacterBook(inputValue)
    setIsOpen(false)
    toast.success("Add it!" + inputValue)
  }
  return(
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{t("give_name")}</DialogTitle>
      </DialogHeader>
      <Input value={inputValue} onChange={(e)=>setInputValue(e.target.value)}/>
      <DialogFooter className="justify-end">
          <DialogClose asChild>
            <Button onClick={()=>setIsOpen(false)} type="button" variant="secondary">
              {t("cancel")}
            </Button>
          </DialogClose>
          <Button onClick={handleNewCharacterBook}>
            {t("new")}
          </Button>
        </DialogFooter>
    </DialogContent>
  </Dialog>
  )
}

function DeleteCharacterBookModal({
  isopen,
  setIsOpen,
  id,
}: {
  isopen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}) {
  const t = useTranslations()
  const handleDeleteCharacter = async () => {
    deleteCharacterBook(id);
    setIsOpen(false);
    toast.success(t("success"))
  };
  return (
    <AlertDialog open={isopen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("ays")}</AlertDialogTitle>
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
