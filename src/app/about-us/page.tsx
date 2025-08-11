"use client"

import type React from "react"

import { useState, useEffect, type ReactNode } from "react"
import {
  Microscope,
  Award,
  Users,
  Target,
  CheckCircle,
  Settings,
  Shield,
  Wrench,
  Globe,
  ArrowRight,
  Factory,
  Heart,
  Lightbulb,
  Handshake,
} from "lucide-react"
import { twMerge } from "tailwind-merge" // Using twMerge for conditional class names

// Re-implementing Button component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "lg"
  children: ReactNode
}

const Button = ({ className, variant = "default", size = "default", children, ...props }: ButtonProps) => {
  const baseClasses =
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  const variantClasses = {
    default: "bg-blue-400 text-white hover:bg-blue-500",
    outline: "border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent",
  }
  const sizeClasses = {
    default: "h-10 px-4 py-2",
    lg: "h-12 px-8 py-4 text-lg",
  }

  return (
    <button className={twMerge(baseClasses, variantClasses[variant], sizeClasses[size], className)} {...props}>
      {children}
    </button>
  )
}

// Re-implementing Card component
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const Card = ({ className, children, ...props }: CardProps) => {
  return (
    <div className={twMerge("rounded-xl border bg-card text-card-foreground shadow", className)} {...props}>
      {children}
    </div>
  )
}

// Re-implementing CardContent component
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

const CardContent = ({ className, children, ...props }: CardContentProps) => {
  return (
    <div className={twMerge("p-6", className)} {...props}>
      {children}
    </div>
  )
}

export default function AboutUs() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-24 px-4 text-center bg-gradient-to-b from-blue-50/30 via-blue-25/10 to-white">
        <div className="max-w-4xl mx-auto">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">About Us</h1>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              Pioneering laboratory excellence through innovative equipment and unwavering commitment to scientific
              advancement
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section id="story" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Our Story</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  For over a decade, <span className="font-semibold text-blue-400">Benchtop Equipment Inc.</span> has
                  been at the forefront of laboratory innovation, manufacturing precision instruments and furniture that
                  power scientific discovery across the globe.
                </p>
                <p>
                  Headquartered in Kanpur, India, our ISO-certified facilities in Kanpur and Ghaziabad represent the
                  pinnacle of manufacturing excellence. We've built our reputation by serving universities, research
                  centers, pharmaceutical companies, hospitals, government agencies, and international laboratories with
                  unwavering dedication to quality.
                </p>
                <p>
                  As a trusted manufacturing partner to leading global brands, we don't just create equipment—we craft
                  solutions that enable breakthrough research, support critical healthcare initiatives, and advance
                  educational excellence across laboratory research, industrial production, medical, healthcare, and
                  educational sectors.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full border-4 border-blue-400 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border-2 border-blue-400 flex items-center justify-center">
                    <div className="w-48 h-48 rounded-full bg-blue-400/10 flex items-center justify-center">
                      <Microscope className="w-24 h-24 text-blue-400" />
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-400 rounded-full flex items-center justify-center">
                  <Factory className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section id="values" className="py-20 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Mission & Values</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Target,
                title: "Quality Excellence",
                description:
                  "Unwavering commitment to manufacturing precision instruments that exceed industry standards and customer expectations.",
              },
              {
                icon: Lightbulb,
                title: "Innovation",
                description:
                  "Continuous advancement in product design and manufacturing processes to stay ahead of scientific needs.",
              },
              {
                icon: Heart,
                title: "Customer Satisfaction",
                description:
                  "Dedicated to providing outstanding service and customized solutions that perfectly match client requirements.",
              },
              {
                icon: Handshake,
                title: "Ethical Practices",
                description:
                  "Conducting business with integrity, fairness, and transparency in all our partnerships and collaborations.",
              },
            ].map((value, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-400/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-400 transition-colors duration-300">
                    <value.icon className="w-8 h-8 text-blue-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="choose" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose Us</h2>
            <div className="w-24 h-1 bg-blue-400 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover what sets us apart in the laboratory equipment industry
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Expert Consultation",
                description:
                  "Our experienced team provides comprehensive guidance to help you select the perfect equipment for your specific needs.",
              },
              {
                icon: Settings,
                title: "Custom Solutions",
                description:
                  "Tailored manufacturing capabilities to create specialized equipment that meets your unique laboratory requirements.",
              },
              {
                icon: Shield,
                title: "Quality Assurance",
                description:
                  "ISO-certified processes ensure every product meets the highest standards of quality and reliability.",
              },
              {
                icon: Wrench,
                title: "In-house CAD",
                description:
                  "Advanced design capabilities allow us to prototype and perfect solutions before manufacturing.",
              },
              {
                icon: CheckCircle,
                title: "Installation & Commissioning",
                description:
                  "Complete end-to-end service including professional installation and system commissioning.",
              },
              {
                icon: Globe,
                title: "Global Partnership",
                description:
                  "Trusted manufacturing partner with leading international brands for specialized laboratory equipment.",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md"
              >
                <CardContent className="p-8">
                  <div className="w-14 h-14 bg-blue-400/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-400 transition-colors duration-300">
                    <feature.icon className="w-7 h-7 text-blue-400 group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Global Reach Section */}
      <section id="global" className="py-20 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">Global Reach</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  From our manufacturing facilities in India, we serve customers across multiple continents, delivering
                  precision laboratory equipment to diverse markets including India, Asia, Africa, and the Middle East.
                </p>
                <p>
                  Our international presence reflects our commitment to supporting scientific advancement worldwide,
                  with logistics networks and partnerships that ensure reliable delivery and service across borders.
                </p>
                <p>
                  Whether you're a research institution in Mumbai, a pharmaceutical company in Dubai, or a university
                  laboratory in Nairobi, we bring the same level of excellence and dedication to every partnership.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-96 h-64 bg-blue-400/5 rounded-2xl flex items-center justify-center border-2 border-blue-400/20">
                  <Globe className="w-32 h-32 text-blue-400" />
                </div>
                <div className="absolute top-4 right-4 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                <div className="absolute bottom-8 left-8 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
                <div className="absolute top-1/2 left-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-700"></div>
                <div className="absolute bottom-4 right-1/3 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action Footer */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Ready to Elevate Your Laboratory?
          </h2>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl mx-auto">
            Partner with us to access world-class laboratory equipment and solutions tailored to your specific research
            and operational needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-400 hover:bg-blue-500 text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              Request a Quote
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-transparent"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
