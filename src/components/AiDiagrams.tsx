"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import {
  Calculator,
  CalendarCheck,
  Cloud,
  Contact,
  Cpu,
  FolderOpen,
  Handshake,
  Headset,
  Lock,
  Mail,
  Server,
  Shield,
  Wallet,
  Waypoints,
  type LucideIcon,
} from "lucide-react";

type Pt = { x: number; y: number };

const PHONE = { w: 400, h: 500 };
const DESK = { w: 1600, h: 900 };

function clamp(n: number, limit: number) {
  return Math.max(-limit, Math.min(limit, n));
}

function curve(a: Pt, b: Pt, bend: number, box: { w: number; h: number }) {
  const ax = (a.x / 100) * box.w;
  const ay = (a.y / 100) * box.h;
  const bx = (b.x / 100) * box.w;
  const by = (b.y / 100) * box.h;
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  return `M ${ax} ${ay} Q ${mx + (-dy / len) * bend} ${my + (dx / len) * bend} ${bx} ${by}`;
}

function Wires({
  links,
  hot,
  box,
  className,
  playing = false,
}: {
  links: { a: Pt; b: Pt; bend: number }[];
  hot: number | null;
  box: { w: number; h: number };
  className: string;
  playing?: boolean;
}) {
  const paths = links.map((link) => curve(link.a, link.b, link.bend, box));
  return (
    <svg viewBox={`0 0 ${box.w} ${box.h}`} preserveAspectRatio="none" className={`aid-wires pointer-events-none absolute inset-0 h-full w-full ${className}`} aria-hidden>
      {paths.map((d, index) => (
        <path key={index} d={d} fill="none" stroke="currentColor" strokeWidth="1.25" vectorEffect="non-scaling-stroke" className={index === hot ? "text-accent/80" : "text-foreground/15"} />
      ))}
      {playing && hot !== null && paths[hot] ? (
        <path d={paths[hot]} pathLength={100} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeDasharray="7 93" vectorEffect="non-scaling-stroke" className="text-accent aid-packet" />
      ) : null}
    </svg>
  );
}

function usePhone() {
  return useSyncExternalStore(
    (onChange) => {
      const media = window.matchMedia("(max-width: 639px)");
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(max-width: 639px)").matches,
    () => false,
  );
}

const cameraPreset: Record<string, { rx: number; rz: number }> = {
  teammates: { rx: 32, rz: -14 },
  systems: { rx: 30, rz: -14 },
  guardrails: { rx: 16, rz: -6 },
  runs: { rx: 26, rz: -10 },
};

function Canvas({
  playing,
  name,
  held = false,
  overlay,
  children,
}: {
  playing: boolean;
  name: string;
  held?: boolean;
  overlay?: ReactNode;
  children: ReactNode;
}) {
  const phone = usePhone();
  const spinRef = useRef<HTMLDivElement>(null);
  const tilt = useRef({ x: 0, z: 0 });
  const spin = useRef({ x: Number.NaN, z: Number.NaN });
  const base = cameraPreset[name] ?? cameraPreset.teammates;
  const camRx = phone ? 11 : base.rx;
  const camRz = phone ? -5 : base.rz;

  useLayoutEffect(() => {
    const node = spinRef.current;
    if (!node) return;
    if (spin.current.x !== camRx) {
      node.style.setProperty("--spin-x", `${camRx}deg`);
      spin.current.x = camRx;
    }
    if (spin.current.z !== camRz) {
      node.style.setProperty("--spin-z", `${camRz}deg`);
      spin.current.z = camRz;
    }
    node.style.setProperty("--tilt-x", `${tilt.current.x}deg`);
    node.style.setProperty("--tilt-z", `${tilt.current.z}deg`);
  }, [camRx, camRz]);

  function aim(clientX: number, clientY: number, rect: DOMRect) {
    const node = spinRef.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const limit = phone ? 3 : 8;
    const px = (clientX - rect.left) / rect.width - 0.5;
    const py = (clientY - rect.top) / rect.height - 0.5;
    tilt.current = { x: clamp(-py * limit * 1.4, limit), z: clamp(px * limit * 1.4, limit) };
    node.style.setProperty("--tilt-x", `${tilt.current.x.toFixed(2)}deg`);
    node.style.setProperty("--tilt-z", `${tilt.current.z.toFixed(2)}deg`);
  }

  return (
    <div
      className="aid-canvas aid-viewport relative aspect-[4/5] w-full overflow-hidden rounded-3xl sm:aspect-video"
      data-playing={playing ? "true" : "false"}
      data-held={held ? "true" : "false"}
      data-diagram={name}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        aim(event.clientX, event.clientY, event.currentTarget.getBoundingClientRect());
      }}
      onPointerLeave={() => {
        tilt.current = { x: 0, z: 0 };
        spinRef.current?.style.setProperty("--tilt-x", "0deg");
        spinRef.current?.style.setProperty("--tilt-z", "0deg");
      }}
    >
      <div className="aid-world">
        <div ref={spinRef} className="aid-spin">
          <div className="aid-floor" />
          {children}
        </div>
      </div>
      {overlay}
    </div>
  );
}

function place(phone: Pt, desk: Pt = phone): CSSProperties {
  return { "--x": `${phone.x}%`, "--y": `${phone.y}%`, "--xd": `${desk.x}%`, "--yd": `${desk.y}%` } as CSSProperties;
}

function Tile({
  icon: Icon,
  label,
  detail,
  at,
  desk,
  active,
  badge,
  tier = false,
  z = 32,
  onOpen,
  expanded = false,
}: {
  icon: LucideIcon;
  label: string;
  detail?: string;
  at: Pt;
  desk?: Pt;
  active?: boolean;
  badge?: string;
  tier?: boolean;
  z?: number;
  onOpen?: () => void;
  expanded?: boolean;
}) {
  const d = desk ?? at;
  const face = `aid-face flex rounded-3xl ${tier ? "w-[16rem] flex-row items-center gap-3 px-4 py-3 text-left sm:w-[19rem]" : "w-[5.8rem] flex-col items-center gap-2 px-2 py-3 sm:w-[8.5rem]"} ${active ? "aid-glow" : ""} ${onOpen ? "cursor-pointer" : ""}`;
  const inner = (
    <>
      <span className="aid-side" aria-hidden />
      <span className="aid-top shrink-0 text-accent"><Icon size={22} strokeWidth={1.75} /></span>
      <span className={tier ? "min-w-0" : ""}>
        <span className="aid-label block font-medium text-foreground">{label}</span>
        {detail ? <span className="aid-label mt-0.5 block text-muted">{detail}</span> : null}
        {badge ? <span className="aid-label mt-1 block font-medium text-accent">{badge}</span> : null}
      </span>
    </>
  );
  return (
    <div className="aid-anchor" style={{ ...place(at, d), "--z": `${z}px` } as CSSProperties}>
      <div className="aid-bill">
        {onOpen ? (
          <button type="button" aria-expanded={expanded} onClick={onOpen} className={face}>{inner}</button>
        ) : (
          <div className={face}>{inner}</div>
        )}
      </div>
    </div>
  );
}

const mates: { id: string; label: string; icon: LucideIcon; at: Pt }[] = [
  { id: "sales", label: "Sales", icon: Handshake, at: { x: 50, y: 16 } },
  { id: "operations", label: "Operations", icon: CalendarCheck, at: { x: 82, y: 28 } },
  { id: "finance", label: "Finance", icon: Wallet, at: { x: 76, y: 76 } },
  { id: "support", label: "Support", icon: Headset, at: { x: 18, y: 70 } },
];
const coord = { x: 50, y: 50 };
const route = [coord, mates[0].at, mates[1].at, mates[2].at];

const profiles: Record<string, { name: string; role: string; knows: string; does: string; approval: string; skills: string; contacts: string; memory: string }> = {
  sales: {
    name: "Sales",
    role: "Owns the path to a booked job.",
    knows: "Price list and past quotes.",
    does: "Writes quotes and follows up.",
    approval: "Discounts above the limit.",
    skills: "Quotes, follow up, and qualifying.",
    contacts: "Sales manager and customers.",
    memory: "The last conversation with each customer.",
  },
  operations: {
    name: "Operations",
    role: "Turns a booking into a visit.",
    knows: "Job rules and past jobs.",
    does: "Schedules the job and assigns people.",
    approval: "Bringing in a new supplier.",
    skills: "Scheduling, assigning, and tracking.",
    contacts: "Operations lead and Sales.",
    memory: "How each job was scheduled.",
  },
  finance: {
    name: "Finance",
    role: "Takes a job through to payment.",
    knows: "Finance rules and past invoices.",
    does: "Creates the invoice and matches payment.",
    approval: "A refund outside the usual rules.",
    skills: "Invoices, reminders, and matching.",
    contacts: "Finance lead and Operations.",
    memory: "What was agreed on each invoice.",
  },
  support: {
    name: "Support",
    role: "Answers the enquiry and books the visit.",
    knows: "Policies and the price list.",
    does: "Answers the enquiry and books a visit.",
    approval: "A complaint that needs a refund.",
    skills: "Enquiries, complaints, and bookings.",
    contacts: "Support lead and customers.",
    memory: "The last conversation with each customer.",
  },
};

function ProfilePanel({ id }: { id: string }) {
  const profile = profiles[id];
  const [more, setMore] = useState(false);
  const rows = [
    ["Role", profile.role],
    ["Knows", profile.knows],
    ["Does on its own", profile.does],
    ["Needs approval", profile.approval],
  ];
  const extra = [
    ["Skills", profile.skills],
    ["Contacts", profile.contacts],
    ["Memory", profile.memory],
  ];
  return (
    <aside data-testid="agent-profile" className="px-1 lg:px-2 lg:pt-6">
      <h4 className="text-2xl font-semibold tracking-tight text-foreground">{profile.name}</h4>
      <dl className="mt-8 space-y-6">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm font-medium text-accent">{label}</dt>
            <dd className="mt-1 text-base leading-relaxed text-foreground">{value}</dd>
          </div>
        ))}
        {more ? extra.map(([label, value]) => (
          <div key={label}>
            <dt className="text-sm font-medium text-accent">{label}</dt>
            <dd className="mt-1 text-base leading-relaxed text-foreground">{value}</dd>
          </div>
        )) : null}
      </dl>
      <button type="button" onClick={() => setMore((value) => !value)} aria-expanded={more} className="mt-8 min-h-11 text-base font-medium text-muted">
        {more ? "Less" : "More"}
      </button>
    </aside>
  );
}

export function TeammatesDiagram({ playing, settle = false }: { playing: boolean; settle?: boolean }) {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState<string | null>(settle ? "sales" : null);

  useEffect(() => {
    if (!playing || settle) return;
    const timers = route.map((_, index) => window.setTimeout(() => setStep(index), index * 1000));
    const show = window.setTimeout(() => setOpen("sales"), 1600);
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      clearTimeout(show);
    };
  }, [playing, settle]);

  const links = [
    { a: coord, b: mates[0].at, bend: 8 },
    { a: mates[0].at, b: mates[1].at, bend: 10 },
    { a: mates[1].at, b: mates[2].at, bend: 8 },
    { a: coord, b: mates[3].at, bend: 6 },
  ];
  const moving = playing && !open && step > 0;

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
      <Canvas playing={playing} name="teammates">
        <Wires links={links} hot={moving ? step - 1 : null} box={PHONE} className="sm:hidden" playing={moving} />
        <Wires links={links} hot={moving ? step - 1 : null} box={DESK} className="hidden sm:block" playing={moving} />
        <Tile icon={Waypoints} label="Coordinator" at={coord} active={step === 0 && !open} z={48} />
        {mates.map((mate, index) => (
          <Tile
            key={mate.id}
            icon={mate.icon}
            label={mate.label}
            at={mate.at}
            z={36}
            active={open === mate.id}
            badge={moving && step === index + 1 ? "Sent" : undefined}
            expanded={open === mate.id}
            onOpen={() => setOpen(mate.id)}
          />
        ))}
      </Canvas>
      {open ? <ProfilePanel key={open} id={open} /> : null}
    </div>
  );
}

const apps: { label: string; icon: LucideIcon; at: Pt; toast: string }[] = [
  { label: "Email", icon: Mail, at: { x: 50, y: 14 }, toast: "Reply sent" },
  { label: "CRM", icon: Contact, at: { x: 84, y: 36 }, toast: "Updated" },
  { label: "Accounting", icon: Calculator, at: { x: 70, y: 78 }, toast: "Posted" },
  { label: "Documents", icon: FolderOpen, at: { x: 16, y: 62 }, toast: "Saved" },
];
const hub = { x: 50, y: 46 };

export function SystemsDiagram({ playing, settle = false }: { playing: boolean; settle?: boolean }) {
  const [step, setStep] = useState(settle ? -1 : -1);

  useEffect(() => {
    if (!playing || settle) return;
    const timers = apps.map((_, index) => window.setTimeout(() => setStep(index), 500 + index * 900));
    const done = window.setTimeout(() => setStep(-1), 500 + apps.length * 900);
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      clearTimeout(done);
    };
  }, [playing, settle]);

  return (
    <Canvas playing={playing} name="systems">
      <Wires links={apps.map((app) => ({ a: hub, b: app.at, bend: 6 }))} hot={step >= 0 ? step : null} box={PHONE} className="sm:hidden" playing={playing && step >= 0} />
      <Wires links={apps.map((app) => ({ a: hub, b: app.at, bend: 18 }))} hot={step >= 0 ? step : null} box={DESK} className="hidden sm:block" playing={playing && step >= 0} />
      <Tile icon={Cpu} label="AI team" at={hub} active z={48} />
      {apps.map((app, index) => (
        <Tile key={app.label} icon={app.icon} label={app.label} at={app.at} z={28} active={index === step} badge={index === step ? app.toast : undefined} />
      ))}
    </Canvas>
  );
}

const gates = [
  { label: "Routine", detail: "Answers and bookings.", icon: Shield, y: 20 },
  { label: "Manager", detail: "Discounts above the limit.", icon: Headset, y: 46 },
  { label: "Director", detail: "Large payments.", icon: Waypoints, y: 68 },
];

export function GuardrailsDiagram({ playing, settle = false, onHold }: { playing: boolean; settle?: boolean; onHold?: (held: boolean) => void }) {
  const [step, setStep] = useState(settle ? 3 : 0);
  const [waiting, setWaiting] = useState(false);
  const [approved, setApproved] = useState(settle);
  const holdRef = useRef(onHold);
  const waitingRef = useRef(false);

  useLayoutEffect(() => {
    holdRef.current = onHold;
  }, [onHold]);

  useEffect(() => {
    if (!playing || settle) return;
    const timers = [
      window.setTimeout(() => setStep(1), 800),
      window.setTimeout(() => {
        setStep(2);
        waitingRef.current = true;
        setWaiting(true);
        holdRef.current?.(true);
      }, 1800),
    ];
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      if (waitingRef.current) {
        waitingRef.current = false;
        holdRef.current?.(false);
      }
    };
  }, [playing, settle]);

  function approve() {
    waitingRef.current = false;
    setWaiting(false);
    setApproved(true);
    holdRef.current?.(false);
    window.setTimeout(() => setStep(3), 400);
  }

  return (
      <Canvas
        playing={playing}
        name="guardrails"
        held={waiting}
        overlay={
          <div className="absolute inset-x-0 bottom-6 z-30 flex justify-center px-6">
            {waiting ? (
              <button type="button" data-testid="approve-action" onClick={approve} className="inline-flex min-h-12 items-center rounded-full bg-accent px-6 text-base font-semibold text-accent-ink">
                Approve
              </button>
            ) : approved ? (
              <p className="text-base text-foreground">Approved by Sales manager</p>
            ) : null}
          </div>
        }
      >
        {gates.map((gate, index) => (
          <Tile key={gate.label} icon={gate.icon} label={gate.label} detail={gate.detail} at={{ x: 50, y: gate.y }} tier active={step === index + 1 || (settle && index === 2)} z={24 + index * 8} />
        ))}
      </Canvas>
  );
}

export function RunsDiagram({ playing, settle = false }: { playing: boolean; settle?: boolean }) {
  const [mode, setMode] = useState<"cloud" | "private">(settle ? "private" : "cloud");

  useEffect(() => {
    if (!playing || settle) return;
    const timer = window.setTimeout(() => setMode("private"), 1800);
    return () => clearTimeout(timer);
  }, [playing, settle]);

  const server = { x: 28, y: 48 };
  const cloud = { x: 74, y: 36 };

  return (
    <Canvas playing={playing} name="runs">
      <Wires links={[{ a: server, b: mode === "cloud" ? cloud : { x: 28, y: 64 }, bend: mode === "cloud" ? 20 : 0 }]} hot={0} box={PHONE} className="sm:hidden" playing={playing} />
      <Wires links={[{ a: server, b: mode === "cloud" ? cloud : { x: 28, y: 64 }, bend: mode === "cloud" ? 80 : 0 }]} hot={0} box={DESK} className="hidden sm:block" playing={playing} />
      <Tile icon={Server} label="Your server" at={server} active={mode === "private"} z={40} onOpen={() => setMode("private")} />
      <Tile icon={Cloud} label="Cloud" at={cloud} active={mode === "cloud"} z={28} onOpen={() => setMode("cloud")} />
      {mode === "private" ? (
        <div className="aid-anchor" style={{ ...place({ x: 28, y: 82 }), "--z": "24px" } as CSSProperties}>
          <span className="aid-bill inline-flex items-center gap-2 text-accent">
            <Lock size={16} strokeWidth={1.75} aria-hidden />
            <span className="aid-label font-medium">Data stays inside</span>
          </span>
        </div>
      ) : null}
    </Canvas>
  );
}
