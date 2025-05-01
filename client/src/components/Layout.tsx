import { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import MobileDrawer from "./MobileDrawer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header toggleDrawer={toggleDrawer} />
      <MobileDrawer isOpen={isDrawerOpen} closeDrawer={closeDrawer} />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
