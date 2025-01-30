describe('Tests de Connexion', () => {
    beforeEach(() => {
        // Étape 1 : Visiter la page d'accueil et accéder à la page de connexion
        cy.visit('http://localhost:8080');
        cy.get('a[data-cy="nav-link-login"]').should('be.visible').click();
        cy.url().should('include', '/#/login');
    });

    it('Connexion réussie avec un utilisateur valide', () => {
        // Étape 2 : Saisie des identifiants valides
        cy.get('input[data-cy="login-input-username"]').type('test2@test.fr');
        cy.get('input[data-cy="login-input-password"]').type('testtest');
        cy.get('button[data-cy="login-submit"]').click();

        // Vérifier que l'utilisateur est redirigé vers l'accueil après connexion
        cy.url().should('eq', 'http://localhost:8080/#/');

    });

    it('Connexion échouée avec un utilisateur invalide', () => {
        // Étape 2 : Saisie des identifiants invalides
        cy.get('input[data-cy="login-input-username"]').type('fakeuser@test.fr');
        cy.get('input[data-cy="login-input-password"]').type('wrongpassword');
        cy.get('button[data-cy="login-submit"]').click();

        // Vérifier qu'un message d'erreur s'affiche
        cy.get('p[data-cy="login-errors"]').should('contain.text', 'Identifiants incorrects');
    });

    it('Connexion avec un champ vide', () => {
        // Étape 2 : Ne pas remplir les champs et essayer de se connecter
        cy.get('button[data-cy="login-submit"]').click();

        // Vérifier qu'un message d'erreur apparaît pour chaque champ manquant
        cy.get('input[data-cy="login-input-username"]').should('have.class', 'ng-invalid');
        cy.get('input[data-cy="login-input-password"]').should('have.class', 'ng-invalid');
    });


});
