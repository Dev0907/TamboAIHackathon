import { Card } from "./Card";
import { cn } from "../../lib/utils";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export function StatsCard({ title, value, subtext, trend, className, icon: Icon, trendLabel }) {
  const isPositive = trend > 0;
  // Cost increasing is strictly bad (Red), decreasing is good (Green)
  // Or: Profit increasing good, Debt increasing bad.
  // We'll let the parent decide color or default to: +ve = Red (more spending), -ve = Green.

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold tracking-tight">{value}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            {trend !== undefined && (
              <span className={cn("text-xs font-medium flex items-center px-1.5 py-0.5 rounded-full", isPositive ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400")}>
                {isPositive ? <ArrowUpIcon className="w-3 h-3 mr-1" /> : <ArrowDownIcon className="w-3 h-3 mr-1" />}
                {Math.abs(trend)}%
              </span>
            )}
            {subtext && <p className="text-xs text-slate-400">{subtext}</p>}
          </div>
        </div>
        {Icon && (
          <div className="h-10 w-10 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 dark:bg-brand-900/20 dark:text-brand-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
