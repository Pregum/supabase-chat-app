import useAuth from '@/hooks/useAuth';
import ChatApp from '@/components/ChatApp';
import SignInGitHub from '@/components/SignInGitHub';
import Layout from '@/components/Layout';

export default function Home() {
  const { session: isLogin } = useAuth();

  // ログインしているn場合のチャットページを表示
  return isLogin ? (
    <Layout>
      <h2>チャットアプリ</h2>
      <ChatApp />
    </Layout>
  ) : (
    <Layout>
      <h2>GitHubでサインイン</h2>
      <SignInGitHub />
    </Layout>
  );
}
