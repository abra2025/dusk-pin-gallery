
// src/context/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { 
  signInWithPopup, 
  onAuthStateChanged, 
  signOut, 
  User, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword 
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { toast } from "sonner";
import { supabase } from "../../supabase";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simpler approach to sync with Supabase - just set the auth header
  const syncUserWithSupabase = async (user: User | null) => {
    if (user) {
      try {
        console.log('Setting Firebase user token for Supabase');
        
        // Get ID token from Firebase
        const idToken = await user.getIdToken();
        
        // Set the auth header for Supabase requests
        supabase.functions.setAuth(idToken);
        
        return true;
      } catch (error) {
        console.error('Error syncing with Supabase:', error);
        return false;
      }
    } else {
      // Clear the auth header when user is null
      supabase.functions.setAuth('');
      return true;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Firebase auth state changed:', user?.uid);
      setCurrentUser(user);
      
      try {
        // Sync Firebase user with Supabase in a simpler way
        await syncUserWithSupabase(user);
      } catch (error) {
        console.error('Error syncing with Supabase:', error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      toast.success("¡Inicio de sesión exitoso!");
      
      // Sync with Supabase after successful sign in
      await syncUserWithSupabase(result.user);
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success("¡Inicio de sesión exitoso!");
      
      // Sync with Supabase after successful sign in
      await syncUserWithSupabase(result.user);
    } catch (error) {
      console.error("Error al iniciar sesión con email:", error);
      toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      toast.success("¡Cuenta creada exitosamente!");
      
      // Sync with Supabase after successful sign up
      await syncUserWithSupabase(result.user);
    } catch (error) {
      console.error("Error al crear cuenta:", error);
      toast.error("Error al crear cuenta. Inténtalo de nuevo.");
    }
  };

  const logOut = async () => {
    try {
      // First sign out from Supabase by clearing the auth header
      supabase.functions.setAuth('');
      // Then sign out from Firebase
      await signOut(auth);
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      loading, 
      signInWithGoogle, 
      signInWithEmail,
      signUpWithEmail,
      logOut 
    }}>
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
