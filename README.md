This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

- Environment Variables

  - Copy `.env.example` to `.env` and add your API keys.
  - You can get your API keys from [FAL](https://fal.ai) and [OpenAI](https://platform.openai.com/api-keys).

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Image State

Image border state:

- default: **Gray** color around the image
- hover: **Violet** color around the image
- selected: **Red** color around the image

User can **double click** on the image to **select** or **deselect** to set as the active image. Once the image is selected, the image border will be **Red** color.

**User types in the input box, it will fetch Fal AI API and generate an image.**

  - If there is an active image, the active image will be replaced by the newly generated image.
  - If there is no active image, it will create an image, add it to the image playground section (top left corner), and set it as the active image.

## Technologies

- [Next.js](https://nextjs.org)
  - [Version 15](https://nextjs.org/blog/next-15) released on 10/21/2024
- [React](https://react.dev)
  - [Version 19 RC](https://react.dev/blog/2024/04/25/react-19) released on 10/28/2024
  - [React Compiler Beta](https://react.dev/blog/2024/10/21/react-compiler-beta-release) released on 10/25/2024
  - *Note: I did not use `useCallback`, `useMemo`, `memo` in this project because the React Compiler Beta takes care of the memoization*
- [Zustand](https://github.com/pmndrs/zustand)
  - Redux-like state management.
  - I also setup the devtools for Zustand, so it works with [the React Devtools chrome extension](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en). Open the React Devtools in Chrome and go to the "Redux" tab to see the Zustand store in local development
- [react-draggable](https://github.com/react-grid-layout/react-draggable)
  - Used for drag the image around the screen
- [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - Used for storing the favorite images to demostrate a stateful backend
  - User can like or dislike an image and they will be persisted in the browser for inspiration
  - *Note: This is not a real backend. In the real world, I would store the favorite images in a database and retrieve them from a backend server written in the programming language like Node.js, Python, Golang, etc.*
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
  - Used for styling the UI
  - Minimal and less than 20 line of CSS code for the entire project

*Note: I intentionally did not use any other libraries for this project. I wanted to keep the project simple and focused on the core functionality.*

## Code Quality

- `npm run lint` to check for linting errors.
  -  ✔ No ESLint warnings or errors
- `npm run format` to fix linting errors.
  - ✔ Formatted all files
- `npm run typecheck` to check for type errors.
  - ✔ No TypeScript errors found

## Weird behaviors (can definitely be fixed)

- User click on an image's **"Generate"** button, here is what will happen:

  - The original clicked image will be removed immediately from where the mouse cursor is (you may find it weird)
  - A new image grid contains 5 images will be created and displayed at the top left corner of the image playground section.
  - The original clicked image is moved to the center image in the new image grid.
  - The other 4 images will show the loading animation, once the images are generated and downloaded, they will replace the loading animation with the newly generated images.


## Improvement Opportunities

- Duplicate or generate image(s) should display at mouse cursor position instead of the same screen position (top left corner of the image playground section) in the current implementation. As a result, user may see duplicate or generated images at different screen positions after they click on the **"Add"** or **"Generate"** button.
- Image playground (drag image) section is implemented with HTML and CSS 3. It can be implement using Canvas API via [Three.js](https://threejs.org/) and [React Three Fiber](https://r3f.docs.pmnd.rs/getting-started/introduction)
- Aria labels in HTML elements for better keyboard navigation
- A real backend server should be implemented, example: **Express** in Node.js, **FastAPI** in Python, **Gin** in Golang, etc. Currently, the API request send the Fal API key via the client side JavaScript code, so it is exposed to the browser console. We should not expose the API key in the client side JavaScript code, and the API key should be stored in the backend server.
