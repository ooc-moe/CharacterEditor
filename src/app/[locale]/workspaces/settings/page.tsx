import { useTranslations } from 'next-intl';
import React from 'react';

import { LanguageToggle } from '@/components/language-toggle';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

export const runtime = 'edge';
function page() {
  return (
    <>
      <Settings />
    </>
  );
}

export default page;

function Settings() {
  return (
    <>
      <div className="flex flex-col gap-y-4">
        <LanguageSelect />
        <ThemeSwitch />
        <hr />
        {/* <ExportData />
        <ImportData />
        <CleanData />
        <hr />
        <ExportOldData />
        <ImportOldData /> */}
      </div>
    </>
  );
}

function ThemeSwitch() {
  const t = useTranslations()
  return (
    <div className="flex justify-between w-full">
      <div>{t("theme")}</div>
      <div>
        <ModeToggle />
      </div>
    </div>
  );
}

function LanguageSelect() {
  const t = useTranslations()
  return (
    <div className="flex justify-between w-full">
      <div>{t("language")}</div>
      <LanguageToggle />
    </div>
  );
}

// function ExportData() {
//   const t = useTranslations()
//   return (
//     <div className="flex justify-between w-full">
//       <div>ExportData</div>
//       <Button>Button</Button>
//     </div>
//   );
// }

// function ImportData() {
//   return (
//     <div className="flex justify-between w-full">
//       <div>ImportData</div>
//       <Button variant="secondary">Button</Button>
//     </div>
//   );
// }

// function CleanData() {
//   return (
//     <div className="flex justify-between w-full">
//       <div>CleanData</div>
//       <Button variant="destructive">Button</Button>
//     </div>
//   );
// }

// function ExportOldData() {
//   return (
//     <div className="flex justify-between w-full">
//       <div>ExportOldData</div>
//       <Button variant="ghost">Button</Button>
//     </div>
//   );
// }

// function ImportOldData() {
//   return (
//     <div className="flex justify-between w-full">
//       <div>ImportOldData</div>
//       <Button variant="ghost">Button</Button>
//     </div>
//   );
// }
