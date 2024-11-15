export default abstract class Controller {
  readonly pageName: string;

  protected html = document.documentElement;

  protected body = document.body;

  protected main = document.getElementById('main')!;

  protected htmlClassList = document.documentElement.classList;

  protected bodyClassList = document.body.classList;

  constructor(pageName: string) {
    this.pageName = pageName;

    import('~/utilities/browser').then((module) => {
      this.init();
    });
  }

  protected abstract init(): void;
}
