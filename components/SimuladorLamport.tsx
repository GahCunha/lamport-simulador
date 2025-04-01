"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowUpRightFromCircle, Mail, Eye } from "lucide-react";
import clsx from "clsx";

interface Processo {
  id: number;
  nome: string;
  relogio: number;
  eventos: string[];
}

const cores = [
  "bg-red-100/50 border-red-300 text-red-700",
  "bg-green-100/50 border-green-300 text-green-700",
  "bg-yellow-100/50 border-yellow-300 text-yellow-700",
];

const corTextoEvento = ["text-red-600", "text-green-600", "text-yellow-600"];

const corBotao = [
  "bg-red-400 hover:bg-red-600",
  "bg-green-400 hover:bg-green-600",
  "bg-yellow-400 hover:bg-yellow-600",
];

const velocidades = {
  1: 2,
  2: 5,
  3: 10,
};

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
          const incremento = velocidades[proc.id] || 1;
          const novoRelogio = proc.relogio + incremento;
          setCardsAtualizados((prev) => [...prev, proc.id]);
          return {
            ...proc,
            relogio: novoRelogio,
            eventos: [...proc.eventos, `🌀 Evento interno (${novoRelogio})`],
          };
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
          <Card
            key={proc.id}
            className={clsx(
              "w-80 transition-all duration-300 border-2",
              cores[index % cores.length],
              {
                "ring-4 ring-[index % cores.length]": cardsAtualizados.includes(
                  proc.id
                ),
              }
            )}
          >
            <CardHeader className="text-center">
              <CardTitle className="text-lg font-semibold">
                {proc.nome}
              </CardTitle>
              <motion.p
                className="text-2xl font-mono"
                key={proc.relogio}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1.1, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                ⏱ {proc.relogio}
              </motion.p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-2 justify-center">
                {processos
                  .filter((p) => p.id !== proc.id)
                  .map((dest, i) => (
                    <Button
                      key={dest.id}
                      onClick={() => enviarMensagem(proc.id, dest.id)}
                      className={clsx(
                        "text-white",
                        corBotao[(dest.id - 1) % corBotao.length]
                      )}
                    >
                      Enviar para {dest.nome}
                    </Button>
                  ))}
              </div>
              <div
                ref={(el) => (eventosRefs.current[proc.id] = el)}
                className="bg-muted rounded p-2 text-sm h-48 overflow-y-auto scrollbar-none"
              >
                {proc.eventos.map((evt, i) => (
                  <div
                    key={i}
                    className={corTextoEvento[index % corTextoEvento.length]}
                  >
                    {evt}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="w-full md:max-w-md bg-white rounded-xl shadow-md p-4 border text-sm mt-6">
        <h2 className="text-lg font-bold mb-2 text-center">Como funciona:</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-2">
            <Clock size={18} className="mt-0.5" />
            Cada processo possui um relógio lógico com incrementos diferentes.
          </li>
          <li className="flex items-start gap-2">
            <ArrowUpRightFromCircle size={18} className="mt-0.5" />
            Eventos internos incrementam o relógio com sua velocidade própria.
          </li>
          <li className="flex items-start gap-2">
            <Mail size={18} className="mt-0.5" />
            Ao enviar uma mensagem, o relógio é incrementado e enviado junto.
          </li>
          <li className="flex items-start gap-2">
            <ArrowUpRightFromCircle size={18} className="mt-0.5" />O processo
            receptor ajusta seu relógio com base na mensagem recebida.
          </li>
          <li className="flex items-start gap-2">
            <Eye size={18} className="mt-0.5" />
            Os eventos são exibidos em cada processo em ordem.
          </li>
        </ul>
      </div>
    </div>
  );
}
