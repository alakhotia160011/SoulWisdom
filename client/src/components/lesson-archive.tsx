import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronRight, Clock } from "lucide-react";
import { Link } from "wouter";
import type { LessonWithDetails, TraditionWithCount } from "@shared/schema";

export default function LessonArchive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTradition, setSelectedTradition] = useState("all");

  const { data: traditions } = useQuery<TraditionWithCount[]>({
    queryKey: ["/api/traditions"],
  });

  const { data: lessons, isLoading } = useQuery<LessonWithDetails[]>({
    queryKey: ["/api/lessons", { 
      tradition: selectedTradition !== "all" ? selectedTradition : undefined, 
      search: searchQuery || undefined,
      limit: 6 
    }],
    queryFn: ({ queryKey }) => {
      const [baseUrl, params] = queryKey;
      const searchParams = new URLSearchParams();
      
      if (params?.tradition) searchParams.set("tradition", params.tradition);
      if (params?.search) searchParams.set("search", params.search);
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      
      const url = searchParams.toString() ? `${baseUrl}?${searchParams}` : baseUrl;
      return fetch(url, { credentials: "include" }).then(res => res.json());
    },
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
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

  const estimateReadTime = (story: string) => {
    const wordCount = story.split(' ').length;
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <section id="archive" className="py-16 bg-earth-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-semibold text-earth-900 mb-4">
            Lesson Archive
          </h2>
          <p className="text-earth-600 text-lg max-w-2xl mx-auto">
            Browse our collection of timeless wisdom from across spiritual traditions.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-earth-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-earth-200 focus:ring-earth-500 focus:border-earth-500"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedTradition === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTradition("all")}
                className={selectedTradition === "all" ? "bg-earth-600 hover:bg-earth-700" : "bg-white text-earth-600 border-earth-200 hover:bg-earth-50"}
              >
                All
              </Button>
              {traditions?.slice(0, 4).map((tradition) => (
                <Button
                  key={tradition.slug}
                  variant={selectedTradition === tradition.slug ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTradition(tradition.slug)}
                  className={selectedTradition === tradition.slug 
                    ? "bg-earth-600 hover:bg-earth-700" 
                    : "bg-white text-earth-600 border-earth-200 hover:bg-earth-50"
                  }
                >
                  {tradition.name}
                </Button>
              ))}
              <Link href="/archive">
                <Button variant="outline" size="sm" className="bg-white text-earth-600 border-earth-200 hover:bg-earth-50">
                  More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Archive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-32 w-full" />
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="mt-4 flex items-center justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : lessons?.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-earth-600 text-lg">No lessons found matching your criteria.</p>
            </div>
          ) : (
            lessons?.map((lesson) => (
              <Link key={lesson.id} href={`/lesson/${lesson.id}`}>
                <Card className="overflow-hidden group cursor-pointer hover:shadow-md transition-shadow border-earth-100">
                  <img 
                    src={lesson.artworkUrl} 
                    alt={lesson.artworkDescription}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTraditionColor(lesson.passage.tradition.color)}`}>
                        {lesson.passage.tradition.name}
                      </span>
                      <span className="text-earth-500 text-sm">
                        {formatDate(lesson.date.toString())}
                      </span>
                    </div>
                    
                    <h3 className="font-display font-semibold text-earth-900 mb-2 group-hover:text-earth-700 transition-colors">
                      {lesson.title}
                    </h3>
                    
                    <p className="text-earth-600 text-sm line-clamp-2 mb-4">
                      {lesson.story.slice(0, 120)}...
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-earth-500 text-xs flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {estimateReadTime(lesson.story)} min read
                      </span>
                      <ChevronRight className="w-4 h-4 text-earth-400 group-hover:text-earth-600 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link href="/archive">
            <Button className="bg-earth-600 text-white hover:bg-earth-700">
              View All Lessons
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
