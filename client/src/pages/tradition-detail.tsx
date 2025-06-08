import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Calendar, MapPin, Quote, Scroll, Users } from "lucide-react";
import { Link } from "wouter";

export default function TraditionDetail() {
  const [, params] = useRoute("/tradition/:slug");
  const slug = params?.slug;

  const { data: tradition, isLoading } = useQuery({
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

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-500 to-blue-700 border-blue-200 text-blue-900",
      green: "from-green-500 to-green-700 border-green-200 text-green-900",
      orange: "from-orange-500 to-orange-700 border-orange-200 text-orange-900",
      purple: "from-purple-500 to-purple-700 border-purple-200 text-purple-900",
      gray: "from-gray-500 to-gray-700 border-gray-200 text-gray-900",
      yellow: "from-yellow-500 to-yellow-700 border-yellow-200 text-yellow-900",
      indigo: "from-indigo-500 to-indigo-700 border-indigo-200 text-indigo-900",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/traditions">
            <Button variant="ghost" className="mb-4 text-amber-700 hover:bg-amber-50">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Traditions
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className={`bg-gradient-to-r ${getColorClasses(tradition.color)} rounded-2xl p-8 text-white mb-8 shadow-xl`}>
          <div className="flex items-center gap-6">
            <div className="text-6xl opacity-90">
              {tradition.icon?.includes('cross') && '✝️'}
              {tradition.icon?.includes('moon') && '☪️'}
              {tradition.icon?.includes('om') && '🕉️'}
              {tradition.icon?.includes('lotus') && '☸️'}
              {tradition.icon?.includes('yin-yang') && '☯️'}
              {tradition.icon?.includes('fire') && '🔥'}
              {tradition.icon?.includes('star-of-david') && '✡️'}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{tradition.name}</h1>
              <p className="text-xl opacity-90 mb-4">{tradition.description}</p>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {tradition.spiritualTradition}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <Card className="border-amber-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <BookOpen className="h-5 w-5" />
                  Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{tradition.summary}</p>
              </CardContent>
            </Card>

            {/* Famous Quotes */}
            {tradition.famousQuotes && tradition.famousQuotes.length > 0 && (
              <Card className="border-amber-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <Quote className="h-5 w-5" />
                    Sacred Verses & Teachings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {tradition.famousQuotes.map((quote, index) => (
                    <blockquote key={index} className="border-l-4 border-amber-400 pl-6 py-2">
                      <p className="text-gray-700 italic leading-relaxed font-serif text-lg">
                        "{quote}"
                      </p>
                    </blockquote>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Manuscript Image */}
            {tradition.imageUrl && (
              <Card className="border-amber-200 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-900">
                    <Scroll className="h-5 w-5" />
                    Traditional Manuscript Style
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-8 text-center">
                    <div className="text-6xl mb-4">📜</div>
                    <p className="text-gray-700 font-medium">{tradition.manuscriptStyle}</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Traditional manuscripts of {tradition.name} were created using {tradition.manuscriptStyle.toLowerCase()} techniques.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Historical Details */}
            <Card className="border-amber-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <Calendar className="h-5 w-5" />
                  Historical Context
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold text-gray-700">Time Period</span>
                  </div>
                  <p className="text-gray-600 ml-6">{tradition.originPeriod}</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold text-gray-700">Origin</span>
                  </div>
                  <p className="text-gray-600 ml-6">{tradition.originLocation}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <span className="font-semibold text-gray-700">Tradition</span>
                  </div>
                  <p className="text-gray-600 ml-6">{tradition.spiritualTradition}</p>
                </div>
              </CardContent>
            </Card>

            {/* Related Lessons */}
            <Card className="border-amber-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-900">
                  <BookOpen className="h-5 w-5" />
                  Explore Lessons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Discover daily spiritual lessons from {tradition.name} that offer wisdom and guidance for modern life.
                </p>
                <Link href={`/archive?tradition=${tradition.slug}`}>
                  <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    View All Lessons
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card className="border-amber-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-amber-900">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Text Type</span>
                  <span className="font-medium text-gray-800">Sacred Scripture</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Language</span>
                  <span className="font-medium text-gray-800">
                    {tradition.slug === 'bible' && 'Hebrew, Greek, Aramaic'}
                    {tradition.slug === 'quran' && 'Arabic'}
                    {tradition.slug === 'bhagavad-gita' && 'Sanskrit'}
                    {tradition.slug === 'dhammapada' && 'Pali, Sanskrit'}
                    {tradition.slug === 'tao-te-ching' && 'Classical Chinese'}
                    {tradition.slug === 'upanishads' && 'Sanskrit'}
                    {tradition.slug === 'talmud' && 'Hebrew, Aramaic'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-gray-800">Active in Daily Lessons</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}