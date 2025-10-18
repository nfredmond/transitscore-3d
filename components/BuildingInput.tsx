'use client'

import { useState } from 'react'
import { Building2, Home, Users } from 'lucide-react'
import { BuildingCharacteristics } from '@/lib/tdmCalculations'

interface BuildingInputProps {
  onChange: (characteristics: BuildingCharacteristics) => void
  initialValues?: Partial<BuildingCharacteristics>
}

export default function BuildingInput({ onChange, initialValues }: BuildingInputProps) {
  const [characteristics, setCharacteristics] = useState<BuildingCharacteristics>({
    floors: initialValues?.floors || 3,
    totalSqFt: initialValues?.totalSqFt || 30000,
    units: initialValues?.units || 24,
    parkingSpaces: initialValues?.parkingSpaces || 18,
    buildingType: initialValues?.buildingType || 'residential',
    affordableHousingPercent: initialValues?.affordableHousingPercent || 0
  })

  const updateCharacteristic = (key: keyof BuildingCharacteristics, value: any) => {
    const updated = { ...characteristics, [key]: value }
    setCharacteristics(updated)
    onChange(updated)
  }

  const avgUnitSize = Math.round(characteristics.totalSqFt / characteristics.units)
  const parkingRatio = (characteristics.parkingSpaces / characteristics.units).toFixed(2)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 transition-colors">
      <div className="flex items-center space-x-2 mb-4">
        <Building2 className="w-5 h-5 text-sacramento-blue" />
        <h3 className="font-semibold text-gray-900 dark:text-white">Building Characteristics</h3>
      </div>

      <div className="space-y-4">
        {/* Building Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Building Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['residential', 'mixed-use', 'commercial'] as const).map(type => (
              <button
                key={type}
                onClick={() => updateCharacteristic('buildingType', type)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  characteristics.buildingType === type
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
            Number of Floors: {characteristics.floors}
          </label>
          <input
            type="range"
            min="1"
            max="12"
            value={characteristics.floors}
            onChange={(e) => updateCharacteristic('floors', parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>1</span>
            <span>6</span>
            <span>12</span>
          </div>
        </div>

        {/* Total Square Footage */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Total Square Feet
          </label>
          <input
            type="number"
            value={characteristics.totalSqFt}
            onChange={(e) => updateCharacteristic('totalSqFt', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            step="1000"
          />
        </div>

        {/* Units */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Number of Units
          </label>
          <input
            type="number"
            value={characteristics.units}
            onChange={(e) => updateCharacteristic('units', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Parking Spaces */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Parking Spaces
          </label>
          <input
            type="number"
            value={characteristics.parkingSpaces}
            onChange={(e) => updateCharacteristic('parkingSpaces', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>

        {/* Affordable Housing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Affordable Housing: {characteristics.affordableHousingPercent}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={characteristics.affordableHousingPercent}
            onChange={(e) => updateCharacteristic('affordableHousingPercent', parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Calculated Metrics */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Avg Unit Size:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{avgUnitSize} sqft</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Parking Ratio:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{parkingRatio} spaces/unit</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Est. Population:</span>
            <span className="font-semibold text-gray-900 dark:text-white">{Math.round(characteristics.units * 2.5)} people</span>
          </div>
        </div>
      </div>
    </div>
  )
}

