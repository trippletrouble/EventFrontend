import { z } from 'zod'

export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url('NEXT_PUBLIC_API_URL must be a valid URL (e.g. http://localhost:4010)'),
})

let env: z.infer<typeof envSchema>

try {
  env = envSchema.parse(process.env)
} catch (err) {
  console.error(
    '❌ Invalid environment variables:\n',
    (err as { flatten?: () => { fieldErrors: unknown } }).flatten?.().fieldErrors ?? err
  )
  process.exit(1)
}

export { env }