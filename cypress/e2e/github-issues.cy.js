import { faker } from '@faker-js/faker';

const username = Cypress.env('username');
const password = Cypress.env('password');
const baseUrl = 'https://github.com';
const repo = faker.string.alpha(10);
const repoBaseUrl = `${baseUrl}/${username}/${repo}`;
const repoBasePath = `/${username}/${repo}`;

describe('DNAnexus technical github test', () => {

  beforeEach(function() {
    cy.request('https://baconipsum.com/api/?type=meat&paras=4').then((res) => {
      this.response = res;
    });
  });

  it('create repo, gitlab issues and delete repo', function() {
    // 1. visits github
    cy.visit(`${baseUrl}/login`);


    // 2. logs in
    cy.location('pathname').should('equal', '/login');
    cy.get('#login_field').type(username);
    cy.get('#password').type(password);
    cy.get('input[name="commit"]').click();

    cy.location('pathname').should('equal', '/');


    // 3. creates repo
    cy.get('input[placeholder="name your new repository..."]').type(repo);
    cy.get('input[value="private"]').click();
    cy.get('section[aria-label="Start a new repository"] button[type="submit"]').click();

    cy.location('pathname').should('equal', repoBasePath);
    cy.get('#repo-title-component').contains('Private').should('be.visible');
    cy.get('#repo-title-component').contains(repo).should('be.visible');


    // 4. creates 4 issues in new repo
    (this.response.body).forEach(function (issue, i) {
      cy.visit(`${repoBaseUrl}/issues/new`);
      cy.location('pathname').should('equal', `${repoBasePath}/issues/new`);
      cy.get('#issue_title').type((i + 1) + '. Issue');
      cy.get('#issue_body').type(issue, {delay: 0});
      cy.contains('Submit new issue').click();

      cy.location('pathname').should('equal', `${repoBasePath}/issues/${i + 1}`);
      cy.get('.gh-header-show').contains((i + 1) + '. Issue').should('be.visible');
      cy.get('.edit-comment-hide p').should('contain.text', issue);
    });
  })

  after(function() {
    // 5. deletes repo
    cy.visit(`${repoBaseUrl}/settings`);
    cy.location('pathname').should('equal', `${repoBasePath}/settings`);
    cy.get('#dialog-show-repo-delete-menu-dialog').click({force: true});
    cy.get('#repo-delete-menu-dialog').should('be.visible');
    cy.get('#repo-delete-proceed-button').click({force: true});
    cy.get('#repo-delete-proceed-button').click({force: true});
    cy.get('#verification_field').type(`${username}/${repo}`, {force: true});
    cy.get('#repo-delete-proceed-button').click({force: true});
    cy.location('pathname').should('equal', `/${username}`);
  });
})