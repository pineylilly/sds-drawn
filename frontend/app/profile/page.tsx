"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NavigationBar from "@/components/common/nav/navigationBar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@/lib/hooks/UserContext";
import { Edit } from "lucide-react";
import EditProfileCard from "@/components/common/profile/EditProfileCard";
import ChangePasswordCard from "@/components/common/profile/ChangePasswordCard";

export default function ProfilePage() {
  const router = useRouter();
  const { isLoading, currentUser } = useUser();

  if (isLoading) {
    return null;
  }

  if (!isLoading && !currentUser) {
    router.push("/login");
    return null;
  }

  return (
    <div className="unpadding-page">
      <NavigationBar />
      <div className="flex flex-col gap-8 px-4 py-5 w-full">
        <div className="flex gap-5 w-full">
            <Avatar className="w-20 h-20">
              <AvatarImage src={currentUser?.avatar} alt="Avatar" className="object-cover" />
              <AvatarFallback>{currentUser?.displayName.charAt(0)}</AvatarFallback>
            </Avatar>
          <div className="flex flex-col gap-1 justify-center">
            <h1 className="text-lg font-bold">{currentUser?.displayName}</h1>
            <p className="text-sm text-gray-500">{currentUser?.email}</p>
          </div>
        </div>
        <EditProfileCard />
        <ChangePasswordCard />
      </div>
    </div>
  );
}
