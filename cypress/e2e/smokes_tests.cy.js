describe('Smoke Tests - Vérifications des éléments essentiels du site', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080');
    });

    // 🟢 Vérification des champs et boutons de connexion
    it('Vérification des éléments de la page de connexion', () => {
        cy.get('a[data-cy="nav-link-login"]').click();
        cy.url().should('include', '/#/login');

        // Vérifier la présence des champs et boutons
        cy.get('input[data-cy="login-input-username"]').should('be.visible');
        cy.get('input[data-cy="login-input-password"]').should('be.visible');
        cy.get('button[data-cy="login-submit"]').should('be.visible');
    });

    it('Vérification de la présence des boutons "Ajouter au panier"', () => {
        // Aller à la page des produits
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.url().should('include', '/#/products');

        // Vérifier qu'il y a au moins un produit avec un bouton "Ajouter au panier"
        cy.get('button[data-cy="product-link"]').first().click(); // Sélectionner un produit
        cy.url().should('include', '/products/');

        // Vérifier que le bouton "Ajouter au panier" est bien visible et cliquable
        cy.get('button[data-cy="detail-product-add"]').should('be.visible');
    });

    //  Vérification de la disponibilité du stock
    it('Vérification du champ de disponibilité du produit', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.url().should('include', '/#/products');

        // Sélectionner un produit
        cy.get('button[data-cy="product-link"]').first().click();
        cy.url().should('include', '/products/');

        // Vérifier la présence du champ de stock
        cy.get('p[data-cy="detail-product-stock"]').should('be.visible')
            .and('not.contain.text', '-'); // S'assurer que le stock ne soit pas négatif
    });

});
