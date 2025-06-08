import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Lock, Mail } from "lucide-react";

export default function EmailSubscription() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscriptionMutation = useMutation({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }
    subscriptionMutation.mutate(email);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 border border-slate-200 shadow-xl">
          <h2 className="text-3xl font-display font-semibold text-slate-800 mb-4">
            Daily Wisdom in Your Inbox
          </h2>
          <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
            Receive each day's spiritual lesson directly in your email. Join thousands finding peace and guidance through timeless wisdom.
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
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
              disabled={subscriptionMutation.isPending}
              className="bg-slate-800 text-white px-6 py-3 rounded-lg hover:bg-slate-700 transition-colors font-medium"
            >
              {subscriptionMutation.isPending ? (
                "Subscribing..."
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Subscribe
                </>
              )}
            </Button>
          </form>
          
          <p className="text-slate-500 text-sm mt-4">
            <Lock className="inline w-4 h-4 mr-1" />
            Your email is safe with us. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
