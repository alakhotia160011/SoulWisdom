import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export default function FloatingHomeButton() {
  const [location] = useLocation();
  
  // Don't show on home page
  if (location === "/") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Link href="/">
        <Button 
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-earth-600 hover:bg-earth-700 text-white border-2 border-white"
        >
          <Home className="w-5 h-5 mr-2" />
          Today's Lesson
        </Button>
      </Link>
    </div>
  );
}