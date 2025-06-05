import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, Facebook, Twitter, MessageCircle, Linkedin, Instagram, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SocialShareProps {
  lesson: {
    id: number;
    title: string;
    story: string;
    lifeLesson: string;
    artworkUrl: string;
    artworkDescription: string;
    passage: {
      source: string;
      tradition: {
        name: string;
        slug: string;
      };
    };
  };
}

interface SocialCard {
  platform: string;
  title: string;
  description: string;
  hashtags: string[];
  icon: React.ReactNode;
  color: string;
  url: string;
  copyText: string;
}

export default function SocialShare({ lesson }: SocialShareProps) {
  const { toast } = useToast();
  const [copiedPlatform, setCopiedPlatform] = useState<string | null>(null);

  const lessonUrl = `${window.location.origin}/lesson/${lesson.id}`;
  const shortLesson = (lesson.lifeLesson || '').length > 100 
    ? (lesson.lifeLesson || '').substring(0, 100) + "..." 
    : (lesson.lifeLesson || '');

  const socialCards: SocialCard[] = [
    {
      platform: "Twitter",
      title: `🙏 ${lesson.title}`,
      description: `"${shortLesson}"\n\nFrom ${lesson.passage?.source || 'Sacred Text'} (${lesson.passage?.tradition?.name || 'Sacred Tradition'})`,
      hashtags: ["#SpiritualWisdom", "#DailyInspiration", "#Faith", "#Wisdom", `#${(lesson.passage?.tradition?.slug || 'wisdom').replace("-", "")}`],
      icon: <Twitter className="w-4 h-4" />,
      color: "bg-blue-500",
      url: "",
      copyText: ""
    },
    {
      platform: "Facebook",
      title: `Daily Spiritual Lesson: ${lesson.title}`,
      description: `${shortLesson}\n\nDiscover timeless wisdom from ${lesson.passage?.tradition?.name || 'ancient'} scriptures. Read the full lesson and explore beautiful traditional artwork.`,
      hashtags: ["#SpiritualLessons", "#DailyInspiration", "#Faith", "#Wisdom"],
      icon: <Facebook className="w-4 h-4" />,
      color: "bg-blue-600",
      url: "",
      copyText: ""
    },
    {
      platform: "LinkedIn",
      title: `Professional Reflection: ${lesson.title}`,
      description: `Ancient wisdom for modern life: "${shortLesson}"\n\nThis teaching from ${lesson.passage?.tradition?.name || 'ancient'} tradition offers valuable insights for personal and professional growth.`,
      hashtags: ["#Leadership", "#PersonalDevelopment", "#Wisdom", "#Mindfulness"],
      icon: <Linkedin className="w-4 h-4" />,
      color: "bg-blue-700",
      url: "",
      copyText: ""
    },
    {
      platform: "Instagram",
      title: `✨ ${lesson.title} ✨`,
      description: `${shortLesson}\n\n${lesson.passage?.source || 'Sacred Text'}`,
      hashtags: ["#SpiritualWisdom", "#DailyInspiration", "#Faith", "#Mindfulness", "#Wisdom", "#Peace", "#Reflection", "#SacredText"],
      icon: <Instagram className="w-4 h-4" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      url: "",
      copyText: ""
    },
    {
      platform: "WhatsApp",
      title: `🙏 Daily Spiritual Lesson`,
      description: `*${lesson.title}*\n\n"${shortLesson}"\n\n_From ${lesson.passage.source}_`,
      hashtags: [],
      icon: <MessageCircle className="w-4 h-4" />,
      color: "bg-green-500",
      url: "",
      copyText: ""
    }
  ];

  // Generate platform-specific URLs and copy text
  socialCards.forEach(card => {
    const hashtags = card.hashtags.join(" ");
    
    switch (card.platform) {
      case "Twitter":
        const twitterText = `${card.title}\n\n${card.description}\n\n${hashtags}\n\n${lessonUrl}`;
        card.url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}`;
        card.copyText = twitterText;
        break;
        
      case "Facebook":
        card.url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(lessonUrl)}&quote=${encodeURIComponent(`${card.title}\n\n${card.description}\n\n${hashtags}`)}`;
        card.copyText = `${card.title}\n\n${card.description}\n\n${hashtags}\n\n${lessonUrl}`;
        break;
        
      case "LinkedIn":
        card.url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(lessonUrl)}&title=${encodeURIComponent(card.title)}&summary=${encodeURIComponent(card.description)}`;
        card.copyText = `${card.title}\n\n${card.description}\n\n${hashtags}\n\n${lessonUrl}`;
        break;
        
      case "Instagram":
        card.copyText = `${card.title}\n\n${card.description}\n\n${hashtags.replace(/#/g, '#')}\n\nLink in bio: ${lessonUrl}`;
        card.url = "";
        break;
        
      case "WhatsApp":
        const whatsappText = `${card.description}\n\nRead more: ${lessonUrl}`;
        card.url = `https://wa.me/?text=${encodeURIComponent(whatsappText)}`;
        card.copyText = whatsappText;
        break;
    }
  });

  const copyToClipboard = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedPlatform(platform);
      setTimeout(() => setCopiedPlatform(null), 2000);
      toast({
        title: "Copied to clipboard!",
        description: `${platform} post text copied successfully`
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please try selecting and copying manually",
        variant: "destructive"
      });
    }
  };

  const openShare = (url: string, platform: string) => {
    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const generateSocialMediaCard = async (platform: string) => {
    try {
      toast({
        title: "Generating social media card...",
        description: `Creating ${platform} card with AI artwork`
      });

      const response = await fetch('/api/generate-social-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: lesson.id,
          title: lesson.title,
          lifeLesson: lesson.lifeLesson,
          source: lesson.passage.source,
          tradition: lesson.passage.tradition.name,
          artworkUrl: lesson.artworkUrl,
          platform: platform
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate social media card');
      }

      const cardData = await response.json();
      
      // Download the generated card
      const link = document.createElement('a');
      link.href = cardData.url;
      link.download = `${lesson.title}-${platform}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Social media card generated!",
        description: `${platform} card with AI artwork downloaded successfully`
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Could not generate social media card",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Share2 className="w-5 h-5 text-slate-600" />
        <h3 className="text-lg font-semibold text-slate-900">Share This Lesson</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {socialCards.map((card) => (
          <Dialog key={card.platform}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className={`h-auto flex-col gap-2 p-4 hover:scale-105 transition-transform ${card.color} text-white border-0`}
              >
                {card.icon}
                <span className="text-xs font-medium">{card.platform}</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {card.icon}
                  Share on {card.platform}
                </DialogTitle>
                <DialogDescription>
                  Copy the text below or use the direct share button
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="font-medium mb-2">{card.title}</div>
                      <div className="text-sm text-slate-600 whitespace-pre-line mb-2">
                        {card.description}
                      </div>
                      {card.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {card.hashtags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {card.platform !== "Instagram" && (
                        <div className="text-xs text-blue-600 mt-2">{lessonUrl}</div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Textarea
                  value={card.copyText}
                  readOnly
                  className="h-32 font-mono text-sm"
                />

                <div className="flex gap-2">
                  <Button
                    onClick={() => copyToClipboard(card.copyText, card.platform)}
                    variant={copiedPlatform === card.platform ? "default" : "outline"}
                    className="flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    {copiedPlatform === card.platform ? "Copied!" : "Copy Text"}
                  </Button>
                  
                  {card.url && (
                    <Button
                      onClick={() => openShare(card.url, card.platform)}
                      className={`flex-1 ${card.color}`}
                    >
                      {card.icon}
                      <span className="ml-2">Share</span>
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => generateSocialMediaCard(card.platform)}
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Card
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="text-sm text-blue-800">
          <strong>💡 Sharing Tips:</strong>
          <ul className="mt-1 space-y-1 text-xs">
            <li>• Use the "Copy Text" button for easy posting</li>
            <li>• Download cards for visual posts on Instagram/Facebook</li>
            <li>• Hashtags are optimized for each platform's audience</li>
            <li>• WhatsApp is perfect for sharing with family and friends</li>
          </ul>
        </div>
      </div>
    </div>
  );
}