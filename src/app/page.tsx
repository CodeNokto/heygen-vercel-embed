import Link from "next/link";

export default function Home() {
  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Velkommen</h1>
      <p>
        <Link href="/products-view">
          Gå til produktsiden
        </Link>
      </p>
    </main>
  );
}
