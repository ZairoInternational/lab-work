"use client"

import { motion, useReducedMotion } from "framer-motion"

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
  const reduceMotion = useReducedMotion()

  const gridCols = {
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  }

  const fadeUp = reduceMotion
    ? {}
    : { opacity: 0, y: 14 }
  const fadeUpVisible = reduceMotion
    ? {}
    : { opacity: 1, y: 0 }

  return (
    <section className={`py-8 ${backgroundColor}`}>
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={reduceMotion ? false : fadeUp}
          whileInView={reduceMotion ? undefined : fadeUpVisible}
          viewport={{ once: true, margin: "-48px" }}
          transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>

        <div className={`grid ${gridCols[columns]} gap-8`}>
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 group"
              initial={reduceMotion ? false : fadeUp}
              whileInView={reduceMotion ? undefined : fadeUpVisible}
              viewport={{ once: true, margin: "-32px" }}
              transition={{
                duration: 0.4,
                delay: reduceMotion ? 0 : index * 0.06,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -4, transition: { duration: 0.22, ease: "easeOut" } }
              }
            >
              <img
                src={client.logo || "/placeholder.svg"}
                alt={`${client.name} logo`}
                className="max-h-24 max-w-full opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-[1.04]"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
