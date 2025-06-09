import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Info } from "lucide-react";
import type { TraditionWithCount } from "@shared/schema";

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

const traditionDetails = {
  "bible": {
    fullName: "The Holy Bible",
    period: "~1450 BCE - 100 CE",
    origin: "Ancient Israel & Early Christianity",
    languages: "Hebrew, Aramaic, Greek",
    description: "The foundational text of Christianity and Judaism, containing the Old Testament (Hebrew Bible/Tanakh) and New Testament. Includes the Torah, Psalms, Gospels, and Epistles.",
    keyTeachings: "Love of God and neighbor, salvation through faith, moral law, forgiveness, and eternal life",
    historicalContext: "Compiled over centuries by multiple authors, the Bible records God's covenant with humanity from creation through the early Christian church. The Hebrew Bible was largely completed by 400 BCE, while the New Testament was written in the 1st century CE.",
    influence: "The most widely read book in human history, foundational to Western civilization, law, literature, and ethics. Over 2.4 billion Christians worldwide follow its teachings."
  },
  "quran": {
    fullName: "The Holy Qur'an",
    period: "610-632 CE",
    origin: "Arabian Peninsula",
    languages: "Classical Arabic",
    description: "The central religious text of Islam, believed by Muslims to be the direct word of Allah revealed to Prophet Muhammad through the Angel Gabriel (Jibril).",
    keyTeachings: "Monotheism (Tawhid), five pillars of Islam, social justice, compassion, submission to Allah's will, and preparation for the afterlife",
    historicalContext: "Revealed over 23 years in Mecca and Medina, the Qur'an was memorized by companions of Muhammad and compiled into a single book under Caliph Uthman around 650 CE. It remains unchanged in its original Arabic.",
    influence: "Guides 1.8 billion Muslims worldwide. Shaped Islamic civilization, law (Sharia), science, philosophy, and art across continents for over 1400 years."
  },
  "bhagavad-gita": {
    fullName: "The Bhagavad Gita",
    period: "~400 BCE - 400 CE",
    origin: "Ancient India",
    languages: "Sanskrit",
    description: "A 700-verse Hindu scripture that is part of the epic Mahabharata. Presents a dialogue between Prince Arjuna and Lord Krishna on duty, righteousness, and spiritual liberation.",
    keyTeachings: "Dharma (righteous duty), karma yoga (selfless action), bhakti (devotion), moksha (liberation), and the eternal nature of the soul",
    historicalContext: "Set on the battlefield of Kurukshetra, the text addresses the moral dilemma of war while exploring profound philosophical questions about life, death, and spiritual purpose. Part of the world's longest epic poem.",
    influence: "Central to Hindu philosophy and practice. Influenced leaders like Mahatma Gandhi and inspired spiritual movements worldwide. Over 1 billion Hindus draw guidance from its teachings."
  },
  "dhammapada": {
    fullName: "The Dhammapada",
    period: "~3rd century BCE",
    origin: "Ancient India/Sri Lanka",
    languages: "Pali",
    description: "A collection of 423 verses attributed to Buddha, containing essential Buddhist teachings on ethics, mental discipline, and wisdom. Part of the Pali Canon.",
    keyTeachings: "The Four Noble Truths, Eightfold Path, mindfulness, compassion, non-attachment, and the cessation of suffering through enlightenment",
    historicalContext: "Compiled from Buddha's oral teachings after his death (c. 483 BCE). Preserved in the Theravada tradition and remains one of the most widely read Buddhist texts.",
    influence: "Foundational to Buddhism practiced by 500+ million people. Spread Buddhist philosophy throughout Asia and increasingly influences Western mindfulness and meditation practices."
  },
  "tao-te-ching": {
    fullName: "Tao Te Ching (Dao De Jing)",
    period: "~6th century BCE",
    origin: "Ancient China",
    languages: "Classical Chinese",
    description: "Attributed to Lao Tzu, this 81-chapter text is the fundamental scripture of Taoism, exploring the Tao (The Way) and principles of natural harmony and wu wei (effortless action).",
    keyTeachings: "The Tao as the source of all existence, wu wei (non-action), yin-yang balance, simplicity, humility, and living in harmony with nature",
    historicalContext: "Emerged during China's Spring and Autumn period amid social upheaval. Offers an alternative to Confucian emphasis on social order, advocating instead for natural spontaneity and simplicity.",
    influence: "Second most translated book after the Bible. Profoundly influenced Chinese culture, government, medicine, and martial arts. Increasingly popular in Western philosophy and leadership studies."
  },
  "upanishads": {
    fullName: "The Upanishads",
    period: "~800-200 BCE",
    origin: "Ancient India",
    languages: "Sanskrit",
    description: "A collection of 108 philosophical and mystical texts that form the foundation of Vedanta philosophy. Explore the nature of ultimate reality (Brahman) and the individual soul (Atman).",
    keyTeachings: "Brahman as ultimate reality, Atman (individual soul), reincarnation, karma, meditation, and the unity of all existence",
    historicalContext: "Composed by various sages and teachers, these texts represent the philosophical culmination of Vedic thought. They mark the transition from ritual-based religion to philosophical inquiry about existence.",
    influence: "Foundational to Hindu philosophy and influenced thinkers like Schopenhauer and Emerson. Continue to guide Hindu spiritual practice and contribute to global understanding of consciousness and reality."
  },
  "talmud": {
    fullName: "The Talmud and Midrash",
    period: "~200-500 CE",
    origin: "Babylon and Palestine",
    languages: "Hebrew and Aramaic",
    description: "Vast collection of rabbinical discussions and interpretations of the Torah, Jewish law (Halakha), ethics, customs, and history. Includes Mishnah (oral law) and Gemara (commentary).",
    keyTeachings: "Torah study, ethical living, social justice, tikkun olam (repairing the world), community responsibility, and rigorous intellectual discourse",
    historicalContext: "Developed over centuries as rabbis sought to apply Torah teachings to changing circumstances. The Babylonian Talmud became the primary source of Jewish law and practice.",
    influence: "Central to Jewish learning and practice for 1500+ years. Shaped Jewish communities worldwide and contributed significantly to legal reasoning, ethics, and intellectual tradition."
  }
};

export default function TraditionsOverview() {
  const { data: traditions, isLoading } = useQuery<TraditionWithCount[]>({
    queryKey: ["/api/traditions"],
  });

  const getTraditionColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-800",
      green: "bg-green-800", 
      orange: "bg-orange-800",
      purple: "bg-purple-800",
      gray: "bg-gray-800",
      yellow: "bg-yellow-800",
      indigo: "bg-indigo-800"
    };
    
    return colorMap[color as keyof typeof colorMap] || "bg-earth-800";
  };

  if (isLoading) {
    return (
      <section id="traditions" className="py-16 bg-earth-50">
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
    <section id="traditions" className="py-16 bg-earth-50">
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
            const iconBgColor = getTraditionColorClasses(tradition.color);
            
            return (
              <Card key={tradition.id} className="group hover:shadow-lg transition-shadow bg-white border-earth-100">
                <CardContent className="p-6">
                  <div className="text-center relative">
                    <div className="absolute top-0 right-0 z-10">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <Info className="w-4 h-4 text-earth-600 hover:text-earth-800" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-display flex items-center gap-3">
                              <div className={`w-10 h-10 ${iconBgColor} rounded-lg flex items-center justify-center shadow-lg`}>
                                <span className="text-white text-lg font-bold drop-shadow-md">
                                  {getIconSymbol(tradition.slug)}
                                </span>
                              </div>
                              {traditionDetails[tradition.slug as keyof typeof traditionDetails]?.fullName || tradition.name}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6 mt-4">
                            {traditionDetails[tradition.slug as keyof typeof traditionDetails] && (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="font-semibold text-earth-800">Period:</span>
                                    <p className="text-earth-600">{traditionDetails[tradition.slug as keyof typeof traditionDetails].period}</p>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-earth-800">Origin:</span>
                                    <p className="text-earth-600">{traditionDetails[tradition.slug as keyof typeof traditionDetails].origin}</p>
                                  </div>
                                  <div>
                                    <span className="font-semibold text-earth-800">Languages:</span>
                                    <p className="text-earth-600">{traditionDetails[tradition.slug as keyof typeof traditionDetails].languages}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-earth-800 mb-2">Description</h4>
                                  <p className="text-earth-600 leading-relaxed">
                                    {traditionDetails[tradition.slug as keyof typeof traditionDetails].description}
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-earth-800 mb-2">Key Teachings</h4>
                                  <p className="text-earth-600 leading-relaxed">
                                    {traditionDetails[tradition.slug as keyof typeof traditionDetails].keyTeachings}
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-earth-800 mb-2">Historical Context</h4>
                                  <p className="text-earth-600 leading-relaxed">
                                    {traditionDetails[tradition.slug as keyof typeof traditionDetails].historicalContext}
                                  </p>
                                </div>
                                
                                <div>
                                  <h4 className="font-semibold text-earth-800 mb-2">Global Influence</h4>
                                  <p className="text-earth-600 leading-relaxed">
                                    {traditionDetails[tradition.slug as keyof typeof traditionDetails].influence}
                                  </p>
                                </div>
                                
                                <div className="pt-4 border-t">
                                  <Link href={`/archive/${tradition.slug}`}>
                                    <Button className="w-full">
                                      View {tradition.lessonCount} Lessons from {tradition.name}
                                    </Button>
                                  </Link>
                                </div>
                              </>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    
                    <div className="mb-4">
                      <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center shadow-lg mx-auto`}>
                        <span className="text-white text-xl font-bold drop-shadow-md">
                          {getIconSymbol(tradition.slug)}
                        </span>
                      </div>
                    </div>
                    
                    <Link href={`/archive/${tradition.slug}`} className="block">
                      <h3 className="font-display font-semibold text-earth-900 mb-2 hover:text-earth-700 transition-colors">
                        {tradition.name}
                      </h3>
                      <p className="text-sm text-earth-600 mb-3">
                        {tradition.description}
                      </p>
                      <div className="text-xs font-semibold text-earth-700 bg-earth-100 px-3 py-1 rounded-full inline-block border border-earth-200">
                        {tradition.lessonCount} lessons
                      </div>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
