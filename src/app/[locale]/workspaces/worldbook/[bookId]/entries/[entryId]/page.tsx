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
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { db } from '@/db/schema';
import { updateBookEntryItem } from '@/lib/worldbook';
import { useLiveQuery } from 'dexie-react-hooks';
import { pullAt } from 'es-toolkit';
import { atom, useAtom } from 'jotai';
import { PlusIcon, XIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export const runtime = 'edge';

interface CharacterBookEntries {
  keys: Array<string>;
  content: string;
  extensions: Record<string, any>;
  enabled: boolean;
  insertion_order: number;
  case_sensitive?: boolean;
  name?: string;
  priority?: number;
  id?: number;
  comment?: string;
  selective?: boolean;
  secondary_keys?: Array<string>;
  constant?: boolean;
  position?: string;
  vectorized?: boolean;
}

const entriesAtom = atom<CharacterBookEntries>();

function page() {
  return <Header />;
}

export default page;

function Header() {
  const [, setEntries] = useAtom(entriesAtom);
  const t = useTranslations();
  const params = useParams();
  const entries = useLiveQuery(() =>
    db.characterBook.get(Number(params.bookId)).then((item) => {
      if (item) {
        return item.entries[Number(params.entryId)];
      }
    }),
  );
  useEffect(() => {
    setEntries(entries);
  }, [entries]);

  return (
    <Tabs defaultValue="profile">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
        <TabsTrigger value="content">{t('content')}</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">
        <Profile />
      </TabsContent>
      <TabsContent value="content">
        <Content />
      </TabsContent>
    </Tabs>
  );
}

function Profile() {
  const t = useTranslations();
  return (
    <>
      <div className="grid w-full items-center gap-x-2 gap-y-3">
        <div className="flex flex-cols gap-x-2">
          <Comment />
          <Position />
          <Depth />
          <Stratgy />
        </div>
        <EntryKeys field="keys" />
        <EntryKeys field="secondary_keys" />
      </div>
    </>
  );
}

// content
function Content() {
  const params = useParams();
  const [entries] = useAtom(entriesAtom);
  const [inputValue, setInputValue] = useState(entries?.content || '');

  const handleUpdate = (value: string) => {
    updateBookEntryItem(Number(params.bookId), Number(params.entryId), 'content', value);
  };

  useEffect(() => {
    if (entries?.content !== undefined) {
      setInputValue(entries.content);
    }
  }, [entries?.content]);

  return (
    <Textarea
      value={inputValue}
      onChange={(e) => {
        setInputValue(e.target.value);
        handleUpdate(e.target.value);
      }}
      className="h-[83vh]"
    />
  );
}

// keys | secondary_keys
function EntryKeys({ field }: { field: 'keys' | 'secondary_keys' }) {
  const params = useParams();
  const [entries] = useAtom(entriesAtom);
  const t = useTranslations();
  const [list, setList] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>();
  const [name, setName] = useState<string>();
  const handleDeleteModal = (index: number) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };
  useEffect(() => {
    if (entries && entries[field]) {
      setList(entries[field]);
    } else {
      setList([]);
    }
  }, [entries, field]);
  const handleDelete = () => {
    if (deleteIndex == null) return;
    const entryKey = list;
    pullAt(entryKey, [deleteIndex]);
    updateBookEntryItem(Number(params.bookId), Number(params.entryId), field, entryKey);
    toast.success(t('dis'));
    setIsDeleteModalOpen(false);
  };
  const handleAdd = () => {
    if (!name) return;
    const entryKey = list;
    entryKey.push(name);
    updateBookEntryItem(Number(params.bookId), Number(params.entryId), field, entryKey);
    setIsAddModalOpen(false);
    toast.success(t('ais') + name);
    setName('');
  };
  return (
    <>
      {field == 'keys' ? (
        <Label>{t('WorldBook.keys')} </Label>
      ) : (
        <Label>{t('WorldBook.secondary_keys')}</Label>
      )}
      <div className="flex-rows flex gap-2">
        {list.map((content, index) => (
          <div key={index}>
            <Badge variant="outline">
              {content}
              <Button onClick={() => handleDeleteModal(index)} variant="link" size="icon">
                <XIcon />
              </Button>
            </Badge>
          </div>
        ))}
      </div>

      <Button onClick={() => setIsAddModalOpen(true)} variant="link" size="icon">
        <PlusIcon />
      </Button>

      <AlertDialog open={isDeleteModalOpen} onOpenChange={() => setIsDeleteModalOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('ays')}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className={buttonVariants({ variant: 'destructive' })}
              onClick={handleDelete}
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isAddModalOpen} onOpenChange={() => setIsAddModalOpen(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('give_name')}</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleAdd}>{t('new')}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function Comment() {
  const t = useTranslations();
  const params = useParams();
  const [entries] = useAtom(entriesAtom);
  const [inputValue, setInputValue] = useState('');
  const handleUpdate = (value: string) => {
    updateBookEntryItem(Number(params.bookId), Number(params.entryId), 'comment', value);
  };

  useEffect(() => {
    if (entries?.comment !== undefined) {
      setInputValue(entries.comment);
    }
  }, [entries?.comment]);

  return (
    <div>
      <Label>{t('WorldBook.comment')}</Label>
      <Input
        value={entries?.comment}
        onChange={(e) => {
          setInputValue(e.target.value);
          handleUpdate(e.target.value);
        }}
      />
    </div>
  );
}

function Stratgy() {
  const t = useTranslations();
  const params = useParams();
  const [entries] = useAtom(entriesAtom);
  const handleUpdate = (value: string) => {
    if (value == 'vectorized') {
      updateBookEntryItem(Number(params.bookId), Number(params.entryId), 'constant', false);
      updateBookEntryItem(Number(params.bookId), Number(params.entryId), 'vectorized', true);
    }
    if (value == 'constant') {
      updateBookEntryItem(Number(params.bookId), Number(params.entryId), 'constant', true);
      updateBookEntryItem(Number(params.bookId), Number(params.entryId), 'vectorized', false);
    } else {
      updateBookEntryItem(Number(params.bookId), Number(params.entryId), 'constant', false);
      updateBookEntryItem(Number(params.bookId), Number(params.entryId), 'vectorized', false);
    }
  };
  return (
    <div>
      <Label>{t('Worldbook.stratgy')}</Label>
      <Select
        defaultValue={
          entries?.vectorized === false
            ? entries.constant === true
              ? 'constant'
              : 'normal'
            : 'vectorized'
        }
        onValueChange={(value) => handleUpdate(value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Stratgy" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem className="text-green-400" value="constant">
            constant
          </SelectItem>
          <SelectItem className="text-blue-400" value="normal">
            normal
          </SelectItem>
          <SelectItem value="vectorized">vectorized</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function Position() {
  const t = useTranslations();
  const params = useParams();
  const [entries] = useAtom(entriesAtom);
  const handleUpdate = (value: string) => {
    updateBookEntryItem(
      Number(params.bookId),
      Number(params.entryId),
      'extensions.position',
      Number(value),
    );
  };
  return (
    <div>
      <Label>{t('position')}</Label>
      <Select
        onValueChange={(value) => handleUpdate(value)}
        defaultValue={String(entries?.extensions.position)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Position" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">↑Char</SelectItem>
          <SelectItem value="1">↓Char</SelectItem>
          <SelectItem value="2">↑AN</SelectItem>
          <SelectItem value="3">↓AN</SelectItem>
          <SelectItem value="5">↑EM</SelectItem>
          <SelectItem value="6">↓EM</SelectItem>
          <SelectItem value="4">@D</SelectItem>
          <SelectItem value="7">@D User</SelectItem>
          <SelectItem value="8">@D AI</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

function Depth() {
  const t = useTranslations();
  const params = useParams();
  const [entries] = useAtom(entriesAtom);
  const handleUpdate = (value: number) => {
    updateBookEntryItem(Number(params.bookId), Number(params.entryId), 'extensions.depth', value);
  };
  return (
    <>
      {entries?.extensions.position == 4 ||
      entries?.extensions.position == 7 ||
      entries?.extensions.position == 8 ? (
        <div className="w-[80px]">
          <Label>{t('Worldbook.depth')}</Label>
          <Input
            defaultValue={entries?.extensions.depth}
            onChange={(e) => handleUpdate(Number(e.target.value))}
            inputMode="numeric"
            type="number"
            min={0}
            max={999}
          />
        </div>
      ) : (
        <div className="w-[80px]">
          <Label>{t('Worldbook.depth')}</Label>
          <Input value={entries?.extensions.depth} disabled />
        </div>
      )}
    </>
  );
}
