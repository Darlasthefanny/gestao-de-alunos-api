import { expect } from 'chai';
import { loginAluno } from './helpers/aluno.js';
import aluno from './data/aluno.json' with { type: 'json' };

describe('POST /api/auth/login - Aluno', function () {

  it('deve realizar login do aluno e retornar um token', async function () {
    const resultado = await loginAluno(
      aluno.email,
      aluno.senha
    );

    expect(resultado.token).to.be.a('string').and.not.empty;
    expect(resultado.usuario.email).to.equal(aluno.email);
    expect(resultado.usuario.role).to.equal('aluno');
  });

});