import React from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Upload } from "lucide-react";
interface HeaderProps {
  onUploadClick: () => void;
}
const Header: React.FC<HeaderProps> = ({
  onUploadClick
}) => {
  return <header className="sticky top-0 z-10 bg-neutral-900/95 backdrop-blur-sm px-4 py-3 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-shrink-0">
          <h1 className="text-xl sm:text-2xl font-semibold text-white">Arco</h1>
        </div>
        
        <div className="hidden md:flex flex-1 max-w-xl mx-6">
          <Input type="search" placeholder="Buscar imágenes de arquitectura..." className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400" />
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={onUploadClick} variant="outline" size="sm" className="border-neutral-700 bg-stone-50 text-neutral-900 rounded-xl font-normal text-sm px-[20px] my-0 mx-0 py-0">
            <Upload size={18} className="mr-2" />
            <span className="hidden sm:inline">Subir</span>
          </Button>
          
          <Avatar className="h-9 w-9 border border-neutral-700">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="bg-neutral-800 text-neutral-300">US</AvatarFallback>
          </Avatar>
        </div>
      </div>
      
      <div className="mt-3 md:hidden">
        <Input type="search" placeholder="Buscar imágenes de arquitectura..." className="bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-400" />
      </div>
    </header>;
};
export default Header;