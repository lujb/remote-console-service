# remote-console-service
A local service for inspecting remote console logs
## How to use
Step 1: start local service
```
> node dist/remote-console-service.js start
```
This will start a local http server with default port 8000

Step 2: inject script in your remote html page
```html
<script type="text/javascript" src="http://${ip}:${port}/remote-console.js"></script>
```

Step 3: open browser to inspect remote logs
```
http://${ip}:${port}
```

## How to build
> npm run build

This will build out a standalone nodejs file and can be executed with `node`
