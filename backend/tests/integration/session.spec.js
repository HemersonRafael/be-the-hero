const request = require('supertest');
const app = require('../../src/app');
const connection = require('../../src/database/connection');

describe("SESSION",()=>{
    beforeEach(async () =>{
        await connection.migrate.rollback();
        await connection.migrate.latest();
    });

    afterAll(async() =>{
        await connection.destroy();
    });

    it('should be able to login', async () =>{
        const response =  await request(app)
        .post('/ongs')
        .send({
            name: "TESTE",
            email: "contato@teste.com.br",
            whatsapp: "84900000000",
            city : "Natal",
            uf : "RN"
        });
       await request(app).post('/sessions')
        .send({
            id: response.body.id,
        })
        expect(response.status).toBe(200);
    });
});