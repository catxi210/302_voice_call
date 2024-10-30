'use client'
import { useState } from "react";
import toast from "react-hot-toast";
import TopTabs from "./top-tabs";
import { TopTabValue } from "@/types";
import SettingContent from "./setting-content";
import { useClientTranslation } from "@/app/hooks/use-client-translation";
import ActionContents from "./action-contents";

/**
 * 主要内容
 * Main Content
 * @returns
 */
const MainContent = () => {
  const { t } = useClientTranslation();
  // 选中标签
  // Selected tab
  const [activeTab, setActiveTab] = useState<TopTabValue>("view_phone");
  // 是否禁用设置和切换标签
  // Whether to disable settings and tab switching
  const [disableTabs, setDisabledTabs] = useState(false);

  const onClickChangeTab = (newTab: TopTabValue) => {
    if (disableTabs) {
      toast.error(t("home:main.is_connecting_warning"))
      return;
    }
    setActiveTab(newTab)
  }

  const onClickDisabled = () => {
    toast.error(t("home:main.advanced_options_should_not_click"))
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center mb-9 md:mb-12 mt-4 md:mt-10">
        <TopTabs
          activeTab={activeTab}
          setActiveTab={newTab => onClickChangeTab(newTab)}
        />
      </div>
      <ActionContents
        activeTab={activeTab}
        onChangeDisabledTopTabs={newFlag => setDisabledTabs(newFlag)}
      />
      <div className={`relative flex flex-row mt-9 mb-4`}>
        {disableTabs && (
          <div className="absolute z-10 left-0 right-0 bottom-0 top-0 cursor-not-allowed opacity-35 rounded-2xl" onClick={() => onClickDisabled()}></div>
        )}
        <SettingContent />
      </div>
    </div>
  )
}
export default MainContent;
