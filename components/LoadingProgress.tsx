'use client'

import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'

interface LoadingStep {
  id: string
  label: string
  duration: number
}

interface LoadingProgressProps {
  steps: LoadingStep[]
  currentStep: number
}

export default function LoadingProgress({ steps, currentStep }: LoadingProgressProps) {
  const [progress, setProgress] = useState(0)
  
  // Calculate overall progress
  useEffect(() => {
    const totalSteps = steps.length
    const baseProgress = (currentStep / totalSteps) * 100
    setProgress(Math.min(baseProgress, 100))
  }, [currentStep, steps.length])

  return (
    <div className="w-full space-y-4">
      {/* Progress Bar */}
      <div className="relative">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-sacramento-blue to-sacramento-gold h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="absolute -top-1 right-0 text-xs font-semibold text-sacramento-blue dark:text-sacramento-gold">
          {Math.round(progress)}%
        </div>
      </div>

      {/* Step Indicators */}
      <div className="space-y-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isPending = index > currentStep

          return (
            <div
              key={step.id}
              className={`flex items-center space-x-3 transition-all duration-300 ${
                isCurrent ? 'scale-105' : 'scale-100'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 animate-in fade-in duration-300" />
              ) : isCurrent ? (
                <Loader2 className="w-5 h-5 text-sacramento-blue dark:text-sacramento-gold flex-shrink-0 animate-spin" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex-shrink-0" />
              )}
              <span
                className={`text-sm transition-colors ${
                  isCompleted
                    ? 'text-gray-500 dark:text-gray-400 line-through'
                    : isCurrent
                    ? 'text-gray-900 dark:text-white font-semibold'
                    : 'text-gray-400 dark:text-gray-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

