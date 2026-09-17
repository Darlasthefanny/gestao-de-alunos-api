import request from 'supertest';
import app from '../../src/app.js';

export async function loginAluno(email, senha) {
  const resposta = await request(app)
    .post('/api/auth/login')
    .send({
      email,
      senha
    });

  return {
    token: resposta.body.token,
    usuario: resposta.body.usuario
  };
}