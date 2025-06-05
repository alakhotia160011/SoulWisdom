import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import SocialShare from "@/components/social-share";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BookOpen, Lightbulb, Share, Heart, Bookmark } from "lucide-react";
import type { LessonWithDetails } from "@shared/schema";

export default function Lesson() {
  const { id } = useParams();
  
  // If no ID provided or ID is "today", fetch today's lesson
  const endpoint = !id || id === "today" ? "/api/lessons/today" : `/api/lessons/${id}`;
  
  const { data: lesson, isLoading, error } = useQuery<LessonWithDetails>({
    queryKey: [endpoint],
    enabled: true,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <Skeleton className="h-8 w-32 mx-auto" />
              <Skeleton className="h-12 w-96 mx-auto" />
              <Skeleton className="h-6 w-48 mx-auto" />
            </div>
            <Skeleton className="h-80 w-full rounded-2xl" />
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-earth-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Card>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-earth-900 mb-2">Lesson Not Found</h1>
              <p className="text-earth-600 mb-4">
                The lesson you're looking for doesn't exist or couldn't be loaded.
              </p>
              <Button onClick={() => window.history.back()}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTraditionColor = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100 text-blue-800",
      green: "bg-green-100 text-green-800",
      orange: "bg-orange-100 text-orange-800",
      purple: "bg-purple-100 text-purple-800",
      gray: "bg-gray-100 text-gray-800",
      yellow: "bg-yellow-100 text-yellow-800",
      indigo: "bg-indigo-100 text-indigo-800"
    };
    return colorMap[color as keyof typeof colorMap] || "bg-earth-100 text-earth-800";
  };

  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      
      <section className="py-12 bg-gradient-to-b from-white to-earth-50">
        <div className="max-w-4xl mx-auto px-4">
          
          {/* Date and Tradition Badge */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-4 mb-4">
              <span className="text-earth-600 font-medium">
                {lesson.date ? formatDate(lesson.date.toString()) : formatDate(new Date().toString())}
              </span>
              <span className="w-1 h-1 bg-earth-400 rounded-full"></span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTraditionColor(lesson.passage?.tradition?.color || 'gray')}`}>
                {lesson.passage?.tradition?.name || 'Sacred Teaching'}
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-earth-900 mb-6 leading-tight">
              {lesson.title}
            </h1>
            
            {/* Source Citation */}
            <p className="text-earth-700 font-scripture text-lg mb-8">
              <BookOpen className="inline w-5 h-5 mr-2 text-gold-500" />
              {lesson.passage?.source || 'Sacred Text'}
            </p>
          </div>

          {/* Featured Artwork */}
          <div className="mb-12">
            <img 
              src={lesson.artworkUrl} 
              alt={lesson.artworkDescription}
              className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl"
            />
            <p className="text-sm text-earth-600 mt-3 text-center italic">
              {lesson.artworkDescription}
            </p>
          </div>

          {/* The Story Section */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <h2 className="flex items-center text-2xl font-display font-semibold text-earth-900 mb-6">
                <BookOpen className="mr-3 text-gold-500" />
                The Story
              </h2>
              
              <div className="text-earth-800 leading-relaxed space-y-4 text-lg">
                {(lesson.story || '').split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Life Lesson Section */}
          <Card className="mb-8 bg-gradient-to-r from-gold-50 to-earth-50 border-gold-200">
            <CardContent className="p-8">
              <h2 className="flex items-center text-xl font-display font-semibold text-earth-900 mb-4">
                <Lightbulb className="mr-3 text-gold-600" />
                Life Lesson
              </h2>
              <blockquote className="text-lg text-earth-800 font-medium italic leading-relaxed">
                "{lesson.lifeLesson}"
              </blockquote>
            </CardContent>
          </Card>

          {/* Social Share Section */}
          <Card className="mb-8">
            <CardContent className="p-8">
              {lesson && lesson.passage?.tradition ? (
                <SocialShare lesson={lesson} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-600">Social sharing will be available once the lesson is fully loaded.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="text-center">
            <div className="flex justify-center space-x-4">
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
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
