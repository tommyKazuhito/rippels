import Controller from '~/abstracts/Controller';

export default class ReplaceJqueryRipples extends Controller {
  constructor() {
    super('three-class-based');
  }

  protected init() {
    console.log('called init');

    this.createRipple();
  }

  private createRipple() {}
}

new ReplaceJqueryRipples();
