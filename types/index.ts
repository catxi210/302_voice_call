interface Resp<T> {
  code: number
  success: boolean
  message: string
  data: T
}

/**
 * 选项卡可选值
 * Possible values for the top tab
 */
declare type TopTabValue = "view_takie" | "view_phone";

/**
 * 本地保存高级设置
 * Locally saved advanced options
 */
interface AdvancedOptions {
  autoHangUp: number,
  hangUpWhenIdle: boolean,
  personalityValue: string,
  personalityInputValue: string,
  voiceValue: VoiceValue,
}

/**
 * 本地保存高级配置的key
 * Key for locally saving advanced options
 */
const AdvancdeOptionsKey = "options"

/**
 * 人格指令 - 默认值
 * Personality command - default value
 */
const PersonalityValueDefault = "default";

/**
 * 人格指令 - 自定义值
 * Personality command - custom value
 */
const PersonalityValueCustom = "custom";

/**
 * 音色 - 可取值
 * Voice - possible values
 */
declare type VoiceValue = "alloy" | "echo" | "shimmer";

export type { TopTabValue, AdvancedOptions, VoiceValue, }
export { AdvancdeOptionsKey, PersonalityValueDefault, PersonalityValueCustom }
