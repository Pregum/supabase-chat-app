import useAuth from '@/hooks/useAuth';
import supabase, { Database } from '@/supabase';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { fetchDatabase, addSupabaseData } from '../supabaseFunctions';

const TABLE_NAME = 'chat-app';

export default function ChatApp() {
  const [inputText, setInputText] = useState('');
  const [messageText, setMessageText] = useState<Database[]>([]);
  const { session: isLogin, profileFromGitHub } = useAuth();
  const router = useRouter();

  // ログアウト済みの場合はログインページにリダイレクト
  if (!isLogin) router.push('/');

  // リアルタイムデータ取得
  const fetchRealtimeData = () => {
    try {
      supabase
        .channel('table_postgres_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: TABLE_NAME,
          },
          (payload) => {
            // データ登録
            if (payload.eventType === 'INSERT') {
              const {
                created_at: createdAt,
                id,
                message,
                avatar_url: avatarUrl,
                nick_name: nickName,
              } = payload.new;
              setMessageText((messageText) => [
                ...messageText,
                {
                  createdAt,
                  id,
                  message,
                  avatarUrl,
                  nickName,
                },
              ]);
            }
          }
        )
        .subscribe();

      // リスナーの解除
      return () => supabase.channel('table_postgres_changes').unsubscribe();
    } catch (error) {
      console.error(error);
    }
  };

  // 初回のみ全データフェッチとリアルタイムリスナー登録
  useEffect(() => {
    const init = async () => {
      const allMessage = await fetchDatabase();
      setMessageText(allMessage);
    };

    init();
    fetchRealtimeData();
  }, []);

  // 入力したメッセージ
  const onChangeInputText = (event: React.ChangeEvent<HTMLInputElement>) =>
    setInputText(event.target.value);

  // メッセージの送信
  const onSubmitNewMessage = (event: React.FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (inputText === '') return;
    addSupabaseData({ message: inputText, ...profileFromGitHub }); // DBに追加
    setInputText('');
  };

  return (
    <div>
      {messageText.map((item) => (
        <div key={item.id} data-user-id={item.nickName}>
          <div>
            <a
              href={`https://github.com/${item.nickName}`}
              target='_blank'
              rel='noopener noreferrer'
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {item.avatarUrl ? (
                <img
                  src={item.avatarUrl}
                  alt='アイコン'
                  width={80}
                  height={80}
                />
              ) : (
                <img src='/noimage.png' alt='no image' width={80} height={80} />
              )}
              <p>{item.nickName ? item.nickName : '名無し'}</p>
            </a>
            <p>{item.createdAt}</p>
          </div>
          <p>{item.message}</p>
        </div>
      ))}

      <form onSubmit={onSubmitNewMessage}>
        <input
          type='text'
          name='message'
          value={inputText}
          onChange={onChangeInputText}
          aria-label='新規メッセージ'
        />
        <button type='submit' disabled={inputText === ''}>
          送信
        </button>
      </form>
    </div>
  );
}
