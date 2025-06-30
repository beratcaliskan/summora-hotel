export default function Loading() {
  return (
    <div className="container mx-auto py-16 px-4">
      <div className="animate-pulse">
        <div className="h-10 w-48 bg-gray-200 rounded mx-auto mb-4"></div>
        <div className="h-6 w-96 bg-gray-200 rounded mx-auto mb-12"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden shadow">
              <div className="h-64 bg-gray-200"></div>
              <div className="p-6">
                <div className="h-6 w-32 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-6 w-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 