import { Microscope, Hospital, Activity } from 'lucide-react'

const steps = [
  {
    id: 1,
    number: "01",
    title: "Describes Project",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    icon: Microscope,
    image: "https://images.pexels.com/photos/356040/pexels-photo-356040.jpeg"
  },
  {
    id: 2,
    number: "02", 
    title: "Testing Begins",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    icon: Hospital,
    image: "https://images.pexels.com/photos/256262/pexels-photo-256262.jpeg"
  },
  {
    id: 3,
    number: "03",
    title: "Reports Delivered",
    description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    icon: Activity,
    image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg"
  }
]

export default function ProcessSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Reliable Research</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-4">
            Turning Ideas into Discoveries
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Process Line */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-blue-200 transform -translate-y-1/2 hidden lg:block" />
            
            <div className="grid lg:grid-cols-3 gap-8">
              {steps.map((step, index) => {
                const IconComponent = step.icon
                return (
                  <div key={step.id} className="relative">
                    <div className="bg-white rounded-lg shadow-lg p-8 text-center relative z-10">
                      <div className="relative mb-6">
                        <img 
                          src={step.image || "/placeholder.svg"}
                          alt={step.title}
                          className="w-20 h-20 mx-auto rounded-full object-cover"
                        />
                        <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                          {step.number}
                        </div>
                        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-blue-100 p-2 rounded-full">
                          <IconComponent className="w-5 h-5 text-blue-600" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600 text-sm">{step.description}</p>
                      
                      
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
