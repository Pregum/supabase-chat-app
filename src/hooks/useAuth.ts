import supabase from '@/supabase';
import { Session } from '@supabase/supabase-js';
import { ApiError } from 'next/dist/server/api-utils';
import { useEffect, useState } from 'react';

export default function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // ログイン状態への変化を監視
    const { data: authData } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    // リスナーの解除
    return () => authData.subscription.unsubscribe();
  }, []);

  const signInWithGitHub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
      });
      if (error) {
        setErrorMessage(error.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else if (typeof error === 'string') {
        setErrorMessage(error);
      } else {
        console.error('GitHubとの連携に失敗しました');
      }
    }
  };

  // ログインyのプロフィール取得
  const profileFromGitHub: {
    nickName: string;
    avatarUrl: string;
  } = {
    nickName: session?.user?.user_metadata.user_name,
    avatarUrl: session?.user?.user_metadata.avatar_url,
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { session, setSession, signInWithGitHub, profileFromGitHub, signOut, errorMessage };
}
