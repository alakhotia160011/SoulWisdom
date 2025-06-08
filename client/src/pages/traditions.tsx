import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, MapPin, Scroll, Users, ArrowRight, Home } from "lucide-react";
import { Link } from "wouter";

interface Tradition {
  id: number;
  name: string;
  slug: string;
  description: string;
  color: string;
  icon: string;
  originPeriod: string | null;
  originLocation: string | null;
  spiritualTradition: string | null;
  summary: string | null;
  famousQuotes: string[] | null;
  imageUrl: string | null;
  manuscriptStyle: string | null;
  lessonCount: number;
}

export default function Traditions() {
  const { data: traditions, isLoading } = useQuery<Tradition[]>({
    queryKey: ['/api/traditions']
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="h-10 bg-amber-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-amber-100 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 7 }).map((_, i) => (
              <Card key={i} className="animate-pulse border-amber-200">
                <CardHeader>
                  <div className="h-6 bg-amber-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-amber-100 rounded w-full"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-amber-100 rounded w-full"></div>
                    <div className="h-4 bg-amber-100 rounded w-2/3"></div>
                    <div className="h-8 bg-amber-200 rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-500 to-blue-700 border-blue-200 hover:border-blue-300",
      green: "from-green-500 to-green-700 border-green-200 hover:border-green-300",
      orange: "from-orange-500 to-orange-700 border-orange-200 hover:border-orange-300",
      purple: "from-purple-500 to-purple-700 border-purple-200 hover:border-purple-300",
      gray: "from-gray-500 to-gray-700 border-gray-200 hover:border-gray-300",
      yellow: "from-yellow-500 to-yellow-700 border-yellow-200 hover:border-yellow-300",
      indigo: "from-indigo-500 to-indigo-700 border-indigo-200 hover:border-indigo-300",
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconSymbol = (icon: string) => {
    if (icon?.includes('cross')) return '†';
    if (icon?.includes('moon')) return '☪';
    if (icon?.includes('om')) return 'ॐ';
    if (icon?.includes('lotus')) return '❋';
    if (icon?.includes('yin-yang')) return '☯';
    if (icon?.includes('fire')) return '◉';
    if (icon?.includes('star-of-david')) return '✡';
    return '◈';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-amber-700 hover:bg-amber-50">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-amber-900">Sacred Traditions</h1>
            <p className="text-xl text-amber-700 max-w-4xl mx-auto leading-relaxed">
              Explore the profound wisdom of seven major spiritual traditions that form the foundation 
              of our daily lessons. Each tradition offers unique insights into the deepest questions of existence.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {traditions?.map((tradition) => (
            <Card 
              key={tradition.id} 
              className="group transition-all duration-500 hover:shadow-2xl cursor-pointer border-2 bg-white hover:bg-gradient-to-br hover:from-white hover:to-amber-50 transform hover:-translate-y-2"
            >
              <CardHeader className="text-center pb-4">
                {/* Icon and Gradient Header */}
                <div className={`bg-gradient-to-r ${getColorClasses(tradition.color)} rounded-xl p-6 mb-4 text-white shadow-lg`}>
                  <div className="text-3xl mb-3 drop-shadow-sm font-serif">
                    {getIconSymbol(tradition.icon)}
                  </div>
                  <CardTitle className="text-xl font-bold text-white drop-shadow-sm">
                    {tradition.name}
                  </CardTitle>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed">
                  {tradition.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Quick Facts */}
                <div className="space-y-2 text-xs text-gray-600">
                  {tradition.originPeriod && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-amber-600" />
                      <span className="truncate">{tradition.originPeriod}</span>
                    </div>
                  )}
                  {tradition.originLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-amber-600" />
                      <span className="truncate">{tradition.originLocation}</span>
                    </div>
                  )}
                  {tradition.spiritualTradition && (
                    <div className="flex items-center gap-2">
                      <Users className="h-3 w-3 text-amber-600" />
                      <span className="truncate">{tradition.spiritualTradition}</span>
                    </div>
                  )}
                  {tradition.manuscriptStyle && (
                    <div className="flex items-center gap-2">
                      <Scroll className="h-3 w-3 text-amber-600" />
                      <span className="truncate">{tradition.manuscriptStyle}</span>
                    </div>
                  )}
                </div>

                {/* Lesson Count Badge */}
                <div className="flex items-center justify-between pt-2">
                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-300">
                    <BookOpen className="h-3 w-3 mr-1" />
                    {tradition.lessonCount} lessons
                  </Badge>
                </div>

                {/* Explore Button */}
                <Link href={`/tradition/${tradition.slug}`}>
                  <Button 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium group-hover:bg-amber-700 transition-all duration-300"
                  >
                    Explore Tradition
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="mt-16 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-amber-200">
            <h3 className="text-2xl font-bold text-amber-900 mb-4">Daily Spiritual Wisdom</h3>
            <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed mb-6">
              Each morning, our platform draws from these sacred traditions to deliver authentic stories, 
              timeless teachings, and practical wisdom for modern life. Experience the depth and beauty 
              of humanity's greatest spiritual insights.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="outline" className="border-amber-300 text-amber-700">
                Authentic Sources
              </Badge>
              <Badge variant="outline" className="border-amber-300 text-amber-700">
                Daily Insights
              </Badge>
              <Badge variant="outline" className="border-amber-300 text-amber-700">
                Historical Context
              </Badge>
              <Badge variant="outline" className="border-amber-300 text-amber-700">
                Practical Wisdom
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}