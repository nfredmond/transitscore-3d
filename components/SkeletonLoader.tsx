'use client'

interface SkeletonLoaderProps {
  variant?: 'card' | 'text' | 'circle' | 'map'
  className?: string
}

export function SkeletonCard() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded" />
            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-600 rounded" />
          </div>
        </div>
        <div className="space-y-2 text-right">
          <div className="h-6 w-12 bg-gray-300 dark:bg-gray-700 rounded ml-auto" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded ml-auto" />
        </div>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
    </div>
  )
}

export function SkeletonMap() {
  return (
    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse flex items-center justify-center">
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto" />
        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mx-auto" />
        <div className="h-3 w-48 bg-gray-200 dark:bg-gray-600 rounded mx-auto" />
      </div>
    </div>
  )
}

export function SkeletonRecommendation() {
  return (
    <div className="bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
      <div className="flex items-center space-x-2 mb-3">
        <div className="w-8 h-8 bg-gray-400 dark:bg-gray-600 rounded-lg" />
        <div className="h-5 w-32 bg-gray-400 dark:bg-gray-600 rounded" />
      </div>
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-400 dark:bg-gray-600 rounded" />
        <div className="h-4 w-full bg-gray-400 dark:bg-gray-600 rounded" />
        <div className="h-4 w-3/4 bg-gray-400 dark:bg-gray-600 rounded" />
      </div>
    </div>
  )
}

export default function SkeletonLoader({ variant = 'card', className = '' }: SkeletonLoaderProps) {
  if (variant === 'map') return <SkeletonMap />
  if (variant === 'card') return <SkeletonCard />
  
  return (
    <div className={`animate-pulse bg-gray-300 dark:bg-gray-700 rounded ${className}`} />
  )
}

