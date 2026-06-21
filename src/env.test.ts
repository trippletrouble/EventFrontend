import { envSchema } from '@/env'

describe('envSchema', () => {
  it('accepts a valid HTTP URL', () => {
    expect(() => envSchema.parse({ NEXT_PUBLIC_API_URL: 'http://localhost:4010' })).not.toThrow()
  })

  it('accepts a valid HTTPS URL', () => {
    expect(() => envSchema.parse({ NEXT_PUBLIC_API_URL: 'https://api.example.com' })).not.toThrow()
  })

  it('throws when NEXT_PUBLIC_API_URL is missing', () => {
    expect(() => envSchema.parse({})).toThrow()
  })

  it('throws when NEXT_PUBLIC_API_URL is an empty string', () => {
    expect(() => envSchema.parse({ NEXT_PUBLIC_API_URL: '' })).toThrow()
  })

  it('throws when NEXT_PUBLIC_API_URL is not a URL', () => {
    expect(() => envSchema.parse({ NEXT_PUBLIC_API_URL: 'not-a-url' })).toThrow()
  })
})