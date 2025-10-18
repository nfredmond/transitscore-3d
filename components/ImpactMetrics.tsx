'use client'

import { Car, TreePine, TrendingDown, Zap } from 'lucide-react'

interface ImpactMetricsProps {
  vmt: {
    dailyVMTPerCapita: number
    dailyVMTTotal: number
    annualVMTTotal: number
    vmtReduction: number
    baseline: {
      dailyVMTPerCapita: number
      dailyVMTTotal: number
    }
  }
  ghg: {
    dailyGHG: number
    annualGHG: number
    ghgReduction: number
    baseline: {
      dailyGHG: number
      annualGHG: number
    }
    equivalents: {
      carsOffRoad: number
      treesPlanted: number
    }
  }
  travelMode: 'walk' | 'bike'
}

export default function ImpactMetrics({ vmt, ghg, travelMode }: ImpactMetricsProps) {
  return (
    <div className="space-y-4">
      {/* VMT Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 transition-all">
        <div className="flex items-center space-x-2 mb-3">
          <Car className="w-5 h-5 text-sacramento-blue" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Vehicle Miles Traveled (VMT)</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Daily VMT/Person:</span>
            <span className="font-bold text-gray-900 dark:text-white">{vmt.dailyVMTPerCapita} mi</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Annual VMT:</span>
            <span className="font-bold text-gray-900 dark:text-white">{(vmt.annualVMTTotal / 1000).toFixed(1)}k mi</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">Reduction vs Baseline:</span>
            <span className="font-bold text-green-600 dark:text-green-400">-{vmt.vmtReduction}%</span>
          </div>
        </div>
      </div>

      {/* GHG Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 transition-all">
        <div className="flex items-center space-x-2 mb-3">
          <Zap className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-gray-900 dark:text-white">GHG Emissions</h3>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Annual CO2e:</span>
            <span className="font-bold text-gray-900 dark:text-white">{ghg.annualGHG} tons</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">Reduction vs Baseline:</span>
            <span className="font-bold text-green-600 dark:text-green-400">-{ghg.ghgReduction}%</span>
          </div>
        </div>
      </div>

      {/* Environmental Impact */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl shadow-lg p-5 border border-green-200 dark:border-green-800">
        <div className="flex items-center space-x-2 mb-3">
          <TreePine className="w-5 h-5 text-green-600 dark:text-green-400" />
          <h3 className="font-semibold text-green-900 dark:text-green-100">Climate Impact</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-green-700 dark:text-green-300" />
              <span className="text-sm text-green-800 dark:text-green-200">Equivalent to removing:</span>
            </div>
            <span className="font-bold text-green-900 dark:text-green-100">{ghg.equivalents.carsOffRoad} cars</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TreePine className="w-4 h-4 text-green-700 dark:text-green-300" />
              <span className="text-sm text-green-800 dark:text-green-200">Same as planting:</span>
            </div>
            <span className="font-bold text-green-900 dark:text-green-100">{ghg.equivalents.treesPlanted} trees</span>
          </div>

          <div className="mt-3 pt-3 border-t border-green-200 dark:border-green-700">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <p className="text-xs text-green-800 dark:text-green-200 font-medium">
                Annual savings: {((ghg.baseline.annualGHG - ghg.annualGHG)).toFixed(2)} tons CO2e/year
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <strong>Methodology:</strong> Calculations based on California Air Resources Board (CARB) guidelines. 
          Higher {travelMode === 'walk' ? 'walkability' : 'bikeability'} and transit scores reduce vehicle dependency, 
          lowering VMT and GHG emissions.
        </p>
      </div>
    </div>
  )
}

