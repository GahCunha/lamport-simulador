import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { cores, corTextoEvento, corBotao } from "./constants";

interface Processo {
  id: number;
  nome: string;
  relogio: number;
  eventos: string[];
}

interface Props {
  processo: Processo;
  index: number;
  processos: Processo[];
  onEnviar: (de: number, para: number) => void;
  eventosRef: (el: HTMLDivElement | null) => void;
  atualizado: boolean;
}

export default function ProcessoCard({
  processo,
  index,
  processos,
  onEnviar,
  eventosRef,
  atualizado,
}: Props) {
  return (
    <Card
      className={clsx(
        "w-80 transition-all duration-300 border-2",
        cores[index % cores.length],
        { "ring-4 ring[cores % index]": atualizado }
      )}
    >
      <CardHeader className="text-center">
        <CardTitle className="text-lg font-semibold">{processo.nome}</CardTitle>
        <motion.p
          className="text-2xl font-mono"
          key={processo.relogio}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1.1, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          ⏱ {processo.relogio}
        </motion.p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 justify-center">
          {processos
            .filter((p) => p.id !== processo.id)
            .map((dest) => (
              <Button
                key={dest.id}
                onClick={() => onEnviar(processo.id, dest.id)}
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
          ref={eventosRef}
          className="bg-muted rounded p-2 text-sm h-48 overflow-y-auto scrollbar-none"
        >
          {processo.eventos.map((evt, i) => (
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
  );
}
