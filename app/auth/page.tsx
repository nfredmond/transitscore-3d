'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Auth from '@/components/Auth'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if already logged in
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          router.push('/subscribe')
        }
      })
    }
  }, [router])

  const handleAuthSuccess = () => {
    router.push('/subscribe')
  }

  return <Auth onAuthSuccess={handleAuthSuccess} />
}

