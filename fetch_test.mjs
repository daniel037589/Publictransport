import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kvavujuefxbcbtxvuxxs.supabase.co';
const supabaseAnonKey = 'sb_publishable_FiNzuftOKBJZ80qm4tDZRw_fIW4CEzF';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function check() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log('Profiles data:', data);
  console.log('Profiles error:', error);
}

check();
