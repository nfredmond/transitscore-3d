import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { calculateWalkabilityScore, calculateBikeabilityScore, calculateTransitScore } from '@/lib/utils'
import { logAnalyzedSite } from '@/lib/supabase'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || ''
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, lat, lng, amenities } = body

    if (!address || !lat || !lng || !amenities) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate scores for both walking and biking
    const walkabilityScore = calculateWalkabilityScore(amenities)
    const bikeabilityScore = calculateBikeabilityScore(amenities)
    const transitScore = calculateTransitScore(amenities)
    const sustainabilityScore = Math.round((walkabilityScore + bikeabilityScore + transitScore) / 3)

    // Prepare amenity summary for AI
    const amenitySummary = {
      total: amenities.length,
      byCategory: amenities.reduce((acc: any, amenity: any) => {
        acc[amenity.category] = (acc[amenity.category] || 0) + 1
        return acc
      }, {}),
      nearbyTransit: amenities.filter((a: any) => a.category === 'transit' && a.distance < 400).length,
      withinWalkDistance: amenities.filter((a: any) => a.distance < 800).length
    }

    // Get AI recommendation using Claude (with error handling)
    let recommendation
    
    try {
      const message = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: `You are an urban planning expert analyzing a development site in California.

Address: ${address}
Walkability Score: ${walkabilityScore}/100
Bikeability Score: ${bikeabilityScore}/100
Transit Score: ${transitScore}/100
Total Nearby Amenities: ${amenitySummary.total}
Amenities by Category: ${JSON.stringify(amenitySummary.byCategory, null, 2)}
Transit Stops within 400m: ${amenitySummary.nearbyTransit}
Total Amenities within 800m (walking): ${amenitySummary.withinWalkDistance}

Based on this data, provide a density recommendation for this site. Include:
1. Suggested number of residential units (considering the walkability and transit access)
2. Recommended building height (2-4 stories)
3. Three specific reasons for your recommendation (each 1-2 sentences)

Format your response as JSON:
{
  "suggestedUnits": <number>,
  "recommendedHeight": <number of stories>,
  "reasoning": ["reason 1", "reason 2", "reason 3"],
  "summary": "One compelling sentence summarizing why this site works for this density"
}`
        }
          ]
        })

      // Parse AI response
      const aiResponse = message.content[0].type === 'text' 
        ? message.content[0].text 
        : ''
      
      // Extract JSON from response (handle potential markdown code blocks)
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        recommendation = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (aiError) {
      console.warn('AI analysis failed, using fallback:', aiError)
      // Fallback recommendation if AI fails
      recommendation = {
        suggestedUnits: Math.round(20 + (walkabilityScore + bikeabilityScore + transitScore) / 15),
        recommendedHeight: transitScore > 60 ? 4 : 3,
        reasoning: [
          `Walkability score of ${walkabilityScore}/100 indicates ${walkabilityScore > 70 ? 'excellent' : 'good'} pedestrian access`,
          `Bikeability score of ${bikeabilityScore}/100 shows ${bikeabilityScore > 60 ? 'strong' : 'moderate'} cycling infrastructure`,
          `Transit score of ${transitScore}/100 ${transitScore > 50 ? 'supports' : 'suggests careful planning for'} higher density`
        ],
        summary: `This site shows ${sustainabilityScore > 70 ? 'strong' : 'moderate'} multimodal potential with a sustainability score of ${sustainabilityScore}/100.`
      }
    }

    const densityScore = Math.round((recommendation.suggestedUnits / 50) * 100)

    // Log to Supabase
    await logAnalyzedSite({
      address,
      lat,
      lng,
      walkability_score: walkabilityScore,
      transit_score: transitScore,
      amenity_count: amenities.length
    })

    return NextResponse.json({
      scores: {
        walkability: walkabilityScore,
        bikeability: bikeabilityScore,
        transit: transitScore,
        density: densityScore,
        sustainability: sustainabilityScore
      },
      recommendation: recommendation.summary,
      suggestedUnits: recommendation.suggestedUnits,
      recommendedHeight: recommendation.recommendedHeight,
      reasoning: recommendation.reasoning
    })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze site' },
      { status: 500 }
    )
  }
}

