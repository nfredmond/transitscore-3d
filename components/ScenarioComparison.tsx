'use client'

import { useState } from 'react'
import { X, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react'

interface Scenario {
  id: string
  name: string
  buildingChars: any
  tdmPrograms: any[]
  vmt: any
  ghg: any
  timestamp: number
}

interface ScenarioComparisonProps {
  scenarios: Scenario[]
  onClose: () => void
  onDeleteScenario: (id: string) => void
}

export default function ScenarioComparison({ scenarios, onClose, onDeleteScenario }: ScenarioComparisonProps) {
  if (scenarios.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Scenario Comparison</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            No scenarios saved yet. Save scenarios from the Scenario Planning tab to compare them here.
          </p>
        </div>
      </div>
    )
  }

  const calculateDelta = (current: number, baseline: number) => {
    const delta = current - baseline
    const percent = baseline !== 0 ? ((delta / baseline) * 100).toFixed(1) : '0.0'
    return { delta, percent }
  }

  const getDeltaIcon = (delta: number, inverse: boolean = false) => {
    const isPositive = inverse ? delta < 0 : delta > 0
    if (Math.abs(delta) < 0.01) return <Minus className="w-4 h-4 text-gray-400" />
    return isPositive ? (
      <TrendingUp className="w-4 h-4 text-green-500" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-500" />
    )
  }

  const baseline = scenarios[0]

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 max-w-6xl w-full my-8 animate-scale-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Scenario Comparison</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Comparing {scenarios.length} scenario{scenarios.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {/* TODO: Export comparison */}}
              className="flex items-center space-x-2 px-4 py-2 bg-sacramento-gold hover:bg-yellow-500 text-gray-900 rounded-lg font-medium transition-colors"
              aria-label="Export comparison"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close comparison"
            >
              <X className="w-5 h-5 text-gray-700 dark:text-gray-200" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                <th className="text-left p-3 font-semibold text-gray-900 dark:text-white">Metric</th>
                {scenarios.map((scenario, index) => (
                  <th key={scenario.id} className="text-center p-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{scenario.name}</span>
                        {index > 0 && (
                          <button
                            onClick={() => onDeleteScenario(scenario.id)}
                            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-red-600 dark:text-red-400"
                            aria-label={`Delete ${scenario.name}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(scenario.timestamp).toLocaleDateString()}
                      </div>
                      {index === 0 && (
                        <div className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                          Baseline
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Building Characteristics */}
              <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <td colSpan={scenarios.length + 1} className="p-3 font-semibold text-gray-900 dark:text-white">
                  Building Characteristics
                </td>
              </tr>
              <tr className="border-t border-gray-100 dark:border-gray-600">
                <td className="p-3 text-gray-700 dark:text-gray-300">Units</td>
                {scenarios.map((s, i) => (
                  <td key={s.id} className="p-3 text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">{s.buildingChars.units}</div>
                    {i > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
                        {getDeltaIcon(s.buildingChars.units - baseline.buildingChars.units)}
                        <span>{s.buildingChars.units - baseline.buildingChars.units}</span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100 dark:border-gray-600">
                <td className="p-3 text-gray-700 dark:text-gray-300">Floors</td>
                {scenarios.map((s) => (
                  <td key={s.id} className="p-3 text-center text-gray-900 dark:text-white font-medium">
                    {s.buildingChars.floors}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100 dark:border-gray-600">
                <td className="p-3 text-gray-700 dark:text-gray-300">Parking Spaces</td>
                {scenarios.map((s, i) => (
                  <td key={s.id} className="p-3 text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">{s.buildingChars.parkingSpaces}</div>
                    {i > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
                        {getDeltaIcon(s.buildingChars.parkingSpaces - baseline.buildingChars.parkingSpaces, true)}
                        <span>{s.buildingChars.parkingSpaces - baseline.buildingChars.parkingSpaces}</span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>

              {/* Environmental Impact */}
              <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <td colSpan={scenarios.length + 1} className="p-3 font-semibold text-gray-900 dark:text-white">
                  Environmental Impact
                </td>
              </tr>
              <tr className="border-t border-gray-100 dark:border-gray-600">
                <td className="p-3 text-gray-700 dark:text-gray-300">Annual VMT</td>
                {scenarios.map((s, i) => (
                  <td key={s.id} className="p-3 text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {(s.vmt.annualVMTTotal / 1000).toFixed(1)}k mi
                    </div>
                    {i > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
                        {getDeltaIcon(s.vmt.annualVMTTotal - baseline.vmt.annualVMTTotal, true)}
                        <span>
                          {calculateDelta(s.vmt.annualVMTTotal, baseline.vmt.annualVMTTotal).percent}%
                        </span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100 dark:border-gray-600">
                <td className="p-3 text-gray-700 dark:text-gray-300">Annual GHG</td>
                {scenarios.map((s, i) => (
                  <td key={s.id} className="p-3 text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {s.ghg.annualGHG.toFixed(2)} tons CO2e
                    </div>
                    {i > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center space-x-1">
                        {getDeltaIcon(s.ghg.annualGHG - baseline.ghg.annualGHG, true)}
                        <span>
                          {calculateDelta(s.ghg.annualGHG, baseline.ghg.annualGHG).percent}%
                        </span>
                      </div>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100 dark:border-gray-600">
                <td className="p-3 text-gray-700 dark:text-gray-300">VMT Reduction</td>
                {scenarios.map((s) => (
                  <td key={s.id} className="p-3 text-center">
                    <div className="font-semibold text-green-600 dark:text-green-400">
                      {s.vmt.vmtReduction.toFixed(1)}%
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100 dark:border-gray-600">
                <td className="p-3 text-gray-700 dark:text-gray-300">Cars Off Road (equivalent)</td>
                {scenarios.map((s) => (
                  <td key={s.id} className="p-3 text-center text-gray-900 dark:text-white font-medium">
                    {s.ghg.equivalents.carsOffRoad}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-gray-100 dark:border-gray-600">
                <td className="p-3 text-gray-700 dark:text-gray-300">Trees Planted (equivalent)</td>
                {scenarios.map((s) => (
                  <td key={s.id} className="p-3 text-center text-gray-900 dark:text-white font-medium">
                    {s.ghg.equivalents.treesPlanted}
                  </td>
                ))}
              </tr>

              {/* TDM Programs */}
              <tr className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                <td colSpan={scenarios.length + 1} className="p-3 font-semibold text-gray-900 dark:text-white">
                  TDM Programs
                </td>
              </tr>
              <tr className="border-t border-gray-100 dark:border-gray-600">
                <td className="p-3 text-gray-700 dark:text-gray-300">Active Programs</td>
                {scenarios.map((s) => (
                  <td key={s.id} className="p-3 text-center">
                    <div className="font-semibold text-gray-900 dark:text-white">{s.tdmPrograms.length}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
                      {s.tdmPrograms.slice(0, 3).map((p: any) => (
                        <div key={p.id}>{p.name}</div>
                      ))}
                      {s.tdmPrograms.length > 3 && (
                        <div className="italic">+{s.tdmPrograms.length - 3} more</div>
                      )}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Comparison Summary</h3>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {scenarios.length > 1 ? (
              <>
                Comparing <strong>{scenarios[0].name}</strong> (baseline) with {scenarios.length - 1} alternative scenario
                {scenarios.length > 2 ? 's' : ''}.
                {scenarios.length > 1 && scenarios[1].vmt.annualVMTTotal < baseline.vmt.annualVMTTotal && (
                  <> The best performing scenario reduces VMT by{' '}
                    {Math.max(...scenarios.slice(1).map(s => ((baseline.vmt.annualVMTTotal - s.vmt.annualVMTTotal) / baseline.vmt.annualVMTTotal * 100))).toFixed(1)}%
                    {' '}compared to baseline.
                  </>
                )}
              </>
            ) : (
              'Add more scenarios to compare different configurations.'
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

