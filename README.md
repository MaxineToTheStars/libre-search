<!-- Move text down -->
<br>

<!-- Header -->
<h1 align="center">libre-search</h1>

<!-- Subheading -->
<h3 align="center">Search YouTube without the need of an API key</h3>

---

<!-- Move text down -->
<br>

<!-- Image -->
<p align="center"> <img src="https://pbs.twimg.com/media/Fz8BgqDaMAAINd-?format=jpg&name=4096x4096"> </p>

---

<!-- Move text down -->
<br>

<h4 align="left">Quick and Dirty Example</h4>

```ts
// Import Statement
import { LibreSearch, VideoInformation } from "./lib";

// Main
async function main() {
    // The library is asynchronous by design
    const returnVideos: Array<VideoInformation> = await LibreSearch.search("Vylet Pony Hush!");

    // Print out the results
    console.log(returnVideos)

    // or maybe the first one
    console.log(returnVideos[0]);
}
```
