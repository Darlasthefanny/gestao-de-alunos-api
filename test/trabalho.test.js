import { expect } from 'chai';
import request from 'supertest';
import app from '../src/app.js';
import { loginAdmin } from './helpers/admin.js';
import { loginAluno } from './helpers/aluno.js';
import aluno from './data/aluno.json' with { type: 'json' };
import Aluno from '../src/models/aluno.model.js';

describe('Fluxo de entrega de trabalho', function () {
  let tokenAdmin;
  let alunoId;
  let tokenAluno;

  before(async function () {
  tokenAdmin = await loginAdmin();
  await Aluno.deleteOne({ email: aluno.email });
});

  it('deve cadastrar aluno, fazer login e registrar a entrega do trabalho', async function () {
    const respostaCadastro = await request(app)
  .post('/api/admin/alunos')
  .set('Authorization', `Bearer ${tokenAdmin}`)
  .send(aluno);

expect(respostaCadastro.status).to.equal(201);

alunoId = respostaCadastro.body.id;
await request(app)
  .post('/api/admin/disciplinas/disciplina-matematica/matriculas')
  .set('Authorization', `Bearer ${tokenAdmin}`)
  .send({ alunoId });

  tokenAluno = (await loginAluno(
  aluno.email,
  aluno.senha
)).token;

const respostaTrabalho = await request(app)
  .post(`/api/alunos/${alunoId}/trabalhos`)
  .set('Authorization', `Bearer ${tokenAluno}`)
  .send({
    disciplinaId: 'disciplina-matematica',
    titulo: 'Lista de Exercícios 2',
    descricao: 'Entrega realizada pelo teste automatizado'
  });

  expect(respostaTrabalho.status).to.equal(201);
expect(respostaTrabalho.body).to.have.property('id');
expect(respostaTrabalho.body.alunoId).to.equal(alunoId);
expect(respostaTrabalho.body.disciplinaId).to.equal('disciplina-matematica');
expect(respostaTrabalho.body.titulo).to.equal('Lista de Exercícios 2');

  });
});