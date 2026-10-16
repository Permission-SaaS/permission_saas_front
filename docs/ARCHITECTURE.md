# Arquitetura e convenções — front-end

Como o código do `permission_saas_front` se organiza e as convenções que ele segue. Uma convenção
entra aqui quando aparece no código pela primeira vez e é aceita na revisão: este arquivo registra o
que já foi decidido, não o que talvez venha a ser. O plano da disciplina, com as decisões e o
cronograma, fica no
[`PLAN.md`](https://github.com/Permission-SaaS/permission_saas/blob/main/docs/desenvolvimento_de_aplicacoes_interativas_com_react/PLAN.md)
do guarda-chuva.

---

## Estrutura de pastas

Um módulo do front para cada módulo do `permission-service`, como no back-end:

```
src/
├── main.tsx                # ponto de entrada: monta o <App /> no #root
├── index.css               # @import "tailwindcss"
├── app/                    # liga as peças; o único lugar que conhece todos os módulos
│   ├── App.tsx             # <BrowserRouter> em volta das rotas
│   ├── router.tsx          # AppRoutes: a árvore de rotas
│   ├── NotFoundPage.tsx    # o 404
│   └── layout/
│       └── AppLayout.tsx   # cabeçalho, menu e <Outlet />
└── modules/
    ├── identity/           # cadastro e login   ↔ módulo identity do permission-service
    │   ├── index.ts
    │   └── pages/          # LoginPage, RegisterPage
    └── project/            # CRUD de projetos   ↔ módulo project
        ├── index.ts
        └── pages/          # ProjectListPage, ProjectDetailPage, ProjectFormPage
```

**Pasta só existe quando tem arquivo**, até porque o git não guarda pasta vazia. As que o plano prevê
nascem com o primeiro arquivo de cada uma:

| Pasta                                | O que guarda                                                                                                                                           |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `shared/`                            | o que é genérico, sem regra de negócio: `components/` (`Button`, `ErrorBoundary`), `api/` (`httpClient`), `context/` (`NotificationContext`), `hooks/` |
| `modules/<módulo>/components/`       | componentes usados só por aquele módulo                                                                                                                |
| `modules/<módulo>/api/`              | as chamadas HTTP do módulo                                                                                                                             |
| `modules/<módulo>/hooks/`            | hooks do módulo                                                                                                                                        |
| `modules/<módulo>/types.ts`          | os tipos dos DTOs da API                                                                                                                               |
| `modules/identity/store/`            | o `authSlice` do Redux                                                                                                                                 |
| `app/providers.tsx` e `app/store.ts` | os providers e a store do Redux                                                                                                                        |

---

## Dependências entre pastas

As importações vão num sentido só: **`app` → `modules` → `shared`**.

- O `app` pode importar dos módulos e do `shared`.
- Um módulo pode importar do `shared` e, de outro módulo, **só pelo `index.ts`** dele.
- O `shared` **nunca** importa de `modules` nem do `app`.
- O `app` também importa os módulos pelo `index.ts`: `import { RegisterPage } from "../modules/identity";`.

O motivo é evitar ciclo. O `app` importa todos os módulos; se um módulo importasse do `app`, os dois
dependeriam um do outro, e a fronteira deixaria de existir. É a mesma ideia das fronteiras do Spring
Modulith no back-end, onde o `shared` é um módulo ao lado dos outros.

### Onde cada arquivo mora

A pergunta que decide é **o que o arquivo precisa importar**:

| O arquivo...                                             | Vai para         | Exemplo                                                         |
| -------------------------------------------------------- | ---------------- | --------------------------------------------------------------- |
| importa coisas de vários módulos                         | `app`            | o router, o `AppLayout`, cujo menu aponta para todos os módulos |
| tem regra de negócio de um módulo                        | o próprio módulo | `RegisterForm`, `ProjectCard`                                   |
| não importa nada de `modules` e não tem regra de negócio | `shared`         | `Button`, `httpClient`                                          |

Um componente **nasce no módulo** que o usa e só sobe para o `shared` quando um segundo módulo
**já precisa** dele, não quando "pode vir a precisar".

---

## Rotas

React Router 8 no **modo declarativo**: `<BrowserRouter>`, `<Routes>` e `<Route>`. Tudo é importado de
`react-router`; o pacote `react-router-dom` não existe mais na v8.

- **Todas as rotas ficam no `app/router.tsx`.** As páginas não declaram rotas.
- **Padrão de URL do CRUD**, em inglês, minúsculo e no plural, como os recursos da API:

  | URL                  | Página  |
  | -------------------- | ------- |
  | `/projects`          | lista   |
  | `/projects/new`      | criação |
  | `/projects/:id`      | detalhe |
  | `/projects/:id/edit` | edição  |

- **Criar e editar usam a mesma página**, que decide pela presença do `:id`.
- **O `*` (404) fica por último.** A ordem não muda qual rota casa, já que o React Router ordena por
  especificidade, mas quem lê espera o 404 no fim.
- **Redirecionamento com `<Navigate to="..." replace />`.** Sem o `replace`, o botão Voltar cairia de
  novo na URL que redireciona.
- **Navegação interna sempre com `Link` ou `NavLink`, nunca com `<a href>`.** O `<a href>` recarrega o
  app e perde todo o state. Ele fica só para links externos.
- **No menu, `NavLink`**, com `end` quando o link deve ficar ativo só na URL exata.
- **Parâmetro da URL é sempre `string | undefined`** e pode vir em qualquer formato, porque qualquer um
  digita a URL. Valide antes de usar (ver [Validação](#validação)).

---

## Convenções de código

### Nomes e arquivos

| O quê                       | Convenção                                                    | Exemplo                            |
| --------------------------- | ------------------------------------------------------------ | ---------------------------------- |
| Componente                  | PascalCase, um por arquivo, arquivo com o mesmo nome, `.tsx` | `RegisterPage.tsx`                 |
| Página                      | sufixo `Page`, na pasta `pages/` do módulo                   | `ProjectListPage`                  |
| Arquivo de ligação do `app` | minúsculo, pelo papel que cumpre                             | `router.tsx` (exporta `AppRoutes`) |
| Barrel do módulo            | `index.ts`: não tem JSX, então não é `.tsx`                  | `modules/project/index.ts`         |
| Handler de evento           | `handle` + ação                                              | `handleClick`, `handleSubmit`      |

**Idioma:** o código fica em inglês (nomes, arquivos, URLs e commits), e o texto que aparece na tela
fica em português.

### Exports

- **Só exports nomeados:** `export function RegisterPage()`, nunca `export default`. O nome fica o mesmo
  em todo import, renomear e importar pelo editor funcionam melhor, e o barrel só repassa.
- **O barrel repassa pelo nome:** `export { RegisterPage } from "./pages/RegisterPage";`.
- **Exceção:** os arquivos de configuração que as ferramentas leem (`vite.config.ts`,
  `eslint.config.js`), porque a ferramenta exige o `export default`.

### Componentes

- **Componente funcional, declarado com `function`:** `export function AppLayout() { ... }`. Os
  handlers dentro dele são arrow functions: `const handleClick = () => { ... }`.
- **Componente de classe, só onde o React não oferece alternativa:** o `ErrorBoundary`.
- **O corpo do componente é puro.** Ele roda a cada render, duas vezes em dev por causa do
  `StrictMode`. Requisição, timer e qualquer alteração fora do componente vão para um handler de
  evento ou para um `useEffect` com função de limpeza, nunca para o corpo.

### State

- **Nunca altere o state:** crie um valor novo. Use spread para objeto e array, `map` para editar um
  item e `filter` para remover. O React compara o valor antigo com o novo por referência
  (`Object.is`), então alterar o state por dentro não dispara render. O ESLint
  (`react-hooks/immutability`) pega parte desses casos.
- **Quando o valor novo depende do anterior, passe uma função ao setter:**
  `setCount((c) => c + 1)`.
- **Variável local não sobrevive ao render.** O que precisa persistir entre renders vai para o state.

### TypeScript

- **Deixe a inferência trabalhar:** `useState(0)` já é `number`. O generic só é explícito quando o valor
  inicial não diz o tipo, como em `useState<string[]>([])` ou `useState<Project | null>(null)`.

### Estilos

- **Classes do Tailwind direto no JSX**, sem arquivo de CSS por componente. O `index.css` só importa o
  Tailwind.
- **A ordem das classes fica com o Prettier**, pelo plugin do Tailwind.
- **Funcional antes de bonito:** o Tailwind organiza a tela, sem investimento em design por enquanto.

---

## Validação

**O front valida por conforto, o back-end valida por obrigação.**

- **O front valida o que der antes de chamar a API:** o formulário, antes de enviar, e o parâmetro da
  URL, antes da requisição. Um `id` fora do formato UUID vira "projeto não encontrado" sem passar pela
  API. A resposta é imediata, e a requisição inútil nem sai.
- **O back-end continua validando tudo**, inclusive o que o front já barra, porque qualquer pessoa
  chama a API direto, pelo curl ou pelo Postman.

---

## Antes de cada commit

```bash
npm run build         # tsc -b: erro de tipo quebra o build (o npm run dev não confere tipos)
npm run lint          # ESLint
npm run format:check  # Prettier
```

- **ESLint:** as regras recomendadas do JavaScript e do `typescript-eslint`, mais dois plugins:
  - o `react-hooks`, com as regras dos hooks, o `exhaustive-deps` e as regras do React Compiler, como
    `immutability`;
  - o `react-refresh`, que exige que um arquivo `.tsx` exporte só componentes, para o Fast Refresh
    funcionar.
- **Prettier:** os padrões escritos no `.prettierrc` (80 colunas, aspas duplas, ponto e vírgula e
  vírgula final), mais o plugin do Tailwind.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) em inglês, como em todos os
  repositórios. As regras ficam no `CLAUDE.md` do guarda-chuva.
