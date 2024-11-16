"use client";

import ChatPane from "@/components/common/chat/chatPane";
import NavigationBar from "@/components/common/nav/navigationBar";
import Whiteboard from "@/components/common/whiteboard";
import { Button } from "@/components/ui/button";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import WorkspaceNavBar from "@/components/workspaces/workspaceNavBar";
import { useUser } from "@/lib/hooks/UserContext";
import { User } from "@/types/User";
import { Workspace, WorkspaceFullData } from "@/types/Workspace";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { set } from "react-hook-form";

export default function WorkspacePage() {
    const params = useParams<{ id: string }>()
    const router = useRouter()
    const {isLoading, currentUser} = useUser()

    const [workspace, setWorkspace] = useState<WorkspaceFullData | null>(null)

    const initFetchRef = useRef<boolean>(true)

    const [permission, setPermission] = useState<string>("viewer")

    const [users, setUsers] = useState<User[]>([]);

    async function getWorkspace() {
        const permission = await enterWorkspace()
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces/" + params.id, {
            credentials: 'include',
        })
        if (!res.ok) {
            router.push("/workspaces")
        } else {
            const data = await res.json()
            setWorkspace(data)
        }
    }

    async function enterWorkspace() {
        const res = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces/" + params.id + "/enter", {
            method: "POST",
            credentials: 'include',
        })
        if (!res.ok) {
            setPermission("no")
            return "no"
        } 
        const result: {permission: string} = await res.json()
        setPermission(result.permission)
        return result.permission
    }

    useEffect(() => {
        if (initFetchRef.current) {
            getWorkspace()
            initFetchRef.current = false
        }
    }, [params.id])

    if (!workspace || (isLoading)) return null

    if (!isLoading && !currentUser) {
        router.push("/login")
        return null
    }

    if (permission === "no") {
        return (
            <div className="unpadding-page">
                <NavigationBar />
                <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-3">
                    <h1 className="text-2xl text-center text-black">You don't have permission to access this workspace</h1>
                    <Link href="/workspaces">
                        <Button>Back to Workspaces</Button>
                    </Link>
                </div>
            </div>
        )
    }


    return (
        <div className="unpadding-page">
            <WorkspaceNavBar data={workspace} userList={users}/>
            <ResizablePanelGroup direction="horizontal" className="w-full h-[calc(100vh-4rem)]">
                <ResizablePanel defaultSize={70} maxSize={90} minSize={50} className="h-[calc(100vh-4rem)]">
                    <Whiteboard viewMode={permission === "viewer"} setUsers={setUsers}/>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={30} maxSize={50} minSize={10} className="h-[calc(100vh-4rem)]">
                    <ChatPane viewing={permission === "viewer"} />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}