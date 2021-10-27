/// <reference types="cypress" />
var faker = require('faker');
import ContratoUsuarios from '../contracts/usuarios.contract'

describe('Testes da Funcionalidade Usuários', () => {

     it('Deve validar contrato de usuários', () => {
          
          cy.request('usuarios').then(response=>{
               return ContratoUsuarios.validateAsync(response.headers.status)
          })
     });

     it('Deve listar usuários cadastrados', () => {
          
          cy.request({
               method: 'GET',
               url: 'usuarios',
               
          }).then((response) => {
               expect(response.status).to.equal(200)
               expect(response.body).to.have.property('usuarios')
               
          });
     });



     it('Deve cadastrar um usuário com sucesso', () => {
          
          let usuarios = `Usuarios ${Math.floor(Math.random() * 10000)}`
          const fakerEmail = faker.internet.email()
          cy.cadastrarUsuario(usuarios, fakerEmail, '123456')
               .then((response) => {
                    expect(response.status).to.equal(201)
               })
     })


     it('Deve validar um usuário com email inválido', () => {
          
          const nomeFaker = faker.name.findName()
          cy.request({
               method: 'POST',
               url: 'usuarios',
               body:
               {
                    "nome": nomeFaker,
                    "email": 'teste#gmail.com',
                    "password": "teste",
                    "administrador": "true"
               },
               failOnStatusCode: false

          }).then((response) => {
               expect(response.status).to.equal(400)
               expect(response.body.email).to.equal('email deve ser um email válido')
          })
     })



     it('Deve editar um usuário previamente cadastrado', () => {
          
          let fakerNome = faker.name.lastName()
          let fakerEmail = faker.internet.email()

          cy.cadastrarUsuario(fakerNome, fakerEmail, '123456')

               .then(response => {
                    let id = response.body._id
                    cy.request({
                         method: 'PUT',
                         url: `usuarios/${id}`,
                         body:
                         {
                              "nome": fakerNome,
                              "email": fakerEmail,
                              "password": "teste",
                              "administrador": "true"
                         }
                    }).then(response => {
                         expect(response.body.message).to.equal('Registro alterado com sucesso')
                    })
               })
     })


     it('Deve deletar um usuário previamente cadastrado', () => {
          
          let fakerNome = faker.name.lastName()
          let fakerEmail = faker.internet.email()
          
          cy.cadastrarUsuario(fakerNome, fakerEmail, '123456')
          .then(response=>{
               let id = response.body._id
               cy.request({
                    method:'DELETE',
                    url:`usuarios/${id}`,

               }).then(response=>{
                    expect(response.body.message).to.equal('Registro excluído com sucesso')
                    expect(response.status).to.equal(200)
               })
          })
     })
})







