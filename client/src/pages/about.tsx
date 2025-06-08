export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        
        {/* About This Project Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-200 mb-4">
              About This Project
            </h1>
            <div className="w-24 h-1 bg-stone-600 dark:bg-stone-400 mx-auto"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-serif text-stone-700 dark:text-stone-300 mb-8 text-center">
              Why This Exists
            </h2>
            
            <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p className="text-lg">
                In times of uncertainty, loss, or searching, many of us naturally turn to the wisdom found in religious and spiritual texts. These ancient writings have guided countless generations through life's most challenging moments, offering profound insights into human nature, purpose, and resilience.
              </p>
              
              <p className="text-lg">
                Yet for many people today, these texts can feel distant or overwhelming. The language is often formal, the context unfamiliar, and the sheer volume of wisdom can make it difficult to know where to begin or how to apply these teachings to our daily lives.
              </p>
              
              <p className="text-lg">
                This site bridges that gap by offering daily stories drawn from seven major spiritual traditions, written in accessible language and designed to be digestible, insightful, and shareable. Each lesson includes authentic passages, engaging narratives, practical life applications, and beautiful artwork that honors the traditional styles of each tradition.
              </p>
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-200 mb-4">
              About Me
            </h1>
            <div className="w-24 h-1 bg-stone-600 dark:bg-stone-400 mx-auto"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src="/api/placeholder/300/300" 
                    alt="Aryamaan Lakhotia"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='serif' font-size='20' fill='%236b7280'%3EAryamaan Lakhotia%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-serif text-stone-700 dark:text-stone-300 mb-6 text-center md:text-left">
                  Aryamaan Lakhotia
                </h2>
                
                <div className="space-y-6 text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p className="text-lg">
                    I currently work as a trader by day and build personal projects by night. I've always been drawn to the intersection of reflection and technology—finding ways to use digital tools to make meaningful ideas more accessible and shareable.
                  </p>
                  
                  <p className="text-lg">
                    This project was born out of a personal need. During a difficult time in my life, I found myself turning to spiritual traditions for guidance and clarity. While the wisdom was profound, I often struggled to find the time or context to engage with these texts meaningfully in my daily routine. This site is my small way of making that search easier for others who might find themselves in similar situations.
                  </p>
                  
                  <div className="pt-4">
                    <a 
                      href="https://www.linkedin.com/in/aryamaan-lakhotia/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-stone-600 dark:bg-stone-700 text-white rounded-lg hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                      LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="mt-16"></div>
      </div>
    </div>
  );
}