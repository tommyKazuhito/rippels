import TextureImage from '@public/img/115-2560x1440.jpg';
import Controller from '~/abstracts/Controller';
import Ripple from '~/pages/three-class-based/resources/module/Ripple';

export default class ThreeClassBased extends Controller {
  constructor() {
    super('three-class-based');
  }

  protected init() {
    console.log('called init');

    this.createRipple();
  }

  private createRipple() {
    const rootElm = document.getElementById('app');

    if (!rootElm) {
      return;
    }

    const ripple = new Ripple(rootElm, TextureImage);

    ripple.init();

    const tick = () => {
      ripple.render();
      requestAnimationFrame(tick);
    };
    tick();
  }
}

new ThreeClassBased();
