# Mocks visuais

Referência de telas no estilo de um arquivo Figma. Estes arquivos não entram no runtime do Next.js. A aplicação continua em `src/`. Capturas e vídeos já versionados ficam em `public/assets/design/`.

## Taxonomia

| Pasta | Tela |
| --- | --- |
| `00-design-system` | Tokens, cartões, selos e medidores reutilizáveis |
| `01-home` | Página inicial |
| `02-busca` | `/busca` |
| `03-politicos` | Perfil em `/politicos/[id]` |
| `04-votacoes` | `/votacoes` |
| `05-indicadores` | `/indicadores` |
| `06-esferas` | `/esferas/[slug]` |

O prefixo numérico fixa a ordem de leitura. Não renomeie uma pasta sem atualizar este índice.

## Padrão visual

- Superfície clara, cartão com `rounded-xl`, borda e sombra leve.
- Esferas na borda do perfil: Política verde (`green-600`), Judiciário azul (`blue-600`), Academia cinza claro (`zinc-300`), Segurança cinza escuro (`zinc-700`).
- Situação do mandato: verde em exercício, azul candidato, cinza claro fora do mandato, cinza escuro encerrado.
- Carisma é a nota de 0 a 5. Gestão é o índice de 0 a 100. Os dois permanecem separados.
- O medidor de gestão é um semicírculo: vermelho (`#ef4444`), âmbar (`#f59e0b`) e verde (`#10b981`).
- Gemas pelo índice de gestão: Bronze abaixo de 50, Prata até 69, Ouro até 79, Platina até 89, Diamante a partir de 90. O ícone é um losango facetado.
- Texto de interface em português. Não desenhe partido nem estado no perfil: essas colunas não existem em `public_profiles`.
