import React from "react";
import TextBox from "@/components/TextBox/TextBox";
import Button from "@/components/Button/Button";
import styles from "./Chat.module.css";

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSendMessage: () => void;
  sending: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ newMessage, onMessageChange, onSendMessage, sending }) => {
  return (
    <div className={styles.inputContainer}>
      <TextBox
        value={newMessage}
        onChange={onMessageChange}
        placeholder="Введите сообщение..."
      />
      <Button variant="agree" size="middle" onClick={onSendMessage} disabled={!newMessage.trim() || sending}>
        {sending ? "Отправка..." : "Отправить 🚀"}
      </Button>
    </div>
  );
};

export default MessageInput;
