# Carom

Carom is a top-down paddle duel for the browser. Two paddles trade rallies across
a dark field while a bright ball curves from spin and banks around two fixed
center obstacles. Play Solo against the AI or Versus with two players sharing one
keyboard.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Open the local Vite URL in a browser. The game runs entirely in the page with no
backend and no runtime asset downloads.

## Production Build

```sh
npm run build
```

The static site is emitted to `dist/`, with `dist/index.html` as the entry point.

## Controls

- `W` / `S`: move player one's paddle
- `ArrowUp` / `ArrowDown`: move player two in Versus; also steer player one in Solo
- `Enter` or `Space`: confirm menu selections
- `P` or `Escape`: pause and resume a match
- `Escape`: back out of menus
- `M`: mute or unmute audio

Menus also work with mouse, touch, and pen input.
