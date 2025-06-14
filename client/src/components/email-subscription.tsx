import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lock, Mail, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function EmailSubscription() {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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

  return (
    <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
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
                <Input
                  type="tel"
                  placeholder="+1234567890"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-800 placeholder-slate-500 focus:ring-2 focus:ring-slate-500 focus:border-transparent text-center"
                  disabled={whatsappSubscriptionMutation.isPending}
                />
                
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

              <p className="text-slate-500 text-sm mt-4">
                <Lock className="inline w-4 h-4 mr-1" />
                Text "unsubscribe" anytime to stop messages. Your number is only used for daily lessons.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
