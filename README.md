# Simulador de Ciclos Termodinámicos

Este simulador web permite generar y resolver ciclos termodinámicos con gases ideales monoatómicos. Es una herramienta educativa que ayuda a comprender los procesos termodinámicos básicos y calcular variables como calor, trabajo, energía interna, entalpía y entropía.

## Características

- Genera ciclos termodinámicos aleatorios de 3 a 5 procesos
- Simula 5 tipos diferentes de procesos:
  - Adiabático (PV^γ = constante)
  - Isocórico (V = constante)
  - Isotérmico (PV = constante)
  - Isobárico (P = constante)
  - Lineal P-V (relación lineal entre P y V)
- Visualiza los ciclos en un diagrama P-V interactivo
- Calcula y valida valores termodinámicos:
  - Calor (Q)
  - Trabajo (W)
  - Cambio de energía interna (ΔU)
  - Cambio de entalpía (ΔH)
  - Cambio de entropía (ΔS)

## Cómo usar

1. Al cargar la página, se genera automáticamente un ciclo termodinámico aleatorio.
2. El diagrama P-V muestra el ciclo, con colores diferentes para cada tipo de proceso.
3. Los datos del problema incluyen:
   - Tipo de gas y constante R
   - Cantidad de sustancia (moles)
   - Lista de procesos con sus puntos correspondientes
   - Valores de presión y volumen en cada punto
4. Para resolver el problema:
   - Calcule los valores de Q, W, ΔU, ΔH y ΔS para cada proceso
   - Ingrese sus respuestas en la tabla
   - Presione "Validar Resultados" para comprobar sus cálculos
5. Las respuestas correctas (±1% de error) se marcarán en verde, las incorrectas en rojo
6. Para generar un nuevo ciclo, presione "Generar Nuevo Ciclo"

## Fórmulas útiles

- **Primera ley de la termodinámica**: ΔU = Q + W
- **Gas ideal**: PV = nRT
- **Capacidades caloríficas (gas monoatómico)**:
  - Cv = 3R/2
  - Cp = 5R/2
- **Proceso adiabático**: Q = 0, PV^γ = constante (γ = 5/3)
- **Proceso isocórico**: W =,0, Q = nCvΔT
- **Proceso isotérmico**: ΔU = 0, W = -nRTln(V₂/V₁)
- **Proceso isobárico**: P = constante, W = PΔV

## Tecnologías utilizadas

Esta aplicación está construida utilizando:
- HTML5
- CSS3
- JavaScript vanilla (sin frameworks ni dependencias externas)

El simulador funciona completamente en el navegador y no requiere conexión a internet después de cargar.

## Compatibilidad

La aplicación es compatible con todos los navegadores modernos:
- Chrome
- Firefox
- Safari
- Edge

## Autor

Desarrollado como proyecto educativo para cursos de termodinámica. 