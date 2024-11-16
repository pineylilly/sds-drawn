"use client";

import NavigationBar from "@/components/common/nav/navigationBar";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Custom404() {
    return (
        <div className="unpadding-page">
            <NavigationBar />
            <div className="h-[calc(100vh-4rem)] flex flex-col items-center justify-center gap-2">
                <h1 className="text-xl">404 - Page Not Found</h1>
                <Link href="/">
                    <Button>Back to Homepage</Button>
                </Link>
                
            </div>
        </div>
    )
  }