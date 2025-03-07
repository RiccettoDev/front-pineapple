"use client";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useState } from "react";

import {
  AuthContextProps,
  SignAuthProps,
} from "interfaces/contexts/auth-context.interfaces";
import { UserProps } from "interfaces/user.interfaces";

import { useToast } from "@chakra-ui/react";
import api from "services/api";

export const AuthContext = createContext({} as AuthContextProps);

export function AuthProvider({ children }: any) {
  const toast = useToast();
  const [user, setUser] = useState({} as UserProps);
  const router = useRouter();

  async function sign({ ...props }: SignAuthProps): Promise<undefined> {
    try {
      const { data } = await api.post("/auth/login", {
        ...props,
      });

      setCookie(
        "user",
        {
          ...data,
        },
        { expires: dayjs().add(7, "days").toDate() }
      );

      api.defaults.headers["Authorization"] = `Bearer ${data.access_token}`;

      router.push("/home");
    } catch (error: any) {
      toast({
        title: "Oops.",
        description:
          error.response?.data?.message || error.message || "Houve um problema",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
    }
  }

  async function logout() {
    deleteCookie("user");
    router.push("/auth");
  }

  const me = useCallback(async (): Promise<boolean> => {
    try {
      let user = getCookie("user")?.toString() as any;
      user = user ? (JSON.parse(user) as UserProps) : false;
  
      let dataToReturn = { ...user };
  
      if (user) {
        api.defaults.headers["Authorization"] = `Bearer ${user.access_token}`;
  
        const { data: resp } = await api.get("/auth/me");
  
        dataToReturn = { ...dataToReturn, ...resp };
  
        setUser({ ...user, ...resp });
      } else {
        router.push("/auth");
      }
  
      return dataToReturn;
    } catch (error) {
      console.log(error);
      logout();
      return false;
    }
  }, [router, logout]); // Adicione as dependências necessárias aqui

  return (
    <AuthContext.Provider value={{ user, sign, logout, me }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
