import Header from "@/components/header";
import Footer from "@/components/footer";

export default function FAQ() {
  const faqs = [
    {
      question: "How often are new lessons published?",
      answer: "New lessons are automatically generated and sent via email every day at 6:00 AM. You can also visit the website anytime to read the latest lesson."
    },
    {
      question: "Which religious traditions are covered?",
      answer: "We draw from seven major spiritual traditions: Bible (Christianity), Qur'an (Islam), Bhagavad Gita (Hinduism), Dhammapada (Buddhism), Tao Te Ching (Taoism), Upanishads (Hindu philosophy), and Talmud & Midrash (Judaism)."
    },
    {
      question: "Are the passages authentic?",
      answer: "Yes, all passages are drawn from authentic sacred texts. We present them in accessible language while maintaining their original meaning and context."
    },
    {
      question: "Is the service free?",
      answer: "Yes, Daily Spiritual Lessons is completely free to use. There are no subscription fees or hidden costs."
    },
    {
      question: "How can I unsubscribe from emails?",
      answer: "You can unsubscribe at any time by replying to any email with 'unsubscribe' in the subject line. Your request will be processed immediately."
    },
    {
      question: "Can I read past lessons?",
      answer: "Yes, you can browse all previous lessons in our Archive section. You can also filter by specific traditions or search for particular topics."
    },
    {
      question: "Who creates the content?",
      answer: "The lessons are curated and generated using AI technology, guided by authentic passages from sacred texts. Each lesson includes historical context, modern interpretation, and practical applications."
    },
    {
      question: "Are the artworks original?",
      answer: "Yes, the artworks are AI-generated specifically for each lesson, designed to reflect the traditional artistic styles of each spiritual tradition."
    },
    {
      question: "Can I share the lessons?",
      answer: "Absolutely! Each lesson includes social sharing options for Facebook, Twitter, LinkedIn, and email. We encourage sharing wisdom that resonates with you."
    },
    {
      question: "Do you have a mobile app?",
      answer: "Currently, we offer a responsive web experience that works great on all devices. You can bookmark the site on your phone for easy access."
    },
    {
      question: "How do I provide feedback or suggestions?",
      answer: "We welcome your feedback! You can reach out through our Contact page or email directly. We read every message and use feedback to improve the platform."
    },
    {
      question: "Are there different email frequencies available?",
      answer: "Currently, lessons are sent daily. If you'd prefer a different frequency, please let us know via the Contact page - we're always looking to improve based on user preferences."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-200 mb-4">
            Frequently Asked Questions
          </h1>
          <div className="w-24 h-1 bg-stone-600 dark:bg-stone-400 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to common questions about Daily Spiritual Lessons
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-medium text-stone-700 dark:text-stone-300 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Don't see your question answered here? We're here to help.
          </p>
          <a 
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-stone-600 dark:bg-stone-700 text-white rounded-lg hover:bg-stone-700 dark:hover:bg-stone-600 transition-colors duration-200 font-medium"
          >
            Contact Us
          </a>
        </div>

        {/* Bottom spacing */}
        <div className="mt-16"></div>
      </div>
      <Footer />
    </div>
  );
}