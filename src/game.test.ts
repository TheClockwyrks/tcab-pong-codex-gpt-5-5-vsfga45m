import { createCanvas } from "@napi-rs/canvas";
import {
  ConstantClock,
  createEngine,
  type SurfaceMetrics,
} from "@clockwyrks/simple-2d";
import { describe, expect, it } from "vitest";
import {
  BALL_R,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  P1_X1,
  P2_X0,
  SERVE_SPEED,
  SPEED_MULT,
} from "./constants";
import { BACKGROUND, game, type CaromDebugApi, type CaromState } from "./game";

function makeEngine(stepMs = 16) {
  const canvas = createCanvas(FIELD_W, FIELD_H) as unknown as HTMLCanvasElement;
  const events = new EventTarget();
  const surface: SurfaceMetrics = {
    cssWidth: () => FIELD_W,
    cssHeight: () => FIELD_H,
    dpr: () => 1,
    events: () => events,
  };
  return createEngine<CaromState, CaromDebugApi>({
    canvas,
    width: FIELD_W,
    height: FIELD_H,
    game,
    background: BACKGROUND,
    clock: new ConstantClock(stepMs),
    surface,
  });
}

describe("Carom simulation", () => {
  it("initializes the title state and debug snapshot", async () => {
    const engine = makeEngine();
    await engine.initialize();

    const snap = engine.debug.snapshot(engine.state);

    expect(snap.version).toBe(1);
    expect(snap.screen).toBe("title");
    expect(snap.mode).toBe("solo");
    expect(snap.ball?.held).toBe(true);
    expect(snap.ball?.x).toBe(FIELD_W / 2);
    expect(snap.obstacles).toHaveLength(2);
    expect(engine.debug.menuItemRect(engine.state, 0)).toMatchObject({
      w: 360,
      h: 58,
    });
    expect(engine.diagnostics().map((reading) => reading.name)).toContain(
      "ball speed",
    );
  });

  it("serves after the countdown expires", async () => {
    const engine = makeEngine(100);
    await engine.initialize();
    engine.apply((state) => engine.debug.setBallServeSign(state, 1));
    engine.apply((state) => engine.debug.setScreen(state, "countdown"));

    await engine.advance(Math.ceil((HOLD_TIME * 1000) / 100));
    const snap = engine.debug.snapshot(engine.state);

    expect(snap.screen).toBe("playing");
    expect(snap.ball?.held).toBe(false);
    expect(snap.ball?.speed).toBeCloseTo(SERVE_SPEED, 5);
    expect(snap.ball?.vx).toBeLessThan(0);
    expect(snap.ball?.vy).toBeGreaterThan(0);
  });

  it("adds spin from a driven paddle hit", async () => {
    const engine = makeEngine(8);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setPaddleDriven(state, "left", true));
    engine.apply((state) => engine.debug.setPaddleVy(state, "left", 360));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, P1_X1 + BALL_R + 2, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, -520, 0));
    engine.apply((state) => engine.debug.setBallHeld(state, false));

    await engine.advance(2);
    const ball = engine.debug.snapshot(engine.state).ball;

    expect(ball?.vx).toBeGreaterThan(0);
    expect(ball?.speed).toBeGreaterThan(520 * SPEED_MULT - 1);
    expect(ball?.spin).toBeGreaterThan(0);
  });

  it("scores points and parks the next serve", async () => {
    const engine = makeEngine(16);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, FIELD_W + BALL_R + 1, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, 100, 0));
    engine.apply((state) => engine.debug.setBallHeld(state, false));

    await engine.advance(1);
    const snap = engine.debug.snapshot(engine.state);

    expect(snap.score).toEqual({ p1: 1, p2: 0 });
    expect(snap.receiver).toBe("right");
    expect(snap.screen).toBe("countdown");
    expect(snap.ball?.held).toBe(true);
    expect(snap.ball?.trail).toHaveLength(0);
  });

  it("clears and respawns debug world entities", async () => {
    const engine = makeEngine();
    await engine.initialize();

    engine.apply((state) => engine.debug.clearWorld(state));
    expect(engine.debug.snapshot(engine.state).ball).toBeNull();
    expect(engine.debug.snapshot(engine.state).obstacles).toHaveLength(0);

    engine.apply((state) => engine.debug.spawnBall(state));
    engine.apply((state) => engine.debug.spawnObstacle(state, 1));
    const snap = engine.debug.snapshot(engine.state);

    expect(snap.ball?.y).toBe(FIELD_CY);
    expect(snap.obstacles).toEqual([{ index: 1, cx: P2_X0 - 426, cy: 500 }]);
    expect(() =>
      engine.apply((state) =>
        engine.debug.setBallPosition(
          engine.debug.clearWorld(state),
          FIELD_W / 2,
          FIELD_H / 2,
        ),
      ),
    ).toThrow(/no ball/);
  });
});
