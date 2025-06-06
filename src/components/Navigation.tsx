
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="text-xl font-bold text-black tracking-wider">Talo</div>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">About</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">Features</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">How it Works</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">Pricing</a>
              <a href="#" className="text-gray-900 hover:text-gray-600 px-3 py-2 text-sm font-medium">Contact</a>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-gray-900 font-medium"
              onClick={() => navigate('/login')}
            >
              Log In
            </Button>
            <Button 
              className="bg-black text-white hover:bg-gray-800 font-medium px-6"
              onClick={() => navigate('/signup')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
