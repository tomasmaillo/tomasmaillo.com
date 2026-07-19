import {
  ArrowRight,
  Braces,
  Check,
  ChevronDown,
  Database,
  EyeOff,
  PencilLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type FlowCardProps = {
  detail: string;
  icon: LucideIcon;
  label: string;
  step: string;
  title: string;
  accented?: boolean;
};

function FlowCard({
  detail,
  icon: Icon,
  label,
  step,
  title,
  accented,
}: FlowCardProps) {
  return (
    <div
      className={`relative min-h-28 rounded-xl border bg-background p-3 text-foreground ${
        accented ? "border-accent" : "border-[var(--flow-line)]"
      }`}
    >
      {accented && (
        <div
          className="absolute inset-x-3 top-0 h-px bg-accent"
          aria-hidden="true"
        />
      )}
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] tracking-wide text-muted">
          {step} · {label}
        </span>
        <Icon
          className="h-4 w-4 shrink-0 text-accent"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>
      <div className="mt-4 text-[13px] font-medium leading-tight">{title}</div>
      <div className="mt-1.5 text-[11px] leading-relaxed text-muted">
        {detail}
      </div>
    </div>
  );
}

function FlowArrow() {
  return (
    <div
      className="flex items-center justify-center text-muted"
      aria-hidden="true"
    >
      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
    </div>
  );
}

export function ModerationFlow() {
  return (
    <figure className="my-10 md:-ml-24 md:w-[calc(100%+12rem)]">
      <div className="overflow-x-auto pb-3">
        <div
          className="min-w-[736px] rounded-2xl bg-card p-5 text-card-foreground [--flow-line:hsl(var(--foreground)/0.12)]"
          role="img"
          aria-label="A drawing passes through Cloudflare Turnstile to a Next.js endpoint. It is stored in Supabase before OpenAI moderates it. The result returns to the endpoint, which publishes or holds the drawing and sends a phone notification."
        >
          <div className="mb-5 flex items-center justify-between gap-4">
            <div className="text-sm font-medium">From doodle to decision</div>
            <div className="font-mono text-[9px] uppercase tracking-wider text-muted">
              Every submission
            </div>
          </div>

          <div className="grid grid-cols-[118px_24px_118px_24px_118px_24px_118px_24px_118px] items-stretch">
            <FlowCard
              step="01"
              label="Visitor"
              title="Draw something"
              detail="Canvas + message"
              icon={PencilLine}
            />
            <FlowArrow />
            <FlowCard
              step="02"
              label="Cloudflare"
              title="Turnstile"
              detail="Quiet bot check"
              icon={ShieldCheck}
            />
            <FlowArrow />
            <FlowCard
              step="03"
              label="Next.js"
              title="API route"
              detail="Verify the request"
              icon={Braces}
              accented
            />
            <FlowArrow />
            <FlowCard
              step="04"
              label="Supabase"
              title="Store it first"
              detail="Image + pending row"
              icon={Database}
              accented
            />
            <FlowArrow />
            <FlowCard
              step="05"
              label="OpenAI"
              title="Moderate"
              detail="Prompt + drawing"
              icon={Sparkles}
            />

            <div
              className="relative col-start-5 col-end-10 h-16 text-muted"
              aria-hidden="true"
            >
              <div className="absolute right-[59px] top-0 h-6 border-l border-[var(--flow-line)]" />
              <div className="absolute left-[59px] right-[59px] top-6 border-t border-[var(--flow-line)]" />
              <div className="absolute bottom-1 left-[59px] top-6 border-l border-[var(--flow-line)]" />
              <ChevronDown
                className="absolute bottom-0 left-[53px] h-3 w-3 text-muted"
                strokeWidth={1.5}
              />
              <span className="absolute left-1/2 top-[17px] -translate-x-1/2 whitespace-nowrap bg-card px-2 font-mono text-[10px]">
                approved / rejected JSON returns
              </span>
            </div>

            <div className="col-start-5 col-end-10 rounded-xl border border-[var(--flow-line)] bg-background p-4 text-foreground">
              <div className="flex items-center gap-2 border-b border-[var(--flow-line)] pb-3">
                <Braces
                  className="h-4 w-4 text-accent"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wide text-muted">
                    Back in the Next.js endpoint
                  </div>
                  <div className="mt-0.5 text-xs font-medium">
                    Apply the decision
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-[var(--flow-line)] pt-3">
                <div className="pr-3">
                  <Check
                    className="mb-2 h-4 w-4 text-accent"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  <div className="text-xs font-medium">Approved</div>
                  <div className="mt-1 text-[11px] text-muted">
                    Show in the gallery
                  </div>
                </div>
                <div className="px-3">
                  <EyeOff
                    className="mb-2 h-4 w-4 text-accent"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  <div className="text-xs font-medium">Rejected</div>
                  <div className="mt-1 text-[11px] text-muted">
                    Keep it held back
                  </div>
                </div>
                <div className="pl-3">
                  <Smartphone
                    className="mb-2 h-4 w-4 text-accent"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                  <div className="text-xs font-medium">Notify me</div>
                  <div className="mt-1 text-[11px] text-muted">
                    Ping my phone either way
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3 border-t border-[var(--flow-line)] pt-4">
            <Database
              className="h-4 w-4 shrink-0 text-accent"
              strokeWidth={1.7}
              aria-hidden="true"
            />
            <p className="m-0 text-xs leading-relaxed text-muted">
              Every submission stays in Supabase — including rejected drawings —
              so the benchmark dataset grows on its own.
            </p>
          </div>
        </div>
      </div>
      <figcaption className="mt-1 text-center text-xs leading-relaxed text-muted">
        The AI controls visibility, not whether a submission survives.
      </figcaption>
    </figure>
  );
}
