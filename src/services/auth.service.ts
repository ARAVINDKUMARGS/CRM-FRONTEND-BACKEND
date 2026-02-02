import { supabase } from '../lib/supabase'

export const signup = (email: string, password: string) => {
  return supabase.auth.signUp({ email, password })
}

export const login = (email: string, password: string) => {
  return supabase.auth.signInWithPassword({ email, password })
}

export const logout = () => {
  return supabase.auth.signOut()
}
