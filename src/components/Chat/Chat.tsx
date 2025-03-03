import React from "react";
import { useRouter } from "next/navigation";
import useChat from "@/hooks/useChat";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import styles from "./Chat.module.css";

interface ChatProps {
  chatId: number;
}

const Chat: React.FC<ChatProps> = ({ chatId }) => {
  const router = useRouter();
  const {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    userLogin,
    loading,
    sending,
    messagesEndRef,
  } = useChat(chatId);

  const goToUserProfile = (login: string) => {
    router.push(`/user/${login}`);
  };

  return (
    <div className={styles.chatContainer}>
      <h2 className={styles.chatTitle}>💬 Чат {chatId}</h2>
      {loading ? (
        <p className="text-center">⏳ Загрузка сообщений...</p>
      ) : (
        <MessageList
          chatId={chatId} // Передаём chatId
          messages={messages}
          userLogin={userLogin}
          messagesEndRef={messagesEndRef}
          onUserClick={goToUserProfile}
        />
      )}
      <MessageInput
        newMessage={newMessage}
        onMessageChange={(e) => setNewMessage(e.target.value)}
        onSendMessage={handleSendMessage}
        sending={sending}
      />
    </div>
  );
};

export default Chat;
