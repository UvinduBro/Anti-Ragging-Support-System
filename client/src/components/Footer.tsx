import { Link } from "wouter";

const Footer = () => {
  return (
    <footer className="bg-neutral-400 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3">Anti-Ragging Support</h3>
            <p className="text-sm">A safe and anonymous platform for reporting and addressing ragging incidents within the university.</p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Emergency Contacts</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                Anti-Ragging Helpline: 1800-180-5522
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                University Helpline: +91-9876543210
              </li>
              <li className="flex items-center">
                <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                support@university.edu
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/report" className="hover:underline">Report Incident</Link></li>
              <li><Link href="/awareness" className="hover:underline">Awareness Resources</Link></li>
              <li><Link href="/legal" className="hover:underline">Legal Information</Link></li>
              <li><a href="https://www.ugc.ac.in/page/Ragging-Related-Circulars.aspx" target="_blank" rel="noopener noreferrer" className="hover:underline">UGC Anti-Ragging Portal</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white border-opacity-20 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} University Anti-Ragging Support System. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
