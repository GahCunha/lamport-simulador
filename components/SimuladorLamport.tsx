"use client";

import { useEffect, useState } from "react";

interface Processo {
  id: number;
  nome: string;
  relogio: number;
  eventos: string[];
}

export default function SimuladorLamport() {
  const [processos, setProcessos] = useState<Processo[]>([
    { id: 1, nome: "P1", relogio: 0, eventos: [] },
    { id: 2, nome: "P2", relogio: 0, eventos: [] },
    { id: 3, nome: "P3", relogio: 0, eventos: [] },
  ]);

  const adicionarEventoInterno = (id: number) => {
    setProcessos((prev) =>
      prev.map((proc) => {
        if (proc.id === id) {
          const novoRelogio = proc.relogio + 1;
          return {
            ...proc,
            relogio: novoRelogio,
            eventos: [...proc.eventos, `🌀 Evento interno (${novoRelogio})`],
          };
        }
        return proc;
      })
    );
  };

  const enviarMensagem = (de: number, para: number) => {
    setProcessos((prev) => {
      const origem = prev.find((p) => p.id === de)!;
      const destino = prev.find((p) => p.id === para)!;
      const novoRelogioOrigem = origem.relogio + 1;
      const novoRelogioDestino = Math.max(destino.relogio, novoRelogioOrigem) + 1;

      return prev.map((proc) => {
        if (proc.id === de) {
          return {
            ...proc,
            relogio: novoRelogioOrigem,
            eventos: [...proc.eventos, `📤 Enviou para ${destino.nome} (${novoRelogioOrigem})`],
          };
        }
        if (proc.id === para) {
          return {
            ...proc,
            relogio: novoRelogioDestino,
            eventos: [...proc.eventos, `📥 Recebeu de ${origem.nome} (${novoRelogioDestino})`],
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

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-bold">Simulador do Algoritmo de Lamport</h1>
      <div className="flex gap-8">
        {processos.map((proc) => (
          <div key={proc.id} className="bg-white shadow-xl rounded-2xl p-4 w-64">
            <h2 className="text-xl font-semibold mb-2">{proc.nome}</h2>
            <p className="mb-2">Relógio: <span className="font-mono">{proc.relogio}</span></p>
            <div className="mb-2">
              {processos
                .filter((p) => p.id !== proc.id)
                .map((dest) => (
                  <button
                    key={dest.id}
                    onClick={() => enviarMensagem(proc.id, dest.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded m-1"
                  >
                    Enviar para {dest.nome}
                  </button>
                ))}
            </div>
            <div className="bg-gray-100 rounded p-2 text-sm h-48 overflow-y-auto">
              {proc.eventos.map((evt, i) => (
                <div key={i} className="mb-1 whitespace-nowrap">{evt}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
