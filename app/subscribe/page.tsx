'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { loadStripe } from '@stripe/stripe-js'
import { CreditCard, Check, Loader2 } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function SubscribePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth')
      } else {
        setUser(user)
        checkSubscription(user.id)
      }
    })
  }, [router])

  const checkSubscription = async (userId: string) => {
    if (!supabase) return
    
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (data && data.status === 'active') {
      setSubscription(data)
      router.push('/')
    }
  }

  const handleSubscribe = async () => {
    if (!user) return

    setLoading(true)

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          userId: user.id
        })
      })

      const { url } = await response.json()

      if (url) {
        window.location.href = url
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            TransitScore <span className="text-sacramento-gold">3D</span> Pro
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Professional Development Impact Analyzer
          </p>
          <div className="inline-block bg-sacramento-gold text-gray-900 px-8 py-4 rounded-xl text-2xl font-bold">
            $20<span className="text-lg">/month</span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">Includes:</h3>
          {[
            'Unlimited site analyses across California',
            'Advanced scenario planning with VMT/GHG calculations',
            '14 Transportation Demand Management (TDM) programs',
            'Walk & bike accessibility analysis',
            'Professional PDF reports with full impact metrics',
            'Building characteristics configurator',
            'Climate impact equivalents (cars/trees)',
            'Priority support',
            'Early access to new features',
          ].map((feature, index) => (
            <div key={index} className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full bg-sacramento-blue hover:bg-sacramento-darkblue text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2 disabled:bg-gray-400"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>Subscribe Now - $20/month</span>
            </>
          )}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
          Secure payment powered by Stripe • Cancel anytime in account settings
        </p>

        <div className="mt-6 text-center">
          <button
            onClick={async () => {
              if (supabase) {
                await supabase.auth.signOut()
                router.push('/auth')
              }
            }}
            className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

