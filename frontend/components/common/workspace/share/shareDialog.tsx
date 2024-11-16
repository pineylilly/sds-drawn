"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import GeneralAccessSelector from "./generalAccessSelector";
import { useParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Permission } from "@/types/Workspace";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStorage } from "@/lib/hooks/StorageContext";
import { useUser } from "@/lib/hooks/UserContext";
import PersonAccessSelector from "./personAccessSelector";

interface ShareDialogProps {
    defaultGlobalAccess: "no" | "viewer" | "editor",
    defaultPersonAccesses: Permission[]
}

export default function ShareDialog({ defaultGlobalAccess, defaultPersonAccesses }: ShareDialogProps) {
    const params = useParams<{ id: string }>()
    const { toast } = useToast()
    const { getUserByEmail } = useStorage()
    const { currentUser } = useUser()

    const [addEmail, setAddEmail] = useState<string>('')
    const [addAccess, setAddAccess] = useState<string>("viewer")

    const [generalAccess, setGeneralAccess] = useState<"no" | "viewer" | "editor">(defaultGlobalAccess)
    const [personAccesses, setPersonAccesses] = useState<Permission[]>(defaultPersonAccesses)

    async function fetchPersonPermissions() {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces/" + params.id + "/permissions", {
            credentials: 'include'
        })
        if (response.ok) {
            const data: Permission[] = await response.json()
            setPersonAccesses(data)
        } else {
            toast({
                variant: "destructive",
                title: "Failed to fetch permissions",
                description: "An error occurred while fetching permissions",
            })
        }
    }

    async function changeGeneralAccess(access: "no" | "viewer" | "editor") {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces/" + params.id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                globalSharingType: access
            }),
            credentials: 'include'
        })
        if (response.ok) {
            setGeneralAccess(access)
            toast({
                title: "Successfully change general access",
                description: "The general access has been changed",
                className: "bg-white"
            })
        } else {
            toast({
                variant: "destructive",
                title: "Failed to change general access",
                description: "Please try again later",
            })
        }
    }

    async function addPersonPermission() {
        // Check if email is valid
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(addEmail)) {
            toast({
                variant: "destructive",
                title: "Invalid email",
                description: "Please enter a valid email",
            })
            return
        }

        // Check if user is adding their own email
        if (addEmail === currentUser?.email) {
            toast({
                variant: "destructive",
                title: "Invalid email",
                description: "You cannot add your own email",
            })
            return
        }

        // Get user info
        const user = await getUserByEmail(addEmail)
        if (!user) {
            toast({
                variant: "destructive",
                title: "User not found",
                description: "The user with this email does not exist",
            })
            return
        }

        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces/" + params.id + "/permissions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId: user.id,
                permissionType: addAccess
            }),
            credentials: 'include'
        })
        if (response.ok) {
            await fetchPersonPermissions()
            setAddEmail('')
            toast({
                title: "Successfully added permission",
                description: "The permission has been added",
                className: "bg-white"
            })
        } else {
            toast({
                variant: "destructive",
                title: "Failed to add permission",
                description: "This email already has permission",
            })
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Share</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Sharing</DialogTitle>
                </DialogHeader>
                <div className="w-full flex flex-col gap-3">
                    <Label className="text-base">People with access</Label>
                    <div className="flex w-full gap-2">
                        <Input 
                            type="text" 
                            placeholder="Enter email" 
                            value={addEmail}
                            onChange={(e) => setAddEmail(e.target.value)}
                        />
                        <Select onValueChange={setAddAccess} value={addAccess} >
                            <SelectTrigger className="w-24 max-w-24 min-w-24">
                                <SelectValue placeholder="Loading..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="viewer">Viewer</SelectItem>
                                <SelectItem value="editor">Editor</SelectItem>
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            onClick={addPersonPermission}
                            disabled={addEmail === ''}
                        >
                            Add
                        </Button>
                    </div>
                    {
                        personAccesses.map((permission) => {
                            return (
                                <PersonAccessSelector key={permission.id} data={permission} refreshPermissions={fetchPersonPermissions} />
                            )
                        })
                    }
                </div>
                <div className="w-full flex flex-col gap-3">
                    <Label className="text-base">General access</Label>
                    <GeneralAccessSelector access={generalAccess} onChange={changeGeneralAccess} />
                </div>
                

            </DialogContent>
        </Dialog>
    );
}