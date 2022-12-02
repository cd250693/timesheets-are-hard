# Timesheets are Hard

## Developing

Install the right version of node through nvm:

```bash
nvm use
```

The install dependencies

```bash
npm install
```

And finally, run the dev server

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte

# create a new project in my-app
npm init svelte my-app
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
