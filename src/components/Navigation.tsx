"use client";

import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const Navigation = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isAuthenticated = status === "authenticated";

  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-nav backdrop-blur-sm bg-white/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold bg-nav-gradient text-transparent bg-clip-text">
                PurCert
              </span>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
              <a
                href="/"
                className={`nav-link ${
                  pathname === "/" ? "nav-link-active" : "nav-link-inactive"
                }`}
              >
                Dashboard
              </a>
            </div>
          </div>

          {/* Right side menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === "loading" ? (
              <div className="flex items-center space-x-2 px-4 py-2">
                <div className="animate-pulse bg-primary-100 h-8 w-24 rounded-full"></div>
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 px-4 py-2 rounded-full bg-primary-50">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <UserCircleIcon className="h-5 w-5 text-primary-500" />
                  )}
                  <span className="text-sm font-medium text-primary-700">
                    {session?.user?.name}
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className={`nav-button btn-secondary ${
                    isLoading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? "Signing out..." : "Sign out"}
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className={`nav-button bg-nav-gradient text-white hover:opacity-90 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-secondary-400 hover:text-secondary-500 hover:bg-secondary-50 transition-colors duration-200"
              aria-label="toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" />
              ) : (
                <Bars3Icon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isMobileMenuOpen ? "animate-fade-in" : "hidden"
        } sm:hidden bg-white/95 backdrop-blur-sm`}
        data-testid="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          <a
            href="/"
            className={`block px-4 py-2 text-base font-medium transition-colors duration-200 ${
              pathname === "/"
                ? "text-primary-500 bg-primary-50"
                : "text-secondary-600 hover:text-primary-500 hover:bg-primary-50"
            }`}
          >
            Dashboard
          </a>
        </div>
        <div className="pt-4 pb-3 border-t border-secondary-200">
          {status === "loading" ? (
            <div className="px-4 py-2">
              <div className="animate-pulse bg-primary-100 h-8 w-full rounded-md"></div>
            </div>
          ) : isAuthenticated ? (
            <div className="space-y-1 px-4">
              <div className="flex items-center space-x-2 py-2">
                {session?.user?.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <UserCircleIcon className="h-5 w-5 text-primary-500" />
                )}
                <p className="text-sm font-medium text-secondary-700">
                  {session?.user?.name}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className={`block w-full text-left px-4 py-2 text-sm text-secondary-600 hover:text-primary-500 hover:bg-primary-50 rounded-md transition-colors duration-200 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing out..." : "Sign out"}
              </button>
            </div>
          ) : (
            <div className="px-4 py-2">
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className={`w-full nav-button bg-nav-gradient text-white hover:opacity-90 ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
