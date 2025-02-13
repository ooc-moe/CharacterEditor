import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export const runtime = 'edge';
function page() {
  const t = useTranslations();
  return (
    <div>
      <div>
        <span className="font-bold">CharacterEditor</span> by{' '}
        <span className="font-bold">OoC.moe</span>
      </div>
      <div>
        {t('visit')}{' '}
        <Link href="https://ooc.moe" target="_blank">
          https://ooc.moe
        </Link>
      </div>
      <div>
        Github:{' '}
        <Link href="https://github,com/ooc-moe/character-editor" target="_blank">
          https://github.com/ooc-moe/character-editor
        </Link>
      </div>
      <div>{t('contact')}: contact@ooc.moe</div>
      <div>
        {t('faq')}:
        <Link href="https://github.com/ooc-moe/CharacterEditor/discussions" target="_blank">
          https://github.com/ooc-moe/CharacterEditor/discussions
        </Link>
      </div>
    </div>
  );
}

export default page;
