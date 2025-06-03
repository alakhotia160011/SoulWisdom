import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Scroll, Menu, Mail } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    { name: "Today's Lesson", href: "/", active: location === "/" },
    { name: "Archive", href: "/archive", active: location.startsWith("/archive") },
    { name: "Traditions", href: "/#traditions", active: false },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-earth-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-earth-500 to-sage-600 rounded-lg flex items-center justify-center">
              <Scroll className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-semibold text-earth-800">
                Daily Spiritual Lessons
              </h1>
              <p className="text-sm text-earth-600">Wisdom for Every Day</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.href.startsWith("#") ? (
                  <button
                    onClick={() => scrollToSection(item.href)}
                    className={`transition-colors font-medium ${
                      item.active 
                        ? "text-earth-900" 
                        : "text-earth-600 hover:text-earth-800"
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`transition-colors font-medium ${
                      item.active 
                        ? "text-earth-900" 
                        : "text-earth-600 hover:text-earth-800"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <Button className="bg-earth-600 text-white hover:bg-earth-700">
              <Mail className="w-4 h-4 mr-2" />
              Subscribe
            </Button>
          </nav>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden text-earth-700">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-6">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.href.startsWith("#") ? (
                      <button
                        onClick={() => {
                          scrollToSection(item.href);
                          setIsOpen(false);
                        }}
                        className="text-earth-700 hover:text-earth-900 py-2 block w-full text-left"
                      >
                        {item.name}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="text-earth-700 hover:text-earth-900 py-2 block"
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <Button className="bg-earth-600 text-white hover:bg-earth-700 w-full mt-4">
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
