import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MATCHOVER_ITEMS,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_W,
  OBSTACLES,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_H,
  PADDLE_HALF,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";
import type { Point, Rect } from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";

export type Mode = "solo" | "versus";

export type Side = "left" | "right";

export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}

export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}

export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}

export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
}

export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";

  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;

  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;

  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];

  readonly simTime: number;
  readonly muted: boolean;
}

export interface MenuRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface CaromSnapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly muted: boolean;
  readonly paddles: {
    readonly left: PaddleState;
    readonly right: PaddleState;
  };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball: (BallState & { readonly speed: number }) | null;
  readonly obstacles: readonly ObstacleState[];
  readonly simTime: number;
}

export interface CaromDebugApi {
  readonly version: number;
  clearWorld(state: DeepReadonly<CaromState>): CaromState;
  spawnBall(state: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(state: DeepReadonly<CaromState>, index: number): CaromState;
  reset(state: DeepReadonly<CaromState>): CaromState;
  reconcile(state: DeepReadonly<CaromState>): CaromState;
  setScreen(state: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(state: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    state: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(state: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(state: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(state: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(
    state: DeepReadonly<CaromState>,
    side: Side,
    cy: number,
  ): CaromState;
  setPaddleVy(
    state: DeepReadonly<CaromState>,
    side: Side,
    vy: number,
  ): CaromState;
  setPaddleDriven(
    state: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    state: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    state: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(state: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(state: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(
    state: DeepReadonly<CaromState>,
    seconds: number,
  ): CaromState;
  setBallServeSign(state: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(state: DeepReadonly<CaromState>): CaromState;
  setAiTracking(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(state: DeepReadonly<CaromState>, muted: boolean): CaromState;
  snapshot(state: DeepReadonly<CaromState>): CaromSnapshot;
  menuItemRect(state: DeepReadonly<CaromState>, index: number): MenuRect | null;
}

export const BACKGROUND = "#07111d";

const P1_COLOR = "#49d2ff";
const P2_COLOR = "#ff5d8f";
const BALL_COLOR = "#f9f871";
const OBSTACLE_COLOR = "#35f0a2";
const TEXT_COLOR = "#edf7ff";
const DIM_TEXT = "#7d91a8";
const PANEL = "rgba(6, 13, 24, 0.74)";
const MENU_W = 360;
const MENU_H = 58;
const MENU_GAP = 18;

interface InputEdges {
  readonly up: boolean;
  readonly down: boolean;
  readonly confirm: boolean;
  readonly back: boolean;
  readonly pause: boolean;
  readonly mute: boolean;
}

interface FrameEvents {
  wall: boolean;
  paddle: boolean;
  obstacle: boolean;
  score: boolean;
}

interface CollisionResult {
  readonly ball: BallState;
  readonly face: "left" | "right" | "top" | "bottom" | null;
}

function randServeSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function finite(value: number, fallback = 0): number {
  return Number.isFinite(value) ? value : fallback;
}

function ballSpeed(ball: Pick<BallState, "vx" | "vy">): number {
  return Math.hypot(ball.vx, ball.vy);
}

function parkedBall(): BallState {
  return {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: randServeSign(),
    trail: [],
  };
}

function initialPaddle(): PaddleState {
  return { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 };
}

function initialObstacles(): readonly ObstacleState[] {
  return OBSTACLE_CENTERS.map((center, index) => ({
    index,
    cx: center.x,
    cy: center.y,
  }));
}

function titleState(muted: boolean, simTime = 0, titleIndex = 0): CaromState {
  return {
    screen: "title",
    mode: "solo",
    menuIndex: titleIndex,
    titleIndex,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    paddles: { left: initialPaddle(), right: initialPaddle() },
    ai: { tracking: true, movement: true },
    receiver: "left",
    ball: parkedBall(),
    obstacles: initialObstacles(),
    simTime,
    muted,
  };
}

function copyState(state: DeepReadonly<CaromState>): CaromState {
  return {
    screen: state.screen,
    mode: state.mode,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    resumeScreen: state.resumeScreen,
    score: { p1: state.score.p1, p2: state.score.p2 },
    winner: state.winner,
    paddles: {
      left: { ...state.paddles.left },
      right: { ...state.paddles.right },
    },
    ai: { ...state.ai },
    receiver: state.receiver,
    ball: state.ball
      ? { ...state.ball, trail: state.ball.trail.map((s) => ({ ...s })) }
      : null,
    obstacles: state.obstacles.map((o) => ({ ...o })),
    simTime: state.simTime,
    muted: state.muted,
  };
}

function menuItems(screen: Screen): readonly string[] {
  if (screen === "title") return TITLE_ITEMS;
  if (screen === "paused") return PAUSE_ITEMS;
  if (screen === "matchover") return MATCHOVER_ITEMS;
  if (screen === "howto") return ["BACK"];
  return [];
}

function menuRectFor(screen: Screen, index: number): MenuRect | null {
  const count = menuItems(screen).length;
  if (index < 0 || index >= count || count === 0) return null;
  const totalH = count * MENU_H + (count - 1) * MENU_GAP;
  const centerY = screen === "title" ? 440 : screen === "howto" ? 590 : 410;
  return {
    x: FIELD_CX - MENU_W / 2,
    y: centerY - totalH / 2 + index * (MENU_H + MENU_GAP),
    w: MENU_W,
    h: MENU_H,
  };
}

function hitMenuItem(screen: Screen, x: number, y: number): number | null {
  const count = menuItems(screen).length;
  for (let i = 0; i < count; i += 1) {
    const rect = menuRectFor(screen, i);
    if (
      rect &&
      x >= rect.x &&
      x <= rect.x + rect.w &&
      y >= rect.y &&
      y <= rect.y + rect.h
    ) {
      return i;
    }
  }
  return null;
}

function wrapMenu(index: number, count: number, dir: -1 | 1): number {
  return (index + dir + count) % count;
}

function startMatch(state: DeepReadonly<CaromState>, mode: Mode): CaromState {
  return {
    ...copyState(state),
    screen: "countdown",
    mode,
    menuIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    paddles: {
      left: { ...state.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...state.paddles.right, cy: FIELD_CY, vy: 0 },
    },
    ball: parkedBall(),
  };
}

function returnToTitle(state: DeepReadonly<CaromState>): CaromState {
  return titleState(state.muted, state.simTime, state.titleIndex);
}

function confirmMenu(state: DeepReadonly<CaromState>): CaromState {
  if (state.screen === "title") {
    const titleIndex = clamp(
      Math.trunc(state.menuIndex),
      0,
      TITLE_ITEMS.length - 1,
    );
    const base = { ...copyState(state), titleIndex };
    if (titleIndex === 0) return startMatch(base, "solo");
    if (titleIndex === 1) return startMatch(base, "versus");
    return { ...base, screen: "howto", menuIndex: 0 };
  }
  if (state.screen === "howto") return returnToTitle(state);
  if (state.screen === "paused") {
    if (state.menuIndex === 0)
      return { ...copyState(state), screen: state.resumeScreen };
    if (state.menuIndex === 1) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  if (state.screen === "matchover") {
    if (state.menuIndex === 0) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  return copyState(state);
}

function readEdges(api: UpdateApi): InputEdges {
  return {
    up: api.input.pressed("p1-up") || api.input.pressed("p2-up"),
    down: api.input.pressed("p1-down") || api.input.pressed("p2-down"),
    confirm: api.input.pressed("confirm"),
    back: api.input.pressed("back"),
    pause: api.input.pressed("pause"),
    mute: api.input.pressed("mute"),
  };
}

function applyMenuKeyboard(
  state: DeepReadonly<CaromState>,
  edges: InputEdges,
): CaromState {
  if (state.screen === "countdown" || state.screen === "playing") {
    if (edges.pause) {
      return {
        ...copyState(state),
        screen: "paused",
        resumeScreen: state.screen,
        menuIndex: 0,
      };
    }
    return copyState(state);
  }
  if (state.screen === "paused" && (edges.pause || edges.back)) {
    return { ...copyState(state), screen: state.resumeScreen };
  }
  if (state.screen === "howto" && (edges.confirm || edges.back)) {
    return returnToTitle(state);
  }
  if (state.screen === "matchover" && edges.back) {
    return returnToTitle(state);
  }

  const items = menuItems(state.screen);
  if (items.length === 0) return copyState(state);

  if (edges.up) {
    return {
      ...copyState(state),
      menuIndex: wrapMenu(state.menuIndex, items.length, -1),
    };
  }
  if (edges.down) {
    return {
      ...copyState(state),
      menuIndex: wrapMenu(state.menuIndex, items.length, 1),
    };
  }
  if (edges.confirm) return confirmMenu(state);
  return copyState(state);
}

function applyPointerMenus(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  keyboardConfirmed: boolean,
): CaromState {
  const items = menuItems(state.screen);
  if (items.length === 0) return copyState(state);

  let next = copyState(state);
  let confirmed = false;
  let pressIndex: number | null = null;
  for (const sample of api.input.pointerSamples()) {
    const hit = hitMenuItem(next.screen, sample.x, sample.y);
    if (hit !== null) next = { ...next, menuIndex: hit };
    if (sample.type === "down") {
      pressIndex = hit;
    }
    if (sample.type === "up") {
      if (
        hit !== null &&
        hit === (pressIndex ?? next.menuIndex) &&
        !keyboardConfirmed
      ) {
        next = { ...next, menuIndex: hit };
        confirmed = true;
      }
      pressIndex = null;
    }
  }

  const pointer = api.input.pointer();
  const hover = hitMenuItem(next.screen, pointer.x, pointer.y);
  if (hover !== null) next = { ...next, menuIndex: hover };

  if (confirmed) return confirmMenu(next);
  return next;
}

function integratePaddle(
  paddle: DeepReadonly<PaddleState>,
  vy: number,
  dt: number,
): PaddleState {
  const oldCy = paddle.cy;
  const target = clamp(oldCy + vy * dt, PADDLE_MIN_CY, PADDLE_MAX_CY);
  const actualVy = dt > 0 ? (target - oldCy) / dt : 0;
  return { ...paddle, cy: target, vy: actualVy };
}

function humanVy(up: boolean, down: boolean): number {
  return (Number(down) - Number(up)) * PADDLE_SPEED;
}

function movePaddles(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): CaromState {
  const p1Up = api.input.value("p1-up") > 0;
  const p1Down = api.input.value("p1-down") > 0;
  const p2Up = api.input.value("p2-up") > 0;
  const p2Down = api.input.value("p2-down") > 0;

  const leftVy = state.paddles.left.driven
    ? state.paddles.left.drivenVy
    : state.mode === "solo"
      ? humanVy(p1Up || p2Up, p1Down || p2Down)
      : humanVy(p1Up, p1Down);

  let rightVy: number;
  if (state.paddles.right.driven) {
    rightVy = state.paddles.right.drivenVy;
  } else if (state.mode === "versus") {
    rightVy = humanVy(p2Up, p2Down);
  } else if (!state.ai.movement) {
    rightVy = 0;
  } else {
    let target = AI_HOME_Y;
    let deadzone = AI_HOME_DEADZONE;
    if (
      state.ai.tracking &&
      state.screen === "playing" &&
      state.ball &&
      state.ball.vx > 0
    ) {
      target = state.ball.y - state.ball.vy * AI_REACT;
      deadzone = AI_DEADZONE;
    }
    const diff = target - state.paddles.right.cy;
    rightVy =
      Math.abs(diff) <= deadzone
        ? 0
        : Math.sign(diff) *
          Math.min(AI_SPEED, Math.abs(diff) / Math.max(dt, 0.000001));
  }

  return {
    ...copyState(state),
    paddles: {
      left: integratePaddle(state.paddles.left, leftVy, dt),
      right: integratePaddle(state.paddles.right, rightVy, dt),
    },
  };
}

function expandedOverlap(ball: BallState, rect: Rect): boolean {
  return (
    ball.x > rect.x0 - BALL_R &&
    ball.x < rect.x1 + BALL_R &&
    ball.y > rect.y0 - BALL_R &&
    ball.y < rect.y1 + BALL_R
  );
}

function resolveRect(ball: BallState, rect: Rect): CollisionResult {
  if (!expandedOverlap(ball, rect)) return { ball, face: null };
  const depths = [
    { face: "left" as const, value: ball.x - (rect.x0 - BALL_R) },
    { face: "right" as const, value: rect.x1 + BALL_R - ball.x },
    { face: "top" as const, value: ball.y - (rect.y0 - BALL_R) },
    { face: "bottom" as const, value: rect.y1 + BALL_R - ball.y },
  ];
  const hit = depths.reduce((best, item) =>
    item.value < best.value ? item : best,
  );
  let next = ball;
  if (hit.face === "left") {
    next = {
      ...next,
      x: rect.x0 - BALL_R,
      vx: next.vx > 0 ? -next.vx : next.vx,
    };
  } else if (hit.face === "right") {
    next = {
      ...next,
      x: rect.x1 + BALL_R,
      vx: next.vx < 0 ? -next.vx : next.vx,
    };
  } else if (hit.face === "top") {
    next = {
      ...next,
      y: rect.y0 - BALL_R,
      vy: next.vy > 0 ? -next.vy : next.vy,
    };
  } else {
    next = {
      ...next,
      y: rect.y1 + BALL_R,
      vy: next.vy < 0 ? -next.vy : next.vy,
    };
  }
  return { ball: next, face: hit.face };
}

function paddleRect(side: Side, cy: number): Rect {
  return side === "left"
    ? { x0: P1_X0, x1: P1_X1, y0: cy - PADDLE_HALF, y1: cy + PADDLE_HALF }
    : { x0: P2_X0, x1: P2_X1, y0: cy - PADDLE_HALF, y1: cy + PADDLE_HALF };
}

function paddleBounce(
  ball: BallState,
  side: Side,
  paddle: DeepReadonly<PaddleState>,
): BallState {
  const offset = clamp((ball.y - paddle.cy) / PADDLE_HALF, -1, 1);
  const theta = offset * MAX_BOUNCE_ANGLE;
  const speed = Math.min(ballSpeed(ball) * SPEED_MULT, SPEED_CAP);
  const dir = side === "left" ? 1 : -1;
  return {
    ...ball,
    x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
    vx: dir * speed * Math.cos(theta),
    vy: speed * Math.sin(theta),
    spin: clamp(
      ball.spin + paddle.vy * SPIN_FROM_PADDLE,
      -SPIN_CLAMP,
      SPIN_CLAMP,
    ),
  };
}

function obstacleRect(obstacle: DeepReadonly<ObstacleState>): Rect {
  const spec = OBSTACLES[obstacle.index];
  if (spec) return spec;
  return {
    x0: obstacle.cx - OBSTACLE_W / 2,
    x1: obstacle.cx + OBSTACLE_W / 2,
    y0: obstacle.cy - OBSTACLE_H / 2,
    y1: obstacle.cy + OBSTACLE_H / 2,
  };
}

function stepBall(
  state: DeepReadonly<CaromState>,
  ball: BallState,
  dt: number,
): { readonly ball: BallState; readonly events: FrameEvents } {
  const events: FrameEvents = {
    wall: false,
    paddle: false,
    obstacle: false,
    score: false,
  };
  const startSpeed = ballSpeed(ball);
  const steps = Math.max(1, Math.ceil((startSpeed * dt) / MAX_SUBSTEP));
  let next = ball;
  const h = dt / steps;

  for (let i = 0; i < steps; i += 1) {
    const speed = ballSpeed(next);
    if (speed > 0) {
      const angle = (next.spin / speed) * h;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      next = {
        ...next,
        vx: next.vx * cos - next.vy * sin,
        vy: next.vx * sin + next.vy * cos,
      };
    }
    next = {
      ...next,
      spin: next.spin * 0.5 ** (h / SPIN_HALFLIFE),
      x: next.x + next.vx * h,
      y: next.y + next.vy * h,
    };

    if (next.y - BALL_R < 0 && next.vy < 0) {
      next = { ...next, y: BALL_R, vy: -next.vy };
      events.wall = true;
    } else if (next.y + BALL_R > FIELD_H && next.vy > 0) {
      next = { ...next, y: FIELD_H - BALL_R, vy: -next.vy };
      events.wall = true;
    }

    const left = resolveRect(next, paddleRect("left", state.paddles.left.cy));
    if (left.face) {
      if (left.face === "left" || left.face === "right") {
        next = paddleBounce(left.ball, "left", state.paddles.left);
        events.paddle = true;
      } else {
        next = left.ball;
        events.wall = true;
      }
    } else {
      next = left.ball;
    }

    const right = resolveRect(
      next,
      paddleRect("right", state.paddles.right.cy),
    );
    if (right.face) {
      if (right.face === "left" || right.face === "right") {
        next = paddleBounce(right.ball, "right", state.paddles.right);
        events.paddle = true;
      } else {
        next = right.ball;
        events.wall = true;
      }
    } else {
      next = right.ball;
    }

    for (const obstacle of state.obstacles) {
      const resolved = resolveRect(next, obstacleRect(obstacle));
      if (resolved.face) events.obstacle = true;
      next = resolved.ball;
    }
  }

  return { ball: next, events };
}

function appendTrail(ball: BallState, simTime: number): BallState {
  const trail = [...ball.trail, { x: ball.x, y: ball.y, t: simTime }].filter(
    (sample) => simTime - sample.t <= TRAIL_TIME,
  );
  return { ...ball, trail };
}

function serveBall(ball: BallState, receiver: Side): BallState {
  const dir = receiver === "left" ? -1 : 1;
  return {
    ...ball,
    held: false,
    holdTimer: 0,
    trail: [],
    vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
    vy: ball.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
  };
}

function winningSide(score: {
  readonly p1: number;
  readonly p2: number;
}): Side | null {
  if (score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD) return "left";
  if (score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD) return "right";
  return null;
}

function advanceMatch(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): CaromState {
  const next = movePaddles(state, api, dt);
  if (!next.ball) return next;

  if (next.screen === "countdown") {
    const holdTimer = Math.max(0, next.ball.holdTimer - dt);
    if (holdTimer <= 1e-9) {
      return {
        ...next,
        screen: "playing",
        ball: serveBall({ ...next.ball, holdTimer }, next.receiver),
      };
    }
    const heldBall = appendTrail(
      {
        ...next.ball,
        x: FIELD_CX,
        y: FIELD_CY,
        vx: 0,
        vy: 0,
        spin: 0,
        held: true,
        holdTimer,
      },
      next.simTime,
    );
    return { ...next, ball: heldBall };
  }

  if (next.screen !== "playing" || next.ball.held) return next;

  const stepped = stepBall(next, next.ball, dt);
  let ball = appendTrail(stepped.ball, next.simTime);
  if (stepped.events.wall) api.audio.play(CUES.wallBounce);
  if (stepped.events.paddle) api.audio.play(CUES.paddleHit);
  if (stepped.events.obstacle) api.audio.play(CUES.obstacleBounce);

  let score = next.score;
  let receiver = next.receiver;
  let screen: Screen = next.screen;
  let winner = next.winner;
  let menuIndex = next.menuIndex;

  if (ball.x - BALL_R > FIELD_W) {
    score = { p1: next.score.p1 + 1, p2: next.score.p2 };
    receiver = "right";
    stepped.events.score = true;
  } else if (ball.x + BALL_R < 0) {
    score = { p1: next.score.p1, p2: next.score.p2 + 1 };
    receiver = "left";
    stepped.events.score = true;
  }

  if (stepped.events.score) {
    api.audio.play(CUES.score);
    winner = winningSide(score);
    if (winner) {
      screen = "matchover";
      menuIndex = 0;
    } else {
      screen = "countdown";
      ball = parkedBall();
    }
  }

  return { ...next, score, receiver, screen, winner, menuIndex, ball };
}

function updateMuted(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  mutePressed: boolean,
): boolean {
  if (mutePressed) api.audio.setMuted(!api.audio.muted());
  else if (api.audio.muted() !== state.muted) api.audio.setMuted(state.muted);
  return api.audio.muted();
}

function snapshot(state: DeepReadonly<CaromState>): CaromSnapshot {
  return {
    version: CAROM_DEBUG_VERSION,
    screen: state.screen,
    mode: state.mode,
    menuIndex: state.menuIndex,
    titleIndex: state.titleIndex,
    resumeScreen: state.resumeScreen,
    score: { p1: state.score.p1, p2: state.score.p2 },
    winner: state.winner,
    muted: state.muted,
    paddles: {
      left: { ...state.paddles.left },
      right: { ...state.paddles.right },
    },
    ai: { ...state.ai },
    receiver: state.receiver,
    ball: state.ball
      ? {
          ...state.ball,
          speed: ballSpeed(state.ball),
          trail: [...state.ball.trail],
        }
      : null,
    obstacles: state.obstacles.map((o) => ({ ...o })),
    simTime: state.simTime,
  };
}

function requireBall(state: DeepReadonly<CaromState>): BallState {
  if (!state.ball) throw new Error("Carom debug: no ball is present");
  return {
    ...state.ball,
    trail: state.ball.trail.map((sample) => ({ ...sample })),
  };
}

function withBall(
  state: DeepReadonly<CaromState>,
  updater: (ball: BallState) => BallState,
): CaromState {
  return { ...copyState(state), ball: updater(requireBall(state)) };
}

function withPaddle(
  state: DeepReadonly<CaromState>,
  side: Side,
  updater: (paddle: DeepReadonly<PaddleState>) => PaddleState,
): CaromState {
  return {
    ...copyState(state),
    paddles: { ...state.paddles, [side]: updater(state.paddles[side]) },
  };
}

function spawnObstacleIn(
  state: DeepReadonly<CaromState>,
  index: number,
): CaromState {
  const center: Point | undefined = OBSTACLE_CENTERS[index];
  if (!center) throw new Error(`Carom debug: obstacle ${index} does not exist`);
  const obstacles = state.obstacles.filter((o) => o.index !== index);
  return {
    ...copyState(state),
    obstacles: [...obstacles, { index, cx: center.x, cy: center.y }].sort(
      (a, b) => a.index - b.index,
    ),
  };
}

function makeDebug(): CaromDebugApi {
  return {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (state) => ({ ...copyState(state), ball: null, obstacles: [] }),
    spawnBall: (state) => ({ ...copyState(state), ball: parkedBall() }),
    spawnObstacle: spawnObstacleIn,
    reset: (state) => titleState(state.muted),
    reconcile: copyState,
    setScreen: (state, screen) => ({ ...copyState(state), screen }),
    setMode: (state, mode) => ({ ...copyState(state), mode }),
    setMenuIndex: (state, menuIndex) => ({ ...copyState(state), menuIndex }),
    setTitleIndex: (state, titleIndex) => ({ ...copyState(state), titleIndex }),
    setResumeScreen: (state, resumeScreen) => ({
      ...copyState(state),
      resumeScreen,
    }),
    setScore: (state, p1, p2) => ({ ...copyState(state), score: { p1, p2 } }),
    setWinner: (state, winner) => ({ ...copyState(state), winner }),
    setReceiver: (state, receiver) => ({ ...copyState(state), receiver }),
    setPaddleCy: (state, side, cy) =>
      withPaddle(state, side, (paddle) => ({
        ...paddle,
        cy: finite(cy, paddle.cy),
      })),
    setPaddleVy: (state, side, vy) =>
      withPaddle(state, side, (paddle) => ({
        ...paddle,
        drivenVy: finite(vy),
      })),
    setPaddleDriven: (state, side, driven) =>
      withPaddle(state, side, (paddle) => ({ ...paddle, driven })),
    setBallPosition: (state, x, y) =>
      withBall(state, (ball) => ({
        ...ball,
        x: finite(x, ball.x),
        y: finite(y, ball.y),
      })),
    setBallVelocity: (state, vx, vy) =>
      withBall(state, (ball) => ({ ...ball, vx: finite(vx), vy: finite(vy) })),
    setBallSpin: (state, spin) =>
      withBall(state, (ball) => ({ ...ball, spin: finite(spin) })),
    setBallHeld: (state, held) =>
      withBall(state, (ball) => ({ ...ball, held })),
    setBallHoldTimer: (state, seconds) =>
      withBall(state, (ball) => ({
        ...ball,
        holdTimer: Math.max(0, finite(seconds)),
      })),
    setBallServeSign: (state, sign) =>
      withBall(state, (ball) => ({ ...ball, serveSign: sign === -1 ? -1 : 1 })),
    drawBallServeSign: (state) =>
      withBall(state, (ball) => ({ ...ball, serveSign: randServeSign() })),
    setAiTracking: (state, tracking) => ({
      ...copyState(state),
      ai: { ...state.ai, tracking },
    }),
    setAiMovement: (state, movement) => ({
      ...copyState(state),
      ai: { ...state.ai, movement },
    }),
    setMuted: (state, muted) => ({ ...copyState(state), muted }),
    snapshot,
    menuItemRect: (state, index) => menuRectFor(state.screen, index),
  };
}

function registerDiagnostics(api: InitApi<CaromState>): void {
  api.diagnostics.register("screen", (s) => s.screen);
  api.diagnostics.register("mode", (s) => s.mode);
  api.diagnostics.register("score", (s) => `${s.score.p1}-${s.score.p2}`);
  api.diagnostics.register("ball", (s) =>
    s.ball ? `${s.ball.x.toFixed(1)}, ${s.ball.y.toFixed(1)}` : "none",
  );
  api.diagnostics.register("ball v", (s) =>
    s.ball ? `${s.ball.vx.toFixed(1)}, ${s.ball.vy.toFixed(1)}` : "none",
  );
  api.diagnostics.register("ball speed", (s) =>
    s.ball ? ballSpeed(s.ball) : 0,
  );
  api.diagnostics.register("ball spin", (s) => (s.ball ? s.ball.spin : 0));
  api.diagnostics.register(
    "left paddle",
    (s) => `${s.paddles.left.cy.toFixed(1)} / ${s.paddles.left.vy.toFixed(1)}`,
  );
  api.diagnostics.register(
    "right paddle",
    (s) =>
      `${s.paddles.right.cy.toFixed(1)} / ${s.paddles.right.vy.toFixed(1)}`,
  );
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function drawFieldFurniture(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
  dim = false,
): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  ctx.save();
  ctx.globalAlpha = dim ? 0.38 : 1;
  ctx.strokeStyle = "rgba(237,247,255,0.22)";
  ctx.lineWidth = 3;
  ctx.setLineDash([16, 18]);
  ctx.beginPath();
  ctx.moveTo(NET_X, 36);
  ctx.lineTo(NET_X, FIELD_H - 36);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const obstacle of state.obstacles) {
    ctx.fillStyle = OBSTACLE_COLOR;
    ctx.shadowColor = OBSTACLE_COLOR;
    ctx.shadowBlur = 16;
    drawRoundRect(
      ctx,
      obstacle.cx - OBSTACLE_W / 2,
      obstacle.cy - OBSTACLE_H / 2,
      OBSTACLE_W,
      OBSTACLE_H,
      10,
    );
  }
  ctx.shadowBlur = 0;

  ctx.fillStyle = P1_COLOR;
  drawRoundRect(
    ctx,
    P1_X0,
    state.paddles.left.cy - PADDLE_HALF,
    PADDLE_W,
    PADDLE_H,
    8,
  );
  ctx.fillStyle = P2_COLOR;
  drawRoundRect(
    ctx,
    P2_X0,
    state.paddles.right.cy - PADDLE_HALF,
    PADDLE_W,
    PADDLE_H,
    8,
  );

  if (state.ball) {
    if (state.ball.trail.length > 1) {
      ctx.lineWidth = BALL_R * 1.25;
      ctx.lineCap = "round";
      for (let i = 1; i < state.ball.trail.length; i += 1) {
        const a = state.ball.trail[i - 1];
        const b = state.ball.trail[i];
        ctx.globalAlpha = (i / state.ball.trail.length) * (dim ? 0.22 : 0.58);
        ctx.strokeStyle = BALL_COLOR;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = dim ? 0.38 : 1;
    }
    ctx.fillStyle = BALL_COLOR;
    ctx.shadowColor = BALL_COLOR;
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, BALL_R, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawHud(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "700 54px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(state.score.p1), FIELD_CX - 160, 76);
  ctx.fillText(String(state.score.p2), FIELD_CX + 160, 76);
  ctx.font = "600 18px Inter, system-ui, sans-serif";
  ctx.fillStyle = DIM_TEXT;
  ctx.fillText(
    state.mode === "solo" ? "SOLO DUEL" : "VERSUS DUEL",
    FIELD_CX,
    38,
  );
}

function drawMenu(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  const items = menuItems(state.screen);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < items.length; i += 1) {
    const rect = menuRectFor(state.screen, i);
    if (!rect) continue;
    const active = i === state.menuIndex;
    ctx.fillStyle = active
      ? "rgba(249,248,113,0.18)"
      : "rgba(237,247,255,0.06)";
    ctx.strokeStyle = active ? BALL_COLOR : "rgba(237,247,255,0.18)";
    ctx.lineWidth = active ? 3 : 1;
    drawRoundRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
    ctx.stroke();
    ctx.fillStyle = active ? TEXT_COLOR : DIM_TEXT;
    ctx.font = "700 24px Inter, system-ui, sans-serif";
    ctx.fillText(items[i], rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
  }
}

function drawTitle(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  drawFieldFurniture(ctx, state, true);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "900 104px Inter, system-ui, sans-serif";
  ctx.fillText(TITLE_TEXT, FIELD_CX, 198);
  ctx.fillStyle = DIM_TEXT;
  ctx.font = "500 24px Inter, system-ui, sans-serif";
  ctx.fillText("Spin the rally. Bend the bank shot.", FIELD_CX, 280);
  drawMenu(ctx, state);
}

function drawHowTo(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  drawFieldFurniture(ctx, state, true);
  ctx.fillStyle = PANEL;
  drawRoundRect(ctx, 250, 92, 780, 430, 8);
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "800 46px Inter, system-ui, sans-serif";
  ctx.fillText("HOW TO PLAY", FIELD_CX, 126);
  ctx.font = "500 24px Inter, system-ui, sans-serif";
  ctx.fillStyle = "#c7d7e9";
  const lines = [
    "W/S move the left paddle. Arrow keys move the right paddle in Versus.",
    "In Solo, either side of the keyboard steers player one against the AI.",
    "Strike while moving to load spin; the ball curves as that spin decays.",
    "Use the center posts for bank shots. First to 11, win by 2.",
    "P or Escape pauses. M toggles sound.",
  ];
  lines.forEach((line, index) =>
    ctx.fillText(line, FIELD_CX, 214 + index * 48),
  );
  drawMenu(ctx, state);
}

function drawPause(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  drawFieldFurniture(ctx, state, true);
  drawHud(ctx, state);
  ctx.fillStyle = PANEL;
  drawRoundRect(ctx, 418, 172, 444, 386, 8);
  ctx.textAlign = "center";
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "800 54px Inter, system-ui, sans-serif";
  ctx.fillText("PAUSED", FIELD_CX, 246);
  drawMenu(ctx, state);
}

function drawMatch(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  drawFieldFurniture(ctx, state);
  drawHud(ctx, state);
  if (state.screen === "countdown" && state.ball) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(237,247,255,0.86)";
    ctx.font = "900 72px Inter, system-ui, sans-serif";
    ctx.fillText(
      Math.ceil(state.ball.holdTimer).toString(),
      FIELD_CX,
      FIELD_CY - 86,
    );
  }
}

function drawMatchOver(
  ctx: CanvasRenderingContext2D,
  state: DeepReadonly<CaromState>,
): void {
  drawFieldFurniture(ctx, state, true);
  drawHud(ctx, state);
  ctx.fillStyle = PANEL;
  drawRoundRect(ctx, 356, 130, 568, 460, 8);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "800 50px Inter, system-ui, sans-serif";
  const winner =
    state.winner === "left" ? "PLAYER ONE WINS" : "PLAYER TWO WINS";
  ctx.fillText(winner, FIELD_CX, 214);
  ctx.fillStyle = "#c7d7e9";
  ctx.font = "700 32px Inter, system-ui, sans-serif";
  ctx.fillText(`${state.score.p1}  -  ${state.score.p2}`, FIELD_CX, 278);
  drawMenu(ctx, state);
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    for (const action of ACTIONS)
      api.input.register(action, { keys: [...BINDINGS[action]] });
    api.audio.define(CUES.paddleHit, {
      wave: "square",
      freq: 320,
      freqTo: 520,
      gain: 0.12,
      durationMs: 55,
    });
    api.audio.define(CUES.wallBounce, {
      wave: "triangle",
      freq: 220,
      freqTo: 160,
      gain: 0.1,
      durationMs: 45,
    });
    api.audio.define(CUES.obstacleBounce, {
      wave: "sawtooth",
      freq: 460,
      freqTo: 260,
      gain: 0.1,
      durationMs: 70,
    });
    api.audio.define(CUES.score, {
      wave: "sine",
      freq: 260,
      freqTo: 720,
      gain: 0.14,
      durationMs: 180,
    });
    registerDiagnostics(api);
    return [titleState(false), makeDebug()];
  },

  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    const edges = readEdges(api);
    const muted = updateMuted(state, api, edges.mute);
    const simTime = state.simTime + dt;
    const keyboardConfirmed = edges.confirm;
    let next: CaromState = { ...copyState(state), simTime, muted };
    next = applyMenuKeyboard(next, edges);
    next = { ...next, simTime, muted };
    next = applyPointerMenus(next, api, keyboardConfirmed);
    next = { ...next, simTime, muted };

    if (next.screen === "countdown" || next.screen === "playing") {
      next = advanceMatch(next, api, dt);
      next = { ...next, simTime, muted };
    }
    return next;
  },

  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const ctx = api.ctx;
    ctx.save();
    if (state.screen === "title") drawTitle(ctx, state);
    else if (state.screen === "howto") drawHowTo(ctx, state);
    else if (state.screen === "paused") drawPause(ctx, state);
    else if (state.screen === "matchover") drawMatchOver(ctx, state);
    else drawMatch(ctx, state);
    ctx.restore();
  },
};
