# 🎨 Design System & Style Guide — `DESIGN.md`

> **Instrução para Google Stitch / IAs / Desenvolvedores:**  
> Este documento define a identidade visual, sistema de tokens, padronização de componentes e diretrizes de CSS/JS para o projeto. Todo código HTML, CSS (incluindo classes Tailwind) e componentes de interface gerados **devem obrigatoriamente** seguir os padrões estabelecidos aqui.

---

## 📌 1. Princípios de Design

1. **Clareza e Simplicidade:** Interfaces limpas, foco no conteúdo e hierarquia visual evidente.
2. **Consistência:** Reuso rigoroso de tokens de cor, tipografia e espaçamento em todas as telas.
3. **Acessibilidade (a11y):** Contraste mínimo exigido pela WCAG AA, suporte a navegação por teclado e marcação semântica.
4. **Responsividade Mobile-First:** Design fluido projetado prioritariamente para telas menores e escalado elegantemente para desktop.
5. **Estética Moderna & Clean:** Uso de microinterações discretas, sombras suaves (soft shadows) e cantos arredondados consistentes.

---

## 🎨 2. Paleta de Cores & Tokens

### 2.1. Cores Primárias e Secundárias

| Token | Hex / HSL | Tailwind Class | Aplicação |
| :--- | :--- | :--- | :--- |
| `--color-primary` | `#2563EB` / `217 91% 60%` | `bg-blue-600` / `text-blue-600` | Botões principais, links ativos, marca |
| `--color-primary-hover` | `#1D4ED8` / `217 91% 48%` | `hover:bg-blue-700` | Estado hover de botões primários |
| `--color-primary-light` | `#EFF6FF` / `214 100% 97%` | `bg-blue-50` | Backgrounds destacados, badges |
| `--color-secondary` | `#4F46E5` / `244 75% 59%` | `bg-indigo-600` | Elementos de apoio, accents |
| `--color-secondary-hover` | `#4338CA` / `244 75% 53%` | `hover:bg-indigo-700` | Hover de elementos secundários |

### 2.2. Cores Neutras (Modo Claro & Escuro)

| Token | Light Mode | Dark Mode | Descrição |
| :--- | :--- | :--- | :--- |
| `--color-bg-app` | `#F8FAFC` (`slate-50`) | `#0F172A` (`slate-900`) | Fundo principal da aplicação |
| `--color-bg-card` | `#FFFFFF` (`white`) | `#1E293B` (`slate-800`) | Cards, modais e containers |
| `--color-border` | `#E2E8F0` (`slate-200`) | `#334155` (`slate-700`) | Bordas e divisores |
| `--color-text-main` | `#0F172A` (`slate-900`) | `#F8FAFC` (`slate-50`) | Títulos e texto principal |
| `--color-text-muted` | `#64748B` (`slate-500`) | `#94A3B8` (`slate-400`) | Subtítulos e textos auxiliares |

### 2.3. Cores de Estado e Feedback

| Estado | Token | Hex | Tailwind Class |
| :--- | :--- | :--- | :--- |
| **Sucesso** | `--color-success` | `#10B981` | `emerald-500` |
| **Aviso** | `--color-warning` | `#F59E0B` | `amber-500` |
| **Erro / Perigo** | `--color-danger` | `#EF4444` | `red-500` |
| **Informação** | `--color-info` | `#06B6D4` | `cyan-500` |

---

## 🔤 3. Tipografia

- **Font Family Principal:** `'Inter'`, `-apple-system`, `BlinkMacSystemFont`, `'Segoe UI'`, `Roboto`, `sans-serif`.
- **Font Family Código/Mono:** `'Fira Code'`, `'JetBrains Mono'`, `monospace`.

### 3.1. Escala Tipográfica

| Nível | Tamanho (px / rem) | Peso (Weight) | Tailwind Class | Uso Recomendado |
| :--- | :--- | :--- | :--- | :--- |
| **Display / H1** | `36px` / `2.25rem` | Bold (`700`) | `text-3xl md:text-4xl font-bold` | Páginas de destino, títulos principais |
| **H2** | `28px` / `1.75rem` | SemiBold (`600`) | `text-2xl font-semibold` | Seções principais |
| **H3** | `20px` / `1.25rem` | SemiBold (`600`) | `text-xl font-semibold` | Títulos de cards e modais |
| **Body Large** | `18px` / `1.125rem` | Regular (`400`) | `text-lg font-normal` | Introduções e destaques |
| **Body Normal** | `16px` / `1rem` | Regular (`400`) | `text-base font-normal` | Texto padrão |
| **Body Small** | `14px` / `0.875rem` | Medium (`500`) | `text-sm font-medium` | Labels, tabelas e botões |
| **Caption** | `12px` / `0.75rem` | Regular (`400`) | `text-xs font-normal` | Helpers, timestamps, tooltips |

---

## 📐 4. Espaçamento, Grid e Geometria

### 4.1. Escala de Espaçamento (Base 8px)

- `xs`: `4px` (`space-1` / `p-1`)
- `sm`: `8px` (`space-2` / `p-2`)
- `md`: `16px` (`space-4` / `p-4`)
- `lg`: `24px` (`space-6` / `p-6`)
- `xl`: `32px` (`space-8` / `p-8`)
- `2xl`: `48px` (`space-12` / `p-12`)

### 4.2. Arredondamento de Bordas (Border Radius)

- **Botões e Inputs:** `8px` (`rounded-lg`)
- **Cards e Modais:** `12px` ou `16px` (`rounded-xl` / `rounded-2xl`)
- **Badges / Pills:** `9999px` (`rounded-full`)

### 4.3. Sombras (Elevation / Shadows)

- **Sm (Card hover / Inputs):** `0 1px 2px 0 rgba(0, 0, 0, 0.05)` (`shadow-sm`)
- **Md (Cards / Dropdowns):** `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)` (`shadow-md`)
- **Lg (Modais / Drawers):** `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)` (`shadow-lg`)

---

## 🧩 5. Padrões de Componentes (HTML/CSS)

### 5.1. Botões

```html
<!-- Botão Primário -->
<button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-150">
  Ação Principal
</button>

<!-- Botão Secundário / Outline -->
<button class="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-150">
  Ação Secundária
</button>
```

### 5.2. Cards

```html
<div class="p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
  <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">Título do Card</h3>
  <p class="text-sm text-slate-500 dark:text-slate-400">Conteúdo descritivo do card utilizando a hierarquia visual definida.</p>
</div>
```

### 5.3. Campos de Entrada (Inputs)

```html
<div class="flex flex-col gap-1.5">
  <label for="email" class="text-sm font-medium text-slate-700 dark:text-slate-300">E-mail</label>
  <input 
    type="email" 
    id="email" 
    placeholder="exemplo@dominio.com"
    class="px-3.5 py-2 text-sm text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 placeholder:text-slate-400 transition-all"
  />
</div>
```

---

## 💻 6. Variáveis globais CSS (`variables.css`)

Caso a solução utilize CSS puro ou variáveis customizadas junto com Tailwind, utilize este bloco como base:

```css
:root {
  /* Colors */
  --primary: #2563eb;
  --primary-hover: #1d4ed8;
  --primary-light: #eff6ff;
  
  --bg-app: #f8fafc;
  --bg-card: #ffffff;
  --border-color: #e2e8f0;
  
  --text-main: #0f172a;
  --text-muted: #64748b;
  
  /* Radii */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-normal: 250ms cubic-bezier(0.4, 0, 0.2, 1);
}

.dark {
  --bg-app: #0f172a;
  --bg-card: #1e293b;
  --border-color: #334155;
  
  --text-main: #f8fafc;
  --text-muted: #94a3b8;
}
```

---

## ⚡ 7. Regras Práticas para a IA (Google Stitch Prompt Rules)

Quando o **Google Stitch** ou qualquer assistente gerar código HTML/CSS/JS baseado nesta documentação:

1. **Nunca utilize cores hexadecimais soltas no HTML Inline.** Use sempre as variáveis CSS ou classes equivalentes do Tailwind CSS definidas neste arquivo.
2. **Priorize Semântica HTML5:** Utilize `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<button>`, `<label>` adequadamente.
3. **Animações Discretas:** Transições devem ser suaves (`duration-150` ou `duration-200`). Evite animações excessivas ou lentas.
4. **Estados Interativos OBRIGATÓRIOS:** Todo elemento clicável deve possuir tratamento visual visível para os estados `:hover`, `:focus-visible` e `:active`.
5. **Modo Escuro (Dark Mode):** Toda estrutura HTML deve ser construída contemplando classes de modo escuro (ex: `bg-white dark:bg-slate-800 text-slate-900 dark:text-white`).
6. **Acessibilidade de Formulários:** Todo `<input>` deve ter um `<label>` associado ou um atributo `aria-label`.