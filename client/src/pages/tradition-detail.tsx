import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Calendar, MapPin, Quote, Scroll, Users } from "lucide-react";
import { Link } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import type { Tradition } from "@shared/schema";

export default function TraditionDetail() {
  const [, params] = useRoute("/tradition/:slug");
  const slug = params?.slug;

  const { data: tradition, isLoading } = useQuery<Tradition>({
    queryKey: [`/api/traditions/${slug}`],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-amber-700">Loading tradition details...</p>
        </div>
      </div>
    );
  }

  if (!tradition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-24 w-24 text-amber-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-amber-900 mb-4">Tradition Not Found</h1>
          <p className="text-amber-700 mb-6">The spiritual tradition you're looking for doesn't exist.</p>
          <Link href="/traditions">
            <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Traditions
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getTraditionStyling = (slug: string) => {
    const stylingMap = {
      'bible': {
        gradient: "from-amber-700 via-amber-600 to-amber-800",
        accent: "border-amber-300 bg-amber-50",
        text: "text-amber-900",
        icon: "✝",
        bgPattern: "bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
      },
      'quran': {
        gradient: "from-emerald-700 via-emerald-600 to-emerald-800", 
        accent: "border-emerald-300 bg-emerald-50",
        text: "text-emerald-900",
        icon: "☪",
        bgPattern: "bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50"
      },
      'bhagavad-gita': {
        gradient: "from-orange-700 via-orange-600 to-orange-800",
        accent: "border-orange-300 bg-orange-50", 
        text: "text-orange-900",
        icon: "ॐ",
        bgPattern: "bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50"
      },
      'dhammapada': {
        gradient: "from-purple-700 via-purple-600 to-purple-800",
        accent: "border-purple-300 bg-purple-50",
        text: "text-purple-900", 
        icon: "☸",
        bgPattern: "bg-gradient-to-br from-purple-50 via-violet-50 to-indigo-50"
      },
      'tao-te-ching': {
        gradient: "from-slate-700 via-slate-600 to-slate-800",
        accent: "border-slate-300 bg-slate-50",
        text: "text-slate-900",
        icon: "☯",
        bgPattern: "bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50"
      },
      'upanishads': {
        gradient: "from-rose-700 via-rose-600 to-rose-800",
        accent: "border-rose-300 bg-rose-50",
        text: "text-rose-900",
        icon: "◉", 
        bgPattern: "bg-gradient-to-br from-rose-50 via-pink-50 to-red-50"
      },
      'talmud': {
        gradient: "from-blue-700 via-blue-600 to-blue-800",
        accent: "border-blue-300 bg-blue-50",
        text: "text-blue-900",
        icon: "✡",
        bgPattern: "bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50"
      }
    };
    return stylingMap[slug as keyof typeof stylingMap] || stylingMap['bible'];
  };

  const styling = getTraditionStyling(slug || '');

  if (!tradition) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center">
          <div className="text-center">
            <BookOpen className="h-24 w-24 text-amber-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-amber-900 mb-4">Tradition Not Found</h1>
            <p className="text-amber-700 mb-6">The spiritual tradition you're looking for doesn't exist.</p>
            <Link href="/traditions">
              <Button variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Traditions
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={`min-h-screen ${styling.bgPattern}`}>
        {/* Back Navigation */}
        <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-earth-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <Link href="/traditions">
              <Button variant="ghost" className="text-earth-700 hover:bg-earth-50">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Traditions
              </Button>
            </Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className={`bg-gradient-to-r ${styling.gradient} rounded-2xl p-8 text-white mb-8 shadow-xl relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center gap-8">
            <div className="text-7xl opacity-95 filter drop-shadow-lg">
              {styling.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">{tradition.name}</h1>
              <p className="text-xl opacity-95 mb-6 text-white/90 leading-relaxed">{tradition.description}</p>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-white/25 text-white border-white/40 px-3 py-1">
                  {tradition.spiritualTradition}
                </Badge>
                <Badge variant="secondary" className="bg-white/25 text-white border-white/40 px-3 py-1">
                  {tradition.originPeriod}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className={`${styling.accent} shadow-lg border-2`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${styling.text}`}>
                  <BookOpen className="h-5 w-5" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-earth-700 leading-relaxed text-lg">{tradition.summary}</p>
              </CardContent>
            </Card>

            {/* Famous Quotes */}
            {tradition.famousQuotes && tradition.famousQuotes.length > 0 && (
              <Card className={`${styling.accent} shadow-lg border-2`}>
                <CardHeader>
                  <CardTitle className={`flex items-center gap-2 ${styling.text}`}>
                    <Quote className="h-5 w-5" />
                    Sacred Verses & Teachings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {tradition.famousQuotes.map((quote, index) => (
                    <blockquote key={index} className={`border-l-4 ${styling.text.replace('text-', 'border-')} pl-6 py-3 bg-white/60 rounded-r-lg`}>
                      <p className="text-earth-800 italic leading-relaxed font-serif text-lg">
                        "{quote}"
                      </p>
                    </blockquote>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Manuscript Style */}
            <Card className={`${styling.accent} shadow-lg border-2`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${styling.text}`}>
                  <Scroll className="h-5 w-5" />
                  Traditional Manuscript Style
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gradient-to-br from-white/80 to-white/60 rounded-lg p-8 text-center border border-earth-200">
                  <div className="text-6xl mb-4">📜</div>
                  <p className="text-earth-800 font-semibold text-xl mb-2">{tradition.manuscriptStyle || 'Ancient Script'}</p>
                  <p className="text-earth-600 leading-relaxed">
                    Traditional manuscripts of {tradition.name} were created using {(tradition.manuscriptStyle || 'traditional').toLowerCase()} techniques, preserving sacred wisdom through centuries.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Historical Details */}
            <Card className={`${styling.accent} shadow-lg border-2`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${styling.text}`}>
                  <Calendar className="h-5 w-5" />
                  Historical Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className={`h-4 w-4 ${styling.text}`} />
                    <span className="font-semibold text-earth-800">Time Period</span>
                  </div>
                  <p className="text-earth-700 ml-6 bg-white/60 p-3 rounded-lg">{tradition.originPeriod}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className={`h-4 w-4 ${styling.text}`} />
                    <span className="font-semibold text-earth-800">Origin</span>
                  </div>
                  <p className="text-earth-700 ml-6 bg-white/60 p-3 rounded-lg">{tradition.originLocation}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className={`h-4 w-4 ${styling.text}`} />
                    <span className="font-semibold text-earth-800">Tradition</span>
                  </div>
                  <p className="text-earth-700 ml-6 bg-white/60 p-3 rounded-lg">{tradition.spiritualTradition}</p>
                </div>
              </CardContent>
            </Card>

            {/* Related Lessons */}
            <Card className={`${styling.accent} shadow-lg border-2`}>
              <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${styling.text}`}>
                  <BookOpen className="h-5 w-5" />
                  Explore Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-earth-700 mb-6 leading-relaxed">
                  Discover daily spiritual lessons from {tradition.name} that offer wisdom and guidance for modern life.
                </p>
                <Link href={`/archive?tradition=${tradition.slug}`}>
                  <Button className={`w-full bg-gradient-to-r ${styling.gradient} text-white hover:opacity-90 transition-all duration-200 py-3 text-lg font-semibold shadow-lg`}>
                    View All Lessons
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card className={`${styling.accent} shadow-lg border-2`}>
              <CardHeader>
                <CardTitle className={styling.text}>Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                  <span className="text-earth-600 font-medium">Text Type</span>
                  <span className="font-semibold text-earth-800">Sacred Scripture</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                  <span className="text-earth-600 font-medium">Language</span>
                  <span className="font-semibold text-earth-800">
                    {tradition.slug === 'bible' && 'Hebrew, Greek, Aramaic'}
                    {tradition.slug === 'quran' && 'Arabic'}
                    {tradition.slug === 'bhagavad-gita' && 'Sanskrit'}
                    {tradition.slug === 'dhammapada' && 'Pali, Sanskrit'}
                    {tradition.slug === 'tao-te-ching' && 'Classical Chinese'}
                    {tradition.slug === 'upanishads' && 'Sanskrit'}
                    {tradition.slug === 'talmud' && 'Hebrew, Aramaic'}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-white/60 rounded-lg">
                  <span className="text-earth-600 font-medium">Status</span>
                  <span className="font-semibold text-earth-800">Active in Daily Lessons</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </>
  );
}