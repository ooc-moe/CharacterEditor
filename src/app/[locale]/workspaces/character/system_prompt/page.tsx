'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from '@/i18n/routing';
import { getCharacterField, updateCharacter, usePageGuard } from '@/lib/character';
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
      <System_Prompt />
    </>
  );
}

export default page;

function System_Prompt() {
  const router = useRouter();
  const [cid] = useAtom(selectedCharacterIdAtom);
  const [inputValue, setInputValue] = useState<string>('');
  const t = useTranslations();

  const handleChangeText = debounce(async (value: string) => {
    await updateCharacter(cid as number, 'data.system_prompt' as string, value);
  }, 1000);

  useEffect(() => {
    const fetchDefaultValue = async () => {
      try {
        const rows = await getCharacterField(cid as number, 'data.system_prompt');
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
          <Label htmlFor="message">{t('Character.system_prompt')}</Label>
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
