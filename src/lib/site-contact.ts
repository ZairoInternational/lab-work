export const DEFAULT_CONTACT_INFO = {
  address: "123 / 941, FAZALGANJ INDUSTRIAL AREA, KANPUR -208012",
  phone1: "9005819628",
  phone2: "9956499800",
  email1: "benchtopinckanpur@gmail.com",
  email2: "info@benchtopequipment.com",
  email3: "benchtop.admiin@gmail.com",
} as const;

export type SiteContactInfo = {
  address: string;
  phone1: string;
  phone2: string;
  email1: string;
  email2: string;
  email3: string;
};

export const MAP_EMBED_SRC = `https://maps.google.com/maps?q=${encodeURIComponent(
  "123/941, Fazalganj Industrial Area, Kanpur 208012"
)}&hl=en&z=15&output=embed`;

export function withContactDefaults(partial?: Partial<SiteContactInfo> | null): SiteContactInfo {
  return {
    address: partial?.address?.trim() || DEFAULT_CONTACT_INFO.address,
    phone1: partial?.phone1?.trim() || DEFAULT_CONTACT_INFO.phone1,
    phone2: partial?.phone2?.trim() || DEFAULT_CONTACT_INFO.phone2,
    email1: partial?.email1?.trim() || DEFAULT_CONTACT_INFO.email1,
    email2: partial?.email2?.trim() || DEFAULT_CONTACT_INFO.email2,
    email3: partial?.email3?.trim() || DEFAULT_CONTACT_INFO.email3,
  };
}

export function phoneTelHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `tel:+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `tel:+${digits}`;
  return digits ? `tel:+${digits}` : "#";
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) return `+91 ${digits}`;
  return phone.trim();
}
