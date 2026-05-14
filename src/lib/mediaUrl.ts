/** Guess from URL path whether the file is an image (for description / spec media stored in `pdf` field). */
export function isLikelyImageUrl(url: string): boolean {
  const path = url.split("?")[0].split("#")[0].toLowerCase();
  return /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico|heic|heif)$/.test(path);
}

/** Route description uploads: images use the product image GitHub path; PDFs use `uploadedpdf`. */
export function descriptionMediaUploadEndpoint(file: File): "/api/upload" | "/api/uploadPdf" {
  const name = file.name.toLowerCase();
  if (
    file.type.startsWith("image/") ||
    /\.(png|jpe?g|gif|webp|svg|avif|bmp|ico|heic|heif)$/.test(name)
  ) {
    return "/api/upload";
  }
  return "/api/uploadPdf";
}
