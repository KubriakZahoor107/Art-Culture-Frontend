import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import { debug, error as logError } from '../utils/logger.js'
import API from '../utils/api.js'
import { User } from '../types/user.js'

interface AuthContextValue {
  user: User | null
  isLoggedIn: boolean
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthProvider missing')
  return ctx
}

export function AuthProvider({ children }: { children: ReactNode }) {
        const [user, setUser] = useState<User | null>(null)
        const [isLoggedIn, setIsLoggedIn] = useState(false)
        const [loading, setLoading] = useState(true)

	useEffect(() => {
		// On component mount, check if the user is already logged in
		const fetchUser = async () => {
			const token = localStorage.getItem('token')
			if (token) {
				try {
					const response = await API.get('/auth/me', {
						headers: {
							Authorization: `Bearer ${token}`,
						},
					})
					debug('User data fetched:', response.data.user)
					setUser(response.data.user)
					setIsLoggedIn(true)
				} catch (error) {
					logError('Failed to fetch user', error as Error)
					localStorage.removeItem('token')
					setUser(null)
					setIsLoggedIn(false)
				}
			}
			setLoading(false)
		}
		fetchUser()
	}, [])

        const login = (userData: User, token: string) => {
                setUser(userData)
                setIsLoggedIn(true)
                localStorage.setItem('token', token)
                debug('User logged in:', userData)
        }

	const logout = () => {
		setUser(null)
		setIsLoggedIn(false)
		localStorage.removeItem('token')
	}
	
        const updateUser = (userData: User) => {
                setUser(userData)
        }

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				updateUser,
				logout,
				isLoggedIn,
			}}
		>
			{!loading && children}
		</AuthContext.Provider>
	)
}
