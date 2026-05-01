const fs = require('fs');

let content = fs.readFileSync('Tensão Situada - Guia do Aluno.md', 'utf8');

// The block for "1.8 — Sistema vs. Agenciamento"
let r1_8 = /### 1\.8 — Sistema vs\. Agenciamento[\s\S]*?(?=### 1\.9 — Devir)/;
let match1_8 = content.match(r1_8);
if (match1_8) {
  content = content.replace(r1_8, ''); // remove from old position
  
  // rename to 1.2
  let new1_2 = match1_8[0].replace('### 1.8 — Sistema vs. Agenciamento', '### 1.2 — Sistema vs. Agenciamento');
  
  // insert before 1.2 Material e Expressivo
  content = content.replace('### 1.2 — Material e Expressivo', new1_2 + '\n### 1.3 — Material e Expressivo');
}

// Rename the rest sequentially
content = content.replace('### 1.3 — Fluxos de Afetos', '### 1.4 — Fluxos de Afetos');
content = content.replace('### 1.4 — Capacidades', '### 1.5 — Capacidades');
content = content.replace('### Actantes', '### 1.6 — Actantes');
content = content.replace('### 1.5 — Territórios e Desterritorialização', '### 1.7 — Territórios e Desterritorialização');
content = content.replace('### 1.6 — Códigos e Descodificação', '### 1.8 — Códigos e Descodificação');
content = content.replace('### 1.7 — Os parâmetros do agenciamento', '### 1.9 — Os parâmetros do agenciamento');
content = content.replace('### 1.9 — Devir', '### 1.10 — Devir');
content = content.replace('### 1.10 — Contradição como condição', '### 1.11 — Contradição como condição');

fs.writeFileSync('Tensão Situada - Guia do Aluno.md', content);
console.log('Document reordered successfully.');