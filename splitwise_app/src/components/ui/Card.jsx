import { cn } from "../../lib/utils";

export function Card({ className, children, title, description, ...props }) {
  return (
    <div className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50 transition-all hover:shadow-md flex flex-col", className)} {...props}>
      {(title || description) && (
        <div className="flex flex-col space-y-1.5 p-6 pb-2">
          {title && <h3 className="font-semibold leading-none tracking-tight text-lg">{title}</h3>}
          {description && <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      )}
      <div className="p-6 pt-4 flex-1 min-h-0">{children}</div>
    </div>
  );
}
