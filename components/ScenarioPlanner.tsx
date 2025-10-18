'use client'

import { useState, useEffect } from 'react'
import { calculateDevelopmentImpact } from '@/lib/vmtCalculations'
import { calculateTDMImpact, TDMProgram, BuildingCharacteristics } from '@/lib/tdmCalculations'
import TDMSelector from './TDMSelector'
import BuildingInput from './BuildingInput'
import ImpactMetrics from './ImpactMetrics'
import ScenarioComparison from './ScenarioComparison'
import { BarChart3, TrendingDown, Save, GitCompare } from 'lucide-react'

interface ScenarioPlannerProps {
  walkabilityScore: number
  bikeabilityScore: number
  transitScore: number
  travelMode: 'walk' | 'bike'
}

interface SavedScenario {
  id: string
  name: string
  buildingChars: BuildingCharacteristics
  tdmPrograms: TDMProgram[]
  vmt: any
  ghg: any
  timestamp: number
}

export default function ScenarioPlanner({ walkabilityScore, bikeabilityScore, transitScore, travelMode }: ScenarioPlannerProps) {
  const [buildingChars, setBuildingChars] = useState<BuildingCharacteristics>({
    floors: 3,
    totalSqFt: 30000,
    units: 24,
    parkingSpaces: 18,
    buildingType: 'residential',
    affordableHousingPercent: 15
  })
  
  const [tdmPrograms, setTDMPrograms] = useState<TDMProgram[]>([])
  const [impact, setImpact] = useState<any>(null)
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([])
  const [showComparison, setShowComparison] = useState(false)

  // Load saved scenarios from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedScenarios')
    if (saved) {
      try {
        setSavedScenarios(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load saved scenarios:', e)
      }
    }
  }, [])

  useEffect(() => {
    // Calculate impact whenever building characteristics or TDM programs change
    const baseImpact = calculateDevelopmentImpact({
      units: buildingChars.units,
      buildingType: buildingChars.buildingType,
      walkabilityScore,
      bikeabilityScore,
      transitScore,
      parkingSpaces: buildingChars.parkingSpaces
    })

    // Apply TDM reductions
    const tdmAdjustment = calculateTDMImpact(
      baseImpact.vmt.annualVMTTotal,
      tdmPrograms,
      walkabilityScore,
      bikeabilityScore
    )

    // Recalculate with TDM
    const adjustedVMT = {
      ...baseImpact.vmt,
      annualVMTTotal: tdmAdjustment.adjustedVMT,
      dailyVMTTotal: Math.round(tdmAdjustment.adjustedVMT / 365),
      dailyVMTPerCapita: Math.round((tdmAdjustment.adjustedVMT / 365 / (buildingChars.units * 2.5)) * 10) / 10,
      vmtReduction: baseImpact.vmt.vmtReduction + tdmAdjustment.totalReduction
    }

    // Recalculate GHG with adjusted VMT
    const adjustedGHG = {
      ...baseImpact.ghg,
      annualGHG: Math.round((adjustedVMT.dailyVMTTotal * 0.89 * 0.453592 * 365 / 1000) * 100) / 100,
      ghgReduction: adjustedVMT.vmtReduction
    }

    // Recalculate equivalents
    const annualSavings = adjustedGHG.baseline.annualGHG - adjustedGHG.annualGHG
    adjustedGHG.equivalents = {
      carsOffRoad: Math.round(annualSavings / 4.6 * 10) / 10,
      treesPlanted: Math.round((annualSavings * 1000 * 2.20462) / 48)
    }

    setImpact({
      ...baseImpact,
      vmt: adjustedVMT,
      ghg: adjustedGHG,
      tdm: tdmAdjustment,
      building: buildingChars
    })
  }, [buildingChars, tdmPrograms, walkabilityScore, bikeabilityScore, transitScore])

  const handleSaveScenario = () => {
    if (!impact) return

    const scenarioName = prompt('Enter a name for this scenario:', `Scenario ${savedScenarios.length + 1}`)
    if (!scenarioName) return

    const newScenario: SavedScenario = {
      id: Date.now().toString(),
      name: scenarioName,
      buildingChars: { ...buildingChars },
      tdmPrograms: [...tdmPrograms],
      vmt: { ...impact.vmt },
      ghg: { ...impact.ghg },
      timestamp: Date.now()
    }

    const updated = [...savedScenarios, newScenario].slice(-3) // Keep only last 3
    setSavedScenarios(updated)
    localStorage.setItem('savedScenarios', JSON.stringify(updated))
  }

  const handleDeleteScenario = (id: string) => {
    const updated = savedScenarios.filter(s => s.id !== id)
    setSavedScenarios(updated)
    localStorage.setItem('savedScenarios', JSON.stringify(updated))
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-sacramento-blue to-sacramento-darkblue rounded-xl shadow-lg p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5" />
            <h2 className="font-bold text-lg">Scenario Planning</h2>
          </div>
          <div className="flex space-x-2">
            {savedScenarios.length > 0 && (
              <button
                onClick={() => setShowComparison(true)}
                className="flex items-center space-x-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors"
                aria-label="Compare scenarios"
              >
                <GitCompare className="w-4 h-4" />
                <span>Compare ({savedScenarios.length})</span>
              </button>
            )}
            <button
              onClick={handleSaveScenario}
              disabled={!impact}
              className="flex items-center space-x-1 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save scenario"
            >
              <Save className="w-4 h-4" />
              <span>Save</span>
            </button>
          </div>
        </div>
        <p className="text-sm text-white/80">
          Configure your development and select TDM programs to see environmental impact
        </p>
      </div>

      {/* Scenario Comparison Modal */}
      {showComparison && (
        <ScenarioComparison
          scenarios={savedScenarios}
          onClose={() => setShowComparison(false)}
          onDeleteScenario={handleDeleteScenario}
        />
      )}

      {/* Building Characteristics */}
      <BuildingInput 
        onChange={setBuildingChars}
        initialValues={buildingChars}
      />

      {/* TDM Programs */}
      <TDMSelector
        onProgramsChange={setTDMPrograms}
        walkabilityScore={walkabilityScore}
        bikeabilityScore={bikeabilityScore}
      />

      {/* Impact Results */}
      {impact && (
        <>
          <ImpactMetrics
            vmt={impact.vmt}
            ghg={impact.ghg}
            travelMode={travelMode}
          />

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg p-5 text-white">
            <div className="flex items-center space-x-2 mb-3">
              <TrendingDown className="w-5 h-5" />
              <h3 className="font-semibold">Impact Summary</h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Population:</span>
                <span className="font-bold">{impact.summary.population} people</span>
              </div>
              <div className="flex justify-between">
                <span>Annual VMT Saved:</span>
                <span className="font-bold">{(impact.summary.annualVMTSaved / 1000).toFixed(1)}k miles</span>
              </div>
              <div className="flex justify-between">
                <span>Annual GHG Saved:</span>
                <span className="font-bold">{impact.summary.annualGHGSaved.toFixed(2)} tons CO2e</span>
              </div>
              <div className="pt-2 border-t border-white/30 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Rating:</span>
                  <span className="font-bold text-yellow-200">{impact.summary.sustainabilityRating}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

