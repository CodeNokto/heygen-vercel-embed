"use client";

import { useEffect, useRef } from "react";
import StreamingAvatar, { StreamingEvents } from "@heygen/streaming-avatar";

export default function AvatarPage() {
  const avatarRef = useRef<StreamingAvatar | null>(null);

  useEffect(() => {
    async function init() {
      const tokenRes = await fetch("/api/heygen-token"); 
      const { token } = await tokenRes.json();

      const avatar = new StreamingAvatar(token, {
        container: document.getElementById("avatar-container")!,
        avatarName: "default", // evt. ID du har i HeyGen
        voice: "en-US-Neural2-J", // kan endres
      });

      avatar.on(StreamingEvents.READY, () => {
        console.log("Avatar klar");
        avatar.speak("Hei, jeg er din AI-assistent. Hva kan jeg hjelpe deg med?");
      });

      avatarRef.current = avatar;
    }
    init();
  }, []);

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Avatar</h1>
      <div
        id="avatar-container"
        style={{ width: "100%", height: "600px", background: "#000" }}
      ></div>
    </main>
  );
}
