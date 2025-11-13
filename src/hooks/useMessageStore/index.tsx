import { create } from "zustand";
import type { MessageInstance } from "antd/es/message/interface";

interface MessageStore {
  messageApi: MessageInstance | null;
  setMessageApi: (api: MessageInstance) => void;
  success: (content: string, duration?: number) => void;
  error: (content: string, duration?: number) => void;
  warning: (content: string, duration?: number) => void;
  info: (content: string, duration?: number) => void;
  loading: (content: string, duration?: number) => void;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messageApi: null,

  setMessageApi: (api) => set({ messageApi: api }),

  success: (content, duration = 3) => {
    const { messageApi } = get();
    if (messageApi) {
      messageApi.success({ content, duration });
    }
  },

  error: (content, duration = 3) => {
    const { messageApi } = get();
    if (messageApi) {
      messageApi.error({ content, duration });
    }
  },

  warning: (content, duration = 3) => {
    const { messageApi } = get();
    if (messageApi) {
      messageApi.warning({ content, duration });
    }
  },

  info: (content, duration = 3) => {
    const { messageApi } = get();
    if (messageApi) {
      messageApi.info({ content, duration });
    }
  },

  loading: (content, duration = 2.5) => {
    const { messageApi } = get();
    if (messageApi) {
      messageApi.loading({ content, duration });
    }
  },
}));
