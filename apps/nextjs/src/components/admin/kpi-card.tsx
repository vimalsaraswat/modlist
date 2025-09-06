"use client";

import React from "react";

import { formatCompactNumber } from "@acme/helpers";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";

export default function KPICard({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value?: number | null;
  hint?: string;
  tone?: "default" | "warning" | "danger" | "success";
}) {
  const toneClass =
    tone === "warning"
      ? "bg-secondary ring-primary"
      : tone === "danger"
        ? "bg-destructive/10"
        : tone === "success"
          ? "bg-green-50"
          : "";

  return (
    <Card className={`p-4 ${toneClass}`}>
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-2xl font-semibold">
              {value ? formatCompactNumber(value) : "N/A"}
            </div>
            {hint && (
              <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
