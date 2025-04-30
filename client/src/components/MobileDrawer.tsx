import { Link } from "wouter";

interface MobileDrawerProps {
  isOpen: boolean;
  closeDrawer: () => void;
}

const MobileDrawer = ({ isOpen, closeDrawer }: MobileDrawerProps) => {
  return (
    <div className={`drawer fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 ${isOpen ? 'open' : ''}`}>
      <div className="p-4 bg-primary text-white flex items-center justify-between">
        <h2 className="font-medium">Menu</h2>
        <button 
          onClick={closeDrawer} 
          className="focus:outline-none"
          aria-label="Close menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <Link 
              href="/" 
              onClick={closeDrawer}
              className="block py-2 hover:bg-neutral-100 transition-colors duration-200"
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/report" 
              onClick={closeDrawer}
              className="block py-2 hover:bg-neutral-100 transition-colors duration-200"
            >
              Report Incident
            </Link>
          </li>
          <li>
            <Link 
              href="/incidents" 
              onClick={closeDrawer}
              className="block py-2 hover:bg-neutral-100 transition-colors duration-200"
            >
              Incidents
            </Link>
          </li>
          <li>
            <Link 
              href="/statistics" 
              onClick={closeDrawer}
              className="block py-2 hover:bg-neutral-100 transition-colors duration-200"
            >
              Statistics
            </Link>
          </li>
          <li>
            <Link 
              href="/awareness" 
              onClick={closeDrawer}
              className="block py-2 hover:bg-neutral-100 transition-colors duration-200"
            >
              Awareness
            </Link>
          </li>
          <li>
            <Link 
              href="/legal" 
              onClick={closeDrawer}
              className="block py-2 hover:bg-neutral-100 transition-colors duration-200"
            >
              Legal Resources
            </Link>
          </li>
          <li>
            <Link 
              href="/admin" 
              onClick={closeDrawer}
              className="block py-2 hover:bg-neutral-100 transition-colors duration-200"
            >
              Admin
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default MobileDrawer;
