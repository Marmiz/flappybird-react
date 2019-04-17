export const generateRandomEase = (min=80, max = 100) => (Math.floor(Math.random() * (max - min + 1)) + min);

export const generateBotHeight = (min=240, max=480) => (Math.floor(Math.random() * (max - min + 1)) + min);


export const generatePipePairs = () => {
  const botH = generateBotHeight();
  const ease = generateRandomEase();


  const topH = (720 - 50 - ease - botH);
  return [botH, topH, ease];
}


export const initialState = {
  gameRunning: false,
  minTop: 0,
  maxBot: 670,
  top: 60,
  velocity: 16,
  deltaTop: 0,
  jumpDistance: -5,
  timerId : undefined,
  pipes: [],
  scorePipe: false,
  score: 0,
};

export const recordAnimationFrames = (callback) => {
  let fps = 60,
  interval = 1000/fps,
  lastTime = new Date().getTime(),
  currentTime = 0,
  delta = 0,
    running = true,
    raf;
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };
  const start = () => {
    running = true;
    run();
  };
  const run = () => {
    raf = requestAnimationFrame(() => {
      currentTime = new Date().getTime();
      delta = (currentTime - lastTime)
      if(delta > interval) {
        callback();
      }
      lastTime = currentTime - (delta % interval);
      if (running) run();
    });
  };
  start();
  return { start, stop };
};
