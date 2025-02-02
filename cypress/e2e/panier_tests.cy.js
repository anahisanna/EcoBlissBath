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
    it('BUG: L’ajout d’un produit hors stock NE DOIT PAS ÊTRE POSSIBLE', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.get('button[data-cy="product-link"]').first().click();

        // Vérifier que le stock est négatif
        cy.get('p[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
            const stockNumber = parseInt(stockText.match(/-?\d+/)[0]); // Extraction du nombre
            expect(stockNumber).to.be.lte(0); // Vérifier que le produit est en rupture

            // Essayer d'ajouter au panier
            cy.get('button[data-cy="detail-product-add"]').click();
            cy.get('a[data-cy="nav-link-cart"]').click();

            // Vérifier que le produit NE DOIT PAS être ajouté
            cy.get('p[data-cy="cart-product-name"]').should('not.exist'); // L’article ne doit pas apparaître dans le panier
        });
    }); /*verifier*/

    //-----------------------------------------//

    it('Validation du panier avec un produit hors stock', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.get('button[data-cy="product-link"]').first().click();

        // Vérifier que le produit est en rupture de stock (stock ≤ 0)
        cy.get('p[data-cy="detail-product-stock"]').invoke('text').then((stockText) => {
            const stock = parseInt(stockText.replace(/\D/g, ''), 10); // Extraire le nombre du texte
            expect(stock).to.be.lte(0); // Vérifie que le stock est bien ≤ 0 (rupture de stock)

            // Ajouter le produit hors stock au panier
            cy.get('button[data-cy="detail-product-add"]').click();
            cy.get('a[data-cy="nav-link-cart"]').click();
            cy.url().should('include', '/cart');

            // Remplir le formulaire de commande
            cy.get('input[data-cy="cart-input-lastname"]').type('Dupont');
            cy.get('input[data-cy="cart-input-firstname"]').type('Jean');
            cy.get('input[data-cy="cart-input-address"]').type('123 Rue de Paris');
            cy.get('input[data-cy="cart-input-zipcode"]').type('75000');
            cy.get('input[data-cy="cart-input-city"]').type('Paris');

            // Tenter de valider la commande
            cy.get('button[data-cy="cart-submit"]').click();

            // Vérifier si la validation a été acceptée
            cy.url().then((currentUrl) => {
                if (!currentUrl.includes('/cart')) {
                    throw new Error('BUG:L’application a validé une commande avec un produit hors stock');
                }
            });
        });
    });


    it('Ne doit pas permettre l’ajout de plus de 20 produits', () => {
        cy.get('button[ng-reflect-router-link="/products"]').click();
        cy.get('button[data-cy="product-link"]').first().click();

        // Modifier la quantité à 25 avant d'ajouter au panier
        cy.get('input[data-cy="detail-product-quantity"]').clear().type('25');
        cy.get('button[data-cy="detail-product-add"]').click();

        // Vérifier qu’un message d’erreur s’affiche ou que la quantité est limitée à 20
        cy.get('input[data-cy="cart-line-quantity"]').invoke('val').then((val) => {
            expect(parseInt(val)).to.be.lte(20); // La quantité ne doit jamais dépasser 20
        });

    });


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

