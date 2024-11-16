"use client";

import { WorkspaceTable } from "@/components/common/workspaceList/workspaceTable";
import CreateWorkspaceDialog from "./createWorkspaceDialog";
import { useEffect, useState } from "react";
import { Workspace } from "@/types/Workspace";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStorage } from "@/lib/hooks/StorageContext";

export default function RecentWorkspaceSelectorPane() {
  const { userFetchStorage, batchFetchUsers } = useStorage()

  const [data, setData] = useState<{latestView: Date, workspace: Workspace}[]>([]);

  const [filter, setFilter] = useState<string>("");

  async function fetchData() {
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces/recent",{
      credentials : 'include',
    });

    if (!response.ok) {
      return;
    }

    const data: {latestView: Date, workspace: Workspace}[] = await response.json();
    setData(data);
    await batchFetchUsers(data.map((workspace) => workspace.workspace.ownerId));
  }
  
  useEffect(() => {
    fetchData()
  }, [])
  

  return (
    <div className="flex flex-col flex-grow bg-white w-full justify-start items-center pt-4 pb-6">
      <div className="grid grid-rows-auto gap-y-2 w-[400px] md:w-[720px] lg:w-[1000px]">
        <div className="flex flex-row w-full justify-between items-center">
          <h2 className="font-bold text-s md:text-l lg:text-xl pl-10 md:pl-12 lg:pl-5">
            Recently Opened Workspaces
          </h2>
          <div className="flex gap-5 pr-10 md:pr-12 lg:pr-5">
            <Button variant="outline" onClick={fetchData}>
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <CreateWorkspaceDialog />
          </div>
        </div>
        <div className="flex pl-10 md:pl-12 lg:pl-5 gap-5">
          <Input
            placeholder="Search workspace..."
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            className="h-8 w-full lg:w-[600px]"
          />
        </div>
        <div className="flex flex-row px-4">
          <WorkspaceTable 
            refresh={fetchData} 
            data={
              data.filter((workspace) => {
                return workspace.workspace.name.toLowerCase().includes(filter.trim().toLowerCase());
              }).map((workspace) => {
                return {
                  ...workspace.workspace,
                  createdAt: workspace.latestView
                }
              })
            }
            recent={true}
          />
        </div>
      </div>
    </div>
  );
}
