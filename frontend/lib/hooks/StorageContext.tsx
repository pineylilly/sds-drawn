import { User } from "@/types/User";
import { createContext, useContext, useState } from "react";

interface StorageProps {
    userFetchStorage: Map<string, User>,
    getUser: (id: string) => User | null | undefined,
    getUserByEmail: (email: string) => Promise<User | null>,
    fetchUser: (id: string) => Promise<User | null>,
    batchFetchUsers: (ids: string[]) => Promise<void>,
}

export const StorageContext = createContext<StorageProps>({
    userFetchStorage: new Map<string, User>(),
    getUser: (id: string) => {return null;},
    getUserByEmail: async (email: string) => {return null;},
    fetchUser: async (id: string) => {return null;},
    batchFetchUsers: async (ids: string[]) => {},
});

export const StorageProvider = ({children} : {children : React.ReactNode}) => {
    const [userFetchStorage, setUserFetchStorage] = useState<Map<string, User>>(new Map<string, User>());

    const updateUserFetchStorage = (key: string, value: User) => {
        // const newMap = new Map<string, User>(userFetchStorage);
        // newMap.set(key, value);
        // setUserFetchStorage(newMap);
        setUserFetchStorage((prev) => {
            var newMap = new Map<string, User>(prev);
            newMap.set(key, value);
            return newMap;
        });
    }

    const fetchUser = async (id: string) => {
        try {
            const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/users/" + id, {
                method: "GET",
                credentials: 'include',
            });
            if (!result.ok) {
                return null;
            }
            const user: User = await result.json();
            updateUserFetchStorage(id, user);
            return user;
        }
        catch {
            return null;
        }
    }

    const batchFetchUsers = async (ids: string[]) => {
        const promises = ids.map((id) => fetchUser(id));
        await Promise.all(promises);
    }

    function getUser(id: string) {
        if (!userFetchStorage.has(id)) {
            (async () => {
                await fetchUser(id);
            })()
        }
        return userFetchStorage.get(id)
    }

    async function getUserByEmail(email: string) {
        try {
            const result = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + "/users?email=" + email, {
                method: "GET",
                credentials: 'include',
            });
            if (!result.ok) {
                return null;
            }
            const user: User = await result.json();
            return user;
        }
        catch {
            return null;
        }
    }

    return (<StorageContext.Provider value={{userFetchStorage, getUser, getUserByEmail, fetchUser, batchFetchUsers}}>
        {children}
    </StorageContext.Provider>);
};

export const useStorage = () => {
    return useContext(StorageContext);
}