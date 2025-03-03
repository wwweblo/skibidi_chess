import React from "react";
import { Message } from "@/types/message";
import styles from "./Chat.module.css";

interface MessageListProps {
  chatId: number;
  messages: Message[];
  userLogin: string | null;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  onUserClick: (login: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, userLogin, messagesEndRef, onUserClick }) => {
  return (
    <div className={styles.messagesContainer}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`${styles.message} ${
            msg.userLogin === userLogin ? styles.myMessage : styles.otherMessage
          }`}
        >
          <span className={styles.link} onClick={() => onUserClick(msg.userLogin)}>
            {msg.userLogin}:
          </span>
          <span> {msg.text}</span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
