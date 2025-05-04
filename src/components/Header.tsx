
import React from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Upload, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  onUploadClick: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onUploadClick
}) => {
  const { logOut, currentUser } = useAuth();

  const handleSignOut = async () => {
    await logOut();
  };

  return <header className="sticky top-0 z-10 bg-neutral-900/95 backdrop-blur-sm px-4 border-b border-neutral-900 py-[24px]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">Arco</h1>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <Input type="search" placeholder="Buscar imágenes" className="border-neutral-800 text-sm placeholder:text-neutral-600 bg-neutral-800 rounded-xl py-0 px-[15px]" />
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={onUploadClick} variant="outline" size="sm" className="border-neutral-600 bg-neutral-600 text-neutral-50 rounded-xl px-[20px] my-0 mx-0 text-sm py-0 font-normal">
            <Upload size={18} className="mr-2" />
            <span className="hidden sm:inline">Subir</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 border border-neutral-700 cursor-pointer">
                <AvatarImage src="/lovable-uploads/4215eb53-3395-4473-ac35-186e3aa56fbe.png" className="object-fill" />
                <AvatarFallback className="bg-neutral-800 text-neutral-300">
                  {currentUser?.displayName?.charAt(0) || currentUser?.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-neutral-800 border-neutral-700">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  {currentUser?.displayName && (
                    <p className="font-medium text-neutral-100">{currentUser.displayName}</p>
                  )}
                  {currentUser?.email && (
                    <p className="text-xs text-neutral-300 truncate">{currentUser.email}</p>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator className="bg-neutral-700" />
              <DropdownMenuItem 
                onClick={handleSignOut} 
                className="cursor-pointer text-red-400 focus:text-red-400 focus:bg-neutral-700"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="mt-3 md:hidden">
        <Input type="search" placeholder="Buscar imagenes" className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400" />
      </div>
    </header>;
};

export default Header;
