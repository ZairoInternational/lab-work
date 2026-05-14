"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SITE_CLIENTS } from "@/src/data/default-site-clients";

export type SiteClientDisplay = { _id: string; name: string; logo: string };

function fallbackList(): SiteClientDisplay[] {
  return DEFAULT_SITE_CLIENTS.map((c, i) => ({
    _id: `fallback-${i}`,
    name: c.name,
    logo: c.logo,
  }));
}

/** Public list from `/api/clients` when the DB has rows; otherwise the default About-page partner set. */
export function useSiteClients(): SiteClientDisplay[] {
  const [clients, setClients] = useState<SiteClientDisplay[]>(fallbackList);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/clients", { cache: "no-store" });
        const body = await res.json().catch(() => ({}));
        const rows = body?.data;
        if (cancelled || !Array.isArray(rows) || rows.length === 0) return;
        setClients(
          rows.map((row: { _id: string; name: string; logo: string }) => ({
            _id: String(row._id),
            name: String(row.name ?? ""),
            logo: String(row.logo ?? ""),
          }))
        );
      } catch {
        /* keep fallback */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return clients;
}
