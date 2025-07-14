"use client";

import { useState, useEffect } from "react";
import WebPushButton from "@magicbell/react/webpush-button";

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  const sendNotification = async () => {
    try {
      const response = await fetch("https://localhost:3000/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Notification sent:", data);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-6">
        MagicBell Web Push Notifications React Demo
      </h2>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Notification message"
        className="bg-gray-800 text-white border border-gray-600 rounded-md px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
      />
      <div className="flex items-center gap-2">
        <WebPushButton
          renderLabel={({ status, error }) =>
            error || (status === "success" ? "Unsubscribe" : "Subscribe")
          }
          className="bg-[#FFB224] hover:bg-[#FFBF48] transition text-black px-4 py-2 rounded w-full"
        />
        <button
          onClick={sendNotification}
          className="bg-[#6E56CF] hover:bg-[#836ED6] transition text-white px-4 py-2 rounded w-full"
        >
          Send Test Notification
        </button>
      </div>
    </div>
  );
}

function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    );

    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  if (isStandalone) {
    return null; // Don't show install button if already installed
  }

  return (
    <div>
      {isIOS && (
        <p>
          To install this app on your iOS device, tap the share button
          <span role="img" aria-label="share icon">
            {" "}
            ⎋{" "}
          </span>
          and then "Add to Home Screen"
          <span role="img" aria-label="plus icon">
            {" "}
            ➕{" "}
          </span>
          .
        </p>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto mt-16">
      <div className="mx-auto">
        <PushNotificationManager />
        <InstallPrompt />
      </div>
    </div>
  );
}
