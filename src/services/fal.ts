import { fal } from '@fal-ai/client'

const falApiKey = process.env.NEXT_PUBLIC_FAL_API_KEY

fal.config({
  credentials: falApiKey,
})

export { fal }
