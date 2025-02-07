"use client";


import { AppSidebar } from '@/components/app-sidebar';
import { ModeToggle } from '@/components/mode-toggle';
import NavPhone from '@/components/nav-phone';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';

import { usePathname } from '@/i18n/routing';

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const segments = usePathname().split("/").filter(Boolean);
  return (
    <>
      <div className="h-full hidden md:block">
        <SidebarProvider className="h-full">
          <AppSidebar />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 justify-between">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    {segments.map((segment, index) => (
                      <div key={index} className="flex items-center">
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink>{segment}</BreadcrumbLink>
                        </BreadcrumbItem>
                        {index < segments.length - 1 && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                      </div>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
              <div className="px-4">
                <ModeToggle />
              </div>
            </header>
            <div className="h-full overflow-y-hidden flex flex-1 flex-col gap-4 p-4 pt-0">
              <div className="h-full flex-1 flex flex-col rounded-xl bg-muted/50 p-4 xl:p-8">
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>

      <div className="md:hidden flex flex-col h-full">
        <div className="flex-1 overflow-auto pb-16 p-2">{children}</div>
        <div className="fixed bottom-0 left-0 right-0 m-2 shrink-0 pb-safe">
          <NavPhone />
        </div>
      </div>
      <Toaster richColors position="top-center" />
    </>
  );
}

