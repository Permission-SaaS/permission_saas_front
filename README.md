# permission_saas_front

Front-end do **Permission SaaS**, em React com TypeScript. O Vite é a ferramenta de build e o
Tailwind CSS cuida dos estilos. A decisão e a troca do Create React App pelo Vite estão no ADR-016, no
[`docs/ARCHITECTURE.md`](https://github.com/Permission-SaaS/permission_saas/blob/main/docs/ARCHITECTURE.md)
do guarda-chuva. Por enquanto, tem a navegação (o layout e as rotas, com páginas provisórias), uma tela
de erro para falhas de render e os avisos na tela (toasts), prontos para os próximos passos usarem.

Vai consumir a API da aplicação principal (`permission-service`, porta 8080), documentada no
[`API.md` do `permission_saas_api`](https://github.com/Permission-SaaS/permission_saas_api/blob/main/docs/API.md).

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
```

O `npm run dev` não confere tipos: um erro de tipo só aparece no editor e no `npm run build`.

A formatação segue o `.prettierrc`: os padrões do Prettier, mais o plugin do Tailwind, que ordena as
classes. No VS Code, o projeto recomenda as extensões do Prettier, do ESLint e do Tailwind
(`.vscode/extensions.json`).

## Documentação

A estrutura de pastas, as regras de importação entre elas e as convenções de código ficam no
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Licença

Todos os direitos reservados a Jairo Williams Guedes Lopes Neto. O código é público só para consulta
e avaliação; ver [`LICENSE`](LICENSE).
