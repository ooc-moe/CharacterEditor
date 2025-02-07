"use client";
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from "../_components/Catalyst/dialog";
import { Button } from "../_components/Catalyst/button";
import { useState } from "react";
import { usePathname, useRouter } from "../../../i18n/routing";
import { Link } from "../_components/Catalyst/link";
import { Navbar } from "../_components/Catalyst/navbar";
import {
  Sidebar,
  SidebarBody,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
  SidebarSpacer,
} from "../_components/Catalyst/sidebar";
import { SidebarLayout } from "../_components/Catalyst/sidebar-layout";
import {
  BookImageIcon,
  CogIcon,
  EarthIcon,
  FileJson2,
  IdCardIcon,
  LayoutGridIcon,
  MessageSquareQuoteIcon,
  MessagesSquareIcon,
  PencilRulerIcon,
  RegexIcon,
  StarIcon,
  TentTree,
  XIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { SnackbarProvider, closeSnackbar } from "notistack";
import ScrollToTopButton from "../_components/Reuse/ScrollToTopButton";
import { useEffect } from "react";
import Image from "next/image";

export default function WorkSpacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const pathname = usePathname();
  const isCurrent = (href: string) => pathname === href;

  const t = useTranslations("SideBarLayout");

  return (
    <SnackbarProvider
      autoHideDuration={5000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      action={(snackbarId) => (
        <button onClick={() => closeSnackbar(snackbarId)}>
          <XIcon />
        </button>
      )}
    >
      <SidebarLayout
        sidebar={
          <Sidebar>
            {/* Logo */}
            <div className="mb-2 flex">
              <Link href="#" aria-label="Home"></Link>
            </div>

            {/* Header */}
            <SidebarHeader>
              <SidebarSection>
                <SidebarItem
                  href="/workspaces"
                  current={isCurrent("/workspaces")}
                >
                  <LayoutGridIcon />
                  <SidebarLabel>{t("workbenches")}</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarHeader>

            {/* Content */}
            <SidebarBody>
              <SidebarSection>
                <SidebarHeading>{t("character")}</SidebarHeading>
                <SidebarItem
                  href="/workspaces/description"
                  current={isCurrent("/workspaces/description")}
                >
                  <IdCardIcon />
                  <SidebarLabel>{t("character-description")}</SidebarLabel>
                </SidebarItem>
                <SidebarItem
                  href="/workspaces/firstmessage"
                  current={isCurrent("/workspaces/firstmessage")}
                >
                  <MessageSquareQuoteIcon />
                  <SidebarLabel>{t("firstmessage")}</SidebarLabel>
                </SidebarItem>
                <SidebarItem
                  href="/workspaces/greetings"
                  current={isCurrent("/workspaces/greetings")}
                >
                  <MessagesSquareIcon />
                  <SidebarLabel>{t("greeting")}</SidebarLabel>
                </SidebarItem>

                <SidebarItem
                  href="/workspaces/advancedDefinitions"
                  current={isCurrent("/workspaces/advancedDefinitions")}
                >
                  <PencilRulerIcon />
                  <SidebarLabel>{t("advanced")}</SidebarLabel>
                </SidebarItem>

                <SidebarItem
                  href="/workspaces/worldbook"
                  current={isCurrent("/workspaces/worldbook")}
                >
                  <EarthIcon />
                  <SidebarLabel>{t("worldBook")}</SidebarLabel>
                </SidebarItem>
                <SidebarItem
                  href="/workspaces/regex"
                  current={isCurrent("/workspaces/regex")}
                >
                  <RegexIcon />
                  <SidebarLabel>{t("regex")}</SidebarLabel>
                </SidebarItem>
              </SidebarSection>

              <SidebarSpacer />

              <SidebarSection>
                <SidebarHeading>{t("tools")}</SidebarHeading>
                <SidebarItem
                  href="/workspaces/inset"
                  current={isCurrent("/workspaces/inset")}
                >
                  <BookImageIcon />
                  <SidebarLabel>
                    {t("inset")}{" "}
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-1.5 py-0.5 text-xs font-medium text-yellow-800">
                      PC Beta
                    </span>
                  </SidebarLabel>
                </SidebarItem>
                <SidebarItem
                  href="/workspaces/convertor"
                  current={isCurrent("/workspaces/convertor")}
                >
                  <FileJson2 />
                  <SidebarLabel>{t("convertor")} </SidebarLabel>
                </SidebarItem>
              </SidebarSection>

              <SidebarSection>
                <SidebarHeading>{t("other")}</SidebarHeading>
                <SidebarItem
                  href="https://github.com/ooc-moe/CharacterEditor"
                  target="_blank"
                >
                  <StarIcon />
                  <SidebarLabel>{t("project-address")}</SidebarLabel>
                </SidebarItem>
                <SidebarItem href="https://ce.ooc.moe" target="_blank">
                  <TentTree />
                  <SidebarLabel>
                    ce.ooc.moe
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-600/20 ring-inset">
                      New
                    </span>
                  </SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarBody>

            {/* Footer */}
            <SidebarFooter>
              <SidebarSection>
                <SidebarItem
                  href="/workspaces/settings"
                  current={isCurrent("/workspaces/settings")}
                >
                  <CogIcon />
                  <SidebarLabel>{t("settings")}</SidebarLabel>
                </SidebarItem>
              </SidebarSection>
            </SidebarFooter>
          </Sidebar>
        }
        navbar={<Navbar>{/* Navbar content */}</Navbar>}
      >
        <section>
          {/* Page content */}
          {children}
          <OoCMoe />
          <ScrollToTopButton />
        </section>
      </SidebarLayout>
    </SnackbarProvider>
  );
}


export  function OoCMoe() {
  const router = useRouter();
  const t = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const rows = localStorage.getItem("oocmoe");
    if (rows !== "seen") {
      setIsOpen(true);
    }
  }, []);

  const handleNoPrompt = () => {
    localStorage.setItem("oocmoe", "seen");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <DialogTitle>{t("try new site")}</DialogTitle>
      ce.ooc.moe
      <DialogDescription>
        <Image 
          height={500}
          width={500} 
          alt="ce.ooc.moe"
          src="/oocmoe.webp"
        />
      </DialogDescription>
      <DialogActions className="justify-between">
        <Button plain onClick={handleNoPrompt}>
          {t("No prompt")}
        </Button>
        <Button plain onClick={() => router.push("https://ce.ooc.moe")}>
          {t("go")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
