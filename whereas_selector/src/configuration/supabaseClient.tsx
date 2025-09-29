import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_API_KEY_SUPABASE; 
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de entorno para Supabase. ' +
    'Asegúrate de que REACT_APP_SUPABASE_URL y REACT_APP_SUPABASE_ANON_KEY estén definidas.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);