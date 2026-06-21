import { z } from 'zod'

export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url('NEXT_PUBLIC_API_URL must be a valid URL (e.g. http://localhost:4010)'),
})

let env: z.infer<typeof envSchema>

// Provide fallback values during test runs to avoid crash on import
const envData = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'test' ? 'http://localhost:4010' : undefined),
}

try {
  env = envSchema.parse(envData)
} catch (err) {
  console.error(
    '❌ Invalid environment variables:\n',
    (err as { flatten?: () => { fieldErrors: unknown } }).flatten?.().fieldErrors ?? err
  )
  if (typeof window === 'undefined' && process.env.NODE_ENV !== 'test') {
    process.exit(1)
  } else {
    throw err
  }
}

export { env }