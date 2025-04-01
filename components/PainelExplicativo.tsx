import { Clock, ArrowUpRightFromCircle, Mail, Eye } from "lucide-react";

export default function PainelExplicativo() {
  return (
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
          <ArrowUpRightFromCircle size={18} className="mt-0.5" />
          O processo receptor ajusta seu relógio com base na mensagem recebida.
        </li>
        <li className="flex items-start gap-2">
          <Eye size={18} className="mt-0.5" />
          Os eventos são exibidos em cada processo em ordem.
        </li>
      </ul>
    </div>
  );
}
