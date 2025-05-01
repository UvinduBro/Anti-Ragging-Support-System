import { Link, useLocation } from "wouter";

interface HeaderProps {
  toggleDrawer: () => void;
}

const Header = ({ toggleDrawer }: HeaderProps) => {
  const [location] = useLocation();

  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={toggleDrawer} 
              className="mr-2 md:hidden focus:outline-none"
              aria-label="Open menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <Link href="/" className="font-medium text-lg">
              Anti-Ragging Support
            </Link>
          </div>
          <nav className="hidden md:block">
            <ul className="flex space-x-4">
              <li>
                <Link 
                  href="/" 
                  className={`hover:text-neutral-200 transition-colors duration-200 ${location === '/' ? 'font-medium' : ''}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/report" 
                  className={`hover:text-neutral-200 transition-colors duration-200 ${location === '/report' ? 'font-medium' : ''}`}
                >
                  Report
                </Link>
              </li>
              <li>
                <Link 
                  href="/incidents" 
                  className={`hover:text-neutral-200 transition-colors duration-200 ${location === '/incidents' ? 'font-medium' : ''}`}
                >
                  Incidents
                </Link>
              </li>
              <li>
                <Link 
                  href="/statistics" 
                  className={`hover:text-neutral-200 transition-colors duration-200 ${location === '/statistics' ? 'font-medium' : ''}`}
                >
                  Statistics
                </Link>
              </li>
              <li>
                <Link 
                  href="/awareness" 
                  className={`hover:text-neutral-200 transition-colors duration-200 ${location === '/awareness' ? 'font-medium' : ''}`}
                >
                  Awareness
                </Link>
              </li>
              <li>
                <Link 
                  href="/legal" 
                  className={`hover:text-neutral-200 transition-colors duration-200 ${location === '/legal' ? 'font-medium' : ''}`}
                >
                  Legal
                </Link>
              </li>

            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
