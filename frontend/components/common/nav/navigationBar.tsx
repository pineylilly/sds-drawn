"use client";

import Link from "next/link";
import { Button } from "../../ui/button";
import { useUser } from "@/lib/hooks/UserContext";
import crayon from "../../../app/favicon.ico"
import MenuBar from "./menuBar";
import Image from "next/image";

export default function NavigationBar() {

    const {isLoading, currentUser} = useUser()

    return (
        <nav className="sticky top-0 h-16 backdrop-blur-md flex items-center justify-between px-4 border-b w-full">
            <div className="flex gap-7 items-center">
                <Link href="/" className="decoration-black flex items-center gap-1">
                    <Image src={crayon} alt="logo" width={22} height={22} />
                    <h1 className="font-bold text-indigo-900">Drawn</h1>
                </Link>
                <div className="flex items-center gap-2">
                    {
                        (!isLoading && currentUser) && (
                            <Link href="/workspaces" className="decoration-black text-black hover:text-indigo-600 transition-colors">
                                Workspaces
                            </Link>
                        )
                    }
                </div>
            </div>
            <div className="flex gap-3">
                {
                    (!isLoading && currentUser) && (
                        <MenuBar />
                    )
                }
                {
                    (!isLoading && !currentUser) && (
                        <>
                            <Link href="/register" className="decoration-black">
                                <Button variant="secondary">Sign Up</Button>
                            </Link>
                            <Link href="/login" className="decoration-black">
                                <Button>Sign In</Button>
                            </Link>
                        </>
                    )
                }
                
                
            </div>
        </nav>
    );
}