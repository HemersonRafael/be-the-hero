const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe("INCIDENT",()=>{
    beforeEach(async () =>{
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async() =>{
        await connection.destroy();
    });

    it('should be able to delete INCIDENT', async () =>{
        const response =  await request(app)
        .post('/ongs')
        .send({
            name: "TESTE",
            email: "contato@teste.com.br",
            whatsapp: "84900000000",
            city : "Natal",
            uf : "RN"
        });

        const rep = await request(app)
            .post('/incidents')
            .send({
                title : "Caso test",
                description : "Detalhes do caso",
                value : 55
            })
            .set('Authorization',response.body.id);
        
        
        await request(app)
            .get('/incidents?page=1');

        await request(app)
            .delete(`/incidents/${rep.body.id}`)
            .set('Authorization',response.body.id);
        expect(response.status).toBe(200);
    });
});