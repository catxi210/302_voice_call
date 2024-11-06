'use client'
import { cn } from '@/lib/utils'
import { useClientTranslation } from '../hooks/use-client-translation'
import LogoIcon from "./logo-icon"
import useSettings from '../hooks/use-settings'

/**
 * 头部标题
 * Header Title
 * @param props
 * @returns
 */
const Header = () => {
  const { t } = useClientTranslation()
  const { settings } = useSettings();
  return (
    <header
      className={cn(
        'flex flex-col items-center justify-center space-y-4 px-2 mt-8 z-10'
      )}
    >
      <div className='flex items-center space-x-4'>
        {!settings?.hideBrand && (
          <LogoIcon className='size-8 flex-shrink-0' />
        )}
        <h1 className='break-all text-3xl font-bold leading-tight tracking-tighter transition-all sm:text-4xl lg:leading-[1.1]'>
          {t('home:header.title')}
        </h1>
      </div>
    </header>
  )
}

export default Header
