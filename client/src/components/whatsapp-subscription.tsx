import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Check, AlertCircle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

interface WhatsAppSubscriptionResponse {
  message: string;
  subscriber?: {
    phoneNumber: string;
    name?: string;
  };
}

export default function WhatsAppSubscription() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: async (data: { phoneNumber: string; name?: string }) => {
      const response = await fetch("/api/whatsapp/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to subscribe");
      }
      
      return response.json() as Promise<WhatsAppSubscriptionResponse>;
    },
    onSuccess: (data) => {
      toast({
        title: "WhatsApp Subscription Successful!",
        description: "You'll receive daily spiritual lessons at 7 AM EST.",
      });
      setPhoneNumber("");
      setName("");
      queryClient.invalidateQueries({ queryKey: ["/api/whatsapp/subscribers"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Subscription Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
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
    
    subscribeMutation.mutate({
      phoneNumber: whatsappNumber,
      name: name.trim() || undefined,
    });
  };

  return (
    <section className="py-16 bg-gradient-to-r from-sage-50 to-earth-50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-sage-200">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-sage-100 rounded-full">
                  <MessageCircle className="h-8 w-8 text-sage-600" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-sage-800 mb-2">
                WhatsApp Daily Lessons
              </CardTitle>
              <CardDescription className="text-lg text-sage-600">
                Receive daily spiritual wisdom directly on WhatsApp at 7 AM EST
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4">
                  <div className="flex justify-center mb-2">
                    <Check className="h-5 w-5 text-sage-600" />
                  </div>
                  <h4 className="font-semibold text-sage-800">Daily Delivery</h4>
                  <p className="text-sm text-sage-600">Lessons at 7 AM EST</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-center mb-2">
                    <Check className="h-5 w-5 text-sage-600" />
                  </div>
                  <h4 className="font-semibold text-sage-800">7 Traditions</h4>
                  <p className="text-sm text-sage-600">Wisdom from all faiths</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-center mb-2">
                    <Check className="h-5 w-5 text-sage-600" />
                  </div>
                  <h4 className="font-semibold text-sage-800">One-Way</h4>
                  <p className="text-sm text-sage-600">Simple daily inspiration</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="tel"
                    placeholder="+1234567890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-center text-lg"
                    disabled={subscribeMutation.isPending}
                  />
                  <p className="text-xs text-sage-500 mt-1 text-center">
                    Include country code (e.g., +1 for US)
                  </p>
                </div>
                
                <div>
                  <Input
                    type="text"
                    placeholder="Your name (optional)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-center"
                    disabled={subscribeMutation.isPending}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-sage-600 hover:bg-sage-700 text-white py-3 text-lg"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? "Subscribing..." : "Subscribe to WhatsApp Lessons"}
                </Button>
              </form>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">Getting Started:</p>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Subscribe with your WhatsApp number above</li>
                      <li>Send "subscribe" to our WhatsApp number: <strong>+1 (415) 523-8886</strong></li>
                      <li>Receive daily lessons automatically at 7 AM EST</li>
                    </ol>
                  </div>
                </div>
              </div>

              <p className="text-xs text-sage-500 text-center">
                Text "unsubscribe" anytime to stop receiving messages. 
                Your phone number is only used for delivering daily lessons.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}