// VMT (Vehicle Miles Traveled) and GHG Emissions Calculations
// Based on California Air Resources Board (CARB) methodology

export interface DevelopmentScenario {
  units: number
  buildingType: 'residential' | 'mixed-use' | 'commercial'
  walkabilityScore: number
  bikeabilityScore: number
  transitScore: number
  parkingSpaces?: number
}

export interface VMTResults {
  dailyVMTPerCapita: number
  dailyVMTTotal: number
  annualVMTTotal: number
  vmtReduction: number // Percentage reduction from baseline
  baseline: {
    dailyVMTPerCapita: number
    dailyVMTTotal: number
  }
}

export interface GHGResults {
  dailyGHG: number // kg CO2e per day
  annualGHG: number // metric tons CO2e per year
  ghgReduction: number // Percentage reduction from baseline
  baseline: {
    dailyGHG: number
    annualGHG: number
  }
  equivalents: {
    carsOffRoad: number
    treesPlanted: number
  }
}

// California statewide average VMT per capita (source: CARB)
const CA_BASELINE_VMT_PER_CAPITA = 20.8 // miles per day

// Average household size in California
const AVG_HOUSEHOLD_SIZE = 2.5

// GHG conversion factor (lbs CO2e per mile for average vehicle)
const GHG_PER_MILE = 0.89 // lbs CO2e

// Pounds to kg conversion
const LBS_TO_KG = 0.453592

// Average car emits ~4.6 metric tons CO2e per year
const ANNUAL_CAR_EMISSIONS = 4.6

// One tree absorbs ~48 lbs CO2 per year
const TREE_ABSORPTION = 48

export function calculateVMT(scenario: DevelopmentScenario): VMTResults {
  const population = scenario.units * AVG_HOUSEHOLD_SIZE
  
  // Calculate VMT reduction based on multimodal access
  // Higher scores = more walking/biking/transit = less driving
  const walkFactor = scenario.walkabilityScore / 100
  const bikeFactor = scenario.bikeabilityScore / 100
  const transitFactor = scenario.transitScore / 100
  
  // Weighted reduction factors (based on CARB studies)
  // - High walkability can reduce VMT by up to 30%
  // - Good bike infrastructure can reduce by up to 15%
  // - Transit access can reduce by up to 25%
  const walkReduction = walkFactor * 0.30
  const bikeReduction = bikeFactor * 0.15
  const transitReduction = transitFactor * 0.25
  
  // Combined reduction (not simply additive, diminishing returns)
  const totalReduction = 1 - (1 - walkReduction) * (1 - bikeReduction) * (1 - transitReduction)
  
  // Calculate adjusted VMT per capita
  const adjustedVMTPerCapita = CA_BASELINE_VMT_PER_CAPITA * (1 - totalReduction)
  
  // Total daily VMT
  const dailyVMTTotal = adjustedVMTPerCapita * population
  
  // Annual VMT
  const annualVMTTotal = dailyVMTTotal * 365
  
  // Baseline (if development had no multimodal access)
  const baselineDailyTotal = CA_BASELINE_VMT_PER_CAPITA * population
  
  return {
    dailyVMTPerCapita: Math.round(adjustedVMTPerCapita * 10) / 10,
    dailyVMTTotal: Math.round(dailyVMTTotal),
    annualVMTTotal: Math.round(annualVMTTotal),
    vmtReduction: Math.round(totalReduction * 100),
    baseline: {
      dailyVMTPerCapita: CA_BASELINE_VMT_PER_CAPITA,
      dailyVMTTotal: Math.round(baselineDailyTotal),
      annualVMTTotal: Math.round(baselineDailyTotal * 365)
    }
  }
}

export function calculateGHG(vmtResults: VMTResults): GHGResults {
  // Daily GHG from vehicle travel (in kg CO2e)
  const dailyGHG = vmtResults.dailyVMTTotal * GHG_PER_MILE * LBS_TO_KG
  
  // Annual GHG (in metric tons CO2e)
  const annualGHG = (dailyGHG * 365) / 1000
  
  // Baseline GHG
  const baselineDailyGHG = vmtResults.baseline.dailyVMTTotal * GHG_PER_MILE * LBS_TO_KG
  const baselineAnnualGHG = (baselineDailyGHG * 365) / 1000
  
  // Reduction percentage
  const ghgReduction = vmtResults.vmtReduction // Same as VMT reduction
  
  // Annual savings
  const annualSavings = baselineAnnualGHG - annualGHG
  
  // Equivalents
  const carsOffRoad = Math.round(annualSavings / ANNUAL_CAR_EMISSIONS * 10) / 10
  const treesPlanted = Math.round((annualSavings * 1000 * 2.20462) / TREE_ABSORPTION)
  
  return {
    dailyGHG: Math.round(dailyGHG * 10) / 10,
    annualGHG: Math.round(annualGHG * 100) / 100,
    ghgReduction,
    baseline: {
      dailyGHG: Math.round(baselineDailyGHG * 10) / 10,
      annualGHG: Math.round(baselineAnnualGHG * 100) / 100
    },
    equivalents: {
      carsOffRoad,
      treesPlanted
    }
  }
}

export function calculateDevelopmentImpact(scenario: DevelopmentScenario) {
  const vmtResults = calculateVMT(scenario)
  const ghgResults = calculateGHG(vmtResults)
  
  return {
    vmt: vmtResults,
    ghg: ghgResults,
    scenario,
    summary: {
      population: scenario.units * AVG_HOUSEHOLD_SIZE,
      annualVMTSaved: vmtResults.baseline.annualVMTTotal - vmtResults.annualVMTTotal,
      annualGHGSaved: ghgResults.baseline.annualGHG - ghgResults.annualGHG,
      sustainabilityRating: calculateSustainabilityRating(vmtResults, ghgResults)
    }
  }
}

function calculateSustainabilityRating(vmt: VMTResults, ghg: GHGResults): string {
  const reduction = vmt.vmtReduction
  
  if (reduction >= 40) return 'Excellent - Climate Leader'
  if (reduction >= 25) return 'Very Good - Low Carbon'
  if (reduction >= 15) return 'Good - Below Average'
  if (reduction >= 5) return 'Fair - Slight Reduction'
  return 'Baseline - No Reduction'
}

