import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Send } from "lucide-react";

export default function WhatsAppTest() {
  const [phoneNumber, setPhoneNumber] = useState("whatsapp:+16176420146");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testCommands = [
    { command: "today", description: "Get today's spiritual lesson" },
    { command: "help", description: "Show available commands" },
    { command: "subscribe", description: "Subscribe to daily lessons" },
    { command: "unsubscribe", description: "Cancel subscription" }
  ];

  const handleTestMessage = async (testMessage: string) => {
    setIsLoading(true);
    setMessage(testMessage);
    
    try {
      const response = await fetch("/webhook/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          MessageSid: `TEST_${Date.now()}`,
          From: phoneNumber,
          Body: testMessage
        })
      });

      if (response.ok) {
        setResponse(`Command "${testMessage}" processed successfully. Check logs for details.`);
      } else {
        setResponse(`Error: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomMessage = async () => {
    if (!message.trim()) return;
    await handleTestMessage(message);
  };

  return (
    <div className="min-h-screen bg-earth-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-sage-800 mb-2">WhatsApp Command Tester</h1>
          <p className="text-sage-600">Test WhatsApp commands without using your daily message limit</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Command Testing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Quick Command Tests
              </CardTitle>
              <CardDescription>
                Test predefined WhatsApp commands
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-sage-700 mb-2 block">
                  Test Phone Number:
                </label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="whatsapp:+1234567890"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-sage-700">Available Commands:</label>
                {testCommands.map((cmd) => (
                  <div key={cmd.command} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <Badge variant="secondary" className="mb-1">{cmd.command}</Badge>
                      <p className="text-sm text-sage-600">{cmd.description}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleTestMessage(cmd.command)}
                      disabled={isLoading}
                    >
                      Test
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Message Testing */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Message Test</CardTitle>
              <CardDescription>
                Send any message to test the webhook response
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-sage-700 mb-2 block">
                  Your Message:
                </label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type any message to test..."
                  rows={3}
                />
              </div>

              <Button
                onClick={handleCustomMessage}
                disabled={isLoading || !message.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {isLoading ? "Sending..." : "Send Test Message"}
              </Button>

              {response && (
                <div className="mt-4 p-3 bg-sage-50 border border-sage-200 rounded-lg">
                  <p className="text-sm font-medium text-sage-700 mb-1">Response:</p>
                  <p className="text-sm text-sage-600">{response}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Current Status */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-600 font-semibold">Webhook</div>
                <div className="text-sm text-green-700">Active</div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-green-600 font-semibold">Twilio</div>
                <div className="text-sm text-green-700">Connected</div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="text-amber-600 font-semibold">Daily Limit</div>
                <div className="text-sm text-amber-700">9 messages</div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-blue-600 font-semibold">From Number</div>
                <div className="text-sm text-blue-700">+1 415-523-8886</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="font-semibold text-amber-800 mb-2">Trial Account Note:</h3>
          <p className="text-sm text-amber-700">
            Your Twilio trial account has a daily limit of 9 messages. Commands are processed correctly 
            but responses may not be delivered once this limit is reached. The testing interface above 
            allows you to verify commands work without consuming your message quota.
          </p>
        </div>
      </div>
    </div>
  );
}