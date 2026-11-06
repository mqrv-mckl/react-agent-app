# ReAct Agent App (TS)

This project extends [mqrv-mckl/react-agent-ts](https://github.com/mqrv-mckl/react-agent-ts) into a web application with a front end.

![](https://github.com/user-attachments/assets/d524cbdb-0cde-4e34-a1eb-fff2d5c18906)

## Getting Started

### Prerequisites

* [Bun](https://bun.com/get)
* A LLM compatible with the OpenAI Chat Completions API

### Clone And Configure

Clone this repo.
```sh
git clone https://github.com/mqrv-mckl/react-agent-app/
```

Adjust the following constants in `shared/constants.ts`:
* LLM_BASE_URL
* LLM_API_KEY
* LLM_CONTEXT_LENGTH
* LLM_CHARS_PER_TOKEN

### Backend

To run the backend server, execute the following:

```sh
cd react-agent-app
bun i
bun run backend/index.ts
```

### Frontend

To run the frontend server, execute the following:

```sh
cd react-agent-app/frontend
bun i
bun run vite
```

## Built With
![Bun](https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Hono](https://img.shields.io/badge/hono-%23E36002.svg?style=for-the-badge&logo=hono&logoColor=white)
![Vue.js](https://img.shields.io/badge/vue.js-%2335495e.svg?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D)
