'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import ActionButton from '../action-button'
import { RealtimeClient } from '@openai/realtime-api-beta'
import { getInstructions } from '../instructions'
import toast from 'react-hot-toast'
import { useClientTranslation } from '@/app/hooks/use-client-translation'
import { WavRecorder, WavStreamPlayer } from '@/lib/wavtools/index.js'
import { clearTimeout, setTimeout, setInterval } from 'timers'
import { getLocalStorage } from '@/lib/utils'
import {
  AdvancdeOptionsKey,
  AdvancedOptions,
  PersonalityValueCustom,
} from '@/types'
import { logger } from '@/lib/logger'
import IconPhoneDisconnect from '../../icons/icon-phone-disconnect'
import getRealtimeClient from '../get-realtime-client'
import useHasPermission from '@/app/hooks/use-has-permission'

/**
 * 标签 - 电话
 * Tab - Phone
 * @param props
 * @returns
 */
const ActionPhone = (props: {
  /**
   * 用于控制本组件是否开始连接，触发useEffect
   * Used to control whether this component starts connecting, triggering useEffect
   */
  startConnect: boolean
  /**
   * 连接成功后的回调
   * Callback after successful connection
   * @returns
   */
  afterConnectSuccess: () => void
  /**
   * 断开连接后的回调
   * Callback after disconnection
   * @returns
   */
  onDisconnect: () => void,
  updateTimerCounts: (counts: number) => void,
}) => {
  const {
    onDisconnect: onDisconnectParent,
    startConnect,
    afterConnectSuccess: afterConnectSuccessParent,
    updateTimerCounts
  } = props;
  const { t } = useClientTranslation();

  /**
   * 用户自设定超时
   * User-defined timeout
   */
  const disconnectTimer = useRef<NodeJS.Timeout | null>(null)
  /**
   * 空闲超时
   * Idle timeout
   */
  const disconnectIdleTimer = useRef<NodeJS.Timeout | null>(null)
  /**
   * 秒数计时器
   * Seconds timer
   */
  const counterTimer = useRef<NodeJS.Timeout | null>(null)

  /**
   * 录音机
   * Audio recorder
   */
  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  )
  /**
   * 声音播放器
   * Audio player
   */
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  )
  /**
   * OpenAI 连接用的对象
   * Object used for OpenAI connection
   */
  const clientRef = useRef<RealtimeClient>(getRealtimeClient())

  const { doAjax: doAjaxHasPermission } = useHasPermission()

  const advancedOptions = useRef<AdvancedOptions>({
    autoHangUp: 0,
    hangUpWhenIdle: false,
    personalityValue: '',
    personalityInputValue: '',
    voiceValue: 'alloy',
  })

  const [isRecoding, setIsRecording] = useState(false)

  const onClickDisconnect = () => {
    const client = clientRef.current
    const wavRecorder = wavRecorderRef.current
    const wavStreamPlayer = wavStreamPlayerRef.current
    try {
      wavStreamPlayer.interrupt()
      wavRecorder.getStatus() !== 'ended' && wavRecorder.end()
      client.disconnect()
    } catch (error) {}
    setIsRecording(false)
    onDisconnectParent()
  }

  /**
   * 初始化/获取高级设置
   * Initialize/Retrieve advanced settings
   * @returns
   */
  const initAdvancedOptions = () => {
    const saveData = getLocalStorage(AdvancdeOptionsKey)
    if (!saveData) {
      return
    }
    try {
      const dataObject: AdvancedOptions = JSON.parse(saveData)
      const {
        autoHangUp,
        hangUpWhenIdle,
        personalityValue,
        personalityInputValue,
        voiceValue = 'alloy',
      } = dataObject

      advancedOptions.current = {
        autoHangUp,
        hangUpWhenIdle,
        personalityValue,
        personalityInputValue,
        voiceValue,
      }
    } catch (error) {
      logger.error(error)
    }
  }

  /**
   * 初始化OpenAI以及播放器
   * Initialize OpenAI and the audio player
   */
  const connectConversation = useCallback(async () => {
    const client = clientRef.current
    const wavRecorder = wavRecorderRef.current
    const wavStreamPlayer = wavStreamPlayerRef.current

    // Connect to audio output
    // 连接到音频输出
    try {
      await wavRecorder.begin()
    } catch (error) {
      toast.error(t('home:main.connect_microphone_error'))
      onClickDisconnect()
      return
    }

    // has permission
    const { flag, errorHint } = await doAjaxHasPermission()


    if (!flag) {
      if (errorHint) {
        toast.error(t('home:main.connect_error'))
      }
      onClickDisconnect()
      return
    }

    // Connect to audio output
    await wavStreamPlayer.connect()

    try {
      // Connect to realtime API
      await client.connect()
    } catch (error) {
      console.log("wtf");
      toast.error(t('home:main.connect_error'))
      onClickDisconnect()
      return
    }
    // 尝试发送消息
    true &&
      client.sendUserMessageContent([
        {
          type: `input_text`,
          text: t('home:main.fist_ask_demo'),
        },
      ])

    await wavRecorder.record((data) => client.appendInputAudio(data.mono))

    let count = 0
    counterTimer.current = setInterval(() => {
      // 设置更新父级数字
      // Update the parent component's count
      count++;
      updateTimerCounts(count)
      // 设置空闲自动挂断
      // Set up idle auto hang-up
      if (advancedOptions.current.hangUpWhenIdle) {
        // 如果播放器没有播放AI声音 / 用户没有在录音，则不触发
      // If the player is not playing AI sound / user is not recording, do not trigger
        if (!!wavStreamPlayerRef.current.stream || isRecoding) {
          if (disconnectIdleTimer.current) {
            clearTimeout(disconnectIdleTimer.current)
            disconnectIdleTimer.current = null
          }
          return
        }
        if (!!disconnectIdleTimer.current) {
          return
        }
        // 空闲10秒后，断开连接
        // disconnect after 10s
        // 但是暂时不太行，因为无法根据已有条件判断“空闲”
        // now can't know how it empty
        // disconnectIdleTimer.current = setTimeout(() => {
        //   toast.success(t("home:main.over_idle_time"))
        //   onClickDisconnect();
        // }, 10 * 1000);
      }
    }, 1000)
    const { autoHangUp } = advancedOptions.current
    // 设置超时停止
    // reset
    if (autoHangUp > 0) {
      disconnectTimer.current = setTimeout(() => {
        onClickDisconnect()
      }, autoHangUp * 1000)
    }
    afterConnectSuccessParent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!startConnect) {
      return
    }

    const wavStreamPlayer = wavStreamPlayerRef.current

    clientRef.current = getRealtimeClient()

    const client = clientRef.current

    initAdvancedOptions()

    const { personalityInputValue, personalityValue, voiceValue } =
      advancedOptions.current

    const instructions: string = getInstructions(
      personalityValue === PersonalityValueCustom
        ? personalityInputValue.split(' ')
        : []
    )

    client.updateSession({ instructions: instructions })
    client.updateSession({ input_audio_transcription: { model: 'whisper-1' } })
    client.updateSession({
      // @ts-ignore
      voice: voiceValue,
    })
    client.updateSession({
      turn_detection: { type: 'server_vad' },
    })
    client.on('error', (event: any) => {
      console.error(event)
      toast.error(t('home:main.connect_error'))
      onClickDisconnect()
    })
    client.on('conversation.updated', async ({ item, delta }: any) => {
      // const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id)
      }
      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        )
        item.formatted.file = wavFile
      }
      wavStreamPlayer.interruptedTrackIds

      // setItems(items);
    })
    client.on('conversation.interrupted', async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt()
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset
        await client.cancelResponse(trackId, offset)
      }
    })
    // Set transcription, otherwise we don't get user transcriptions back

    connectConversation()

    return () => {
      // OpenAI断开连接
      // OpenAI reset
      client.reset()
      // 清除定时器
      // clear timer
      if (disconnectTimer.current) {
        clearTimeout(disconnectTimer.current)
        disconnectTimer.current = null
      }
      if (disconnectIdleTimer.current) {
        clearTimeout(disconnectIdleTimer.current)
        disconnectIdleTimer.current = null
      }
      if (counterTimer.current) {
        clearTimeout(counterTimer.current)
        counterTimer.current = null
      }
    }
  }, [startConnect])

  return (
    <>
      <ActionButton
        onClick={() => onClickDisconnect()}
        className={
          'bg-red-400 hover:bg-red-500 dark:bg-red-600 dark:hover:bg-red-600'
        }
      >
        <IconPhoneDisconnect className='m-auto my-auto' />
      </ActionButton>
    </>
  )
}
export default ActionPhone
