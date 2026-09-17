import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { loginAdmin } from './helpers/admin.js';
import aluno from './data/aluno.json' with { type: 'json' };
import Aluno from '../src/models/aluno.model.js';

describe('POST /api/admin/alunos', function () {
  let token;
  let alunoId;

  before(async function () {
  token = await loginAdmin();
  await Aluno.deleteOne({ email: aluno.email });
});

  it('deve cadastrar um aluno com sucesso', async function () {
    const resposta = await request(app)
      .post('/api/admin/alunos')
      .set('Authorization', `Bearer ${token}`)
      .send(aluno);

    expect(resposta.status).to.equal(201);
    expect(resposta.body).to.have.property('id');

    alunoId = resposta.body.id;

    await request(app)
  .post('/api/admin/disciplinas/disciplina-matematica/matriculas')
  .set('Authorization', `Bearer ${token}`)
  .send({ alunoId });

    expect(resposta.body.nome).to.equal(aluno.nome);
    expect(resposta.body.email).to.equal(aluno.email);
    expect(resposta.body.matricula).to.equal(aluno.matricula);
    expect(resposta.body).to.not.have.property('senha');
  });
});