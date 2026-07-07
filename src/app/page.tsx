import { ChatProvider } from '@/components/ChatProvider'
import { ChatWidget } from '@/components/ChatWidget'
import { HeroSection } from '@/components/demo/HeroSection'
import { MenuSection } from '@/components/demo/MenuSection'
import { QuestionsCta } from '@/components/demo/QuestionsCta'
import { LeadCapture } from '@/components/demo/LeadCapture'
import { SiteFooter } from '@/components/demo/SiteFooter'

export default function Home() {
  return (
    <ChatProvider>
      <main>
        <HeroSection />
        <MenuSection />
        <QuestionsCta />
        <LeadCapture />
        <SiteFooter />
      </main>
      <ChatWidget />
    </ChatProvider>
  )
}
