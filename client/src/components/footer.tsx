import { Link } from "wouter";
import { Scroll, Twitter, Facebook, Instagram, Youtube } from "lucide-react";

export default function Footer() {
  const handleNavigation = (href: string) => {
    // Scroll to top when navigating to new pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-stone-900 dark:bg-gray-950 text-stone-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-stone-600 to-amber-700 rounded-lg flex items-center justify-center shadow-md">
                <Scroll className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-serif font-semibold">Daily Spiritual Lessons</span>
            </div>
            <p className="text-stone-300 dark:text-gray-400 mb-6 max-w-md">
              Bringing timeless wisdom from the world's spiritual traditions to guide you through life's journey with peace and purpose.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-stone-400 hover:text-white transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Explore</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" onClick={() => handleNavigation("/")} className="text-stone-300 dark:text-gray-400 hover:text-white transition-colors">
                  Today's Lesson
                </Link>
              </li>
              <li>
                <Link href="/archive" onClick={() => handleNavigation("/archive")} className="text-stone-300 dark:text-gray-400 hover:text-white transition-colors">
                  Archive
                </Link>
              </li>
              <li>
                <Link href="/traditions" onClick={() => handleNavigation("/traditions")} className="text-stone-300 dark:text-gray-400 hover:text-white transition-colors">
                  Traditions
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={() => handleNavigation("/about")} className="text-stone-300 dark:text-gray-400 hover:text-white transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" onClick={() => handleNavigation("/faq")} className="text-stone-300 dark:text-gray-400 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" onClick={() => handleNavigation("/contact")} className="text-stone-300 dark:text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" onClick={() => handleNavigation("/privacy")} className="text-stone-300 dark:text-gray-400 hover:text-white transition-colors">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" onClick={() => handleNavigation("/terms")} className="text-stone-300 dark:text-gray-400 hover:text-white transition-colors">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-stone-800 dark:border-gray-800 mt-8 pt-8 text-center">
          <p className="text-stone-400 dark:text-gray-500">
            © 2025 Daily Spiritual Lessons. Made with reverence for all traditions.
          </p>
        </div>
      </div>
    </footer>
  );
}
