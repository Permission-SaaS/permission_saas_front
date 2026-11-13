# permission_saas_front

Front-end do **Permission SaaS**, em React com TypeScript. O Vite é a ferramenta de build e o
Tailwind CSS cuida dos estilos, com os ícones do Phosphor Icons. A decisão e a troca do Create React App pelo Vite estão no ADR-016, no
[`docs/ARCHITECTURE.md`](https://github.com/Permission-SaaS/permission_saas/blob/main/docs/ARCHITECTURE.md)
do guarda-chuva. Tem o login simulado, com a sessão no Redux e as telas protegidas por uma rota
privada, o CRUD de projetos (a lista com busca, o detalhe com exclusão e o formulário de criação e
edição), a navegação, uma tela de erro para falhas de render, os avisos na tela (toasts) e o cliente
HTTP que conversa com a API.

Foi construído na disciplina "Desenvolvimento de aplicações interativas com React" da
pós-graduação. O relatório da entrega, com os prints e os testes no Chrome, no Firefox e no Edge,
está no
[`ENTREGA.md`](https://github.com/Permission-SaaS/permission_saas/blob/main/docs/desenvolvimento_de_aplicacoes_interativas_com_react/ENTREGA.md)
do guarda-chuva.

Consome a API da aplicação principal (`permission-service`, porta 8080), documentada no
[`API.md` do `permission_saas_api`](https://github.com/Permission-SaaS/permission_saas_api/blob/main/docs/API.md).
Em desenvolvimento, o front chama `/api/...`, e o Vite repassa a chamada para `http://localhost:8080`
sem o prefixo (`server.proxy` no `vite.config.ts`). Por isso, as telas que usam dados precisam da API
no ar.

Faz parte da organização [Permission-SaaS](https://github.com/Permission-SaaS). O repositório
[`permission_saas`](https://github.com/Permission-SaaS/permission_saas) é o guarda-chuva: reúne todos
os repositórios como submódulos, sobe o sistema inteiro pelo Docker Compose e guarda a visão de
arquitetura e o log de ADRs.

## Como rodar

Requer Node.js 22.22+, a versão mínima do React Router 8.

```bash
npm install           # instala as dependências do package-lock.json
npm run dev           # servidor de desenvolvimento em http://localhost:5173
npm run build         # confere os tipos (tsc -b) e gera a versão de produção em dist/
npm run preview       # serve a dist/ para testar o build
npm run lint          # ESLint
npm run format        # formata o projeto com o Prettier
npm run format:check  # só confere a formatação, sem alterar nada
npm run check         # build, lint e format:check, nessa ordem
```

**Login de demonstração:** e-mail `demo@example.com` e senha `demo@123`. O login é simulado no front:
a API ainda não tem autenticação, então a rota privada só organiza a navegação e não protege os dados.
A sessão fica no `localStorage` do navegador e sobrevive ao F5.

A criação de projetos precisa do id de um cliente cadastrado na API, porque o login simulado não tem um.
Copie o `.env.example` para `.env.local` e preencha o `VITE_DEV_CLIENT_ID` (o `GET /clients` da API
lista os clientes). O `.env.local` não vai para o git.

O `npm run dev` não confere tipos: um erro de tipo só aparece no editor e no `npm run build`.

A formatação segue o `.prettierrc`: os padrões do Prettier, mais um plugin que ordena os imports e
remove os não usados e o plugin do Tailwind, que ordena as classes. No VS Code, o projeto recomenda as extensões do Prettier, do ESLint e do Tailwind
(`.vscode/extensions.json`).

## Documentação

A estrutura de pastas, as regras de importação entre elas e as convenções de código ficam no
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Licença

Todos os direitos reservados a Jairo Williams Guedes Lopes Neto. O código é público só para consulta
e avaliação; ver [`LICENSE`](LICENSE).
