# permission_saas_front

Front-end do **Permission SaaS**, em React com TypeScript. O Vite é a ferramenta de build e o
Tailwind CSS cuida dos estilos. A decisão e a troca do Create React App pelo Vite estão no ADR-016, no
[`docs/ARCHITECTURE.md`](https://github.com/Permission-SaaS/permission_saas/blob/main/docs/ARCHITECTURE.md)
do guarda-chuva. Por enquanto, o projeto é o que o template `react-ts` do Vite gera, ainda sem
funcionalidades.

Vai consumir a API da aplicação principal (`permission-service`, porta 8080), documentada no
[`API.md` do `permission_saas_api`](https://github.com/Permission-SaaS/permission_saas_api/blob/main/docs/API.md).

Faz parte da organização [Permission-SaaS](https://github.com/Permission-SaaS). O repositório
[`permission_saas`](https://github.com/Permission-SaaS/permission_saas) é o guarda-chuva: reúne todos
os repositórios como submódulos, sobe o sistema inteiro pelo Docker Compose e guarda a visão de
arquitetura e o log de ADRs.

## Como rodar

Requer Node.js 20.19+ ou 22.12+, a versão mínima do Vite 8.

```bash
npm install       # instala as dependências do package-lock.json
npm run dev       # servidor de desenvolvimento em http://localhost:5173
npm run build     # confere os tipos (tsc -b) e gera a versão de produção em dist/
npm run preview   # serve a dist/ para testar o build
npm run lint      # ESLint
```

O `npm run dev` não confere tipos: um erro de tipo só aparece no editor e no `npm run build`.

## Licença

Todos os direitos reservados a Jairo Williams Guedes Lopes Neto. O código é público só para consulta
e avaliação; ver [`LICENSE`](LICENSE).
