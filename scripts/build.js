const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Custom extension to handle Obsidian-style callouts
function parseCallouts(markdown) {
    let result = markdown;
    const lines = result.split('\n');
    let inCallout = false;
    let calloutType = '';
    let parsedLines = [];

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        const match = line.match(/^>\s*\[!(\w+)\](.*)/);
        
        if (match) {
            inCallout = true;
            calloutType = match[1].toLowerCase();
            let title = match[2].trim() || calloutType.charAt(0).toUpperCase() + calloutType.slice(1);
            
            parsedLines.push(`<div class="callout callout-${calloutType}">`);
            parsedLines.push(`<div class="callout-title">${title}</div>`);
            parsedLines.push(`<div class="callout-content">`);
            parsedLines.push(''); // Blank line to ensure marked parses inner content as markdown
            continue;
        }
        
        if (inCallout) {
            if (line.startsWith('>')) {
                parsedLines.push(line.replace(/^>\s?/, ''));
            } else if (line.trim() === '') {
                parsedLines.push('');
            } else {
                inCallout = false;
                parsedLines.push(''); // Blank line before closing div
                parsedLines.push(`</div></div>`);
                parsedLines.push(line);
            }
        } else {
            parsedLines.push(line);
        }
    }
    
    if (inCallout) {
        parsedLines.push(''); // Blank line before closing div
        parsedLines.push(`</div></div>`);
    }

    return parsedLines.join('\n');
}

// Fix markdown rendering bug with ** by replacing inline HTML with marked's own logic
// Wait, marked already handles ** if we don't mess up the HTML wrapper. 
// The issue was probably grid elements restricting layout or the blank line above.

function wrapSectionsAndCards(html, title) {
    let headerMatch = html.match(/<h1[^>]*>(.*?)<\/h1>/);
    let h1Text = headerMatch ? headerMatch[1] : title;
    let bodyHtml = html.replace(/<h1[^>]*>.*?<\/h1>/, '');

    let parts = bodyHtml.split(/(<h2[^>]*>)/i);
    
    let result = `
        <section class="hero-article">
            <div class="container">
                <div class="badge">Leitura Profunda</div>
                <h1 class="hero-title">${h1Text}</h1>
            </div>
        </section>
    `;

    if (parts[0].trim()) {
        result += `<section class="landing-section intro-section"><div class="container">${parts[0]}</div></section>`;
    }
    
    let sectionCount = 0;
    for (let i = 1; i < parts.length; i += 2) {
        let h2Tag = parts[i];
        let h2ContentFull = parts[i+1];
        
        let h2TextMatch = h2ContentFull.match(/^(.*?)<\/h2>/);
        let h2Title = h2TextMatch ? h2TextMatch[1] : '';
        let content = h2ContentFull.replace(/^.*?<\/h2>/, '');
        let h2 = h2Tag + h2Title + '</h2>';

        sectionCount++;
        let bgClass = sectionCount % 2 === 0 ? 'bg-alt' : 'bg-light';
        
        let h3Parts = content.split(/(<h3[^>]*>)/i);
        
        if (h3Parts.length > 2) {
            let newContent = h3Parts[0]; 

            if (h2Title.match(/Tipologia da Tensão/i) || h2Title.match(/Tipologia/i)) {
                // Render families as distinct sections and specific tensions as accordions
                for (let j = 1; j < h3Parts.length; j += 2) {
                    let h3Tag = h3Parts[j];
                    let h3ContentFull = h3Parts[j+1];
                    let h3TextMatch = h3ContentFull.match(/^(.*?)<\/h3>/);
                    let h3Title = h3TextMatch ? h3TextMatch[1] : '';
                    let h3Content = h3ContentFull.replace(/^.*?<\/h3>/, '');
                    let h3 = h3Tag + h3Title + '</h3>';

                    let h4Parts = h3Content.split(/(<h4[^>]*>)/i);
                    
                    if (h4Parts.length > 2) {
                        let h4Result = h4Parts[0] + '<div class="accordion-group">';
                        for (let k = 1; k < h4Parts.length; k += 2) {
                            let h4Tag = h4Parts[k];
                            let h4ContentFull = h4Parts[k+1];
                            let h4TextMatch = h4ContentFull.match(/^(.*?)<\/h4>/);
                            let h4Title = h4TextMatch ? h4TextMatch[1].replace(/<[^>]+>/g, '') : '';
                            let h4Content = h4ContentFull.replace(/^.*?<\/h4>/, '');
                            h4Result += `<details class="accordion"><summary>${h4Title}</summary><div class="accordion-content">${h4Content}</div></details>`;
                        }
                        h4Result += '</div>';
                        newContent += `<div class="family-section">${h3}${h4Result}</div>`;
                    } else {
                        newContent += `<div class="family-section">${h3}${h3Content}</div>`;
                    }
                }
            } 
            else if (h2Title.match(/Fundação Conceitual/i) || h2Title.match(/O Conceito Original/i) || h2Title.match(/premissas problemáticas/i)) {
                // Accordions for Concepts instead of grids to save vertical space
                newContent += '<div class="accordion-group">';
                for (let j = 1; j < h3Parts.length; j += 2) {
                    let h3Tag = h3Parts[j];
                    let h3ContentFull = h3Parts[j+1];
                    let h3TextMatch = h3ContentFull.match(/^(.*?)<\/h3>/);
                    let h3Title = h3TextMatch ? h3TextMatch[1].replace(/<[^>]+>/g, '') : '';
                    let h3Content = h3ContentFull.replace(/^.*?<\/h3>/, '');
                    newContent += `<details class="accordion concept-accordion"><summary>${h3Title}</summary><div class="accordion-content">${h3Content}</div></details>`;
                }
                newContent += '</div>';
            }
            else {
                // Default: vertical full-width blocks (NO MORE MULTI-COL CARDS)
                newContent += '<div class="vertical-blocks">';
                for (let j = 1; j < h3Parts.length; j += 2) {
                    let h3Tag = h3Parts[j];
                    let h3ContentFull = h3Parts[j+1];
                    let h3TextMatch = h3ContentFull.match(/^(.*?)<\/h3>/);
                    let h3Title = h3TextMatch ? h3TextMatch[1] : '';
                    let h3Content = h3ContentFull.replace(/^.*?<\/h3>/, '');
                    let h3 = h3Tag + h3Title + '</h3>';
                    newContent += `<div class="content-block">${h3}${h3Content}</div>`;
                }
                newContent += '</div>';
            }
            content = newContent;
        }

        result += `<section class="landing-section ${bgClass}"><div class="container">${h2}${content}</div></section>`;
    }
    
    return result;
}

function generateHTML(title, contentHtml) {
    return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} | O Pesca</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
</head>
<body>
    <header class="site-header">
        <div class="container">
            <a href="index.html" class="logo">🕸️ Intervenção Situada</a>
            <nav class="nav-links">
                <a href="revisao-critica.html">Revisão Crítica</a>
                <a href="tensao-situada.html">Tensão Situada</a>
                <a href="perturbacoes.html">Perturbações</a>
                <a href="exercicios.html">Exercícios</a>
                <a href="exemplos-canvas.html">Exemplos</a>
            </nav>
        </div>
    </header>

    <main class="article-wrapper">
        ${contentHtml}
    </main>

    <footer class="site-footer">
        <div class="container">
            <p>O Pesca - Construído para a comunidade.</p>
        </div>
    </footer>

    <button id="theme-toggle" class="theme-toggle" aria-label="Alternar tema escuro/claro">🌙</button>
    <button id="back-to-top" class="back-to-top" aria-label="Voltar ao topo">↑</button>

    <script src="js/script.js"></script>
</body>
</html>`;
}

function build() {
    const rootDir = path.resolve(__dirname, '..', '..');
    const siteDir = path.resolve(__dirname, '..');

    const revisaoFile = path.join(rootDir, 'Revisão Crítica do conceito de Tensão Criativa.md');
    const guiaFile = path.join(rootDir, 'Tensão Situada - Guia do Aluno.md');
    const exemplosFile = path.join(rootDir, 'Exemplos de Canvas de Tensão.md');

    // Setup marked with explicit break handling
    marked.setOptions({
        gfm: true,
        breaks: true,
        headerIds: true,
        mangle: false,
    });

    const indexHtml = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Repensando a Intervenção Social | O Pesca</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
</head>
<body class="home dark-theme" data-theme="dark">
    <main class="hero elegant-hero">
        <div class="hero-content">
            <div class="elegant-badge">GUIA DE INTERVENÇÕES EM SISTEMAS SOCIAIS</div>
            <h1 class="hero-title">Repensando a <span class="gold-italic">Intervenção Social</span></h1>
            <p class="hero-subtitle">Uma jornada profunda sobre como entendemos, definimos e atuamos em sistemas complexos. Para além das receitas prontas e frameworks genéricos.</p>
        </div>
    </main>

    <section class="elegant-section">
        <div class="container">
            <div class="section-header">
                <h2>Artigos Fundamentais</h2>
                <p>Textos que desafiam premissas tradicionais e propõem novas formas de intervenção em sistemas sociais.</p>
            </div>
            
            <div class="elegant-cards-container">
                <a href="revisao-critica.html" class="elegant-card">
                    <div class="card-glow"></div>
                    <div class="card-inner">
                        <span class="card-tag">ARTIGO 01</span>
                        <h2>Revisão Crítica do Conceito de Tensão Criativa</h2>
                        <p>Uma análise profunda sobre como a forma como definimos problemas é um ato político e simbólico. Questionando as premissas ocultas por trás das intervenções em sistemas complexos.</p>
                        <div class="card-footer">
                            <span class="read-time">Leitura: ~25 min</span>
                            <span class="read-link">Ler artigo &rarr;</span>
                        </div>
                    </div>
                </a>

                <a href="tensao-situada.html" class="elegant-card">
                    <div class="card-glow"></div>
                    <div class="card-inner">
                        <span class="card-tag">ARTIGO 02</span>
                        <h2>Tensão Situada</h2>
                        <p>Um método prático que propõe uma nova abordagem para intervenções em sistemas sociais. Saindo do "onde estamos/para onde vamos" para uma compreensão situada e contextual.</p>
                        <div class="card-footer">
                            <span class="read-time">Leitura: ~30 min</span>
                            <span class="read-link">Ler artigo &rarr;</span>
                        </div>
                    </div>
                </a>

                <a href="exemplos-canvas.html" class="elegant-card">
                    <div class="card-glow"></div>
                    <div class="card-inner">
                        <span class="card-tag">MATERIAL PRÁTICO</span>
                        <h2>Exemplos de Canvas</h2>
                        <p>Casos reais diagnosticados e preenchidos no Canvas da Tensão Situada para você se inspirar e aplicar na prática.</p>
                        <div class="card-footer">
                            <span class="read-time">Estudo de Casos</span>
                            <span class="read-link">Ver exemplos &rarr;</span>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </section>
    
    <script src="js/script.js"></script>
</body>
</html>`;

    fs.writeFileSync(path.join(siteDir, 'index.html'), indexHtml);

    const revisaoMd = fs.readFileSync(revisaoFile, 'utf-8');
    const revisaoPreprocessed = parseCallouts(revisaoMd);
    const revisaoParsed = marked.parse(revisaoPreprocessed);
    const revisaoLanding = wrapSectionsAndCards(revisaoParsed, "Revisão Crítica da Tensão Criativa");
    fs.writeFileSync(path.join(siteDir, 'revisao-critica.html'), generateHTML('Revisão Crítica', revisaoLanding));

    const guiaMd = fs.readFileSync(guiaFile, 'utf-8');
    const guiaPreprocessed = parseCallouts(guiaMd);
    const guiaParsed = marked.parse(guiaPreprocessed);
    let guiaLanding = wrapSectionsAndCards(guiaParsed, "Tensão Situada: Um Guia para Agentes de Mudança");

    // Subsituição do Canvas ASCII por layout HTML no Guia
    const asciiRegex = /<pre><code[^>]*>(?:┌─+┐)?[\s\S]*?CANVAS DA TENSÃO SITUADA[\s\S]*?<\/code><\/pre>/;
    const fancyCanvas = `
    <div class="fancy-canvas">
        <div class="canvas-header">
            <h3>CANVAS DA TENSÃO SITUADA</h3>
        </div>
        <div class="canvas-body">
            <div class="canvas-title-group">
                <h3 class="canvas-main-title">[três ou quatro palavras emblemáticas]</h3>
                <p class="canvas-main-subtitle">[uma sentença que sintetiza o problema]</p>
            </div>

            <div class="canvas-section">
                <h4>DESCRIÇÃO DA TENSÃO</h4>
                <p>O que acontece no momento atual que aumenta ou diminui as capacidades dos atores na organização?</p>
                <div class="canvas-input-area">[Definição em um parágrafo]</div>
            </div>
            <div class="canvas-section">
                <h4>ACTANTES</h4>
                <p>Que elementos materiais e expressivos compõem esta tensão?</p>
                <span class="canvas-hint">(atores, fatores estruturais, ganhos ocultos, pressupostos)</span>
                <div class="canvas-input-area large"></div>
            </div>
            <div class="canvas-section">
                <h4>CAPACIDADES</h4>
                <p>O que AUMENTA a potência de agir aqui? O que DIMINUI?</p>
                <span class="canvas-hint">Quem/o que afeta quem/o quê?</span>
                <div class="canvas-input-area large"></div>
            </div>
        </div>
    </div>
    `;
    guiaLanding = guiaLanding.replace(asciiRegex, fancyCanvas);

    fs.writeFileSync(path.join(siteDir, 'tensao-situada.html'), generateHTML('Tensão Situada', guiaLanding));

    // Exemplos de Canvas
    const exemplosMd = fs.readFileSync(exemplosFile, 'utf-8');
    const tensions = exemplosMd.split(/^## /m).filter(s => s.trim() !== '');
    
    let exemplosHtml = `
        <section class="hero-article">
            <div class="container">
                <div class="badge">Prática</div>
                <h1 class="hero-title">Exemplos de Canvas</h1>
            </div>
        </section>
        <section class="landing-section bg-light">
            <div class="container">
                <div class="vertical-blocks">
    `;
    
    tensions.forEach(tensionBlock => {
        const titleMatch = tensionBlock.match(/^(.*?)\n/);
        const title = titleMatch ? titleMatch[1].replace(/^Tensão \d+: /, '').trim() : '';
        
        const subtitleMatch = tensionBlock.match(/### Subtítulo\n([\s\S]*?)(?=### |$)/);
        const subtitle = subtitleMatch ? marked.parse(subtitleMatch[1]).trim() : '';
        
        const descMatch = tensionBlock.match(/### Descrição da tensão\n([\s\S]*?)(?=### |$)/);
        const desc = descMatch ? marked.parse(descMatch[1]).trim() : '';
        
        const actantesMatch = tensionBlock.match(/### Actantes\n([\s\S]*?)(?=### |$)/);
        const actantes = actantesMatch ? marked.parse(actantesMatch[1]).trim() : '';
        
        const capMatch = tensionBlock.match(/### Capacidades\n([\s\S]*?)(?=### |$)/);
        const capacidades = capMatch ? marked.parse(capMatch[1]).trim() : '';

        if (title) {
            exemplosHtml += `
            <div class="fancy-canvas" style="margin-bottom: 60px;">
                <div class="canvas-header">
                    <h3>CANVAS DA TENSÃO SITUADA</h3>
                </div>
                <div class="canvas-body">
                    <div class="canvas-title-group">
                        <h3 class="canvas-main-title">${title}</h3>
                        <div class="canvas-main-subtitle">${subtitle}</div>
                    </div>
                    <div class="canvas-section">
                        <h4>DESCRIÇÃO DA TENSÃO</h4>
                        <p>O que acontece no momento atual que aumenta ou diminui as capacidades dos atores na organização?</p>
                        <div class="canvas-input-area large" style="text-align: left; color: var(--text-color); padding: 25px; background: rgba(0,0,0,0.01); border: 1px solid var(--border-color);">${desc}</div>
                    </div>
                    <div class="canvas-section">
                        <h4>ACTANTES</h4>
                        <p>Que elementos materiais e expressivos compõem esta tensão?</p>
                        <div class="canvas-input-area large" style="text-align: left; color: var(--text-color); padding: 25px; background: rgba(0,0,0,0.01); border: 1px solid var(--border-color);">${actantes}</div>
                    </div>
                    <div class="canvas-section">
                        <h4>CAPACIDADES</h4>
                        <p>O que AUMENTA a potência de agir aqui? O que DIMINUI?</p>
                        <div class="canvas-input-area large" style="text-align: left; color: var(--text-color); padding: 25px; background: rgba(0,0,0,0.01); border: 1px solid var(--border-color);">${capacidades}</div>
                    </div>
                </div>
            </div>
            `;
        }
    });

    exemplosHtml += `
                </div>
            </div>
        </section>
    `;

    fs.writeFileSync(path.join(siteDir, 'exemplos-canvas.html'), generateHTML('Exemplos de Canvas', exemplosHtml));

    console.log('Dynamic site generated successfully in /site!');
}

build();
