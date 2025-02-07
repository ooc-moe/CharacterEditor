"use client";

import * as React from "react";
import {
  AmphoraIcon,
  AudioLinesIcon,
  BookUserIcon,
  CogIcon,
  IdCardIcon,
  InfoIcon,
  LibraryBigIcon,
  PawPrintIcon,
  Pyramid,
  RegexIcon,
  SmartphoneIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

const data = {
  navMain: [
    {
      title: "exhibit",
      url: "",
      icon: AmphoraIcon,
      isActive: true,
      items: [
        {
          title: "character",
          url: "/workspaces/exhibit/character",
        },
        {
          title: "worldbook",
          url: "/workspaces/exhibit/worldbook",
        },
        {
          title: "regex-scripts",
          url: "/workspaces/exhibit/regex-scripts",
        },
      ],
    },
    {
      title: "characterItem",
      url: "#",
      icon: IdCardIcon,
      isActive: true,
      items: [
        {
          title: "description",
          url: "/workspaces/character/description",
        },
        {
          title: "first_mes",
          url: "/workspaces/character/first_mes",
        },
        {
          title: "alternate_greetings",
          url: "/workspaces/character/alternate_greetings",
        },
        {
          title: "mes_example",
          url: "/workspaces/character/mes_example",
        },
        {
          title: "personality",
          url: "/workspaces/character/personality",
        },
        {
          title: "scenario",
          url: "/workspaces/character/scenario",
        },
        {
          title: "creator_notes",
          url: "/workspaces/character/creator_notes",
        },
        {
          title: "system_prompt",
          url: "/workspaces/character/system_prompt",
        },
        {
          title: "post_history_instructions",
          url: "/workspaces/character/post_history_instructions",
        },
        {
          title: "tags",
          url: "/workspaces/character/tags",
        },
      ],
    },
    {
      title: "worldbook",
      url: "#",
      icon: LibraryBigIcon,
      isActive: true,
      items: [
        {
          title: "entries",
          url: "/workspaces/worldbook/entries",
        }
      ],
    }
  ],
  projects: [
    {
      name: "settings",
      url: "/workspaces/settings",
      icon: CogIcon,
    },
    {
      name: "CatboxGallery",
      url: "/workspaces/tools/catbox",
      icon: PawPrintIcon,
    },
    {
      name: "oocmoe",
      url: "https://ooc.moe",
      icon: Pyramid,
    },
    {
      name: "about",
      url: "/workspaces/about",
      icon: InfoIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <div className="text-center truncate">{t("hero")}</div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
