// supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ezkfiwttetmrdogmzpcm.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6a2Zpd3R0ZXRtcmRvZ216cGNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyNDQ5NzMsImV4cCI6MjA2MTgyMDk3M30.0ZoOwX6QN_CS8cSv8wR_CRUk7bulOo4wtPg8l7aVBcc'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
