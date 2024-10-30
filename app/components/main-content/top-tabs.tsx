'use client'
import React, { CSSProperties } from "react"
import { useClientTranslation } from "@/app/hooks/use-client-translation"
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TopTabValue } from "@/types"

/**
 * 标签页切换组件
 * Tabs Component
 */
const TopTabs = (props: {
  activeTab: TopTabValue
  setActiveTab: (tab: TopTabValue) => void,
}) => {
  const { activeTab, setActiveTab } = props;
  const { t } = useClientTranslation()

  const isActive = (thisValue: TopTabValue) => activeTab === thisValue

  const tabsTriggerStyle: CSSProperties = {
    borderRadius: "100px",
  }

  return (
    <Tabs value={activeTab}>
      <TabsList
        className=' bg-white dark:bg-gray-800 h-16'
        style={{
          borderRadius: "100px",
          boxShadow: "2px 2px 15px  rgba(0, 0, 0, 0.05)"
        }}
      >
        <TabsTrigger
          className={`mx-3 px-0 py-0`}
          value='view_takie'
          style={tabsTriggerStyle}
          onClick={() => setActiveTab("view_takie")}
        >
          <p className={`h-12 px-9 py-6 flex flex-col justify-center ${isActive('view_takie') ? 'bg-purple-700 text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-500'}`}
            style={tabsTriggerStyle}
          >
            {t('home:main.view_takie')}
          </p>
        </TabsTrigger>
        <TabsTrigger
          className={`mx-3 px-0 py-0`}
          value='view_phone'
          onClick={() => setActiveTab("view_phone")}
          style={tabsTriggerStyle}
        >
          <p className={`h-12 px-9 py-6 flex flex-col justify-center ${isActive('view_phone') ? 'bg-purple-700 text-white' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-500'}`}
            style={tabsTriggerStyle}
          >
            {t('home:main.view_phone')}
          </p>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  )
}

export default TopTabs
