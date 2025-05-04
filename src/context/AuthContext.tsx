
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

  // Function to sync Firebase user with Supabase
  const syncUserWithSupabase = async (user: User | null) => {
    if (user) {
      try {
        console.log('Syncing Firebase user with Supabase:', user.uid);
        
        // Get ID token from Firebase
        const idToken = await user.getIdToken();
        
        // Sign in to Supabase with custom token - first attempt with createSession
        const { data: signInData, error: signInError } = await supabase.auth.signInWithIdToken({
          provider: 'google', // We're using google as a placeholder
          token: idToken,
          nonce: 'firebase-' + user.uid, // Add a unique nonce
        });
        
        if (signInError) {
          console.error('Error signing in with Supabase ID token:', signInError);
          
          // If that fails, try email/password approach
          const { error: emailSignInError } = await supabase.auth.signInWithPassword({
            email: user.email || 'anonymous@example.com',
            password: idToken.substring(0, 20) // Using a portion of the ID token as password
          });
          
          if (emailSignInError) {
            // If sign in fails, try to sign up
            if (emailSignInError.message.includes('Invalid login credentials')) {
              console.log('Attempting to sign up with Supabase');
              const { error: signUpError } = await supabase.auth.signUp({
                email: user.email || 'anonymous@example.com',
                password: idToken.substring(0, 20),
                options: {
                  data: {
                    firebase_uid: user.uid,
                    display_name: user.displayName
                  }
                }
              });
              
              if (signUpError) {
                console.error('Error signing up with Supabase:', signUpError);
                return false;
              } else {
                console.log('Successfully signed up with Supabase');
                
                // After signup, sign in again
                await supabase.auth.signInWithPassword({
                  email: user.email || 'anonymous@example.com',
                  password: idToken.substring(0, 20)
                });
              }
            } else {
              console.error('Error signing in with Supabase email/password:', emailSignInError);
              return false;
            }
          }
        } else {
          console.log('Successfully signed in with Supabase ID token');
        }
        
        return true;
      } catch (error) {
        console.error('Error in syncUserWithSupabase:', error);
        return false;
      }
    } else {
      // Sign out from Supabase when Firebase user signs out
      console.log('Signing out from Supabase');
      await supabase.auth.signOut();
      return true;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Firebase auth state changed:', user?.uid);
      setCurrentUser(user);
      
      try {
        // Sync Firebase user with Supabase
        const syncResult = await syncUserWithSupabase(user);
        if (!syncResult) {
          console.warn('Failed to sync with Supabase');
        }
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
      // First sign out from Supabase
      await supabase.auth.signOut();
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
