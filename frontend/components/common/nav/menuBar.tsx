import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useUser } from "@/lib/hooks/UserContext";
import { LogOut, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MenuBar() {
    const {isLoading, currentUser} = useUser()
    const router = useRouter()

    if (isLoading || !currentUser) return null

    async function logout() {
        try {
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/auth/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include'
            })
            window.location.href = "/"
        } catch (err) {
            window.location.href = "/"
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={currentUser.avatar} alt="Avatar" width={20} height={20} className="object-cover" />
                    <AvatarFallback>{currentUser.displayName.charAt(0)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>{currentUser.displayName}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-3" onClick={() => router.push('/profile')}>
                    <User size={20}/>
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-3" onClick={() => logout()}>
                    <LogOut size={20}/>
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        

    )
}