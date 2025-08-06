import { CheckCircle, Hospital, Microscope, FlaskConical } from 'lucide-react'

export default function BetterForYouSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Better For You</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-4 mb-6">
              Experiment With Best Lab Product
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis congue, diam ut hendrerit elementum, 
              dolor metus eleifend erat, vitae scelerisque massa justo non dolor.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h4>
                  <p className="text-gray-600 text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <CheckCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Marketing Automation</h4>
                  <p className="text-gray-600 text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Image */}
          <div className="flex justify-center">
            <img 
              src="https://plus.unsplash.com/premium_photo-1663011382811-fe81a785d3c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTU5fHxsYWJvcmF0b3J5fGVufDB8fDB8fHww" 
              alt="Laboratory Equipment"
              className="rounded-lg shadow-lg max-w-full"
            />
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Hospital className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Report Efficiency</h4>
                <p className="text-gray-600 text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Microscope className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Complete Cases</h4>
                <p className="text-gray-600 text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <FlaskConical className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Our Equipment</h4>
                <p className="text-gray-600 text-sm">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
