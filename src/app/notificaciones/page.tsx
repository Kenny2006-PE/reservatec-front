"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import NotificationSettings from "@/components/NotificationSettings";
import { useUserPicture } from "@/hooks/useUserPicture";

export default function NotificationsPage() {
  const userPicture = useUserPicture();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 flex flex-col lg:flex-row font-inter">
      <Sidebar currentPath="notificaciones" userType="estudiante" />

      <div className="flex-1 flex flex-col w-full lg:w-auto">
        <Header 
          title="Notificaciones"
          description="Configura cómo quieres recibir notificaciones"
          userImage={userPicture}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <NotificationSettings />
          </div>
        </main>
      </div>
    </div>
  );
}
