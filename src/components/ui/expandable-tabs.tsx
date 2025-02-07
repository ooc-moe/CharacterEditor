"use client";

import { motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { LucideIcon } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { useOnClickOutside } from 'usehooks-ts';

import { toast } from '@/hooks/use-toast';
import { useRouter } from '@/i18n/routing';
import { getCharacterField } from '@/lib/character';
import { cn } from '@/lib/utils';
import { selectedCharacterIdAtom } from '@/store/action';

interface Tab {
  title: string;
  icon: LucideIcon;
  type?: never;
}

interface Separator {
  type: "separator";
  title?: never;
  icon?: never;
}

type TabItem = Tab | Separator;

interface ExpandableTabsProps {
  tabs: TabItem[];
  className?: string;
  activeColor?: string;
  onChange?: (index: number | null) => void;
}

const buttonVariants = {
  initial: {
    gap: 0,
    paddingLeft: ".5rem",
    paddingRight: ".5rem",
  },
  animate: (isSelected: boolean) => ({
    gap: isSelected ? ".5rem" : 0,
    paddingLeft: isSelected ? "1rem" : ".5rem",
    paddingRight: isSelected ? "1rem" : ".5rem",
  }),
};

const transition = { delay: 0.1, type: "spring", bounce: 0, duration: 0.6 };

export function ExpandableTabs({
  tabs,
  className,
  activeColor = "text-primary",
  onChange,
}: ExpandableTabsProps) {
  const router = useRouter()
  const [selected, setSelected] = React.useState<number | null>(null);
  const outsideClickRef = React.useRef(null);

  useOnClickOutside(outsideClickRef, () => {
    setSelected(null);
    onChange?.(null);
  });

  const handleSelect = (index: number) => {
    setSelected(index);
    router.push(`/workspaces/${tabs[index].title}`)
    toast({ description: tabs[index].title, duration:1000 ,action:(<></>), className: "text-center flex items-center justify-center"})
    onChange?.(index);
  };

  const Separator = () => (
    <div className="mx-1 h-[24px] w-[1.2px] bg-border" aria-hidden="true" />
  );

  const [cid] = useAtom(selectedCharacterIdAtom)
  const [cover , setCover ] = React.useState("")
  React.useEffect(()=>{
    if(!cid) return
    const fetchCover = async ()=>{
      const coverBase64 = await getCharacterField(cid,"cover")
      setCover(coverBase64 as string)
    }
    fetchCover()
  },[cid])
  return (
    <div
      ref={outsideClickRef}
      className={cn(
        "flex flex-wrap items-center gap-2 rounded-2xl border bg-background p-1 shadow-sm",
        className
      )}
    >
      {tabs.map((tab, index) => {
        if (tab.type === "separator") {
          return <Separator key={`separator-${index}`} />;
        }

        const Icon = tab.icon;
        if(cover && index === 1)return (
          <motion.button
          key={tab.title}
          variants={buttonVariants}
          initial={false}
          animate="animate"
          custom={selected === index}
          onClick={() => handleSelect(index)}
          transition={transition}
          className={cn(
            "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
            selected === index
              ? cn("bg-muted", activeColor)
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Image src={cover} width={100} height={100} className="h-5 w-5 rounded-full" alt={tab.title} />
        </motion.button>
        )
        return (
          <motion.button
            key={tab.title}
            variants={buttonVariants}
            initial={false}
            animate="animate"
            custom={selected === index}
            onClick={() => handleSelect(index)}
            transition={transition}
            className={cn(
              "relative flex items-center rounded-xl px-4 py-2 text-sm font-medium transition-colors duration-300",
              selected === index
                ? cn("bg-muted", activeColor)
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon size={20} />
          </motion.button>
        );
      })}
    </div>
  );
}