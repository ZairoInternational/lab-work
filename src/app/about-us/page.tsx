"use client";
import { useState } from "react";
import {
  Shield,
  Award,
  Heart,
  Users,
  Building2,
  Stethoscope,
} from "lucide-react";
export default function AboutUsPage() {
  const services = [
    {
      id: "manufacturing",
      title: "Manufacturing Partner",
      icon: "🏭",
      summary:
        "Working as manufacturing partner with top brands worldwide, offering the widest range of laboratory equipment.",
      details:
        "For some laboratory equipment and measuring instruments, we are working as a manufacturing partner with top brands worldwide. This helps our customers to choose from the widest range of laboratory equipment in one place.",
    },
    {
      id: "customer-service",
      title: "Customer Service",
      icon: "🤝",
      summary:
        "Unmatched customer service with excellent product delivery, information, and comprehensive support.",
      details:
        "We are committing to unmatched customer service for our clients worldwide. Whether there is a national or international deal at Benchtop Equipment, it promises excellent customer service in terms of product delivery, product information, and online and offline support.",
    },
    {
      id: "quality",
      title: "Guaranteed Quality",
      icon: "✅",
      summary:
        "High-quality laboratory equipment with professional technical support and after-sales service.",
      details:
        "We have achieved extreme quality product performance while maintaining the personalized service you want. With a large team of professionally talented technical persons, marketing personnel, and customer service support Benchtop Equipment provides a guarantee of high-quality laboratory equipment and after-sales service. Our rework rate is very low as we employ the latest manufacturing and design technology. When it comes to machinery parts and other components used in Laboratory Equipment and Instruments, we use high-quality branded parts.",
    },
    {
      id: "customization",
      title: "Customized Solutions",
      icon: "🔧",
      summary:
        "One-on-one collaboration to design custom-built laboratory equipment for unique requirements.",
      details:
        "In response to a growing demand for specialized equipment, Benchtop Equipment works one-on-one with customers to design custom-built laboratory equipment. We specialize in designing that makes sense and believe in providing high-quality customization of laboratory equipment from little to critical modifications and have been serving our customers for years through almost everything they need to optimize their laboratories and workplace.",
    },
  ];

  const specialties = [
    "Laboratory Equipment consultation",
    "Design, development, and distribution",
    "Direct import of equipment and spare parts",
    "Upgrade and special modifications in products of any brand",
    "Designs that make sense",
    "In-house CAD team",
    "Teamwork and Partnership",
    "Complete installation and commissioning at customers' workplace",
  ];

  const [expandedService, setExpandedService] = useState<string | null>(null);

  const toggleService = (serviceId: string) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const clients = [
    {
      id: 1,
      name: "Indian Institute Of Technology Jammu",
      image: "/clients/IIT-jammu.jpg",
    },
    {
      id: 2,
      name: "FDA",
      image: "/clients/FDA.jpg",
    },
    {
      id: 3,
      name: "AIIMS Delhi ",
      image: "/clients/aims.jpg",
    },
    {
      id: 4,
      name: "Tata",
      image: "/clients/tata.jpg",
    },
    {
      id: 5,
      name: "DRDO",
      image: "/clients/drdo.jpg",
    },
    {
      id: 6,
      name: "John Matthey",
      image: "/clients/jm.jpg",
    },
    {
      id: 7,
      name: "SGPGI",
      image: "/clients/sgpgi.jpg",
    },
    {
      id: 8,
      name: "Aditya Birla",
      image: "/clients/images.jpg",
    },
    {
      id: 9,
      name: "Adani Group",
      image: "/clients/Adani-Group-2.jpg",
    },
    {
      id: 10,
      name: "Indian Institute Of Technology Kanpur",
      image: "/clients/iit-kanpur.jpg",
    },
    {
      id: 11,
      name: "Prasad Institute Of Medical Sciences",
      image: "/clients/prasad_lucknow.jpg",
    },
    {
      id: 12,
      name: "Indian Institute Of Technology BHU",
      image: "/clients/IIT-Logo.jpg",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Photo Placeholder */}
      <section className="relative bg-gradient-to-br from-slate-50 to-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block">
                  <div className="w-12 h-1 bg-blue-500 mb-4"></div>
                </div>
                <h1 className="text-5xl font-light text-gray-900 leading-tight">
                  About{" "}
                  <span className="font-semibold text-blue-500">
                    Benchtop Equipment
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  ISO-certified laboratory equipment manufacturing company with
                  over 10 years of excellence in innovation and quality.
                </p>
              </div>

              {/* Key Stats Graphics */}
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">10+</div>
                  <div className="text-sm text-gray-600">Years</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">ISO</div>
                  <div className="text-sm text-gray-600">Certified</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">Global</div>
                  <div className="text-sm text-gray-600">Reach</div>
                </div>
              </div>
            </div>

            {/* Hero Image Placeholder */}
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
                <img
                  src="/assets/scientific analysis.png"
                  alt="Benchtop Equipment Manufacturing Facility"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-light text-gray-900">
                  Manufacturer of Laboratory Instruments & Furniture
                </h2>

                <div className="w-20 h-0.5 bg-blue-500"></div>
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    <strong className="text-gray-900">
                      Benchtop Equipment Inc.
                    </strong>{" "}
                    is an ISO-certified laboratory equipment manufacturing
                    company in India. With our head office in Kanpur, we serve
                    laboratories worldwide with innovative solutions for
                    research, medical, and educational sectors.
                  </p>

                  <p>
                    Our comprehensive product range includes analytical
                    instruments, laboratory equipment, and specialized tools
                    that meet the daily challenges faced by scientists and
                    researchers. All equipment is manufactured in our
                    state-of-the-art facilities in Kanpur and Ghaziabad.
                  </p>
                </div>
              </div>
            </div>

            {/* Company Photo Placeholder */}
            <div className="space-y-6">
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                <img
                  src="/assets/laboratory research.png"
                  alt="Laboratory Equipment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Mission & Values
            </h2>
            <div className="w-20 h-0.5 bg-blue-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              {/* <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto"> */}
              {/* <div className="w-10 h-10 bg-blue-500 rounded-lg"></div> */}
              {/* </div> */}
              <h3 className="text-xl font-semibold text-gray-900">
                Customer First
              </h3>
              <p className="text-gray-600">
                Every customer is treated with utmost respect, cooperation and
                fairness as the cornerstone of our business.
              </p>
            </div>

            <div className="text-center space-y-4">
              {/* <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto"> */}
              {/* <div className="w-10 h-10 bg-green-500 rounded-lg"></div> */}
              {/* </div> */}
              <h3 className="text-xl font-semibold text-gray-900">Integrity</h3>
              <p className="text-gray-600">
                All employees conduct themselves with honesty and integrity in
                every aspect of our operations.
              </p>
            </div>

            <div className="text-center space-y-4">
              {/* <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto"> */}
              {/* <div className="w-10 h-10 bg-purple-500 rounded-lg"></div> */}
              {/* </div> */}
              <h3 className="text-xl font-semibold text-gray-900">
                Innovation
              </h3>
              <p className="text-gray-600">
                We strive for the highest work ethic through cooperation,
                teamwork and innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

   
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Comprehensive Laboratory Solutions
            </h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto leading-relaxed">
              We emphasize quality and customer service that our customers find
              in all aspects of our work. We serve our customers with
              outstanding responsiveness, execution, and delivery of products.
            </p>
            <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full"></div>
          </div>

          {/* Main Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-card rounded-lg shadow-sm border border-border overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {/* <div className="text-3xl">{service.icon}</div> */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-card-foreground mb-2">
                        {service.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {service.summary}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleService(service.id)}
                    className="text-accent hover:text-accent/80 font-medium text-sm flex items-center gap-2 transition-colors"
                  >
                    {expandedService === service.id
                      ? "Show Less"
                      : "Learn More"}
                    <span
                      className={`transform transition-transform ${
                        expandedService === service.id ? "rotate-180" : ""
                      }`}
                    >
                      ↓
                    </span>
                  </button>

                  {expandedService === service.id && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-muted-foreground leading-relaxed">
                        {service.details}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Our Specialties
            </h2>
            <div className="w-20 h-0.5 bg-blue-500 mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "Laboratory Equipment Consultation",
              "Design, Development & Distribution",
              "Direct Import of Equipment",
              "Upgrade & Special Modifications",
              "Designs That Make Sense",
              "In-house CAD Team",
              "Teamwork & Partnership",
              "Complete Installation & Commissioning",
            ].map((specialty, index) => (
              <div key={index} className="bg-white p-6 rounded-xl space-y-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-sm"></div>
                </div>
                <h3 className="font-semibold text-gray-900 text-sm">
                  {specialty}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

  

      <section className="bg-white text-gray-800 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Reasons for Our Success
            </h2>
            <div className="w-24 h-1 bg-gray-600 mx-auto"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg leading-relaxed">High-quality product</p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg leading-relaxed">
                  Experienced and dedicated team
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg leading-relaxed">
                  Random and stringent test on product to ensure quality
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg leading-relaxed">Affordable rates</p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg leading-relaxed">
                  Highly acknowledge team
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg leading-relaxed">
                  Proper storage facilities and infrastructure
                </p>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-lg leading-relaxed">
                  Highly appreciated client management policies
                </p>
              </div>
            </div>

            {/* Photo Placeholder */}
            <div className="flex-1 max-w-md">
              <div className="w-full h-96 rounded-lg flex items-center justify-center">
                <img src="/clients/success.png" alt="success" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Clients We Have Worked With
            </h2>
            <div className="w-20 h-0.5 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Trusted by leading organizations across healthcare, research,
              education, and industry sectors worldwide.
            </p>
          </div>

          {/* Client Logos Placeholder */}
          <div className="bg-white rounded-2xl p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {clients.map((i) => (
                <div
                  key={i.id}
                  className="aspect-[3/2] bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <img
                    src={i.image}
                    alt={i.name}
                    className="w-full h-full object-contain p-4"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen ">
        {/* Quality Policy Section */}
        <div className="py-24 ">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-10">
                <div className="space-y-6 text-center">
                  <h2 className="text-4xl font-bold text-foreground leading-tight">
                    Quality Policy & Standards
                  </h2>
                  <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
                </div>

                <div className="space-y-8 text-foreground/80 leading-relaxed text-lg">
                  <p>
                    We believe in providing quality at the highest level. The
                    fact that we are in a business that is directly linked to
                    the health and well-being of the people makes us a more
                    responsible company, and no matter what, no compromises are
                    made.
                  </p>

                  <p className="font-medium text-foreground text-center">
                    No doubt, life is precious.
                  </p>

                  <p>
                    Not only do our products conform to{" "}
                    <span className="font-semibold text-primary">
                      ISO 9001:2015
                    </span>
                    ,{" "}
                    <span className="font-semibold text-primary">
                      ISO 13485:2016
                    </span>
                    , and{" "}
                    <span className="font-semibold text-primary">
                      CE standards
                    </span>
                    , but we also constantly exceed international quality norms.
                  </p>
                </div>

                {/* Certification Badges */}
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="px-6 py-3 bg-primary/10 rounded-xl border border-primary/20">
                    <div className="text-primary font-semibold">
                      ISO 9001:2015
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-accent/10 rounded-xl border border-accent/20">
                    <div className="text-accent font-semibold">
                      ISO 13485:2016
                    </div>
                  </div>
                  <div className="px-6 py-3 bg-primary/10 rounded-xl border border-primary/20">
                    <div className="text-primary font-semibold">
                      CE Certified
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="py-24 bg-card/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-foreground mb-6">
                How Are We Different?
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              <div className="bg-background p-8 rounded-2xl shadow-sm border border-border">
                <Award className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  25 Years Experience
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  Our innovative approach, personalized services, and impressive
                  growth rate have positioned us at the No. 1 spot.
                </p>
              </div>

              <div className="bg-background p-8 rounded-2xl shadow-sm border border-border">
                <Shield className="w-12 h-12 text-accent mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Quality First
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  We don't compromise on quality in exchange for a cheaper
                  price. We go beyond mandatory standards.
                </p>
              </div>

              <div className="bg-background p-8 rounded-2xl shadow-sm border border-border">
                <Building2 className="w-12 h-12 text-primary mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  Modern Facilities
                </h3>
                <p className="text-foreground/70 leading-relaxed">
                  State-of-the-art manufacturing facilities with rigorous
                  quality assurance resources.
                </p>
              </div>
            </div>

            <div className="bg-background p-10 rounded-2xl shadow-sm border border-border">
              <p className="text-lg text-foreground/80 leading-relaxed text-center">
                Many importers in Europe sell our products under their brands.
                This itself is a testimony to acceptance of our core
                competencies in quality control, product design & development,
                prototyping, packaging, and sterilization.
              </p>
            </div>
          </div>
        </div>

        {/* Company Philosophy */}
        <div className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-10">
                <div className="space-y-6 text-center">
                  <h2 className="text-4xl font-bold text-foreground leading-tight">
                    Company's Philosophy
                  </h2>
                  <div className="w-16 h-1 bg-accent rounded-full mx-auto"></div>
                </div>

                <div className="space-y-8 text-foreground/80 leading-relaxed text-lg">
                  <p>
                    Being in a business that has to take care of the health and
                    well-being of people, we ensure that no compromises are
                    made. No doubt, we understand that life is precious.
                  </p>

                  <p>
                    Since the beginning, our business philosophy has been based
                    on{" "}
                    <span className="font-semibold text-primary">
                      exceptional service
                    </span>
                    ,{" "}
                    <span className="font-semibold text-primary">
                      high quality
                    </span>
                    , and{" "}
                    <span className="font-semibold text-primary">value</span>.
                  </p>

                  <p className="font-medium text-foreground text-center">
                    At Narang Medical Limited, quality is a culture and service
                    a tradition.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* What We Do & CSR */}
        <div className="py-24 bg-card/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-20">
              {/* What We Do */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">
                    What We Do
                  </h2>
                  <div className="w-16 h-1 bg-primary rounded-full"></div>
                </div>

                <div className="space-y-6">
                  <p className="text-foreground/80 leading-relaxed text-lg">
                    We manufacture and supply Hospital Furniture, Orthopedic
                    Implants, Anesthesia Products, Autoclaves, Suction Machines,
                    Lab ware etc.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
                      <Stethoscope className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Hospital Furniture
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
                      <Shield className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Orthopedic Implants
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
                      <Building2 className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Anesthesia Products
                      </span>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-border">
                      <Award className="w-6 h-6 text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        Lab Equipment
                      </span>
                    </div>
                  </div>

                  <p className="text-foreground/70 leading-relaxed">
                    We have the widest range of products for hospitals, doctors
                    & clinics, surgeons, and patients at home. We sell to
                    distributors/wholesalers all over the world.
                  </p>
                </div>
              </div>

              {/* CSR */}
              <div className="space-y-10">
                <div className="space-y-6">
                  <h2 className="text-3xl font-bold text-foreground">
                    Corporate Social Responsibility
                  </h2>
                  <div className="w-16 h-1 bg-accent rounded-full"></div>
                </div>

                <div className="space-y-8">
                  <div className="bg-background p-8 rounded-2xl shadow-sm border border-border">
                    <Users className="w-12 h-12 text-accent mb-6" />
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Ethical Practices
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      We do not employ child labor and maintain the highest
                      ethical standards in all our operations.
                    </p>
                  </div>

                  <div className="bg-background p-8 rounded-2xl shadow-sm border border-border">
                    <Heart className="w-12 h-12 text-primary mb-6" />
                    <h3 className="text-xl font-semibold text-foreground mb-4">
                      Community Support
                    </h3>
                    <p className="text-foreground/70 leading-relaxed">
                      We regularly donate to NGOs, the Army & government welfare
                      funds, contributing to society's well-being.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
