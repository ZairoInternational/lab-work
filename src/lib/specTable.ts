/** Maximum rows and columns allowed in a specification table. */
export const SPEC_TABLE_MAX_ROWS = 30;
export const SPEC_TABLE_MAX_COLS = 30;

/** Max rows/columns in the insert-table hover grid (Word-style picker). */
export const SPEC_TABLE_PICKER_MAX = SPEC_TABLE_MAX_ROWS;

/** Clamp proposed table dimensions to the allowed maximum (minimum 1×1). */
export function clampSpecTableSize(
  rows: number,
  cols: number
): { rows: number; cols: number } {
  return {
    rows: Math.min(Math.max(1, Math.floor(rows)), SPEC_TABLE_MAX_ROWS),
    cols: Math.min(Math.max(1, Math.floor(cols)), SPEC_TABLE_MAX_COLS),
  };
}

/** Trim an existing grid to at most {@link SPEC_TABLE_MAX_ROWS}×{@link SPEC_TABLE_MAX_COLS}. */
export function clampSpecTableRows(rows: string[][] | null): string[][] | null {
  if (!rows?.length) return rows;
  const trimmed = rows.slice(0, SPEC_TABLE_MAX_ROWS).map((row) =>
    Array.isArray(row)
      ? row.slice(0, SPEC_TABLE_MAX_COLS).map((cell) => String(cell ?? ""))
      : []
  );
  const cols = Math.max(0, ...trimmed.map((r) => r.length));
  if (cols === 0) return null;
  return trimmed.map((row) => {
    const next = row.slice(0, cols);
    while (next.length < cols) next.push("");
    return next;
  });
}

/** One bullet row under the spec table: heading (optional bold) + “: ” + content. */
export type SpecMoreInfoItem = {
  heading: string;
  content: string;
  /** When true, heading is shown bold on the storefront (default for new rows). */
  headingBold: boolean;
};

export type SpecTableMeta = {
  themeId: string;
  /** Bullet rows below the table on the live page. */
  moreInfoItems: SpecMoreInfoItem[];
  /** Default: true — bold font for the first row (separate from header colours). */
  boldFirstRow: boolean;
  /** Default: true — bold font for the first column. */
  boldFirstCol: boolean;
};

export type SpecTableThemeColors = {
  id: string;
  label: string;
  headerBg: string;
  headerText: string;
  cellBg: string;
  cellText: string;
  border: string;
  /** Slightly different background for even body rows */
  stripeBg: string;
};

export const DEFAULT_SPEC_TABLE_THEME_ID = "slate";

export const SPEC_TABLE_THEMES: readonly SpecTableThemeColors[] = [
  {
    id: "slate",
    label: "Slate",
    headerBg: "#0f172a",
    headerText: "#f8fafc",
    cellBg: "#ffffff",
    cellText: "#1e293b",
    border: "#cbd5e1",
    stripeBg: "#f8fafc",
  },
  {
    id: "ocean",
    label: "Ocean",
    headerBg: "#0369a1",
    headerText: "#f0f9ff",
    cellBg: "#e0f2fe",
    cellText: "#0c4a6e",
    border: "#0284c7",
    stripeBg: "#bae6fd",
  },
  {
    id: "emerald",
    label: "Emerald",
    headerBg: "#047857",
    headerText: "#ecfdf5",
    cellBg: "#d1fae5",
    cellText: "#064e3b",
    border: "#10b981",
    stripeBg: "#a7f3d0",
  },
  {
    id: "violet",
    label: "Violet",
    headerBg: "#5b21b6",
    headerText: "#faf5ff",
    cellBg: "#ede9fe",
    cellText: "#4c1d95",
    border: "#7c3aed",
    stripeBg: "#ddd6fe",
  },
  {
    id: "rose",
    label: "Rose",
    headerBg: "#9f1239",
    headerText: "#fff1f2",
    cellBg: "#ffe4e6",
    cellText: "#881337",
    border: "#fb7185",
    stripeBg: "#fecdd3",
  },
  {
    id: "amber",
    label: "Amber",
    headerBg: "#b45309",
    headerText: "#fffbeb",
    cellBg: "#fef3c7",
    cellText: "#78350f",
    border: "#f59e0b",
    stripeBg: "#fde68a",
  },
  {
    id: "charcoal",
    label: "Charcoal",
    headerBg: "#171717",
    headerText: "#fafafa",
    cellBg: "#fafafa",
    cellText: "#171717",
    border: "#404040",
    stripeBg: "#f5f5f5",
  },
  {
    id: "teal",
    label: "Teal",
    headerBg: "#0f766e",
    headerText: "#f0fdfa",
    cellBg: "#ccfbf1",
    cellText: "#134e4a",
    border: "#14b8a6",
    stripeBg: "#99f6e4",
  },
  {
    id: "indigo",
    label: "Indigo",
    headerBg: "#3730a3",
    headerText: "#eef2ff",
    cellBg: "#e0e7ff",
    cellText: "#312e81",
    border: "#6366f1",
    stripeBg: "#c7d2fe",
  },
  {
    id: "coral",
    label: "Coral",
    headerBg: "#c2410c",
    headerText: "#fff7ed",
    cellBg: "#ffedd5",
    cellText: "#7c2d12",
    border: "#fb923c",
    stripeBg: "#fed7aa",
  },
] as const;

export function getSpecTableTheme(themeId: string | undefined): SpecTableThemeColors {
  const found = SPEC_TABLE_THEMES.find((t) => t.id === themeId);
  return found ?? SPEC_TABLE_THEMES[0];
}

export function defaultSpecTableMeta(): SpecTableMeta {
  return {
    themeId: DEFAULT_SPEC_TABLE_THEME_ID,
    moreInfoItems: [],
    boldFirstRow: true,
    boldFirstCol: true,
  };
}

export function emptySpecGrid(rows: number, cols: number): string[][] {
  const { rows: r, cols: c } = clampSpecTableSize(rows, cols);
  return Array.from({ length: r }, () =>
    Array.from({ length: c }, () => "")
  );
}

export function resizeSpecGrid(
  prev: string[][],
  rows: number,
  cols: number
): string[][] {
  const { rows: r, cols: c } = clampSpecTableSize(rows, cols);
  return Array.from({ length: r }, (_, ri) =>
    Array.from({ length: c }, (_, ci) => String(prev[ri]?.[ci] ?? ""))
  );
}

export function parseSpecTableFromSpecs(raw: unknown): string[][] | null {
  return parseSpecTableBundle(raw).rows;
}

function parseMoreInfoItemRaw(raw: unknown): SpecMoreInfoItem {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { heading: "", content: "", headingBold: true };
  }
  const o = raw as Record<string, unknown>;
  return {
    heading: typeof o.heading === "string" ? o.heading : "",
    content: typeof o.content === "string" ? o.content : "",
    headingBold: o.headingBold === false ? false : true,
  };
}

function normalizeSpecTableMeta(raw: unknown): SpecTableMeta {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return defaultSpecTableMeta();
  }
  const o = raw as Record<string, unknown>;
  const themeId =
    typeof o.themeId === "string" &&
    SPEC_TABLE_THEMES.some((t) => t.id === o.themeId)
      ? o.themeId
      : DEFAULT_SPEC_TABLE_THEME_ID;

  let moreInfoItems: SpecMoreInfoItem[] = [];

  if (Array.isArray(o.moreInfoItems)) {
    moreInfoItems = o.moreInfoItems.map(parseMoreInfoItemRaw);
  }

  if (moreInfoItems.length === 0 && Array.isArray(o.moreInfoLines)) {
    const lines = o.moreInfoLines.map((x) => String(x ?? "").trim()).filter(Boolean);
    moreInfoItems = lines.map((content) => ({
      heading: "",
      content,
      headingBold: false,
    }));
  }

  if (moreInfoItems.length === 0) {
    const legacyH =
      typeof o.moreInfoHeading === "string" ? o.moreInfoHeading.trim() : "";
    const legacyB =
      typeof o.moreInfoBody === "string" ? o.moreInfoBody.trim() : "";
    if (legacyH) {
      moreInfoItems.push({ heading: legacyH, content: "", headingBold: true });
    }
    if (legacyB) {
      const bodyLines = legacyB
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      for (const content of bodyLines) {
        moreInfoItems.push({ heading: "", content, headingBold: false });
      }
    }
  }

  const boldFirstRow = o.boldFirstRow === false ? false : true;
  const boldFirstCol = o.boldFirstCol === false ? false : true;

  return {
    themeId,
    moreInfoItems,
    boldFirstRow,
    boldFirstCol,
  };
}

export function parseSpecTableBundle(raw: unknown): {
  rows: string[][] | null;
  meta: SpecTableMeta;
} {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return { rows: null, meta: defaultSpecTableMeta() };
  }
  const specs = raw as {
    specTable?: unknown;
    specTableMeta?: unknown;
  };
  const meta = normalizeSpecTableMeta(specs.specTableMeta);
  const t = specs.specTable;
  if (!Array.isArray(t) || t.length === 0) {
    return { rows: null, meta };
  }
  const out: string[][] = [];
  for (const row of t) {
    if (!Array.isArray(row)) {
      return { rows: null, meta };
    }
    out.push(row.map((cell) => String(cell ?? "")));
  }
  return { rows: clampSpecTableRows(out), meta };
}
