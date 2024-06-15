# fake-store App

You can see the Preview for this project [here](https://fake-store-app-lake.vercel.app/)

this Project utilizes [fakestoreapi](https://fakestoreapi.com/) as mock data. Refer for more details.

### Libraries and Frameworks used:
 - [SvelteKit](https://kit.svelte.dev/) 
 - [Skeleton UI toolkit](https://www.skeleton.dev/)
 - [Tailwind](https://tailwindcss.com/)
 - [svelte-toast](https://github.com/zerodevx/svelte-toast)

## For Devlopmnet 

After cloning install dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
> This project is automatically deloyed to [vercel](https://vercel.com/) with github actions as CI/CD workflow
