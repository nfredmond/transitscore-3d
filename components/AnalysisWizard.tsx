'use client'

import { useState } from 'react'
import { Search, Building2, CheckSquare, Loader2, ArrowRight, ArrowLeft, MapPin } from 'lucide-react'
import { TDM_PROGRAMS, TDMProgram, BuildingCharacteristics } from '@/lib/tdmCalculations'
import { CheckCircle2, Circle } from 'lucide-react'

interface AnalysisWizardProps {
  onComplete: (data: {
    address: string
    buildingChars: BuildingCharacteristics
    tdmPrograms: TDMProgram[]
  }) => void
}

export default function AnalysisWizard({ onComplete }: AnalysisWizardProps) {
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState('')
  const [buildingChars, setBuildingChars] = useState<BuildingCharacteristics>({
    floors: 3,
    totalSqFt: 30000,
    units: 24,
    parkingSpaces: 18,
    buildingType: 'residential',
    affordableHousingPercent: 15
  })
  const [selectedPrograms, setSelectedPrograms] = useState<TDMProgram[]>([])

  const toggleProgram = (id: string) => {
    const program = TDM_PROGRAMS.find(p => p.id === id)
    if (!program) return

    if (selectedPrograms.find(p => p.id === id)) {
      setSelectedPrograms(selectedPrograms.filter(p => p.id !== id))
    } else {
      setSelectedPrograms([...selectedPrograms, { ...program, enabled: true }])
    }
  }

  const handleComplete = () => {
    onComplete({
      address,
      buildingChars,
      tdmPrograms: selectedPrograms
    })
  }

  const avgUnitSize = Math.round(buildingChars.totalSqFt / buildingChars.units)
  const parkingRatio = (buildingChars.parkingSpaces / buildingChars.units).toFixed(2)
  const totalVMTReduction = selectedPrograms.reduce((sum, p) => sum + p.vmtReduction, 0)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: 'Address', icon: MapPin },
          { num: 2, label: 'Building', icon: Building2 },
          { num: 3, label: 'TDM Programs', icon: CheckSquare }
        ].map((s, index) => {
          const Icon = s.icon
          return (
            <div key={s.num} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                  step > s.num ? 'bg-green-500' : step === s.num ? 'bg-sacramento-blue' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs mt-2 font-medium text-gray-700 dark:text-gray-300">{s.label}</span>
              </div>
              {index < 2 && (
                <div className={`flex-1 h-1 mx-2 ${
                  step > s.num ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                }`} />
              )}
            </div>
          )
        })}
      </div>

      {/* Step Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8">
        {/* Step 1: Address */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Enter Site Address</h2>
              <p className="text-gray-600 dark:text-gray-400">Start by entering the California address you want to analyze</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g., 1075 W Capitol Ave, West Sacramento, CA"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-sacramento-blue dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Quick examples:</span>
              {[
                '1075 W Capitol Ave, West Sacramento, CA',
                '1400 K St, Sacramento, CA',
                'City Hall, San Francisco, CA'
              ].map((ex) => (
                <button
                  key={ex}
                  onClick={() => setAddress(ex)}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Building Characteristics */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Building Characteristics</h2>
              <p className="text-gray-600 dark:text-gray-400">Configure your proposed development</p>
            </div>

            {/* Building Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Building Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['residential', 'mixed-use', 'commercial'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setBuildingChars({...buildingChars, buildingType: type})}
                    className={`px-4 py-3 rounded-lg font-medium transition-colors ${
                      buildingChars.buildingType === type
                        ? 'bg-sacramento-blue text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Floors */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Floors: {buildingChars.floors}
              </label>
              <input
                type="range"
                min="1"
                max="12"
                value={buildingChars.floors}
                onChange={(e) => setBuildingChars({...buildingChars, floors: parseInt(e.target.value)})}
                className="w-full"
              />
            </div>

            {/* Units and Sqft in a grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Total Square Feet
                </label>
                <input
                  type="number"
                  value={buildingChars.totalSqFt}
                  onChange={(e) => setBuildingChars({...buildingChars, totalSqFt: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                  step="1000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Units
                </label>
                <input
                  type="number"
                  value={buildingChars.units}
                  onChange={(e) => setBuildingChars({...buildingChars, units: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* Parking */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Parking Spaces (Ratio: {parkingRatio}/unit)
              </label>
              <input
                type="number"
                value={buildingChars.parkingSpaces}
                onChange={(e) => setBuildingChars({...buildingChars, parkingSpaces: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Calculated Metrics */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Avg Unit Size:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{avgUnitSize} sqft</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Est. Population:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{Math.round(buildingChars.units * 2.5)} people</span>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: TDM Programs */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">TDM Programs</h2>
              <p className="text-gray-600 dark:text-gray-400">Select transportation demand management strategies</p>
            </div>

            <div className="bg-sacramento-gold/10 border border-sacramento-gold/30 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900 dark:text-white">Total VMT Reduction:</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">-{totalVMTReduction.toFixed(1)}%</span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                {selectedPrograms.length} program(s) selected
              </p>
            </div>

            {/* Programs by Category */}
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {Object.entries({
                infrastructure: TDM_PROGRAMS.filter(p => p.category === 'infrastructure'),
                pricing: TDM_PROGRAMS.filter(p => p.category === 'pricing'),
                programs: TDM_PROGRAMS.filter(p => p.category === 'programs'),
                policy: TDM_PROGRAMS.filter(p => p.category === 'policy')
              }).map(([category, programs]) => (
                <div key={category}>
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300 mb-2 capitalize">
                    {category}
                  </h4>
                  <div className="space-y-2">
                    {programs.map((program) => {
                      const isSelected = selectedPrograms.find(p => p.id === program.id)
                      return (
                        <button
                          key={program.id}
                          onClick={() => toggleProgram(program.id)}
                          className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                            isSelected
                              ? 'border-sacramento-blue bg-sacramento-blue/10 dark:bg-sacramento-blue/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            {isSelected ? (
                              <CheckCircle2 className="w-5 h-5 text-sacramento-blue flex-shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
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
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !address.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-sacramento-blue hover:bg-sacramento-darkblue text-white font-medium rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed ml-auto"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex items-center space-x-2 px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors ml-auto"
            >
              <Search className="w-4 h-4" />
              <span>Analyze Development</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

