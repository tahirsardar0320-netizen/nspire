"use client";

import MainLayout from "@/components/MainLayout";

export default function PrivacyPolicyClient() {
  return (
    <MainLayout>
      {/* Header */}
      <section className="bg-[#006795] py-16 md:py-24 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-white/70 text-lg">Last Updated: March 13, 2026</p>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-black mb-4">1. Information We Collect</h2>
            <p>At Nspire Home Inspections, we collect information that you voluntarily provide when you contact us, request a quote, schedule an inspection, or create an account on our platform. This may include your name, email address, phone number, property address, and any other details you share with us.</p>
            <p>We may also collect certain information automatically when you visit our website, including your IP address, browser type, device information, and usage data through cookies and similar technologies.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">2. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Process and manage your inspection requests and bookings</li>
              <li>Communicate with you about our services, promotions, and updates</li>
              <li>Generate and deliver inspection reports</li>
              <li>Improve our website, services, and customer experience</li>
              <li>Comply with legal and regulatory requirements</li>
              <li>Detect and prevent fraud or unauthorized access</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">3. Information Sharing and Disclosure</h2>
            <p>We do not sell your personal information. We may share your data with trusted third-party service providers who assist us in operating our business, such as payment processors, scheduling platforms, and email service providers. We may also disclose your information if required by law or to protect our legal rights.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">4. Data Security</h2>
            <p>We implement industry-standard security measures including encryption, secure servers, and access controls to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">5. Cookies and Tracking Technologies</h2>
            <p>Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can manage your cookie preferences through your browser settings.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">6. Your Rights</h2>
            <p>Depending on your location, you may have the right to access, correct, delete, or restrict the processing of your personal information. To exercise these rights, please contact us at <a href="mailto:info@nspireinspectionapp.com" className="text-[#006795] hover:underline">info@nspireinspectionapp.com</a>.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">7. Changes to This Policy</h2>
            <p>We may update this Privacy Policy periodically. We will notify you of any significant changes by posting the updated policy on our website and updating the "Last Updated" date.</p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-black mb-4">8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us:</p>
            <div className="bg-[#F8F9FA] p-8 rounded-[32px] border border-gray-100 mt-6">
              <p className="font-bold text-black mb-2">Nspire Home Inspections</p>
              <p>Email: <a href="mailto:info@nspireinspectionapp.com" className="text-[#006795] hover:underline">info@nspireinspectionapp.com</a></p>
              <p>Phone: <a href="tel:9202202220" className="text-[#006795] hover:underline">920-220-2220</a></p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
