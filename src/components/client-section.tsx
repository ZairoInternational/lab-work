interface Client {
  id: number
  name: string
  logo: string
}

interface SimpleClientsSectionProps {
  clients: Client[]
  title?: string
  subtitle?: string
  backgroundColor?: string
  columns?: 3 | 4 | 5 | 6
}

export default function SimpleClientsSection({
  clients,
  title = "Our Trusted Partners",
  subtitle = "We work with amazing companies around the world",
  backgroundColor = "bg-gray-50",
  columns = 4,
}: SimpleClientsSectionProps) {
  const gridCols = {
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  }

  return (
    <section className={`py-8 ${backgroundColor}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Clients Grid */}
        <div className={`grid ${gridCols[columns]} gap-8`}>
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 group"
            >
              <img
                src={client.logo || "/placeholder.svg"}
                alt={`${client.name} logo`}
                className="max-h-24 max-w-full  transition-all duration-300 city-70 "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
