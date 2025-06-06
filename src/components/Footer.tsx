
export const Footer = () => {
  return (
    <footer className="py-16 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-6 tracking-wider">Talo</h3>
            <p className="text-gray-300 mb-8 max-w-md leading-relaxed text-lg">
              Transforming hiring with intelligent, values-driven recruitment that finds the perfect 
              cultural and skill matches for your organization through advanced AI technology.
            </p>
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-gray-800 rounded-sm flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-white font-bold">f</span>
              </div>
              <div className="w-12 h-12 bg-gray-800 rounded-sm flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-white font-bold">t</span>
              </div>
              <div className="w-12 h-12 bg-gray-800 rounded-sm flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                <span className="text-white font-bold">in</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Product</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AI Matching</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Company Profiling</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Smart Analytics</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Integrations</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold mb-6">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-lg">
            © 2024 Talo AI Recruitment Platform. All rights reserved. Transforming hiring with intelligent technology.
          </p>
        </div>
      </div>
    </footer>
  );
};
