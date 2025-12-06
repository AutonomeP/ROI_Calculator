import { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export function useUserTracking(session: Session | null) {
  useEffect(() => {
    const upsertUser = async () => {
      if (!session?.user) return;

      const { id, email } = session.user;

      if (!email) return;

      try {
        const { error } = await supabase
          .from('roi_users')
          .upsert(
            {
              user_id: id,
              email,
              last_seen_at: new Date().toISOString(),
            },
            {
              onConflict: 'email',
            }
          );

        if (error) {
          console.error('Error upserting user:', error);
        }
      } catch (err) {
        console.error('Unexpected error tracking user:', err);
      }
    };

    upsertUser();
  }, [session]);
}
