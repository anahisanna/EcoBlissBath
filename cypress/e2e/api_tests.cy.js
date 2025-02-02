describe('Tests API - EcoBlissBath', () => {
    const baseUrl = 'http://localhost:8081';

    // TESTS GET
    describe('Tests API GET - Vérification des endpoints', () => {
        it('Récupération de la liste des produits', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/products`,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.be.an('array');
                expect(response.body.length).to.be.greaterThan(0);
            });
        });

        it('Récupération d’un produit spécifique', () => {
            const productId = 3;
            cy.request({
                method: 'GET',
                url: `${baseUrl}/products/${productId}`,
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('id', productId);
                expect(response.body).to.have.property('name');
            });
        });

        it('Requête non autorisée sur /orders (401 attendu)', () => {
            cy.request({
                method: 'GET',
                url: `${baseUrl}/orders`,
                failOnStatusCode: false,
            }).then((response) => {
                expect(response.status).to.eq(401);
            });
        });
    });

    // TESTS POST
    describe('Tests API POST - Authentification', () => {
        it('Connexion réussie avec un utilisateur valide', () => {
            cy.request({
                method: 'POST',
                url: `${baseUrl}/login`,
                body: {
                    username: 'test2@test.fr',
                    password: 'testtest',
                },
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('token');
            });
        });
        describe('Test d’accès aux données confidentielles sans authentification', () => {
            const baseUrl = 'http://localhost:8081';

            it('Requête non authentifiée sur /orders doit retourner 403 et non 401', () => {
                cy.request({
                    method: 'GET',
                    url: `${baseUrl}/orders`,
                    failOnStatusCode: false, // Ne pas échouer si le code d'erreur est retourné
                }).then((response) => {
                    expect(response.status).to.eq(403); // L'application doit retourner 403
                });
            });
        });


        describe('Tests API - Ajout d’un avis', () => {
            const baseUrl = 'http://localhost:8081';

            it('Ajout d’un avis (200 attendu)', () => {
                // Étape 1 : Connexion pour obtenir un token
                cy.request({
                    method: 'POST',
                    url: `${baseUrl}/login`,
                    body: {
                        username: 'test2@test.fr',
                        password: 'testtest',
                    },
                }).then((loginResponse) => {
                    expect(loginResponse.status).to.eq(200); // Vérification du succès de la connexion
                    const token = loginResponse.body.token;

                    // Étape 2 : Ajouter un avis
                    cy.request({
                        method: 'POST',
                        url: `${baseUrl}/reviews`,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        body: {
                            title: "Superbe expérience",
                            comment: "Ce produit est incroyable !",
                            rating: 5
                        },
                    }).then((response) => {
                        expect(response.status).to.eq(200); // Vérifier que l'API retourne bien 200
                        expect(response.body).to.have.property('title', 'Superbe expérience');
                        expect(response.body).to.have.property('comment', 'Ce produit est incroyable !');
                        expect(response.body).to.have.property('rating', 5);
                    });
                });
            });
        });


    });

    //  TESTS POST
    describe('Tests API POST - Ajout d’un produit au panier', () => {
        it('Ajout d’un produit disponible au panier', () => {
            cy.request({
                method: 'POST',
                url: `${baseUrl}/login`,
                body: {
                    username: 'test2@test.fr',
                    password: 'testtest',
                },
            }).then((loginResponse) => {
                expect(loginResponse.status).to.eq(200);
                const token = loginResponse.body.token;

                cy.request({
                    method: 'POST',
                    url: `${baseUrl}/orders/add`,
                    headers: { Authorization: `Bearer ${token}` },
                    body: {
                        product: 3,
                        quantity: 2,
                    },
                }).then((response) => {
                    expect(response.status).to.eq(200);
                    expect(response.body).to.have.property('orderLines');
                });
            });
        });

        it('Ajout d’un produit hors stock (devrait échouer)', () => {
            const productId = 3;

            cy.request({
                method: 'GET',
                url: `${baseUrl}/products/${productId}`,
            }).then((productResponse) => {
                expect(productResponse.status).to.eq(200);
                expect(productResponse.body.availableStock).to.be.lte(0);

                cy.request({
                    method: 'POST',
                    url: `${baseUrl}/login`,
                    body: {
                        username: 'test2@test.fr',
                        password: 'testtest',
                    },
                }).then((loginResponse) => {
                    expect(loginResponse.status).to.eq(200);
                    const token = loginResponse.body.token;

                    cy.request({
                        method: 'PUT',
                        url: `${baseUrl}/orders/add`,
                        headers: { Authorization: `Bearer ${token}` },
                        failOnStatusCode: false,
                        body: {
                            product: productId,
                            quantity: 1,
                        },
                    }).then((response) => {
                        expect(response.status).to.be.oneOf([400, 409]);
                    });
                });
            });
        });
    });
});
