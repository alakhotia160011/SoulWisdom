import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Mail, Users, Clock, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function EmailAdmin() {
  const { toast } = useToast();
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Fetch today's email template
  const { data: emailTemplate, isLoading: templateLoading } = useQuery({
    queryKey: ['/api/email-template'],
    queryFn: async () => {
      const response = await fetch('/api/email-template');
      if (!response.ok) throw new Error('Failed to fetch email template');
      return response.text();
    }
  });

  // Fetch subscriber emails
  const { data: subscribersData, isLoading: subscribersLoading } = useQuery({
    queryKey: ['/api/subscribers'],
    queryFn: async () => {
      const response = await fetch('/api/subscribers');
      if (!response.ok) throw new Error('Failed to fetch subscribers');
      return response.json();
    }
  });

  // Fetch today's lesson for preview
  const { data: todaysLesson } = useQuery({
    queryKey: ['/api/lessons/today']
  });

  const copyToClipboard = async (text: string, type: 'template' | 'emails') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'template') {
        setCopiedTemplate(true);
        setTimeout(() => setCopiedTemplate(false), 2000);
      } else {
        setCopiedEmails(true);
        setTimeout(() => setCopiedEmails(false), 2000);
      }
      toast({
        title: "Copied to clipboard!",
        description: type === 'template' ? "Email template copied" : "Email addresses copied"
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try selecting and copying manually",
        variant: "destructive"
      });
    }
  };

  const openGmail = () => {
    window.open('https://mail.google.com/mail/u/0/#inbox?compose=new', '_blank');
  };

  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Email Admin Dashboard</h1>
        <p className="text-slate-600">Manage daily spiritual lesson email distribution</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Stats Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Date</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{today}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscribersData?.count || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lesson Status</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Badge variant={todaysLesson ? "default" : "secondary"}>
              {todaysLesson ? "Ready" : "Generating..."}
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Template Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Template
            </CardTitle>
            <CardDescription>
              Copy this HTML template and paste it into Gmail's compose window
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {templateLoading ? (
              <div className="h-32 bg-slate-100 animate-pulse rounded"></div>
            ) : emailTemplate ? (
              <>
                <Textarea
                  value={emailTemplate}
                  readOnly
                  className="h-32 font-mono text-xs"
                  placeholder="Email template will appear here..."
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(emailTemplate, 'template')}
                    variant={copiedTemplate ? "default" : "outline"}
                    className="flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedTemplate ? "Copied!" : "Copy Template"}
                  </Button>
                  <Button onClick={openGmail} variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Gmail
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No email template available. Wait for today's lesson to be generated.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscriber Emails Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Subscriber Emails
            </CardTitle>
            <CardDescription>
              Copy these emails and paste them in Gmail's BCC field
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {subscribersLoading ? (
              <div className="h-32 bg-slate-100 animate-pulse rounded"></div>
            ) : subscribersData?.emails?.length > 0 ? (
              <>
                <Textarea
                  value={subscribersData.emails.join(', ')}
                  readOnly
                  className="h-32"
                  placeholder="Subscriber emails will appear here..."
                />
                <Button
                  onClick={() => copyToClipboard(subscribersData.emails.join(', '), 'emails')}
                  variant={copiedEmails ? "default" : "outline"}
                  className="w-full"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {copiedEmails ? "Copied!" : `Copy ${subscribersData.count} Emails`}
                </Button>
              </>
            ) : (
              <div className="text-center py-8 text-slate-500">
                No subscribers yet. Emails will appear here as people sign up.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions Section */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How to Send Daily Lessons via Gmail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Step 1: Copy Template</h4>
                <p className="text-sm text-slate-600">
                  Click "Copy Template" above to copy the HTML email template to your clipboard.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Step 2: Open Gmail</h4>
                <p className="text-sm text-slate-600">
                  Click "Open Gmail" or go to Gmail and create a new compose window.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Step 3: Add Recipients</h4>
                <p className="text-sm text-slate-600">
                  Copy the subscriber emails and paste them in the BCC field for privacy.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Step 4: Send</h4>
                <p className="text-sm text-slate-600">
                  Paste the template in the compose window and send your daily lesson!
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">💡 Pro Tips:</h4>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Use BCC (not CC) to protect subscriber privacy</li>
                <li>• Send at a consistent time each morning for best engagement</li>
                <li>• The system generates new lessons automatically at 6 AM</li>
                <li>• Email templates include beautiful AI-generated traditional artwork</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}