export default function MarqueeSection() {
  const items = [
    "Biomedical Research",
    "Industrial Process", 
    "Environmental Research",
    "Pharmaceutical Research",
    "Food & Beverages",
    "Diagnostics and Healthcare",
    "Schools and Universities",
    "Life Science Research",
  ];

  return (
    <section className="bg-blue-400 py-4 overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, index) => (
          <div key={index} className="flex items-center text-white mx-8">
            <span className="w-2 h-2 bg-white rounded-full mr-4"></span>
            <span className="text-lg font-medium">{item}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
