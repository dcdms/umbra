import { ThemeProvider as ClientThemeProvider } from '@/client'
import { COOKIE_MAX_AGE, COOKIE_NAME } from '@/constants'
import { cookies } from 'next/headers'
import type { ReactNode } from 'react'

export const theme = {
  retrieve: async () => {
    const _cookies = await cookies()
    const theme = _cookies.get(COOKIE_NAME)

    return theme?.value ?? null
  },
  set: async (theme: string) => {
    const _cookies = await cookies()

    _cookies.set({
      name: COOKIE_NAME,
      value: theme,
      maxAge: COOKIE_MAX_AGE,
    })
  },
}

export async function ThemeProvider({ children }: { children: ReactNode }) {
  const initialTheme = await theme.retrieve()

  return (
    <ClientThemeProvider initialTheme={initialTheme}>
      {children}
    </ClientThemeProvider>
  )
}
