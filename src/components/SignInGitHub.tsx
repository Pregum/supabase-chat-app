import useAuth from '@/hooks/useAuth';

export default function SignInGitHub() {
  const { signInWithGitHub, errorMessage } = useAuth();

  return (
    <div>
      <button onClick={signInWithGitHub}>GitHubでサインインする</button>
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
}
