# powerfulyang.com
## Download manually

Download the example:

```bash
git clone https://github.com/AquaChurch/powerfulyang.com
```

Install it and run:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

open browser 

[http://dev.powerfulyang.com:3000/gallery](http://dev.powerfulyang.com:3000/gallery)

## Run Jest tests

```bash
npm run test
# or
yarn test
```

## The idea behind the example

This example shows a configuration and several examples for a running Jest tests in a NextJS TypeScript app


# about netdata

## run netdata on your server
```
docker run -d --name=netdata \
  -p 19999:19999 \
  -v netdatalib:/var/lib/netdata \
  -v netdatacache:/var/cache/netdata \
  -v /etc/passwd:/host/etc/passwd:ro \
  -v /etc/group:/host/etc/group:ro \
  -v /proc:/host/proc:ro \
  -v /sys:/host/sys:ro \
  -v /etc/os-release:/host/etc/os-release:ro \
  --restart unless-stopped \
  --cap-add SYS_PTRACE \
  --security-opt apparmor=unconfined \
  netdata/netdata
```

## check it
[monitor](https://monitor.powerfulyang.com)
