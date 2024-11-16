"use client";

import NavigationBar from "@/components/common/nav/navigationBar";
import RecentWorkspaceSelectorPane from "@/components/common/workspaceList/recentWorkspaceSelectorPane";
import WorkspaceSelectorPane from "@/components/common/workspaceList/workspaceSelectorPane";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/lib/hooks/UserContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function Workspaces() {
  const { isLoading, currentUser } = useUser()
  const router = useRouter()

  const [tab, setTab] = useState("workspaces")

  if (isLoading) return null
  if (!currentUser) {
    router.push("/login")
    return null
  }

  return (
    <div className="unpadding-page">
      <NavigationBar />
      {/* <WorkspaceTemplatePane /> */}
      <div className="w-[400px] md:w-[720px] lg:w-[1000px]">
        <Tabs defaultValue="workspaces" value={tab} onValueChange={(e) => setTab(e)} className="w-full px-5 py-2">
          <TabsList className="bg-white text-black">
            <TabsTrigger value="workspaces">{currentUser.role === "admin" ? "All Workspaces" : "My Workspaces"}</TabsTrigger>
            <TabsTrigger value="recently">Recently Opened</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {
        (tab === "workspaces") ? <WorkspaceSelectorPane /> : <RecentWorkspaceSelectorPane />
      }
    </div>
  );
}
