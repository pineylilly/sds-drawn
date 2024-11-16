import { AuthUser } from "@/types/AuthUser";
import { createContext, useContext, useEffect, useState } from "react";


const unverifyExceptionList = ['/', '/register', '/verify']

export const UserContext = createContext<{ currentUser: AuthUser | null, fetchUser: () => Promise<boolean>, isLoading: boolean }>({currentUser : null , fetchUser : async () => {return false;}, isLoading: true});

export const UserProvider = ({children} : {children : React.ReactNode}) => {
    const [currentUser,setCurrentUser] = useState<AuthUser | null>(null);
    const [isLoading, setLoading] = useState<boolean>(true)

    // const navigate = useNavigate()
    // const location = useLocation()

    const fetchUser = async() => {
        try {
            const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/auth/token",{
                method : "POST",
                credentials : 'include',
            });
            if (!result.ok) {
                setLoading(false)
                return false;
            }
            const user : AuthUser | null = await result.json()
            setCurrentUser(user);
            setLoading(false)
            if (!user) return false;

            return true;
        }
        catch {
            setLoading(false)
            return false;
        }
        
    };
    
    useEffect(() => {
        fetchUser();
    },[]);
    
    return (<UserContext.Provider value = {{currentUser, fetchUser, isLoading}}>
        {children}
    </UserContext.Provider>);
};

export const useUser = () => {return useContext(UserContext)};