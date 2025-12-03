import { useNotificationCenter } from "@/hooks/useNotificationCenter";
import { useState } from "react";

export default function NotificationCenter({ userId }: { userId?: number }) {
  const { notifications, markAsRead } = useNotificationCenter(userId);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="relative">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 rounded-full px-1 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500">No notifications</div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`p-3 border-b cursor-pointer ${n.read ? "bg-gray-100" : "bg-white"}`}
                onClick={() => markAsRead(n.id)}
              >
                <span className="font-bold capitalize">{n.type}: </span>
                {n.message}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
