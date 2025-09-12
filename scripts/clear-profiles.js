// Script to clear all profiles and auth users from Supabase
// Run with: node scripts/clear-profiles.js

import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

const SUPABASE_URL = "https://gvkxxnicxrdxztexwvqd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd2a3h4bmljeHJkeHp0ZXh3dnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODg3NDcsImV4cCI6MjA3MjU2NDc0N30.3kGSkF6-B9GUWiBQRDg1W-lbLmtz0r2N-smQmEFmy10";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function clearAllProfiles() {
  try {
    console.log('🗑️  Starting profile cleanup...\n');
    
    // First, get all profiles to show what we're deleting
    const { data: profiles, error: fetchError } = await supabase
      .from('profiles')
      .select('*');

    if (fetchError) {
      console.error('❌ Error fetching profiles:', fetchError);
      return;
    }

    console.log(`📊 Found ${profiles.length} profile(s) to delete:\n`);
    
    profiles.forEach((profile, index) => {
      console.log(`👤 Profile ${index + 1}: ${profile.full_name} (${profile.email})`);
    });

    if (profiles.length === 0) {
      console.log('✅ No profiles found to delete.');
      return;
    }

    // Delete all profiles
    console.log('\n🗑️  Deleting all profiles...');
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all (using a condition that's always true)

    if (deleteError) {
      console.error('❌ Error deleting profiles:', deleteError);
      return;
    }

    console.log('✅ All profiles deleted successfully!');

    // Get all auth users
    console.log('\n🔐 Checking auth users...');
    const { data: { users }, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      console.log('⚠️  Note: You may need to delete auth users manually from the Supabase dashboard');
      return;
    }

    console.log(`👥 Found ${users.length} auth user(s):\n`);
    
    users.forEach((user, index) => {
      console.log(`🔑 Auth User ${index + 1}: ${user.email} (${user.id})`);
    });

    if (users.length === 0) {
      console.log('✅ No auth users found to delete.');
      return;
    }

    // Delete all auth users
    console.log('\n🗑️  Deleting all auth users...');
    
    for (const user of users) {
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteUserError) {
        console.error(`❌ Error deleting user ${user.email}:`, deleteUserError);
      } else {
        console.log(`✅ Deleted user: ${user.email}`);
      }
    }

    console.log('\n🎉 Cleanup completed!');
    console.log('📝 Summary:');
    console.log(`   - Deleted ${profiles.length} profile(s)`);
    console.log(`   - Deleted ${users.length} auth user(s)`);
    console.log('\n✨ Your Supabase database is now clean and ready for fresh testing!');

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Add confirmation prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('⚠️  WARNING: This will delete ALL profiles and auth users from your Supabase database!');
console.log('This action cannot be undone.\n');

rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    console.log('\n🚀 Proceeding with cleanup...\n');
    clearAllProfiles().then(() => {
      rl.close();
    });
  } else {
    console.log('❌ Cleanup cancelled.');
    rl.close();
  }
});
