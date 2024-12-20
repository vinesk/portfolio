import React from "react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileLink } from "@/components/ui/mobile-link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Moon, Sun, Menu } from "lucide-react";
import { SheetTitle, SheetDescription } from "@/components/ui/sheet";

// Constantes pour les valeurs répétées
const SMALL_SCREEN_BREAKPOINT = 1024;
const HEADER_OFFSET = 40;

// Hook personnalisé pour la détection de la taille de l'écran
function useSmallScreen(breakpoint: number) {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < breakpoint);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [breakpoint]);

  return isSmallScreen;
}

// Typage des props pour NavItems
interface NavItemsProps {
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

// Composant de navigation extrait
const NavItems: React.FC<NavItemsProps> = ({
  activeSection,
  scrollToSection,
}) => {
  const navItems = [
    { name: "À propos", id: "about" },
    { name: "Compétences", id: "skills" },
    { name: "Projets", id: "projects" },
    { name: "Expériences", id: "experiences" },
    { name: "Formations", id: "educations" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <>
      {navItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={`text-lg ${activeSection === item.id ? "font-bold" : ""}`}
          onClick={() => scrollToSection(item.id)}
        >
          {item.name}
        </Button>
      ))}
    </>
  );
};

// Typage des props pour Header
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const { theme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState("about");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isSmallScreen = useSmallScreen(SMALL_SCREEN_BREAKPOINT);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const headerHeight = document.querySelector("header")?.offsetHeight || 0;
      const sectionPosition =
        section.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: sectionPosition - headerHeight - HEADER_OFFSET,
        behavior: "smooth",
      });
    }
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center">
          <span className="font-bold text-xl mr-4">VE</span>
          {!isSmallScreen && (
            <nav className="flex items-center space-x-2 text-sm font-medium">
              <NavItems
                activeSection={activeSection}
                scrollToSection={scrollToSection}
              />
            </nav>
          )}
        </div>
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Changer le thème"
            className="mr-2"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          {isSmallScreen && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                  onClick={() => setMobileMenuOpen(true)}
                  aria-label="Ouvrir le menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pl-0">
                <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Liste des sections du site
                </SheetDescription>
                <div className="flex flex-col space-y-1 items-start px-4">
                  <NavItems
                    activeSection={activeSection}
                    scrollToSection={scrollToSection}
                  />
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
