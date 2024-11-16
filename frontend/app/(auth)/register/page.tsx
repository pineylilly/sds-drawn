'use client';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Metadata } from "next";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

// export const metadata: Metadata = {
//   title: "Register | Drawn",
//   description: "Create a new account on Drawn",
// };

const schema = z.object({
  email: z.string().trim().email(),
  displayName: z.string().trim().min(1, {message: 'Fill display name'}).max(32, {message: "Your display name should not exceed 32 characters" }),
  password: z.string().trim().min(8, {message: 'Password must be at least 8 characters'}).max(64, {message: "Your password should not exceed 64 characters" }),
  confirmPassword: z.string().trim().min(8, {message: 'Password must be at least 8 characters'}).max(64, {message: "Your password should not exceed 64 characters" }),
})
.refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Password and confirm password does not match'
})

type ValidationSchemaType = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<ValidationSchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<ValidationSchemaType> = async (data) => {
    console.log(data)
    const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/register",{
      method : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body : JSON.stringify(data),
      credentials : 'include',
    });
    if (result.ok) {
      window.location.href = "/workspaces"
    } else {
      alert("This email is already registered")
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col justify-center items-center">
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>
          Fill in the details below to create a new account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              type="text"
              placeholder="Display Name..."
              {...register('displayName')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="hi@example.com"
              {...register('email')}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              {...register('password')} 
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input 
              id="confirmPassword" 
              type="password" 
              {...register('confirmPassword')} 
            />
          </div>
          <div className="w-full flex justify-center">
            <small>
              Already have an account? <Link href="/login">Login</Link>
            </small>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit(onSubmit)} className="w-full">Register</Button>
      </CardFooter>
    </Card>
  );
}
