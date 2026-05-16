"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import type { LucideIcon } from "lucide-react";
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, Linkedin, Youtube, Github } from "lucide-react";
import {
  MAP_EMBED_SRC,
  withContactDefaults,
  phoneTelHref,
  formatPhoneDisplay,
  type SiteContactInfo,
} from "@/src/lib/site-contact";

type SocialLinks = {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  github: string;
};

const socialItems: { key: keyof SocialLinks; label: string; Icon: LucideIcon }[] = [
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "twitter", label: "X (Twitter)", Icon: Twitter },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "youtube", label: "YouTube", Icon: Youtube },
  { key: "github", label: "GitHub", Icon: Github },
];

function hrefUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return "#";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  return `https://${t.replace(/^\/+/, "")}`;
}

export default function ContactSidebar() {
  const [contact, setContact] = useState<SiteContactInfo>(() => withContactDefaults());
  const [social, setSocial] = useState<SocialLinks | null>(null);

  useEffect(() => {
    let cancelled = false;
    axios
      .get<Partial<SiteContactInfo>>("/api/contact-info")
      .then((res) => {
        if (!cancelled) setContact(withContactDefaults(res.data));
      })
      .catch(() => {
        if (!cancelled) setContact(withContactDefaults());
      });
    axios
      .get<SocialLinks>("/api/social-links")
      .then((res) => {
        if (!cancelled) setSocial(res.data);
      })
      .catch(() => {
        if (!cancelled) setSocial(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const emails = [contact.email1, contact.email2, contact.email3].filter(Boolean);
  const hasAnySocial =
    social && socialItems.some(({ key }) => String(social[key] ?? "").trim().length > 0);

  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-gray-200">
        <iframe
          title="Benchtop Equipment location on Google Maps"
          src={MAP_EMBED_SRC}
          className="h-72 w-full border-0 sm:h-80"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="rounded-lg bg-white p-6 shadow-lg ring-1 ring-gray-100">
        <h2 className="mb-5 text-xl font-semibold text-gray-900">Get in touch</h2>
        <ul className="space-y-4 text-gray-600">
          <li className="flex gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden />
            <div>
              <p className="text-sm font-medium text-gray-900">Address</p>
              <p className="mt-1 text-sm leading-relaxed">{contact.address}</p>
            </div>
          </li>
          <li className="flex gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden />
            <div>
              <p className="text-sm font-medium text-gray-900">Contact no.</p>
              <div className="mt-1 flex flex-col gap-1 text-sm">
                <a href={phoneTelHref(contact.phone1)} className="hover:text-blue-600">
                  {formatPhoneDisplay(contact.phone1)}
                </a>
                <a href={phoneTelHref(contact.phone2)} className="hover:text-blue-600">
                  {formatPhoneDisplay(contact.phone2)}
                </a>
              </div>
            </div>
          </li>
          <li className="flex gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" aria-hidden />
            <div>
              <p className="text-sm font-medium text-gray-900">Contact mail</p>
              <div className="mt-1 flex flex-col gap-1 text-sm">
                {emails.map((email) => (
                  <a key={email} href={`mailto:${email}`} className="break-all hover:text-blue-600">
                    {email}
                  </a>
                ))}
              </div>
            </div>
          </li>
        </ul>

        {hasAnySocial ? (
          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="mb-3 text-sm font-medium text-gray-900">Follow us</p>
            <div className="flex flex-wrap gap-3">
              {socialItems.map(({ key, label, Icon }) => {
                const raw = social?.[key];
                if (!raw || !String(raw).trim()) return null;
                return (
                  <Link
                    key={key}
                    href={hrefUrl(raw)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="rounded-full bg-gray-100 p-2.5 text-gray-600 transition-colors hover:bg-blue-600 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
