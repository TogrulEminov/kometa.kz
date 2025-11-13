"use client";

import { useEffect, ReactNode } from "react";
import { message } from "antd";
import { useMessageStore } from "@/src/hooks/useMessageStore";

interface MessageProviderProps {
  children: ReactNode;
  maxCount?: number;
  duration?: number;
  top?: number;
  rtl?: boolean;
}

export function MessageProvider({
  children,
  maxCount = 3,
  duration = 3,
  top = 24,
  rtl = false,
}: MessageProviderProps) {
  const [messageApi, contextHolder] = message.useMessage({
    maxCount,
    duration,
    top,
    rtl,
  });

  const setMessageApi = useMessageStore((state) => state.setMessageApi);

  useEffect(() => {
    setMessageApi(messageApi);
  }, [messageApi, setMessageApi]);

  return (
    <>
      {contextHolder}
      {children}
    </>
  );
}
