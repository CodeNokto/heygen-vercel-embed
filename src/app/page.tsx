import HeyGenWidget from "@/components/HeyGenWidget";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-12 gap-8">
      <h1 className="text-3xl font-sans font-bold">Interactive Avatar App</h1>
      <p className="text-neutral-400 text-base">
        Denne siden kjører nå med korrekt font og språkinnstilling.
      </p>
      <HeyGenWidget />
    </main>
  );
}
