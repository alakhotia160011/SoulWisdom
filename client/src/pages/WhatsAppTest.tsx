import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Smartphone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function WhatsAppTest() {
  const [message, setMessage] = useState("");
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const sendTestMessage = async () => {
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/whatsapp/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });
      
      const data = await res.json();
      
      if (data.success) {
        toast({
          title: "WhatsApp Message Sent",
          description: "Test message sent successfully to +16176420146",
        });
        setMessage("");
      } else {
        toast({
          title: "Failed to Send",
          description: data.message || "Could not send WhatsApp message",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send WhatsApp message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const testCommand = async () => {
    if (!command.trim()) return;
    
    setIsLoading(true);
    try {
      const res = await fetch("/api/whatsapp/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command })
      });
      
      const data = await res.json();
      setResponse(data.response || "No response received");
      
      toast({
        title: "Command Processed",
        description: "WhatsApp command processed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process WhatsApp command",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const quickCommands = [
    { label: "Today's Lesson", value: "today" },
    { label: "Yesterday's Lesson", value: "yesterday" },
    { label: "Bible Lesson", value: "bible" },
    { label: "Quran Lesson", value: "quran" },
    { label: "Spiritual Question", value: "How can I find inner peace?" },
    { label: "Help", value: "help" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
          <Smartphone className="h-8 w-8 text-green-600" />
          WhatsApp Integration Test
        </h1>
        <p className="text-muted-foreground">
          Test WhatsApp messaging functionality for spiritual lessons
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Send Test Message */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Test Message
            </CardTitle>
            <CardDescription>
              Send a WhatsApp message to +16176420146
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Enter your test message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
            <Button 
              onClick={sendTestMessage} 
              disabled={isLoading || !message.trim()}
              className="w-full"
            >
              {isLoading ? "Sending..." : "Send WhatsApp Message"}
            </Button>
          </CardContent>
        </Card>

        {/* Test Commands */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Test Commands
            </CardTitle>
            <CardDescription>
              Test WhatsApp command processing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Enter command (e.g., 'today', 'help')..."
              value={command}
              onChange={(e) => setCommand(e.target.value)}
            />
            <Button 
              onClick={testCommand} 
              disabled={isLoading || !command.trim()}
              className="w-full"
              variant="outline"
            >
              {isLoading ? "Processing..." : "Test Command"}
            </Button>
            
            {response && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Response:</h4>
                <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">
                  {response}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Commands */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Test Commands</CardTitle>
          <CardDescription>
            Click to quickly test common WhatsApp commands
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {quickCommands.map((cmd, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setCommand(cmd.value);
                  testCommand();
                }}
                disabled={isLoading}
                className="text-left justify-start"
              >
                {cmd.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Integration Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Integration Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>WhatsApp Number:</span>
              <span className="font-mono">+16176420146</span>
            </div>
            <div className="flex justify-between">
              <span>Daily Lessons:</span>
              <span>7:00 AM EST</span>
            </div>
            <div className="flex justify-between">
              <span>Commands Supported:</span>
              <span>today, yesterday, traditions, questions</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}