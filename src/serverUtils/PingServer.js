export default class PingServer {
  averageTenLatencies = [];
  latency = null;
  startTime = null;

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
    this.latency = null;
    this.averageTenLatencies = [];
    this.callback(0, 0);
    this.pingChannel();
  }

  pingChannel() {
    const { ip, port } = this;
    const stubImage = new Image();

    this.startTime = Date.now();
    stubImage.onload = () => {
      this.updateResponseTime();
    };
    stubImage.onerror = () => {
      this.updateResponseTime();
      // the image will always throw cross origin error
      // hacky way to remove it
      console.clear();
    };

    stubImage.src = `http://${ip}:${port}/?cachebreaker=${Date.now()}`;
  }
}
