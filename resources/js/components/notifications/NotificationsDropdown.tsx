// import Echo from 'laravel-echo';
// import { useEffect, useState } from 'react';
// // import { router } from '@inertiajs/react'; // if you're using Inertia

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Button } from "@/components/ui/button";
// import { Bell, CheckCheck } from "lucide-react";
// import { route } from 'ziggy-js';
// import { router } from '@inertiajs/react';

// type Notification = {
//   id: string;
//   data: { message: string };
//   message?: string;
//   read_at: string | null;
//   created_at: string;
// };

// interface Props {
//   userId: number;
//   initialNotifications: Notification[];
// }

// export default function NotificationsDropdown({ userId, initialNotifications = [] }: Props) {
//   const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

//   const unreadCount = notifications.filter((n) => !n.read_at).length;

//   useEffect(() => {
//     const echo = new Echo({
//       broadcaster: "reverb",
//       key: import.meta.env.VITE_REVERB_APP_KEY,
//       wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
//       wsPort: import.meta.env.VITE_REVERB_PORT ?? 6001,
//       forceTLS: false,
//       enabledTransports: ["ws"],
//     });

//     const channel = echo.private(`App.Models.User.${userId}`);
//     channel.notification((notification: any) => {
//       const normalized: Notification = {
//         id: notification.id,
//         message: notification.data?.message ?? notification.message ?? "No message",
//         read_at: notification.read_at ?? null,
//         created_at: notification.created_at ?? new Date().toISOString(),
//         data: { message: notification.data?.message ?? notification.message ?? "No message" },
//       };
//       setNotifications((prev) => [normalized, ...prev]);
//     });

//     return () => {
//       echo.leave(`App.Models.User.${userId}`);
//       // channel.stopListening();
//       // echo.disconnect();
//     };
//   }, [userId]);

//   const markAllAsRead = () => {
//     router.post(route("notifications.readAll"), {}, { preserveScroll: true });

//     setNotifications((prev) =>
//       prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
//     );
//   };

//   const markOneAsRead = (id: string) => {
//     router.post(route("notifications.read", id), {}, { preserveScroll: true });

//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
//     );
//   };

//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" className="relative">
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1.5 text-xs text-white">
//               {unreadCount}
//             </span>
//           )}
//         </Button>
//       </DropdownMenuTrigger>

//       <DropdownMenuContent
//         align="end"
//         className="w-80 max-h-96 overflow-y-auto
//                    bg-white dark:bg-neutral-900
//                    border border-gray-200 dark:border-neutral-700"
//       >
//         <DropdownMenuLabel className="flex justify-between items-center text-gray-700 dark:text-gray-200">
//           Notifications
//           {unreadCount > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               className="h-auto px-2 py-0 text-xs text-blue-600 dark:text-blue-400"
//               onClick={markAllAsRead}
//             >
//               <CheckCheck className="mr-1 h-3 w-3" /> Mark all
//             </Button>
//           )}
//         </DropdownMenuLabel>
//         <DropdownMenuSeparator />

//         {notifications.length === 0 && (
//           <DropdownMenuItem disabled>
//             <p className="w-full text-center text-gray-500 dark:text-gray-400">
//               No notifications
//             </p>
//           </DropdownMenuItem>
//         )}

//         {notifications.map((n) => {
//           const message = n.data?.message ?? n.message ?? "No message";
//           const createdAt = n.created_at ?? new Date().toISOString();

//           return (
//             <DropdownMenuItem
//               key={n.id}
//               onClick={() => markOneAsRead(n.id)}
//               className={`flex flex-col items-start w-full cursor-pointer
//                 ${n.read_at
//                   ? "bg-gray-50 dark:bg-neutral-800"
//                   : "bg-white dark:bg-neutral-900 font-semibold"}`}
//             >
//               <p className="text-gray-900 dark:text-gray-100">{message}</p>
//               <small className="text-xs text-gray-400 dark:text-gray-500">
//                 {new Date(createdAt).toLocaleString()}
//               </small>
//             </DropdownMenuItem>
//           );
//         })}
//       </DropdownMenuContent>
//     </DropdownMenu>
//   );
// }

import { router, usePage } from '@inertiajs/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import echo from '@/echo';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, CheckCheck } from 'lucide-react';
import { route } from 'ziggy-js';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

type Notification = {
  id: string;
  data: { message: string };
  message?: string;
  read_at: string | null;
  created_at: string;
};

export default function NotificationsDropdown() {
  const queryClient = useQueryClient();
  // const { auth } = usePage().props;
  const auth = useAuth();
  const userId = auth?.user?.id;

  // 1️⃣ Fetch notifications with React Query
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications', userId],
    // queryFn: async () => {
    //   const res = await axios.get(`/api/notifications/${userId}`); // could i change to auth.user.notifications
    //   const re = res.data ? auth.user?.notifications : [];
    //   return re;
    // },
    queryFn: () => auth.user?.notifications,
    refetchOnWindowFocus: false,
  });
  const unreadCount = notifications.filter((n) => !n.read_at).length;

  // 2️⃣ Listen for real-time updates (once per mount)
  useEffect(() => {
    const channel = echo.private(`App.Models.User.${userId}`);
    channel.notification((notification: any) => {
      const normalized: Notification = {
        id: notification.id,
        message: notification.data?.message ?? notification.message ?? 'No message',
        read_at: notification.read_at ?? null,
        created_at: notification.created_at ?? new Date().toISOString(),
        data: { message: notification.data?.message ?? notification.message ?? 'No message' },
      };

      // console.log(normalized);
      toast(`${notification.message}`);

      queryClient.setQueryData<Notification[]>(['notifications', userId], (old = []) => [
        normalized,
        ...old,
      ]);
    });

    return () => {
      echo.leave(`App.Models.User.${userId}`);
    };
  }, [userId, queryClient]);

  // 3️⃣ Mark all notifications as read
  const markAllAsRead = () => {
    router.post(route('notifications.readAll'), {}, { preserveScroll: true });
    queryClient.setQueryData<Notification[]>(['notifications', userId], (old = []) =>
      old.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })),
    );
  };

  // 4️⃣ Mark one notification as read
  const markOneAsRead = (id: string) => {
    router.post(route('notifications.read', id), {}, { preserveScroll: true });
    queryClient.setQueryData<Notification[]>(['notifications', userId], (old = []) =>
      old.map((n) => (n.id === id ? { ...n, read_at: new Date().toISOString() } : n)),
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 rounded-full bg-red-500 px-1.5 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="max-h-96 w-80 overflow-y-auto border border-gray-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
      >
        <DropdownMenuLabel className="flex items-center justify-between text-gray-700 dark:text-gray-200">
          Notifications
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-0 text-xs text-blue-600 dark:text-blue-400"
              onClick={markAllAsRead}
            >
              <CheckCheck className="mr-1 h-3 w-3" /> Mark all
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {notifications.length === 0 && (
          <DropdownMenuItem disabled>
            <p className="w-full text-center text-gray-500 dark:text-gray-400">
              No notifications
            </p>
          </DropdownMenuItem>
        )}

        {notifications.map((n) => {
          const message = n.data?.message ?? n.message ?? 'No message';
          const createdAt = n.created_at ?? new Date().toISOString();

          return (
            <DropdownMenuItem
              key={n.id}
              onClick={() => markOneAsRead(n.id)}
              className={`flex w-full cursor-pointer flex-col items-start ${
                n.read_at
                  ? 'bg-gray-50 dark:bg-neutral-800'
                  : 'bg-white font-semibold dark:bg-neutral-900'
              }`}
            >
              <p className="text-gray-900 dark:text-gray-100">{message}</p>
              <small className="text-xs text-gray-400 dark:text-gray-500">
                {new Date(createdAt).toLocaleString()}
              </small>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
