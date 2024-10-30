'use client'
import { AdvancdeOptionsKey, AdvancedOptions, TopTabValue } from "@/types"
import ActionButton from "../action-button";
import IconLink from "../../icons/icon-link";
import { useRef, useState } from "react";
import IconLinkColored from "../../icons/icon-link-colored";
import ActionTalkie from "../action-talkie";
import ActionPhone from "../action-phone";
import ViewCountsNew from "../view-counts-new";
import { getLocalStorage } from "@/lib/utils";
import { logger } from "@/lib/logger";
import IconPhone from "../../icons/icon-phone";
import IconPhoneColored from "../../icons/icon-phone-colored";

const ActionContents = (props: {
  activeTab: TopTabValue,
  onChangeDisabledTopTabs: (disabled: boolean) => void,
}) => {

  const { activeTab, onChangeDisabledTopTabs } = props;

  // 是否连接上
  // Whether it is connected
  const [isConnect, setIsConnect] = useState(false);

  // 是否正在连接
  // Whether it is connecting
  const [connectLoading, setConnectLoading] = useState(false);

  // 是否让子级开始连接行为
  // Whether to trigger child components to start connecting
  const [startTrigger, setStartTrigger] = useState(false);

  // 是否让计时器显示为正在使用
  // Whether to display the timer as in use
  const [viewCountInUse, setViewCountInUse] = useState(false);

  // 当前秒数
  // Current count of seconds
  const [counts, setCounts] = useState(0)

  const advancedOptions = useRef<AdvancedOptions>({
    autoHangUp: 0,
    hangUpWhenIdle: false,
    personalityValue: "",
    personalityInputValue: "",
    voiceValue: "alloy",
  });

  /**
   * 初始化/获取高级设置
   * Initialize/Get advanced options
   * @returns
   */
  const initAdvancedOptions = () => {
    const saveData = getLocalStorage(AdvancdeOptionsKey);
    if (!saveData) {
      return;
    }
    try {
      const dataObject: AdvancedOptions = JSON.parse(saveData);
      const { autoHangUp, hangUpWhenIdle, personalityValue, personalityInputValue, voiceValue = "alloy" } = dataObject;
      advancedOptions.current = { autoHangUp, hangUpWhenIdle, personalityValue, personalityInputValue, voiceValue }
    } catch (error) {
      logger.error(error)
    }
  }

  const onClickConnect = async () => {
    setCounts(0)
    setConnectLoading(true);
    onChangeDisabledTopTabs(true);
    initAdvancedOptions();
    setStartTrigger(true);
  }

  const afterConnectSuccess = () => {
    setIsConnect(true)
    setConnectLoading(false)
  }

  const onClickDisconnect = () => {
    setStartTrigger(false);
    setIsConnect(false)
    // 当出错时还在加载状态，取消加载状态
    // When there is an error and it is still loading, cancel the loading state
    setConnectLoading(false);
    // 当还在使用时，重置为未使用
    // When it is still in use, reset to not in use
    setViewCountInUse(false);
    onChangeDisabledTopTabs(false);
  }

  return (
    <>
      <div className="flex flex-row justify-center mb-9 md:mb-12">
        <ViewCountsNew
          inUse={viewCountInUse}
          count={counts}
        />
      </div>
      <div className="flex flex-row justify-center">
        <div className="flex relative flex-col justify-center mx-auto my-auto shadow-md text-4xl rounded-full cursor-pointer bg-white dark:bg-gray-800"
          style={{
            width: "148px",
            height: "148px"
          }}
        >
          {(!isConnect && !connectLoading) ? (
            // 未连接
            // before link
            <>
              <ActionButton
                onClick={() => onClickConnect()}
                className={""}
              >
                {activeTab === "view_takie" && (
                  <IconLink
                    className="m-auto my-auto"
                  />
                )}
                {activeTab === "view_phone" && (
                  <IconPhone
                    className="m-auto my-auto"
                  />
                )}

              </ActionButton>
            </>
          ) : connectLoading ? (
            // 连接中
            // linking
            <ActionButton
              className={"bg-gray-100 cursor-wait"}
            >
              <>
                {activeTab === "view_takie" && (
                  <IconLinkColored
                    className="m-auto my-auto"
                  />
                )}
                {activeTab === "view_phone" && (
                  <IconPhoneColored
                    className="m-auto my-auto"
                  />
                )}
              </>
            </ActionButton>
          ) : null}
          {/* 连接后 */}
          {/* linked */}
          <>
            <div className={(isConnect && activeTab === "view_takie") ? `block` : `hidden`}>
              <ActionTalkie
                onChangeInUse={newFlag => setViewCountInUse(newFlag)}
                startConnect={startTrigger && activeTab === "view_takie"}
                afterConnectSuccess={() => afterConnectSuccess()}
                onDisconnect={() => onClickDisconnect()}
                updateTimerCounts={newCounts => setCounts(newCounts)}
              />
            </div>
            <div className={(isConnect && activeTab === "view_phone") ? `block` : `hidden`}>
              <ActionPhone
                onDisconnect={() => onClickDisconnect()}
                startConnect={startTrigger && activeTab === "view_phone"}
                afterConnectSuccess={() => {
                  afterConnectSuccess();
                  setViewCountInUse(true);
                }}
                updateTimerCounts={newCounts => setCounts(newCounts)}
              />
            </div>
          </>
        </div>
      </div>
    </>
  )
}

export default ActionContents;
