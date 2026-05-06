import { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  actions,
  badge,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <section className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6 animate-fade-in">
      <div>
        {badge && <div className="mb-3">{badge}</div>}
        <h1 className="font-display text-3xl md:text-4xl font-black tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && <p className="text-muted-foreground mt-2 text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </section>
  );
}
