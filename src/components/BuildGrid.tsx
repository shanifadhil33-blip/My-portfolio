import { Boxes, Bot, Database, LayoutDashboard, Plug, Rocket, Server, ShieldCheck, Workflow, Wrench } from "lucide-react";
import { workAreas } from "@/data/services";

const ICONS: Record<string, typeof Boxes> = {
  complete: Boxes,
  frontend: LayoutDashboard,
  backend: Server,
  apis: Plug,
  databases: Database,
  integrations: Workflow,
  security: ShieldCheck,
  deployment: Rocket,
  troubleshooting: Wrench,
  ai: Bot,
};

/** What clients bring me in for. Plain, scannable tiles: one area or several. */
export default function BuildGrid() {
  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {workAreas.map((area) => {
        const Icon = ICONS[area.id] ?? Boxes;
        return (
          <li key={area.id} className="flex gap-4 rounded-2xl border border-border bg-surface p-5 lg:flex-col lg:gap-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <Icon size={20} aria-hidden />
            </span>
            <span>
              <span className="block text-base font-semibold text-foreground">{area.label}</span>
              <span className="mt-1 block text-sm leading-relaxed text-muted">{area.detail}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
