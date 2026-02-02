import { supabase } from '../lib/supabase'

export type LeadInput = {
  name: string
  email?: string
  phone?: string
}

export const createLead = async (lead: LeadInput) => {
  const { data } = await supabase.auth.getUser()

  return supabase.from('leads').insert({
    ...lead,
    created_by: data.user?.id,
  })
}

export const getLeads = async () => {
  return supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
}
