export const generatePipeHeight = (min=100, max=570) => (Math.floor(Math.random() * (max - min + 1)) + min) / 2;


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
