# NFT Marketplace

Um marketplace de NFTs responsivo e interativo desenvolvido com Next.js, TypeScript, Redux Toolkit e TanStack Query.

## Funcionalidades

### Carrinho de Compras
- Adicionar/remover itens com feedback visual
- Controle de quantidade (incrementar/decrementar)
- Cálculo automático do total
- Contador de itens no header (com limite 99+)
- Persistência no localStorage via middleware Redux
- Drawer animado com Framer Motion
- **Checkout flow** com loading state e feedback de sucesso

### Listagem de NFTs
- **Infinite scroll** com Intersection Observer
- Barra de progresso de carregamento
- Skeleton loaders durante fetch
- Estados de erro com retry automático
- Cache inteligente com TanStack Query

### Página de Detalhes
- Renderização estática (SSG) para performance
- Metadados dinâmicos para SEO e Open Graph
- Revalidação incremental (ISR 60s)
- Suspense boundaries com fallback

### UI/UX
- **Animações suaves** com Framer Motion (fade-in, hover, transitions)
- **Design responsivo** mobile-first com SASS Modules
- Componentes reutilizáveis com variantes (Button)
- Página 404 customizada

### Acessibilidade
- Labels ARIA em elementos interativos
- Navegação por teclado (Escape fecha o carrinho)
- Contraste de cores adequado (WCAG)
- Semântica HTML correta

### Testes
- **Jest** com React Testing Library para testes unitários
- **Playwright** para testes E2E (end-to-end)
- Testes unitários do cartSlice (reducers e selectors)
- Testes de componente NFTCard e CartDrawer
- MSW para mock de chamadas API
- Cobertura mínima configurada: 50%

## Tech Stack

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| [Next.js](https://nextjs.org/) | 16.1.6 | Framework React com App Router |
| [React](https://react.dev/) | 19.2.4 | Biblioteca de UI |
| [TypeScript](https://www.typescriptlang.org/) | 5.9.3 | Tipagem estática |
| [Redux Toolkit](https://redux-toolkit.js.org/) | 2.11.2 | Gerenciamento de estado global |
| [TanStack Query](https://tanstack.com/query) | 5.90.20 | Data fetching e cache |
| [Framer Motion](https://www.framer.com/motion/) | 12.29.2 | Animações declarativas |
| [SASS](https://sass-lang.com/) | 1.97.3 | Estilização modular (CSS Modules) |
| [Jest](https://jestjs.io/) | 30.2.0 | Testes unitários e de componente |
| [Playwright](https://playwright.dev/) | 1.50.x | Testes E2E cross-browser |
| [MSW](https://mswjs.io/) | 2.12.7 | Mock Service Worker para testes |
| [Docker](https://www.docker.com/) | - | Containerização multi-stage |

## Início Rápido

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- Docker (opcional)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/LGustavos/starsoft-frontend-challenge.git
cd starsoft-frontend-challenge

# Instale as dependências
npm install

# Copie o arquivo de variáveis de ambiente
cp .env.local.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

### Com Docker

```bash
# Desenvolvimento
docker-compose up

# Ou construa a imagem de produção
docker build -t nft-marketplace .
docker run -p 3000:3000 nft-marketplace
```

### Variáveis de Ambiente

Crie um arquivo `.env.local` baseado no `.env.local.example`:

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `NEXT_PUBLIC_API_URL` | URL base da API | `https://api-challenge.starsoft.games/api/v1` |
| `NEXT_PUBLIC_ENABLE_ANIMATIONS` | Habilitar animações | `true` |

## Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Compila para produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run lint` | Executa o ESLint |
| `npm run lint:fix` | Corrige problemas do ESLint |
| `npm run format` | Formata código com Prettier |
| `npm run test` | Executa os testes unitários |
| `npm run test:watch` | Executa testes em modo watch |
| `npm run test:coverage` | Gera relatório de cobertura |
| `npm run test:e2e` | Executa testes E2E com Playwright |
| `npm run test:e2e:ui` | Abre Playwright UI mode |
| `npm run docker:dev` | Inicia com Docker Compose |

## Estrutura do Projeto

```
src/
├── app/                    # App Router (páginas)
│   ├── page.tsx            # Home - Listagem de NFTs
│   ├── nft/[id]/           # Página de detalhes do NFT
│   └── layout.tsx          # Layout raiz com providers
├── components/
│   ├── ui/                 # Componentes atômicos (Button, etc.)
│   ├── layout/             # Header, Footer
│   ├── nft/                # NFTCard, NFTGrid, NFTDetail
│   └── cart/               # CartDrawer, CartItem
├── lib/
│   ├── store/              # Redux store e slices
│   ├── query/              # TanStack Query config
│   ├── api/                # Cliente da API
│   └── utils/              # Funções utilitárias
├── hooks/                  # Hooks customizados
├── styles/
│   ├── abstracts/          # Variáveis, mixins, breakpoints
│   └── base/               # Reset, tipografia
└── types/                  # Definições TypeScript
```

## Decisões Técnicas

### Renderização (SSR vs SSG)

| Página | Estratégia | Justificativa |
|--------|------------|---------------|
| Home (`/`) | ISR (60s) | Lista de NFTs pode mudar, revalida periodicamente |
| Detalhe (`/nft/[id]`) | SSG + ISR | Pré-renderiza NFTs conhecidos, fallback para novos |
| Cart Drawer | Client-only | Estado específico do usuário, sem valor para SEO |

### Estado Global

- **Redux Toolkit** para o carrinho de compras com middleware de persistência no localStorage
- **TanStack Query** para cache e sincronização de dados da API

### Estilização

- **SASS Modules** para escopo de estilos por componente
- **Design tokens** extraídos do Figma para consistência visual
- Abordagem **Mobile-first** com breakpoints responsivos

### Performance

- **Dynamic imports** para Framer Motion e DevTools
- **next/image** com lazy loading e blur placeholder
- **React.memo** em componentes de lista
- **Infinite scroll** com Intersection Observer

## API

A aplicação consome a API Starsoft:
- Base URL: `https://api-challenge.starsoft.games/api/v1`
- Documentação: [API Docs](https://starsoft-challenge-7dfd4a56a575.herokuapp.com/v1/docs)

### Endpoints Utilizados

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/products` | Lista NFTs com paginação |
| GET | `/products/:id` | Detalhes de um NFT |

## Testes

### Testes Unitários (Jest)

```bash
# Executar testes unitários
npm test

# Com cobertura
npm run test:coverage

# Modo watch
npm run test:watch
```

### Testes E2E (Playwright)

```bash
# Executar testes E2E
npm run test:e2e

# Modo UI interativo
npm run test:e2e:ui

# Executar em browser específico
npx playwright test --project=chromium
```

### Cobertura de Testes Unitários

- **cartSlice**: Todos os reducers e selectors (addItem, removeItem, incrementQuantity, decrementQuantity, clearCart)
- **NFTCard**: Renderização, interação com carrinho, acessibilidade
- **CartDrawer**: Checkout flow, loading states, success feedback
- **Mocks configurados**: next/navigation, next/image, framer-motion
- **Threshold mínimo**: 50% para branches, functions, lines e statements

### Cobertura de Testes E2E

- **Home Page**: Carregamento de NFTs, infinite scroll
- **Carrinho**: Adicionar/remover itens, checkout completo
- **Navegação**: Fluxo entre páginas, responsividade

## Design

- **Figma**: [Front-end Challenge](https://www.figma.com/design/j9HHfWPPoLyObtlVBeMhTD/Front-end-Challenge)

### Paleta de Cores

| Cor | Hex | Uso |
|-----|-----|-----|
| Primary | `#FF6E30` | Botões, CTAs |
| Background | `#222222` | Fundo da página |
| Surface | `#191A20` | Cards |
| Border | `#393939` | Bordas |
| Text Primary | `#FFFFFF` | Texto principal |
| Text Secondary | `#CCCCCC` | Texto secundário |

## Acessibilidade

- Navegação por teclado
- Labels ARIA em elementos interativos
- Contraste de cores adequado
- Semântica HTML correta

## Arquitetura

### Visão Geral

```
┌─────────────────────────────────────────────────────────────────┐
│                         Next.js App Router                       │
├─────────────────────────────────────────────────────────────────┤
│  RootLayout (Server Component)                                   │
│  └── StoreProvider (Redux)                                       │
│      └── QueryProvider (TanStack Query)                          │
│          └── HydrationBoundary                                   │
│              └── Page Components                                 │
├─────────────────────────────────────────────────────────────────┤
│                      State Management                            │
│  ┌──────────────────────┐    ┌──────────────────────┐          │
│  │   Redux Toolkit      │    │   TanStack Query     │          │
│  │   (Client State)     │    │   (Server State)     │          │
│  │   - Cart items       │    │   - NFT list         │          │
│  │   - Cart UI state    │    │   - NFT details      │          │
│  │   - localStorage     │    │   - Cache & refetch  │          │
│  └──────────────────────┘    └──────────────────────┘          │
├─────────────────────────────────────────────────────────────────┤
│                         API Layer                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  /lib/api/client.ts - Generic fetch wrapper              │   │
│  │  Base URL: https://api-challenge.starsoft.games/api/v1   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Estrutura de Diretórios Detalhada

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Layout raiz com providers
│   ├── page.tsx                 # Home - Listagem de NFTs
│   ├── loading.tsx              # Fallback de loading
│   ├── not-found.tsx            # Página 404
│   └── nft/[id]/                # Rota dinâmica
│       └── page.tsx             # Detalhes do NFT (SSG + ISR)
│
├── components/
│   ├── ui/                      # Componentes atômicos
│   │   ├── Button/              # Botão com variantes
│   │   └── EthIcon/             # Ícone Ethereum SVG
│   ├── layout/                  # Estrutura da página
│   │   ├── Header/              # Navegação + contador carrinho
│   │   └── Footer/              # Rodapé
│   ├── nft/                     # Domínio NFT
│   │   ├── NFTCard/             # Card individual com animações
│   │   ├── NFTGrid/             # Grid com infinite scroll
│   │   ├── NFTSkeleton/         # Skeleton loader
│   │   └── NFTDetail/           # Página de detalhes
│   ├── cart/                    # Domínio Carrinho
│   │   ├── CartDrawer/          # Drawer lateral animado
│   │   └── CartItem/            # Item do carrinho
│   └── animations/              # Componentes de animação
│
├── hooks/                       # Hooks customizados
│   ├── useCart.ts              # Gerenciamento do carrinho
│   ├── useNFTs.ts              # Infinite query para lista
│   └── useNFT.ts               # Query individual por ID
│
├── lib/
│   ├── api/                    # Cliente HTTP
│   │   ├── client.ts           # Fetch wrapper genérico
│   │   └── config.ts           # Configuração de URL
│   ├── query/                  # React Query
│   │   ├── queryClient.ts      # Configuração SSR-safe
│   │   ├── QueryProvider.tsx   # Provider wrapper
│   │   └── options/
│   │       └── nftOptions.ts   # Query keys factory
│   ├── store/                  # Redux
│   │   ├── store.ts            # Store + middleware localStorage
│   │   ├── StoreProvider.tsx   # Provider wrapper
│   │   ├── hooks.ts            # Hooks tipados
│   │   └── slices/
│   │       └── cartSlice.ts    # Reducer + selectors
│   └── utils/                  # Utilitários
│       ├── cn.ts               # Classnames helper
│       └── formatters.ts       # Formatação de preços
│
├── styles/                     # Estilos globais
│   ├── main.scss              # Entry point
│   ├── base/                  # Reset e tipografia
│   │   ├── _reset.scss
│   │   └── _typography.scss
│   └── abstracts/             # Design tokens
│       ├── _variables.scss    # Cores, espaçamentos, etc.
│       ├── _mixins.scss       # Mixins SCSS
│       └── _breakpoints.scss  # Media queries
│
└── types/                     # Definições TypeScript
    ├── nft.ts                # Tipos NFT e API
    └── cart.ts               # Tipos do carrinho
```

### Gerenciamento de Estado

#### Redux Toolkit (Estado do Cliente)

```typescript
// Store Structure
{
  cart: {
    items: CartItem[],    // NFT + quantidade
    isOpen: boolean       // Visibilidade do drawer
  }
}
```

**Actions disponíveis:**
| Action | Descrição |
|--------|-----------|
| `addItem(nft)` | Adiciona ou incrementa NFT |
| `removeItem(id)` | Remove NFT do carrinho |
| `incrementQuantity(id)` | Incrementa quantidade |
| `decrementQuantity(id)` | Decrementa quantidade |
| `clearCart()` | Limpa o carrinho |
| `toggleCart()` | Alterna visibilidade do drawer |

**Selectors otimizados:**
| Selector | Retorno |
|----------|---------|
| `selectCartItems` | Lista de itens |
| `selectCartTotal` | Total calculado |
| `selectCartCount` | Quantidade total |
| `selectIsCartOpen` | Estado do drawer |
| `selectIsItemInCart(id)` | Verifica se NFT está no carrinho |

#### TanStack Query (Estado do Servidor)

```typescript
// Query Keys Factory
nftKeys = {
  all: ['nfts'],
  lists: () => ['nfts', 'list'],
  list: (filters) => ['nfts', 'list', filters],
  details: () => ['nfts', 'detail'],
  detail: (id) => ['nfts', 'detail', id]
}
```

**Configuração:**
- `staleTime`: 60 segundos
- `gcTime`: 5 minutos
- `retry`: 2 tentativas
- `refetchOnWindowFocus`: desabilitado

### Custom Hooks

| Hook | Responsabilidade | Retorno |
|------|------------------|---------|
| `useCart()` | Gerenciamento completo do carrinho | `{ items, total, count, addItem, removeItem, ... }` |
| `useNFTs(rows)` | Lista com infinite scroll | `{ data, fetchNextPage, hasNextPage, isLoading }` |
| `useNFT(id)` | Fetch de NFT individual | `{ data, isLoading, error }` |

### Middleware de Persistência

O estado do carrinho é automaticamente sincronizado com `localStorage` através de um middleware Redux customizado:

```typescript
// Chave versionada para migrações futuras
const STORAGE_KEY = 'nft-marketplace:cart:v2';

// Dados persistidos
{
  items: CartItem[],
  updatedAt: string  // ISO timestamp
}
```

### Padrões de Componentes

#### 1. Memoização
```typescript
// NFTCard é memoizado para evitar re-renders desnecessários
export const NFTCard = memo(function NFTCard({ nft, index }) {
  // ...
});
```

#### 2. Portal para Modais
```typescript
// CartDrawer renderiza no document.body
return createPortal(<DrawerContent />, document.body);
```

#### 3. Animações com Framer Motion
- Entrada escalonada nos cards
- Drawer com spring physics
- AnimatePresence para remoção de itens

#### 4. Otimização de Imagens
```typescript
<Image
  src={nft.image}
  fill
  sizes="(max-width: 640px) 100vw, 25vw"
  priority={index < 4}  // Prioriza primeiras 4 imagens
/>
```

### Fluxo de Dados

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   API       │────▶│  React      │────▶│  Components │
│   Server    │     │  Query      │     │  (UI)       │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    Cache Layer
                    (staleTime: 60s)

┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────▶│   Redux     │────▶│  Components │
│   Action    │     │   Store     │     │  (UI)       │
└─────────────┘     └─────────────┘     └─────────────┘
                          │
                    localStorage
                    (persistência)
```

## Melhorias Futuras

- [ ] Autenticação de usuário
- [ ] Favoritos / Wishlist
- [ ] Filtros e busca de NFTs
- [ ] Integração com carteira Web3
- [x] Testes E2E com Playwright
- [ ] PWA com Service Worker

## Licença

MIT

---

Desenvolvido com 💜 para o desafio Starsoft
