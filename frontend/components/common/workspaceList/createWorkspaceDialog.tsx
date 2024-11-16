"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Workspace } from "@/types/Workspace";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateWorkspaceDialog() {
    const router = useRouter()

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    async function submit() {
        const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/workspaces", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                description: description
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            return;
        }

        const data: Workspace = await response.json();

        setName("");
        setDescription("");

        router.push("/workspaces/" + data.id);
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">Create Workspace</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
                <DialogHeader>
                    <DialogTitle>Create Workspace</DialogTitle>
                    <DialogDescription>
                        Fill some information about new workspace
                    </DialogDescription>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Workspace name"
                            className="col-span-3"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Description
                        </Label>
                        <Input
                            id="description"
                            placeholder="Optional"
                            className="col-span-3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={submit} disabled={(!name)}>Save changes</Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}