import StatsJs from 'stats-js';

class Stats {
  instance: StatsJs;

  private id = 0;

  constructor() {
    this.instance = new StatsJs();

    this.monitor = this.monitor.bind(this);

    this.init();
  }

  private init() {
    Object.assign(this.instance.dom.style, {
      position: 'fixed',
      height: 'max-content',
      top: 'auto',
      bottom: '0',
    });

    document.body.appendChild(this.instance.dom);
  }

  monitor() {
    this.instance.begin();
    this.instance.end();

    this.id = requestAnimationFrame(this.monitor);
  }

  start() {
    this.id = requestAnimationFrame(this.monitor);
  }

  destroy() {
    if (this.id) {
      cancelAnimationFrame(this.id);
    }

    document.body.removeChild(this.instance.dom);
  }
}

export default Stats;
