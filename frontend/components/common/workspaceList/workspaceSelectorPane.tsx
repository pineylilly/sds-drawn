"use client";

import { WorkspaceTable } from "@/components/common/workspaceList/workspaceTable";
import { WorkspaceTableProps } from "@/components/common/workspaceList/workspaceTable";
import CreateWorkspaceDialog from "./createWorkspaceDialog";
import { useEffect, useState } from "react";
import { Workspace } from "@/types/Workspace";
import { Button } from "@/components/ui/button";
import { ArrowDownAZ, ArrowUpZA, ClockArrowDown, ClockArrowUp, RefreshCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStorage } from "@/lib/hooks/StorageContext";
import { useUser } from "@/lib/hooks/UserContext";

export default function WorkspaceSelectorPane() {
  const { userFetchStorage, batchFetchUsers } = useStorage()
  const { currentUser } = useUser()

  const [data, setData] = useState<Workspace[]>([]);

  const [filter, setFilter] = useState<string>("");
  const [sortMode, setSortMode] = useState<string>("date_desc");

  async function fetchData() {
    const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces",{
      credentials : 'include',
    });

    if (!response.ok) {
      return;
    }

    const data: Workspace[] = await response.json();
    setData(data);
    await batchFetchUsers(data.map((workspace) => workspace.ownerId));
  }
  
  useEffect(() => {
    fetchData()
  }, [])
  

  return (
    <div className="flex flex-col flex-grow bg-white w-full justify-start items-center pt-4 pb-6">
      <div className="grid grid-rows-auto gap-y-2 w-[400px] md:w-[720px] lg:w-[1000px]">
        <div className="flex flex-row w-full justify-between items-center">
          <h2 className="font-bold text-s md:text-l lg:text-xl pl-10 md:pl-12 lg:pl-5">
            {(currentUser?.role === "admin") ? "All Workspaces" : "My Workspaces"}
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
          <Select value={sortMode} onValueChange={(mode) => setSortMode(mode)}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Select a sorting mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Date</SelectLabel>
                <SelectItem value="date_asc">
                  <div className="flex gap-2 items-center">
                    <ClockArrowUp size={15} />
                    <span>Date - Oldest</span>
                  </div>
                </SelectItem>
                <SelectItem value="date_desc">
                  <div className="flex gap-2 items-center">
                    <ClockArrowDown size={15} />
                    <span>Date - Newest</span>
                  </div>
                </SelectItem>
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>Name</SelectLabel>
                <SelectItem value="name_asc">
                  <div className="flex gap-2 items-center">
                    <ArrowDownAZ size={15} />
                    <span>Name - ASC</span>
                  </div>
                </SelectItem>
                <SelectItem value="name_desc">
                  <div className="flex gap-2 items-center">
                    <ArrowUpZA size={15} />
                    <span>Name - DESC</span>
                  </div>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-row px-4">
          <WorkspaceTable 
            refresh={fetchData} 
            data={
              data.filter((workspace) => {
                return workspace.name.toLowerCase().includes(filter.trim().toLowerCase());
              }).sort((a, b) => {
                if (sortMode === "date_asc") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                if (sortMode === "date_desc") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                if (sortMode === "name_asc") return a.name.localeCompare(b.name);
                if (sortMode === "name_desc") return b.name.localeCompare(a.name);
                return a.createdAt.getTime() - b.createdAt.getTime();
              })
            }
            recent={false}
          />
        </div>
      </div>
    </div>
  );
}
