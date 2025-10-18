'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AnalysisWizard from '@/components/AnalysisWizard'
import { MapPin, Loader2 } from 'lucide-react'

export default function WizardPage() {
  const router = useRouter()
  const [analyzing, setAnalyzing] = useState(false)

  const handleWizardComplete = async (data: any) => {
    setAnalyzing(true)

    try {
      // Store wizard data in sessionStorage
      sessionStorage.setItem('wizardData', JSON.stringify(data))
      
      // Redirect to main page which will pick up the wizard data
      router.push('/?wizard=true')
    } catch (error) {
      console.error('Error:', error)
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="bg-sacramento-blue p-3 rounded-xl">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            TransitScore <span className="text-sacramento-gold">3D</span>
          </h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Development Impact Analysis Wizard
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Configure your project and get comprehensive impact analysis
        </p>
      </div>

      {/* Wizard */}
      {analyzing ? (
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-12 text-center">
          <Loader2 className="w-16 h-16 animate-spin text-sacramento-blue mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Analyzing Site...</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Fetching amenities, calculating scores, generating recommendations
          </p>
        </div>
      ) : (
        <AnalysisWizard onComplete={handleWizardComplete} />
      )}
    </div>
  )
}

