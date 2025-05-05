# umbra

Umbra is a simple library built for NextJS that manages dark/light themes using cookies instead of the traditional local storage for better SSR support. Features:

1. Theme usage on the server-side using NextJS cookies
2. Theme usage on the client-side using a hook
3. Synchronization between tabs using JavaScript's [BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API)
4. HTML's root element class switching for [TailwindCSS](https://tailwindcss.com) support