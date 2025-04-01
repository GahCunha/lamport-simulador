// eslint-disable-next-line @typescript-eslint/no-unused-vars
"use client";

import { useEffect, useRef, useState } from "react";
import ProcessoCard from "@/components/ProcessoCard";
import PainelExplicativo from "@/components/PainelExplicativo";

interface Processo {
  id: number;
  nome: string;
  relogio: number;
  eventos: string[];
}

const velocidades: Record<number, number> = {
  1: 2,
  2: 5,
  3: 10,
};

function atualizarProcessoInterno(proc: Processo): Processo {
  const incremento = velocidades[proc.id] || 1;
  const novoRelogio = proc.relogio + incremento;
  return {
    ...proc,
    relogio: novoRelogio,
    eventos: [...proc.eventos, `🌀 Evento interno (${novoRelogio})`],
  };
}

export default function SimuladorLamport() {
  const [processos, setProcessos] = useState<Processo[]>([
    { id: 1, nome: "P1", relogio: 0, eventos: [] },
    { id: 2, nome: "P2", relogio: 0, eventos: [] },
    { id: 3, nome: "P3", relogio: 0, eventos: [] },
  ]);
  const [cardsAtualizados, setCardsAtualizados] = useState<number[]>([]);
  const eventosRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const adicionarEventoInterno = (id: number) => {
    setProcessos((prev) =>
      prev.map((proc) => {
        if (proc.id === id) {
          setCardsAtualizados((prev) => [...prev, proc.id]);
          return atualizarProcessoInterno(proc);
        }
        return proc;
      })
    );
    setTimeout(() => {
      setCardsAtualizados((prev) => prev.filter((pid) => pid !== id));
    }, 500);
  };

  const enviarMensagem = (de: number, para: number) => {
    setProcessos((prev) => {
      const origem = prev.find((p) => p.id === de)!;
      const destino = prev.find((p) => p.id === para)!;
      const incrementoOrigem = velocidades[de] || 1;
      const novoRelogioOrigem = origem.relogio + incrementoOrigem;
      const novoRelogioDestino =
        Math.max(destino.relogio, novoRelogioOrigem) + (velocidades[para] || 1);

      setCardsAtualizados((prev) => [...prev, origem.id, destino.id]);
      setTimeout(() => {
        setCardsAtualizados((prev) =>
          prev.filter((id) => id !== origem.id && id !== destino.id)
        );
      }, 500);

      return prev.map((proc) => {
        if (proc.id === de) {
          return {
            ...proc,
            relogio: novoRelogioOrigem,
            eventos: [
              ...proc.eventos,
              `📤 Enviou para ${destino.nome} (${novoRelogioOrigem})`,
            ],
          };
        }
        if (proc.id === para) {
          return {
            ...proc,
            relogio: novoRelogioDestino,
            eventos: [
              ...proc.eventos,
              `📥 Recebeu de ${origem.nome} (${novoRelogioDestino})`,
            ],
          };
        }
        return proc;
      });
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const idAleatorio = Math.floor(Math.random() * 3) + 1;
      adicionarEventoInterno(idAleatorio);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    Object.entries(eventosRefs.current).forEach(([id, ref]) => {
      if (ref) ref.scrollTop = ref.scrollHeight;
    });
  }, [processos]);

  return (
    <div className="relative flex flex-col items-center gap-6 p-6">
      <h1 className="text-3xl font-bold text-center">
        Simulador do Algoritmo de Lamport
      </h1>
      <div className="flex gap-8 justify-center flex-wrap">
        {processos.map((proc, index) => (
          <ProcessoCard
            key={proc.id}
            processo={proc}
            index={index}
            processos={processos}
            onEnviar={enviarMensagem}
            eventosRef={(el) => (eventosRefs.current[proc.id] = el)}
            atualizado={cardsAtualizados.includes(proc.id)}
          />
        ))}
      </div>
      <PainelExplicativo />
    </div>
  );
}
