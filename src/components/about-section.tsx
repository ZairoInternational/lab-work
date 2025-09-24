import { CheckCircle } from 'lucide-react'
import Link from 'next/link';

export default function AboutSection() {
  const features = [
    "Products tested on stringent parameters to ensure optimum quality.",
    "Ensuring maximum output and reliable performance.", 
    "Beyond Boundaries our Scientific Mission",
    "Focus on cost efficiency with minimum operating and maintenance costs.",
    "Thoroughly tested from manufacturing stage to final delivery."
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Images */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="/assets/laboratory research.png"
                  alt="Laboratory Equipment"
                  className="rounded-lg shadow-lg w-full"
                />
                <img
                  src="/assets/research tools.png"
                  alt="Research Tools"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="/assets/lab work.png"
                  alt="Scientific Analysis"
                  className="rounded-lg shadow-lg w-full"
                />
                <img
                  src="/assets/scientific analysis.png"
                  alt="Laboratory Work"
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">
              About Us
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">
              GREETINGS FROM BENCHTOP EQUIPMENT INC.
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              We, Benchtop Equipment Inc., have gained the faith and trust of
              our customers with time. Our products are highly desired in the
              market and we have developed them in a manner that they can
              provide maximum output at minimum operating and maintenance costs.
              Our excellent client management policies have helped us in
              expanding our national list of clients. Our quality controllers
              and supervisors take care of the fact that only defect-free
              products reach the market and they are thoroughly tested from the
              time of manufacturing till ultimate delivery.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-300 flex items-center space-x-2">
              <Link href="/about-us">Know More</Link>
            
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
