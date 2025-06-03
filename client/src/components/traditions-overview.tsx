import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Cross, Moon, Sun, Flower, Moon as YinYang, Flame, Star } from "lucide-react";
import type { TraditionWithCount } from "@shared/schema";

const traditionIcons = {
  "bible": Cross,
  "quran": Moon,
  "bhagavad-gita": Sun,
  "dhammapada": Flower,
  "tao-te-ching": YinYang,
  "upanishads": Flame,
  "talmud": Star,
};

export default function TraditionsOverview() {
  const { data: traditions, isLoading } = useQuery<TraditionWithCount[]>({
    queryKey: ["/api/traditions"],
  });

  const getTraditionColorClasses = (color: string) => {
    const colorMap = {
      blue: "from-blue-50 to-blue-100 border-blue-200 bg-blue-600 text-blue-700 bg-blue-200",
      green: "from-green-50 to-green-100 border-green-200 bg-green-600 text-green-700 bg-green-200",
      orange: "from-orange-50 to-orange-100 border-orange-200 bg-orange-600 text-orange-700 bg-orange-200",
      purple: "from-purple-50 to-purple-100 border-purple-200 bg-purple-600 text-purple-700 bg-purple-200",
      gray: "from-gray-50 to-gray-100 border-gray-200 bg-gray-600 text-gray-700 bg-gray-200",
      yellow: "from-yellow-50 to-yellow-100 border-yellow-200 bg-yellow-600 text-yellow-700 bg-yellow-200",
      indigo: "from-indigo-50 to-indigo-100 border-indigo-200 bg-indigo-600 text-indigo-700 bg-indigo-200"
    };
    
    const classes = colorMap[color as keyof typeof colorMap] || "from-earth-50 to-earth-100 border-earth-200 bg-earth-600 text-earth-700 bg-earth-200";
    const [gradient, border, iconBg, textColor, badgeBg] = classes.split(' ');
    
    return { gradient, border, iconBg, textColor, badgeBg };
  };

  if (isLoading) {
    return (
      <section id="traditions" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 7 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="text-center">
                    <Skeleton className="w-12 h-12 rounded-lg mx-auto mb-4" />
                    <Skeleton className="h-6 w-24 mx-auto mb-2" />
                    <Skeleton className="h-4 w-32 mx-auto mb-3" />
                    <Skeleton className="h-5 w-16 mx-auto rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="traditions" className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-semibold text-earth-900 mb-4">
            Spiritual Traditions
          </h2>
          <p className="text-earth-600 text-lg max-w-2xl mx-auto">
            Discover wisdom from seven major spiritual traditions, each offering unique insights for life's journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {traditions?.map((tradition) => {
            const Icon = traditionIcons[tradition.slug as keyof typeof traditionIcons] || Sun;
            const colorClasses = getTraditionColorClasses(tradition.color);
            
            return (
              <Link key={tradition.id} href={`/archive/${tradition.slug}`}>
                <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                  <CardContent 
                    className={`p-6 bg-gradient-to-br ${colorClasses.gradient} border ${colorClasses.border}`}
                  >
                    <div className="text-center">
                      <div className={`w-12 h-12 ${colorClasses.iconBg} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                        <Icon className="text-white w-6 h-6" />
                      </div>
                      <h3 className="font-display font-semibold text-earth-900 mb-2">
                        {tradition.name}
                      </h3>
                      <p className="text-sm text-earth-600 mb-3">
                        {tradition.description}
                      </p>
                      <div className={`text-xs ${colorClasses.textColor} ${colorClasses.badgeBg} px-2 py-1 rounded-full inline-block`}>
                        {tradition.lessonCount} lessons
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
