# vite-plugin-buildtime

## Install


```bash
npm install --save-dev @nullvoxpopuli/vite-plugin-buildtime
```

## Usage

in your vite.config.js (mjs,ts,mts,etc)
```js
import { buildTime } from '@nullvoxpopulivite-plugin-buildtime';

// ...
plugins: [
    buildTime((data) => {
        console.log(data);
    });
]

```
