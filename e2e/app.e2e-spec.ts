import { TcuFirebasePage } from './app.po';

describe('tcu-firebase App', () => {
  let page: TcuFirebasePage;

  beforeEach(() => {
    page = new TcuFirebasePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
