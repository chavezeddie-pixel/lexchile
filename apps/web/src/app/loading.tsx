export default function Loading() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse py-8">
      <div className="h-8 bg-gray-200 rounded-xl w-48 mb-4" />
      <div className="h-4 bg-gray-100 rounded-lg w-72 mb-8" />
      <div className="space-y-4">
        <div className="h-24 bg-gray-100 rounded-2xl" />
        <div className="h-24 bg-gray-100 rounded-2xl" />
        <div className="h-24 bg-gray-100 rounded-2xl" />
      </div>
    </div>
  )
}
