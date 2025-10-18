'use client'

import { useState } from 'react'
import { TDM_PROGRAMS, TDMProgram } from '@/lib/tdmCalculations'
import { CheckCircle2, Circle, Info } from 'lucide-react'

interface TDMSelectorProps {
  onProgramsChange: (programs: TDMProgram[]) => void
  walkabilityScore: number
  bikeabilityScore: number
}

export default function TDMSelector({ onProgramsChange, walkabilityScore, bikeabilityScore }: TDMSelectorProps) {
  const [programs, setPrograms] = useState<TDMProgram[]>(TDM_PROGRAMS)
  const [expandedCategory, setExpandedCategory] = useState<string | null>('infrastructure')

  const toggleProgram = (id: string) => {
    const updated = programs.map(p =>
      p.id === id ? { ...p, enabled: !p.enabled } : p
    )
    setPrograms(updated)
    onProgramsChange(updated.filter(p => p.enabled))
  }

  const categories = {
    infrastructure: { name: 'Infrastructure', icon: '🏗️', color: 'bg-blue-500' },
    pricing: { name: 'Pricing & Incentives', icon: '💰', color: 'bg-green-500' },
    programs: { name: 'Programs & Services', icon: '📋', color: 'bg-purple-500' },
    policy: { name: 'Policy & Design', icon: '📜', color: 'bg-orange-500' }
  }

  const totalReduction = programs
    .filter(p => p.enabled)
    .reduce((sum, p) => sum + p.vmtReduction, 0)

  // Site context bonus
  const avgScore = (walkabilityScore + bikeabilityScore) / 200
  const bonus = totalReduction * avgScore * 0.25

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">TDM Strategies</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400">Select programs to reduce VMT</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            -{Math.round((totalReduction + bonus) * 10) / 10}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">VMT Reduction</div>
        </div>
      </div>

      {/* Site Context Bonus */}
      {bonus > 0 && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-800 dark:text-green-200">
              <strong>Site Context Bonus: +{bonus.toFixed(1)}%</strong> - High walkability/bikeability amplifies TDM effectiveness!
            </p>
          </div>
        </div>
      )}

      {/* Categories */}
      <div className="space-y-2">
        {Object.entries(categories).map(([key, cat]) => {
          const categoryPrograms = programs.filter(p => p.category === key)
          const enabledCount = categoryPrograms.filter(p => p.enabled).length
          const isExpanded = expandedCategory === key

          return (
            <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <button
                onClick={() => setExpandedCategory(isExpanded ? null : key)}
                className="w-full flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`${cat.color} w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm`}>
                    {cat.icon}
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{cat.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {enabledCount}/{categoryPrograms.length} selected
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {isExpanded ? '▼' : '▶'}
                </div>
              </button>

              {isExpanded && (
                <div className="bg-gray-50 dark:bg-gray-900 p-3 space-y-2">
                  {categoryPrograms.map(program => (
                    <button
                      key={program.id}
                      onClick={() => toggleProgram(program.id)}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-sacramento-blue dark:hover:border-sacramento-gold transition-colors bg-white dark:bg-gray-800"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="mt-0.5">
                          {program.enabled ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm text-gray-900 dark:text-white">
                              {program.name}
                            </span>
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                              -{program.vmtReduction}%
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {program.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Programs Selected:</span>
          <span className="font-semibold text-gray-900 dark:text-white">
            {programs.filter(p => p.enabled).length}/{programs.length}
          </span>
        </div>
        <div className="flex justify-between text-sm mt-1">
          <span className="text-gray-600 dark:text-gray-400">Base Reduction:</span>
          <span className="font-semibold text-gray-900 dark:text-white">{totalReduction.toFixed(1)}%</span>
        </div>
        {bonus > 0 && (
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-600 dark:text-gray-400">Site Bonus:</span>
            <span className="font-semibold text-green-600 dark:text-green-400">+{bonus.toFixed(1)}%</span>
          </div>
        )}
      </div>
    </div>
  )
}

