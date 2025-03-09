// Constantes físicas
const GAMMA = 5/3; // Coeficiente adiabático (gas monoatómico)
const GAMMA_DISPLAY = "5/3"; // Representación de GAMMA como fracción para mostrar en la interfaz
const R = 8.31; // Constante de los gases ideales en J/(mol·K)
const PROCESS_TYPES = ["Adiabático", "Isocórico", "Isotérmico", "Isobárico", "Lineal P-V"];
const PROCESS_TYPES_KEYS = ["adiabatic", "isochoric", "isothermal", "isobaric", "linear"];
const PROCESS_COLORS = ["#8b5cf6", "#ef4444", "#10b981", "#3b82f6", "#f97316"];
const CV = "3R/2"; // Capacidad calorífica a volumen constante para gas monoatómico
const CP = "5R/2"; // Capacidad calorífica a presión constante para gas monoatómico

// Definiciones de ciclos termodinámicos predefinidos
const PREDEFINED_CYCLES = {
    // Los valores representan los índices de PROCESS_TYPES
    // 0: Adiabático, 1: Isocórico, 2: Isotérmico, 3: Isobárico, 4: Lineal P-V
    carnot: {
        name: "Ciclo de Carnot",
        processes: [2, 0, 2, 0] // Isotérmico, Adiabático, Isotérmico, Adiabático
    },
    otto: {
        name: "Ciclo de Otto",
        processes: [1, 0, 1, 0] // Isocórico, Adiabático, Isocórico, Adiabático
    },
    diesel: {
        name: "Ciclo Diesel",
        processes: [0, 3, 0, 1] // Adiabático, Isobárico, Adiabático, Isocórico
    },
    rankine: {
        name: "Ciclo Rankine",
        processes: [3, 0, 1, 2] // Isobárico, Adiabático, Isocórico, Isotérmico
    },
    brayton: {
        name: "Ciclo Brayton",
        processes: [0, 3, 0, 3] // Adiabático, Isobárico, Adiabático, Isobárico
    }
};

// Variables globales
let cycleData = [];
let currentCycleType = "random";
let viewCycle = false;
let numMoles = 1; // Número de moles (1 por defecto)

// Variables para el sistema de gamificación
let gameState = {
    points: 0,
    energy: 50,  // Valor entre 0 y 100
    validatedCells: new Set(),
    currentDifficulty: 0
};

// Configuración del localStorage
const GAME_STATE_KEY = 'thermoCycleGameState';

// Objeto para gestionar el sistema de puntuaciones y gamificación
const gamificationSystem = {
    // Calcula la dificultad del ciclo actual basado en número de procesos y tipos diferentes
    calculateDifficulty: function(cycleData) {
        if (!cycleData || cycleData.length === 0) return 0;
        
        // Contar el número total de procesos
        const totalProcesses = cycleData.length;
        
        // Contar los tipos diferentes de procesos
        const processTypes = new Set();
        cycleData.forEach(point => {
            if (point.processType !== undefined) {
                processTypes.add(point.processType);
            }
        });
        const differentProcesses = processTypes.size;
        
        // Aplicar la fórmula de dificultad
        // Dificultad = (Procesos diferentes × 1.5) + (Total de procesos × 0.5)
        const calculatedDifficulty = (differentProcesses * 1.5) + (totalProcesses * 0.5);
        
        // Normalizar a un nivel del 1 al 5
        let difficultyLevel = 1;
        if (calculatedDifficulty >= 3.0 && calculatedDifficulty <= 4.0) difficultyLevel = 1;
        else if (calculatedDifficulty > 4.0 && calculatedDifficulty <= 5.5) difficultyLevel = 2;
        else if (calculatedDifficulty > 5.5 && calculatedDifficulty <= 7.0) difficultyLevel = 3;
        else if (calculatedDifficulty > 7.0 && calculatedDifficulty <= 8.5) difficultyLevel = 4;
        else if (calculatedDifficulty > 8.5) difficultyLevel = 5;
        
        return difficultyLevel;
    },
    
    // Actualiza la visualización de dificultad en el panel de gamificación
    updateDifficultyDisplay: function(difficultyLevel) {
        const starsElement = document.getElementById('difficulty-stars');
        const valueElement = document.getElementById('difficulty-value');
        
        if (starsElement && valueElement) {
            // Actualizar la visualización de estrellas
            let starsString = '';
            for (let i = 1; i <= 5; i++) {
                starsString += i <= difficultyLevel ? '★' : '☆';
            }
            starsElement.textContent = starsString;
            
            // Actualizar el valor numérico
            valueElement.textContent = `(${difficultyLevel})`;
            
            // Guardar la dificultad actual en el estado de juego
            gameState.currentDifficulty = difficultyLevel;
        }
    },
    
    // Calcula los puntos a otorgar basado en la dificultad
    calculatePoints: function(difficultyLevel) {
        const basePoints = 10;
        const multipliers = [1, 1.5, 2, 3, 4]; // Multiplicadores para niveles 1-5
        return Math.round(basePoints * multipliers[difficultyLevel - 1]);
    },
    
    // Actualiza los puntos del jugador (positivo para aciertos, negativo para errores)
    updatePoints: function(points) {
        gameState.points += points;
        // Eliminamos esta restricción para permitir puntos negativos
        // if (gameState.points < 0) gameState.points = 0;
        
        // Actualizar el display de puntos totales en la interfaz
        const pointsElement = document.getElementById('total-points');
        if (pointsElement) {
            pointsElement.textContent = gameState.points;
        }
        
        // Guardar el estado actualizado
        this.saveGameState();
        
        // Actualizar el color de la barra según los puntos
        this.updateEnergyBarColor();
    },
    
    // Actualiza la barra de energía
    updateEnergyBar: function(amount) {
        gameState.energy += amount;
        if (gameState.energy < 0) gameState.energy = 0;
        if (gameState.energy > 100) gameState.energy = 100;
        
        const energyBar = document.getElementById('energy-bar');
        if (energyBar) {
            energyBar.style.width = `${gameState.energy}%`;
        }
        
        // Actualizar el color de la barra según los puntos
        this.updateEnergyBarColor();
        
        // Guardar el estado actualizado
        this.saveGameState();
    },
    
    // Actualiza el color de la barra de energía según el valor de los puntos
    updateEnergyBarColor: function() {
        const energyBar = document.getElementById('energy-bar');
        if (!energyBar) return;
        
        // Quitar todas las clases de color existentes
        energyBar.classList.remove('positive', 'negative');
        
        // Aplicar la clase correspondiente según el valor de los puntos
        if (gameState.points < 0) {
            energyBar.classList.add('negative');
        } else {
            energyBar.classList.add('positive');
        }
    },
    
    // Muestra una notificación de resultado (correcto/incorrecto)
    showNotification: function(isCorrect, points) {
        const notification = document.getElementById('result-notification');
        if (!notification) return;
        
        // Configurar la notificación según el resultado
        if (isCorrect) {
            notification.textContent = getTranslation('correct_answer').replace('{points}', points);
            notification.className = 'result-notification correct show';
        } else {
            notification.textContent = getTranslation('incorrect_answer');
            notification.className = 'result-notification incorrect show';
        }
        
        // Ocultar la notificación después de 2 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 2000);
    },
    
    // Procesa el resultado de una validación
    processValidation: function(cellId, isCorrect) {
        // Verificar si ya se ha validado esta celda
        if (gameState.validatedCells.has(cellId)) return;
        
        // Marcar la celda como validada
        gameState.validatedCells.add(cellId);
        
        // Calcular puntos según dificultad
        const points = this.calculatePoints(gameState.currentDifficulty);
        
        if (isCorrect) {
            // Sumar puntos y aumentar energía
            this.updatePoints(points);
            this.updateEnergyBar(5);
            this.showNotification(true, points);
        } else {
            // Restar puntos y disminuir energía
            this.updatePoints(-10);
            this.updateEnergyBar(-10);
            this.showNotification(false);
        }
    },
    
    // Guarda el estado del juego en localStorage
    saveGameState: function() {
        localStorage.setItem(GAME_STATE_KEY, JSON.stringify({
            points: gameState.points,
            energy: gameState.energy,
            validatedCells: Array.from(gameState.validatedCells)
        }));
    },
    
    // Carga el estado del juego desde localStorage
    loadGameState: function() {
        const savedState = localStorage.getItem(GAME_STATE_KEY);
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                gameState.points = parsed.points || 0;
                gameState.energy = parsed.energy || 50;
                gameState.validatedCells = new Set(parsed.validatedCells || []);
                
                // Actualizar los puntos totales mostrados
                const pointsElement = document.getElementById('total-points');
                if (pointsElement) {
                    pointsElement.textContent = gameState.points;
                }
                
                // Actualizar la barra de energía
                const energyBar = document.getElementById('energy-bar');
                if (energyBar) {
                    energyBar.style.width = `${gameState.energy}%`;
                }
                
                // Actualizar el color de la barra según los puntos
                this.updateEnergyBarColor();
                
            } catch (e) {
                console.error('Error al cargar el estado del juego:', e);
            }
        }
    },
    
    // Exporta el progreso como un archivo JSON
    exportProgress: function() {
        const dataStr = JSON.stringify({
            points: gameState.points,
            energy: gameState.energy,
            validatedCells: Array.from(gameState.validatedCells),
            timestamp: new Date().toISOString()
        });
        
        // Crear un blob y un enlace para descargar
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'thermocycle_progress.json');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    },
    
    // Importa el progreso desde un archivo JSON
    importProgress: function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    gameState.points = parsed.points || 0;
                    gameState.energy = parsed.energy || 50;
                    gameState.validatedCells = new Set(parsed.validatedCells || []);
                    
                    // Actualizar la interfaz
                    const pointsElement = document.getElementById('total-points');
                    if (pointsElement) {
                        pointsElement.textContent = gameState.points;
                    }
                    
                    const energyBar = document.getElementById('energy-bar');
                    if (energyBar) {
                        energyBar.style.width = `${gameState.energy}%`;
                    }
                    
                    // Guardar en localStorage
                    this.saveGameState();
                    
                    // Mostrar notificación de éxito
                    alert('Progreso importado correctamente.');
                } catch (e) {
                    console.error('Error al importar el progreso:', e);
                    alert('Error al importar el progreso. El archivo podría estar dañado o tener un formato incorrecto.');
                }
            };
            
            reader.readAsText(file);
        };
        
        input.click();
    },
    
    // Inicializa los eventos de los botones de exportar/importar
    initializeButtons: function() {
        const exportBtn = document.getElementById('export-progress-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportProgress());
        }
        
        const importBtn = document.getElementById('import-progress-btn');
        if (importBtn) {
            importBtn.addEventListener('click', () => this.importProgress());
        }
    },
    
    // Inicializa todo el sistema de gamificación
    initialize: function() {
        this.loadGameState();
        this.initializeButtons();
        this.updateEnergyBarColor(); // Asegurar que el color de la barra se inicializa correctamente
    }
};

// Esperar a que se cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el sistema de gamificación
    gamificationSystem.initialize();
    
    // Configurar manejadores de eventos
    const generateBtn = document.getElementById('generate-cycle-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            generateCycle();
        });
    }

    // Añadir botón para compartir si no existe
    let shareBtn = document.getElementById('share-btn');
    if (!shareBtn) {
        shareBtn = document.createElement('button');
        shareBtn.id = 'share-btn';
        
        // Usar traducción si está disponible
        if (typeof getTranslation === 'function') {
            shareBtn.textContent = getTranslation('share_exercise');
            // Añadir atributo data-i18n para futuras actualizaciones
            shareBtn.setAttribute('data-i18n', 'share_exercise');
        } else {
            shareBtn.textContent = 'Compartir Ejercicio';
        }
        
        shareBtn.classList.add('share-button');
        
        // Añadir el botón al contenedor de botones existente
        const buttonContainer = document.querySelector('.graph-button-container');
        if (buttonContainer) {
            buttonContainer.appendChild(shareBtn);
        }
    }
    
    // Añadir el event listener al botón de compartir
    if (shareBtn) {
        shareBtn.addEventListener('click', shareExercise);
    }
    
    const validateBtn = document.getElementById('validate-btn');
    if (validateBtn) {
        validateBtn.addEventListener('click', validateResults);
    }
    
    // Configurar el botón de instrucciones
    const collapseInstructionsBtn = document.getElementById('collapse-instructions');
    if (collapseInstructionsBtn) {
        collapseInstructionsBtn.addEventListener('click', function() {
            const instructions = document.querySelector('.instructions');
            if (instructions) {
                if (instructions.classList.contains('collapsed')) {
                    // Mostrar instrucciones
                    instructions.classList.remove('collapsed');
                    
                    // Actualizar texto del botón
                    if (typeof getTranslation === 'function') {
                        collapseInstructionsBtn.textContent = getTranslation('hide_instructions');
                    } else {
                        collapseInstructionsBtn.textContent = 'Ocultar instrucciones';
                    }
                } else {
                    // Ocultar instrucciones
                    instructions.classList.add('collapsed');
                    
                    // Actualizar texto del botón
                    if (typeof getTranslation === 'function') {
                        collapseInstructionsBtn.textContent = getTranslation('show_instructions');
                    } else {
                        collapseInstructionsBtn.textContent = 'Mostrar instrucciones';
                    }
                }
            }
        });
    }
    
    // Configurar el botón de información de ciclos
    const toggleCyclesInfoBtn = document.getElementById('toggle-cycles-info');
    if (toggleCyclesInfoBtn) {
        toggleCyclesInfoBtn.addEventListener('click', function() {
            const cyclesInfo = document.querySelector('.cycles-info');
            if (cyclesInfo) {
                if (cyclesInfo.classList.contains('collapsed')) {
                    // Mostrar información de ciclos
                    cyclesInfo.classList.remove('collapsed');
                    
                    // Actualizar texto del botón
                    if (typeof getTranslation === 'function') {
                        toggleCyclesInfoBtn.textContent = getTranslation('hide_cycles_info');
                    } else {
                        toggleCyclesInfoBtn.textContent = 'Ocultar información sobre ciclos';
                    }
                } else {
                    // Ocultar información de ciclos
                    cyclesInfo.classList.add('collapsed');
                    
                    // Actualizar texto del botón
                    if (typeof getTranslation === 'function') {
                        toggleCyclesInfoBtn.textContent = getTranslation('show_cycles_info');
                    } else {
                        toggleCyclesInfoBtn.textContent = 'Mostrar información sobre ciclos termodinámicos';
                    }
                }
            }
        });
    }
    
    // Configurar pestañas de ciclos
    const cycleTabs = document.querySelectorAll('.cycle-tab');
    const cycleContents = document.querySelectorAll('.cycle-tab-content');

    cycleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and contents
            cycleTabs.forEach(t => t.classList.remove('active'));
            cycleContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get the cycle name from data-cycle attribute
            const cycleId = tab.getAttribute('data-cycle');
            
            // Add active class to corresponding content
            const targetContent = document.getElementById(`${cycleId}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
                console.log(`Activating content for ${cycleId}-tab`);
            } else {
                console.error(`No se encontró el contenido para el ciclo: ${cycleId}`);
            }
        });
    });
    
    // Cargar ejercicio compartido si existe en la URL
    loadSharedExercise();
    
    // Generar ciclo inicial
    generateCycle();
});

/**
 * Genera un ciclo termodinámico siguiendo el algoritmo proporcionado
 */
function generateCycle() {
    console.log("Generando ciclo termodinámico con algoritmo robusto...");
    
    // Obtener el tipo de ciclo seleccionado
    const cycleTypeSelector = document.getElementById('cycle-type-selector');
    const selectedCycle = cycleTypeSelector.value;
    
    // Generar un número aleatorio de moles entre 0.5 y 3
    numMoles = parseFloat((Math.random() * 2.5 + 0.5).toFixed(2));
    console.log(`Número de moles para este ciclo: ${numMoles}`);
    
    // Limpiar datos previos
    cycleData = [];
    
    // Si no es un ciclo aleatorio, usar el algoritmo original para ciclos predefinidos
    if (selectedCycle !== 'random') {
        cycleData = generatePredefinedCycle(selectedCycle);
        currentCycleType = selectedCycle;
        
        // Calcular la dificultad del ciclo y actualizar la interfaz
        const difficultyLevel = gamificationSystem.calculateDifficulty(cycleData);
        gamificationSystem.updateDifficultyDisplay(difficultyLevel);
        
        // Actualizar la interfaz
        drawGraph();
        displayProblemData();
        setupTable();
        
        // Limpiar la lista de celdas validadas para el nuevo ciclo
        gameState.validatedCells = new Set();
        
        return cycleData;
    }
    
    try {
        // Paso 1: Definir límites para presión y volumen
        const P_MIN = 50;    // kPa
        const P_MAX = 300;   // kPa
        const V_MIN = 20;    // L
        const V_MAX = 100;   // L
        const MAX_ATTEMPTS = 20;  // Máximo número de intentos
        
        // Paso 2: Selección del primer punto (aleatorio)
        const P1 = P_MIN + Math.random() * (P_MAX - P_MIN);
        const V1 = V_MIN + Math.random() * (V_MAX - V_MIN);
        const T1 = (P1 * V1) / (numMoles * R);
        
        const firstPoint = {
            p: P1,
            v: V1,
            t: T1,
            index: 0
        };
        
        // Paso 3: Determinar número y secuencia de procesos
        const numProcesses = 3 + Math.floor(Math.random() * 3); // Entre 3 y 5 procesos
        console.log(`Número de procesos en el ciclo: ${numProcesses}`);
        
        // Generar secuencia de procesos evitando repeticiones consecutivas
        const processTypes = [];
        let prevType = -1;
        
        for (let i = 0; i < numProcesses; i++) {
            let processType;
            do {
                processType = Math.floor(Math.random() * 5); // 0-4 para diferentes tipos
            } while (processType === prevType);
            
            processTypes.push(processType);
            prevType = processType;
        }
        
        // Verificar que el primer y último proceso sean diferentes
        if (processTypes[0] === processTypes[numProcesses-1]) {
            let newType;
            do {
                newType = Math.floor(Math.random() * 5);
            } while (newType === processTypes[numProcesses-1] || newType === processTypes[numProcesses-2]);
            
            processTypes[numProcesses-1] = newType;
        }
        
        console.log("Secuencia de procesos:", processTypes.map(p => PROCESS_TYPES[p]));
        
        // Paso 4: Generación de puntos
        const points = [firstPoint];
        let currentPoint = firstPoint;
        
        // Generar puntos para los primeros N-2 procesos
        for (let i = 0; i < numProcesses - 2; i++) {
            const processType = processTypes[i];
            let nextPoint = null;
            let attempts = 0;
            
            while (attempts < MAX_ATTEMPTS && nextPoint === null) {
                attempts++;
                
                // Generar candidato según el tipo de proceso
                const candidate = generatePointByProcessType(currentPoint, processType);
                
                // Verificar que está dentro de los límites y es válido
                if (candidate && 
                    candidate.p >= P_MIN && candidate.p <= P_MAX && 
                    candidate.v >= V_MIN && candidate.v <= V_MAX &&
                    verifyProcess(currentPoint, candidate, processType)) {
                    nextPoint = candidate;
                }
            }
            
            if (nextPoint === null) {
                console.log(`No se pudo generar un punto válido para el proceso ${i}. Reiniciando...`);
                return generateCycle(); // Reintentar con nuevos parámetros
            }
            
            nextPoint.index = i + 1;
            nextPoint.processType = processType;
            points.push(nextPoint);
            currentPoint = nextPoint;
        }
        
        // Paso 5: Para el penúltimo proceso, generar un punto provisional
        const penultimateIndex = numProcesses - 2;
        const penultimateProcessType = processTypes[penultimateIndex];
        const penultimatePoint = points[points.length - 1];
        
        // Generar punto provisional para el penúltimo proceso
        let provisionalPoint = null;
        let attempts = 0;
        
        while (attempts < MAX_ATTEMPTS && provisionalPoint === null) {
            attempts++;
            const candidate = generatePointByProcessType(penultimatePoint, penultimateProcessType);
            
            if (candidate && 
                candidate.p >= P_MIN && candidate.p <= P_MAX && 
                candidate.v >= V_MIN && candidate.v <= V_MAX &&
                verifyProcess(penultimatePoint, candidate, penultimateProcessType)) {
                provisionalPoint = candidate;
            }
        }
        
        if (provisionalPoint === null) {
            console.log("No se pudo generar un punto provisional para el penúltimo proceso. Reiniciando...");
            return generateCycle(); // Reintentar
        }
        
        // Paso 6: Resolver la intersección entre penúltimo y último proceso para cerrar el ciclo
        const finalProcessType = processTypes[numProcesses - 1];
        
        // Resolver la intersección entre los dos últimos procesos para cerrar el ciclo
        const lastPoint = solveProcessIntersection(penultimatePoint, firstPoint, penultimateProcessType, finalProcessType);
        
        if (!lastPoint) {
            console.log("No se pudo encontrar una intersección válida para cerrar el ciclo. Reiniciando...");
            return generateCycle(); // Reintentar
        }
        
        // Verificar que el punto de intersección esté dentro de límites razonables
        if (lastPoint.p < P_MIN || lastPoint.p > P_MAX || lastPoint.v < V_MIN || lastPoint.v > V_MAX) {
            console.log("Punto de intersección fuera de los límites. Reiniciando...");
            return generateCycle(); // Reintentar
        }
        
        // Paso 7: Añadir los puntos finales y completar el ciclo
        lastPoint.index = numProcesses - 1;
        lastPoint.processType = penultimateProcessType;
        points.push(lastPoint);
        
        // Establecer las relaciones entre puntos
        for (let i = 0; i < points.length; i++) {
            points[i].nextIndex = (i + 1) % points.length; // Usar módulo para que el último punto apunte al primero
            
            // Asignar el tipo de proceso al punto de inicio de ese proceso
            if (i < processTypes.length) {
                points[i].processType = processTypes[i];
            }
        }
        
        // El último punto debe conectarse con el primero usando el tipo de proceso final
        points[points.length - 1].processType = finalProcessType;
        
        // Actualizar variables globales
        cycleData = points;
        currentCycleType = 'random';
        
        // Validar que todos los procesos cumplen las relaciones termodinámicas
        for (let i = 0; i < cycleData.length; i++) {
            const point = cycleData[i];
            const nextIndex = point.nextIndex;
            const nextPoint = cycleData[nextIndex];
            const processType = point.processType;
            
            console.log(`Punto ${i+1}: P=${point.p.toFixed(2)} kPa, V=${point.v.toFixed(2)} L`);
            console.log(`  → Proceso ${PROCESS_TYPES[processType]} a Punto ${nextIndex+1}`);
            
            if (!verifyProcess(point, nextPoint, processType)) {
                console.log(`El proceso ${PROCESS_TYPES[processType]} no cumple las restricciones físicas.`);
                return generateCycle(); // Reintentar
            }
            
            // Validación de cada proceso
            if (processType === 0) { // Adiabático
                const k1 = point.p * Math.pow(point.v, GAMMA);
                const k2 = nextPoint.p * Math.pow(nextPoint.v, GAMMA);
                console.log(`  → Validación Adiabático: k1=${k1.toFixed(2)}, k2=${k2.toFixed(2)}, error=${(Math.abs(k1-k2)/k1*100).toFixed(6)}%`);
            } else if (processType === 1) { // Isocórico
                console.log(`  → Validación Isocórico: v1=${point.v.toFixed(2)}, v2=${nextPoint.v.toFixed(2)}, error=${(Math.abs(point.v-nextPoint.v)/point.v*100).toFixed(6)}%`);
            } else if (processType === 2) { // Isotérmico
                const pv1 = point.p * point.v;
                const pv2 = nextPoint.p * nextPoint.v;
                console.log(`  → Validación Isotérmico: pv1=${pv1.toFixed(2)}, pv2=${pv2.toFixed(2)}, error=${(Math.abs(pv1-pv2)/pv1*100).toFixed(6)}%`);
            } else if (processType === 3) { // Isobárico
                console.log(`  → Validación Isobárico: p1=${point.p.toFixed(2)}, p2=${nextPoint.p.toFixed(2)}, error=${(Math.abs(point.p-nextPoint.p)/point.p*100).toFixed(6)}%`);
            }
        }
        
        console.log("Ciclo generado con éxito:", cycleData);
        
        // Calcular la dificultad del ciclo y actualizar la interfaz
        const difficultyLevel = gamificationSystem.calculateDifficulty(cycleData);
        gamificationSystem.updateDifficultyDisplay(difficultyLevel);
        
        // Actualizar la interfaz
        drawGraph();
        displayProblemData();
        setupTable();
        
        // Limpiar la lista de celdas validadas para el nuevo ciclo
        gameState.validatedCells = new Set();
        
        return cycleData;
    } catch (error) {
        console.error("Error en generateCycle:", error);
        // En caso de error, generar un ciclo simple pero válido
        cycleData = generateSimpleCycle();
        currentCycleType = 'random';
        
        // Calcular la dificultad del ciclo y actualizar la interfaz
        const difficultyLevel = gamificationSystem.calculateDifficulty(cycleData);
        gamificationSystem.updateDifficultyDisplay(difficultyLevel);
        
        // Actualizar la interfaz
        drawGraph();
        displayProblemData();
        setupTable();
        
        // Limpiar la lista de celdas validadas para el nuevo ciclo
        gameState.validatedCells = new Set();
        
        return cycleData;
    }
}

/**
 * Genera un ciclo simple de seguridad en caso de error
 */
function generateSimpleCycle() {
    console.log("Generando ciclo simple de seguridad...");
    
    // Definir 4 puntos para un ciclo rectangular
    const p1 = 100;
    const p2 = 100;
    const p3 = 200;
    const p4 = 200;
    
    const v1 = 50;
    const v2 = 80;
    const v3 = 80;
    const v4 = 50;
    
    // Definir el gas (1 mol)
    numMoles = 1;
    
    const simpleCycle = [
        { p: p1, v: v1, t: (p1 * v1) / (numMoles * R), index: 0, processType: 3, nextIndex: 1 },
        { p: p2, v: v2, t: (p2 * v2) / (numMoles * R), index: 1, processType: 1, nextIndex: 2 },
        { p: p3, v: v3, t: (p3 * v3) / (numMoles * R), index: 2, processType: 3, nextIndex: 3 },
        { p: p4, v: v4, t: (p4 * v4) / (numMoles * R), index: 3, processType: 1, nextIndex: 0 }
    ];
    
    // Actualizar datos globales
    cycleData = simpleCycle;
    
    // Dibujar el ciclo y actualizar la interfaz
    drawGraph();
    displayProblemData();
    setupTable();
    
    return simpleCycle;
}

/**
 * Verifica rigurosamente si un proceso termodinámico entre dos puntos
 * satisface las propiedades físicas del tipo de proceso especificado.
 * Retorna true si el proceso es válido, false en caso contrario.
 */
function verifyProcess(startPoint, endPoint, processType) {
    // Tolerancia máxima para considerar válida la verificación (0.1%)
    const MAX_TOLERANCE = 0.001;
    
    // Log detallado para depuración
    console.log(`Verificando proceso ${PROCESS_TYPES[processType]} entre:`);
    console.log(`Punto inicial: P=${startPoint.p.toFixed(4)} kPa, V=${startPoint.v.toFixed(4)} L, T=${startPoint.t.toFixed(4)} K`);
    console.log(`Punto final: P=${endPoint.p.toFixed(4)} kPa, V=${endPoint.v.toFixed(4)} L, T=${endPoint.t.toFixed(4)} K`);
    
    switch (processType) {
        case 0: // Adiabático: PV^γ = constante
            const k1 = startPoint.p * Math.pow(startPoint.v, GAMMA);
            const k2 = endPoint.p * Math.pow(endPoint.v, GAMMA);
            const diffAdiabatic = Math.abs(k1 - k2) / k1;
            
            console.log(`Constante adiabática inicial: ${k1.toFixed(4)}`);
            console.log(`Constante adiabática final: ${k2.toFixed(4)}`);
            console.log(`Diferencia relativa: ${(diffAdiabatic * 100).toFixed(4)}%`);
            
            if (diffAdiabatic > MAX_TOLERANCE) {
                console.error(`El proceso no satisface la relación adiabática. Diferencia: ${(diffAdiabatic * 100).toFixed(4)}%`);
                return false;
            }
            return true;
            
        case 1: // Isocórico: V = constante
            const diffIsochoric = Math.abs(startPoint.v - endPoint.v) / startPoint.v;
            
            console.log(`Volumen inicial: ${startPoint.v.toFixed(4)} L`);
            console.log(`Volumen final: ${endPoint.v.toFixed(4)} L`);
            console.log(`Diferencia relativa: ${(diffIsochoric * 100).toFixed(4)}%`);
            
            if (diffIsochoric > MAX_TOLERANCE) {
                console.error(`El proceso no satisface la relación isocórica. Diferencia: ${(diffIsochoric * 100).toFixed(4)}%`);
                return false;
            }
            return true;
            
        case 2: // Isotérmico: PV = constante (T = constante)
            const pv1 = startPoint.p * startPoint.v;
            const pv2 = endPoint.p * endPoint.v;
            const diffIsothermal = Math.abs(pv1 - pv2) / pv1;
            
            // También verificamos directamente la temperatura
            const diffTemp = Math.abs(startPoint.t - endPoint.t) / startPoint.t;
            
            console.log(`PV inicial: ${pv1.toFixed(4)} kPa·L`);
            console.log(`PV final: ${pv2.toFixed(4)} kPa·L`);
            console.log(`Diferencia relativa PV: ${(diffIsothermal * 100).toFixed(4)}%`);
            console.log(`Diferencia relativa T: ${(diffTemp * 100).toFixed(4)}%`);
            
            if (diffIsothermal > MAX_TOLERANCE || diffTemp > MAX_TOLERANCE) {
                console.error(`El proceso no satisface la relación isotérmica. Diferencia PV: ${(diffIsothermal * 100).toFixed(4)}%, Diferencia T: ${(diffTemp * 100).toFixed(4)}%`);
                return false;
            }
            return true;
            
        case 3: // Isobárico: P = constante
            const diffIsobaric = Math.abs(startPoint.p - endPoint.p) / startPoint.p;
            
            console.log(`Presión inicial: ${startPoint.p.toFixed(4)} kPa`);
            console.log(`Presión final: ${endPoint.p.toFixed(4)} kPa`);
            console.log(`Diferencia relativa: ${(diffIsobaric * 100).toFixed(4)}%`);
            
            if (diffIsobaric > MAX_TOLERANCE) {
                console.error(`El proceso no satisface la relación isobárica. Diferencia: ${(diffIsobaric * 100).toFixed(4)}%`);
                return false;
            }
            return true;
            
        case 4: // Lineal P-V
            // Calculamos la ecuación de la recta usando los dos puntos
            const m = (endPoint.p - startPoint.p) / (endPoint.v - startPoint.v);
            const b = startPoint.p - m * startPoint.v;
            
            // Verificamos que ambos puntos estén en la recta (deberían estarlo perfectamente)
            const p1_check = m * startPoint.v + b;
            const p2_check = m * endPoint.v + b;
            
            const diff1 = Math.abs(startPoint.p - p1_check) / startPoint.p;
            const diff2 = Math.abs(endPoint.p - p2_check) / endPoint.p;
            
            console.log(`Ecuación de la recta: P = ${m.toFixed(4)}·V + ${b.toFixed(4)}`);
            console.log(`Diferencia relativa punto inicial: ${(diff1 * 100).toFixed(8)}%`);
            console.log(`Diferencia relativa punto final: ${(diff2 * 100).toFixed(8)}%`);
            
            // En teoría estas diferencias deberían ser 0, pero pueden existir pequeños errores de redondeo
            if (diff1 > 1e-10 || diff2 > 1e-10) {
                console.error(`Error en la verificación del proceso lineal. Los puntos no definen exactamente una recta.`);
                return false;
            }
            return true;
            
        default:
            console.error(`Tipo de proceso no reconocido: ${processType}`);
            return false;
    }
}

/**
 * Resuelve la intersección entre dos procesos termodinámicos.
 * Versión simplificada y robusta para garantizar el funcionamiento del simulador.
 */
function solveProcessIntersection(startPoint, endPoint, process1Type, process2Type) {
    console.log(`Resolviendo intersección entre procesos ${PROCESS_TYPES[process1Type]} y ${PROCESS_TYPES[process2Type]}`);
    
    // Casos triviales con solución analítica directa
    
    // Caso: Isocórico + Isobárico
    if ((process1Type === 1 && process2Type === 3) || (process1Type === 3 && process2Type === 1)) {
        const isochoricPoint = process1Type === 1 ? startPoint : endPoint;
        const isobaricPoint = process1Type === 3 ? startPoint : endPoint;
        
        const v = isochoricPoint.v;
        const p = isobaricPoint.p;
        const t = (p * v) / (numMoles * R);
        
        console.log(`  Intersección Isocórico-Isobárico: P=${p.toFixed(2)}, V=${v.toFixed(2)}`);
        return { p, v, t };
    }
    
    // Caso: Isocórico + Isocórico
    if (process1Type === 1 && process2Type === 1) {
        // Solo hay solución si ambos tienen el mismo volumen
        if (Math.abs(startPoint.v - endPoint.v) / startPoint.v < 0.01) {
            const v = startPoint.v;
            const p = (startPoint.p + endPoint.p) / 2; // Valor intermedio
            const t = (p * v) / (numMoles * R);
            console.log(`  Intersección Isocórico-Isocórico: P=${p.toFixed(2)}, V=${v.toFixed(2)}`);
            return { p, v, t };
        }
        console.log("  No hay intersección: Dos procesos isocóricos con diferentes volúmenes");
        return null;
    }
    
    // Caso: Isobárico + Isobárico
    if (process1Type === 3 && process2Type === 3) {
        // Solo hay solución si ambos tienen la misma presión
        if (Math.abs(startPoint.p - endPoint.p) / startPoint.p < 0.01) {
            const p = startPoint.p;
            const v = (startPoint.v + endPoint.v) / 2; // Valor intermedio
            const t = (p * v) / (numMoles * R);
            console.log(`  Intersección Isobárico-Isobárico: P=${p.toFixed(2)}, V=${v.toFixed(2)}`);
            return { p, v, t };
        }
        console.log("  No hay intersección: Dos procesos isobáricos con diferentes presiones");
        return null;
    }
    
    // Caso: Adiabático + Isotérmico
    if ((process1Type === 0 && process2Type === 2) || (process1Type === 2 && process2Type === 0)) {
        const adiabaticPoint = process1Type === 0 ? startPoint : endPoint;
        const isothermalPoint = process1Type === 2 ? startPoint : endPoint;
        
        // Adiabático: PV^γ = k1
        const k1 = adiabaticPoint.p * Math.pow(adiabaticPoint.v, GAMMA);
        
        // Isotérmico: PV = k2
        const k2 = isothermalPoint.p * isothermalPoint.v;
        
        // Solución: V^(γ-1) = k1/k2
        const v = Math.pow(k1/k2, 1/(GAMMA-1));
        const p = k2/v;
        const t = (p * v) / (numMoles * R);
        
        console.log(`  Intersección Adiabático-Isotérmico: P=${p.toFixed(2)}, V=${v.toFixed(2)}`);
        return { p, v, t };
    }
    
    // Para otros casos, implementamos un método numérico de resolución de ecuaciones
    // similar al enfoque de main.py que usa sympy.nsolve
    
    try {
        // Enfoque numérico simplificado para otros casos: generamos una rejilla de puntos
        // y encontramos el que mejor satisface ambas ecuaciones
        
        const GRID_SIZE = 100;
        let bestError = Infinity;
        let bestPoint = null;
        
        // Límites de búsqueda
        const P_MIN = Math.min(startPoint.p, endPoint.p) * 0.5;
        const P_MAX = Math.max(startPoint.p, endPoint.p) * 1.5;
        const V_MIN = Math.min(startPoint.v, endPoint.v) * 0.5;
        const V_MAX = Math.max(startPoint.v, endPoint.v) * 1.5;
        
        for (let i = 0; i < GRID_SIZE; i++) {
            const v = V_MIN + (V_MAX - V_MIN) * (i / (GRID_SIZE - 1));
            
            for (let j = 0; j < GRID_SIZE; j++) {
                const p = P_MIN + (P_MAX - P_MIN) * (j / (GRID_SIZE - 1));
                
                // Calcular el error para ambos procesos
                const error1 = calculateProcessError({ p, v }, startPoint, process1Type);
                const error2 = calculateProcessError({ p, v }, endPoint, process2Type);
                
                // Error total
                const totalError = error1 + error2;
                
                if (totalError < bestError) {
                    bestError = totalError;
                    const t = (p * v) / (numMoles * R);
                    bestPoint = { p, v, t };
                }
            }
        }
        
        if (bestError < 0.01) {
            console.log(`  Intersección numérica: P=${bestPoint.p.toFixed(2)}, V=${bestPoint.v.toFixed(2)}, Error=${bestError.toFixed(6)}`);
            return bestPoint;
        } else {
            console.log(`  No se encontró intersección precisa. Mejor error: ${bestError.toFixed(6)}`);
            return null;
        }
    } catch (error) {
        console.error("Error en método numérico:", error);
        return null;
    }
}

/**
 * Calcula el error relativo entre un punto y un proceso termodinámico.
 * Un valor cercano a cero indica que el punto satisface el proceso.
 */
function calculateProcessError(point, referencePoint, processType) {
    switch (processType) {
        case 0: // Adiabático: PV^γ = k
            const k = referencePoint.p * Math.pow(referencePoint.v, GAMMA);
            const pointK = point.p * Math.pow(point.v, GAMMA);
            return Math.abs(k - pointK) / k;
            
        case 1: // Isocórico: V = constante
            return Math.abs(point.v - referencePoint.v) / referencePoint.v;
            
        case 2: // Isotérmico: PV = constante
            const pv = referencePoint.p * referencePoint.v;
            const pointPV = point.p * point.v;
            return Math.abs(pv - pointPV) / pv;
            
        case 3: // Isobárico: P = constante
            return Math.abs(point.p - referencePoint.p) / referencePoint.p;
            
        case 4: // Lineal: P = mV + b
            // Para procesos lineales, definimos la línea que pasa por el punto de referencia
            // y sigue la dirección general del ciclo
            // Simplificación: usamos la línea entre el punto de referencia y el punto en cuestión
            const m = (point.p - referencePoint.p) / (point.v - referencePoint.v);
            const b = referencePoint.p - m * referencePoint.v;
            
            // Verificar si el punto está en la línea
            const expectedP = m * point.v + b;
            return Math.abs(point.p - expectedP) / point.p;
            
        default:
            return Infinity;
    }
}

/**
 * Genera un ciclo predefinido basado en el tipo seleccionado
 */
function generatePredefinedCycle(selectedCycle) {
    const cycle = PREDEFINED_CYCLES[selectedCycle];
    const processTypes = [...cycle.processes]; // Copia los tipos de procesos
    const numProcesses = processTypes.length;
    
    console.log(`Ciclo seleccionado: ${cycle.name}`);
    console.log(`Número de procesos: ${numProcesses}`);
    console.log("Tipos de procesos:", processTypes.map(p => PROCESS_TYPES[p]));
    
    // Generar el primer punto
    const p1 = 100 + Math.random() * 100; // Presión entre 100-200 kPa
    const v1 = 30 + Math.random() * 40;   // Volumen entre 30-70 L
    const t1 = (p1 * v1) / (numMoles * R);
    
    // Crear el primer punto con todos sus atributos
    const firstPoint = { 
        p: p1, 
        v: v1, 
        t: t1,
        index: 0
    };
    
    // Iniciar array de puntos con el primer punto
    const points = [firstPoint];
    
    // Generar los puntos siguientes de manera secuencial
    let currentPoint = firstPoint;
    
    for (let i = 0; i < numProcesses - 1; i++) {
        const processType = processTypes[i];
        
        // Si estamos en el penúltimo punto, necesitamos asegurar que
        // el último proceso pueda cerrar el ciclo
        if (i === numProcesses - 2) {
            // Generar un punto que permita cerrar el ciclo con el proceso final
            const finalProcessType = processTypes[numProcesses - 1];
            
            // Generar puntos candidatos hasta encontrar uno viable
            let nextPoint = null;
            let attempts = 0;
            const maxAttempts = 50;
            
            while (attempts < maxAttempts) {
                // Generar un candidato usando el proceso actual
                const candidate = generatePointByProcessType(currentPoint, processType);
                
                // Verificar si este punto puede cerrar el ciclo con el primer punto
                if (isProcessValid(candidate, firstPoint, finalProcessType)) {
                    nextPoint = candidate;
                    break;
                }
                
                attempts++;
            }
            
            // Si no se encontró un punto viable después de los intentos máximos, regenerar el ciclo
            if (nextPoint === null) {
                console.log("No se pudo encontrar un punto viable para cerrar el ciclo. Regenerando...");
                return generatePredefinedCycle(selectedCycle); // Intentar de nuevo con el mismo tipo de ciclo
            }
            
            // Asignar índice y agregar al array
            nextPoint.index = i + 1;
            points.push(nextPoint);
            currentPoint = nextPoint;
        } 
        else {
            // Para los demás puntos, simplemente generamos según el proceso
            const nextPoint = generatePointByProcessType(currentPoint, processType);
            nextPoint.index = i + 1;
            points.push(nextPoint);
            currentPoint = nextPoint;
        }
    }
    
    // Asignar los tipos de procesos y los índices de los siguientes puntos
    for (let i = 0; i < points.length; i++) {
        points[i].processType = processTypes[i];
        points[i].nextIndex = (i + 1) % points.length;
    }
    
    // Verificación final: comprobar que todos los procesos son físicamente viables
    let allProcessesValid = true;
    
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const nextIndex = point.nextIndex;
        const nextPoint = points[nextIndex];
        const processType = point.processType;
        
        if (!isProcessValid(point, nextPoint, processType)) {
            console.log(`Proceso inválido detectado entre puntos ${i+1} y ${nextIndex+1}. Regenerando ciclo...`);
            allProcessesValid = false;
            break;
        }
    }
    
    if (!allProcessesValid) {
        return generatePredefinedCycle(selectedCycle); // Intentar de nuevo con el mismo tipo de ciclo
    }
    
    // Actualizar el array global de datos del ciclo
    cycleData = points;
    
    // Verificar y mostrar información detallada sobre los puntos
    for (let i = 0; i < cycleData.length; i++) {
        const point = cycleData[i];
        const nextIndex = point.nextIndex;
        const nextPoint = cycleData[nextIndex];
        const processType = point.processType;
        
        console.log(`Punto ${i+1}: P=${point.p.toFixed(2)} kPa, V=${point.v.toFixed(2)} L`);
        console.log(`  → Proceso ${PROCESS_TYPES[processType]} a Punto ${nextIndex+1}`);
        
        // Verificar que el proceso cumple las leyes físicas
        if (processType === 0) { // Adiabático
            const k1 = point.p * Math.pow(point.v, GAMMA);
            const k2 = nextPoint.p * Math.pow(nextPoint.v, GAMMA);
            console.log(`  → Validación Adiabático: k1=${k1.toFixed(2)}, k2=${k2.toFixed(2)}, error=${(Math.abs(k1-k2)/k1*100).toFixed(6)}%`);
        } else if (processType === 1) { // Isocórico
            console.log(`  → Validación Isocórico: v1=${point.v.toFixed(2)}, v2=${nextPoint.v.toFixed(2)}, error=${(Math.abs(point.v-nextPoint.v)/point.v*100).toFixed(6)}%`);
        } else if (processType === 2) { // Isotérmico
            const pv1 = point.p * point.v;
            const pv2 = nextPoint.p * nextPoint.v;
            console.log(`  → Validación Isotérmico: pv1=${pv1.toFixed(2)}, pv2=${pv2.toFixed(2)}, error=${(Math.abs(pv1-pv2)/pv1*100).toFixed(6)}%`);
        } else if (processType === 3) { // Isobárico
            console.log(`  → Validación Isobárico: p1=${point.p.toFixed(2)}, p2=${nextPoint.p.toFixed(2)}, error=${(Math.abs(point.p-nextPoint.p)/point.p*100).toFixed(6)}%`);
        }
    }
    
    console.log("Ciclo predefinido generado con éxito:", cycleData);
    
    // Retornar los puntos generados
    return points;
}

/**
 * Resuelve el sistema de ecuaciones para determinar el último punto del ciclo,
 * que debe cumplir simultáneamente las restricciones de dos procesos:
 * 1. El proceso que lo conecta con el penúltimo punto
 * 2. El proceso que lo conecta con el primer punto para cerrar el ciclo
 */
function solveLastPoint(penultimatePoint, firstPoint, penultimateProcessType, finalProcessType) {
    // Estas son las combinaciones posibles de procesos y sus soluciones matemáticas
    
    // Función auxiliar para log y depuración
    const logSolution = (type1, type2, solution) => {
        console.log(`Resolviendo sistema para procesos: ${PROCESS_TYPES[type1]} → ? → ${PROCESS_TYPES[type2]}`);
        if (solution) {
            console.log(`  Solución encontrada: P=${solution.p.toFixed(2)}, V=${solution.v.toFixed(2)}`);
        } else {
            console.log("  No se encontró solución compatible");
        }
        return solution;
    };
    
    // Casos donde ambos procesos son restrictivos en P o V
    
    // Caso: Isocórico + Isocórico
    if (penultimateProcessType === 1 && finalProcessType === 1) {
        // Si ambos son isocóricos, solo hay solución si V_penultimate = V_first
        if (Math.abs(penultimatePoint.v - firstPoint.v) / firstPoint.v < 0.01) {
            const p = (Math.random() > 0.5) ? 
                      penultimatePoint.p * (0.7 + Math.random() * 0.6) : 
                      firstPoint.p * (0.7 + Math.random() * 0.6);
            const v = firstPoint.v;
            const t = (p * v) / (numMoles * R);
            return logSolution(penultimateProcessType, finalProcessType, { p, v, t });
        }
        return logSolution(penultimateProcessType, finalProcessType, null);
    }
    
    // Caso: Isobárico + Isobárico
    if (penultimateProcessType === 3 && finalProcessType === 3) {
        // Si ambos son isobáricos, solo hay solución si P_penultimate = P_first
        if (Math.abs(penultimatePoint.p - firstPoint.p) / firstPoint.p < 0.01) {
            const v = (Math.random() > 0.5) ? 
                      penultimatePoint.v * (0.7 + Math.random() * 0.6) : 
                      firstPoint.v * (0.7 + Math.random() * 0.6);
            const p = firstPoint.p;
            const t = (p * v) / (numMoles * R);
            return logSolution(penultimateProcessType, finalProcessType, { p, v, t });
        }
        return logSolution(penultimateProcessType, finalProcessType, null);
    }
    
    // Caso: Isocórico + Isobárico
    if (penultimateProcessType === 1 && finalProcessType === 3) {
        // El punto debe tener V = V_penultimate y P = P_first
        const v = penultimatePoint.v;
        const p = firstPoint.p;
        const t = (p * v) / (numMoles * R);
        return logSolution(penultimateProcessType, finalProcessType, { p, v, t });
    }
    
    // Caso: Isobárico + Isocórico
    if (penultimateProcessType === 3 && finalProcessType === 1) {
        // El punto debe tener P = P_penultimate y V = V_first
        const p = penultimatePoint.p;
        const v = firstPoint.v;
        const t = (p * v) / (numMoles * R);
        return logSolution(penultimateProcessType, finalProcessType, { p, v, t });
    }
    
    // Casos con procesos Adiabáticos o Isotérmicos
    
    // Caso: Adiabático + Isotérmico o viceversa
    if ((penultimateProcessType === 0 && finalProcessType === 2) || 
        (penultimateProcessType === 2 && finalProcessType === 0)) {
        
        // Debemos resolver el sistema:
        // 1. PV^γ = k1 (adiabático)
        // 2. PV = k2 (isotérmico)
        // Estas ecuaciones tienen una intersección única
        
        const adiabatic = penultimateProcessType === 0 ? penultimatePoint : firstPoint;
        const isothermal = penultimateProcessType === 2 ? penultimatePoint : firstPoint;
        
        const k1 = adiabatic.p * Math.pow(adiabatic.v, GAMMA); // Constante adiabática
        const k2 = isothermal.p * isothermal.v; // Constante isotérmica
        
        // Resolver para V: V^γ-1 = k2/k1
        const v = Math.pow(k2/k1, 1/(GAMMA-1));
        // Calcular P usando la ecuación isotérmica
        const p = k2/v;
        const t = (p * v) / (numMoles * R);
        
        // Verificar que la solución es razonable
        if (v > 5 && v < 200 && p > 20 && p < 400) {
            return logSolution(penultimateProcessType, finalProcessType, { p, v, t });
        }
        return logSolution(penultimateProcessType, finalProcessType, null);
    }
    
    // Otros casos con combinaciones de procesos
    // Implementar más combinaciones según necesidad
    
    // Si no se encuentra una combinación específica, usar lineal para al menos un proceso
    // Esto garantiza que siempre haya una solución
    
    // Priorizar hacer linear el proceso final
    if (finalProcessType !== 4) {
        // Si el proceso final no es lineal, hacerlo lineal
        console.log("Usando proceso lineal para cerrar el ciclo");
        // Resolver con las restricciones del penúltimo proceso
        return solveWithLinearFinal(penultimatePoint, firstPoint, penultimateProcessType);
    } else {
        // Si el final ya es lineal, resolver directamente
        return solveWithLinearFinal(penultimatePoint, firstPoint, penultimateProcessType);
    }
}

/**
 * Resuelve el punto final cuando al menos uno de los procesos es lineal
 */
function solveWithLinearFinal(penultimatePoint, firstPoint, penultimateProcessType) {
    try {
        // Si el penúltimo proceso es lineal, tenemos libertad total
        if (penultimateProcessType === 4) {
            // Podemos elegir valores intermedios entre el penúltimo y el primero
            const vRatio = 0.3 + Math.random() * 0.4; // Entre 0.3 y 0.7
            const pRatio = 0.3 + Math.random() * 0.4; // Entre 0.3 y 0.7
            
            const v = penultimatePoint.v + vRatio * (firstPoint.v - penultimatePoint.v);
            const p = penultimatePoint.p + pRatio * (firstPoint.p - penultimatePoint.p);
            const t = (p * v) / (numMoles * R);
            
            return { p, v, t };
        }
        
        // Si el penúltimo proceso no es lineal, respetamos sus restricciones
        switch (penultimateProcessType) {
            case 0: // Adiabático
                // Mantenemos PV^γ = constante
                const k = penultimatePoint.p * Math.pow(penultimatePoint.v, GAMMA);
                // Elegimos un volumen intermedio entre el penúltimo y el primero
                const vRatio = 0.3 + Math.random() * 0.4;
                const v = penultimatePoint.v + vRatio * (firstPoint.v - penultimatePoint.v);
                // Calculamos la presión según la relación adiabática
                const p = k / Math.pow(v, GAMMA);
                const t = (p * v) / (numMoles * R);
                
                // Verificar límites razonables
                if (p > 20 && p < 400) {
                    return { p, v, t };
                }
                break;
                
            case 1: // Isocórico
                // Mantenemos V constante
                const vIso = penultimatePoint.v;
                // Elegimos una presión intermedia
                const pRatioIso = 0.3 + Math.random() * 0.4;
                const pIso = penultimatePoint.p + pRatioIso * (firstPoint.p - penultimatePoint.p);
                const tIso = (pIso * vIso) / (numMoles * R);
                
                // Verificar límites razonables
                if (pIso > 20 && pIso < 400) {
                    return { p: pIso, v: vIso, t: tIso };
                }
                break;
                
            case 2: // Isotérmico
                // Mantenemos PV = constante
                const pv = penultimatePoint.p * penultimatePoint.v;
                // Elegimos un volumen intermedio
                const vRatioIso = 0.3 + Math.random() * 0.4;
                const vIsot = penultimatePoint.v + vRatioIso * (firstPoint.v - penultimatePoint.v);
                // Calculamos la presión según la relación isotérmica
                const pIsot = pv / vIsot;
                const tIsot = (pIsot * vIsot) / (numMoles * R);
                
                // Verificar límites razonables
                if (pIsot > 20 && pIsot < 400) {
                    return { p: pIsot, v: vIsot, t: tIsot };
                }
                break;
                
            case 3: // Isobárico
                // Mantenemos P constante
                const pIsobar = penultimatePoint.p;
                // Elegimos un volumen intermedio
                const vRatioIsobar = 0.3 + Math.random() * 0.4;
                const vIsobar = penultimatePoint.v + vRatioIsobar * (firstPoint.v - penultimatePoint.v);
                const tIsobar = (pIsobar * vIsobar) / (numMoles * R);
                
                // Verificar límites razonables
                if (vIsobar > 5 && vIsobar < 200) {
                    return { p: pIsobar, v: vIsobar, t: tIsobar };
                }
                break;
        }
        
        // Si ninguna de las soluciones específicas funciona, crear un punto simple
        console.log("Usando solución lineal simplificada");
        const v = (penultimatePoint.v + firstPoint.v) / 2;
        const p = (penultimatePoint.p + firstPoint.p) / 2;
        const t = (p * v) / (numMoles * R);
        return { p, v, t };
    } catch (error) {
        // En caso de cualquier error, retornar un punto seguro
        console.error("Error en solveWithLinearFinal:", error);
        const v = 50;
        const p = 100;
        const t = (p * v) / (numMoles * R);
        return { p, v, t };
    }
}

/**
 * Genera el penúltimo punto basado en el proceso del penúltimo al último
 */
function generatePenultimatePoint(currentPoint, lastPoint, processType) {
    // Esta función simplemente asegura que el penúltimo punto cumpla con las restricciones
    // del proceso que lo conecta al último punto
    
    const validatePoint = (point) => {
        // Verificar que el punto es físicamente razonable
        if (point.p < 20 || point.p > 400 || point.v < 5 || point.v > 200) {
            return false;
        }
        // Verificar que el proceso entre este punto y el último es válido
        return isProcessValid(point, lastPoint, processType);
    };
    
    let point;
    switch (processType) {
        case 0: // Adiabático
            // Asegurar PV^γ = constante
            const k = lastPoint.p * Math.pow(lastPoint.v, GAMMA);
            // Generar un volumen diferente al del último punto
            let vFactor;
            do {
                vFactor = (Math.random() > 0.5) ? 0.7 + Math.random() * 0.2 : 1.1 + Math.random() * 0.2;
            } while (lastPoint.v * vFactor <= 5 || lastPoint.v * vFactor >= 200);
            
            const v = lastPoint.v * vFactor;
            const p = k / Math.pow(v, GAMMA);
            const t = (p * v) / (numMoles * R);
            point = { p, v, t };
            break;
            
        case 1: // Isocórico
            // Mantener V constante
            const vIso = lastPoint.v;
            // Generar una presión diferente
            let pFactorIso;
            do {
                pFactorIso = (Math.random() > 0.5) ? 0.7 + Math.random() * 0.2 : 1.1 + Math.random() * 0.2;
            } while (lastPoint.p * pFactorIso <= 20 || lastPoint.p * pFactorIso >= 400);
            
            const pIso = lastPoint.p * pFactorIso;
            const tIso = (pIso * vIso) / (numMoles * R);
            point = { p: pIso, v: vIso, t: tIso };
            break;
            
        case 2: // Isotérmico
            // Mantener PV = constante
            const pv = lastPoint.p * lastPoint.v;
            // Generar un volumen diferente
            let vFactorIso;
            do {
                vFactorIso = (Math.random() > 0.5) ? 0.7 + Math.random() * 0.2 : 1.1 + Math.random() * 0.2;
            } while (lastPoint.v * vFactorIso <= 5 || lastPoint.v * vFactorIso >= 200);
            
            const vIsot = lastPoint.v * vFactorIso;
            const pIsot = pv / vIsot;
            // Verificar que la presión está en rango razonable
            if (pIsot < 20 || pIsot > 400) {
                return generatePenultimatePoint(currentPoint, lastPoint, processType);
            }
            const tIsot = (pIsot * vIsot) / (numMoles * R);
            point = { p: pIsot, v: vIsot, t: tIsot };
            break;
            
        case 3: // Isobárico
            // Mantener P constante
            const pIsobar = lastPoint.p;
            // Generar un volumen diferente
            let vFactorIsobar;
            do {
                vFactorIsobar = (Math.random() > 0.5) ? 0.7 + Math.random() * 0.2 : 1.1 + Math.random() * 0.2;
            } while (lastPoint.v * vFactorIsobar <= 5 || lastPoint.v * vFactorIsobar >= 200);
            
            const vIsobar = lastPoint.v * vFactorIsobar;
            const tIsobar = (pIsobar * vIsobar) / (numMoles * R);
            point = { p: pIsobar, v: vIsobar, t: tIsobar };
            break;
            
        case 4: // Lineal P-V
            // Elegir un punto que forma una línea recta entre P y V
            let xFactor;
            do {
                xFactor = 0.5 + Math.random() * 1.5; // Factor para alejarse del último punto
                // Calcular pendiente entre currentPoint y lastPoint
                const slope = (lastPoint.p - currentPoint.p) / (lastPoint.v - currentPoint.v);
                // Extender en la misma dirección
                const vLinear = currentPoint.v + (lastPoint.v - currentPoint.v) * xFactor;
                const pLinear = currentPoint.p + (lastPoint.p - currentPoint.p) * xFactor;
                // Verificar límites razonables
                if (vLinear > 5 && vLinear < 200 && pLinear > 20 && pLinear < 400) {
                    const tLinear = (pLinear * vLinear) / (numMoles * R);
                    point = { p: pLinear, v: vLinear, t: tLinear };
                    break;
                }
            } while (xFactor < 3); // Límite de intentos
            
            // Si no encontramos un punto adecuado, generar uno simple
            if (!point) {
                const vLinear = currentPoint.v * 0.8;
                const pLinear = currentPoint.p * 1.2;
                const tLinear = (pLinear * vLinear) / (numMoles * R);
                point = { p: pLinear, v: vLinear, t: tLinear };
            }
            break;
            
        default:
            // Punto por defecto en caso de error
            const vDefault = lastPoint.v * 0.8;
            const pDefault = lastPoint.p * 1.2;
            const tDefault = (pDefault * vDefault) / (numMoles * R);
            point = { p: pDefault, v: vDefault, t: tDefault };
    }
    
    // Verificar que el punto es válido
    if (!validatePoint(point)) {
        // Si no es válido, generar un punto simplificado
        console.log("Punto generado no válido, generando alternativa simplificada...");
        const vSimple = lastPoint.v * 0.85;
        const pSimple = lastPoint.p * 1.15;
        const tSimple = (pSimple * vSimple) / (numMoles * R);
        point = { p: pSimple, v: vSimple, t: tSimple };
        
        // Verificar una vez más
        if (!validatePoint(point)) {
            // Si sigue fallando, usar el punto actual
            console.log("Usando punto actual como penúltimo punto");
            return currentPoint;
        }
    }
    
    return point;
}

/**
 * Verifica que un proceso entre dos puntos es físicamente válido
 */
function isProcessValid(startPoint, endPoint, processType) {
    switch (processType) {
        case 0: // Adiabático (PV^γ = k)
            // Comprobamos si la relación PV^γ = k se mantiene
            const k1 = startPoint.p * Math.pow(startPoint.v, GAMMA);
            const k2 = endPoint.p * Math.pow(endPoint.v, GAMMA);
            // Tolerancia extremadamente precisa (< 0.01%)
            return Math.abs(k1 - k2) / k1 < 0.0001;
            
        case 1: // Isocórico (V = constante)
            // Los volúmenes deben ser iguales (con una tolerancia extremadamente pequeña)
            return Math.abs(startPoint.v - endPoint.v) / startPoint.v < 0.0001;
            
        case 2: // Isotérmico (T = constante, PV = constante)
            // Las temperaturas deben ser iguales
            const pv1 = startPoint.p * startPoint.v;
            const pv2 = endPoint.p * endPoint.v;
            // Tolerancia extremadamente precisa (< 0.01%)
            return Math.abs(pv1 - pv2) / pv1 < 0.0001;
            
        case 3: // Isobárico (P = constante)
            // Las presiones deben ser exactamente iguales (con tolerancia extremadamente pequeña)
            return Math.abs(startPoint.p - endPoint.p) / startPoint.p < 0.0001;
            
        case 4: // Lineal P-V
            // Siempre es posible conectar dos puntos con una línea recta
            return true;
    }
    return false;
}

/**
 * Genera un punto anterior basado en el tipo de proceso
 * (Inverso de generatePointByProcessType)
 */
function generatePreviousPointByProcessType(currentPoint, processType) {
    switch (processType) {
        case 0: return generatePreviousAdiabaticPoint(currentPoint);
        case 1: return generatePreviousIsochoricPoint(currentPoint);
        case 2: return generatePreviousIsothermalPoint(currentPoint);
        case 3: return generatePreviousIsobaricPoint(currentPoint);
        case 4: return generatePreviousLinearPoint(currentPoint);
        default: return generatePreviousLinearPoint(currentPoint);
    }
}

/**
 * Genera un punto anterior en un proceso adiabático
 */
function generatePreviousAdiabaticPoint(currentPoint) {
    // En un proceso adiabático, PV^γ = constante
    const k = currentPoint.p * Math.pow(currentPoint.v, GAMMA);
    
    // Generar un volumen diferente
    const vFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 y 1.2
    const newV = currentPoint.v * vFactor;
    
    // Calcular la presión que mantiene PV^γ constante
    const newP = k / Math.pow(newV, GAMMA);
    
    // Calcular la temperatura usando la ley de gases ideales
    const newT = (newP * newV) / (numMoles * R);
    
    return {
        p: newP,
        v: newV,
        t: newT
    };
}

/**
 * Genera un punto anterior en un proceso isocórico
 */
function generatePreviousIsochoricPoint(currentPoint) {
    // En un proceso isocórico, el volumen permanece constante
    const newV = currentPoint.v;
    
    // Generar una presión diferente
    const pFactor = 0.7 + Math.random() * 0.6; // Entre 0.7 y 1.3
    const newP = currentPoint.p * pFactor;
    
    // Calcular la temperatura usando la ley de gases ideales
    const newT = (newP * newV) / (numMoles * R);
    
    return {
        p: newP,
        v: newV,
        t: newT
    };
}

/**
 * Genera un punto anterior en un proceso isotérmico
 */
function generatePreviousIsothermalPoint(currentPoint) {
    // En un proceso isotérmico, PV = constante
    const pv = currentPoint.p * currentPoint.v;
    
    // Generar un volumen diferente
    const vFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 y 1.2
    const newV = currentPoint.v * vFactor;
    
    // Calcular la presión que mantiene PV constante
    const newP = pv / newV;
    
    // La temperatura se mantiene constante
    const newT = currentPoint.t;
    
    return {
        p: newP,
        v: newV,
        t: newT
    };
}

/**
 * Genera un punto anterior en un proceso isobárico
 */
function generatePreviousIsobaricPoint(currentPoint) {
    // En un proceso isobárico, la presión permanece constante
    const newP = currentPoint.p;
    
    // Generar un volumen diferente
    const vFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 y 1.2
    const newV = currentPoint.v * vFactor;
    
    // Calcular la temperatura usando la ley de gases ideales
    const newT = (newP * newV) / (numMoles * R);
    
    return {
        p: newP,
        v: newV,
        t: newT
    };
}

/**
 * Genera un punto anterior en un proceso lineal P-V
 */
function generatePreviousLinearPoint(currentPoint) {
    // En un proceso lineal, cualquier punto diferente es válido
    
    // Generar presión y volumen diferentes
    const pFactor = 0.7 + Math.random() * 0.6; // Entre 0.7 y 1.3
    const vFactor = 0.8 + Math.random() * 0.4; // Entre 0.8 y 1.2
    
    const newP = currentPoint.p * pFactor;
    const newV = currentPoint.v * vFactor;
    
    // Calcular la temperatura usando la ley de gases ideales
    const newT = (newP * newV) / (numMoles * R);
    
    return {
        p: newP,
        v: newV,
        t: newT
    };
}

/**
 * Genera un punto según el tipo de proceso especificado
 */
function generatePointByProcessType(startPoint, processType) {
    switch (processType) {
        case 0: return generateAdiabaticPoint(startPoint);
        case 1: return generateIsochoricPoint(startPoint);
        case 2: return generateIsothermalPoint(startPoint);
        case 3: return generateIsobaricPoint(startPoint);
        case 4: return generateLinearPoint(startPoint);
        default: return generateLinearPoint(startPoint); // Por defecto, usamos lineal
    }
}

/**
 * Genera un punto siguiendo un proceso adiabático desde un punto dado
 */
function generateAdiabaticPoint(startPoint) {
    // En un proceso adiabático: PV^γ = constante
    const k = startPoint.p * Math.pow(startPoint.v, GAMMA);
    
    // Generar un volumen diferente al actual (aleatorio)
    const direction = Math.random() > 0.5 ? 1 : -1; // Expansión o compresión
    const vFactor = 1 + direction * (0.3 + Math.random() * 0.3); // Cambio de 30-60%
    const v = startPoint.v * vFactor;
    
    // Calcular la presión correspondiente según la relación adiabática
    const p = k / Math.pow(v, GAMMA);
    
    // Calcular temperatura con la ley de gases ideales (PV = nRT)
    const t = (p * v) / (numMoles * R);
    
    return { p, v, t };
}

/**
 * Genera un punto siguiendo un proceso isocórico desde un punto dado
 */
function generateIsochoricPoint(startPoint) {
    // En un proceso isocórico: V = constante
    const v = startPoint.v;
    
    // Generar una presión diferente a la actual (aleatoria)
    const direction = Math.random() > 0.5 ? 1 : -1; // Aumento o disminución
    const pFactor = 1 + direction * (0.3 + Math.random() * 0.3); // Cambio de 30-60%
    const p = startPoint.p * pFactor;
    
    // Calcular temperatura con la ley de gases ideales (PV = nRT)
    const t = (p * v) / (numMoles * R);
    
    return { p, v, t };
}

/**
 * Genera un punto siguiendo un proceso isotérmico desde un punto dado
 */
function generateIsothermalPoint(startPoint) {
    // En un proceso isotérmico: T = constante, PV = constante
    const pv = startPoint.p * startPoint.v;
    
    // Generar un volumen diferente al actual (aleatorio)
    const direction = Math.random() > 0.5 ? 1 : -1; // Expansión o compresión
    const vFactor = 1 + direction * (0.3 + Math.random() * 0.3); // Cambio de 30-60%
    const v = startPoint.v * vFactor;
    
    // Calcular la presión correspondiente según la relación isotérmica
    const p = pv / v;
    
    // La temperatura es la misma
    const t = startPoint.t;
    
    return { p, v, t };
}

/**
 * Genera un punto siguiendo un proceso isobárico desde un punto dado
 */
function generateIsobaricPoint(startPoint) {
    // En un proceso isobárico: P = constante
    const p = startPoint.p;
    
    // Generar un volumen diferente al actual (aleatorio)
    const direction = Math.random() > 0.5 ? 1 : -1; // Expansión o compresión
    const vFactor = 1 + direction * (0.3 + Math.random() * 0.3); // Cambio de 30-60%
    const v = startPoint.v * vFactor;
    
    // Calcular temperatura con la ley de gases ideales (PV = nRT)
    const t = (p * v) / (numMoles * R);
    
    return { p, v, t };
}

/**
 * Genera un punto siguiendo un proceso lineal P-V desde un punto dado
 */
function generateLinearPoint(startPoint) {
    // Generar cambios aleatorios tanto en P como en V
    const pDirection = Math.random() > 0.5 ? 1 : -1;
    const vDirection = Math.random() > 0.5 ? 1 : -1;
    
    const pFactor = 1 + pDirection * (0.2 + Math.random() * 0.3); // Cambio en P de 20-50%
    const vFactor = 1 + vDirection * (0.2 + Math.random() * 0.3); // Cambio en V de 20-50%
    
    const p = startPoint.p * pFactor;
    const v = startPoint.v * vFactor;
    
    // Calcular temperatura con la ley de gases ideales (PV = nRT)
    const t = (p * v) / (numMoles * R);
    
    return { p, v, t };
}

/**
 * Genera un valor aleatorio dentro de un rango
 */
function getRandomValue(min, max) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(1));
}

/**
 * Dibuja el gráfico P-V con los datos del ciclo
 */
function drawGraph() {
    console.log("Dibujando gráfico...");
    
    try {
        // Obtener el canvas y su contexto
        const canvas = document.getElementById('graph-canvas'); // Corregido de 'diagram-canvas' a 'graph-canvas'
        if (!canvas) {
            console.error("Canvas no encontrado: 'graph-canvas'");
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            console.error("No se pudo obtener el contexto 2D del canvas");
            return;
        }
        
        // Obtener dimensiones del contenedor
        const graphContainer = document.querySelector('.graph-container');
        if (!graphContainer) {
            console.error("Contenedor del gráfico no encontrado: '.graph-container'");
            return;
        }
        
        const containerWidth = graphContainer.clientWidth;
        const containerHeight = containerWidth * 0.7; // Proporción 10:7
        
        // Ajustar tamaño del canvas
        canvas.width = containerWidth;
        canvas.height = containerHeight;
        
        console.log(`Dimensiones del canvas: ${canvas.width}x${canvas.height}`);
        
        // Tamaño de fuente base proporcional al contenedor
        const baseFontSize = Math.max(10, containerWidth / 40);
        
        // Limpiar el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Verificar si hay datos para dibujar
        if (!cycleData || cycleData.length === 0) {
            ctx.fillStyle = '#64748b';
            ctx.font = `${baseFontSize + 2}px Segoe UI`;
            ctx.textAlign = 'center';
            
            // Mensaje traducido
            let generatingText = 'Generando ciclo termodinámico...';
            if (typeof getTranslation === 'function') {
                generatingText = getTranslation('generating_cycle');
            }
            
            ctx.fillText(generatingText, canvas.width / 2, canvas.height / 2);
            return;
        }
        
        console.log(`Dibujando ciclo con ${cycleData.length} puntos:`, cycleData);
        
        // Determinar límites del gráfico
        let minP = Infinity;
        let maxP = -Infinity;
        let minV = Infinity;
        let maxV = -Infinity;
        
        // Verificar que los datos son válidos
        let hasValidData = true;
        cycleData.forEach((point, index) => {
            if (typeof point.p !== 'number' || typeof point.v !== 'number' || 
                isNaN(point.p) || isNaN(point.v) || 
                point.p <= 0 || point.v <= 0) {
                console.error(`Punto ${index} inválido:`, point);
                hasValidData = false;
            } else {
                minP = Math.min(minP, point.p);
                maxP = Math.max(maxP, point.p);
                minV = Math.min(minV, point.v);
                maxV = Math.max(maxV, point.v);
            }
        });
        
        if (!hasValidData) {
            ctx.fillStyle = 'red';
            ctx.font = `${baseFontSize + 2}px Segoe UI`;
            ctx.textAlign = 'center';
            
            // Mensaje de error traducido
            let errorText = 'Error: Datos de ciclo inválidos';
            if (typeof getTranslation === 'function') {
                errorText = getTranslation('error_invalid_data');
            }
            
            ctx.fillText(errorText, canvas.width / 2, canvas.height / 2);
            
            // Generar un ciclo de emergencia
            console.error("Generando ciclo de emergencia debido a datos inválidos");
            setTimeout(generateSimpleCycle, 500);
            return;
        }
        
        // Agregar márgenes
        const pMargin = (maxP - minP) * 0.15;
        const vMargin = (maxV - minV) * 0.15;
        minP = Math.max(0, minP - pMargin);
        maxP += pMargin;
        minV = Math.max(0, minV - vMargin);
        maxV += vMargin;
        
        // Redondear para valores más limpios
        minP = Math.floor(minP / 10) * 10;
        maxP = Math.ceil(maxP / 10) * 10;
        minV = Math.floor(minV / 5) * 5;
        maxV = Math.ceil(maxV / 5) * 5;
        
        console.log(`Límites del gráfico: P(${minP}-${maxP}), V(${minV}-${maxV})`);
        
        // Establecer padding
        const padding = {
            left: containerWidth * 0.12,
            right: containerWidth * 0.05,
            top: containerWidth * 0.08,
            bottom: containerWidth * 0.12
        };
        
        const graphWidth = canvas.width - padding.left - padding.right;
        const graphHeight = canvas.height - padding.top - padding.bottom;
        
        // Funciones para escalar puntos
        const scaleX = (v) => padding.left + (v - minV) * graphWidth / (maxV - minV);
        const scaleY = (p) => canvas.height - padding.bottom - (p - minP) * graphHeight / (maxP - minP);
        
        // Dibujar fondo del gráfico
        ctx.fillStyle = 'white';
        ctx.fillRect(padding.left, padding.top, graphWidth, graphHeight);
        
        // Ejes y cuadro de la gráfica
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.5;
        
        // Dibujar el cuadro completo (los 4 lados)
        ctx.beginPath();
        ctx.moveTo(padding.left, padding.top); // Esquina superior izquierda
        ctx.lineTo(padding.left + graphWidth, padding.top); // Línea superior
        ctx.lineTo(padding.left + graphWidth, canvas.height - padding.bottom); // Línea derecha
        ctx.lineTo(padding.left, canvas.height - padding.bottom); // Línea inferior
        ctx.lineTo(padding.left, padding.top); // Línea izquierda (cierra el rectángulo)
        ctx.stroke();
        
        // Marcar y etiquetar los valores en los ejes (sin dibujar líneas de cuadrícula)
        ctx.fillStyle = '#64748b';
        ctx.font = `${baseFontSize}px Segoe UI`;
        
        // Marcas y etiquetas del eje Y
        const pStep = determineStep(minP, maxP);
        for (let p = Math.ceil(minP / pStep) * pStep; p <= maxP; p += pStep) {
            const y = scaleY(p);
            
            // Dibujar marcas del eje Y
            ctx.beginPath();
            ctx.moveTo(padding.left - 5, y);
            ctx.lineTo(padding.left, y);
            ctx.stroke();
            
            // Etiquetas del eje Y
            ctx.textAlign = 'right';
            ctx.textBaseline = 'middle';
            ctx.fillText(p, padding.left - 10, y); // Aumentar la separación de 5 a 10
        }
        
        // Marcas y etiquetas del eje X
        const vStep = determineStep(minV, maxV);
        for (let v = Math.ceil(minV / vStep) * vStep; v <= maxV; v += vStep) {
            const x = scaleX(v);
            
            // Dibujar marcas del eje X
            ctx.beginPath();
            ctx.moveTo(x, canvas.height - padding.bottom);
            ctx.lineTo(x, canvas.height - padding.bottom + 5);
            ctx.stroke();
            
            // Etiquetas del eje X
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText(v, x, canvas.height - padding.bottom + 8);
        }
        
        // Etiquetas de ejes
        ctx.fillStyle = '#334155';
        ctx.font = `bold ${baseFontSize + 2}px Segoe UI`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        
        // Título del eje X traducido
        let volumeText = 'Volumen (L)';
        if (typeof getTranslation === 'function') {
            volumeText = getTranslation('volume_axis');
        }
        ctx.fillText(volumeText, padding.left + graphWidth / 2, canvas.height - padding.bottom + 25);
        
        // Título del eje Y traducido
        let pressureText = 'Presión (kPa)';
        if (typeof getTranslation === 'function') {
            pressureText = getTranslation('pressure_axis');
        }
        
        ctx.save();
        ctx.translate(padding.left - 50, padding.top + graphHeight / 2); // Aumentar la separación de 40 a 60
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(pressureText, 0, 0);
        ctx.restore();
        
        // DIBUJAR LOS PROCESOS
        for (let i = 0; i < cycleData.length; i++) {
            const point = cycleData[i];
            const nextIndex = point.nextIndex !== undefined ? point.nextIndex : (i + 1) % cycleData.length;
            const nextPoint = cycleData[nextIndex];
            const processType = point.processType;
            
            if (!point || !nextPoint) {
                console.error(`Error al dibujar proceso ${i}: punto inválido`);
                continue;
            }
            
            const x1 = scaleX(point.v);
            const y1 = scaleY(point.p);
            const x2 = scaleX(nextPoint.v);
            const y2 = scaleY(nextPoint.p);
            
            // Dibujar el proceso
            ctx.beginPath();
            
            // Color y grosor según el tipo de proceso
            ctx.lineWidth = 2;
            
            switch (processType) {
                case 0: // Adiabático
                    ctx.strokeStyle = '#7c3aed'; // Morado
                    dibujarProceso(ctx, point, nextPoint, processType, scaleX, scaleY);
                    break;
                case 1: // Isocórico
                    ctx.strokeStyle = '#ef4444'; // Rojo
                    dibujarProceso(ctx, point, nextPoint, processType, scaleX, scaleY);
                    break;
                case 2: // Isotérmico
                    ctx.strokeStyle = '#22c55e'; // Verde
                    dibujarProceso(ctx, point, nextPoint, processType, scaleX, scaleY);
                    break;
                case 3: // Isobárico
                    ctx.strokeStyle = '#3b82f6'; // Azul
                    dibujarProceso(ctx, point, nextPoint, processType, scaleX, scaleY);
                    break;
                case 4: // Lineal
                    ctx.strokeStyle = '#f97316'; // Naranja
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                    break;
                default:
                    ctx.strokeStyle = '#94a3b8'; // Gris
                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
            }
            
            // Etiquetar el proceso
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2;
            const dx = x2 - x1;
            const dy = y2 - y1;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Solo etiquetar si hay suficiente espacio
            if (distance > 30) {
                const labelOffsetX = -dy * 15 / distance;
                const labelOffsetY = dx * 15 / distance;
                
                ctx.fillStyle = '#1e293b';
                ctx.font = `${baseFontSize}px Segoe UI`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(`${i+1}→${nextIndex+1}`, midX + labelOffsetX, midY + labelOffsetY);
            }
        }
        
        // DIBUJAR LOS PUNTOS DEL CICLO
        for (let i = 0; i < cycleData.length; i++) {
            const point = cycleData[i];
            const x = scaleX(point.v);
            const y = scaleY(point.p);
            
            // Sombra para el punto
            ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
            ctx.shadowBlur = 3;
            ctx.shadowOffsetX = 1;
            ctx.shadowOffsetY = 1;
            
            // Círculo del punto
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x, y, Math.max(5, containerWidth / 70), 0, 2 * Math.PI);
            ctx.fill();
            
            // Borde del punto
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(x, y, Math.max(5, containerWidth / 70), 0, 2 * Math.PI);
            ctx.stroke();
            
            // Quitar sombra para el texto
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            
            // Número del punto (empezando en 1, no en 0)
            ctx.fillStyle = '#334155';
            ctx.font = `bold ${baseFontSize}px Segoe UI`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(i + 1, x, y);
        }
        
        console.log("Gráfico dibujado con éxito");
    } catch (error) {
        console.error("Error en drawGraph:", error);
        
        // Intentar mostrar el error en el canvas
        try {
            const canvas = document.getElementById('graph-canvas'); // Corregido de 'diagram-canvas' a 'graph-canvas'
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = 'red';
                    ctx.font = '14px Segoe UI';
                    ctx.textAlign = 'center';
                    ctx.fillText(`Error: ${error.message}`, canvas.width / 2, canvas.height / 2);
                }
            }
        } catch (e) {
            console.error("Error al mostrar mensaje de error en canvas:", e);
        }
        
        // Generar un ciclo simple como plan de emergencia
        setTimeout(generateSimpleCycle, 500);
    }
    
    // Función auxiliar para determinar escala de ejes
    function determineStep(min, max) {
        const range = max - min;
        const targetSteps = 8; // Número ideal de líneas de cuadrícula
        
        // Posibles tamaños de paso para valores "redondos"
        const possibleSteps = [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500];
        
        // Encontrar el tamaño de paso más apropiado
        let step = possibleSteps[possibleSteps.length - 1];
        for (let i = 0; i < possibleSteps.length; i++) {
            if (range / possibleSteps[i] <= targetSteps) {
                step = possibleSteps[i];
                break;
            }
        }
        
        return step;
    }
    
    function dibujarProceso(ctx, startPoint, endPoint, processType, scaleX, scaleY) {
        try {
            const x1 = scaleX(startPoint.v);
            const y1 = scaleY(startPoint.p);
            const x2 = scaleX(endPoint.v);
            const y2 = scaleY(endPoint.p);
            
            // Primero dibujamos una línea recta entre los puntos como base
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            
            // Para procesos especiales (con curvas), calculamos puntos intermedios
            switch (processType) {
                case 0: // Adiabático: PV^γ = k
                    // Para adiabáticas sólo necesitamos unos 10 puntos intermedios
                    const k = startPoint.p * Math.pow(startPoint.v, GAMMA);
                    const vMin = Math.min(startPoint.v, endPoint.v);
                    const vMax = Math.max(startPoint.v, endPoint.v);
                    
                    // Si el punto inicial tiene V mayor, ordenamos para dibujar de menor a mayor V
                    if (startPoint.v == vMin) {
                        for (let i = 0; i <= 10; i++) {
                            const v = vMin + (vMax - vMin) * (i / 10);
                            const p = k / Math.pow(v, GAMMA);
                            const x = scaleX(v);
                            const y = scaleY(p);
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                    } else {
                        for (let i = 10; i >= 0; i--) {
                            const v = vMin + (vMax - vMin) * (i / 10);
                            const p = k / Math.pow(v, GAMMA);
                            const x = scaleX(v);
                            const y = scaleY(p);
                            if (i === 10) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                    }
                    break;
                    
                case 2: // Isotérmico: PV = constante
                    // Para isotermas también 10 puntos intermedios
                    const pv = startPoint.p * startPoint.v;
                    const vMinIso = Math.min(startPoint.v, endPoint.v);
                    const vMaxIso = Math.max(startPoint.v, endPoint.v);
                    
                    // Si el punto inicial tiene V mayor, ordenamos para dibujar de menor a mayor V
                    if (startPoint.v == vMinIso) {
                        for (let i = 0; i <= 10; i++) {
                            const v = vMinIso + (vMaxIso - vMinIso) * (i / 10);
                            const p = pv / v;
                            const x = scaleX(v);
                            const y = scaleY(p);
                            if (i === 0) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                    } else {
                        for (let i = 10; i >= 0; i--) {
                            const v = vMinIso + (vMaxIso - vMinIso) * (i / 10);
                            const p = pv / v;
                            const x = scaleX(v);
                            const y = scaleY(p);
                            if (i === 10) ctx.moveTo(x, y);
                            else ctx.lineTo(x, y);
                        }
                    }
                    break;
                    
                default: // Para los procesos lineales, simplemente conectamos los puntos
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    break;
            }
            
            ctx.stroke();
        } catch (error) {
            console.error(`Error al dibujar proceso tipo ${processType}:`, error);
            // Fallback a línea recta simple
            ctx.beginPath();
            ctx.moveTo(scaleX(startPoint.v), scaleY(startPoint.p));
            ctx.lineTo(scaleX(endPoint.v), scaleY(endPoint.p));
            ctx.stroke();
        }
    }
}

// Añadir un evento de redimensionamiento para adaptar el gráfico
window.addEventListener('resize', function() {
    if (cycleData.length > 0) {
        drawGraph();
    }
});

/**
 * Muestra los datos del problema en la página
 */
function displayProblemData() {
    const problemDataSection = document.querySelector('.problem-data');
    
    // Si no hay datos de ciclo, no hacemos nada
    if (!cycleData || cycleData.length === 0) {
        const noDataText = typeof getTranslation === 'function' ? 
            getTranslation('generate_to_see_data') : 
            'Genera un ciclo para ver los datos del problema.';
            
        problemDataSection.innerHTML = `<p>${noDataText}</p>`;
        return;
    }
    
    // Limpiar contenido previo
    problemDataSection.innerHTML = '';
    
    // Obtener los textos traducidos
    const gasDataTitle = typeof getTranslation === 'function' ? getTranslation('gas_data_title') : 'Datos del Gas';
    const gasLabel = typeof getTranslation === 'function' ? getTranslation('gas') : 'Gas:';
    const gasTypeText = typeof getTranslation === 'function' ? getTranslation('gas_type') : 'Gas ideal monoatómico';
    const constantRLabel = typeof getTranslation === 'function' ? getTranslation('r_constant') : 'Constante R:';
    const amountLabel = typeof getTranslation === 'function' ? getTranslation('amount') : 'Cantidad de sustancia:';
    
    // Datos del Gas
    const gasSection = document.createElement('div');
    gasSection.className = 'gas-data';
    gasSection.innerHTML = `
        <h4>${gasDataTitle}</h4>
        <div class="data-property">${gasLabel} ${gasTypeText} (γ = ${GAMMA_DISPLAY})</div>
        <div class="data-property">${constantRLabel} ${R} J/(mol·K)</div>
        <div class="data-property">Cv = ${CV} = ${(3*R/2).toFixed(2)} J/(mol·K)</div>
        <div class="data-property">Cp = ${CP} = ${(5*R/2).toFixed(2)} J/(mol·K)</div>
        <div class="data-property">${amountLabel} ${numMoles} mol</div>
    `;
    
    // Crear contenedor para las dos columnas
    const dataContainer = document.createElement('div');
    dataContainer.className = 'problem-data-container';
    
    // Puntos (en forma de tabla con información mínima necesaria)
    const pointsSection = document.createElement('div');
    pointsSection.className = 'point-data';
    
    // Identificar el tipo de ciclo actual
    const cycleType = document.getElementById('cycle-type-selector').value;
    
    // Crear la tabla de puntos
    const tableDiv = document.createElement('div');
    tableDiv.className = 'points-table-container';
    
    // Determinar qué información mostrar
    const showVariables = {};

    // Aplicar el mismo algoritmo para todos los ciclos, incluyendo los predefinidos
    // Inicializar todos los puntos como no visibles
    for (let i = 1; i <= cycleData.length; i++) {
        showVariables[i] = { p: false, v: false, t: false };
    }
    
    // 1. Primer punto: Mostrar siempre 2 variables (P y V por defecto)
    showVariables[1].p = true;
    showVariables[1].v = true;
    
    // 2. Recorrer secuencialmente los puntos, considerando las restricciones
    // Array para rastrear qué puntos ya están completamente resueltos
    const resolvedPoints = [true]; // El punto 0 no existe, el punto 1 ya está resuelto
    for (let i = 2; i <= cycleData.length; i++) {
        resolvedPoints.push(false); // Inicializar como no resuelto
    }
    resolvedPoints[1] = true; // El primer punto está resuelto
    
    // Resolver secuencialmente los puntos 2 a n
    for (let i = 1; i < cycleData.length; i++) {
        const currentPoint = cycleData[i - 1]; // Punto actual (ya resuelto)
        const nextIndex = currentPoint.nextIndex; // Índice del siguiente punto
        const nextPointNum = nextIndex + 1; // Número del siguiente punto (1-indexed)
        const processType = currentPoint.processType; // Tipo de proceso que conecta
        
        // Si el siguiente punto ya está resuelto, continuar
        if (resolvedPoints[nextPointNum]) continue;
        
        // Según el tipo de proceso, aplicar las reglas correspondientes
        if (processType === 4) { // Proceso lineal
            // Para proceso lineal, mostrar 2 variables cualesquiera
            let varsToAssign = 2;
            const vars = ['p', 'v', 't'];
            // Asignar variables aleatoriamente
            while (varsToAssign > 0 && vars.length > 0) {
                const randomIndex = Math.floor(Math.random() * vars.length);
                const varToShow = vars[randomIndex];
                showVariables[nextPointNum][varToShow] = true;
                vars.splice(randomIndex, 1); // Eliminar la variable ya asignada
                varsToAssign--;
            }
        } else { // Procesos con restricción física
            // Para procesos con restricción, mostrar 1 variable que no sea la que impone la restricción
            // Determinar qué variable no puede mostrarse según el tipo de proceso
            let restrictedVar = null;
            if (processType === 1) restrictedVar = 'v'; // Isocórico - V constante
            else if (processType === 2) restrictedVar = 't'; // Isotérmico - T constante
            else if (processType === 3) restrictedVar = 'p'; // Isobárico - P constante
            
            // Lista de variables posibles
            const vars = ['p', 'v', 't'].filter(v => v !== restrictedVar);
            
            // Elegir aleatoriamente una variable que no sea la restringida
            const randomIndex = Math.floor(Math.random() * vars.length);
            const varToShow = vars[randomIndex];
            showVariables[nextPointNum][varToShow] = true;
        }
        
        // Marcar el punto como resuelto
        resolvedPoints[nextPointNum] = true;
    }
    
    // 3. Tratamiento especial para el último punto que cierra el ciclo
    const lastPointNum = cycleData.length;
    const lastPoint = cycleData[lastPointNum - 1];
    
    // Solo si el último punto conecta con el primero (cierra el ciclo)
    if (lastPoint.nextIndex === 0) {
        const processTypeToFirst = lastPoint.processType;
        const processTypeFromPrev = cycleData[lastPointNum - 2].processType;
        
        // Si ambos son procesos lineales, ya está resuelto por el paso anterior
        if (processTypeToFirst === 4 && processTypeFromPrev === 4) {
            // Ya se asignaron 2 variables, no hacer nada más
        } 
        // Si uno es lineal y el otro no
        else if (processTypeToFirst === 4 || processTypeFromPrev === 4) {
            // Mantener una variable según la restricción que no sea lineal
            let restrictedVar = null;
            if (processTypeToFirst !== 4) {
                // La restricción viene del proceso que conecta con el primero
                if (processTypeToFirst === 1) restrictedVar = 'v'; // Isocórico
                else if (processTypeToFirst === 2) restrictedVar = 't'; // Isotérmico
                else if (processTypeToFirst === 3) restrictedVar = 'p'; // Isobárico
            } else {
                // La restricción viene del proceso anterior
                if (processTypeFromPrev === 1) restrictedVar = 'v'; // Isocórico
                else if (processTypeFromPrev === 2) restrictedVar = 't'; // Isotérmico
                else if (processTypeFromPrev === 3) restrictedVar = 'p'; // Isobárico
            }
            
            // Resetear las variables y asignar solo las correctas
            showVariables[lastPointNum] = { p: false, v: false, t: false };
            
            // Asignar una variable que no sea la restringida
            const vars = ['p', 'v', 't'].filter(v => v !== restrictedVar);
            const varToShow = vars[Math.floor(Math.random() * vars.length)];
            showVariables[lastPointNum][varToShow] = true;
        }
        // Si ambos imponen restricciones
        else {
            // Determinar las variables restringidas por ambos procesos
            let restrictedVars = [];
            let hasAdiabatic = false;
            let hasNonLinearNonAdiabatic = false;
            
            // Verificar si hay adiabática y otra restricción no lineal
            if (processTypeFromPrev === 0 || processTypeToFirst === 0) {
                hasAdiabatic = true;
            }
            
            if ((processTypeFromPrev >= 1 && processTypeFromPrev <= 3) || 
                (processTypeToFirst >= 1 && processTypeToFirst <= 3)) {
                hasNonLinearNonAdiabatic = true;
            }
            
            // Si hay una adiabática y otra restricción no lineal, el punto está determinado
            if (hasAdiabatic && hasNonLinearNonAdiabatic) {
                // El punto está completamente determinado, no mostrar ninguna variable
                showVariables[lastPointNum] = { p: false, v: false, t: false };
            } else {
                // Restricción del proceso que conecta con el punto anterior
                if (processTypeFromPrev === 1) restrictedVars.push('v'); // Isocórico
                else if (processTypeFromPrev === 2) restrictedVars.push('t'); // Isotérmico
                else if (processTypeFromPrev === 3) restrictedVars.push('p'); // Isobárico
                
                // Restricción del proceso que conecta con el primer punto
                if (processTypeToFirst === 1) restrictedVars.push('v'); // Isocórico
                else if (processTypeToFirst === 2) restrictedVars.push('t'); // Isotérmico
                else if (processTypeToFirst === 3) restrictedVars.push('p'); // Isobárico
                
                // Si hay dos restricciones diferentes (que no sean adiabáticas), el punto está determinado
                if (restrictedVars.length === 2 && restrictedVars[0] !== restrictedVars[1]) {
                    // El punto está determinado por las dos restricciones, eliminar todas las variables
                    showVariables[lastPointNum] = { p: false, v: false, t: false };
                } else {
                    // Solo hay una restricción o ambas son iguales, o ambas son adiabáticas
                    // Resetear las variables y asignar solo una que no esté restringida
                    showVariables[lastPointNum] = { p: false, v: false, t: false };
                    
                    // Si ambos procesos son adiabáticos, mostrar una variable cualquiera
                    if (processTypeFromPrev === 0 && processTypeToFirst === 0) {
                        const varToShow = ['p', 'v', 't'][Math.floor(Math.random() * 3)];
                        showVariables[lastPointNum][varToShow] = true;
                    } else {
                        // Obtener variables no restringidas
                        const uniqueRestricted = [...new Set(restrictedVars)]; // Eliminar duplicados
                        const vars = ['p', 'v', 't'].filter(v => !uniqueRestricted.includes(v));
                        
                        if (vars.length > 0) {
                            const varToShow = vars[Math.floor(Math.random() * vars.length)];
                            showVariables[lastPointNum][varToShow] = true;
                        }
                    }
                }
            }
        }
    }
    
    if (cycleType === 'random') {
        console.log("Variables mostradas para ciclo aleatorio (algoritmo completo):", showVariables);
    } else {
        console.log(`Variables mostradas para ciclo ${cycleType} (algoritmo general):`, showVariables);
    }
    
    // Construir la tabla HTML
    let tableHTML = `
        <h4>${typeof getTranslation === 'function' ? getTranslation('point_data') : 'Datos de los Puntos'}</h4>
        <div class="points-table-container">
        <table class="points-table">
            <thead>
                <tr>
                    <th>${typeof getTranslation === 'function' ? getTranslation('point') : 'Punto'}</th>
                    <th>P (kPa)</th>
                    <th>V (L)</th>
                    <th>T (K)</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    for (let i = 0; i < cycleData.length; i++) {
        const point = cycleData[i];
        const pointNumber = i + 1;
        const variables = showVariables[pointNumber];
        
        tableHTML += `
            <tr>
                <td>${pointNumber}</td>
                <td>${variables.p ? point.p.toFixed(2) : '—'}</td>
                <td>${variables.v ? point.v.toFixed(4) : '—'}</td>
                <td>${variables.t ? point.t.toFixed(2) : '—'}</td>
            </tr>
        `;
    }
    
    tableHTML += `
            </tbody>
        </table>
        </div>
    `;
    
    pointsSection.innerHTML = tableHTML;
    
    // Añadir las dos columnas al contenedor
    dataContainer.appendChild(gasSection);
    dataContainer.appendChild(pointsSection);
    
    // Añadir el contenedor a la sección de datos del problema
    problemDataSection.appendChild(dataContainer);
    
    // Ahora configuramos la tabla de cálculos
    setupTable();
}

/**
 * Configura la tabla con filas dinámicas para cada proceso
 */
function setupTable() {
    const tableBody = document.querySelector('#thermo-table tbody');
    
    // Limpiar tabla existente
    tableBody.innerHTML = '';
    
    // Obtener el idioma actual
    const currentLang = getCurrentLanguage ? getCurrentLanguage() : 'es';
    
    // Añadir filas para cada proceso
    for (let i = 0; i < cycleData.length; i++) {
        const point = cycleData[i];
        const nextIndex = point.nextIndex;
        
        // Obtener el nombre del proceso traducido
        let processType;
        if (typeof getTranslation === 'function') {
            // Si la función getTranslation está disponible (i18n.js cargado)
            processType = getTranslation(PROCESS_TYPES_KEYS[point.processType]);
        } else {
            // Fallback al nombre en español
            processType = PROCESS_TYPES[point.processType];
        }
        
        // Si el siguiente punto es el 0, se muestra como 1 (para cerrar el ciclo)
        let nextPointNumber = nextIndex + 1;
        if (nextIndex === 0) {
            nextPointNumber = 1;
        }
        
        const row = document.createElement('tr');
        row.className = 'process-row';
        row.innerHTML = `
            <td class="process-name">${i + 1}: ${processType} (${i + 1} → ${nextPointNumber})</td>
            <td><input type="number" step="any" id="q-${i}" class="process-input" placeholder="0"></td>
            <td><input type="number" step="any" id="w-${i}" class="process-input" placeholder="0"></td>
            <td><input type="number" step="any" id="du-${i}" class="process-input" placeholder="0"></td>
            <td><input type="number" step="any" id="dh-${i}" class="process-input" placeholder="0"></td>
            <td><input type="number" step="any" id="ds-${i}" class="process-input" placeholder="0"></td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Obtener la traducción para "Total del Ciclo"
    let totalCycleText = "Total del Ciclo";
    if (typeof getTranslation === 'function') {
        totalCycleText = getTranslation('total_cycle');
    }
    
    // Obtener título para campos informativos
    let infoTitle = "Valor calculado automáticamente (suma de valores individuales)";
    if (typeof getTranslation === 'function') {
        infoTitle = getTranslation('calculated_value');
    }
    
    // Añadir fila para el total del ciclo
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `
        <td class="total-label"><strong>${totalCycleText}</strong></td>
        <td><input type="number" step="any" id="q-total" class="process-input total-input info-only" readonly title="${infoTitle}" placeholder="0"></td>
        <td><input type="number" step="any" id="w-total" class="process-input total-input info-only" readonly title="${infoTitle}" placeholder="0"></td>
        <td><input type="number" step="any" id="du-total" class="process-input total-input info-only" readonly title="${infoTitle}" placeholder="0"></td>
        <td><input type="number" step="any" id="dh-total" class="process-input total-input info-only" readonly title="${infoTitle}" placeholder="0"></td>
        <td><input type="number" step="any" id="ds-total" class="process-input total-input info-only" readonly title="${infoTitle}" placeholder="0"></td>
    `;
    
    tableBody.appendChild(totalRow);
    
    // Añadir event listeners a todos los campos de entrada para actualizar los totales en tiempo real
    setupRealTimeUpdates();
    
    // Verificar si todos los campos están completos para establecer el estado inicial del botón
    checkAllFieldsCompleted();
}

/**
 * Configura la actualización en tiempo real de los totales
 */
function setupRealTimeUpdates() {
    // Obtener todos los campos de entrada (excepto los totales)
    const inputs = document.querySelectorAll('.process-input:not(.total-input)');
    
    // Añadir event listener a cada campo
    inputs.forEach(input => {
        input.addEventListener('input', updateRealTimeTotals);
    });
}

/**
 * Actualiza los totales en tiempo real basado en los valores introducidos por el usuario
 */
function updateRealTimeTotals() {
    // Inicializar totales
    let totalQ = 0, totalW = 0, totalDU = 0, totalDH = 0, totalDS = 0;
    
    // Obtener todos los valores introducidos por el usuario
    for (let i = 0; i < cycleData.length; i++) {
        // Obtener los campos de entrada
        const qInput = document.getElementById(`q-${i}`);
        const wInput = document.getElementById(`w-${i}`);
        const duInput = document.getElementById(`du-${i}`);
        const dhInput = document.getElementById(`dh-${i}`);
        const dsInput = document.getElementById(`ds-${i}`);
        
        // Acumular valores si están disponibles
        if (qInput && !isNaN(parseFloat(qInput.value))) totalQ += parseFloat(qInput.value);
        if (wInput && !isNaN(parseFloat(wInput.value))) totalW += parseFloat(wInput.value);
        if (duInput && !isNaN(parseFloat(duInput.value))) totalDU += parseFloat(duInput.value);
        if (dhInput && !isNaN(parseFloat(dhInput.value))) totalDH += parseFloat(dhInput.value);
        if (dsInput && !isNaN(parseFloat(dsInput.value))) totalDS += parseFloat(dsInput.value);
    }
    
    // Actualizar los campos de totales
    const qTotalInput = document.getElementById('q-total');
    const wTotalInput = document.getElementById('w-total');
    const duTotalInput = document.getElementById('du-total');
    const dhTotalInput = document.getElementById('dh-total');
    const dsTotalInput = document.getElementById('ds-total');
    
    // Actualizar los valores si están disponibles
    if (qTotalInput) qTotalInput.value = totalQ.toFixed(1);
    if (wTotalInput) wTotalInput.value = totalW.toFixed(1);
    if (duTotalInput) duTotalInput.value = totalDU.toFixed(1);
    if (dhTotalInput) dhTotalInput.value = totalDH.toFixed(1);
    if (dsTotalInput) dsTotalInput.value = totalDS.toFixed(3);
    
    // Verificar si todos los campos están completos
    checkAllFieldsCompleted();
}

/**
 * Verifica si todos los campos de entrada de la tabla han sido completados
 * y habilita o deshabilita el botón de exportar progreso en consecuencia
 */
function checkAllFieldsCompleted() {
    const inputs = document.querySelectorAll('.process-input:not(.total-input)');
    const exportBtn = document.getElementById('export-progress-btn');
    
    // Si no existe el botón, salir
    if (!exportBtn) return;
    
    // Verificar si todos los campos tienen un valor
    let allCompleted = true;
    
    inputs.forEach(input => {
        if (!input.value || input.value === '') {
            allCompleted = false;
        }
    });
    
    // Habilitar o deshabilitar el botón según el resultado
    exportBtn.disabled = !allCompleted;
    
    // Actualizar el texto del tooltip según el estado del botón
    if (allCompleted) {
        exportBtn.title = "Exportar tu progreso a un archivo";
    } else {
        exportBtn.title = "Debes completar todos los campos de la tabla para poder exportar tu progreso";
    }
    
    // Añadir event listener para cuando se intenta hacer clic en el botón deshabilitado
    if (!allCompleted && !exportBtn.hasAttribute('data-listener-added')) {
        exportBtn.addEventListener('click', function(event) {
            if (this.disabled) {
                // Mostrar la notificación
                const notification = document.getElementById('result-notification');
                if (notification) {
                    notification.textContent = "Debes completar todos los campos de la tabla para poder exportar tu progreso";
                    notification.className = "result-notification incorrect show";
                    
                    // Ocultar después de 3 segundos
                    setTimeout(function() {
                        notification.className = "result-notification";
                    }, 3000);
                }
            }
        });
        
        // Marcar que ya se agregó el listener para no añadirlo múltiples veces
        exportBtn.setAttribute('data-listener-added', 'true');
    }
}

/**
 * Valida los resultados ingresados por el usuario
 *
 * Nota importante sobre las variables de estado:
 * En un ciclo termodinámico cerrado, el cambio neto de las funciones de estado
 * (energía interna ΔU, entalpía ΔH y entropía ΔS) siempre es CERO, ya que el sistema
 * regresa a su estado inicial. Por tanto, para el ciclo completo, los valores correctos
 * de estas variables siempre serán cero, independientemente de los valores individuales
 * en cada proceso.
 */
function validateResults() {
    // Calcular la dificultad del ciclo actual
    const difficultyLevel = gamificationSystem.calculateDifficulty(cycleData);
    gamificationSystem.updateDifficultyDisplay(difficultyLevel);
    
    // Calcular los valores correctos para cada proceso
    const correctValues = [];
    let totalQ = 0, totalW = 0, totalDU = 0, totalDH = 0, totalDS = 0;
    
    for (let i = 0; i < cycleData.length; i++) {
        const point = cycleData[i];
        const nextIndex = point.nextIndex;
        const nextPoint = cycleData[nextIndex];
        const processType = point.processType;
        
        // Calcular cambios de temperatura y volumen
        const deltaT = nextPoint.t - point.t;
        const deltaV = nextPoint.v - point.v;
        
        // Calcular valores según tipo de proceso
        let q, w, du, dh, ds;
        
        // Capacidades caloríficas (gas monoatómico)
        const cv = 3 * R / 2; // J/(mol·K)
        const cp = 5 * R / 2; // J/(mol·K)
        
        switch (processType) {
            case 0: // Adiabático
                q = 0;
                du = numMoles * cv * deltaT;
                w = -du; // Primera ley: w = -du cuando q = 0
                dh = numMoles * cp * deltaT;
                ds = 0;
                break;
                
            case 1: // Isocórico
                w = 0; // No hay trabajo en proceso isocórico
                du = numMoles * cv * deltaT;
                q = du; // Primera ley: q = du cuando w = 0
                dh = numMoles * cp * deltaT;
                ds = numMoles * cv * Math.log(nextPoint.t / point.t);
                break;
                
            case 2: // Isotérmico
                // En isotérmico deltaT = 0, por lo que du = 0
                du = 0;
                dh = 0;
                // Trabajo en isotérmico: w = -nRT·ln(V2/V1)
                w = -numMoles * R * point.t * Math.log(nextPoint.v / point.v);
                q = -w; // Primera ley: q = -w cuando du = 0
                ds = q / point.t;
                break;
                
            case 3: // Isobárico
                // Trabajo en isobárico: w = P·ΔV
                w = point.p * 1000 * (nextPoint.v - point.v) / 1000; // kPa·L a J
                du = numMoles * cv * deltaT;
                q = numMoles * cp * deltaT;
                dh = q; // En isobárico: q = ΔH
                ds = numMoles * cp * Math.log(nextPoint.t / point.t);
                break;
                
            case 4: // Lineal P-V
                // Cálculos aproximados para proceso lineal
                du = numMoles * cv * deltaT;
                w = (point.p + nextPoint.p) / 2 * 1000 * deltaV / 1000; // kPa·L a J
                q = du + w; // Primera ley: q = du + w
                dh = du + point.p * 1000 * deltaV / 1000;
                // Aproximación de entropía
                ds = q / ((point.t + nextPoint.t) / 2);
                break;
        }
        
        // Redondear valores a tres cifras significativas
        correctValues.push({
            q: parseFloat(q.toFixed(1)),
            w: parseFloat(w.toFixed(1)),
            du: parseFloat(du.toFixed(1)),
            dh: parseFloat(dh.toFixed(1)),
            ds: parseFloat(ds.toFixed(3))
        });
        
        // Acumular totales
        totalQ += q;
        totalW += w;
        totalDU += du;
        totalDH += dh;
        totalDS += ds;
    }
    
    // En un ciclo termodinámico cerrado, la suma de los cambios en las variables de estado debe ser cero
    // Debido a errores de redondeo, podemos tener pequeñas desviaciones, pero teóricamente deberían ser cero
    // Por tanto, forzamos a que los totales de las funciones de estado sean exactamente cero
    totalDU = 0;
    totalDH = 0;
    totalDS = 0;
    
    // Redondear totales
    const results = {
        q: parseFloat(totalQ.toFixed(1)),
        w: parseFloat(totalW.toFixed(1)),
        du: 0, // Cambio total de energía interna es siempre cero en un ciclo cerrado
        dh: 0, // Cambio total de entalpía es siempre cero en un ciclo cerrado
        ds: 0  // Cambio total de entropía es siempre cero en un ciclo cerrado
    };
    
    // Validar valores ingresados por el usuario para cada proceso individual
    for (let i = 0; i < cycleData.length; i++) {
        // Verificar cada valor
        validateInput(`q-${i}`, correctValues[i].q);
        validateInput(`w-${i}`, correctValues[i].w);
        validateInput(`du-${i}`, correctValues[i].du);
        validateInput(`dh-${i}`, correctValues[i].dh);
        validateInput(`ds-${i}`, correctValues[i].ds);
    }
    
    // Actualizar los totales en base a los valores introducidos por el usuario
    // en lugar de usar los totales calculados teóricamente
    updateRealTimeTotals();
    
    // Verificar si todos los campos están completos después de la validación
    checkAllFieldsCompleted();
}

/**
 * Actualiza los valores de la fila "Total del Ciclo" sin validarlos
 * Esta función reemplaza la validación para que los totales sean solo informativos
 */
function updateTotalValues(results) {
    // Obtener los elementos de input para los totales
    const qTotalInput = document.getElementById('q-total');
    const wTotalInput = document.getElementById('w-total');
    const duTotalInput = document.getElementById('du-total');
    const dhTotalInput = document.getElementById('dh-total');
    const dsTotalInput = document.getElementById('ds-total');
    
    // Actualizar los valores y darles un estilo especial
    if (qTotalInput) {
        qTotalInput.value = results.q.toFixed(1);
        styleInfoInput(qTotalInput);
    }
    
    if (wTotalInput) {
        wTotalInput.value = results.w.toFixed(1);
        styleInfoInput(wTotalInput);
    }
    
    if (duTotalInput) {
        duTotalInput.value = results.du.toFixed(1);
        styleInfoInput(duTotalInput);
    }
    
    if (dhTotalInput) {
        dhTotalInput.value = results.dh.toFixed(1);
        styleInfoInput(dhTotalInput);
    }
    
    if (dsTotalInput) {
        dsTotalInput.value = results.ds.toFixed(3);
        styleInfoInput(dsTotalInput);
    }
}

/**
 * Aplica un estilo especial a los campos de totales para indicar que son informativos
 */
function styleInfoInput(input) {
    // Eliminar clases de validación si existieran
    input.classList.remove('correct', 'incorrect');
    
    // Añadir clase para marcarlos como informativos
    input.classList.add('info-only');
    
    // Hacer el input de solo lectura para que el usuario no pueda modificarlo
    input.readOnly = true;
    
    // Añadir un título para indicar que es un valor calculado
    if (typeof getTranslation === 'function') {
        input.title = getTranslation('calculated_value');
    } else {
        input.title = "Valor calculado";
    }
}

/**
 * Valida un input específico
 */
function validateInput(inputId, correctValue) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const userValue = parseFloat(input.value);
    
    // Si el usuario no ha ingresado un valor, no validamos
    if (isNaN(userValue)) {
        input.classList.remove('correct', 'incorrect');
        return;
    }
    
    // Caso especial: Si el valor correcto es cero
    if (correctValue === 0) {
        // Si el usuario puso cero, es correcto
        if (userValue === 0) {
            markAsCorrect(input, correctValue);
        } else {
            markAsIncorrect(input, correctValue);
        }
        return;
    }
    
    // Calcular error relativo
    const relError = Math.abs((userValue - correctValue) / correctValue);
    
    // Para errores relativos menores al 1%, consideramos correcto
    if (relError < 0.01) {
        markAsCorrect(input, correctValue);
    } else {
        markAsIncorrect(input, correctValue);
    }
}

// Función auxiliar para marcar una respuesta como correcta
function markAsCorrect(input, correctValue) {
    input.classList.add('correct');
    input.classList.remove('incorrect');
    
    // Obtener la traducción para "Correcto"
    let correctText = "Correcto";
    if (typeof getTranslation === 'function') {
        correctText = getTranslation('correct');
    }
    
    input.title = `${correctText} (${correctValue.toFixed(2)})`;
    
    // Procesar la validación en el sistema de gamificación
    gamificationSystem.processValidation(input.id, true);
}

// Función auxiliar para marcar una respuesta como incorrecta
function markAsIncorrect(input, correctValue) {
    input.classList.add('incorrect');
    input.classList.remove('correct');
    
    // Obtener la traducción para "Incorrecto"
    let incorrectText = "Incorrecto";
    if (typeof getTranslation === 'function') {
        incorrectText = getTranslation('incorrect');
    }
    
    input.title = `${incorrectText} (${correctValue.toFixed(2)})`;
    
    // Mostrar el valor correcto
    input.value = correctValue.toFixed(2);
    
    // Procesar la validación en el sistema de gamificación
    gamificationSystem.processValidation(input.id, false);
}

/**
 * Función para compartir el estado actual del ejercicio
 */
function shareExercise() {
    // Recopilar los datos actuales del ciclo y el estado del ejercicio
    const exerciseState = {
        cycleType: document.getElementById('cycle-type-selector').value,
        cycleData: cycleData,
        numMoles: numMoles,
        // Recopilar las respuestas del usuario si hay alguna
        userAnswers: {}
    };
    
    // Capturar las respuestas que el usuario haya introducido hasta el momento
    for (let i = 0; i < cycleData.length; i++) {
        exerciseState.userAnswers[`q-${i}`] = document.getElementById(`q-${i}`).value;
        exerciseState.userAnswers[`w-${i}`] = document.getElementById(`w-${i}`).value;
        exerciseState.userAnswers[`du-${i}`] = document.getElementById(`du-${i}`).value;
        exerciseState.userAnswers[`dh-${i}`] = document.getElementById(`dh-${i}`).value;
        exerciseState.userAnswers[`ds-${i}`] = document.getElementById(`ds-${i}`).value;
    }
    
    // Incluir también los totales
    exerciseState.userAnswers[`q-total`] = document.getElementById(`q-total`).value;
    exerciseState.userAnswers[`w-total`] = document.getElementById(`w-total`).value;
    exerciseState.userAnswers[`du-total`] = document.getElementById(`du-total`).value;
    exerciseState.userAnswers[`dh-total`] = document.getElementById(`dh-total`).value;
    exerciseState.userAnswers[`ds-total`] = document.getElementById(`ds-total`).value;
    
    // Comprimir los datos para hacer la URL más corta
    const stateJson = JSON.stringify(exerciseState);
    const compressedState = LZString.compressToEncodedURIComponent(stateJson);
    
    // Crear URL con el estado comprimido
    // Usar la URL relativa para evitar rutas de archivo completas
    const currentUrl = window.location.href.split('?')[0];
    // Verificar si la URL comienza con 'file://' y reemplazarla con una URL web base si es necesario
    const baseUrl = currentUrl.startsWith('file://') 
        ? 'https://fisicaaplicada.usc.es/ciclostermo/' // URL base ejemplo, debe ser ajustada
        : currentUrl;
    
    const longShareUrl = `${baseUrl}?state=${compressedState}`;
    
    // Obtener traducciones para el diálogo
    const currentLang = getCurrentLanguage();
    const title = getTranslation("share_dialog_title", currentLang);
    const description = getTranslation("share_dialog_description", currentLang);
    const copyButtonText = getTranslation("copy_button", currentLang);
    const copiedMessage = getTranslation("copied_message", currentLang);
    const closeButtonText = getTranslation("close_button", currentLang);
    const shareOnText = getTranslation("share_on", currentLang);
    const shorteningMessage = getTranslation("shortening_url", currentLang) || "Acortando URL...";
    const processingText = getTranslation("processing", currentLang) || "Procesando...";
    
    // Mostrar diálogo inicial con mensaje de procesamiento
    const loadingDialogHtml = `
        <div class="share-dialog">
            <h3>${title}</h3>
            <p>${processingText}</p>
            <div class="loading-spinner"></div>
        </div>
    `;
    
    // Crear elemento para el diálogo
    const dialogOverlay = document.createElement('div');
    dialogOverlay.className = 'dialog-overlay';
    dialogOverlay.innerHTML = loadingDialogHtml;
    document.body.appendChild(dialogOverlay);
    
    // Crear HTML para el diálogo con URL
    const createDialogHtml = (shareUrl) => {
        const displayUrl = shareUrl.length > 60 ? shareUrl.substring(0, 57) + '...' : shareUrl;
        
        // Crear HTML para botones de redes sociales
        const socialButtons = `
            <div class="social-buttons">
                <p>${shareOnText}:</p>
                <div class="social-icons">
                    <a href="mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}" class="social-icon email-icon" title="${getTranslation("share_email", currentLang)}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                    </a>
                    <a href="https://api.whatsapp.com/send?text=${encodeURIComponent(title + ': ' + shareUrl)}" target="_blank" class="social-icon whatsapp-icon" title="${getTranslation("share_whatsapp", currentLang)}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    <a href="https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}" target="_blank" class="social-icon telegram-icon" title="${getTranslation("share_telegram", currentLang)}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                    </a>
                    <a href="https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(shareUrl)}" target="_blank" class="social-icon twitter-icon" title="${getTranslation("share_twitter", currentLang)}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
                    </a>
                    <a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}" target="_blank" class="social-icon facebook-icon" title="${getTranslation("share_facebook", currentLang)}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                </div>
            </div>
        `;
        
        return `
            <div class="share-dialog">
                <h3>${title}</h3>
                <p>${description}</p>
                <div class="share-url-container">
                    <input type="text" id="share-url" value="${shareUrl}" readonly title="${shareUrl}">
                    <button id="copy-button">${copyButtonText}</button>
                </div>
                <p class="url-label">${displayUrl}</p>
                ${socialButtons}
                <button id="close-dialog">${closeButtonText}</button>
            </div>
        `;
    };
    
    // Intentar generar una URL corta automáticamente
    fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longShareUrl)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al acortar la URL');
            }
            return response.text();
        })
        .then(shortUrl => {
            // Actualizar el diálogo con la URL corta
            dialogOverlay.innerHTML = createDialogHtml(shortUrl);
            
            // Configurar eventos de los botones
            document.getElementById('copy-button').addEventListener('click', function() {
                const shareUrlInput = document.getElementById('share-url');
                shareUrlInput.select();
                document.execCommand('copy');
                this.textContent = copiedMessage;
            });
            
            document.getElementById('close-dialog').addEventListener('click', function() {
                document.body.removeChild(dialogOverlay);
            });
            
            // Auto-seleccionar la URL para facilitar la copia
            document.getElementById('share-url').select();
        })
        .catch(error => {
            console.error('Error al acortar la URL:', error);
            // Mostrar el diálogo con la URL larga en caso de error
            dialogOverlay.innerHTML = createDialogHtml(longShareUrl);
            
            // Configurar eventos de los botones
            document.getElementById('copy-button').addEventListener('click', function() {
                const shareUrlInput = document.getElementById('share-url');
                shareUrlInput.select();
                document.execCommand('copy');
                this.textContent = copiedMessage;
            });
            
            document.getElementById('close-dialog').addEventListener('click', function() {
                document.body.removeChild(dialogOverlay);
            });
        });
}

/**
 * Función para cargar un ejercicio compartido
 */
function loadSharedExercise() {
    // Verificar si hay un estado en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state');
    
    if (stateParam) {
        try {
            console.log("Intentando cargar estado compartido. Longitud del estado:", stateParam.length);
            
            // Inicializar variable para almacenar estado
            let exerciseState = null;
            let decodingMethod = '';
            
            // Probar diferentes métodos de decodificación 
            // (esto nos permite compatibilidad con diferentes versiones de enlaces)
            try {
                // Método 1: Intentar descomprimir con LZString (nuevo formato)
                const stateJson = LZString.decompressFromEncodedURIComponent(stateParam);
                if (stateJson) {
                    exerciseState = JSON.parse(stateJson);
                    decodingMethod = 'LZString';
                    console.log("Estado decodificado exitosamente con LZString");
                }
            } catch (e) {
                console.warn("No se pudo decodificar con LZString:", e);
            }
            
            // Si el primer método falló, intentar con base64
            if (!exerciseState) {
                try {
                    // Método 2: Intentar con base64 (método antiguo)
                    const stateJson = atob(stateParam);
                    exerciseState = JSON.parse(stateJson);
                    decodingMethod = 'base64';
                    console.log("Estado decodificado exitosamente con base64 (atob)");
                } catch (e) {
                    console.warn("No se pudo decodificar con base64:", e);
                }
            }
            
            // Si aún no tenemos un estado, intentar decodificar directamente como JSON
            if (!exerciseState) {
                try {
                    // Método 3: Intentar decodificar directamente como JSON (por si acaso)
                    exerciseState = JSON.parse(decodeURIComponent(stateParam));
                    decodingMethod = 'directJSON';
                    console.log("Estado decodificado exitosamente como JSON directo");
                } catch (e) {
                    console.warn("No se pudo decodificar directamente como JSON:", e);
                }
            }
            
            // Si no se pudo decodificar el estado con ningún método, lanzar error
            if (!exerciseState) {
                throw new Error("No se pudo decodificar el estado con ningún método");
            }
            
            console.log("Estado cargado con éxito usando método:", decodingMethod);
            
            // Validar que exerciseState tiene la estructura esperada
            if (!exerciseState.cycleType || !exerciseState.cycleData) {
                throw new Error("El estado decodificado no tiene la estructura esperada");
            }
            
            // Restaurar el tipo de ciclo
            document.getElementById('cycle-type-selector').value = exerciseState.cycleType;
            
            // Restaurar los datos del ciclo
            cycleData = exerciseState.cycleData;
            numMoles = exerciseState.numMoles || 1; // Valor por defecto si no existe
            
            // Dibujar el ciclo y mostrar datos
            drawGraph();
            displayProblemData();
            setupTable();
            
            // Restaurar las respuestas del usuario si existen
            if (exerciseState.userAnswers) {
                for (const [inputId, value] of Object.entries(exerciseState.userAnswers)) {
                    const inputElement = document.getElementById(inputId);
                    if (inputElement && value) {
                        inputElement.value = value;
                    }
                }
                // Actualizar los totales en tiempo real
                updateRealTimeTotals();
            }
            
            // Mostrar notificación de carga exitosa
            const currentLang = getCurrentLanguage();
            const notificationElement = document.getElementById('result-notification');
            
            if (notificationElement) {
                notificationElement.textContent = getTranslation("exercise_loaded", currentLang) || "Ejercicio cargado con éxito";
                notificationElement.className = 'result-notification correct show';
                
                setTimeout(() => {
                    notificationElement.className = 'result-notification';
                }, 2000);
            }
        } catch (error) {
            console.error('Error detallado al cargar el ejercicio compartido:', error);
            
            // Generar un nuevo ciclo para que el usuario pueda trabajar
            generateCycle();
            
            // Mostrar notificación de error
            const currentLang = getCurrentLanguage();
            const errorMessage = getTranslation("exercise_load_error", currentLang) || "Error al cargar el ejercicio";
            const notificationElement = document.getElementById('result-notification');
            
            if (notificationElement) {
                notificationElement.textContent = errorMessage;
                notificationElement.className = 'result-notification incorrect show';
                
                setTimeout(() => {
                    notificationElement.className = 'result-notification';
                }, 3000);
            }
            
            // Mostrar alerta con más detalles
            alert(errorMessage + ". " + (getTranslation("link_corrupted", currentLang) || "El enlace podría estar corrupto."));
        }
    }
}

/**
 * Genera un nuevo punto a partir de un punto inicial, siguiendo las leyes
 * físicas del tipo de proceso especificado.
 */
function generatePointByProcessType(startPoint, processType) {
    console.log(`Generando punto mediante proceso ${PROCESS_TYPES[processType]} desde P=${startPoint.p.toFixed(2)}, V=${startPoint.v.toFixed(2)}`);
    
    // Límites para valores físicamente razonables
    const P_MIN = 30;
    const P_MAX = 350;
    const V_MIN = 5;
    const V_MAX = 200;
    
    let nextPoint;
    let intentos = 0;
    const maxIntentos = 20;
    
    while (intentos < maxIntentos) {
        intentos++;
        
        switch (processType) {
            case 0: // Adiabático
                nextPoint = generateAdiabaticPoint(startPoint);
                break;
            case 1: // Isocórico
                nextPoint = generateIsochoricPoint(startPoint);
                break; 
            case 2: // Isotérmico
                nextPoint = generateIsothermalPoint(startPoint);
                break;
            case 3: // Isobárico
                nextPoint = generateIsobaricPoint(startPoint);
                break;
            case 4: // Lineal
                nextPoint = generateLinearPoint(startPoint);
                break;
        }
        
        // Verificar que el punto generado es válido físicamente
        if (nextPoint && 
            nextPoint.p >= P_MIN && nextPoint.p <= P_MAX && 
            nextPoint.v >= V_MIN && nextPoint.v <= V_MAX) {
            
            // Verificar que el proceso satisface las leyes termodinámicas
            if (verifyProcess(startPoint, nextPoint, processType)) {
                console.log(`Punto válido generado: P=${nextPoint.p.toFixed(2)}, V=${nextPoint.v.toFixed(2)}, T=${nextPoint.t.toFixed(2)}`);
                return nextPoint;
            } else {
                console.log(`Punto generado no cumple restricciones físicas. Reintentando...`);
            }
        } else {
            console.log(`Punto fuera de límites físicos. Reintentando...`);
        }
    }
    
    console.error(`No se pudo generar un punto válido después de ${maxIntentos} intentos`);
    return null;
}

/**
 * Genera un punto mediante un proceso adiabático (PV^γ = constante).
 */
function generateAdiabaticPoint(startPoint) {
    const k = startPoint.p * Math.pow(startPoint.v, GAMMA);
    
    // Generar un nuevo volumen significativamente diferente al actual
    const minRelChange = 0.3; // Cambio mínimo relativo del 30%
    const maxRelChange = 0.6; // Cambio máximo relativo del 60%
    
    let newV;
    // Decidir si incrementar o decrementar el volumen
    if (Math.random() < 0.5) {
        // Incrementar V
        newV = startPoint.v * (1 + minRelChange + Math.random() * (maxRelChange - minRelChange));
    } else {
        // Decrementar V
        newV = startPoint.v * (1 - minRelChange - Math.random() * (maxRelChange - minRelChange));
    }
    
    // Calcular P según la relación adiabática: PV^γ = k
    const newP = k / Math.pow(newV, GAMMA);
    const newT = (newP * newV) / (numMoles * R);
    
    return { p: newP, v: newV, t: newT };
}

/**
 * Genera un punto mediante un proceso isocórico (V = constante).
 */
function generateIsochoricPoint(startPoint) {
    // En un proceso isocórico, V permanece constante
    const newV = startPoint.v;
    
    // Generar una nueva presión significativamente diferente a la actual
    const minRelChange = 0.3; // Cambio mínimo relativo del 30%
    const maxRelChange = 0.7; // Cambio máximo relativo del 70%
    
    let newP;
    // Decidir si incrementar o decrementar la presión
    if (Math.random() < 0.5) {
        // Incrementar P
        newP = startPoint.p * (1 + minRelChange + Math.random() * (maxRelChange - minRelChange));
    } else {
        // Decrementar P
        newP = startPoint.p * (1 - minRelChange - Math.random() * (maxRelChange - minRelChange));
    }
    
    const newT = (newP * newV) / (numMoles * R);
    
    return { p: newP, v: newV, t: newT };
}

/**
 * Genera un punto mediante un proceso isotérmico (PV = constante).
 */
function generateIsothermalPoint(startPoint) {
    const pv = startPoint.p * startPoint.v;
    
    // Generar un nuevo volumen significativamente diferente al actual
    const minRelChange = 0.3; // Cambio mínimo relativo del 30%
    const maxRelChange = 0.7; // Cambio máximo relativo del 70%
    
    let newV;
    // Decidir si incrementar o decrementar el volumen
    if (Math.random() < 0.5) {
        // Incrementar V
        newV = startPoint.v * (1 + minRelChange + Math.random() * (maxRelChange - minRelChange));
    } else {
        // Decrementar V
        newV = startPoint.v * (1 - minRelChange - Math.random() * (maxRelChange - minRelChange));
    }
    
    // Calcular P según la relación isotérmica: PV = constante
    const newP = pv / newV;
    const newT = startPoint.t; // La temperatura permanece constante
    
    return { p: newP, v: newV, t: newT };
}

/**
 * Genera un punto mediante un proceso isobárico (P = constante).
 */
function generateIsobaricPoint(startPoint) {
    // En un proceso isobárico, P permanece constante
    const newP = startPoint.p;
    
    // Generar un nuevo volumen significativamente diferente al actual
    const minRelChange = 0.3; // Cambio mínimo relativo del 30%
    const maxRelChange = 0.7; // Cambio máximo relativo del 70%
    
    let newV;
    // Decidir si incrementar o decrementar el volumen
    if (Math.random() < 0.5) {
        // Incrementar V
        newV = startPoint.v * (1 + minRelChange + Math.random() * (maxRelChange - minRelChange));
    } else {
        // Decrementar V
        newV = startPoint.v * (1 - minRelChange - Math.random() * (maxRelChange - minRelChange));
    }
    
    const newT = (newP * newV) / (numMoles * R);
    
    return { p: newP, v: newV, t: newT };
}

/**
 * Genera un punto mediante un proceso lineal en el diagrama P-V.
 */
function generateLinearPoint(startPoint) {
    // Generar una pendiente aleatoria para la recta P-V
    const slope = -10 + Math.random() * 20; // Entre -10 y 10
    
    // Generar un nuevo volumen significativamente diferente al actual
    const minRelChange = 0.3; // Cambio mínimo relativo del 30%
    const maxRelChange = 0.7; // Cambio máximo relativo del 70%
    
    let newV;
    // Decidir si incrementar o decrementar el volumen
    if (Math.random() < 0.5) {
        // Incrementar V
        newV = startPoint.v * (1 + minRelChange + Math.random() * (maxRelChange - minRelChange));
    } else {
        // Decrementar V
        newV = startPoint.v * (1 - minRelChange - Math.random() * (maxRelChange - minRelChange));
    }
    
    // Ecuación de la recta: P = P_inicial + pendiente * (V - V_inicial)
    const newP = startPoint.p + slope * (newV - startPoint.v);
    const newT = (newP * newV) / (numMoles * R);
    
    return { p: newP, v: newV, t: newT };
}

/**
 * Función auxiliar para generar un valor aleatorio entre min y max (inclusive).
 */
function getRandomValue(min, max) {
    return min + Math.random() * (max - min);
} 

// Listener para detectar cambios de idioma
document.addEventListener('languageChanged', function(e) {
    // Actualizar los datos mostrados con el nuevo idioma
    if (cycleData && cycleData.length > 0) {
        displayProblemData();
        setupTable();
    }
    
    // Redibujar el gráfico para actualizar leyendas y etiquetas
    drawGraph();
});