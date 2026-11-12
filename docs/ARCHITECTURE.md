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
├── vite-env.d.ts           # os tipos das variáveis do import.meta.env
├── app/                    # liga as peças; o único lugar que conhece todos os módulos
│   ├── App.tsx             # ErrorBoundary, Providers e <BrowserRouter> em volta das rotas
│   ├── providers.tsx       # Providers: junta os providers do app (Redux, avisos e React Query)
│   ├── queryClient.ts      # o QueryClient, o cache do React Query, criado uma vez só
│   ├── store.ts            # a store do Redux, com a sessão lida e gravada no localStorage
│   ├── router.tsx          # AppRoutes: a árvore de rotas, com a rota privada em volta do layout
│   ├── NotFoundPage.tsx    # o 404
│   └── layout/
│       └── AppLayout.tsx   # cabeçalho (menu, nome de quem entrou e Sair) e <Outlet />
├── modules/
│   ├── identity/           # login simulado e sessão   ↔ módulo identity
│   │   ├── index.ts        # PrivateRoute, LoginPage, authSlice, loggedOut, selectCurrentUser
│   │   ├── components/     # LoginForm (não controlado) e PrivateRoute (o porteiro das telas do app)
│   │   ├── pages/          # LoginPage: o formulário, ou o redirecionamento de quem já entrou
│   │   ├── store/
│   │   │   └── authSlice.ts    # a sessão: o user ou null, os eventos loggedIn e loggedOut, os selectors
│   │   ├── utils/
│   │   │   └── validateLogin.ts    # o formato do e-mail e da senha
│   │   └── types.ts        # User e os valores do formulário (LoginValues)
│   └── project/            # CRUD de projetos   ↔ módulo project
│       ├── index.ts
│       ├── api/
│       │   ├── projectApi.ts   # as chamadas HTTP do módulo, pelo httpClient
│       │   └── projectKeys.ts  # as chaves de cache do React Query
│       ├── components/     # ProjectList (a mensagem de vazio ou a grade), ProjectCard (um projeto no Card), ProjectDetail (busca, mostra e exclui), ProjectNotFound, ProjectStatusBadge, ProjectForm (os campos), ProjectCreate e ProjectEdit (a busca, a mutação e os avisos de cada ação)
│       ├── pages/          # ProjectListPage, ProjectDetailPage, ProjectFormPage
│       ├── utils/
│       │   └── validateProject.ts  # as regras do formulário de projeto
│       └── types.ts        # os tipos dos DTOs da API e os valores do formulário (ProjectValues)
└── shared/                 # genérico, sem regra de negócio
    ├── index.ts            # barrel: só o que é público (ErrorBoundary, Button, LinkButton, Card e as partes dele, Modal, as classes dos campos de formulário, httpClient, HttpError, HttpStatus, NotificationProvider, useNotification, useDebounce, useForm e o tipo Violation, describeError, formatDateTime, isUuid)
    ├── api/
    │   ├── httpClient.ts   # get/post/put/delete: prefixo /api, JSON, timeout e cancelamento
    │   ├── HttpError.ts    # o erro de toda chamada, com o kind e o status
    │   └── HttpStatus.ts   # os códigos HTTP que o front compara, pelo nome
    ├── components/
    │   ├── Button/         # os botões: a variante (default, danger, primary) vem por prop
    │   │   ├── Button.tsx
    │   │   ├── LinkButton.tsx      # um Link com a aparência de botão
    │   │   └── buttonClasses.ts    # as classes de cada variante: interno
    │   ├── Card/           # a caixa e as partes dela, todas públicas: o conteúdo vem pelo children
    │   │   ├── Card.tsx
    │   │   ├── CardHeader.tsx
    │   │   ├── CardBody.tsx
    │   │   └── CardFooter.tsx
    │   ├── ErrorBoundary/  # componente com arquivo satélite vira pasta
    │   │   ├── ErrorBoundary.tsx
    │   │   └── ErrorBoundaryFallback.tsx   # interno: fora do barrel
    │   ├── Modal.tsx       # a caixa sobre a tela, no <dialog> nativo: o conteúdo vem pelo children
    │   └── formClasses.ts  # as classes do label, do campo (com e sem erro) e da mensagem de erro
    ├── context/
    │   └── NotificationContext/            # um contexto e as suas peças (ver Context)
    │       ├── NotificationContext.ts      # createContext: interno, só o hook o lê
    │       ├── NotificationProvider.tsx    # o state da lista e os comandos notify e dismiss
    │       ├── useNotification.ts          # o hook: lê o contexto e falha fora do provider
    │       ├── Toast.tsx                   # um aviso, com o próprio timer: interno
    │       └── types.ts                    # os tipos que as peças dividem
    ├── hooks/
    │   ├── useDebounce.ts  # o valor atrasado: só acompanha o original depois de uma pausa
    │   └── useForm.ts      # os valores e os erros de um formulário, validado no envio
    └── utils/
        ├── describeError.ts    # o texto de um erro de leitura, escolhido pelo kind
        ├── formatDateTime.ts   # a data ISO da API em texto pt-BR, no fuso de quem usa
        └── isUuid.ts           # confere o formato de um UUID, sem conferir a versão
```

**Pasta só existe quando tem arquivo**, até porque o git não guarda pasta vazia. As que o plano prevê
nascem com o primeiro arquivo de cada uma:

| Pasta                          | O que guarda                                       |
| ------------------------------ | -------------------------------------------------- |
| `shared/hooks/`                | os hooks genéricos                                 |
| `shared/utils/`                | as funções genéricas, sem React                    |
| `modules/<módulo>/components/` | componentes usados só por aquele módulo            |
| `modules/<módulo>/api/`        | as chamadas HTTP do módulo                         |
| `modules/<módulo>/hooks/`      | hooks do módulo                                    |
| `modules/<módulo>/utils/`      | as funções do módulo, sem React, como a validação  |
| `modules/<módulo>/store/`      | os slices do Redux do módulo, um arquivo por slice |
| `modules/<módulo>/types.ts`    | os tipos dos DTOs da API                           |

---

## Dependências entre pastas

As importações vão num sentido só: **`app` → `modules` → `shared`**.

- O `app` pode importar dos módulos e do `shared`.
- Um módulo pode importar do `shared` e, de outro módulo, **só pelo `index.ts`** dele.
- O `shared` **nunca** importa de `modules` nem do `app`.
- O `shared` também tem barrel (decidido em 19/10): quem está fora importa de `@/shared`, e só o que é
  público entra no `index.ts` dele. O que só serve a outro arquivo do `shared` fica de fora, como o
  `ErrorBoundaryFallback`, que só o `ErrorBoundary` usa.
- O `app` também importa os módulos pelo `index.ts`: `import { ProjectListPage } from "@/modules/project";`.

O motivo é evitar ciclo. O `app` importa todos os módulos; se um módulo importasse do `app`, os dois
dependeriam um do outro, e a fronteira deixaria de existir. É a mesma ideia das fronteiras do Spring
Modulith no back-end, onde o `shared` é um módulo ao lado dos outros.

### Alias ou caminho relativo

O alias `@/` aponta para `src/` (decidido em 17/10):

- **Atravessou uma pasta de topo, use o alias:** do `app` para os módulos, dos módulos para o `shared`, do
  `app` para o `shared`. Exemplo: `@/shared`, `@/modules/project`.
- **Dentro do mesmo módulo ou da mesma pasta, use o caminho relativo:** `./pages/ProjectListPage`.

Assim, o próprio import mostra quando uma fronteira é cruzada, e um módulo continua fácil de mover. O alias
não muda a regra do barrel: `@/modules/project` pode, `@/modules/project/pages/...` vindo de fora do módulo
não pode.

O alias fica definido num lugar só, o `paths` do `tsconfig.app.json`, e o Vite o lê de lá
(`resolve.tsconfigPaths` no `vite.config.ts`). Não use `baseUrl`: no TypeScript 6, ele está obsoleto e
quebra o build.

### Onde cada arquivo mora

A pergunta que decide é **o que o arquivo precisa importar**:

| O arquivo...                                             | Vai para         | Exemplo                                                         |
| -------------------------------------------------------- | ---------------- | --------------------------------------------------------------- |
| importa coisas de vários módulos                         | `app`            | o router, o `AppLayout`, cujo menu aponta para todos os módulos |
| tem regra de negócio de um módulo                        | o próprio módulo | `ProjectDetail`, `ProjectCard`                                  |
| não importa nada de `modules` e não tem regra de negócio | `shared`         | `Button`, `Card`, `httpClient`                                  |

- **Peça visual sem domínio nasce no `shared`** (decidido em 03/11): `Button`, `Card`, `Modal`. Ela só
  desenha uma caixa e recebe o conteúdo pelo `children`, então não tem nada de módulo nenhum para
  carregar. Quem põe o domínio é o componente do módulo que a usa, como o `ProjectCard` em cima do
  `Card`.
- **Componente de tela nasce no módulo** que o usa e só sobe para o `shared` quando um segundo módulo
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
- **Rota privada é uma rota de layout** (decidido em 12/11): a `PrivateRoute`, do `identity`, fica em
  volta da rota do `AppLayout` e devolve o `<Outlet />` ou um `<Navigate>` para `/login`, com a página
  pedida no `state`. O `/login` fica fora dela e fora do layout. Ela só organiza a navegação: sem
  autenticação na API, não protege dado nenhum.
- **O `location.state` é tipado como `unknown`** e conferido antes de usar, como o `typeof ... ===
"string"` da página pedida. O React Router o tipa como `any`, e com `any` o TypeScript aceitaria
  qualquer uso.

---

## Convenções de código

### Nomes e arquivos

| O quê                             | Convenção                                                                                               | Exemplo                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| Componente                        | PascalCase, um por arquivo, arquivo com o mesmo nome, `.tsx`                                            | `ProjectCard.tsx`                  |
| Página                            | sufixo `Page`, na pasta `pages/` do módulo                                                              | `ProjectListPage`                  |
| Arquivo de ligação do `app`       | minúsculo, pelo papel que cumpre                                                                        | `router.tsx` (exporta `AppRoutes`) |
| Barrel do módulo e do `shared`    | `index.ts`                                                                                              | `modules/project/index.ts`         |
| Arquivo sem JSX                   | `.ts`, não `.tsx`: o barrel, o contexto, o hook, os tipos                                               | `useNotification.ts`               |
| Componente com arquivos satélites | vira uma pasta com o nome dele; os arquivos mantêm o nome do componente, sem `index.ts` dentro da pasta | `shared/components/ErrorBoundary/` |
| Hook                              | `use` + nome                                                                                            | `useNotification`                  |
| Handler de evento                 | `handle` + ação; só para uma função criada para responder a um evento do componente                     | `handleClick`, `handleRetry`       |
| Comando de um contexto ou serviço | só o verbo, sem `handle`: é uma ação que qualquer um chama, não a resposta a um evento                  | `notify`, `dismiss`                |
| Prop de callback                  | `on` + ação; faz par com o `handle` de quem a passa, ou recebe direto um comando                        | `onRetry`, `onDismiss={dismiss}`   |

**Idioma:** o código fica em inglês (nomes, arquivos, URLs e commits), e o texto que aparece na tela
fica em português.

### Exports

- **Só exports nomeados:** `export function ProjectListPage()`, nunca `export default`. O nome fica o mesmo
  em todo import, renomear e importar pelo editor funcionam melhor, e o barrel só repassa.
- **O barrel repassa pelo nome:** `export { ProjectListPage } from "./pages/ProjectListPage";`.
- **Exceção:** os arquivos de configuração que as ferramentas leem (`vite.config.ts`,
  `eslint.config.js`), porque a ferramenta exige o `export default`.

### Componentes

- **`function` só para declarar componente:** `export function AppLayout() { ... }`. Todo o resto é
  arrow function: handlers, callbacks e funções auxiliares, como `const handleClick = () => { ... }`
  (decidido em 19/10).
- **Componente de classe, só onde o React não oferece alternativa:** o `ErrorBoundary`. Dentro dele:
  - os handlers são campos com arrow function, que mantêm o `this` quando o React os chama pelo clique;
  - os métodos que o React chama (`render`, `componentDidCatch` e o `static getDerivedStateFromError`)
    são métodos normais;
  - os modificadores de acesso são explícitos (`public`, `private`), por legibilidade, e o que só a
    classe usa é `private`.
- **Dado fixo fica fora do componente** (decidido em 19/10), no nível do arquivo, como o array `routes`
  do `AppLayout`. O corpo do componente roda a cada render, então tudo o que é declarado ali é recriado
  toda vez. Um dado que não depende de props, de state nem de hook não precisa disso. Os benefícios:
  - **leitura:** quem abre o arquivo vê na hora que é um dado fixo, e não algo calculado a partir do state;
  - **referência estável:** o mesmo objeto em todos os renders. Um array recriado é sempre "outro" para o
    React, o que invalida as dependências de um `useEffect` ou de um `useMemo` e faz um filho memoizado
    renderizar de novo sem necessidade;
  - **corpo enxuto:** o componente fica só com a lógica de render.

  Se o valor depende de props, de state ou de um hook (filtrar o menu pelo perfil do usuário, por
  exemplo), ele fica dentro do componente.

- **O corpo do componente é puro.** Ele roda a cada render, duas vezes em dev por causa do
  `StrictMode`. Requisição, timer e qualquer alteração fora do componente vão para um handler de
  evento ou para um `useEffect` com função de limpeza, nunca para o corpo.

- **Função usada em callback de hook é declarada antes do hook** (decidido em 04/11). Um `const` só
  existe depois que a linha dele roda, e um render que para num retorno antecipado nunca chega às linhas
  de baixo. O `useMutation` usa o callback do último render; se esse render parou antes da declaração,
  a chamada lança um `ReferenceError`. O TypeScript e o ESLint não acusam, porque o uso fica dentro de
  uma função.

- **Modal usa o `<dialog>` nativo** (decidido em 04/11), controlado pelas props `open` e `onClose`, como
  um input por `value` e `onChange`. O `showModal()` já traz o Esc, o foco preso dentro do modal e o fundo
  escurecido, e o conteúdo desmonta ao fechar. Quando o projeto adotar componentes de UI, o `Modal` pode
  ser substituído ou ampliado.

- **Botão sempre pelo `Button` ou `LinkButton` do `shared`** (decidido em 04/11), com a variante por prop
  e sem `className`, para o visual ficar num lugar só. O `Button` usa `type="button"` por padrão, para não
  enviar um formulário sem querer; o botão de envio pede `type="submit"`.

### State

- **Nunca altere o state:** crie um valor novo. Use spread para objeto e array, `map` para editar um
  item e `filter` para remover. O React compara o valor antigo com o novo por referência
  (`Object.is`), então alterar o state por dentro não dispara render. O ESLint
  (`react-hooks/immutability`) pega parte desses casos.
- **Quando o valor novo depende do anterior, passe uma função ao setter:**
  `setCount((c) => c + 1)`.
- **Variável local não sobrevive ao render.** O que precisa persistir entre renders vai para o state.

### Context

Decidido em 22/10, com o `NotificationContext`:

- **Uma pasta por contexto em `shared/context/`, com as peças em arquivos separados:** o contexto
  (`createContext`), o provider, o hook e o `types.ts` que eles dividem. A regra
  `react-refresh/only-export-components` não aceita contexto, hook e componente no mesmo `.tsx`.
- **O valor padrão é `null`, e o hook falha fora do provider:** `createContext<Valor | null>(null)`, e o
  hook lança um erro com mensagem clara quando recebe `null`. Um padrão com funções que não fazem nada
  esconderia o provider esquecido: o aviso simplesmente não apareceria.
- **Só o hook lê o contexto:** o barrel exporta o provider e o hook, nunca o contexto.
- **O state é privado do provider, e o valor publica só comandos.** A lista de avisos fica no provider,
  que também a desenha; o valor tem só `notify` e `dismiss`. Assim, quem só dispara avisos não renderiza
  de novo quando a lista muda.
- **O valor publicado é estável:** `useCallback` nos comandos e `useMemo` no objeto. Com a atualização
  por função no setter, os comandos não leem o state, e as dependências ficam vazias. Um valor novo a
  cada render faria todo componente que usa o hook renderizar de novo.

### Redux

Decidido em 12/11, com a sessão. O Redux Toolkit guarda o estado global do próprio front que muda por
eventos com nome (a sessão); os dados da API ficam no React Query, e o valor entregue à árvore sem
regras de mudança, na Context.

- **Os slices de um módulo ficam em `modules/<módulo>/store/`, um arquivo por slice** (`<nome>Slice.ts`,
  com a variável `<nome>Slice`). O `name` é curto, diz que dado o slice guarda e é único no app
  inteiro, porque vira a chave na store e o prefixo das actions (`auth/loggedIn`). A store liga cada
  slice pela chave `slice.reducerPath`, nunca por um texto escrito à mão, para a chave não divergir do
  `name`. O `app` importa o slice pelo `index.ts` do módulo.
- **Reducer tem nome de evento no passado** (`loggedIn`, `loggedOut`): descreve o que aconteceu, nunca
  o campo que muda (`setUser`). O state do slice é uma interface `<Nome>State` com o `initialState`.
- **Selectors no campo `selectors` do slice**, com o nome `select<Coisa>` e, nos booleanos,
  `selectIs<Coisa>`. Quem lê usa o `useSelector` com o selector do slice; quem muda usa o `dispatch`
  com a action gerada pelo `createSlice`. Os componentes nunca leem o formato da store direto. Sem
  `RootState` nem `AppDispatch` enquanto nada precisar deles.
- **O reducer só calcula o state novo.** Gravar no `localStorage`, navegar e chamar a API ficam fora
  dele; a persistência da sessão está no `subscribe` do `app/store.ts`, que só grava quando a
  referência da sessão muda.
- **A tela reage ao estado, em vez de mandar navegar depois do `dispatch`.** Quem decide a rota depois
  de um evento é um componente que lê o estado: o `LoginPage` leva para a página pedida quando o
  `selectIsLoggedIn` vira `true`, e o Sair só entrega o `loggedOut`, porque a `PrivateRoute` manda para
  o login sozinha. Um lugar só decide, e o caminho é o mesmo para quem acabou de entrar e para quem
  abre `/login` já logado.

### Chamadas à API

Decidido em 01/11, com o `httpClient`:

- **Toda chamada à API passa pelo `httpClient` do `shared`**, com o caminho sem o prefixo:
  `httpClient.get("/projects")`. Só o `httpClient` conhece o `/api`, e ninguém chama `fetch` direto. É
  ele que junta o prefixo, o JSON, o timeout, o cancelamento e a conversão dos erros num lugar só.
- **Quem trata um erro decide pelo `kind` do `HttpError`**, e pelo `status` quando o `kind` é `"http"`,
  nunca pelo texto da `message`. A mensagem é a da API, como veio, e pode mudar. Um cancelamento
  (`"abort"`) não vira aviso de erro na tela: quem cancelou foi o próprio front.
- **Cada módulo guarda as chamadas na pasta `api/`** (decidido em 01/11): um `<módulo>Api.ts`, com uma
  função por endpoint, sempre pelo `httpClient`, e um `<módulo>Keys.ts`, com as chaves de cache do React
  Query. A `queryFn` sempre repassa o `signal` que o React Query entrega, para a busca ser cancelada
  quando ninguém mais precisa dela.
- **Erro de leitura aparece na própria tela** (decidido em 01/11), com o texto escolhido pelo `kind`. O
  aviso na tela (toast) é para as ações, no `onError` e no `onSuccess` do `useMutation`, que rodam uma
  vez por ação. Nunca chame o `notify` no corpo do componente: o corpo roda a cada render, duas vezes em
  dev por causa do `StrictMode`, e cada render geraria outro aviso.
- **A chave da query e a chamada recebem o mesmo objeto de filtros** (decidido em 03/11), montado uma
  vez no corpo do componente, para a chave do cache nunca divergir do que foi buscado. Um objeto novo a
  cada render não faz mal ali, porque o React Query compara a chave pelo conteúdo. Na lista de
  dependências de um `useEffect`, faz: lá a comparação é por referência.
- **Debounce só para digitação** (decidido em 03/11): o campo de texto passa pelo `useDebounce`; o select
  e o checkbox vão direto para o filtro, porque um clique é uma ação só e o atraso só deixaria a tela
  lenta.
- **O erro de uma mutação vira uma mensagem fixa em português** (decidido em 09/11), escolhida pelo
  `status` num `switch` no `onError`, como o 409 da edição de projeto, nunca o texto que a API devolve.
  O `default` cobre o resto com uma mensagem genérica.

### Formulários

Decidido em 09/11, com o formulário de projeto:

- **Um componente de formulário e um invólucro por ação.** O `ProjectForm` só cuida dos campos e recebe
  por props o que muda: o título, os valores iniciais, o texto do botão, o `onSubmit` e o `cancelTo`. O
  `ProjectCreate` e o `ProjectEdit` guardam a busca, a mutação e os avisos.
- **Os valores do formulário são texto** (`<Entidade>Values`, como o `ProjectValues`), porque todo input
  entrega texto. A conversão para o corpo da requisição fica numa função `to<X>Request` no invólucro:
  `trim()`, campo opcional vazio vira `undefined` (o `JSON.stringify` o tira do corpo) e `Number()` nos
  números.
- **O formulário controlado usa o `useForm` do `shared`**, que guarda os valores e os erros. Ele valida
  no envio, e digitar num campo apaga só o erro daquele campo, sem criar erro novo. O `name` de cada
  input é igual à chave em `<Entidade>Values`.
- **O formulário lê os valores iniciais só ao montar** (o `useState` ignora o valor inicial nos renders
  seguintes). Por isso, depois de salvar, o `onSuccess` põe a resposta da API no cache com o
  `setQueryData` antes de navegar: uma nova edição monta com o dado novo, e não com o antigo.
- **Formulário não controlado** (decidido em 12/11, com o login), quando o valor só importa no envio: os
  campos não têm `value` nem state, e o `handleSubmit` lê os valores pelo `FormData`, pelo `name` de
  cada campo, montando o `<Coisa>Values` antes de validar. Só os erros ficam em state. O valor inicial,
  se houver, vai no `defaultValue`.
- **O `<form>` tem `noValidate`** quando a validação é nossa, para os balões do navegador (de
  `type="email"`, `min` ou `required`) não aparecerem antes das mensagens do formulário.
- **As classes dos campos vêm do `shared`** (`FIELD_LABEL_CLASSES`, `fieldClasses` e
  `FIELD_ERROR_CLASSES`), para todo formulário ter o mesmo visual.

### TypeScript

- **Deixe a inferência trabalhar:** `useState(0)` já é `number`. O generic só é explícito quando o valor
  inicial não diz o tipo, como em `useState<string[]>([])` ou `useState<Project | null>(null)`.
- **O tipo nasce no arquivo que o usa** (decidido em 19/10). As `Props` e o `State` de um componente ficam
  no arquivo dele: são o contrato do componente, e quem abre o arquivo vê o que ele recebe. Um tipo vai
  para um `types.ts` quando um **segundo** arquivo precisa dele, como os DTOs da API em
  `modules/<módulo>/types.ts`. É a mesma regra dos componentes, que só sobem para o `shared` quando um
  segundo módulo os usa.
- **Valor padrão com `??`, não com `||`:** o `??` só troca `null` e `undefined`; o `||` troca qualquer
  valor falso, inclusive `false`, `0` e `""`, que podem ser valores legítimos.

### Estilos

- **Classes do Tailwind direto no JSX**, sem arquivo de CSS por componente. O `index.css` só importa o
  Tailwind.
- **A ordem das classes fica com o Prettier**, pelo plugin do Tailwind.
- **Funcional antes de bonito:** o Tailwind organiza a tela, sem investimento em design por enquanto.

---

## Validação

**O front valida por conforto, o back-end valida por obrigação.**

- **O front valida o que der antes de chamar a API:** o formulário, antes de enviar, e o parâmetro da
  URL, antes da requisição. A validação de um formulário é uma função `validate<Entidade>` em
  `modules/<módulo>/utils/`, que devolve um `Violation`: um objeto com a mensagem de cada campo
  inválido, vazio quando está tudo certo. As regras seguem as da API, como os limites de tamanho. Um `id` fora do formato UUID vira "projeto não encontrado" sem passar pela
  API. A resposta é imediata, e a requisição inútil nem sai.
- **O back-end continua validando tudo**, inclusive o que o front já barra, porque qualquer pessoa
  chama a API direto, pelo curl ou pelo Postman.

---

## Antes de cada commit

```bash
npm run check         # os três abaixo, em ordem; é o comando de um pipeline
npm run build         # tsc -b: erro de tipo quebra o build (o npm run dev não confere tipos)
npm run lint          # ESLint
npm run format:check  # Prettier, inclusive a ordem dos imports
```

- **ESLint:** as regras recomendadas do JavaScript e do `typescript-eslint`, mais dois plugins:
  - o `react-hooks`, com as regras dos hooks, o `exhaustive-deps` e as regras do React Compiler, como
    `immutability`;
  - o `react-refresh`, que exige que um arquivo `.tsx` exporte só componentes, para o Fast Refresh
    funcionar.
- **Prettier:** os padrões escritos no `.prettierrc` (80 colunas, aspas duplas, ponto e vírgula e
  vírgula final), mais dois plugins:
  - o `prettier-plugin-organize-imports` (decidido em 01/11), que ordena os imports e remove os não
    usados com o mesmo motor do "Organize Imports" do VS Code (Shift+Alt+O). O `npm run format` arruma, e
    o `npm run format:check` falha se um arquivo estiver fora de ordem;
  - o do Tailwind, que ordena as classes. Ele precisa ser o último da lista de plugins.
- **Commits:** [Conventional Commits](https://www.conventionalcommits.org/) em inglês, como em todos os
  repositórios. As regras ficam no `CLAUDE.md` do guarda-chuva.
