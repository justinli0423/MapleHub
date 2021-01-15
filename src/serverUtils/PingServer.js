export default class PingServer {
  averageTenLatencies = [];
  latency = null;
  startTime = null;
  timer = null;

  constructor(id, ip, port, threshold, callback) {
    this.id = id;
    this.ip = ip;
    this.port = port;
    this.threshold = threshold;
    this.callback = callback;
  }

  updateResponseTime(isFailedConnection = false) {
    const { startTime, averageTenLatencies } = this;
    this.latency = isFailedConnection ? Infinity : Date.now() - startTime;

    if (averageTenLatencies.length >= 10) {
      averageTenLatencies.shift();
      averageTenLatencies.push(this.latency);
    } else {
      averageTenLatencies.push(this.latency);
    }

    this.callback(this.latency, averageTenLatencies);
  }

  unmount() {
    clearTimeout(this.timer);
  }

  pingChannel() {
    const { ip, port, threshold } = this;
    const stubImage = new Image();

    if (this.timer) {
      clearTimeout(this.timer);
    }

    stubImage.onload = () => {
      this.updateResponseTime();
      clearTimeout(this.timer);
    };
    stubImage.onerror = () => {
      this.updateResponseTime();
      // the image will always throw cross origin error
      // hacky way to remove it
      console.clear();
      clearTimeout(this.timer);
    };

    this.startTime = Date.now();
    stubImage.src = `http://${ip}:${port}/?cachebreaker=${Date.now()}`;
    this.timer = setTimeout(() => {
      // give a max wait time of 2x threshold
      // pass latency as infinity
      this.updateResponseTime(true);
    }, threshold * 2);
  }
}
