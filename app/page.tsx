"use client";

import { useState, useEffect } from "react";
import WebPushButton from "@magicbell/react/webpush-button";

function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);

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
    const res = await fetch("/api/send-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        externalId: "7f4baab5-0c91-44e8-8b58-5ff849535174",
        message: "Hello from frontend!",
      }),
    });

    const data = await res.json();
    console.log(data);
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-semibold text-center mb-6">
        MagicBell Web Push Notifications React Example
      </h2>
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
      // @todo: fix
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        <>
          <h3>Install App</h3>
          <button>Add to Home Screen</button>
          <p>
            To install this app on your iOS device, tap the share button
            <span role="img" aria-label="share icon">
              {" "}
              ⎋{" "}
            </span>
            and then &quot;Add to Home Screen&quot;
            <span role="img" aria-label="plus icon">
              {" "}
              ➕{" "}
            </span>
            .
          </p>
        </>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <div>
      <PushNotificationManager />
      <InstallPrompt />
    </div>
  );
}
