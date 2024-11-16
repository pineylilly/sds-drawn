import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useStorage } from "@/lib/hooks/StorageContext";
import { Permission } from "@/types/Workspace";
import { use, useEffect } from "react";

export default function PersonAccessSelector({data, refreshPermissions, isOwner}: {data: Permission, refreshPermissions: () => void, isOwner?: boolean}) {
    const { toast } = useToast()
    const { getUser } = useStorage()

    async function changePermission(newPermission: string) {
        if (newPermission === "remove") {
            await deletePermission()
            return
        }
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces/" + data.workspaceId + "/permissions/" + data.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                permissionType: newPermission
            }),
            credentials: 'include'
        })
        if (response.ok) {
            toast({
                title: "Successfully changed permission",
                description: "The permission has been changed",
                className: "bg-white"
            })
            refreshPermissions()
        } else {
            toast({
                variant: "destructive",
                title: "Failed to change permission",
                description: "An error occurred while changing permission"
            })
        }
    }

    async function deletePermission() {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces/" + data.workspaceId + "/permissions/" + data.id, {
            method: 'DELETE',
            credentials: 'include'
        })
        if (response.ok) {
            toast({
                title: "Successfully removed permission",
                description: "The permission has been removed",
                className: "bg-white"
            })
            refreshPermissions()
        } else {
            toast({
                variant: "destructive",
                title: "Failed to remove permission",
                description: "An error occurred while removing permission"
            })
        }
    }

    const user = getUser(data.userId)
    if (!user) return null

    return (
        <div className="flex items-center gap-2 px-1 py-1">
            <Avatar>
                <AvatarImage src={user.avatar} />
                <AvatarFallback>👨🏽</AvatarFallback>
            </Avatar>
            <div className="flex flex-col grow">
                <span>{user.displayName}</span>
                <span className="text-sm text-gray-500">{user.email}</span>
            </div>
            <div>
                {   
                    isOwner && (
                        <div className="w-24 max-w-24 min-w-24 flex justify-center">
                            <Label>Owner</Label>
                        </div>
                    )}
                {
                    !isOwner && (
                        <Select onValueChange={(e) => changePermission(e)} value={data.permissionType} >
                            <SelectTrigger className="w-24 max-w-24 min-w-24">
                                <SelectValue placeholder="Loading..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                                <SelectItem value="remove">Remove</SelectItem>
                            </SelectContent>
                        </Select>
                    )
                }
            </div>
        </div>
    )
}