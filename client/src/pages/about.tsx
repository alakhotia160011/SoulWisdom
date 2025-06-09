import { aboutContent } from "@/lib/about-content";
import profileImage from "@assets/Aryamaan_Lakhotia_1749416191319.jpg";

export default function About() {
  return (
    <div className="min-h-screen bg-earth-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        
        {/* About This Project Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display text-earth-900 mb-4">
              About This Project
            </h1>
            <div className="w-24 h-1 bg-earth-600 mx-auto"></div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 border border-earth-100">
            <h2 className="text-2xl md:text-3xl font-display text-earth-800 mb-8 text-center">
              {aboutContent.project.title}
            </h2>
            
            <div className="space-y-6 text-earth-700 leading-relaxed">
              {aboutContent.project.paragraphs.map((paragraph, index) => (
                <p key={index} className="text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display text-earth-900 mb-4">
              About Me
            </h1>
            <div className="w-24 h-1 bg-earth-600 mx-auto"></div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 border border-earth-100">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="flex-shrink-0">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-lg">
                  <img 
                    src={profileImage}
                    alt={aboutContent.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-display text-earth-800 mb-6 text-center md:text-left">
                  {aboutContent.author.name}
                </h2>
                
                <div className="space-y-6 text-earth-700 leading-relaxed">
                  {aboutContent.author.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-lg">
                      {paragraph}
                    </p>
                  ))}
                  
                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <a 
                      href={aboutContent.author.linkedinUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                      </svg>
                      LinkedIn
                    </a>
                    
                    <a 
                      href={aboutContent.author.twitterUrl}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      Twitter
                    </a>
                    
                    <a 
                      href={`mailto:${aboutContent.author.email}`}
                      className="inline-flex items-center px-6 py-3 bg-earth-600 text-white rounded-lg hover:bg-earth-700 transition-colors duration-200 font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                      </svg>
                      Email
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