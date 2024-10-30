'use client'
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import * as Switch from "@/components/ui/switch"
import { PersonalitySelector } from "./personality-selector";
import { clearTimeout, setTimeout } from "timers";
import toast from "react-hot-toast";
import { useClientTranslation } from "@/app/hooks/use-client-translation";
import { AdvancdeOptionsKey, AdvancedOptions, PersonalityValueCustom, PersonalityValueDefault, VoiceValue } from "@/types";
import { getLocalStorage, removeLocalStorage, setLocalStorage } from "@/lib/utils";
import SKChaseLoading from "@/components/ui/sk-chase-loading";
import { VoiceSelector } from "./voice-seletor";

/**
 * 高级设置
 * @returns
 */
const SettingContent = () => {

  const { t } = useClientTranslation();

  const [isInited, setIsInited] = useState(false);

  const [autoHangUp, setAutoHangUp] = useState(0);

  const [hangUpWhenIdle, setHangUpWhenIdle] = useState(false);

  const [personalityValue, setPersonalityValue] = useState(PersonalityValueDefault);

  const [personalityInputValue, setPersonalityInputValue] = useState("");

  const [voiceValue, setVoiceValue] = useState<VoiceValue>("alloy");

  const maxAutoHangUp = 60 * 60;
  /**
   * 保存高技设置的值
   * @returns
   */
  const saveConfig = () => {
    if (autoHangUp > maxAutoHangUp) {
      toast.error(t("home:main.over_max_hangup_time"))
      return;
    }
    if (autoHangUp < 0) {
      toast.error(t("home:main.less_than_min_hangup_time"))
      return;
    }

    const saveData: AdvancedOptions = {
      autoHangUp, hangUpWhenIdle, personalityValue, personalityInputValue, voiceValue
    }

    const saveDataJson = JSON.stringify(saveData);

    setLocalStorage(AdvancdeOptionsKey, saveDataJson)
  }
  /**
   * 初始化高级设置的值
   */
  const initConfig = () => {
    const saveData = getLocalStorage(AdvancdeOptionsKey);
    if (!saveData) {
      setTimeout(() => {
        setIsInited(true);
      }, 200);
      return;
    }
    try {
      const dataObject: AdvancedOptions = JSON.parse(saveData);
      const {
        autoHangUp,
        hangUpWhenIdle,
        personalityValue,
        personalityInputValue,
        voiceValue: voiceValueSaved = voiceValue,
      } = dataObject;
      if (hangUpWhenIdle) {
        throw new Error("")
      }
      setAutoHangUp(autoHangUp)
      setHangUpWhenIdle(hangUpWhenIdle)
      setPersonalityValue(personalityValue)
      setPersonalityInputValue(personalityInputValue)
      setVoiceValue(voiceValueSaved)
    } catch (error) {
      removeLocalStorage(AdvancdeOptionsKey)
    }
    setTimeout(() => {
      setIsInited(true);
    }, 200);
  }

  useEffect(() => {
    if (!isInited) {
      initConfig();
      return;
    }
    const timer = setTimeout(() => {
      saveConfig()
    }, 1000)

    return () => {
      clearTimeout(timer)
    }
  }, [
    autoHangUp,
    hangUpWhenIdle,
    personalityValue,
    personalityInputValue,
    voiceValue
  ])

  return (
    <>
      <div key={isInited + ""} className="flex flex-col justify-start w-full p-3 relative z-0">
        <SKChaseLoading loading={!isInited} />
        <div className="text-base leading-9 text-black dark:text-white">
          <p>{t("home:main.title_advance_options")}</p>
        </div>
        <div className="flex flex-col w-full mt-3">
          <div className="flex w-full flex-row justify-between">
            <div className="text-sm leading-9 text-black dark:text-white">
              <p>{t("home:main.title_auto_hang_up")}</p>
            </div>
            <div className="w-20">
              <Input
                max={maxAutoHangUp}
                min={0}
                className="text-center bg-white dark:bg-slate-700"
                type="number"
                defaultValue={autoHangUp}
                onChange={e => {
                  e.target.value && setAutoHangUp(Number(e.target.value));
                }}
              />
            </div>
          </div>
          <div className="text-xs text-gray-400 dark:text-slate-100 mt-1">
            <p>
              {t("home:main.sub_title_auto_hang_up")}
            </p>
          </div>
        </div>
        {false && (
          <div className="flex flex-col w-full mt-3">
            <div className="flex w-full flex-row justify-between">
              <div className="text-sm leading-9 text-black dark:text-white">
                <p>{t("home:main.title_hang_up_when_space")}</p>
              </div>
              <div className="flex flex-col justify-center">
                <Switch.Root
                  defaultChecked={hangUpWhenIdle}
                  onCheckedChange={newFlag => setHangUpWhenIdle(newFlag)}
                >
                  <Switch.Thumb />
                </Switch.Root>
              </div>
            </div>
            <div className="text-xs text-gray-400 dark:text-slate-100 mt-1">
              <p>
                {t("home:main.sub_title_hang_up_when_space")}
              </p>
            </div>
          </div>
        )}
        <div className="flex flex-col w-full mt-3 mb-4">
          <div className="flex w-full flex-row justify-between">
            <div className="text-sm leading-9 text-black dark:text-white">
              <p>{t("home:main.title_voice")}</p>
            </div>
            <div className="flex flex-col justify-center">
              <VoiceSelector
                defaultValue={voiceValue}
                onChange={newValue => setVoiceValue(newValue)}
              >

              </VoiceSelector>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full mt-3 mb-7">
          <div className="flex w-full flex-row justify-between">
            <div className="text-sm leading-9 text-black dark:text-white">
              <p>{t("home:main.title_personality")}</p>
            </div>
            <div className="flex flex-col justify-center">
              <PersonalitySelector
                defaultValue={personalityValue}
                onChange={newValue => setPersonalityValue(newValue)}
              >

              </PersonalitySelector>
            </div>
          </div>
          {PersonalityValueCustom === personalityValue && (
            <div className="text-xs text-gray-400 dark:text-slate-100 mt-2">
              <textarea
                placeholder={false ? t("home:main.place_holder_personality") : undefined}
                defaultValue={personalityInputValue}
                className="w-full focus:outline-purple-700 dark:focus:outline-gray-100 dark:bg-slate-800 dark:text-slate-50 p-2 min-h-16"
                maxLength={400}
                onChange={e => setPersonalityInputValue(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default SettingContent;
