"use client";
export const runtime = 'edge';
import { atom, useAtom } from 'jotai';
import {
  CircleHelpIcon, ClipboardMinusIcon,
  ImportIcon, Loader2, PlusIcon
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { v7 as uuidv7 } from 'uuid';

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/db/schema';
import { addGalleryItem, deleteGalleryItem, getGallyList } from '@/lib/gallery';

const newGalleryModalAtom = atom(false);
const exportGalleryModalAtom = atom(false);
const importGalleryModalAtom = atom(false);
const deleteGalleryItemModalAtom = atom(false);
const deleteGalleryItemUUID = atom<string | null>();

export default function page() {
  return (
    <>
      <Header />
      <GalleryList />
      <NewGalleryModal />
      <ExportModal />
      <ImportModal />
      <DeleteModal />
    </>
  );
}

function Header() {
  const t = useTranslations();
  const [newModal, setNewModal] = useAtom(newGalleryModalAtom);
  const [exportModal, setExportModal] = useAtom(exportGalleryModalAtom);
  const [importModal, setImportModal] = useAtom(importGalleryModalAtom);
  return (
    <div className="flex justify-between">
      <div className="font-bold">{t("gallery_list")}</div>
      <div className="flex gap-x-2">
        <Button
          onClick={() => setImportModal(true)}
          variant="outline"
          size="icon"
        >
          <ImportIcon />
        </Button>
        <Button
          onClick={() => setExportModal(true)}
          variant="outline"
          size="icon"
        >
          <ClipboardMinusIcon />
        </Button>
        <Button onClick={() => setNewModal(true)} variant="outline" size="icon">
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}

function ImportModal() {
  interface GalleryLists {
    name: string;
    url: string;
  }
  const t = useTranslations()
  const params = useParams();
  const [isShow, setIsShow] = useState(false);
  const [isOpen, setIsOpen] = useAtom(importGalleryModalAtom);
  const [input, setInput] = useState("");
  const [galleryLists, setGalleryLists] = useState<GalleryLists[]>([]);
  useEffect(() => {
    if (input) {
      const parsedData = input
        .split("\n")
        .map((line) => {
          const regex = /^(.+?)_([a-zA-Z0-9]+)\.([a-zA-Z0-9]+)$/;
          const match = line.trim().match(regex);

          if (match) {
            const name = match[1];
            const fileCode = match[2];
            const fileUrl = `https://files.catbox.moe/${fileCode}.${match[3]}`;
            return { name, url: fileUrl };
          }
          return null;
        })
        .filter((item) => item !== null);
      setGalleryLists(parsedData);
    }
  }, [input]);

  const handleImport = async () => {
    const entry = galleryLists.map((item) => {
      return {
        uuid: uuidv7(),
        name: item.name,
        url: item.url,
      };
    });
    db.gallery.update(Number(params.id), {
      content: entry,
    });
    toast.success("Ok");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("importGallery")}
            <Popover>
              <PopoverTrigger>
                <CircleHelpIcon />
              </PopoverTrigger>
              <PopoverContent>
                <p>Happy_xxxxxx.png</p>
                <p>Sad_xxxxxx.png</p>
                <p>Happy2_xxxxxx.png</p>
                <p>Happy3_xxxxxx.webp</p>
                <p>Happy4_xxxxxx</p>
                <p>Happy4xxxxxx</p>
              </PopoverContent>
            </Popover>
          </DialogTitle>
          <DialogDescription>
            <div className="grid md:grid:cols-2 grid-cols-1 gap-y-4">
              <Textarea
                className="whitespace-pre-line"
                value={input}
                placeholder="Must be Check Format"
                rows={5}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button onClick={handleImport}>{t("import")}</Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function ExportModal() {
  const params = useParams();
  const [isOpen, setIsOpen] = useAtom(exportGalleryModalAtom);
  const [url, setUrl] = useState("");
  const [book, setBook] = useState("");
  const item = getGallyList(Number(params.id));
  useEffect(() => {
    if (!item) return;
    const lists = item.content;
    const urlData = lists.map((list) => list.url).join("\n");
    setUrl(urlData);
    const book = lists
      .map((list) => {
        const fileName = list.url.split("/").pop();
        if (!fileName) return "";
        return `${list.name}_${fileName}`;
      })
      .join("\n");
    setBook(book);
  }, [item]);
  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogDescription>
            <Tabs defaultValue="url">
              <TabsList>
                <TabsTrigger value="url">Url</TabsTrigger>
                <TabsTrigger value="worldbook">WorldBook</TabsTrigger>
              </TabsList>
              <TabsContent value="url">
                <Textarea value={url} disabled />
              </TabsContent>
              <TabsContent value="worldbook">
                <Textarea value={book} disabled />
              </TabsContent>
            </Tabs>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function DeleteModal() {
  const t = useTranslations();
  const params = useParams();
  const [isOpen, setIsOpen] = useAtom(deleteGalleryItemModalAtom);
  const [uuid, setUUID] = useAtom(deleteGalleryItemUUID);
  const handleDelete = async () => {
    if(!uuid) {
      toast.error("uuid not found")
      return 
    }
    await deleteGalleryItem(Number(params.id),uuid)
    setUUID(null)
    setIsOpen(false)
    toast.success("Delete it!")
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={()=>setIsOpen(false)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("ays")}</AlertDialogTitle>
          <AlertDialogDescription>{t("nrb")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}  className={buttonVariants({ variant: "destructive" })}>{t("delete")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function GalleryList() {
  const t = useTranslations()
  const params = useParams();
  const gallery = getGallyList(Number(params.id));
  const lists = gallery?.content;
  const [deleteModal, setDeleteModal] = useAtom(deleteGalleryItemModalAtom);
  const [deleteUUID,setDeleteUUID]  = useAtom(deleteGalleryItemUUID)
  const handleDeleteItem = (uuid: string) => {
    setDeleteUUID(uuid)
    setDeleteModal(true);
  };
  return (
    <>
      {lists ? (
        <ul className="grid gap-x-4 gap-y-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 3xl:grid-cols-8 4xl:grid-cols-9 5xl:grid-cols-10 6xl:grid-cols-11 7xl:grid-cols-12 overflow-y-scroll">
          {lists.map((list) => (
            <li key={list.uuid}>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Image
                    src={list.url}
                    alt={list.name}
                    width={1000}
                    height={1000}
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem
                  onClick={()=>handleDeleteItem(list.uuid)}
                  className="text-red-600 focus:text-red-600">
                  {t("delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <p>{list.name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
}

function NewGalleryModal() {
  const params = useParams();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useAtom(newGalleryModalAtom);
  const [input, setInput] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangeImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".png,.webp,.jpg,.jpeg,avif,gif";
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (!file) return;
      setImage(file);
    };
    input.click();
  };

  const handleUpload = async () => {
    if (!image) {
      toast.error("Please select an image.");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", input);
    formData.append("file", image);

    try {
      const result = await fetch("/api/catbox", {
        method: "POST",
        body: formData,
      });

      if (!result.ok) {
        toast.error("Failed to upload file, please try again.");
        setIsLoading(false);
        return;
      }

      const resultData = await result.json();

      if (resultData.status === "error") {
        toast.error(resultData.message || "An error occurred.");
        setIsLoading(false);
        return;
      }
      setInput("");
      setImage(null);

      await addGalleryItem(Number(params.id), resultData.name, resultData.url);
      setIsOpen(false);
      setIsLoading(false);
      toast.success("Added: " + resultData.name);
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred.");
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("input keyword and image")}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="grid grid-cols-3 gap-x-4 items-center">
              <div className="col-span-2">
                <Input
                  placeholder={t("keyword")}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <Button onClick={handleChangeImage} variant="link">
                {t("select image")}
              </Button>
            </div>

            {image ? (
              <Image
                className="pt-4"
                src={URL.createObjectURL(image)}
                width={1000}
                height={1000}
                alt="preview"
              />
            ) : (
              <div></div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setIsOpen(false)}>
            {t("cancel")}
          </AlertDialogCancel>
          {isLoading ? (
            <AlertDialogAction disabled>
              <Loader2 className="animate-spin" />
              Loading ...
            </AlertDialogAction>
          ) : (
            <>
              {input.length > 0 && image ? (
                <AlertDialogAction onClick={handleUpload}>
                  {t("upload")}
                </AlertDialogAction>
              ) : (
                <AlertDialogAction disabled>{t("new")}</AlertDialogAction>
              )}
            </>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
