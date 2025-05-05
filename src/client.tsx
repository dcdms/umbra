'use client'

import {
  BROADCAST_CHANNEL_NAME,
  COOKIE_MAX_AGE,
  COOKIE_NAME,
} from '@/constants'
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'

const ThemeContext = createContext<string | null>(null)

const SetThemeContext = createContext<Dispatch<SetStateAction<string>> | null>(
  null,
)

export function ThemeProvider({
  initialTheme,
  children,
}: {
  initialTheme: string | null
  children: ReactNode
}) {
  const [themeState, setThemeState] = useState(() => {
    if (initialTheme) {
      return initialTheme
    }

    const theme = matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'

    document.documentElement.classList.add(theme)

    document.cookie =
      COOKIE_NAME + '=' + theme + '; MaxAge=' + COOKIE_MAX_AGE + ';'

    return theme
  })

  const setTheme: Dispatch<SetStateAction<string>> = useCallback((theme) => {
    setThemeState((t) => {
      const resolved = typeof theme === 'string' ? theme : theme(t)

      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(resolved)

      document.cookie =
        COOKIE_NAME + '=' + resolved + '; MaxAge=' + COOKIE_MAX_AGE + ';'

      const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)

      channel.postMessage(resolved)
      channel.close()

      return resolved
    })
  }, [])

  useEffect(() => {
    const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME)

    channel.onmessage = (event) => {
      const theme = event.data as string
      setThemeState(theme)

      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
    }

    return () => channel.close()
  }, [])

  return (
    <ThemeContext value={themeState}>
      <SetThemeContext value={setTheme}>{children}</SetThemeContext>
    </ThemeContext>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('[seiun] useTheme must be used within ThemeProvider')
  }

  return context
}

export function useSetTheme() {
  const context = useContext(SetThemeContext)

  if (!context) {
    throw new Error('[seiun] useSetTheme must be used within ThemeProvider')
  }

  return context
}
