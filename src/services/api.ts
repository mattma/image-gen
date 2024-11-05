import { fal } from '~/services/fal'

const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export const fetchImage = async (prompt: string, numOfImages = 1): Promise<FalResult> => {
  const result = await fal.subscribe('fal-ai/flux/schnell', {
    input: {
      prompt,
      image_size: 'square',
      num_images: numOfImages,
    },
    logs: true,
    onQueueUpdate: (update) => {
      if (update.status === 'IN_PROGRESS') {
        update.logs.map((log) => log.message).forEach(console.log)
      }
    },
  })

  return result.data
}

export const fetchChatCompletion = async (message: string) => {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini', // "gpt-4o",
      messages: [{ role: 'user', content: message }],
    }),
  })

  if (!response.ok) {
    throw new Error('Network response was not ok')
  }

  const data = await response.json()
  console.log('data', data)

  return data.choices[0].message.content
}

interface FalResult {
  images: FalImage[]
  timings: {
    inference: number
  }
  seed: number
  has_nsfw_concepts: boolean[]
  prompt: string
}

interface FalImage {
  url: string
  width: number
  height: number
  content_type: string
}
