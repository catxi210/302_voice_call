'use client'
import { useCallback, useEffect, useRef, useState } from "react"
import IconMic from "../../icons/icon-mic"
import IconPower from "../../icons/icon-power"
import ActionButton from "../action-button"
import IconMicLoud from "../../icons/icon-mic-loud"
import { RealtimeClient } from "@openai/realtime-api-beta"
import { getInstructions } from "../instructions"
import toast from "react-hot-toast"
import { useClientTranslation } from "@/app/hooks/use-client-translation"
import { WavRecorder, WavStreamPlayer } from "@/lib/wavtools/index.js"
import { clearTimeout, setTimeout, setInterval } from "timers"
import { getLocalStorage } from "@/lib/utils"
import { AdvancdeOptionsKey, AdvancedOptions, PersonalityValueCustom } from "@/types"
import { logger } from "@/lib/logger"
import getRealtimeClient from "../get-realtime-client"

/**
 * 标签 - 对讲机
 * Tab - Takie
 * @param props
 * @returns
 */
const ActionTalkie = (props: {
  /**
   * 用于控制本组件是否开始连接，触发useEffect
   * Used to control whether this component starts connection, triggering useEffect
   */
  startConnect: boolean,
  /**
   * 连接成功后的回调
   * Callback after successful connection
   * @returns
   */
  afterConnectSuccess: () => void,
  /**
   * 断开连接后的回调
   * Callback after disconnection
   * @returns
   */
  onDisconnect: () => void,
  /**
   * 是否正在使用
   * Whether it is currently in use
   * @param newFlag
   * @returns
   */
  onChangeInUse: (newFlag: boolean) => void,
  updateTimerCounts: (counts: number) => void,
}) => {
  const {
    onDisconnect: onDisconnectParent,
    startConnect,
    afterConnectSuccess: afterConnectSuccessParent,
    onChangeInUse: onChangeInUseParent,
    updateTimerCounts
  } = props;
  const { t } = useClientTranslation();

  /**
   * 用户自设定超时
   * User-defined timeout
   */
  const disconnectTimer = useRef<NodeJS.Timeout | null>(null);
  /**
   * 空闲超时倒计时计时器
   * Idle timeout countdown timer
   */
  const disconnectIdleTimer = useRef<NodeJS.Timeout | null>(null);
  /**
   * 秒数计时器
   * Second counter timer
   */
  const counterTimer = useRef<NodeJS.Timeout | null>(null);
  /**
   * 录音机
   * Audio recorder
   */
  const wavRecorderRef = useRef<WavRecorder>(
    new WavRecorder({ sampleRate: 24000 })
  );
  /**
   * 声音播放器
   * Audio player
   */
  const wavStreamPlayerRef = useRef<WavStreamPlayer>(
    new WavStreamPlayer({ sampleRate: 24000 })
  );
  /**
   * OpenAI 连接用的对象
   * Object used for OpenAI connection
   */
  const clientRef = useRef<RealtimeClient>(getRealtimeClient());
  const advancedOptions = useRef<AdvancedOptions>({
    autoHangUp: 0,
    hangUpWhenIdle: false,
    personalityValue: "",
    personalityInputValue: "",
    voiceValue: "alloy",
  });
  const [isRecoding, setIsRecording] = useState(false);

  const onClickDisconnect = () => {
    const client = clientRef.current
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;
    try {
      wavStreamPlayer.interrupt();
      wavRecorder.getStatus() !== "ended" && wavRecorder.end();
      client.disconnect();
    } catch (error) { }
    setIsRecording(false);
    onDisconnectParent();
  }

  const onMousedown = async () => {
    setIsRecording(true);
    onChangeInUseParent(true);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    // 暂停播放AI声音
    // Pause playing AI sound
    const trackSampleOffset = await wavStreamPlayer.interrupt();
    if (trackSampleOffset?.trackId) {
      // 如果上一次还没播完，取消上一次的请求
      // If the previous playback was not finished, cancel the previous request
      const { trackId, offset } = trackSampleOffset;
      await client.cancelResponse(trackId, offset);
    }

    // 开始录音
    // Start recording
    await wavRecorder.record((data) => client.appendInputAudio(data.mono));
  }

  const onMouseUp = async () => {
    // 如果并没有在记录录音，则不触发停止
    // If not currently recording, do not trigger stop
    if (!isRecoding) return;

    setIsRecording(false);
    // return; (This line seems unnecessary and can be removed)
    onChangeInUseParent(false);
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;

    try {
      await wavRecorder.pause();
    } catch (error) {
      // Handle error if necessary
    }

    client.createResponse();
  }

  /**
   * 初始化/获取高级设置
   * Initialize/Retrieve advanced settings
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
      advancedOptions.current = { autoHangUp, hangUpWhenIdle, personalityValue, personalityInputValue, voiceValue };
    } catch (error) {
      logger.error(error);
    }
  }


  /**
   * 初始化OpenAI以及播放器
   * Initialize OpenAI and the audio player
   */
  const connectConversation = useCallback(async () => {
    const client = clientRef.current;
    const wavRecorder = wavRecorderRef.current;
    const wavStreamPlayer = wavStreamPlayerRef.current;

    // Connect to microphone
    try {
      await wavRecorder.begin();
    } catch (error) {
      toast.error(t("home:main.connect_microphone_error"))
      onClickDisconnect();
      return;
    }

    // Connect to audio output
    await wavStreamPlayer.connect();

    let connectedFlag = false;
    // 尝试3次连接
    // 连接到音频输出
    // try 3 times connect to audio output
    for (let index = 0; index < 3; index++) {
      const sleep = new Promise(resolve => setTimeout(() => resolve(null), 3000))
      if (index !== 0) {
        await sleep;
      }
      try {
        // Connect to realtime API
        await client.connect();
        connectedFlag = true;
        break;
      } catch (error) {
        logger.error(error)
      }
    }
    if (!connectedFlag) {
      toast.error(t("home:main.connect_error"))
      onClickDisconnect();
      return;
    }

    // 尝试发送消息
    // Try sending a message
    true && client.sendUserMessageContent([
      {
        type: `input_text`,
        text: t("home:main.fist_ask_demo"),
      },
    ]);

    let count = 0;
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
            disconnectIdleTimer.current = null;
          }
          return;
        }
        if (!!disconnectIdleTimer.current) {
          return;
        }
        // 空闲10秒后，断开连接
        // disconnect after 10s
        disconnectIdleTimer.current = setTimeout(() => {
          toast.success(t("home:main.over_idle_time"))
          onClickDisconnect();
        }, 10 * 1000);
      }
    }, 1000)

    const { autoHangUp } = advancedOptions.current;
    // 设置超时停止
    // reset
    if (autoHangUp > 0) {
      disconnectTimer.current = setTimeout(() => {
        onClickDisconnect();
      }, autoHangUp * 1000);
    }

    afterConnectSuccessParent()
  }, []);

  useEffect(() => {

    if (!startConnect) {
      return;
    }

    const wavStreamPlayer = wavStreamPlayerRef.current;

    clientRef.current = getRealtimeClient();

    const client = clientRef.current;

    initAdvancedOptions();

    const {
      personalityInputValue,
      personalityValue,
      voiceValue
    } = advancedOptions.current;

    const instructions: string = getInstructions(personalityValue === PersonalityValueCustom ? personalityInputValue.split(" ") : []);

    client.updateSession({ instructions: instructions });
    client.updateSession({ input_audio_transcription: { model: 'whisper-1' } });
    client.updateSession({ voice: voiceValue });
    client.on('error', (event: any) => {
      console.error(event)
      toast.error(t("home:main.connect_error"))
      onClickDisconnect();
    });
    client.on('conversation.updated', async ({ item, delta }: any) => {
      // const items = client.conversation.getItems();
      if (delta?.audio) {
        wavStreamPlayer.add16BitPCM(delta.audio, item.id);
      }
      if (item.status === 'completed' && item.formatted.audio?.length) {
        const wavFile = await WavRecorder.decode(
          item.formatted.audio,
          24000,
          24000
        );
        item.formatted.file = wavFile;
      }
      wavStreamPlayer.interruptedTrackIds

      // setItems(items);
    });
    client.on('conversation.interrupted', async () => {
      const trackSampleOffset = await wavStreamPlayer.interrupt();
      if (trackSampleOffset?.trackId) {
        const { trackId, offset } = trackSampleOffset;
        await client.cancelResponse(trackId, offset);
      }
    });
    // Set transcription, otherwise we don't get user transcriptions back

    connectConversation();

    return () => {
      // OpenAI断开连接
      // OpenAI reset
      client.reset()
      // 清除定时器
      // clear timer
      if (disconnectTimer.current) {
        clearTimeout(disconnectTimer.current)
        disconnectTimer.current = null;
      }
      if (disconnectIdleTimer.current) {
        clearTimeout(disconnectIdleTimer.current)
        disconnectIdleTimer.current = null;
      }
      if (counterTimer.current) {
        clearTimeout(counterTimer.current)
        counterTimer.current = null;
      }
    }
  }, [startConnect])

  return (
    <>
      <ActionButton
        className={`${isRecoding ? 'bg-green-400 hover:bg-green-400 dark:bg-green-400 dark:hover:bg-green-400' : 'hover:bg-gray-100'}`}
        // onMouseDown={() => onMousedown()}
        // onMouseUp={() => onMouseUp()}
        onClick={() => isRecoding ? onMouseUp() : onMousedown()}
      >
        <>
          {isRecoding ? (
            <IconMicLoud
              className="m-auto my-auto z-0"
            />
          ) : (
            <IconMic
              className="m-auto my-auto z-0"
            />
          )}
        </>
      </ActionButton>
      <div className="absolute -right-1/2 top-0 bottom-0 flex flex-col justify-center z-10">
        <div
          className="min-w-12 min-h-12 bg-red-500 hover:bg-red-600 rounded-2xl flex flex-col justify-center shadow-md"
          onClick={() => onClickDisconnect()}
        >
          <IconPower className="m-auto" />
        </div>
      </div>
    </>
  )
}
export default ActionTalkie;
