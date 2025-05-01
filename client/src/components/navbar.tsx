import { useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, Menu, X, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { signOut } from "@/lib/firebase";
import { useMobile } from "@/hooks/use-mobile";

interface NavbarProps {
  isAdmin: boolean;
  onAdminLogin: () => void;
}

export function Navbar({ isAdmin, onAdminLogin }: NavbarProps) {
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin dashboard.",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const NavItems = () => (
    <>
      <Link href="/">
        <a
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location === "/"
              ? "text-white dark:text-white font-medium"
              : "text-primary-100 dark:text-zinc-300 hover:text-white dark:hover:text-white"
          } transition-colors`}
        >
          Home
        </a>
      </Link>
      <Link href="/report">
        <a
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location === "/report"
              ? "text-white dark:text-white font-medium"
              : "text-primary-100 dark:text-zinc-300 hover:text-white dark:hover:text-white"
          } transition-colors`}
        >
          Report Incident
        </a>
      </Link>
      <Link href="/awareness">
        <a
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location === "/awareness"
              ? "text-white dark:text-white font-medium"
              : "text-primary-100 dark:text-zinc-300 hover:text-white dark:hover:text-white"
          } transition-colors`}
        >
          Awareness
        </a>
      </Link>
      <Link href="/resources">
        <a
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location === "/resources"
              ? "text-white dark:text-white font-medium"
              : "text-primary-100 dark:text-zinc-300 hover:text-white dark:hover:text-white"
          } transition-colors`}
        >
          Resources
        </a>
      </Link>
      <Link href="/statistics">
        <a
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location === "/statistics"
              ? "text-white dark:text-white font-medium"
              : "text-primary-100 dark:text-zinc-300 hover:text-white dark:hover:text-white"
          } transition-colors`}
        >
          Statistics
        </a>
      </Link>

      {isAdmin ? (
        <>
          <Link href="/admin/dashboard">
            <Button
              variant="secondary"
              className="ml-4"
            >
              Admin Dashboard
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="ml-2 bg-primary-dark text-white hover:bg-primary-light"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </>
      ) : (
        <Button
          variant="secondary"
          className="ml-4"
          onClick={onAdminLogin}
        >
          Admin Login
        </Button>
      )}
    </>
  );

  return (
    <nav className="bg-primary shadow-md dark:bg-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="flex-shrink-0 text-white flex items-center">
                <Shield className="h-6 w-6 text-white mr-2" />
                <span className="font-semibold text-lg md:text-xl">
                  Campus Safety Portal
                </span>
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavItems />
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <Button
              variant="ghost"
              className="text-white hover:text-neutral-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary-dark dark:bg-zinc-800">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link href="/">
              <a
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/"
                    ? "bg-primary-light text-white"
                    : "text-neutral-100 hover:bg-primary-light"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </a>
            </Link>
            <Link href="/report">
              <a
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/report"
                    ? "bg-primary-light text-white"
                    : "text-neutral-100 hover:bg-primary-light"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Report Incident
              </a>
            </Link>
            <Link href="/awareness">
              <a
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/awareness"
                    ? "bg-primary-light text-white"
                    : "text-neutral-100 hover:bg-primary-light"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Awareness
              </a>
            </Link>
            <Link href="/resources">
              <a
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/resources"
                    ? "bg-primary-light text-white"
                    : "text-neutral-100 hover:bg-primary-light"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Resources
              </a>
            </Link>
            <Link href="/statistics">
              <a
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location === "/statistics"
                    ? "bg-primary-light text-white"
                    : "text-neutral-100 hover:bg-primary-light"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Statistics
              </a>
            </Link>
            {isAdmin ? (
              <>
                <Link href="/admin/dashboard">
                  <a
                    className="mt-2 w-full block px-4 py-2 rounded-md text-sm font-medium bg-white text-primary hover:bg-neutral-100 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </a>
                </Link>
                <button
                  className="mt-2 w-full px-4 py-2 rounded-md text-sm font-medium bg-primary-dark text-white hover:bg-primary-light transition-colors border border-white"
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="mt-2 w-full px-4 py-2 rounded-md text-sm font-medium bg-white text-primary hover:bg-neutral-100 transition-colors"
                onClick={() => {
                  onAdminLogin();
                  setIsMenuOpen(false);
                }}
              >
                Admin Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
