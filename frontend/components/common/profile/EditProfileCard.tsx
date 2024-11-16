"use client";

import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/lib/hooks/UserContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar } from "@radix-ui/react-avatar";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
    displayName: z.string().trim().min(1, {message: 'Fill your display name'}).max(50, {message: 'Display name is too long'})
})

type ValidationSchemaType = z.infer<typeof schema>;

export default function EditProfileCard() {
    const { isLoading, currentUser } = useUser();
    if (isLoading || !currentUser) return null;

    const { toast } = useToast()

    const [onProcess, setOnProcess] = useState<boolean>(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const hiddenFileInput = useRef<HTMLInputElement>(null);

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<ValidationSchemaType>({
        resolver: zodResolver(schema),
        defaultValues: {
            displayName: currentUser?.displayName || ''
        },
        mode: 'onChange'
    });

    async function onSubmit(data: ValidationSchemaType) {
        try {
            setOnProcess(true)
            const formData = new FormData();
            formData.append('displayName', data.displayName);
            if (avatarFile) {
                formData.append('avatar', avatarFile);
            }
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/users/' + currentUser?.id, {
                method: 'PUT',
                credentials: "include",
                body: formData
            });
            if (response.ok) {
                toast({
                    title: 'Profile updated',
                    description: 'Your profile has been updated successfully',
                });
                setTimeout(() => {
                    window.location.reload();
                }, 500)
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'An error occurred while updating your profile',
                });
                setOnProcess(false);
            }
        } catch (error) {
            console.error(error);
            setOnProcess(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Public Profile</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <Separator />
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="displayname" className="font-bold">Display Name</Label>
                        <Input type="text" id="displayname" placeholder="Display name..." {...register("displayName")}/>
                        {errors.displayName && <span className="text-red-500 text-sm">{errors.displayName.message}</span>}
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label className="font-bold">Email</Label>
                        <Label>{currentUser.email}</Label>
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-2">
                        <Label className="font-bold">Profile Picture</Label>
                        <div className="flex items-center gap-5">
                            <Avatar className="w-20 h-20 rounded-full">
                                <AvatarImage src={(avatarFile) ? (URL.createObjectURL(avatarFile) || currentUser.avatar) : currentUser.avatar} alt="Avatar" className="object-cover rounded-full" />
                                <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>   
                            </Avatar>
                            <Input ref={hiddenFileInput} type="file" className="hidden" onChange={(e) => setAvatarFile((e.target.files) ? e.target.files[0] : null)}></Input>
                            <Button type="button" onClick={() => hiddenFileInput.current?.click()} >Change Picture</Button>
                        </div>
                    </div>
                    <div>
                        <Button type="submit" disabled={onProcess || !isValid}>Save</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}