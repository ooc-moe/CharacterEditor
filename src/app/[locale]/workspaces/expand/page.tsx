'use client'
import { Button } from '@/components/ui/button';
import { Link, useRouter } from '@/i18n/routing';
import { ArrowRightIcon, CogIcon, InfoIcon, RegexIcon, UserPenIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import React from 'react';

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
  return(
    <div className="font-bold">Advanced</div>
  )
}

const navlists = [
  { name: "settings", path: "settings", icon: CogIcon },
  { name: "regex_script", path: "exhibit/regex-scripts/",icon: RegexIcon },
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
                  <div className='font-bold'>{item.name}</div>
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