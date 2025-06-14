import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Scroll, Menu, Mail, Lock, MessageCircle } from "lucide-react";

const countryCodes = [
  { code: "+1", country: "USA", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" }
];

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [subscribeOpen, setSubscribeOpen] = useState(false);
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
      setSubscribeOpen(false);
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
      setSubscribeOpen(false);
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

    // Format phone number for WhatsApp
    let formattedNumber = phoneNumber.trim();
    if (!formattedNumber.startsWith("+")) {
      formattedNumber = "+" + formattedNumber.replace(/\D/g, "");
    }
    
    // Add whatsapp: prefix for backend
    const whatsappNumber = `whatsapp:${formattedNumber}`;
    
    whatsappSubscriptionMutation.mutate({
      phoneNumber: whatsappNumber,
    });
  };

  const navigation = [
    { name: "Today's Lesson", href: "/", active: location === "/" },
    { name: "Archive", href: "/archive", active: location.startsWith("/archive") },
    { name: "Traditions", href: "/traditions", active: location.startsWith("/traditions") },
    { name: "About", href: "/about", active: location === "/about" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-stone-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-stone-600 to-amber-700 rounded-lg flex items-center justify-center shadow-md">
              <Scroll className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-medium text-stone-800 dark:text-stone-200">
                Daily Spiritual Lessons
              </h1>
              <p className="text-xs text-stone-600 dark:text-stone-400">Wisdom for Every Day</p>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <button
                  className={`transition-colors font-medium ${
                    item.active 
                      ? "text-stone-900 dark:text-stone-100" 
                      : "text-stone-600 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200"
                  }`}
                >
                  {item.name}
                </button>
              </Link>
            ))}
            <Dialog open={subscribeOpen} onOpenChange={setSubscribeOpen}>
              <DialogTrigger asChild>
                <Button className="bg-stone-600 text-white hover:bg-stone-700 dark:bg-stone-700 dark:hover:bg-stone-600">
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-serif font-semibold text-stone-900 dark:text-stone-100 mb-2">
                      Daily Spiritual Lessons
                    </h2>
                    <p className="text-stone-600 dark:text-stone-400">
                      Receive authentic wisdom from sacred texts every morning
                    </p>
                  </div>
                  
                  <Tabs defaultValue="email" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
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
                      <form onSubmit={handleEmailSubmit} className="space-y-4">
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full"
                          required
                        />
                        <Button 
                          type="submit" 
                          disabled={emailSubscriptionMutation.isPending}
                          className="w-full bg-stone-600 hover:bg-stone-700"
                        >
                          {emailSubscriptionMutation.isPending ? (
                            "Subscribing..."
                          ) : (
                            <>
                              <Mail className="w-4 h-4 mr-2" />
                              Subscribe to Email
                            </>
                          )}
                        </Button>
                      </form>
                      
                      <p className="text-stone-500 text-sm text-center">
                        <Lock className="inline w-4 h-4 mr-1" />
                        Your email is safe with us. Unsubscribe anytime.
                      </p>
                    </TabsContent>
                    
                    <TabsContent value="whatsapp" className="space-y-4">
                      <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                        <Input
                          type="tel"
                          placeholder="+1234567890"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="w-full"
                          required
                        />
                        <Button 
                          type="submit" 
                          disabled={whatsappSubscriptionMutation.isPending}
                          className="w-full bg-stone-600 hover:bg-stone-700"
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
                      
                      <p className="text-stone-500 text-sm text-center">
                        <Lock className="inline w-4 h-4 mr-1" />
                        Text "unsubscribe" anytime to stop messages.
                      </p>
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>
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
                <Dialog open={subscribeOpen} onOpenChange={setSubscribeOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-earth-600 text-white hover:bg-earth-700 w-full mt-4">
                      <Mail className="w-4 h-4 mr-2" />
                      Subscribe
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <div className="space-y-6">
                      <div className="text-center">
                        <h2 className="text-2xl font-display font-semibold text-earth-900 mb-2">
                          Daily Spiritual Lessons
                        </h2>
                        <p className="text-earth-600">
                          Receive authentic wisdom from sacred texts every morning
                        </p>
                      </div>
                      
                      <Tabs defaultValue="email" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-4">
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
                          <form onSubmit={handleEmailSubmit} className="space-y-4">
                            <Input
                              type="email"
                              placeholder="Enter your email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full"
                              required
                            />
                            <Button 
                              type="submit" 
                              disabled={emailSubscriptionMutation.isPending}
                              className="w-full bg-earth-600 hover:bg-earth-700"
                            >
                              {emailSubscriptionMutation.isPending ? (
                                "Subscribing..."
                              ) : (
                                <>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Subscribe to Email
                                </>
                              )}
                            </Button>
                          </form>
                          
                          <p className="text-earth-500 text-sm text-center">
                            <Lock className="inline w-4 h-4 mr-1" />
                            Your email is safe with us. Unsubscribe anytime.
                          </p>
                        </TabsContent>
                        
                        <TabsContent value="whatsapp" className="space-y-4">
                          <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                            <Input
                              type="tel"
                              placeholder="+1234567890"
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              className="w-full"
                              required
                            />
                            <Button 
                              type="submit" 
                              disabled={whatsappSubscriptionMutation.isPending}
                              className="w-full bg-earth-600 hover:bg-earth-700"
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
                          
                          <p className="text-earth-500 text-sm text-center">
                            <Lock className="inline w-4 h-4 mr-1" />
                            Text "unsubscribe" anytime to stop messages.
                          </p>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
