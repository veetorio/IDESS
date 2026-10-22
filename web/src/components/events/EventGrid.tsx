import { EventCard } from "./EventCard";
import type { Evento } from "@/types";

interface EventGridProps {
  eventos: Evento[];
}

export function EventGrid({ eventos }: EventGridProps) {
  if (eventos.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-500">
        <p className="text-lg">Nenhum evento encontrado.</p>
        <p className="text-sm mt-1">Volte em breve para novidades!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {eventos.map((evento) => (
        <EventCard key={evento.id} evento={evento} />
      ))}
    </div>
  );
}
