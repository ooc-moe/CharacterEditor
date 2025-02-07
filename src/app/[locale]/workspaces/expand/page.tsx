'use client'
export const runtime = 'edge';
import { ArrowRightIcon, CogIcon, InfoIcon, PawPrintIcon, RegexIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useRouter } from '@/i18n/routing';

function page() {
  return (
    <>
        <Header />
        <CharacterNav />
    </>

  )
}

export default page

function Header(){
  const t = useTranslations()
  return(
    <div className="font-bold">{t("advanced")}</div>
  )
}

const navlists = [
  { name: "settings", path: "settings", icon: CogIcon },
  { name: "regex_scripts", path: "exhibit/regex-scripts/",icon: RegexIcon },
  { name: "Nav.CatboxGallery", path: "tools/catbox",icon: PawPrintIcon },
  { name: "about", path: "about",  icon: InfoIcon },
]

function CharacterNav() {
  const t = useTranslations()
  const router = useRouter()
  return (
    <>
    <div className='flex flex-col gap-y-4 mt-4'>
    {navlists.map((item) => {
        const Icon = item.icon
        return (
          <div className='h-10 border-b' onClick={()=>router.push(`/workspaces/${item.path}`)} >
            <div className='flex justify-between items-center'>
              <div className='flex flex-row gap-x-2 items-center'>
                <Icon />
                <div className="flex flex-col">
                  <div className='font-bold'>{t(item.name)}</div>
                </div>
              </div>
              <ArrowRightIcon />
            </div>
          </div>
        )
      })}
    </div>
    </>
  )

}