import { FileText, Image } from "lucide-react";
import { isLikelyImageUrl } from "@/src/lib/mediaUrl";

type Props = {
  url: string;
  onRemove?: () => void;
};

/** Large enough to read fine print when transcribing into the spec table editor. */
const PREVIEW_MAX_W = "max-w-6xl";
const PREVIEW_MAX_H = "max-h-[min(88vh,1024px)]";
const PREVIEW_MIN_H = "min-h-[22rem] sm:min-h-[28rem]";

/**
 * Preview for the product `pdf` field: PDFs use a wide, tall frame (live site–like);
 * images use a roomy framed layout so specification details stay legible next to the table editor.
 */
export function AdminProductDescriptionMediaPreview({ url, onRemove }: Props) {
  const isImage = isLikelyImageUrl(url);

  if (isImage) {
    return (
      <div className="mt-4 space-y-4">
        <p className="text-sm font-medium text-slate-700">
          Preview — enlarge the window or open in a new tab if you need pixel-level detail while
          filling the specification table.
        </p>
        <div className={`w-full ${PREVIEW_MAX_W}`}>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <div className="rounded-xl bg-blue-100 p-2">
              <Image className="h-6 w-6 text-blue-600" aria-hidden />
            </div>
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">Product description image</h2>
          </div>
          <div
            className={`relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl ${PREVIEW_MIN_H} ${PREVIEW_MAX_H}`}
          >
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex min-h-0 flex-1 items-center justify-center p-3 sm:p-6 lg:p-8"
            >
              <img
                src={url}
                alt="Product description — click to open full size"
                className="max-h-full max-w-full object-contain transition-opacity group-hover:opacity-95"
              />
            </a>
          </div>
        </div>
        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Remove file
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      <p className="text-sm font-medium text-slate-700">
        Preview — first page / raster view. Use full screen in a new tab for the crispest text when
        copying into the table.
      </p>
      <div className={`w-full ${PREVIEW_MAX_W}`}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="rounded-xl bg-emerald-100 p-2">
            <FileText className="h-6 w-6 text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Product specification</h2>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-blue-50/30 shadow-lg transition-shadow duration-300 hover:shadow-xl">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex w-full flex-col ${PREVIEW_MIN_H} ${PREVIEW_MAX_H}`}
          >
            <div className="flex min-h-0 flex-1 items-center justify-center p-3 sm:p-6 lg:p-8">
              <img
                src={url}
                alt="Product specification — click to open full size"
                className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </div>
          </a>
        </div>
      </div>
      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          className="text-sm font-semibold text-red-600 hover:text-red-700"
        >
          Remove file
        </button>
      ) : null}
    </div>
  );
}
