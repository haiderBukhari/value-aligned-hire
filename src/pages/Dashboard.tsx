
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutDashboard, 
  FileText, 
  ClipboardCheck, 
  MessageSquare, 
  Users, 
  Crown, 
  Gift, 
  GitBranch, 
  Building,
  LogOut
} from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  
  const navigationItems = [
    { 
      name: "Application Screening", 
      path: "/dashboard/application-screening", 
      icon: FileText 
    },
    { 
      name: "Assessments", 
      path: "/dashboard/assessments", 
      icon: ClipboardCheck 
    },
    { 
      name: "Initial Interview", 
      path: "/dashboard/initial-interview", 
      icon: MessageSquare 
    },
    { 
      name: "Secondary Interview", 
      path: "/dashboard/secondary-interview", 
      icon: Users 
    },
    { 
      name: "Final Interview", 
      path: "/dashboard/final-interview", 
      icon: Crown 
    },
    { 
      name: "Offer Stage", 
      path: "/dashboard/offer-stage", 
      icon: Gift 
    },
    { 
      name: "Hiring Pipeline", 
      path: "/dashboard/pipeline", 
      icon: GitBranch 
    },
    { 
      name: "Company Config", 
      path: "/dashboard/company", 
      icon: Building 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">HireFlow</h1>
          <p className="text-sm text-gray-600 mt-1">Recruitment Dashboard</p>
        </div>
        
        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"}`} />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-200">
          <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900">
            <LogOut className="h-4 w-4 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {navigationItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Manage your recruitment process efficiently
              </p>
            </div>
          </div>
        </header>
        
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
