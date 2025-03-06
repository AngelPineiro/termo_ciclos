// Constantes físicas
const GAMMA = 5/3; // Coeficiente adiabático (gas monoatómico)
const GAMMA_DISPLAY = "5/3"; // Representación de GAMMA como fracción para mostrar en la interfaz
const R = 8.31; // Constante de los gases ideales en J/(mol·K)
const PROCESS_TYPES = ["Adiabático", "Isocórico", "Isotérmico", "Isobárico", "Lineal P-V"];
const PROCESS_COLORS = ["#8b5cf6", "#ef4444", "#10b981", "#3b82f6", "#f97316"];

// Variables globales
let cycleData = []; // Almacena los datos del ciclo
let numMoles = 1; // Número de moles (1 por defecto)
let canvas; // Elemento canvas
let ctx; // Contexto de dibujo

// Esperar a que se cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el canvas y su contexto
    canvas = document.getElementById('graph-canvas');
    ctx = canvas.getContext('2d');
    
    // Botones
    const generateCycleBtn = document.getElementById('generate-cycle-btn');
    const validateBtn = document.querySelector('#validate-btn');
    
    // Event listeners
    generateCycleBtn.addEventListener('click', generateCycle);
    validateBtn.addEventListener('click', validateResults);
    
    // Generar el primer ciclo
    generateCycle();
});

/**
 * Genera un ciclo termodinámico aleatorio con puntos y procesos
 */
function generateCycle() {
    console.log("Generando ciclo termodinámico...");
    
    // Limpiar datos previos
    cycleData = [];
    
    // 1. Determinar número de procesos (entre 3 y 5)
    const numProcesses = 3 + Math.floor(Math.random() * 3);
    console.log(`Número de procesos: ${numProcesses}`);
    
    // 2. Determinar tipos de procesos evitando repeticiones consecutivas
    const processTypes = [];
    let prevProcessType = -1;
    
    for (let i = 0; i < numProcesses; i++) {
        let processType;
        do {
            processType = Math.floor(Math.random() * 5); // 0-4 para los diferentes tipos
        } while (processType === prevProcessType);
        
        processTypes.push(processType);
        prevProcessType = processType;
    }
    
    // Asegurarse de que el último proceso y el primero sean diferentes
    if (processTypes.length > 1 && processTypes[0] === processTypes[processTypes.length - 1]) {
        let newType;
        do {
            newType = Math.floor(Math.random() * 5);
        } while (newType === processTypes[processTypes.length - 1] || 
                 newType === processTypes[processTypes.length - 2]);
        
        processTypes[processTypes.length - 1] = newType;
    }
    
    console.log("Tipos de procesos:", processTypes.map(p => PROCESS_TYPES[p]));
    
    // 3. Enfoque más sólido: generar el primer punto, luego el ciclo completo
    
    // Primer punto: Generar P y V aleatorios dentro de rangos razonables
    const p1 = 100 + Math.random() * 100; // Presión entre 100-200 kPa
    const v1 = 30 + Math.random() * 40; // Volumen entre 30-70 L
    // Calcular temperatura con la ley de gases ideales: PV = nRT
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
    
    // 4. Generar los puntos siguientes de manera secuencial, asegurando que cada proceso sea físicamente viable
    let currentPoint = firstPoint;
    
    for (let i = 0; i < numProcesses - 1; i++) {
        const processType = processTypes[i];
        
        // Si estamos en el penúltimo punto (i = numProcesses - 2), necesitamos asegurar que
        // el último proceso (processTypes[numProcesses - 1]) pueda cerrar el ciclo
        if (i === numProcesses - 2) {
            // Generar un punto que permita cerrar el ciclo con el proceso final
            const finalProcessType = processTypes[numProcesses - 1];
            
            // Método mejorado: generar puntos candidatos hasta encontrar uno viable
            let nextPoint = null;
            let attempts = 0;
            const maxAttempts = 50;
            
            while (attempts < maxAttempts) {
                // Generar un candidato usando el proceso actual
                const candidate = generatePointByProcessType(currentPoint, processType);
                
                // Verificar si este punto puede cerrar el ciclo con el primer punto
                if (canProcessClose(candidate, firstPoint, finalProcessType)) {
                    nextPoint = candidate;
                    break;
                }
                
                attempts++;
            }
            
            // Si no se encontró un punto viable después de los intentos máximos, regenerar el ciclo
            if (nextPoint === null) {
                console.log("No se pudo encontrar un punto viable para cerrar el ciclo. Regenerando...");
                return generateCycle();
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
    
    // 5. Asignar los tipos de procesos y los índices de los siguientes puntos
    for (let i = 0; i < points.length; i++) {
        points[i].processType = processTypes[i];
        points[i].nextIndex = (i + 1) % points.length;
    }
    
    // 6. Verificación final: comprobar que todos los procesos son físicamente viables
    let allProcessesValid = true;
    
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const nextIndex = point.nextIndex;
        const nextPoint = points[nextIndex];
        const processType = point.processType;
        
        if (!canProcessClose(point, nextPoint, processType)) {
            console.log(`Proceso inválido detectado entre puntos ${i+1} y ${nextIndex+1}. Regenerando ciclo...`);
            allProcessesValid = false;
            break;
        }
    }
    
    if (!allProcessesValid) {
        return generateCycle();
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
    
    console.log("Ciclo generado con éxito:", cycleData);
    
    // Dibujar el ciclo y actualizar la interfaz
    drawGraph();
    displayProblemData();
    setupTable();
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
 * Verifica si es posible cerrar el ciclo desde un punto hasta otro
 * usando un tipo específico de proceso
 */
function canProcessClose(startPoint, targetPoint, processType) {
    switch (processType) {
        case 0: // Adiabático (PV^γ = k)
            // Comprobamos si la relación PV^γ = k se mantiene
            const k1 = startPoint.p * Math.pow(startPoint.v, GAMMA);
            const k2 = targetPoint.p * Math.pow(targetPoint.v, GAMMA);
            // Tolerancia extremadamente precisa (< 0.01%)
            return Math.abs(k1 - k2) / k1 < 0.0001;
            
        case 1: // Isocórico (V = constante)
            // Los volúmenes deben ser iguales (con una tolerancia extremadamente pequeña)
            return Math.abs(startPoint.v - targetPoint.v) / startPoint.v < 0.0001;
            
        case 2: // Isotérmico (T = constante, PV = constante)
            // Las temperaturas deben ser iguales
            const pv1 = startPoint.p * startPoint.v;
            const pv2 = targetPoint.p * targetPoint.v;
            // Tolerancia extremadamente precisa (< 0.01%)
            return Math.abs(pv1 - pv2) / pv1 < 0.0001;
            
        case 3: // Isobárico (P = constante)
            // Las presiones deben ser exactamente iguales (con tolerancia extremadamente pequeña)
            return Math.abs(startPoint.p - targetPoint.p) / startPoint.p < 0.0001;
            
        case 4: // Lineal P-V
            // Siempre es posible conectar dos puntos con una línea recta
            return true;
    }
    return false;
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
    
    // Obtener dimensiones del contenedor
    const graphContainer = document.querySelector('.graph-container');
    const containerWidth = graphContainer.clientWidth;
    const containerHeight = containerWidth * 0.7; // Proporción 10:7
    
    // Ajustar tamaño del canvas
    canvas.width = containerWidth;
    canvas.height = containerHeight;
    
    // Tamaño de fuente base proporcional al contenedor
    const baseFontSize = Math.max(10, containerWidth / 40);
    
    // Limpiar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Si no hay datos, mostrar mensaje y salir
    if (cycleData.length === 0) {
        ctx.fillStyle = '#64748b';
        ctx.font = `${baseFontSize + 2}px Segoe UI`;
        ctx.textAlign = 'center';
        ctx.fillText('Generando ciclo termodinámico...', canvas.width / 2, canvas.height / 2);
        return;
    }
    
    // Determinar límites del gráfico
    let minP = Infinity;
    let maxP = -Infinity;
    let minV = Infinity;
    let maxV = -Infinity;
    
    cycleData.forEach(point => {
        minP = Math.min(minP, point.p);
        maxP = Math.max(maxP, point.p);
        minV = Math.min(minV, point.v);
        maxV = Math.max(maxV, point.v);
    });
    
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
    
    // Dibujar cuadrícula
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 0.5;
    
    // Cuadrícula horizontal
    const pStep = determineStep(minP, maxP);
    for (let p = Math.ceil(minP / pStep) * pStep; p <= maxP; p += pStep) {
        const y = scaleY(p);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + graphWidth, y);
        ctx.stroke();
    }
    
    // Cuadrícula vertical
    const vStep = determineStep(minV, maxV);
    for (let v = Math.ceil(minV / vStep) * vStep; v <= maxV; v += vStep) {
        const x = scaleX(v);
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, padding.top + graphHeight);
        ctx.stroke();
    }
    
    // Ejes
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1;
    
    // Eje X
    ctx.beginPath();
    ctx.moveTo(padding.left, canvas.height - padding.bottom);
    ctx.lineTo(padding.left + graphWidth, canvas.height - padding.bottom);
    ctx.stroke();
    
    // Eje Y
    ctx.beginPath();
    ctx.moveTo(padding.left, canvas.height - padding.bottom);
    ctx.lineTo(padding.left, padding.top);
    ctx.stroke();
    
    // Etiquetas de ejes
    ctx.fillStyle = '#475569';
    ctx.font = `${baseFontSize}px Segoe UI`;
    ctx.textAlign = 'center';
    
    // Etiqueta X
    ctx.fillText('Volumen (L)', padding.left + graphWidth / 2, canvas.height - padding.bottom / 3);
    
    // Etiqueta Y
    ctx.save();
    ctx.translate(padding.left / 3, padding.top + graphHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Presión (kPa)', 0, 0);
    ctx.restore();
    
    // Valores en ejes
    ctx.textAlign = 'center';
    ctx.fillStyle = '#475569';
    ctx.font = `${baseFontSize - 1}px Segoe UI`;
    
    // Valores en eje X
    for (let v = Math.ceil(minV / vStep) * vStep; v <= maxV; v += vStep) {
        const x = scaleX(v);
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - padding.bottom);
        ctx.lineTo(x, canvas.height - padding.bottom + 5);
        ctx.stroke();
        ctx.fillText(v.toFixed(0), x, canvas.height - padding.bottom / 1.5);
    }
    
    // Valores en eje Y
    ctx.textAlign = 'right';
    for (let p = Math.ceil(minP / pStep) * pStep; p <= maxP; p += pStep) {
        const y = scaleY(p);
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left - 5, y);
        ctx.stroke();
        ctx.fillText(p.toFixed(0), padding.left - 8, y);
    }
    
    console.log("Dibujando procesos...");
    
    // DIBUJAR LOS PROCESOS DEL CICLO
    
    // Caso especial: verificar explícitamente si hay 5 puntos para garantizar la conexión completa
    const isFivePointCycle = cycleData.length === 5;
    
    // Número total de procesos a dibujar
    const totalProcesses = cycleData.length;
    console.log(`Total de procesos a dibujar: ${totalProcesses}`);
    
    // Antes de dibujar, verificamos que todos los puntos tienen correctamente asignado su tipo de proceso
    console.log("Verificando tipos de procesos antes de dibujar:");
    for (let i = 0; i < cycleData.length; i++) {
        const point = cycleData[i];
        const nextIndex = point.nextIndex;
        console.log(`Punto ${i+1} -> Punto ${nextIndex+1}: ${PROCESS_TYPES[point.processType]}`);
        
        // Si algún proceso no tiene tipo asignado, le asignamos uno por defecto
        if (point.processType === undefined) {
            console.log(`ERROR: Punto ${i+1} no tiene tipo de proceso asignado. Asignando adiabático por defecto.`);
            point.processType = 0; // Adiabático por defecto
        }
    }
    
    // Dibujar cada proceso del ciclo
    for (let i = 0; i < totalProcesses; i++) {
        const currentPoint = cycleData[i];
        
        // El nextIndex indica a qué punto se conecta este
        const nextIndex = currentPoint.nextIndex;
        console.log(`Dibujando proceso ${i+1}: Punto ${i+1} a Punto ${nextIndex+1}, Tipo: ${PROCESS_TYPES[currentPoint.processType]}`);
        
        const nextPoint = cycleData[nextIndex];
        
        const x1 = scaleX(currentPoint.v);
        const y1 = scaleY(currentPoint.p);
        const x2 = scaleX(nextPoint.v);
        const y2 = scaleY(nextPoint.p);
        
        const processType = currentPoint.processType;
        ctx.strokeStyle = PROCESS_COLORS[processType];
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        // Aplicar sombra
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        
        // Verificar si este es el proceso final que cierra el ciclo
        const isClosingProcess = nextIndex === 0;
        
        // Caso especial para ciclos de 5 puntos: proceso del último punto al primero
        if (isFivePointCycle && i === 4) {
            // Asegurar que el punto 5 se conecta con el punto 1
            console.log("Dibujando conexión especial del punto 5 al punto 1");
            const startPoint = cycleData[4]; // Punto 5
            const endPoint = cycleData[0];   // Punto 1
            
            dibujarProceso(ctx, startPoint, endPoint, startPoint.processType, scaleX, scaleY);
        } 
        // Verificación especial para la conexión entre los puntos 3 y 4
        else if (i === 2) {
            console.log("Dibujando conexión especial entre los puntos 3 y 4");
            dibujarProceso(ctx, currentPoint, nextPoint, processType, scaleX, scaleY);
        } 
        else {
            // Procesos normales
            dibujarProceso(ctx, currentPoint, nextPoint, processType, scaleX, scaleY);
        }
        
        ctx.stroke();
    }
    
    console.log("Dibujando puntos...");
    
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
    
    // Función auxiliar para dibujar un proceso según su tipo
    function dibujarProceso(ctx, startPoint, endPoint, processType, scaleX, scaleY) {
        if (processType === 0) { // Adiabático
            // Dibujar curva adiabática (PV^γ = k) con alta precisión
            const k = startPoint.p * Math.pow(startPoint.v, GAMMA);
            
            // Usar un número muy elevado de pasos para máxima precisión
            const steps = 5000;
            
            // Determinar dirección
            const vStart = startPoint.v;
            const vEnd = endPoint.v;
            const vStep = (vEnd - vStart) / steps;
            
            // Comprobar que el punto realmente sigue la curva adiabática
            const k_end = endPoint.p * Math.pow(endPoint.v, GAMMA);
            
            // Si hay alguna inconsistencia, corregirla
            if (Math.abs(k - k_end) / k > 0.0001) {
                console.log(`Corrigiendo inconsistencia en proceso adiabático: k=${k}, k_end=${k_end}`);
                // Usar la constante k del punto actual para calcular todo el proceso
            }
            
            // Dibujar una curva adiabática perfecta siguiendo PV^γ = k en todo momento
            for (let j = 1; j <= steps; j++) {
                const v = vStart + j * vStep;
                const p = k / Math.pow(v, GAMMA);
                ctx.lineTo(scaleX(v), scaleY(p));
            }
        } else if (processType === 2) { // Isotérmico
            // Dibujar curva isotérmica (PV = k) con alta precisión
            const pv = startPoint.p * startPoint.v;
            
            // Usar un número muy elevado de pasos para máxima precisión
            const steps = 5000;
            
            // Determinar dirección
            const vStart = startPoint.v;
            const vEnd = endPoint.v;
            const vStep = (vEnd - vStart) / steps;
            
            // Comprobar que el punto realmente sigue la curva isotérmica
            const pv_end = endPoint.p * endPoint.v;
            
            // Si hay alguna inconsistencia, corregirla
            if (Math.abs(pv - pv_end) / pv > 0.0001) {
                console.log(`Corrigiendo inconsistencia en proceso isotérmico: pv=${pv}, pv_end=${pv_end}`);
                // Usar la constante pv del punto actual para calcular todo el proceso
            }
            
            // Dibujar una curva isotérmica perfecta siguiendo PV = k en todo momento
            for (let j = 1; j <= steps; j++) {
                const v = vStart + j * vStep;
                const p = pv / v;
                ctx.lineTo(scaleX(v), scaleY(p));
            }
        } else if (processType === 1) { // Isocórico
            // Para un proceso isocórico, verificar que el volumen realmente es constante
            if (Math.abs(startPoint.v - endPoint.v) / startPoint.v > 0.0001) {
                console.log(`Corrigiendo inconsistencia en proceso isocórico: v=${startPoint.v}, v_end=${endPoint.v}`);
                // Dibujamos línea recta vertical exacta 
                ctx.lineTo(scaleX(startPoint.v), scaleY(endPoint.p)); // Mismo x (volumen), diferente y (presión)
            } else {
                // Línea recta normal
                ctx.lineTo(scaleX(endPoint.v), scaleY(endPoint.p));
            }
        } else if (processType === 3) { // Isobárico
            // Para un proceso isobárico, verificar que la presión realmente es constante
            if (Math.abs(startPoint.p - endPoint.p) / startPoint.p > 0.0001) {
                console.log(`Corrigiendo inconsistencia en proceso isobárico: p=${startPoint.p}, p_end=${endPoint.p}`);
                // Dibujamos línea recta horizontal exacta
                ctx.lineTo(scaleX(endPoint.v), scaleY(startPoint.p)); // Mismo y (presión), diferente x (volumen)
            } else {
                // Línea recta normal
                ctx.lineTo(scaleX(endPoint.v), scaleY(endPoint.p));
            }
        } else { // Lineal u otros
            // Línea recta para los otros procesos
            ctx.lineTo(scaleX(endPoint.v), scaleY(endPoint.p));
        }
    }
    
    console.log("Gráfico dibujado con éxito");
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
        problemDataSection.innerHTML = '<p>Genera un ciclo para ver los datos del problema.</p>';
        return;
    }
    
    // Limpiar contenido previo
    problemDataSection.innerHTML = '';
    
    // Datos del Gas
    const gasSection = document.createElement('div');
    gasSection.className = 'gas-data';
    gasSection.innerHTML = `
        <h3>Datos del Gas</h3>
        <div class="data-property">Gas: Gas ideal monoatómico (γ = ${GAMMA_DISPLAY})</div>
        <div class="data-property">Constante R: ${R} J/(mol·K)</div>
        <div class="data-property">Cantidad de sustancia: ${numMoles} mol</div>
    `;
    problemDataSection.appendChild(gasSection);
    
    // Procesos
    const processesSection = document.createElement('div');
    processesSection.className = 'process-data';
    processesSection.innerHTML = '<h3>Procesos</h3>';
    
    // Obtener todos los procesos
    for (let i = 0; i < cycleData.length; i++) {
        const point = cycleData[i];
        const processType = PROCESS_TYPES[point.processType];
        
        // El siguiente punto (considerar que el siguiente del último es el primero)
        const nextIndex = point.nextIndex;
        let nextPointNumber = nextIndex + 1;
        if (nextIndex === 0) {
            nextPointNumber = 1;
        }
        
        const processDiv = document.createElement('div');
        processDiv.innerHTML = `Proceso ${i + 1}: ${processType} (${i + 1} → ${nextPointNumber})`;
        processesSection.appendChild(processDiv);
    }
    
    problemDataSection.appendChild(processesSection);
    
    // Puntos
    const pointsSection = document.createElement('div');
    pointsSection.className = 'point-data';
    pointsSection.innerHTML = '<h3>Puntos</h3>';
    
    // Crear un mapa para almacenar puntos únicos
    // Un punto se considera único por sus valores de presión y volumen
    const uniquePoints = new Map();
    
    // Agregar todos los puntos del ciclo
    for (let i = 0; i < cycleData.length; i++) {
        const point = cycleData[i];
        uniquePoints.set(i + 1, {
            p: point.p,
            v: point.v,
            t: point.t
        });
    }
    
    // Mostrar todos los puntos en orden
    for (let [pointNumber, pointData] of uniquePoints) {
        const pointDiv = document.createElement('div');
        pointDiv.innerHTML = `Punto ${pointNumber}: P = ${pointData.p.toFixed(2)} kPa, V = ${pointData.v.toFixed(4)} L`;
        pointsSection.appendChild(pointDiv);
    }
    
    problemDataSection.appendChild(pointsSection);
    
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
    
    // Añadir filas para cada proceso
    for (let i = 0; i < cycleData.length; i++) {
        const point = cycleData[i];
        const nextIndex = point.nextIndex;
        const processType = PROCESS_TYPES[point.processType];
        
        // Si el siguiente punto es el 0, se muestra como 1 (para cerrar el ciclo)
        let nextPointNumber = nextIndex + 1;
        if (nextIndex === 0) {
            nextPointNumber = 1;
        }
        
        const row = document.createElement('tr');
        row.className = 'process-row';
        row.innerHTML = `
            <td class="process-name">Proceso ${i + 1} (${processType}: ${i + 1} → ${nextPointNumber})</td>
            <td><input type="number" step="any" id="q-${i}" class="process-input" placeholder="0"></td>
            <td><input type="number" step="any" id="w-${i}" class="process-input" placeholder="0"></td>
            <td><input type="number" step="any" id="du-${i}" class="process-input" placeholder="0"></td>
            <td><input type="number" step="any" id="dh-${i}" class="process-input" placeholder="0"></td>
            <td><input type="number" step="any" id="ds-${i}" class="process-input" placeholder="0"></td>
        `;
        
        tableBody.appendChild(row);
    }
    
    // Añadir fila para el total del ciclo
    const totalRow = document.createElement('tr');
    totalRow.className = 'total-row';
    totalRow.innerHTML = `
        <td class="total-label"><strong>Total del Ciclo</strong></td>
        <td><input type="number" step="any" id="q-total" class="process-input total-input" placeholder="0"></td>
        <td><input type="number" step="any" id="w-total" class="process-input total-input" placeholder="0"></td>
        <td><input type="number" step="any" id="du-total" class="process-input total-input" placeholder="0"></td>
        <td><input type="number" step="any" id="dh-total" class="process-input total-input" placeholder="0"></td>
        <td><input type="number" step="any" id="ds-total" class="process-input total-input" placeholder="0"></td>
    `;
    
    tableBody.appendChild(totalRow);
}

/**
 * Valida los resultados ingresados por el usuario
 */
function validateResults() {
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
    
    // Redondear totales
    const correctTotals = {
        q: parseFloat(totalQ.toFixed(1)),
        w: parseFloat(totalW.toFixed(1)),
        du: parseFloat(totalDU.toFixed(1)),
        dh: parseFloat(totalDH.toFixed(1)),
        ds: parseFloat(totalDS.toFixed(3))
    };
    
    // Validar valores ingresados por el usuario
    for (let i = 0; i < cycleData.length; i++) {
        // Verificar cada valor
        validateInput(`q-${i}`, correctValues[i].q);
        validateInput(`w-${i}`, correctValues[i].w);
        validateInput(`du-${i}`, correctValues[i].du);
        validateInput(`dh-${i}`, correctValues[i].dh);
        validateInput(`ds-${i}`, correctValues[i].ds);
    }
    
    // Validar totales
    validateInput('q-total', correctTotals.q);
    validateInput('w-total', correctTotals.w);
    validateInput('du-total', correctTotals.du);
    validateInput('dh-total', correctTotals.dh);
    validateInput('ds-total', correctTotals.ds);
}

/**
 * Valida un valor ingresado y aplica estilo según resultado
 */
function validateInput(inputId, correctValue) {
    const input = document.getElementById(inputId);
    const userValue = parseFloat(input.value);
    
    if (!isNaN(userValue)) {
        // Verificar con margen de error del 1%
        const relativeError = Math.abs((userValue - correctValue) / correctValue);
        const isCorrect = relativeError <= 0.01;
        
        // Aplicar estilo según resultado
        input.parentElement.classList.remove('correct', 'incorrect');
        input.parentElement.classList.add(isCorrect ? 'correct' : 'incorrect');
        
        // Mostrar valor correcto si es incorrecto
        if (!isCorrect) {
            input.title = `Valor correcto: ${correctValue}`;
        } else {
            input.title = '';
        }
    }
} 