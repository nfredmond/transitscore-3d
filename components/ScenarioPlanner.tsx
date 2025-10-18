'use client'

import { useState, useEffect } from 'react'
import { calculateDevelopmentImpact } from '@/lib/vmtCalculations'
import { calculateTDMImpact, TDMProgram, BuildingCharacteristics } from '@/lib/tdmCalculations'
import TDMSelector from './TDMSelector'
import BuildingInput from './BuildingInput'
import ImpactMetrics from './ImpactMetrics'
import { BarChart3, TrendingDown } from 'lucide-react'

interface ScenarioPlannerProps {
  walkabilityScore: number
  bikeabilityScore: number
  transitScore: number
  travelMode: 'walk' | 'bike'
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

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-sacramento-blue to-sacramento-darkblue rounded-xl shadow-lg p-5 text-white">
        <div className="flex items-center space-x-2 mb-2">
          <BarChart3 className="w-5 h-5" />
          <h2 className="font-bold text-lg">Scenario Planning</h2>
        </div>
        <p className="text-sm text-white/80">
          Configure your development and select TDM programs to see environmental impact
        </p>
      </div>

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

