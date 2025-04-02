# vite-plugin-buildtime

## Install


```bash
npm install --save-dev vite-plugin-buildtime
```

## Usage

in your vite.config.js (mjs,ts,mts,etc)
```js
import { buildTime } from 'vite-plugin-buildtime';

// ...
plugins: [
    buildTime((data) => {
        console.log(data);
    });
]

```
