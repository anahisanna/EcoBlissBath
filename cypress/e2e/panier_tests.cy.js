describe('Tests du Panier', () => {
    beforeEach(() => {
        // Étape 1 : Connexion avant chaque test
        cy.visit('http://localhost:8080');
        cy.get('a[data-cy="nav-link-login"]').click();
        cy.get('input[data-cy="login-input-username"]').type('test2@test.fr');
        cy.get('input[data-cy="login-input-password"]').type('testtest');
        cy.get('button[data-cy="login-submit"]').click();
        cy.url().should('eq', 'http://localhost:8080/#/');
    });

    it('Ajout d’un produit au panier et vérification du contenu', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.get('button[data-cy="product-link"]').first().click();

        // Vérifier que le prix du produit est affiché avant l'ajout
        cy.get('p[data-cy="detail-product-price"]').should('contain', '€');

        // Ajouter le produit au panier
        cy.get('button[data-cy="detail-product-add"]').click();
        cy.get('a[data-cy="nav-link-cart"]').click();

        // Vérifications
        cy.url().should('include', '/cart');
    });


    /* it('Ajout d’un produit hors stock (bug potentiel)', () => {
         cy.get('button[ng-reflect-router-link="/products"]').click();
         cy.get('button[data-cy="product-link"]').first().click();
 
         // Vérifier que le stock contient un nombre négatif
         cy.get('p[data-cy="detail-product-stock"]').should('contain.text', '-');
 
         // Ajouter le produit au panier
         cy.get('button[data-cy="detail-product-add"]').click();
         cy.get('a[data-cy="nav-link-cart"]').click();
     });*/


    it('Validation du panier avec un produit hors stock (bug potentiel)', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.get('button[data-cy="product-link"]').first().click();
        cy.get('button[data-cy="detail-product-add"]').click();
        cy.get('a[data-cy="nav-link-cart"]').click();

        // Valider le panier
        cy.get('button[data-cy="cart-validate"]').click();

        // Vérifier que le panier est vide après validation
        cy.get('a[data-cy="nav-link-cart"]').click();
        cy.contains('Votre panier est vide').should('be.visible');
    });


    /*it('Ajout de plus de 20 produits (bug potentiel)', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.get('button[data-cy="product-link"]').first().click();
   
        // Modifier la quantité à 25 avant d'ajouter au panier
        cy.get('input[data-cy="detail-product-quantity"]').clear().type('25');
        cy.get('button[data-cy="detail-product-add"]').click();
        cy.get('a[data-cy="nav-link-cart"]').click();
   
        // Vérifier que la quantité est bien supérieure à 20 dans le panier
        cy.get('input[data-cy="cart-line-quantity"]').invoke('val').then((val) => {
            expect(parseInt(val)).to.be.greaterThan(20);
        });
    });
   
    it('Ne doit pas permettre l’ajout d’une quantité négative', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.get('button[data-cy="product-link"]').first().click();
        cy.get('input[data-cy="detail-product-quantity"]').clear().type('-1');
        cy.get('button[data-cy="detail-product-add"]').click();
   
        // Vérifier que l’ajout n’a pas eu lieu
        cy.get('a[data-cy="nav-link-cart"]').click();
        cy.contains('Votre panier est vide').should('be.visible');
    });
   
    it('Validation du panier et vérification du vidage après validation', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.get('button[data-cy="product-link"]').first().click();
        cy.get('button[data-cy="detail-product-add"]').click();
        cy.get('a[data-cy="nav-link-cart"]').click();
        cy.get('button[data-cy="cart-validate"]').click();
        cy.contains('Votre panier est vide').should('be.visible');
    });*/
});
