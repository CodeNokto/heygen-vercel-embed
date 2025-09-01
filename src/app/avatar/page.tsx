"use client";

import { useEffect, useRef } from "react";
import StreamingAvatar from "@heygen/streaming-avatar";

export default function AvatarPage() {
  const avatarRef = useRef<any>(null);

  useEffect(() => {
    if (!avatarRef.current) {
      avatarRef.current = new StreamingAvatar({
        token: async () => {
          const resp = await fetch("/api/token");
          const data = await resp.json();
          return data.token;
        },
      });

      avatarRef.current.on("avatar_start", () => {
        console.log("Avatar startet");
      });

      avatarRef.current.on("avatar_stop", () => {
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
