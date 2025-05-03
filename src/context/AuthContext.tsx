
// src/context/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { signInWithPopup, onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { toast } from "sonner";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("¡Inicio de sesión exitoso!");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, signInWithGoogle, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
