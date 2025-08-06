export default function MarqueeSection() {
  const items = [
    "Innovative R&D Solutions",
    "Microbiological Testing", 
    "Environmental Testing",
    "Pharmaceutical Research",
    "Biotechnology Innovations",
    "Water & Air Quality Testing"
  ]

  return (
    <section className="bg-blue-600 py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center text-white mx-8">
            <span className="w-2 h-2 bg-white rounded-full mr-4"></span>
            <span className="text-lg font-medium">{item}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
