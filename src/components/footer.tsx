"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import axios from "axios";
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Github } from "lucide-react";

type SocialLinks = {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  github: string;
};

type Achievement = {
  _id: string;
  title: string;
  description: string;
  photo: string;
  createdAt?: string;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
};

const socialItems: {
  key: keyof SocialLinks;
  label: string;
  Icon: LucideIcon;
}[] = [
  { key: "facebook", label: "Facebook", Icon: Facebook },
  { key: "instagram", label: "Instagram", Icon: Instagram },
  { key: "twitter", label: "X (Twitter)", Icon: Twitter },
  { key: "linkedin", label: "LinkedIn", Icon: Linkedin },
  { key: "youtube", label: "YouTube", Icon: Youtube },
  { key: "github", label: "GitHub", Icon: Github },
];

const usefulLinks = [
  { href: "/", label: "Home" },
  { href: "/about-us", label: "About Us" },
  { href: "/certificates", label: "Certificates" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact-us", label: "Contact Us" },
];

function hrefUrl(raw: string): string {
  const t = raw.trim();
  if (!t) return "#";
  if (t.startsWith("http://") || t.startsWith("https://")) return t;
  return `https://${t.replace(/^\/+/, "")}`;
}

function formatAchievementDate(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

export default function Footer() {
  const [social, setSocial] = useState<SocialLinks | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let cancelled = false;

    axios
      .get<SocialLinks>("/api/social-links")
      .then((res) => {
        if (!cancelled) setSocial(res.data);
      })
      .catch(() => {
        if (!cancelled) setSocial(null);
      });

    axios
      .get<Achievement[]>("/api/achievements")
      .then((res) => {
        if (!cancelled) {
          const list = Array.isArray(res.data) ? res.data : [];
          setAchievements(list.slice(0, 2));
        }
      })
      .catch(() => {
        if (!cancelled) setAchievements([]);
      });

    axios
      .get<Category[]>("/api/category/getCategory")
      .then((res) => {
        if (!cancelled) {
          const list = Array.isArray(res.data) ? res.data : [];
          setCategories(list.slice(0, 5));
        }
      })
      .catch(() => {
        if (!cancelled) setCategories([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const hasAnySocial =
    social && socialItems.some(({ key }) => String(social[key] ?? "").trim().length > 0);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 lg:grid-cols-4">
          <div>
            <Link href="/">
              <img src="/assets/benchtop_logo_big.png" alt="Benchtop Equipment" className="mb-6 h-12" />
            </Link>
            <p className="mb-6 leading-relaxed text-gray-400">
              Benchtop laboratory equipment designed for real lab work—quality verification, efficient operation,
              and responsive support from enquiry to delivery.
            </p>
            {hasAnySocial ? (
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
                      className="text-gray-400 transition-colors duration-300 hover:text-white"
                    >
                      <Icon className="h-5 w-5" />
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Useful Links</h4>
            <ul className="space-y-3">
              {usefulLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="text-gray-400 transition-colors duration-300 hover:text-white">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Products</h4>
            {categories.length > 0 ? (
              <ul className="space-y-3">
                {categories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      href={`/products/${cat.slug}`}
                      className="text-gray-400 transition-colors duration-300 hover:text-white"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-gray-400 transition-colors duration-300 hover:text-white">
                    Browse all products
                  </Link>
                </li>
              </ul>
            )}
          </div>

          <div>
            <h4 className="mb-6 text-lg font-semibold">Achievements</h4>
            {achievements.length > 0 ? (
              <div className="space-y-4">
                {achievements.map((item) => (
                  <div key={item._id} className="flex space-x-3">
                    <img
                      src={item.photo}
                      alt={item.title}
                      className="h-16 w-16 shrink-0 rounded object-cover"
                    />
                    <div>
                      <h6 className="mb-2 text-sm font-medium leading-tight">
                        <Link
                          href="/achievements"
                          className="transition-colors duration-300 hover:text-blue-400"
                        >
                          {item.title}
                        </Link>
                      </h6>
                      {formatAchievementDate(item.createdAt) ? (
                        <p className="text-xs text-gray-400">{formatAchievementDate(item.createdAt)}</p>
                      ) : null}
                    </div>
                  </div>
                ))}
                <Link
                  href="/achievements"
                  className="inline-block text-sm text-blue-400 transition-colors hover:text-blue-300"
                >
                  View all achievements →
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                <Link href="/achievements" className="transition-colors hover:text-white">
                  View our achievements
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="space-y-2 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Benchtop Equipment. All rights reserved.</p>
            <p>
              Built and developed by{" "}
              <span className="text-gray-300">Zairo International Private Limited</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
