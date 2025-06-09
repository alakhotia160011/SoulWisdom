import { useQuery } from "@tanstack/react-query";
import { BookOpen, Home, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

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

  const getTraditionColors = (slug: string) => {
    const colorMap = {
      'bible': {
        background: 'from-blue-50 to-blue-100',
        border: 'border-blue-200',
        iconBg: 'bg-blue-800',
        textColor: 'text-blue-900',
        hoverBg: 'hover:from-blue-100 hover:to-blue-150'
      },
      'quran': {
        background: 'from-green-50 to-green-100',
        border: 'border-green-200',
        iconBg: 'bg-green-800',
        textColor: 'text-green-900',
        hoverBg: 'hover:from-green-100 hover:to-green-150'
      },
      'bhagavad-gita': {
        background: 'from-orange-50 to-orange-100',
        border: 'border-orange-200',
        iconBg: 'bg-orange-800',
        textColor: 'text-orange-900',
        hoverBg: 'hover:from-orange-100 hover:to-orange-150'
      },
      'dhammapada': {
        background: 'from-purple-50 to-purple-100',
        border: 'border-purple-200',
        iconBg: 'bg-purple-800',
        textColor: 'text-purple-900',
        hoverBg: 'hover:from-purple-100 hover:to-purple-150'
      },
      'tao-te-ching': {
        background: 'from-gray-50 to-gray-100',
        border: 'border-gray-200',
        iconBg: 'bg-gray-800',
        textColor: 'text-gray-900',
        hoverBg: 'hover:from-gray-100 hover:to-gray-150'
      },
      'upanishads': {
        background: 'from-yellow-50 to-yellow-100',
        border: 'border-yellow-200',
        iconBg: 'bg-yellow-800',
        textColor: 'text-yellow-900',
        hoverBg: 'hover:from-yellow-100 hover:to-yellow-150'
      },
      'talmud': {
        background: 'from-indigo-50 to-indigo-100',
        border: 'border-indigo-200',
        iconBg: 'bg-indigo-800',
        textColor: 'text-indigo-900',
        hoverBg: 'hover:from-indigo-100 hover:to-indigo-150'
      }
    };
    
    return colorMap[slug as keyof typeof colorMap] || {
      background: 'from-earth-50 to-earth-100',
      border: 'border-earth-200',
      iconBg: 'bg-earth-800',
      textColor: 'text-earth-900',
      hoverBg: 'hover:from-earth-100 hover:to-earth-150'
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-earth-50">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-12">
            <div className="h-12 bg-earth-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-earth-100 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-lg p-8 animate-pulse border border-earth-100">
                <div className="h-6 bg-earth-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-earth-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-earth-100 rounded w-2/3 mb-6"></div>
                <div className="h-10 bg-earth-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-earth-50">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-sm text-earth-600">
            <Link href="/" className="hover:text-earth-800 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-earth-900 font-medium">Traditions</span>
          </div>
          <Link href="/">
            <Button variant="outline" className="border-earth-300 text-earth-700 hover:bg-earth-100">
              <Home className="w-4 h-4 mr-2" />
              Today's Lesson
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-earth-900 mb-4">
            Sacred Traditions
          </h1>
          <div className="w-24 h-1 bg-earth-600 mx-auto mb-8"></div>
          <p className="text-lg text-earth-700 max-w-3xl mx-auto leading-relaxed">
            Explore the profound wisdom of seven major spiritual traditions that form the foundation 
            of our daily lessons. Each tradition offers unique insights into the deepest questions of existence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {traditions?.map((tradition) => {
            const colors = getTraditionColors(tradition.slug);
            return (
              <Link key={tradition.id} href={`/tradition/${tradition.slug}`}>
                <div className={`bg-gradient-to-br ${colors.background} ${colors.hoverBg} rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer group hover:-translate-y-1 border ${colors.border}`}>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 ${colors.iconBg} text-white rounded-lg flex items-center justify-center text-2xl mb-4 mx-auto shadow-lg`}>
                      {getIconSymbol(tradition.icon)}
                    </div>
                    <h3 className={`text-xl font-display ${colors.textColor} mb-2`}>
                      {tradition.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {tradition.description}
                    </p>
                    <div className={`flex items-center justify-center ${colors.textColor} text-sm`}>
                      <BookOpen className="w-4 h-4 mr-1" />
                      <span>{tradition.lessonCount} lessons</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16"></div>
      </div>
    </div>
  );
}