// Script to list all profiles and auth users (safe to run)
// Run with: node scripts/list-profiles.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = "https://gvkxxnicxrdxztexwvqd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2a3h4bmljeHJkeHp0ZXh3dnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODg3NDcsImV4cCI6MjA3MjU2NDc0N30.3kGSkF6-B9GUWiBQRDg1W-lbLmtz0r2N-smQmEFmy10";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listAllData() {
  try {
    console.log('📋 Listing all data in your Supabase database...\n');
    
    // Get all profiles
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profileError) {
      console.error('❌ Error fetching profiles:', profileError);
    } else {
      console.log(`👤 PROFILES (${profiles.length}):`);
      console.log('=' .repeat(50));
      
      if (profiles.length === 0) {
        console.log('   No profiles found.');
      } else {
        profiles.forEach((profile, index) => {
          console.log(`   ${index + 1}. ${profile.full_name}`);
          console.log(`      Email: ${profile.email}`);
          console.log(`      Role: ${profile.role}`);
          console.log(`      Pokemon: ${profile.pokemon_avatar ? 'Yes' : 'No'}`);
          console.log(`      Created: ${new Date(profile.created_at).toLocaleString()}`);
          console.log('');
        });
      }
    }

    // Get all auth users
    console.log(`🔐 AUTH USERS:`);
    console.log('=' .repeat(50));
    
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      console.log('   (This might be due to permissions - check Supabase dashboard)');
    } else {
      if (users.length === 0) {
        console.log('   No auth users found.');
      } else {
        users.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.email}`);
          console.log(`      ID: ${user.id}`);
          console.log(`      Created: ${new Date(user.created_at).toLocaleString()}`);
          console.log(`      Last Sign In: ${new Date(user.last_sign_in_at).toLocaleString()}`);
          console.log(`      Confirmed: ${user.email_confirmed_at ? 'Yes' : 'No'}`);
          console.log('');
        });
      }
    }

    console.log('📊 SUMMARY:');
    console.log(`   - Profiles: ${profiles?.length || 0}`);
    console.log(`   - Auth Users: ${users?.length || 0}`);
    console.log('');
    console.log('💡 To delete all data, run: npm run clear-profiles');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

listAllData();
