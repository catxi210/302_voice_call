'use client'
import { Footer } from '@/app/components/footer'
import { useLogin } from '@/app/hooks/use-login'
import { useTranslation } from '@/app/i18n/client'
import MainContent from '../components/main-content'
import Header from '../components/header'
import { cn } from '@/lib/utils'
import useSettings from '../hooks/use-settings'

export default function Home({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const { t } = useTranslation(locale)
  const { settings } = useSettings();
  useLogin(t)
  return (
    <>
      <div className="relative flex flex-col justify-start flex-1 min-h-full max-w-screen-md m-auto">
        <main className='flex flex-1 flex-col justify-center'>
          <header>
            <Header />
          </header>
          <MainContent />
        </main>
        {!settings?.hideBrand && (
          <Footer className={cn('mb-4')} />
        )}
      </div>
    </>
  )
}
