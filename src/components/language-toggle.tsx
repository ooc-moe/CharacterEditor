"use client"

import { LanguagesIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useRouter } from '@/i18n/routing';

export function LanguageToggle() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger  asChild>
        <Button variant="outline" size="icon">
          <LanguagesIcon />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={()=>router.replace("/workspaces/settings", { locale: "zh-CN" })}>
          简体中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={()=>router.replace("/workspaces/settings", { locale: "zh-TW" })}>
          繁体中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={()=>router.replace("/workspaces/settings", { locale: "en" })}>
          English
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
