import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'applicant' | 'case_manager';
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: ChatAttachment[];
}

export interface ChatAttachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface ChatConversation {
  id: string;
  participantIds: string[];
  participantNames: string[];
  lastMessage: ChatMessage;
  unreadCount: number;
  isActive: boolean;
}

export interface ChatState {
  conversations: ChatConversation[];
  currentConversation: string | null;
  messages: Record<string, ChatMessage[]>;
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  isLoading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<ChatConversation[]>) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action: PayloadAction<ChatConversation>) => {
      state.conversations.push(action.payload);
    },
    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversation = action.payload;
    },
    setMessages: (state, action: PayloadAction<{ conversationId: string; messages: ChatMessage[] }>) => {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },
    addMessage: (state, action: PayloadAction<{ conversationId: string; message: ChatMessage }>) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
      
      // Update conversation's last message
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.lastMessage = message;
        conversation.unreadCount += 1;
      }
    },
    markMessageAsRead: (state, action: PayloadAction<{ conversationId: string; messageId: string }>) => {
      const { conversationId, messageId } = action.payload;
      const messages = state.messages[conversationId];
      if (messages) {
        const message = messages.find(m => m.id === messageId);
        if (message) {
          message.isRead = true;
        }
      }
    },
    markConversationAsRead: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      const conversation = state.conversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.unreadCount = 0;
      }
      
      const messages = state.messages[conversationId];
      if (messages) {
        messages.forEach(message => {
          message.isRead = true;
        });
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const {
  setConversations,
  addConversation,
  setCurrentConversation,
  setMessages,
  addMessage,
  markMessageAsRead,
  markConversationAsRead,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer; 