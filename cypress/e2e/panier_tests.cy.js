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

    });


    it('Ajout d’un produit hors stock (bug potentiel)', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.get('button[data-cy="product-link"]').first().click();

        // Vérifier que le stock contient un nombre négatif
        cy.get('p[data-cy="detail-product-stock"]').should('contain.text', '-');

        // Ajouter le produit au panier
        cy.get('button[data-cy="detail-product-add"]').click();
        cy.get('a[data-cy="nav-link-cart"]').click();

    });
    //-----------------------------------------//
    it('Validation du panier avec un produit hors stock (bug potentiel)', () => {

        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.url().should('include', '/#/products');


        cy.get('button[data-cy="product-link"]').first().click();
        cy.url().should('include', '/products/');


        cy.get('p[data-cy="detail-product-stock"]').should('contain.text', '-');


        cy.get('button[data-cy="detail-product-add"]').click();
        cy.get('a[data-cy="nav-link-cart"]').click();
        cy.url().should('include', '/cart');

        cy.get('input[data-cy="cart-input-lastname"]').type('Dupont');
        cy.get('input[data-cy="cart-input-firstname"]').type('Jean');
        cy.get('input[data-cy="cart-input-address"]').type('123 Rue de Paris');
        cy.get('input[data-cy="cart-input-zipcode"]').type('75000');
        cy.get('input[data-cy="cart-input-city"]').type('Paris');

        cy.get('button[data-cy="cart-submit"]').click();
    });

    it('Ajout de plus de 20 produits (bug potentiel)', () => {
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
    })

    it('Ne doit pas permettre la saisie d’une quantité négative', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.get('button[data-cy="product-link"]').first().click();

        //Essayer d'entrer une quantité négative
        cy.get('input[data-cy="detail-product-quantity"]').clear().type('-1');

        //Tenter d’ajouter au panier
        cy.get('button[data-cy="detail-product-add"]').click();

    });

    it('Validation du panier après remplissage du formulaire et vérification du vidage', () => {
        // Étape 1 : Aller à la page Produits et ajouter un produit au panier
        cy.get('button[ng-reflect-router-link="/products"]').click(); // Aller à la page Produits
        cy.get('button[data-cy="product-link"]').first().click(); // Sélectionner le premier produit
        cy.get('button[data-cy="detail-product-add"]').click(); // Ajouter au panier
        cy.get('a[data-cy="nav-link-cart"]').click(); // Aller au panier
        cy.url().should('include', '/cart'); // Vérifier qu'on est bien sur la page du panier

        // Étape 2 : Remplir le formulaire de commande
        cy.get('input[data-cy="cart-input-lastname"]').type('Dupont');
        cy.get('input[data-cy="cart-input-firstname"]').type('Jean');
        cy.get('input[data-cy="cart-input-address"]').type('123 Rue de Paris');
        cy.get('input[data-cy="cart-input-zipcode"]').type('75000');
        cy.get('input[data-cy="cart-input-city"]').type('Paris');

        // Étape 3 : Valider la commande
        cy.get('button[data-cy="cart-submit"]').should('be.visible').click(); // Cliquer sur "Validez votre commande"

        /// Étape 4 : Revenir à la page du panier
        cy.get('a[data-cy="nav-link-cart"]').should('be.visible').click(); // Cliquer sur "Mon panier"
        cy.url().should('include', '/cart'); // Vérifier qu'on est bien sur la page du panier

        // Étape 4 : Vérifier le message affiché après validation
        cy.get('p').should('contain.text', 'Votre commande est bien validée');
        cy.get('p').should('contain.text', 'Laissez-nous un avis !');
    });
});

