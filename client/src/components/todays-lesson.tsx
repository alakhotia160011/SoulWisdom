import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BookOpen, Lightbulb, Share, Heart, Bookmark } from "lucide-react";
import { Link } from "wouter";
import type { LessonWithDetails } from "@shared/schema";

export default function TodaysLesson() {
  const { data: lesson, isLoading, error } = useQuery<LessonWithDetails>({
    queryKey: ["/api/lessons/today"],
  });

  const formatDate = (date: string) => {
    // Format date in user's local timezone
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
    });
  };

  const getTraditionColor = (color: string) => {
    const colorMap = {
      blue: "bg-blue-800 text-white",
      green: "bg-green-800 text-white",
      orange: "bg-orange-800 text-white",
      purple: "bg-purple-800 text-white",
      gray: "bg-gray-800 text-white",
      yellow: "bg-yellow-800 text-white",
      indigo: "bg-indigo-800 text-white"
    };
    return colorMap[color as keyof typeof colorMap] || "bg-sage-800 text-white";
  };

  const getTraditionBackgroundColor = (color: string) => {
    const colorMap = {
      blue: "bg-blue-800",
      green: "bg-green-800",
      orange: "bg-orange-800",
      purple: "bg-purple-800",
      gray: "bg-gray-800",
      yellow: "bg-yellow-800",
      indigo: "bg-indigo-800"
    };
    return colorMap[color as keyof typeof colorMap] || "bg-sage-800";
  };

  const getIconSymbol = (slug: string) => {
    const symbolMap = {
      'bible': '†',
      'quran': '☪',
      'bhagavad-gita': 'ॐ',
      'dhammapada': '❋',
      'tao-te-ching': '☯',
      'upanishads': '◉',
      'talmud': '✡'
    };
    return symbolMap[slug as keyof typeof symbolMap] || '◉';
  };

  if (isLoading) {
    return (
      <section id="today" className="py-12 bg-gradient-to-b from-white to-earth-50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-4 mb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-1 w-1 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="h-12 w-96 mx-auto mb-6" />
            <Skeleton className="h-6 w-48 mx-auto mb-8" />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl mb-12" />
          <Card>
            <CardContent className="p-8">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (error || !lesson) {
    return (
      <section id="today" className="py-12 bg-gradient-to-b from-white to-earth-50">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-earth-900 mb-2">
                No Lesson Available Today
              </h2>
              <p className="text-earth-600 mb-4">
                We're working on generating today's spiritual lesson. Please check back soon.
              </p>
              <Link href="/archive">
                <Button>Browse Archive</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="today" className="py-12 bg-gradient-to-b from-white to-earth-50">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Date and Tradition Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 mb-4">
            <span className="text-earth-600 font-medium">
              {formatDate(lesson.date.toString())}
            </span>
            <span className="w-1 h-1 bg-earth-400 rounded-full"></span>
            <div className="flex items-center space-x-2">
              <div className={`w-8 h-8 ${getTraditionBackgroundColor(lesson.passage.tradition.color)} rounded-lg flex items-center justify-center shadow-lg border`}>
                <span className="text-white text-lg font-bold drop-shadow-md" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
                  {getIconSymbol(lesson.passage.tradition.slug)}
                </span>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTraditionColor(lesson.passage.tradition.color)}`}>
                {lesson.passage.tradition.name}
              </span>
            </div>
          </div>
          
          {/* Title */}
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-earth-900 mb-6 leading-tight">
            {lesson.title}
          </h2>
          
          {/* Source Citation */}
          <p className="text-earth-700 font-scripture text-lg mb-8">
            <BookOpen className="inline w-5 h-5 mr-2 text-gold-500" />
            {lesson.passage.source}
          </p>
        </div>

        {/* Featured Artwork */}
        <div className="mb-12">
          {lesson.artworkUrl ? (
            <div className="relative">
              <img 
                src={lesson.artworkUrl} 
                alt={lesson.artworkDescription}
                className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
                onError={(e) => {
                  console.log('Image failed to load:', lesson.artworkUrl);
                  e.currentTarget.style.display = 'none';
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div 
                className="hidden w-full h-64 md:h-80 bg-gradient-to-br from-earth-100 to-sage-100 rounded-2xl shadow-xl flex items-center justify-center"
                style={{ display: 'none' }}
              >
                <div className="text-center text-earth-600">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Spiritual Artwork</p>
                  <p className="text-sm">Loading traditional manuscript illustration...</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-64 md:h-80 bg-gradient-to-br from-earth-100 to-sage-100 rounded-2xl shadow-xl flex items-center justify-center">
              <div className="text-center text-earth-600">
                <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Spiritual Artwork</p>
                <p className="text-sm">Generating traditional manuscript illustration...</p>
              </div>
            </div>
          )}
          <p className="text-sm text-earth-600 mt-3 text-center italic">
            {lesson.artworkDescription}
          </p>
        </div>

        {/* The Story Section */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h3 className="flex items-center text-2xl font-display font-semibold text-earth-900 mb-6">
              <BookOpen className="mr-3 text-gold-500" />
              The Story
            </h3>
            
            <div className="text-earth-800 leading-relaxed space-y-4">
              {lesson.story.split('\n').filter(p => p.trim()).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Life Lesson Section */}
        <Card className="mb-8 bg-gradient-to-r from-gold-50 to-earth-50 border-gold-200">
          <CardContent className="p-8">
            <h3 className="flex items-center text-xl font-display font-semibold text-earth-900 mb-4">
              <Lightbulb className="mr-3 text-gold-600" />
              Life Lesson
            </h3>
            <blockquote className="text-lg text-earth-800 font-medium italic leading-relaxed">
              "{lesson.lifeLesson}"
            </blockquote>
          </CardContent>
        </Card>

        {/* Share Section */}
        <div className="text-center">
          <div className="flex justify-center space-x-4 mb-4">
            <Button 
              variant="outline" 
              className="bg-white border-earth-200 text-earth-700 hover:bg-earth-50"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline"
              className="bg-white border-earth-200 text-earth-700 hover:bg-earth-50"
            >
              <Heart className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button 
              variant="outline"
              className="bg-white border-earth-200 text-earth-700 hover:bg-earth-50"
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Bookmark
            </Button>
          </div>
          
          <Link href={`/lesson/${lesson.id}`}>
            <Button variant="link" className="text-earth-600 hover:text-earth-800">
              View Full Lesson →
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
