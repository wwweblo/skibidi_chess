import { useEffect } from "react";
import { toast } from "react-toastify";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import { usePathname } from "next/navigation";

const useGlobalSocketNotifications = () => {
  const pathname = usePathname();

  useEffect(() => {
    let socket: any;
    const setupSocket = async () => {
      socket = await connectSocket();
      if (!socket) return;
      
      socket.on("message", (message: any) => {
        // Если пользователь не находится на странице чата или окно не активно, показываем уведомление.
        if (!pathname.includes("/chat") || !document.hasFocus()) {
          toast.info(`Новое сообщение от ${message.userLogin}: ${message.text}`);
        }
      });
    };

    setupSocket();

    return () => {
      disconnectSocket();
    };
  }, [pathname]);
};

export default useGlobalSocketNotifications;
