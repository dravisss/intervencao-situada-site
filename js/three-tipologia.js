document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("d3-tipologia");
    if (!container) return;

    container.innerHTML = "";
    container.style.position = "relative";
    container.style.cursor = "pointer";

    // Create Tooltip
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.background = 'var(--surface-color)';
    tooltip.style.color = 'var(--text-color)';
    tooltip.style.padding = '15px';
    tooltip.style.borderRadius = '8px';
    tooltip.style.boxShadow = '0 5px 25px rgba(0,0,0,0.15)';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s';
    tooltip.style.fontFamily = 'var(--font-sans)';
    tooltip.style.maxWidth = '250px';
    tooltip.style.zIndex = '10';
    container.appendChild(tooltip);

    const width = container.clientWidth;
    const height = 500;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    scene.fog = new THREE.FogExp2(0x1a1a1a, 0.02);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 25;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(10, 20, 20);
    scene.add(pointLight);

    const data = [
        { name: "Disjunção", family: "Contradição", color: 0xE63946, desc: "Regimes que coexistem sem se fundir. O que não se alinha." },
        { name: "Paradoxo", family: "Contradição", color: 0xE63946, desc: "Dois bens desejáveis se tensionando mutuamente." },
        { name: "Fratura", family: "Contradição", color: 0xE63946, desc: "O desenho da estrutura coloca partes em conflito." },
        { name: "Compressão", family: "Movimento", color: 0x457b9d, desc: "Sobre-territorialização local. A energia existe mas não flui." },
        { name: "Estagnação", family: "Movimento", color: 0x457b9d, desc: "Ausência de movimento e desterritorialização. Congelamento." },
        { name: "Turbulência", family: "Movimento", color: 0x457b9d, desc: "Mudança constante, excesso de desterritorialização sem direção." },
        { name: "Atração", family: "Adjacência", color: 0x2a9d8f, desc: "Exceção positiva que atua como um ímã (atrator)." },
        { name: "Cap. Latente", family: "Adjacência", color: 0x2a9d8f, desc: "Saber existente mas que não encontrou seu contexto." },
        { name: "Emergência", family: "Adjacência", color: 0x2a9d8f, desc: "A tentativa de nascer que está travada por uma restrição." }
    ];

    const objects = [];
    const group = new THREE.Group();
    scene.add(group);

    const geometry = new THREE.IcosahedronGeometry(1.5, 3);
    
    data.forEach((item, i) => {
        const material = new THREE.MeshStandardMaterial({
            color: item.color,
            metalness: 0.1,
            roughness: 0.2,
            transparent: true,
            opacity: 0.9,
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        const angle = (i / data.length) * Math.PI * 2;
        const radius = 8;
        mesh.position.x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
        mesh.position.y = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
        mesh.position.z = (Math.random() - 0.5) * 6;

        mesh.userData = {
            name: item.name,
            family: item.family,
            desc: item.desc,
            baseY: mesh.position.y,
            speed: Math.random() * 0.02 + 0.01,
            offset: Math.random() * Math.PI * 2,
            baseColor: item.color
        };

        group.add(mesh);
        objects.push(mesh);
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredObj = null;

    container.addEventListener('mousemove', (event) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(objects);

        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
            if (hoveredObj !== intersects[0].object) {
                if (hoveredObj) {
                    hoveredObj.scale.set(1, 1, 1);
                    hoveredObj.material.emissive.setHex(0x000000);
                }
                hoveredObj = intersects[0].object;
                hoveredObj.scale.set(1.25, 1.25, 1.25);
                hoveredObj.material.emissive.setHex(hoveredObj.userData.baseColor);
                hoveredObj.material.emissiveIntensity = 0.5;
                
                const hexColor = '#' + hoveredObj.userData.baseColor.toString(16).padStart(6, '0');
                
                tooltip.style.opacity = '1';
                tooltip.innerHTML = `
                    <strong style="color: ${hexColor}; font-size: 1.1em; display:block; margin-bottom: 5px;">${hoveredObj.userData.name}</strong>
                    <span style="font-size: 0.8em; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; display:block; margin-bottom: 8px;">Família: ${hoveredObj.userData.family}</span>
                    <p style="margin: 0; font-size: 0.95em; line-height: 1.4; color: var(--text-color);">${hoveredObj.userData.desc}</p>
                `;
            }
            
            // Adjust tooltip position to stay inside container
            let tipX = event.clientX - rect.left + 20;
            let tipY = event.clientY - rect.top + 20;
            
            if (tipX + 250 > width) tipX -= 280;
            if (tipY + 100 > height) tipY -= 120;
            
            tooltip.style.left = tipX + 'px';
            tooltip.style.top = tipY + 'px';
        } else {
            document.body.style.cursor = 'default';
            if (hoveredObj) {
                hoveredObj.scale.set(1, 1, 1);
                hoveredObj.material.emissive.setHex(0x000000);
                hoveredObj = null;
                tooltip.style.opacity = '0';
            }
        }
    });

    container.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
        if (hoveredObj) {
            hoveredObj.scale.set(1, 1, 1);
            hoveredObj.material.emissive.setHex(0x000000);
            hoveredObj = null;
            tooltip.style.opacity = '0';
        }
    });

    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        group.rotation.y = time * 0.1;
        group.rotation.z = Math.sin(time * 0.05) * 0.2;

        objects.forEach(obj => {
            obj.position.y = obj.userData.baseY + Math.sin(time * 2 * obj.userData.speed + obj.userData.offset) * 1.5;
            obj.rotation.x += 0.01;
            obj.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        const newWidth = container.clientWidth;
        camera.aspect = newWidth / height;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, height);
    });
});