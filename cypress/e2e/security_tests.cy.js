describe('Tests de Sécurité - Protection contre l’injection XSS', () => {
    const baseUrl = 'http://localhost:8081';

    it('Empêcher l’injection XSS via les avis', () => {
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

            // Tentative d'injection XSS via un avis
            cy.request({
                method: 'POST',
                url: `${baseUrl}/reviews`,
                headers: { Authorization: `Bearer ${token}` },
                body: {
                    title: "<script>alert('XSS')</script>",
                    comment: "<img src=x onerror=alert('XSS')>",
                    rating: 5,
                },
                failOnStatusCode: false, // Ne pas faire échouer Cypress automatiquement
            }).then((response) => {
                expect(response.status).to.be.oneOf([400, 403]); // Vérifie que l'API rejette bien l'injection
                expect(response.body).to.not.contain("<script>");
                expect(response.body).to.not.contain("alert('XSS')");
            });
        });
    });
});
