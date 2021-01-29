export default class PingServer {
  averageTenLatencies = [];
  latency = null;
  startTime = null;
  timer = null;

  constructor(id, ip, port, callback) {
    this.id = id;
    this.ip = ip;
    this.port = port;
    this.callback = callback;
  }

  updateResponseTime() {
    const { startTime, averageTenLatencies } = this;
    this.latency = Date.now() - startTime;

    if (averageTenLatencies.length >= 10) {
      averageTenLatencies.shift();
      averageTenLatencies.push(this.latency);
    } else {
      averageTenLatencies.push(this.latency);
    }

    this.callback(this.latency, averageTenLatencies);
  }

  updateServerDomains(id, ip, port) {
    this.id = id;
    this.ip = ip;
    this.port = port;
    this.latency = 0;
    this.averageTenLatencies = [];
    this.pingChannel();
  }

  unmount() {
    clearTimeout(this.timer);
  }

  pingChannel() {
    const { ip, port } = this;
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
  }
}
