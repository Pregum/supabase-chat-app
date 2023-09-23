import supabase, { Database } from './supabase';

// テーブル名
export const TABLE_NAME = 'chat-app';

// データの全取得
export const fetchDatabase = async (): Promise<Database[]> => {
  try {
    const { data } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('created_at');

    if (!data || data.length < 1) {
      return [];
    }

    const chatMessages: Database[] = data.map((elem) => {
      return {
        id: (elem.id ?? '') as string,
        createdAt: (elem.created_at ?? '') as string,
        nickName: (elem.nick_name ?? '') as string,
        avatarUrl: (elem.avatar_url ?? '') as string,
        message: (elem.message ?? '') as string,
      };
    });

    return chatMessages;
  } catch (error) {
    console.error(error);

    return [];
  }
};

type InsertProps = Pick<Database, 'message' | 'nickName' | 'avatarUrl'>;

// データの追加
export const addSupabaseData = async ({
  message,
  avatarUrl,
  nickName,
}: InsertProps) => {
  try {
    await supabase.from(TABLE_NAME).insert({ message, avatar_url: avatarUrl, nick_name: nickName });
  } catch (error) {
    console.error(error);
  }
};
