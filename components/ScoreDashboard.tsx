'use client'

import { TrendingUp, Bus, Building, Leaf, Download } from 'lucide-react'
import { generatePDF } from '@/lib/pdfExport'

interface ScoreDashboardProps {
  scores: {
    walkability: number
    transit: number
    density: number
    sustainability: number
  } | null
  recommendation: string
  address: string
  coordinates?: { lat: number; lng: number }
  amenities?: any[]
}

export default function ScoreDashboard({ scores, recommendation, address, coordinates, amenities = [] }: ScoreDashboardProps) {
  if (!scores) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transition-colors">
        <p className="text-gray-500 dark:text-gray-400 text-center">Enter an address to see analysis</p>
      </div>
    )
  }

  const handleExport = () => {
    if (!coordinates) return
    
    generatePDF({
      address,
      coordinates,
      scores,
      recommendation,
      amenities,
      analysisDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    })
  }

  const metrics = [
    {
      label: 'Walkability',
      score: scores.walkability,
      icon: TrendingUp,
      color: 'bg-green-500',
      description: 'Access to daily amenities'
    },
    {
      label: 'Transit Access',
      score: scores.transit,
      icon: Bus,
      color: 'bg-blue-500',
      description: 'Public transportation availability'
    },
    {
      label: 'Density Potential',
      score: scores.density,
      icon: Building,
      color: 'bg-purple-500',
      description: 'Development capacity'
    },
    {
      label: 'Sustainability',
      score: scores.sustainability,
      icon: Leaf,
      color: 'bg-emerald-500',
      description: 'Environmental impact'
    }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    if (score >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    if (score >= 40) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="space-y-4">
      {/* Metrics Cards */}
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div
            key={metric.label}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 hover:shadow-xl transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`${metric.color} p-2 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{metric.label}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{metric.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${getScoreColor(metric.score)}`}>
                  {metric.score}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{getScoreLabel(metric.score)}</div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`${metric.color} h-2 rounded-full transition-all duration-500`}
                style={{ width: `${metric.score}%` }}
              ></div>
            </div>
          </div>
        )
      })}

      {/* AI Recommendation */}
      <div className="bg-gradient-to-br from-sacramento-blue to-sacramento-darkblue rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center space-x-2 mb-3">
          <div className="bg-white/20 dark:bg-white/10 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-lg">AI Recommendation</h3>
        </div>
        <p className="text-white/90 leading-relaxed">{recommendation}</p>
        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-xs text-white/70">
            Analysis based on {address.split(',')[0]}
          </p>
        </div>
      </div>

      {/* Export Button */}
      <button 
        onClick={handleExport}
        className="w-full bg-sacramento-gold hover:bg-yellow-500 dark:hover:bg-yellow-600 text-gray-900 font-semibold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center space-x-2"
      >
        <Download className="w-5 h-5" />
        <span>Export Analysis as PDF</span>
      </button>
    </div>
  )
}

