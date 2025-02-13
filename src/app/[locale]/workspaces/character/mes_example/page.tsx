'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCharacterField, updateSpecV1Character, usePageGuard } from '@/lib/character';
import { selectedCharacterIdAtom } from '@/store/action';
import { debounce } from 'es-toolkit';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export const runtime = 'edge';

function page() {
  usePageGuard();
  return (
    <>
      <Mes_Example />
    </>
  );
}

export default page;

function Mes_Example() {
  const [cid] = useAtom(selectedCharacterIdAtom);
  const [inputValue, setInputValue] = useState<string>('');
  const t = useTranslations();
  const handleChangeText = debounce(async (value: string) => {
    await updateSpecV1Character(cid as number, 'data', value);
  }, 1000);

  useEffect(() => {
    const fetchDefaultValue = async () => {
      try {
        const rows = await getCharacterField(cid as number, 'mes_example');
        if (rows && typeof rows === 'string') {
          setInputValue(rows);
        }
      } catch (error) {
        console.error('Failed to fetch default value:', error);
      }
    };
    fetchDefaultValue();
  }, [cid]);

  return (
    <>
      {cid ? (
        <div className="flex h-full flex-col overflow-hidden p-0.5">
          <Label htmlFor="message">{t('Character.mes_example')}</Label>
          <Textarea
            className="mt-4 flex-1 resize-none overflow-auto"
            placeholder={t('type messages')}
            value={inputValue}
            onChange={(e) => {
              const value = e.target.value;
              setInputValue(value);
              handleChangeText(value);
            }}
          />
        </div>
      ) : (
        <div></div>
      )}
    </>
  );
}
