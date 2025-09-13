// Script to migrate Firebase users to Supabase
import { firebaseMessagingService } from '../services/firebaseMessaging';
import { supabaseMessagingService } from '../services/supabaseMessaging';

export const migrateUsersToSupabase = async () => {
  try {
    console.log('Starting migration from Firebase to Supabase...');
    
    // Get all users from Firebase
    const firebaseUsers = await firebaseMessagingService.getUsers();
    console.log('Found Firebase users:', firebaseUsers);
    
    // Add each user to Supabase
    for (const user of firebaseUsers) {
      try {
        await supabaseMessagingService.addUser(
          user.id,
          user.fullName || user.name || 'Unknown User',
          user.avatarUrl || user.avatar_url,
          user.bio || ''
        );
        console.log(`Migrated user: ${user.fullName || user.name}`);
      } catch (error) {
        console.error(`Failed to migrate user ${user.id}:`, error);
      }
    }
    
    console.log('Migration completed!');
    return true;
  } catch (error) {
    console.error('Migration failed:', error);
    return false;
  }
};

// Function to run migration from browser console
(window as any).migrateUsersToSupabase = migrateUsersToSupabase;
