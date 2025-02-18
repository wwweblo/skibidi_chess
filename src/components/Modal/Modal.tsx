"use client";
import React from "react";

interface ModalProps {
  isOpen: boolean; // Открыто или закрыто
  title?: string; // Заголовок модального окна
  content?: string | React.ReactNode; // Текст или контент
  onClose: () => void; // Функция закрытия
  buttons?: { text: string; onClick: () => void; style?: string }[]; // Кнопки
}

const Modal: React.FC<ModalProps> = ({ isOpen, title, content, onClose, buttons }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96 max-w-full">
        {/* Заголовок */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {/* Контент */}
        <div className="mb-4">{content}</div>

        {/* Кнопки */}
        <div className="flex justify-end gap-2">
          {buttons?.map((btn, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded ${btn.style || "bg-blue-500 text-white hover:bg-blue-600"}`}
              onClick={btn.onClick}
            >
              {btn.text}
            </button>
          ))}
          {/* Кнопка закрытия */}
          <button className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
