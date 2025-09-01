"use client";

import { useEffect, useRef } from "react";
import StreamingAvatar, { StreamingEvents } from "@heygen/streaming-avatar";

export default function AvatarPage() {
  const avatarRef = useRef<StreamingAvatar | null>(null);

  useEffect(() => {
    if (!avatarRef.current) {
      avatarRef.current = new StreamingAvatar({
        token: async () => {
          const resp = await fetch("/api/token");
          const data = await resp.json();
          return data.token;
        },
      });

      avatarRef.current.on(StreamingEvents.AVATAR_START, () => {
        console.log("Avatar startet");
      });

      avatarRef.current.on(StreamingEvents.AVATAR_STOP, () => {
        console.log("Avatar stoppet");
      });
    }
  }, []);

  return (
    <div>
      <h1>Live Avatar</h1>
      <div id="avatar-container" style={{ width: "640px", height: "480px" }} />
    </div>
  );
}
