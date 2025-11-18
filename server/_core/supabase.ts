import { createClient } from '@supabase/supabase-js';
import { ENV } from './env';

if (!ENV.supabaseUrl || !ENV.supabaseServiceKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
}

// Server-side client with service role key for admin operations
export const supabaseAdmin = createClient(
  ENV.supabaseUrl,
  ENV.supabaseServiceKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);
