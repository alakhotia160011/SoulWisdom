export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-200 mb-4">
            Privacy Policy
          </h1>
          <div className="w-24 h-1 bg-stone-600 dark:bg-stone-400 mx-auto mb-8"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Last updated: June 8, 2025
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 md:p-12 space-y-8">
          
          <section>
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                <strong>Email Address:</strong> When you subscribe to Daily Spiritual Lessons, we collect your email address to send you daily lessons.
              </p>
              <p>
                <strong>Usage Data:</strong> We automatically collect information about how you interact with our website, including pages visited and time spent on the site.
              </p>
              <p>
                <strong>Device Information:</strong> We may collect information about the device you use to access our service, including browser type and operating system.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-4">
              How We Use Your Information
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>To send you daily spiritual lesson emails</li>
              <li>To improve our website and user experience</li>
              <li>To respond to your questions and support requests</li>
              <li>To analyze usage patterns and optimize our content</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-4">
              Information Sharing
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We do not sell, trade, or share your personal information with third parties. Your email address is used solely for sending you Daily Spiritual Lessons and will never be shared with external organizations or used for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-4">
              Data Security
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your email data is stored securely and transmitted using encryption protocols.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-4">
              Your Rights
            </h2>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li><strong>Unsubscribe:</strong> You can unsubscribe from emails at any time by replying with "unsubscribe" in the subject line</li>
              <li><strong>Data Access:</strong> You can request information about what personal data we have about you</li>
              <li><strong>Data Deletion:</strong> You can request that we delete your personal information from our records</li>
              <li><strong>Data Portability:</strong> You can request a copy of your data in a machine-readable format</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-4">
              Cookies and Tracking
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our website uses minimal tracking technologies to improve user experience. We do not use third-party advertising cookies or tracking pixels. Any analytics data collected is used solely to understand how users interact with our content.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-4">
              Children's Privacy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Our service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-4">
              Changes to This Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-serif text-stone-700 dark:text-stone-300 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              If you have questions about this Privacy Policy or how we handle your personal information, please contact us at{" "}
              <a href="mailto:ary.lakhotia@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">
                ary.lakhotia@gmail.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-16"></div>
      </div>
    </div>
  );
}