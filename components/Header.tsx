import { Bell, Settings, User } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  return (
    <header className="bg-[#1a1a2e] border-b border-[#16213e] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-[#e94560] to-[#ff6b6b] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">NT</span>
          </div>
          <h1 className="text-white font-semibold text-lg">NetworkTraffic AI</h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-[#16213e]">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-[#16213e]">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-[#16213e]">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}