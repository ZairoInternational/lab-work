export const WHATSAPP_E164 = "919956499800";

export function whatsappHref(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_E164}`;
  if (!message?.trim()) return base;
  return `${base}?text=${encodeURIComponent(message.trim())}`;
}
