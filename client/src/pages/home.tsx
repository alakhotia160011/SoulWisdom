import Header from "@/components/header";
import TodaysLesson from "@/components/todays-lesson";
import TraditionsOverview from "@/components/traditions-overview";
import LessonArchive from "@/components/lesson-archive";
import EmailSubscription from "@/components/email-subscription";
import WhatsAppSubscription from "@/components/whatsapp-subscription";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-earth-50">
      <Header />
      <TodaysLesson />
      <TraditionsOverview />
      <LessonArchive />
      <EmailSubscription />
      <WhatsAppSubscription />
      <Footer />
    </div>
  );
}
