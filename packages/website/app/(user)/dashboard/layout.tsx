import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Sidebar from "../../components/Navigation/Sidebar";
import NavBar from "../../components/Navigation/NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      {/* Page container: left sidebar + right content */}
      <div className="min-h-screen min-w-screen flex bg-background">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 border-r border-muted/20">
          <Sidebar />
        </aside>

        {/* Main column: navbar on top, content fills remaining space */}
        <div className="flex-1 flex flex-col">
          <header className="w-full">
            <div className="flex items-center w-full">
              {/* Sidebar trigger for smaller screens */}
              <div className="lg:hidden">
                <SidebarTrigger />
              </div>
              <div className="flex-1">
                <NavBar />
              </div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-5 ">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
