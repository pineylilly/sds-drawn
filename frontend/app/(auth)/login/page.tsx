"use client";

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
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().trim().email(),
  password: z.string().trim().min(8, {message: 'Password must be at least 8 characters'}).max(64, {message: "Your password should not exceed 64 characters" }),
})

// export const metadata: Metadata = {
//   title: "Login | Drawn",
//   description: "Collaboration Web App",
// };

type ValidationSchemaType = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<ValidationSchemaType>({
    resolver: zodResolver(schema),
  });

  const onSubmit: SubmitHandler<ValidationSchemaType> = async (data) => {
    const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/login',{
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
      alert("Invalid email or password")
    }
  }


  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col justify-center items-center">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="hi@example.com"
            {...register("email")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" {...register("password")} />
        </div>
        <div className="w-full flex justify-center">
          <small>
            Does not have an account? <Link href="/register">Register</Link>
          </small>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit(onSubmit)} className="w-full">Sign in</Button>
      </CardFooter>
    </Card>
  );
}
