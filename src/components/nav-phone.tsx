'use client'

import { BookUserIcon, IdCardIcon, LibraryBigIcon, PencilRulerIcon, RegexIcon } from 'lucide-react';

import { ExpandableTabs } from '@/components/ui/expandable-tabs';

export default function NavPhone() {
  const tabs = [
    { title: "exhibit/character", icon: BookUserIcon },
    { title: "character", icon: IdCardIcon },
    { title: "exhibit/worldbook", icon: LibraryBigIcon},
    { title: "expand", icon: PencilRulerIcon },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <ExpandableTabs tabs={tabs} />
    </div>
  );
}