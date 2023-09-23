import useAuth from '@/hooks/useAuth'

export default function LogoutButton () {
  const { signOut } = useAuth()
  return <button onClick={signOut}>ログアウト</button>
}
