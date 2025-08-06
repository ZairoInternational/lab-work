import { CheckCircle } from 'lucide-react'

export default function AboutSection() {
  const features = [
    "The Science Behind Our Success",
    "Innovating for a Better Tomorrow", 
    "Beyond Boundaries: Our Scientific Mission",
    "Driven by Curiosity, Defined by Excellence",
    "Passion for Science, Commitment to Progress"
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
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">About Us</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">
              Leading the Future of Scientific Exploration
            </h2>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue, diam ut hendrerit elementum, 
              dolor metus eleifend erat, vitae scelerisque massa justo non dolor. Cras in pulvinar augue. 
              Donec at consequat dui.
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
              <span>View Research</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
