import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="text-center mb-12">
            <div className="h-12 bg-stone-200 dark:bg-gray-700 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-stone-100 dark:bg-gray-600 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 animate-pulse">
                <div className="h-6 bg-stone-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-stone-100 dark:bg-gray-600 rounded w-full mb-2"></div>
                <div className="h-4 bg-stone-100 dark:bg-gray-600 rounded w-2/3 mb-6"></div>
                <div className="h-10 bg-stone-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-200 mb-4">
            Sacred Traditions
          </h1>
          <div className="w-24 h-1 bg-stone-600 dark:bg-stone-400 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Explore the profound wisdom of seven major spiritual traditions that form the foundation 
            of our daily lessons. Each tradition offers unique insights into the deepest questions of existence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {traditions?.map((tradition) => (
            <Link key={tradition.id} href={`/tradition/${tradition.slug}`}>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-8 cursor-pointer group hover:-translate-y-1">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-stone-800 dark:bg-white text-white dark:text-stone-800 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto shadow-lg">
                    {getIconSymbol(tradition.icon)}
                  </div>
                  <h3 className="text-xl font-serif text-stone-700 dark:text-stone-300 mb-2">
                    {tradition.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {tradition.description}
                  </p>
                  <div className="flex items-center justify-center text-stone-600 dark:text-stone-400 text-sm">
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span>{tradition.lessonCount} lessons</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16"></div>
      </div>
    </div>
  );
}