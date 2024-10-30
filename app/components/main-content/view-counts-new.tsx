'use client'
import React from 'react';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration'; // 导入 duration 插件

dayjs.extend(duration)

const ViewCountsNew = (props: {
  count: number,
  /**
   * 是否正在使用，使用时显示为紫色数字
   * Whether it is currently in use, displaying as purple numbers when in use
   */
  inUse: boolean,
}) => {
  const { count, inUse } = props;

  const formattedTime = dayjs.duration(count * 1000).format('HH:mm:ss');

  return (
    <div
      className={`text-4xl text-center ${inUse ? 'text-purple-700 dark:text-purple-300' : ''}`}
      style={{
        fontFamily: "Dotted Songti Square"
      }}
    >
      {formattedTime}
    </div>
  );
};

export default ViewCountsNew;
