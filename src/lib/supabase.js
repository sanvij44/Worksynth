import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://pemciiammamyszratloj.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbWNpaWFtbWFteXN6cmF0bG9qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MjgyMjQsImV4cCI6MjA4OTAwNDIyNH0.pRMU8kQZcArvBE2HurE_g0b-7nEYVn1V9zqnkyI2GcU"

export const supabase = createClient(supabaseUrl, supabaseKey)