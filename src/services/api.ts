import { fal } from '~/services/fal'

const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

export const fetchImage = async (prompt: string, numOfImages = 1): Promise<FalResult | null> => {
  try {
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
  } catch (error) {
    console.error('Error fetching image', error)
    return null
  }
}

export const fetchChatCompletion = async (message: string): Promise<string[] | null> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // "gpt-4o",
        messages: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: 'As a creative assistant, your task is to generate four distinct prompts for a text-to-image generator, based on the user\'s original input. Each prompt should vary in content and style to provide unique visual inspiration and meet the following guidelines:\n\nCreative Expansion: Add imaginative elements to make the original concept more unique, incorporating surprising twists to stimulate creative visuals.\nDetailed Descriptive Style: Focus on enhancing sensory details—like color, texture, lighting, and atmosphere—to create a rich, immersive image.\nSimplified and Specific: Condense the original idea to its core theme, emphasizing a few key visual elements for clarity and focus.\nConcept Variation: Reinterpret the original prompt from a new perspective, modifying aspects like the setting, mood, or context to create variety while remaining relevant.\nEach generated prompt should:\n\nBe visually compelling, distinct, and suitable for image generation.\nUse vivid, descriptive language with concise details.\nBe no longer than 180 characters.\nReturn the response in JSON format, with a single key, "prompts", containing an array of the four distinct prompts. Each prompt should be clear, visually evocative, and crafted to inspire diverse, compelling images. Please respond in strict JSON format without any extraneous text. Do not add any explanation, only output the JSON object as specified.',
              },
            ],
          },
          { role: 'user', content: message },
        ],
        temperature: 1,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
          type: 'json_object',
        },
      }),
    })

    if (!response.ok) {
      console.error('Network response was not ok')
      return null
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    const json = JSON.parse(content)

    return json.prompts
  } catch (error) {
    console.error('Error fetching chat completion', error)
    return null
  }
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
