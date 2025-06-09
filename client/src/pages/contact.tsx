import { aboutContent } from "@/lib/about-content";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-200 mb-4">
            Contact
          </h1>
          <div className="w-24 h-1 bg-stone-600 dark:bg-stone-400 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions, feedback, or suggestions? I'd love to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-6">
              Get in Touch
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-stone-600 dark:text-stone-400 mb-2">
                  Email
                </h3>
                <a 
                  href={`mailto:${aboutContent.author.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {aboutContent.author.email}
                </a>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-stone-600 dark:text-stone-400 mb-2">
                  Social Media
                </h3>
                <div className="space-y-2">
                  <div>
                    <a 
                      href={aboutContent.author.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                  <div>
                    <a 
                      href={aboutContent.author.twitterUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 dark:text-gray-200 hover:underline"
                    >
                      Twitter/X: @AryamaanL
                    </a>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-stone-600 dark:text-stone-400 mb-2">
                  Response Time
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  I typically respond to emails within 24-48 hours.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Topics */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-6">
              What to Reach Out About
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-stone-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-stone-700 dark:text-stone-300">
                    Technical Issues
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Report bugs, broken links, or functionality problems
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-stone-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-stone-700 dark:text-stone-300">
                    Content Suggestions
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Suggest passages, traditions, or improvements to lessons
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-stone-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-stone-700 dark:text-stone-300">
                    Partnerships
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Collaboration opportunities or integration ideas
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-stone-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-stone-700 dark:text-stone-300">
                    General Feedback
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Share your thoughts on the platform and user experience
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-stone-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-medium text-stone-700 dark:text-stone-300">
                    Email Issues
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Problems with subscription or daily lesson delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="mt-16"></div>
      </div>
      <Footer />
    </div>
  );
}