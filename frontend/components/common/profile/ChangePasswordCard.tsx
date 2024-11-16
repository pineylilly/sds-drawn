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
    oldPassword: z.string().trim().min(1, {message: 'Fill your old password'}),
    newPassword: z.string().trim().min(8, {message: 'Password must be at least 8 characters long'}),
    confirmPassword: z.string().trim().min(8, {message: 'Password must be at least 8 characters long'})
}).refine((data) => data.confirmPassword === data.newPassword, {message: 'Passwords do not match', path: ['confirmPassword']});

type ValidationSchemaType = z.infer<typeof schema>;

export default function ChangePasswordCard() {
    const { isLoading, currentUser } = useUser();
    if (isLoading || !currentUser) return null;

    const { toast } = useToast()

    const [onProcess, setOnProcess] = useState<boolean>(false);

    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<ValidationSchemaType>({
        resolver: zodResolver(schema),
    });

    async function onSubmit(data: ValidationSchemaType) {
        try {
            setOnProcess(true)
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/users/' + currentUser?.id + '/password', {
                method: 'PUT',
                credentials: "include",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                toast({
                    title: 'Password updated',
                    description: 'Your password has been updated successfully',
                });
                reset();
            } else {
                const errorData = await response.json();
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: errorData.message,
                });
            }
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An error occurred while updating your password',
            });
        } finally {
            setOnProcess(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
                <Separator />
                <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="oldPassword" className="font-bold">Old Password</Label>
                        <Input type="password" id="oldPassword" placeholder="Old password..." {...register("oldPassword")}/>
                        {errors.oldPassword && <span className="text-red-500 text-sm">{errors.oldPassword.message}</span>}
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="newPassword" className="font-bold">New Password</Label>
                        <Input type="password" id="newPassword" placeholder="New password..." {...register("newPassword")}/>
                        {errors.newPassword && <span className="text-red-500 text-sm">{errors.newPassword.message}</span>}
                    </div>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="confirmPassword" className="font-bold">Confirm New Password</Label>
                        <Input type="password" id="confirmPassword" placeholder="New password..." {...register("confirmPassword")}/>
                        {errors.confirmPassword && <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>}
                    </div>
                    <div>
                        <Button type="submit" disabled={onProcess || !isValid}>Change Password</Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}