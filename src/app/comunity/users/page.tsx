"use client";
import { useState, useEffect } from "react";
import { fetchUser } from "@/lib/authApi";
import { getOrCreateChat } from "@/lib/userApi";
import { fetchSortedUsers } from "@/lib/userApi";
import Button from "@/components/Button/Button";

const UsersPage = () => {
  const [users, setUsers] = useState<{ login: string; email: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      try {
        const user = await fetchUser();
        if (!user) {
          setError("Не удалось загрузить текущего пользователя");
          return;
        }
        setCurrentUser(user.userLogin);

        const sortedUsers = await fetchSortedUsers(user.userLogin);
        setUsers(sortedUsers);
      } catch (err) {
        setError("Ошибка загрузки пользователей");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  return (
    <div className="m-10 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Пользователи</h1>
      {loading && <p>Загрузка...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="list-none">
        {users.map((user) => (
          <li key={user.login} className="p-2 border-b">
            <p className="font-semibold">{user.login}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <Button size="small" onClick={() => getOrCreateChat(currentUser!, user.login)}>
              Начать чат
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
