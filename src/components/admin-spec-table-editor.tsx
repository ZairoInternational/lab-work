"use client";

import { useCallback, useState } from "react";
import { Table2 } from "lucide-react";
import {
  emptySpecGrid,
  getSpecTableTheme,
  resizeSpecGrid,
  SPEC_TABLE_PICKER_MAX,
  SPEC_TABLE_THEMES,
  type SpecMoreInfoItem,
  type SpecTableMeta,
} from "@/src/lib/specTable";

type Props = {
  value: string[][] | null;
  onChange: (next: string[][] | null) => void;
  meta: SpecTableMeta;
  onMetaChange: (next: SpecTableMeta) => void;
};

function cellFontWeight(meta: SpecTableMeta, ri: number, ci: number): number {
  if ((meta.boldFirstRow && ri === 0) || (meta.boldFirstCol && ci === 0)) {
    return 700;
  }
  return 400;
}

/** Hover grid + click to confirm size, then fill cells; themes + optional bullet lines below table. */
export function AdminSpecTableEditor({
  value,
  onChange,
  meta,
  onMetaChange,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);

  const hasTable = value && value.length > 0 && value[0].length > 0;
  const theme = getSpecTableTheme(meta.themeId);

  const closePicker = useCallback(() => {
    setPickerOpen(false);
    setHover(null);
  }, []);

  const openPicker = useCallback(() => {
    setPickerOpen(true);
    setHover(null);
  }, []);

  const commitSize = useCallback(
    (rows: number, cols: number) => {
      if (rows < 1 || cols < 1) return;
      if (hasTable && value) {
        onChange(resizeSpecGrid(value, rows, cols));
      } else {
        onChange(emptySpecGrid(rows, cols));
      }
      closePicker();
    },
    [closePicker, hasTable, onChange, value]
  );

  const updateCell = useCallback(
    (r: number, c: number, text: string) => {
      if (!value) return;
      const next = value.map((row, ri) =>
        ri === r ? row.map((cell, ci) => (ci === c ? text : cell)) : [...row]
      );
      onChange(next);
    },
    [onChange, value]
  );

  const updateMoreItem = useCallback(
    (index: number, patch: Partial<SpecMoreInfoItem>) => {
      const next = meta.moreInfoItems.map((it, j) =>
        j === index ? { ...it, ...patch } : it
      );
      onMetaChange({ ...meta, moreInfoItems: next });
    },
    [meta, onMetaChange]
  );

  const removeMoreItem = useCallback(
    (index: number) => {
      onMetaChange({
        ...meta,
        moreInfoItems: meta.moreInfoItems.filter((_, j) => j !== index),
      });
    },
    [meta, onMetaChange]
  );

  const addMoreItem = useCallback(() => {
    onMetaChange({
      ...meta,
      moreInfoItems: [
        ...meta.moreInfoItems,
        { heading: "", content: "", headingBold: true },
      ],
    });
  }, [meta, onMetaChange]);

  const hoverRows = hover ? hover.r + 1 : 0;
  const hoverCols = hover ? hover.c + 1 : 0;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
          <Table2 className="h-4 w-4 text-blue-600 shrink-0" aria-hidden />
          Specification table
        </div>
        {!hasTable ? (
          <button
            type="button"
            onClick={openPicker}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Draw table…
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openPicker}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Change size…
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(null);
                closePicker();
              }}
              className="text-sm font-medium text-red-600 hover:text-red-700"
            >
              Remove table
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-600 leading-relaxed">
        Hover the grid to choose rows and columns (like Excel), then click a cell
        to create or resize the table. Fill in the cells below.
      </p>

      {pickerOpen && (
        <div
          className="rounded-lg border border-blue-200 bg-white p-3 shadow-sm space-y-2"
          role="dialog"
          aria-label="Choose table size"
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-gray-700">
              {hover
                ? `${hoverRows} × ${hoverCols} — click to confirm`
                : "Hover to select size, then click"}
            </span>
            <button
              type="button"
              onClick={closePicker}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
          </div>
          <div
            className="inline-block select-none"
            onMouseLeave={() => setHover(null)}
          >
            <div
              className="grid gap-0.5 p-1 bg-slate-100 rounded-md border border-slate-200 w-fit"
              style={{
                gridTemplateColumns: `repeat(${SPEC_TABLE_PICKER_MAX}, 14px)`,
              }}
            >
              {Array.from({ length: SPEC_TABLE_PICKER_MAX }, (_, r) =>
                Array.from({ length: SPEC_TABLE_PICKER_MAX }, (_, c) => {
                  const inHover =
                    hover !== null && r <= hover.r && c <= hover.c;
                  return (
                    <button
                      key={`${r}-${c}`}
                      type="button"
                      className={`h-3.5 w-3.5 rounded-sm border transition-colors ${
                        inHover
                          ? "bg-blue-500 border-blue-600 shadow-sm"
                          : "bg-white border-slate-300 hover:border-blue-400"
                      }`}
                      onMouseEnter={() => setHover({ r, c })}
                      onClick={() => commitSize(r + 1, c + 1)}
                      aria-label={`${r + 1} by ${c + 1} table`}
                    />
                  );
                })
              ).flat()}
            </div>
          </div>
        </div>
      )}

      {hasTable && value && (
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">
              Table colours
            </p>
            <div className="flex flex-wrap gap-2">
              {SPEC_TABLE_THEMES.map((t) => {
                const selected = meta.themeId === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onMetaChange({ ...meta, themeId: t.id })}
                    className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-left transition-all ${
                      selected
                        ? "border-blue-500 ring-2 ring-blue-400/40 bg-white shadow-sm"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                    aria-pressed={selected}
                    title={t.label}
                  >
                    <span className="flex gap-0.5" aria-hidden>
                      <span
                        className="h-4 w-4 rounded-sm border border-black/10"
                        style={{ background: t.headerBg }}
                      />
                      <span
                        className="h-4 w-4 rounded-sm border border-black/10"
                        style={{ background: t.cellBg }}
                      />
                      <span
                        className="h-4 w-4 rounded-sm border border-black/10"
                        style={{ background: t.stripeBg }}
                      />
                    </span>
                    <span className="text-xs font-medium text-gray-800">
                      {t.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-sm text-gray-800">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={meta.boldFirstRow}
                onChange={(e) =>
                  onMetaChange({ ...meta, boldFirstRow: e.target.checked })
                }
              />
              <span>Bold first row</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={meta.boldFirstCol}
                onChange={(e) =>
                  onMetaChange({ ...meta, boldFirstCol: e.target.checked })
                }
              />
              <span>Bold first column</span>
            </label>
          </div>

          {/* Square outer border: table + extension read as one block */}
          <div
            className="overflow-x-auto border bg-white rounded-none"
            style={{ borderColor: theme.border }}
          >
            <table
              className="w-full min-w-[280px] border-collapse text-sm rounded-none"
              style={{ borderColor: theme.border }}
            >
              <tbody>
                {value.map((row, ri) => {
                  const isHeader = ri === 0;
                  const rowBg = isHeader
                    ? theme.headerBg
                    : ri % 2 === 1
                      ? theme.stripeBg
                      : theme.cellBg;
                  const textCol = isHeader ? theme.headerText : theme.cellText;
                  const fw = cellFontWeight(meta, ri, 0);
                  return (
                    <tr key={ri}>
                      {row.map((cell, ci) => (
                        <td
                          key={ci}
                          className="p-0 align-top min-w-[100px]"
                          style={{
                            background: rowBg,
                            color: textCol,
                            border: `1px solid ${theme.border}`,
                            fontWeight: cellFontWeight(meta, ri, ci),
                          }}
                        >
                          <input
                            type="text"
                            className="w-full min-h-[2.5rem] px-2 py-2 bg-transparent outline-none focus:ring-2 focus:ring-inset focus:ring-white/50 placeholder:opacity-40"
                            style={{
                              color: textCol,
                              fontWeight: cellFontWeight(meta, ri, ci),
                            }}
                            value={cell}
                            placeholder={`R${ri + 1} C${ci + 1}`}
                            onChange={(e) => updateCell(ri, ci, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div
              className="border-t px-3 py-3 sm:px-4"
              style={{
                borderColor: theme.border,
                background: theme.cellBg,
                color: theme.cellText,
              }}
            >
              <p className="text-xs font-medium text-gray-600 mb-2">
                Extra notes under the table: each row is{" "}
                <span className="font-semibold text-gray-800">heading : content</span> on the live
                site (heading is bold by default; you can turn that off per row).
              </p>
              <ul className="m-0 list-none space-y-4 p-0">
                {meta.moreInfoItems.map((item, i) => (
                  <li
                    key={i}
                    className="flex flex-col gap-2 rounded-lg border border-white/40 bg-white/30 p-3 sm:flex-row sm:items-start sm:gap-3"
                  >
                    <span
                      className="mt-2 shrink-0 select-none text-current opacity-70 sm:mt-2.5"
                      aria-hidden
                    >
                      •
                    </span>
                    <div className="flex min-w-0 flex-1 flex-wrap items-end gap-x-2 gap-y-2">
                      <div className="min-w-[100px] flex-1 basis-[8rem]">
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Heading
                        </label>
                        <input
                          type="text"
                          className={`w-full border border-gray-300/90 bg-white/90 px-2 py-1.5 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 ${
                            item.headingBold ? "font-semibold" : "font-normal"
                          }`}
                          style={{ color: theme.cellText }}
                          value={item.heading}
                          placeholder="e.g. Warranty"
                          onChange={(e) =>
                            updateMoreItem(i, { heading: e.target.value })
                          }
                        />
                      </div>
                      <label className="flex shrink-0 cursor-pointer items-center gap-2 pb-2 text-xs text-gray-700">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={item.headingBold}
                          onChange={(e) =>
                            updateMoreItem(i, { headingBold: e.target.checked })
                          }
                        />
                        <span>Bold heading</span>
                      </label>
                      <span
                        className="select-none pb-2 text-lg font-medium leading-none text-gray-400"
                        aria-hidden
                      >
                        :
                      </span>
                      <div className="min-w-[120px] flex-1 basis-[12rem]">
                        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                          Content
                        </label>
                        <input
                          type="text"
                          className="w-full border border-gray-300/90 bg-white/90 px-2 py-1.5 text-sm font-normal outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30"
                          style={{ color: theme.cellText }}
                          value={item.content}
                          placeholder="e.g. 1 year parts & labour"
                          onChange={(e) =>
                            updateMoreItem(i, { content: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 self-start text-xs font-medium text-red-600 hover:text-red-800 sm:self-end sm:pb-1"
                      onClick={() => removeMoreItem(i)}
                      aria-label={`Remove row ${i + 1}`}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className="mt-3 text-sm font-semibold text-blue-600 hover:text-blue-800"
                onClick={addMoreItem}
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
