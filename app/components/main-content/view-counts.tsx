'use client'
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'; // 导入 duration 插件

dayjs.extend(duration)

const ViewCounts = (props: {
  initialCount: number,
  interval: number,
  /**
   * 是否已经在开始计时
   * Whether the timer has already started
   */
  start: boolean,
  /**
   * 是否正在使用，使用时显示为紫色数字
   * Whether it is currently in use, displaying as purple numbers when in use
   */
  inUse: boolean,
}) => {
  const { initialCount, interval, start, inUse } = props;
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (!start) {
      return;
    }
    setCount(initialCount);
    const timer = setInterval(() => {
      setCount((prevCount) => prevCount + 1);
    }, interval);
    // 清除计时器，防止内存泄漏
    // Clear the timer to prevent memory leaks
    return () => clearInterval(timer);
  }, [start]);

  const formattedTime = dayjs.duration(count * 1000).format('HH:mm:ss');

  return (
    <div
      className={`text-4xl text-center ${inUse ? 'text-purple-700 dark:text-purple-300' : ''}`}
      style={{ fontFamily: "Dotted Songti Square" }}
    >
      {formattedTime}
    </div>
  );
};

export default ViewCounts;
