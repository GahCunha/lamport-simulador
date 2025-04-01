import Head from "next/head";
import SimuladorLamport from "../components/SimuladorLamport";

export default function Home() {
  return (
    <>
      <Head>
        <title>Simulador Lamport</title>
      </Head>
      <main className="min-h-screen p-4">
        <SimuladorLamport />
      </main>
    </>
  );
}
