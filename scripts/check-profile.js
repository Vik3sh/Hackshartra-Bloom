// Script to check user profile in Supabase
// Run with: node scripts/check-profile.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gvkxxnicxrdxztexwvqd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2a3h4bmljeHJkeHp0ZXh3dnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODg3NDcsImV4cCI6MjA3MjU2NDc0N30.3kGSkF6-B9GUWiBQRDg1W-lbLmtz0r2N-smQmEFmy10";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkProfiles() {
  try {
    console.log('🔍 Checking Supabase profiles...\n');
    
    // Get all profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching profiles:', error);
      return;
    }

    console.log(`📊 Found ${profiles.length} profile(s):\n`);

    profiles.forEach((profile, index) => {
      console.log(`👤 Profile ${index + 1}:`);
      console.log(`   ID: ${profile.id}`);
      console.log(`   User ID: ${profile.user_id}`);
      console.log(`   Full Name: ${profile.full_name}`);
      console.log(`   Email: ${profile.email}`);
      console.log(`   Role: ${profile.role}`);
      console.log(`   Pokemon Avatar: ${profile.pokemon_avatar || 'None'}`);
      console.log(`   Created: ${new Date(profile.created_at).toLocaleString()}`);
      console.log(`   Updated: ${new Date(profile.updated_at).toLocaleString()}`);
      console.log('   ---');
    });

    // Check auth users
    console.log('\n🔐 Checking authentication users...\n');
    
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
    } else {
      console.log(`👥 Found ${users.length} auth user(s):\n`);
      
      users.forEach((user, index) => {
        console.log(`🔑 Auth User ${index + 1}:`);
        console.log(`   ID: ${user.id}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
        console.log(`   Last Sign In: ${new Date(user.last_sign_in_at).toLocaleString()}`);
        console.log(`   User Metadata:`, JSON.stringify(user.user_metadata, null, 2));
        console.log('   ---');
      });
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

checkProfiles();
