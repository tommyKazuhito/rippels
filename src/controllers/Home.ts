import Controller from '~/abstracts/Controller';

export default class Home extends Controller {
  constructor() {
    super('home');
  }

  protected init() {
    console.log('called init');
  }
}

new Home();
