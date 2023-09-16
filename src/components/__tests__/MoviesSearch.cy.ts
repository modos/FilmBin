// @ts-ignore
import MoviesSearch from "../moviesPanel/MoviesSearch.vue";

describe('<MoviesSearch />', () => {
  it('renders', () => {
    cy.mount(MoviesSearch);
  });
  it('check input placeholder', () => {
    cy.mount(MoviesSearch);
    cy.get('input[placeholder="نام فیلم،سریال،بازیگر یا کارگردان رو جستجو کنید..."]');
  });
});