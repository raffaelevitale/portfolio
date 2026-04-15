
# Chatbot Interface

This is the frontend bundle for the internal chatbot UI.
The original project reference is available at:
https://www.figma.com/design/DgrH1iXZQsX2qrkcVjfdHH/Chatbot-Interface

## Run locally

1. Install dependencies:

```bash
npm i
```

2. Start Vite development server:

```bash
npm run dev
```

## ChatGPT embedded mode

The in-app ChatGPT panel calls a server endpoint at:

- /api/interfaccia/openai-chat

If you run this frontend alone on Vite (without Next.js host), configure the backend origin with:

- VITE_BACKEND_BASE_URL=http://localhost:3000

When the frontend is served by the Next.js host app, no extra frontend variable is required.

  