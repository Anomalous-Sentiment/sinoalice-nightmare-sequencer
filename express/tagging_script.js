require('dotenv').config()
const supabaseJs = require('@supabase/supabase-js')

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = supabaseJs.createClient(supabaseUrl, supabaseKey)

let { data: skills, error } = await supabase
  .from('Colosseum Skills')
  .select("*")
  .eq('column', 'Equal to')

