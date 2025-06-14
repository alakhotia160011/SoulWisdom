import { useState } from "react";
import { Link } from "wouter";
import { Scroll, Twitter, Facebook, Instagram, Youtube, Mail, MessageCircle, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const countryCodes = [
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" }
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const { toast } = useToast();

  const emailSubscriptionMutation = useMutation({
    mutationFn: (email: string) => 
      apiRequest("POST", "/api/subscribe", { email, isActive: true }),
    onSuccess: () => {
      toast({
        title: "Successfully subscribed!",
        description: "You'll receive daily spiritual lessons in your inbox.",
      });
      setEmail("");
    },
    onError: (error: any) => {
      toast({
        title: "Subscription failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const whatsappSubscriptionMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string }) => {
      const response = await fetch("/api/whatsapp/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to subscribe");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "WhatsApp Subscription Successful!",
        description: "You'll receive daily spiritual lessons at 7 AM EST.",
      });
      setPhoneNumber("");
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    emailSubscriptionMutation.mutate(email);
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast({
        title: "Phone Number Required",
        description: "Please enter your WhatsApp phone number.",
        variant: "destructive",
      });
      return;
    }

    // Combine country code with phone number
    const fullPhoneNumber = `${countryCode}${phoneNumber.replace(/\D/g, "")}`;
    const whatsappNumber = `whatsapp:${fullPhoneNumber}`;
    
    whatsappSubscriptionMutation.mutate({
      phoneNumber: whatsappNumber,
    });
  };

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
      {/* Daily Wisdom Subscription Section */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-xl">
            <h2 className="text-3xl font-display font-semibold text-slate-800 mb-4">
              Daily Wisdom in Your Inbox
            </h2>
            <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
              Receive each day's spiritual lesson directly via email or WhatsApp. Join thousands finding peace and guidance through timeless wisdom.
            </p>
            
            <Tabs defaultValue="email" className="w-full max-w-2xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="whatsapp" className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="email" className="space-y-4">
                <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    required
                  />
                  <Button 
                    type="submit" 
                    disabled={emailSubscriptionMutation.isPending}
                    className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                  >
                    {emailSubscriptionMutation.isPending ? (
                      "Subscribing..."
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </Button>
                </form>
                
                <p className="text-slate-500 text-sm">
                  <Lock className="inline w-4 h-4 mr-1" />
                  Your email is safe with us. Unsubscribe anytime.
                </p>
              </TabsContent>
              
              <TabsContent value="whatsapp" className="space-y-4">
                <form onSubmit={handleWhatsAppSubmit} className="space-y-4 max-w-md mx-auto">
                  <div className="flex gap-2">
                    <Select value={countryCode} onValueChange={setCountryCode}>
                      <SelectTrigger className="w-32 px-3 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 focus:ring-2 focus:ring-slate-500 focus:border-transparent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {countryCodes.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            <span className="flex items-center gap-2">
                              <span>{country.flag}</span>
                              <span>{country.code}</span>
                              <span className="text-slate-600">{country.country}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      type="tel"
                      placeholder="1234567890"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                      disabled={whatsappSubscriptionMutation.isPending}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium"
                    disabled={whatsappSubscriptionMutation.isPending}
                  >
                    {whatsappSubscriptionMutation.isPending ? (
                      "Subscribing..."
                    ) : (
                      <>
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Subscribe to WhatsApp
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-slate-500 text-sm">
                  <Lock className="inline w-4 h-4 mr-1" />
                  Text "unsubscribe" anytime to stop messages. Your number is only used for daily lessons.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

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
