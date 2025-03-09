// Definición de textos en múltiples idiomas
const translations = {
    // Español (idioma por defecto)
    es: {
        // Interfaz general
        language: 'Idioma:',
        title: 'Simulador de Ciclos Termodinámicos',
        email: 'Correo:',
        license: 'Licencia Apache 2.0',
        visit_counter: 'Visitas:',
        correct_validations: 'Correctas:',
        incorrect_validations: 'Incorrectas:',
        cycles_completed: 'Ciclos completados:',
        
        // Tipos de procesos
        adiabatic: 'Adiabático',
        isochoric: 'Isocórico',
        isothermal: 'Isotérmico',
        isobaric: 'Isobárico',
        linear: 'Lineal P-V',
        
        // Ciclos
        random_cycle: 'Ciclo Aleatorio',
        carnot_cycle: 'Ciclo de Carnot',
        otto_cycle: 'Ciclo de Otto',
        diesel_cycle: 'Ciclo Diesel',
        rankine_cycle: 'Ciclo Rankine',
        brayton_cycle: 'Ciclo Brayton',
        generate_cycle: 'Generar Nuevo Ciclo',
        
        // Compartir ejercicio
        share_exercise: 'Compartir Ejercicio',
        confirm_replace_shared_cycle: 'Estás viendo un ejercicio compartido. ¿Realmente quieres generar un nuevo ciclo? Se perderán los datos del ejercicio compartido.',
        
        // Datos del problema
        problem_data: 'Datos del problema',
        gas: 'Gas:',
        gas_type: 'Gas ideal monoatómico (γ = 5/3)',
        r_constant: 'Constante R:',
        amount: 'Cantidad de sustancia:',
        processes: 'Procesos:',
        point_data: 'Datos de los puntos:',
        
        // Tabla de cálculos
        thermo_variables: 'Cálculo de variables termodinámicas',
        validate: 'Validar Resultados',
        process: 'Proceso',
        heat: 'Q [J]',
        work: 'W [J]',
        internal_energy: 'ΔU [J]',
        enthalpy: 'ΔH [J]',
        entropy: 'ΔS [J/K]',
        
        // Para otros textos generados dinámicamente
        total_cycle: 'Total del Ciclo',
        correct: 'Correcto',
        incorrect: 'Incorrecto',
        point: 'Punto',
        calculated_value: 'Valor calculado automáticamente (suma de valores individuales)',
        
        // Etiquetas de ejes
        volume_axis: 'Volumen (L)',
        pressure_axis: 'Presión (kPa)',
        
        // Mensajes
        generating_cycle: 'Generando ciclo termodinámico...',
        error_invalid_data: 'Error: Datos de ciclo inválidos',
        generate_to_see_data: 'Genera un ciclo para ver los datos del problema.',
        gas_data_title: 'Datos del Gas',
        
        // Botones
        share_exercise: 'Compartir Ejercicio',
        
        // Instrucciones
        instructions_title: 'Instrucciones',
        instructions_text: 'Esta aplicación simula diferentes ciclos termodinámicos y te permite calcular las variables termodinámicas asociadas. Para usarla:',
        instructions_step1: 'Selecciona un tipo de ciclo del menú desplegable (Carnot, Otto, etc.).',
        instructions_step2: 'Haz clic en "Generar Nuevo Ciclo" para crear un diagrama P-V.',
        instructions_step3: 'Calcula manualmente las variables termodinámicas (Q, W, ΔU, etc.) para cada proceso.',
        instructions_step4: 'Introduce tus resultados en la tabla y valídalos con el botón "Validar Resultados".',
        instructions_step5: 'Puedes compartir el ejercicio con otros mediante el botón "Compartir Ejercicio".',
        hide_instructions: 'Ocultar instrucciones',
        show_instructions: 'Mostrar instrucciones',
        
        // Información de ciclos
        show_cycles_info: 'Mostrar información sobre ciclos termodinámicos',
        hide_cycles_info: 'Ocultar información sobre ciclos',
        
        // Ciclo de Carnot
        carnot_title: 'Ciclo de Carnot',
        carnot_description: 'El ciclo de Carnot es un ciclo termodinámico reversible que consiste en dos procesos isotérmicos y dos adiabáticos. Es el ciclo teórico más eficiente posible entre dos temperaturas dadas.',
        carnot_processes: 'Procesos:',
        carnot_process1: '1→2: Expansión isotérmica (T constante)',
        carnot_process2: '2→3: Expansión adiabática (sin transferencia de calor)',
        carnot_process3: '3→4: Compresión isotérmica (T constante)',
        carnot_process4: '4→1: Compresión adiabática (sin transferencia de calor)',
        carnot_efficiency: 'Eficiencia:',
        carnot_efficiency_explanation: 'Donde T₁ es la temperatura de la fuente caliente y T₂ es la temperatura de la fuente fría.',
        
        // Ciclo de Otto
        otto_title: 'Ciclo de Otto',
        otto_description: 'El ciclo de Otto es el ciclo ideal para motores de combustión interna de encendido por chispa. Consta de procesos adiabáticos e isocóricos.',
        otto_processes: 'Procesos:',
        otto_process1: '1→2: Compresión adiabática',
        otto_process2: '2→3: Adición de calor a volumen constante (isocórico)',
        otto_process3: '3→4: Expansión adiabática (potencia)',
        otto_process4: '4→1: Rechazo de calor a volumen constante (isocórico)',
        otto_efficiency: 'Eficiencia:',
        otto_efficiency_explanation: 'Donde r es la relación de compresión y γ es el coeficiente adiabático.',
        
        // Ciclo Diesel
        diesel_title: 'Ciclo Diesel',
        diesel_description: 'El ciclo Diesel es el ciclo ideal para motores de combustión interna de encendido por compresión. Se caracteriza por la adición de calor a presión constante.',
        diesel_processes: 'Procesos:',
        diesel_process1: '1→2: Compresión adiabática',
        diesel_process2: '2→3: Adición de calor a presión constante (isobárico)',
        diesel_process3: '3→4: Expansión adiabática (potencia)',
        diesel_process4: '4→1: Rechazo de calor a volumen constante (isocórico)',
        diesel_efficiency: 'Eficiencia:',
        diesel_efficiency_formula: 'η = 1 - (1/r^(γ-1))((α^γ - 1)/(γ(α - 1)))',
        diesel_efficiency_explanation: 'Donde r es la relación de compresión, α es la relación de corte y γ es el coeficiente adiabático.',
        
        // Ciclo Rankine
        rankine_title: 'Ciclo Rankine',
        rankine_description: 'El ciclo Rankine es el ciclo ideal para las centrales térmicas de vapor. Convierte calor en trabajo mediante el uso de agua como fluido de trabajo.',
        rankine_processes: 'Procesos:',
        rankine_process1: '1→2: Compresión isentrópica en la bomba',
        rankine_process2: '2→3: Adición de calor a presión constante en la caldera',
        rankine_process3: '3→4: Expansión isentrópica en la turbina',
        rankine_process4: '4→1: Rechazo de calor a presión constante en el condensador',
        rankine_efficiency: 'Eficiencia:',
        rankine_efficiency_formula: 'η = (h₃ - h₄ - (h₂ - h₁))/(h₃ - h₂)',
        rankine_efficiency_explanation: 'Donde h es la entalpía específica en los diferentes puntos del ciclo.',
        
        // Ciclo Brayton
        brayton_title: 'Ciclo Brayton',
        brayton_description: 'El ciclo Brayton es el ciclo ideal para las turbinas de gas y motores a reacción. Consta de procesos adiabáticos e isobáricos.',
        brayton_processes: 'Procesos:',
        brayton_process1: '1→2: Compresión adiabática en el compresor',
        brayton_process2: '2→3: Adición de calor a presión constante en la cámara de combustión',
        brayton_process3: '3→4: Expansión adiabática en la turbina',
        brayton_process4: '4→1: Rechazo de calor a presión constante',
        brayton_efficiency: 'Eficiencia:',
        brayton_efficiency_formula: 'η = 1 - 1/r^((γ-1)/γ)',
        brayton_efficiency_explanation: 'Donde r es la relación de presiones y γ es el coeficiente adiabático.',
        
        // Rankine efficiency subscripts
        net_work: 'neto',
        heat_in: 'entrada',
        
        // Gamificación
        total_points: 'Puntos totales: ',
        points: 'puntos',
        exercise_difficulty: 'Dificultad del ejercicio:',
        export_progress: 'Exportar progreso',
        import_progress: 'Importar progreso',
        correct_answer: '¡Correcto! +{points} puntos',
        incorrect_answer: 'Incorrecto. -10 puntos',
        difficulty_level: 'Nivel {level}',
        
        // Nuevas claves para la sección de gamificación en instrucciones
        gamification_title: 'Sistema de Puntos',
        gamification_text: 'Esta aplicación incluye un sistema de puntos que te ayuda a medir tu progreso:',
        gamification_step1: 'Cada vez que valides correctamente un valor, ganarás puntos según la dificultad del ciclo.',
        gamification_step2: 'Respuestas incorrectas resultarán en una pérdida de puntos.',
        gamification_step3: 'Es posible acumular puntos negativos.',
        gamification_step4: 'La dificultad del ciclo se muestra con estrellas (de 1 a 5 ★).',
        gamification_step5: 'La barra de energía aumenta con respuestas correctas y disminuye con errores.',
        gamification_step6: 'Para validar tus resultados y obtener puntos, debes completar cada celda de la tabla y luego hacer clic en "Validar Resultados".',
        
        // Advertencia sobre exportación
        export_warning: 'IMPORTANTE: El botón "Exportar Progreso" permanecerá deshabilitado hasta que completes todos los campos de la tabla. Solo podrás exportar tu progreso cuando hayas terminado completamente el ejercicio.',
        
        // Nuevas claves para la sección de progreso en instrucciones
        progress_title: 'Guardar y Cargar Progreso',
        progress_text: 'Puedes conservar tu progreso usando estas funciones:',
        progress_step1: 'La opción "Exportar Progreso" te permite descargar un archivo con tus puntos y logros actuales. Este botón solo se activará cuando el ejercicio esté completamente terminado.',
        progress_step2: 'Debes completar todos los valores de Q, W, ΔU, ΔH y ΔS para cada proceso del ciclo antes de poder exportar tu progreso.',
        progress_step3: 'Utiliza "Importar Progreso" para cargar un archivo de progreso guardado anteriormente.',
        progress_step4: 'Aunque tu progreso se guarda automáticamente en el navegador entre sesiones, se recomienda exportarlo regularmente para evitar pérdidas de datos.',
        
        // Nota sobre variables de estado
        state_variables_note: '<strong>Nota importante:</strong> En un ciclo termodinámico cerrado, el cambio total de las funciones de estado (energía interna ΔU, entalpía ΔH y entropía ΔS) siempre es cero, ya que el sistema regresa a su estado inicial. Para el total del ciclo, los valores correctos de estas variables siempre serán cero.',
        total_row_note: '<strong>Fila "Total del Ciclo":</strong> Esta fila muestra la suma de los valores introducidos en cada columna. Los campos se actualizan automáticamente a medida que introduces valores en la tabla.',
        
        // Nueva clave para el tooltip del botón exportar progreso
        export_progress_tooltip: 'Debes completar todos los campos de la tabla para poder exportar tu progreso',
    },
    
    // English
    en: {
        // General interface
        language: 'Language:',
        title: 'Thermodynamic Cycles Simulator',
        email: 'Email:',
        license: 'Apache 2.0 License',
        visit_counter: 'Visits:',
        correct_validations: 'Correct:',
        incorrect_validations: 'Incorrect:',
        cycles_completed: 'Cycles Completed:',
        
        // Process types
        adiabatic: 'Adiabatic',
        isochoric: 'Isochoric',
        isothermal: 'Isothermal',
        isobaric: 'Isobaric',
        linear: 'Linear P-V',
        
        // Cycles
        random_cycle: 'Random Cycle',
        carnot_cycle: 'Carnot Cycle',
        otto_cycle: 'Otto Cycle',
        diesel_cycle: 'Diesel Cycle',
        rankine_cycle: 'Rankine Cycle',
        brayton_cycle: 'Brayton Cycle',
        generate_cycle: 'Generate New Cycle',
        
        // Share exercise
        share_exercise: 'Share Exercise',
        confirm_replace_shared_cycle: 'You are viewing a shared exercise. Do you really want to generate a new cycle? The shared exercise data will be lost.',
        
        // Problem data
        problem_data: 'Problem Data',
        gas: 'Gas:',
        gas_type: 'Monatomic ideal gas (γ = 5/3)',
        r_constant: 'Constant R:',
        amount: 'Amount of substance:',
        processes: 'Processes:',
        point_data: 'Point Data:',
        
        // Calculation table
        thermo_variables: 'Thermodynamic Variables Calculation',
        validate: 'Validate Results',
        process: 'Process',
        heat: 'Q [J]',
        work: 'W [J]',
        internal_energy: 'ΔU [J]',
        enthalpy: 'ΔH [J]',
        entropy: 'ΔS [J/K]',
        
        // For other dynamically generated texts
        total_cycle: 'Total Cycle',
        correct: 'Correct',
        incorrect: 'Incorrect',
        point: 'Point',
        calculated_value: 'Automatically calculated value (sum of individual values)',
        
        // Axis labels
        volume_axis: 'Volume (L)',
        pressure_axis: 'Pressure (kPa)',
        
        // Messages
        generating_cycle: 'Generating thermodynamic cycle...',
        error_invalid_data: 'Error: Invalid cycle data',
        generate_to_see_data: 'Generate a cycle to see problem data.',
        gas_data_title: 'Gas Data',
        
        // Buttons
        share_exercise: 'Share Exercise',
        
        // Instructions
        instructions_title: 'Instructions',
        instructions_text: 'This application simulates different thermodynamic cycles and allows you to calculate the associated thermodynamic variables. To use it:',
        instructions_step1: 'Select a cycle type from the dropdown menu (Carnot, Otto, etc.).',
        instructions_step2: 'Click on "Generate New Cycle" to create a P-V diagram.',
        instructions_step3: 'Manually calculate the thermodynamic variables (Q, W, ΔU, etc.) for each process.',
        instructions_step4: 'Enter your results in the table and validate them with the "Validate Results" button.',
        instructions_step5: 'You can share the exercise with others using the "Share Exercise" button.',
        hide_instructions: 'Hide instructions',
        show_instructions: 'Show instructions',
        
        // Cycle Information
        show_cycles_info: 'Show thermodynamic cycles information',
        hide_cycles_info: 'Hide cycles information',
        
        // Carnot Cycle
        carnot_title: 'Carnot Cycle',
        carnot_description: 'The Carnot cycle is a reversible thermodynamic cycle consisting of two isothermal and two adiabatic processes. It is the most efficient theoretical cycle possible between two given temperatures.',
        carnot_processes: 'Processes:',
        carnot_process1: '1→2: Isothermal expansion (constant T)',
        carnot_process2: '2→3: Adiabatic expansion (no heat transfer)',
        carnot_process3: '3→4: Isothermal compression (constant T)',
        carnot_process4: '4→1: Adiabatic compression (no heat transfer)',
        carnot_efficiency: 'Efficiency:',
        carnot_efficiency_explanation: 'Where T₁ is the temperature of the hot source and T₂ is the temperature of the cold source.',
        
        // Otto Cycle
        otto_title: 'Otto Cycle',
        otto_description: 'The Otto cycle is the ideal cycle for spark-ignition internal combustion engines. It consists of adiabatic and isochoric processes.',
        otto_processes: 'Processes:',
        otto_process1: '1→2: Adiabatic compression',
        otto_process2: '2→3: Heat addition at constant volume (isochore)',
        otto_process3: '3→4: Adiabatic expansion (power)',
        otto_process4: '4→1: Heat rejection at constant volume (isochore)',
        otto_efficiency: 'Efficiency:',
        otto_efficiency_explanation: 'Where r is the compression ratio and γ is the adiabatic coefficient.',
        
        // Diesel Cycle
        diesel_title: 'Diesel Cycle',
        diesel_description: 'The Diesel cycle is the ideal cycle for compression-ignition internal combustion engines. It is characterized by heat addition at constant pressure.',
        diesel_processes: 'Processes:',
        diesel_process1: '1→2: Adiabatic compression',
        diesel_process2: '2→3: Heat addition at constant pressure (isobaric)',
        diesel_process3: '3→4: Adiabatic expansion (power)',
        diesel_process4: '4→1: Heat rejection at constant volume (isochore)',
        diesel_efficiency: 'Efficiency:',
        diesel_efficiency_explanation: 'Where r is the compression ratio, α is the cutoff ratio, and γ is the adiabatic coefficient.',
        
        // Rankine Cycle
        rankine_title: 'Rankine Cycle',
        rankine_description: 'The Rankine cycle is the ideal cycle for steam power plants. It converts heat into work using water as the working fluid.',
        rankine_processes: 'Processes:',
        rankine_process1: '1→2: Isentropic compression in the pump',
        rankine_process2: '2→3: Addition of calor a pression constante dans la chaudière',
        rankine_process3: '3→4: Expansion isentropique dans la turbine',
        rankine_process4: '4→1: Rejet de calor a pression constante dans le condenseur',
        rankine_efficiency: 'Efficiency:',
        rankine_efficiency_explanation: 'Where h is the specific enthalpy at different points in the cycle.',
        
        // Brayton Cycle
        brayton_title: 'Brayton Cycle',
        brayton_description: 'The Brayton cycle is the ideal cycle for gas turbines and jet engines. It consists of adiabatic and isobaric processes.',
        brayton_processes: 'Processes:',
        brayton_process1: '1→2: Adiabatic compression in the compressor',
        brayton_process2: '2→3: Heat addition at constant pressure in the combustion chamber',
        brayton_process3: '3→4: Adiabatic expansion in the turbine',
        brayton_process4: '4→1: Heat rejection at constant pressure',
        brayton_efficiency: 'Efficiency:',
        brayton_efficiency_explanation: 'Where r is the pressure ratio and γ is the adiabatic coefficient.',
        
        // Rankine efficiency subscripts
        net_work: 'net',
        heat_in: 'in',
        
        // Gamification
        total_points: 'Total Points: ',
        points: 'points',
        exercise_difficulty: 'Exercise difficulty:',
        export_progress: 'Export progress',
        import_progress: 'Import progress',
        correct_answer: 'Correct! +{points} points',
        incorrect_answer: 'Incorrect. -10 points',
        difficulty_level: 'Level {level}',
        
        // New keys for gamification section in instructions
        gamification_title: 'Points System',
        gamification_text: 'This application includes a point system that helps you measure your progress:',
        gamification_step1: 'Each time you correctly validate a value, you will earn points based on the cycle difficulty.',
        gamification_step2: 'Incorrect answers will result in a loss of points.',
        gamification_step3: 'It is possible to accumulate negative points.',
        gamification_step4: 'The cycle difficulty is shown with stars (from 1 to 5 ★).',
        gamification_step5: 'The energy bar increases with correct answers and decreases with errors.',
        gamification_step6: 'To validate your results and earn points, you must complete each cell in the table and then click on "Validate Results".',
        
        // Export warning
        export_warning: 'IMPORTANT: The "Export Progress" button will remain disabled until you complete all fields in the table. You will only be able to export your progress when you have fully completed the exercise.',
        
        // New keys for progress section in instructions
        progress_title: 'Save and Load Progress',
        progress_text: 'You can preserve your progress using these functions:',
        progress_step1: 'The "Export Progress" option allows you to download a file with your current points and achievements. This button will only be enabled when the exercise is fully completed.',
        progress_step2: 'You must complete all Q, W, ΔU, ΔH and ΔS values for each process in the cycle before you can export your progress.',
        progress_step3: 'Use "Import Progress" to load a previously saved progress file.',
        progress_step4: 'Although your progress is automatically saved in the browser between sessions, it is recommended to export it regularly to avoid data loss.',
        
        // State variables note
        state_variables_note: '<strong>Important note:</strong> In a closed thermodynamic cycle, the total change in state functions (internal energy ΔU, enthalpy ΔH, and entropy ΔS) is always zero, as the system returns to its initial state. For the cycle total, the correct values for these variables always will be zero.',
        total_row_note: '<strong>"Total Cycle" row:</strong> This row shows the sum of the values entered in each column. The fields update automatically as you enter values in the table.',
        
        // New key for export progress button tooltip
        export_progress_tooltip: 'You must complete all fields in the table to export your progress',
    },
    
    // Galego
    gl: {
        // Interface geral
        language: 'Idioma:',
        title: 'Simulador de Ciclos Termodinámicos',
        email: 'Correo:',
        license: 'Licenza Apache 2.0',
        visit_counter: 'Visitas:',
        
        // Tipos de procesos
        adiabatic: 'Adiabático',
        isochoric: 'Isocórico',
        isothermal: 'Isotérmico',
        isobaric: 'Isobárico',
        linear: 'Lineal P-V',
        
        // Ciclos
        random_cycle: 'Ciclo Aleatorio',
        carnot_cycle: 'Ciclo de Carnot',
        otto_cycle: 'Ciclo de Otto',
        diesel_cycle: 'Ciclo Diesel',
        rankine_cycle: 'Ciclo Rankine',
        brayton_cycle: 'Ciclo Brayton',
        generate_cycle: 'Xerar Novo Ciclo',
        
        // Compartir exercicio
        share_exercise: 'Compartir Exercicio',
        confirm_replace_shared_cycle: 'Estás a ver un exercicio compartido. Realmente queres xerar un novo ciclo? Perderanse os datos do exercicio compartido.',
        
        // Datos do problema
        problem_data: 'Datos do problema',
        gas: 'Gas:',
        gas_type: 'Gas ideal monoatómico (γ = 5/3)',
        r_constant: 'Constante R:',
        amount: 'Cantidade de substancia:',
        processes: 'Procesos:',
        point_data: 'Datos dos puntos:',
        
        // Táboa de cálculos
        thermo_variables: 'Cálculo de variables termodinámicas',
        validate: 'Validar Resultados',
        process: 'Proceso',
        heat: 'Q [J]',
        work: 'W [J]',
        internal_energy: 'ΔU [J]',
        enthalpy: 'ΔH [J]',
        entropy: 'ΔS [J/K]',
        
        // Para outros textos xerados dinamicamente
        total_cycle: 'Total do Ciclo',
        correct: 'Correcto',
        incorrect: 'Incorrecto',
        point: 'Punto',
        calculated_value: 'Valor calculado automaticamente (suma dos valores individuais)',
        
        // Etiquetas dos eixos
        volume_axis: 'Volume (L)',
        pressure_axis: 'Presión (kPa)',
        
        // Mensaxes
        generating_cycle: 'Xerando ciclo termodinámico...',
        error_invalid_data: 'Erro: Datos de ciclo inválidos',
        generate_to_see_data: 'Xera un ciclo para ver os datos do problema.',
        gas_data_title: 'Datos do Gas',
        
        // Botóns
        share_exercise: 'Compartir Exercicio',
        
        // Instrucións
        instructions_title: 'Instrucións',
        instructions_text: 'Esta aplicación simula diferentes ciclos termodinámicos e permíteche calcular as variables termodinámicas asociadas. Para usala:',
        instructions_step1: 'Selecciona un tipo de ciclo do menú despregable (Carnot, Otto, etc.).',
        instructions_step2: 'Fai clic en "Xerar Novo Ciclo" para crear un diagrama P-V.',
        instructions_step3: 'Calcula manualmente as variables termodinámicas (Q, W, ΔU, etc.) para cada proceso.',
        instructions_step4: 'Introduce os teus resultados na táboa e valídaos co botón "Validar Resultados".',
        instructions_step5: 'Podes compartir o exercicio con outros mediante o botón "Compartir Exercicio".',
        hide_instructions: 'Ocultar instrucións',
        show_instructions: 'Mostrar instrucións',
        
        // Información de ciclos
        show_cycles_info: 'Amosar información sobre ciclos termodinámicos',
        hide_cycles_info: 'Ocultar información sobre ciclos',
        
        // Ciclo de Carnot
        carnot_title: 'Ciclo de Carnot',
        carnot_description: 'O ciclo de Carnot é un ciclo termodinámico reversible que consiste en dous procesos isotérmicos e dous adiabáticos. É o ciclo teórico máis eficiente posible entre dúas temperaturas dadas.',
        carnot_processes: 'Procesos:',
        carnot_process1: '1→2: Expansión isotérmica (T constante)',
        carnot_process2: '2→3: Expansión adiabática (sen transferencia de calor)',
        carnot_process3: '3→4: Compresión isotérmica (T constante)',
        carnot_process4: '4→1: Compresión adiabática (sen transferencia de calor)',
        carnot_efficiency: 'Eficiencia:',
        carnot_efficiency_explanation: 'Onde T₁ é a temperatura da fonte quente e T₂ é a temperatura da fonte fria.',
        
        // Ciclo de Otto
        otto_title: 'Ciclo de Otto',
        otto_description: 'O ciclo de Otto é o ciclo ideal para motores de combustión interna de acendido por chispa. Consta de procesos adiabáticos e isocóricos.',
        otto_processes: 'Procesos:',
        otto_process1: '1→2: Compresión adiabática',
        otto_process2: '2→3: Adición de calor a volume constante (isocórico)',
        otto_process3: '3→4: Expansión adiabática (potencia)',
        otto_process4: '4→1: Rexeitamento de calor a volume constante (isocórico)',
        otto_efficiency: 'Eficiencia:',
        otto_efficiency_explanation: 'Onde r é a relación de compresión e γ é o coeficiente adiabático.',
        
        // Ciclo Diesel
        diesel_title: 'Ciclo Diesel',
        diesel_description: 'O ciclo Diesel é o ciclo ideal para motores de combustión interna de acendido por compresión. Caracterízase pola adición de calor a presión constante.',
        diesel_processes: 'Procesos:',
        diesel_process1: '1→2: Compresión adiabática',
        diesel_process2: '2→3: Adición de calor a presión constante (isobárico)',
        diesel_process3: '3→4: Expansión adiabática (potencia)',
        diesel_process4: '4→1: Rexeitamento de calor a volume constante (isocórico)',
        diesel_efficiency: 'Eficiencia:',
        diesel_efficiency_explanation: 'Onde r é a relación de compresión, α é a relación de corte e γ é o coeficiente adiabático.',
        
        // Ciclo Rankine
        rankine_title: 'Ciclo Rankine',
        rankine_description: 'O ciclo Rankine é o ciclo ideal para as centrais térmicas de vapor. Converte calor en traballo mediante o uso de auga como fluído de traballo.',
        rankine_processes: 'Procesos:',
        rankine_process1: '1→2: Compresión isentrópica na bomba',
        rankine_process2: '2→3: Adición de calor a presión constante na caldeira',
        rankine_process3: '3→4: Expansión isentrópica na turbina',
        rankine_process4: '4→1: Rexeitamento de calor a presión constante no condensador',
        rankine_efficiency: 'Eficiencia:',
        rankine_efficiency_explanation: 'Onde h é a entalpía específica nos diferentes puntos do ciclo.',
        
        // Ciclo Brayton
        brayton_title: 'Ciclo Brayton',
        brayton_description: 'O ciclo Brayton é o ciclo ideal para as turbinas de gas e motores a reacción. Consta de procesos adiabáticos e isobáricos.',
        brayton_processes: 'Procesos:',
        brayton_process1: '1→2: Compresión adiabática no compresor',
        brayton_process2: '2→3: Adición de calor a presión constante na cámara de combustión',
        brayton_process3: '3→4: Expansión adiabática na turbina',
        brayton_process4: '4→1: Rexeitamento de calor a presión constante',
        brayton_efficiency: 'Eficiencia:',
        brayton_efficiency_explanation: 'Onde r é a relación de presións e γ é o coeficiente adiabático.',
        
        // Rankine efficiency subscripts
        net_work: 'neto',
        heat_in: 'entrada',
        
        // Gamificación
        total_points: 'Puntos totais: ',
        points: 'puntos',
        exercise_difficulty: 'Dificultade do exercicio:',
        export_progress: 'Exportar progreso',
        import_progress: 'Importar progreso',
        correct_answer: 'Correcto! +{points} puntos',
        incorrect_answer: 'Incorrecto. -10 puntos',
        difficulty_level: 'Nivel {level}',
        
        // Sección de gamificación nas instrucións
        gamification_title: 'Sistema de Puntos',
        gamification_text: 'Esta aplicación inclúe un sistema de puntos que che axuda a medir o teu progreso:',
        gamification_step1: 'Cada vez que valides correctamente un valor, gañarás puntos segundo a dificultade do ciclo.',
        gamification_step2: 'As respostas incorrectas resultarán nunha perda de puntos.',
        gamification_step3: 'É posible acumular puntos negativos.',
        gamification_step4: 'A dificultade do ciclo móstrase con estrelas (de 1 a 5 ★).',
        gamification_step5: 'A barra de enerxía aumenta con respostas correctas e diminúe con erros.',
        gamification_step6: 'Para validar os teus resultados e obter puntos, debes completar cada cela da táboa e logo facer clic en "Validar Resultados".',
        
        // Advertencia sobre exportación
        export_warning: 'IMPORTANTE: O botón "Exportar Progreso" permanecerá desactivado ata que completes todos os campos da táboa. Só poderás exportar o teu progreso cando rematases completamente o exercicio.',
        
        // Sección de progreso nas instrucións
        progress_title: 'Gardar e Cargar Progreso',
        progress_text: 'Podes conservar o teu progreso usando estas funcións:',
        progress_step1: 'A opción "Exportar Progreso" permíteche descargar un arquivo cos teus puntos e logros actuais. Este botón só estará activo cando o exercicio estea completamente rematado.',
        progress_step2: 'Debes completar todos os valores de Q, W, ΔU, ΔH e ΔS para cada proceso do ciclo antes de poder exportar o teu progreso.',
        progress_step3: 'Utiliza "Importar Progreso" para cargar un arquivo de progreso gardado anteriormente.',
        progress_step4: 'Aínda que o teu progreso se garda automaticamente no navegador entre sesións, recoméndase exportalo regularmente para evitar perdas de datos.',
        
        // Nota sobre variables de estado
        state_variables_note: '<strong>Nota importante:</strong> Nun ciclo termodinámico pechado, o cambio total das funcións de estado (enerxía interna ΔU, entalpía ΔH e entropía ΔS) sempre é cero, xa que o sistema volta ao seu estado inicial. Para o total do ciclo, os valores correctos destas variables sempre serán cero.',
        total_row_note: '<strong>Fila "Total do Ciclo":</strong> Esta fila mostra a suma dos valores introducidos en cada columna. Os campos actualízanse automaticamente a medida que introduces valores na táboa.',
        
        // Nova clave para o tooltip do botón exportar progreso
        export_progress_tooltip: 'Debes completar todos os campos da táboa para poder exportar o teu progreso',
    },
    
    // Français
    fr: {
        // Interface générale
        language: 'Langue:',
        title: 'Simulateur de Cycles Thermodynamiques',
        email: 'Courriel:',
        license: 'Licence Apache 2.0',
        visit_counter: 'Visites:',
        
        // Types de processus
        adiabatic: 'Adiabatique',
        isochoric: 'Isochore',
        isothermal: 'Isotherme',
        isobaric: 'Isobare',
        linear: 'Linéaire P-V',
        
        // Cycles
        random_cycle: 'Cycle Aléatoire',
        carnot_cycle: 'Cycle de Carnot',
        otto_cycle: 'Cycle d\'Otto',
        diesel_cycle: 'Cycle Diesel',
        rankine_cycle: 'Cycle de Rankine',
        brayton_cycle: 'Cycle de Brayton',
        generate_cycle: 'Générer Nouveau Cycle',
        
        // Données du problème
        problem_data: 'Données du problème',
        gas: 'Gaz:',
        gas_type: 'Gaz parfait monoatomique (γ = 5/3)',
        r_constant: 'Constante R:',
        amount: 'Quantité de substance:',
        processes: 'Processus:',
        point_data: 'Données des points:',
        
        // Table de calcul
        thermo_variables: 'Calcul des variables thermodynamiques',
        validate: 'Valider les résultats',
        process: 'Processus',
        heat: 'Q [J]',
        work: 'W [J]',
        internal_energy: 'ΔU [J]',
        enthalpy: 'ΔH [J]',
        entropy: 'ΔS [J/K]',
        
        // Pour autres textes générés dynamiquement
        total_cycle: 'Total du Cycle',
        correct: 'Correct',
        incorrect: 'Incorrect',
        point: 'Point',
        calculated_value: 'Valeur calculée automatiquement (somme des valeurs individuelles)',
        
        // Étiquettes des axes
        volume_axis: 'Volume (L)',
        pressure_axis: 'Pression (kPa)',
        
        // Messages
        generating_cycle: 'Génération du cycle thermodynamique...',
        error_invalid_data: 'Erreur: Données de cycle invalides',
        generate_to_see_data: 'Générez un cycle pour voir les données du problème.',
        gas_data_title: 'Données du Gaz',
        
        // Boutons
        share_exercise: 'Partager l\'Exercice',
        confirm_replace_shared_cycle: 'Vous consultez un exercice partagé. Voulez-vous vraiment générer un nouveau cycle? Les données de l\'exercice partagé seront perdues.',
        
        // Instructions
        instructions_title: 'Instructions',
        instructions_text: 'Cette application simule différents cycles thermodynamiques et vous permet de calculer les variables thermodynamiques associées. Pour l\'utiliser:',
        instructions_step1: 'Sélectionnez un type de cycle dans le menu déroulant (Carnot, Otto, etc.).',
        instructions_step2: 'Cliquez sur "Générer Nouveau Cycle" pour créer un diagramme P-V.',
        instructions_step3: 'Calculez manuellement les variables thermodynamiques (Q, W, ΔU, etc.) pour chaque processus.',
        instructions_step4: 'Entrez vos résultats dans le tableau et validez-les avec le bouton "Valider les résultats".',
        instructions_step5: 'Vous pouvez partager l\'exercice avec d\'autres personnes à l\'aide du bouton "Partager l\'Exercice".',
        hide_instructions: 'Masquer les instructions',
        show_instructions: 'Afficher les instructions',
        
        // Information sur les cycles
        show_cycles_info: 'Afficher les informations sur les cycles thermodynamiques',
        hide_cycles_info: 'Masquer les informations sur les cycles',
        
        // Cycle de Carnot
        carnot_title: 'Cycle de Carnot',
        carnot_description: 'Le cycle de Carnot est un cycle thermodynamique réversible qui consiste en deux processus isothermes et deux adiabatiques. C\'est le cycle théorique le plus efficace possible entre deux températures données.',
        carnot_processes: 'Processus:',
        carnot_process1: '1→2: Expansion isotherme (T constante)',
        carnot_process2: '2→3: Expansion adiabatique (sans transfert de chaleur)',
        carnot_process3: '3→4: Compression isotherme (T constante)',
        carnot_process4: '4→1: Compression adiabatique (sans transfert de chaleur)',
        carnot_efficiency: 'Rendement:',
        carnot_efficiency_explanation: 'Où T₁ est la température de la source chaude et T₂ est la température de la source froide.',
        
        // Cycle d'Otto
        otto_title: 'Cycle d\'Otto',
        otto_description: 'Le cycle d\'Otto est le cycle idéal pour les moteurs à combustion interne à allumage commandé. Il se compose de processus adiabatiques et isochores.',
        otto_processes: 'Processus:',
        otto_process1: '1→2: Compression adiabatique',
        otto_process2: '2→3: Addition de chaleur à volume constant (isochore)',
        otto_process3: '3→4: Expansion adiabatique (puissance)',
        otto_process4: '4→1: Rejet de chaleur à volume constant (isochore)',
        otto_efficiency: 'Rendement:',
        otto_efficiency_explanation: 'Où r est le taux de compression et γ est le coefficient adiabatique.',
        
        // Cycle Diesel
        diesel_title: 'Cycle Diesel',
        diesel_description: 'Le cycle Diesel est le cycle idéal pour les moteurs à combustion interne à allumage par compression. Il est caractérisé par l\'ajout de chaleur à pression constante.',
        diesel_processes: 'Processus:',
        diesel_process1: '1→2: Compression adiabatique',
        diesel_process2: '2→3: Addition de chaleur a pression constante (isobare)',
        diesel_process3: '3→4: Expansion adiabatique (puissance)',
        diesel_process4: '4→1: Rejet de chaleur a volume constant (isochore)',
        diesel_efficiency: 'Rendement:',
        diesel_efficiency_explanation: 'Où r est le taux de compression, α est le taux de coupure et γ est le coefficient adiabatique.',
        
        // Cycle de Rankine
        rankine_title: 'Cycle de Rankine',
        rankine_description: 'Le cycle de Rankine est le cycle idéal pour les centrales thermiques à vapeur. Il convertit la chaleur en travail en utilisant l\'eau comme fluide de travail.',
        rankine_processes: 'Processus:',
        rankine_process1: '1→2: Compression isentropique dans la pompe',
        rankine_process2: '2→3: Addition of calor a pression constante dans la chaudière',
        rankine_process3: '3→4: Expansion isentropique dans la turbine',
        rankine_process4: '4→1: Rejet de calor a pression constante dans le condenseur',
        rankine_efficiency: 'Rendement:',
        rankine_efficiency_explanation: 'Où h est l\'enthalpie spécifique aux différents points du cycle.',
        
        // Cycle de Brayton
        brayton_title: 'Cycle de Brayton',
        brayton_description: 'Le cycle de Brayton est le cycle idéal pour les turbines à gaz et les moteurs à réaction. Il se compose de processus adiabatiques et isobares.',
        brayton_processes: 'Processus:',
        brayton_process1: '1→2: Compression adiabatique dans le compresseur',
        brayton_process2: '2→3: Addition de chaleur à pression constante dans la chambre de combustion',
        brayton_process3: '3→4: Expansion adiabatique dans la turbine',
        brayton_process4: '4→1: Rejet de chaleur à pression constante',
        brayton_efficiency: 'Rendement:',
        brayton_efficiency_explanation: 'Où r est le rapport de pression et γ est le coefficient adiabatique.',
        
        // Rankine efficiency subscripts
        net_work: 'net',
        heat_in: 'entrée',
        
        // Gamification
        total_points: 'Points totaux: ',
        points: 'points',
        exercise_difficulty: 'Difficulté de l\'exercice:',
        export_progress: 'Exporter les progrès',
        import_progress: 'Importer les progrès',
        correct_answer: 'Correct! +{points} points',
        incorrect_answer: 'Incorrect. -10 points',
        difficulty_level: 'Niveau {level}',
        
        // Nouvelles clés pour la section de gamification dans les instructions
        gamification_title: 'Système de Points',
        gamification_text: 'Cette application comprend un système de points qui vous aide à mesurer vos progrès:',
        gamification_step1: 'Chaque fois que vous validez correctement une valeur, vous gagnez des points en fonction de la difficulté du cycle.',
        gamification_step2: 'Les réponses incorrectes entraînent une perte de points.',
        gamification_step3: 'Il est possible d\'accumuler des points négatifs.',
        gamification_step4: 'La difficulté du cycle est indiquée par des étoiles (de 1 à 5 ★).',
        gamification_step5: 'La barre d\'énergie augmente avec les bonnes réponses et diminue avec les erreurs.',
        gamification_step6: 'Pour valider vos résultats et gagner des points, vous devez compléter chaque cellule du tableau puis cliquer sur "Valider les résultats".',
        
        // Avertissement d'exportation
        export_warning: 'IMPORTANT: Le bouton "Exporter les progrès" restera désactivé jusqu\'à ce que vous ayez rempli tous les champs du tableau. Vous ne pourrez exporter vos progrès que lorsque vous aurez entièrement terminé l\'exercice.',
        
        // Nouvelles clés pour la section de progrès dans les instructions
        progress_title: 'Sauvegarder et Charger la Progression',
        progress_text: 'Vous pouvez conserver votre progression en utilisant ces fonctions:',
        progress_step1: 'Cliquez sur "Exporter les progrès" pour télécharger un fichier avec vos points et réalisations actuels.',
        progress_step2: 'Utilisez "Importer les progrès" pour charger un fichier de progression précédemment sauvegardé.',
        progress_step3: 'Votre progression est automatiquement sauvegardée dans le navigateur entre les sessions.',
        
        // Note sur les variables d'état
        state_variables_note: '<strong>Note importante:</strong> Dans un cycle thermodynamique fermé, le changement total des fonctions d\'état (énergie interne ΔU, enthalpie ΔH et entropie ΔS) est toujours zéro, puisque le système revient à son état initial. Pour le total du cycle, les valeurs correctes de ces variables seront toujours zéro.',
        total_row_note: '<strong>Ligne "Total du Cycle":</strong> Cette ligne affiche la somme des valeurs saisies dans chaque colonne. Les champs se mettent à jour automatiquement au fur et à mesure que vous entrez des valeurs dans le tableau.',
        
        // Nouvelle clé pour l'infobulle du bouton d'exportation de progression
        export_progress_tooltip: 'Vous devez compléter tous les champs du tableau pour exporter votre progression',
    },
    
    // Português
    pt: {
        // Interface geral
        language: 'Idioma:',
        title: 'Simulador de Ciclos Termodinâmicos',
        email: 'E-mail:',
        license: 'Licença Apache 2.0',
        visit_counter: 'Visitas:',
        correct_validations: 'Correctas:',
        incorrect_validations: 'Incorrectas:',
        cycles_completed: 'Ciclos completados:',
        
        // Tipos de processos
        adiabatic: 'Adiabático',
        isochoric: 'Isocórico',
        isothermal: 'Isotérmico',
        isobaric: 'Isobárico',
        linear: 'Linear P-V',
        
        // Ciclos
        random_cycle: 'Ciclo Aleatório',
        carnot_cycle: 'Ciclo de Carnot',
        otto_cycle: 'Ciclo de Otto',
        diesel_cycle: 'Ciclo Diesel',
        rankine_cycle: 'Ciclo Rankine',
        brayton_cycle: 'Ciclo Brayton',
        generate_cycle: 'Gerar Novo Ciclo',
        
        // Compartilhar exercício
        share_exercise: 'Compartilhar Exercício',
        confirm_replace_shared_cycle: 'Você está visualizando um exercício compartilhado. Deseja realmente gerar um novo ciclo? Os dados do exercício compartilhado serão perdidos.',
        
        // Dados do problema
        problem_data: 'Dados do problema',
        gas: 'Gás:',
        gas_type: 'Gás ideal monoatômico (γ = 5/3)',
        r_constant: 'Constante R:',
        amount: 'Quantidade de substância:',
        processes: 'Processos:',
        point_data: 'Dados dos pontos:',
        
        // Tabela de cálculos
        thermo_variables: 'Cálculo de variáveis termodinâmicas',
        validate: 'Validar Resultados',
        process: 'Processo',
        heat: 'Q [J]',
        work: 'W [J]',
        internal_energy: 'ΔU [J]',
        enthalpy: 'ΔH [J]',
        entropy: 'ΔS [J/K]',
        
        // Para outros textos gerados dinamicamente
        total_cycle: 'Total do Ciclo',
        correct: 'Correto',
        incorrect: 'Incorreto',
        point: 'Ponto',
        calculated_value: 'Valor calculado automaticamente (soma dos valores individuais)',
        
        // Etiquetas dos eixos
        volume_axis: 'Volume (L)',
        pressure_axis: 'Pressão (kPa)',
        
        // Mensagens
        generating_cycle: 'Gerando ciclo termodinâmico...',
        error_invalid_data: 'Erro: Dados de ciclo inválidos',
        generate_to_see_data: 'Gere um ciclo para ver os dados do problema.',
        gas_data_title: 'Dados do Gás',
        
        // Botões
        share_exercise: 'Compartilhar Exercício',
        
        // Instruções
        instructions_title: 'Instruções',
        instructions_text: 'Esta aplicação simula diferentes ciclos termodinâmicos e permite calcular as variáveis termodinâmicas associadas. Para utilizá-la:',
        instructions_step1: 'Selecione um tipo de ciclo no menu suspenso (Carnot, Otto, etc.).',
        instructions_step2: 'Clique em "Gerar Novo Ciclo" para criar um diagrama P-V.',
        instructions_step3: 'Calcule manualmente as variáveis termodinâmicas (Q, W, ΔU, etc.) para cada processo.',
        instructions_step4: 'Insira seus resultados na tabela e valide-os com o botão "Validar Resultados".',
        instructions_step5: 'Você pode compartilhar o exercício com outros usando o botão "Compartilhar Exercício".',
        hide_instructions: 'Ocultar instruções',
        show_instructions: 'Mostrar instruções',
        
        // Informação dos ciclos
        show_cycles_info: 'Mostrar informações sobre ciclos termodinâmicos',
        hide_cycles_info: 'Ocultar informações sobre ciclos',
        
        // Ciclo de Carnot
        carnot_title: 'Ciclo de Carnot',
        carnot_description: 'O ciclo de Carnot é um ciclo termodinámico reversível que consiste em dois processos isotérmicos e dois adiabáticos. É o ciclo teórico mais eficiente possível entre dúas temperaturas dadas.',
        carnot_processes: 'Procesos:',
        carnot_process1: '1→2: Expansão isotérmica (T constante)',
        carnot_process2: '2→3: Expansão adiabática (sem transferência de calor)',
        carnot_process3: '3→4: Compressão isotérmica (T constante)',
        carnot_process4: '4→1: Compressão adiabática (sem transferência de calor)',
        carnot_efficiency: 'Eficiência:',
        carnot_efficiency_explanation: 'Onde T₁ é a temperatura da fonte quente e T₂ é a temperatura da fonte fria.',
        
        // Ciclo de Otto
        otto_title: 'Ciclo de Otto',
        otto_description: 'O ciclo de Otto é o ciclo ideal para motores de combustão interna de ignição por centelha. Consiste em processos adiabáticos e isocóricos.',
        otto_processes: 'Processos:',
        otto_process1: '1→2: Compressão adiabática',
        otto_process2: '2→3: Adição de calor a volume constante (isocórico)',
        otto_process3: '3→4: Expansão adiabática (potência)',
        otto_process4: '4→1: Rejeição de calor a volume constante (isocórico)',
        otto_efficiency: 'Eficiência:',
        otto_efficiency_explanation: 'Onde r é a razão de compressão e γ é o coeficiente adiabático.',
        
        // Ciclo Diesel
        diesel_title: 'Ciclo Diesel',
        diesel_description: 'O ciclo Diesel é o ciclo ideal para motores de combustão interna de ignição por compresão. É caracterizado pela adição de calor a pressão constante.',
        diesel_processes: 'Processos:',
        diesel_process1: '1→2: Compressão adiabática',
        diesel_process2: '2→3: Adição de calor a presão constante (isobárico)',
        diesel_process3: '3→4: Expansão adiabática (potência)',
        diesel_process4: '4→1: Rejeição de calor a volume constante (isocórico)',
        diesel_efficiency: 'Eficiência:',
        diesel_efficiency_explanation: 'Onde r é a razão de compressão, α é a razão de corte e γ é o coeficiente adiabático.',
        
        // Ciclo Rankine
        rankine_title: 'Ciclo Rankine',
        rankine_description: 'O ciclo Rankine é o ciclo ideal para usinas térmicas a vapor. Converte calor em trabalho usando água como fluído de traballo.',
        rankine_processes: 'Processos:',
        rankine_process1: '1→2: Compressão isentrópica na bomba',
        rankine_process2: '2→3: Adição de calor a presão constante na caldeira',
        rankine_process3: '3→4: Expansión isentrópica na turbina',
        rankine_process4: '4→1: Rejeição de calor a presão constante no condensador',
        rankine_efficiency: 'Eficiência:',
        rankine_efficiency_explanation: 'Onde h é a entalpia específica nos diferentes pontos do ciclo.',
        
        // Ciclo Brayton
        brayton_title: 'Ciclo Brayton',
        brayton_description: 'O ciclo Brayton é o ciclo ideal para turbinas a gás e motores a jato. Consiste em processos adiabáticos e isobáricos.',
        brayton_processes: 'Processos:',
        brayton_process1: '1→2: Compressão adiabática no compresor',
        brayton_process2: '2→3: Adição de calor a presão constante na câmara de combustão',
        brayton_process3: '3→4: Expansão adiabática na turbina',
        brayton_process4: '4→1: Rejeição de calor a presão constante',
        brayton_efficiency: 'Eficiência:',
        brayton_efficiency_explanation: 'Onde r é a razão de pressão e γ é o coeficiente adiabático.',
        
        // Rankine efficiency subscripts
        net_work: 'líquido',
        heat_in: 'entrada',
        
        // Gamificación
        total_points: 'Pontos totais: ',
        points: 'pontos',
        exercise_difficulty: 'Dificuldade do exercício:',
        export_progress: 'Exportar progresso',
        import_progress: 'Importar progresso',
        correct_answer: 'Correto! +{points} pontos',
        incorrect_answer: 'Incorreto. -10 pontos',
        difficulty_level: 'Nível {level}',
        
        // Novas chaves para a seção de gamificação nas instruções
        gamification_title: 'Sistema de Pontos',
        gamification_text: 'Esta aplicação inclui um sistema de pontos que ajuda a medir seu progresso:',
        gamification_step1: 'Cada vez que você valida corretamente um valor, ganhará pontos de acordo com a dificuldade do ciclo.',
        gamification_step2: 'Respostas incorretas resultarão em perda de pontos.',
        gamification_step3: 'É possível acumular pontos negativos.',
        gamification_step4: 'A dificuldade do ciclo é mostrada com estrelas (de 1 a 5 ★).',
        gamification_step5: 'A barra de energia aumenta com respostas corretas e diminui com erros.',
        gamification_step6: 'Para validar seus resultados e ganhar pontos, você deve preencher cada célula da tabela e clicar em "Validar Resultados".',
        
        // Aviso de exportação
        export_warning: 'IMPORTANTE: O botão "Exportar Progresso" permanecerá desativado até que você preencha todos os campos da tabela. Você só poderá exportar seu progresso quando tiver concluído completamente o exercício.',
        
        // Seção de progresso nas instruções
        progress_title: 'Salvar e Carregar Progresso',
        progress_text: 'Você pode preservar seu progresso usando estas funções:',
        progress_step1: 'A opção "Exportar Progresso" permite baixar um arquivo com seus pontos e conquistas atuais. Este botão só estará disponível quando o exercício estiver completamente concluído.',
        progress_step2: 'Você deve completar todos os valores de Q, W, ΔU, ΔH e ΔS para cada processo do ciclo antes de poder exportar seu progresso.',
        progress_step3: 'Utilize "Importar Progresso" para carregar um arquivo de progresso salvo anteriormente.',
        progress_step4: 'Embora seu progresso seja automaticamente salvo no navegador entre sessões, recomenda-se exportá-lo regularmente para evitar perda de dados.',
        
        // Nota sobre variáveis de estado
        state_variables_note: '<strong>Nota importante:</strong> Em um ciclo termodinâmico fechado, a mudança total das funções de estado (energia interna ΔU, entalpia ΔH e entropia ΔS) é sempre zero, já que o sistema retorna ao seu estado inicial. Para o total do ciclo, os valores corretos dessas variáveis serão sempre zero.',
        total_row_note: '<strong>Linha "Total do Ciclo":</strong> Esta linha mostra a soma dos valores inseridos em cada coluna. Os campos são atualizados automaticamente conforme você insere valores na tabela.',
        
        // Nova chave para a dica do botão de exportar progresso
        export_progress_tooltip: 'Você deve preencher todos os campos da tabela para exportar seu progresso',
    },
    
    // 中文 (Chino)
    zh: {
        // 通用界面
        language: '语言:',
        title: '热力学循环模拟器',
        email: '电子邮件:',
        license: 'Apache 2.0 许可证',
        visit_counter: '访问量:',
        correct_validations: '正确:',
        incorrect_validations: '错误:',
        cycles_completed: '循环完成:',
        
        // Tipos de procesos
        adiabatic: '绝热的',
        isochoric: '等容的',
        isothermal: '等温的',
        isobaric: '等压的',
        linear: '线性 P-V',
        
        // Ciclos
        random_cycle: '随机循环',
        carnot_cycle: '卡诺循环',
        otto_cycle: '奥托循环',
        diesel_cycle: '柴油循环',
        rankine_cycle: '朗肯循环',
        brayton_cycle: '布雷顿循环',
        generate_cycle: '生成新循环',
        
        // 分享练习
        share_exercise: '分享练习',
        confirm_replace_shared_cycle: '您正在查看共享练习。您确定要生成新的循环吗？共享练习数据将丢失。',
        
        // Datos del problema
        problem_data: '问题数据',
        gas: '气体:',
        gas_type: '单原子理想气体 (γ = 5/3)',
        r_constant: '常数 R:',
        amount: '物质量:',
        processes: '过程:',
        point_data: '点数据:',
        
        // Tabla de cálculos
        thermo_variables: '热力学变量计算',
        validate: '验证结果',
        process: '过程',
        heat: 'Q [J]',
        work: 'W [J]',
        internal_energy: 'ΔU [J]',
        enthalpy: 'ΔH [J]',
        entropy: 'ΔS [J/K]',
        
        // Para otros textos generados dinámicamente
        total_cycle: '循环总计',
        correct: '正确',
        incorrect: '错误',
        point: '点',
        process: '过程',
        heat: 'Q [J]',
        work: 'W [J]',
        internal_energy: 'ΔU [J]',
        enthalpy: 'ΔH [J]',
        entropy: 'ΔS [J/K]',
        
        // Notification messages
        correct_answer: '正确！+{points} 分',
        incorrect_answer: '错误。-10 分',
        difficulty_level: '级别 {level}',
        
        // Estado de variables
        state_variables_note: '<strong>重要提示：</strong>在封闭的热力学循环中，状态函数的总变化（内能ΔU、焓ΔH和熵ΔS）始终为零，因为系统返回其初始状态。对于循环总计，这些变量的正确值始终为零。',
        total_row_note: '<strong>"循环总计"行：</strong>此行显示每列中输入的值的总和。当您在表格中输入值时，字段会自动更新。',
        
        // Botones e instrucciones
        show_instructions: '显示说明',
        hide_instructions: '隐藏说明',
        show_cycles_info: '显示热力学循环信息',
        hide_cycles_info: '隐藏循环信息',
        instructions_title: '使用说明',
        instructions_text: '这个应用程序模拟不同的热力学循环，并允许您计算相关的热力学变量。使用方法：',
        instructions_step1: '从下拉菜单中选择循环类型（卡诺、奥托等）。',
        instructions_step2: '点击"生成新循环"创建P-V图。',
        instructions_step3: '手动计算每个过程的热力学变量（Q、W、ΔU等）。',
        instructions_step4: '在表格中输入您的结果，并使用"验证结果"按钮验证。',
        instructions_step5: '您可以使用"分享练习"按钮与他人分享练习。',
        
        // Gamificación
        total_points: '总分: ',
        points: '分',
        exercise_difficulty: '练习难度:',
        export_progress: '导出进度',
        import_progress: '导入进度',
        
        // Sistema de puntos en las instrucciones
        gamification_title: '积分系统',
        gamification_text: '本应用包含积分系统，帮助您衡量进度：',
        gamification_step1: '每次正确验证一个值，您将根据循环难度获得积分。',
        gamification_step2: '错误答案将导致积分损失。',
        gamification_step3: '可能会积累负分。',
        gamification_step4: '循环难度用星星显示（1到5★）。',
        gamification_step5: '能量条随正确答案增加，随错误减少。',
        gamification_step6: '要验证结果并获得积分，您必须填写表格中的每个单元格，然后点击"验证结果"。',
        
        // Advertencia de exportación
        export_warning: '重要提示：在完成表格中的所有字段之前，"导出进度"按钮将保持禁用状态。只有在完全完成练习后，才能导出进度。',
        
        // Progreso en instrucciones
        progress_title: '保存和加载进度',
        progress_text: '您可以使用以下功能保存进度：',
        progress_step1: '"导出进度"选项允许您下载包含当前积分和成就的文件。此按钮仅在练习完全完成时才会启用。',
        progress_step2: '在能够导出进度之前，您必须完成循环中每个过程的所有Q、W、ΔU、ΔH和ΔS值。',
        progress_step3: '使用"导入进度"加载以前保存的进度文件。',
        progress_step4: '虽然您的进度会在会话之间自动保存在浏览器中，但建议定期导出以避免数据丢失。',
        
        // Etiquetas de los ejes
        volume_axis: '体积 (L)',
        pressure_axis: '压力 (kPa)',
        
        // Ciclo de Carnot
        carnot_title: '卡诺循环',
        carnot_description: '卡诺循环是一个可逆的热力学循环，由两个等温过程和两个绝热过程组成。它是在给定两个温度之间可能的最高效理论循环。',
        carnot_processes: '过程:',
        carnot_process1: '1→2: 等温膨胀（温度恒定）',
        carnot_process2: '2→3: 绝热膨胀（无热传递）',
        carnot_process3: '3→4: 等温压缩（温度恒定）',
        carnot_process4: '4→1: 绝热压缩（无热传递）',
        carnot_efficiency: '效率:',
        carnot_efficiency_explanation: '其中T₁是热源温度，T₂是冷源温度。',
        
        // Ciclo de Otto
        otto_title: '奥托循环',
        otto_description: '奥托循环是火花点火内燃机的理想循环。它由绝热过程和等容过程组成。',
        otto_processes: '过程:',
        otto_process1: '1→2: 绝热压缩',
        otto_process2: '2→3: 等容加热（定容）',
        otto_process3: '3→4: 绝热膨胀（做功）',
        otto_process4: '4→1: 等容散热（定容）',
        otto_efficiency: '效率:',
        otto_efficiency_explanation: '其中r是压缩比，γ是绝热指数。',
        
        // Ciclo Diesel
        diesel_title: '柴油循环',
        diesel_description: '柴油循环是压燃内燃机的理想循环。它的特点是在恒压下加热。',
        diesel_processes: '过程:',
        diesel_process1: '1→2: 绝热压缩',
        diesel_process2: '2→3: 等压加热（定压）',
        diesel_process3: '3→4: 绝热膨胀（做功）',
        diesel_process4: '4→1: 等容散热（定容）',
        diesel_efficiency: '效率:',
        diesel_efficiency_explanation: '其中r是压缩比，α是切断比，γ是绝热指数。',
        
        // Ciclo Rankine
        rankine_title: '朗肯循环',
        rankine_description: '朗肯循环是蒸汽动力厂的理想循环。它通过使用水作为工质将热能转化为功。',
        rankine_processes: '过程:',
        rankine_process1: '1→2: 泵中的等熵压缩',
        rankine_process2: '2→3: 锅炉中的恒压加热',
        rankine_process3: '3→4: 汽轮机中的等熵膨胀',
        rankine_process4: '4→1: 冷凝器中的恒压散热',
        rankine_efficiency: '效率:',
        rankine_efficiency_explanation: '其中h是循环中不同点的比焓。',
        
        // Ciclo Brayton
        brayton_title: '布雷顿循环',
        brayton_description: '布雷顿循环是燃气轮机和喷气发动机的理想循环。它由绝热过程和等压过程组成。',
        brayton_processes: '过程:',
        brayton_process1: '1→2: 压缩机中的绝热压缩',
        brayton_process2: '2→3: 燃烧室中的等压加热',
        brayton_process3: '3→4: 涡轮机中的绝热膨胀',
        brayton_process4: '4→1: 等压散热',
        brayton_efficiency: '效率:',
        brayton_efficiency_explanation: '其中r是压力比，γ是绝热指数。',
        
        // Rankine efficiency subscripts
        net_work: '净',
        heat_in: '输入',
        
        // Gamificación
        total_points: '总分: ',
        points: '分',
        exercise_difficulty: '练习难度:',
        export_progress: '导出进度',
        import_progress: '导入进度',
        
        // Mensajes generados dinámicamente
        generating_cycle: '正在生成热力学循环...',
        error_invalid_data: '错误：循环数据无效',
        generate_to_see_data: '生成循环以查看问题数据。',
        gas_data_title: '气体数据',
        share_exercise: '分享练习',
        
        // 导出进度按钮工具提示的新键
        export_progress_tooltip: '您必须完成表格中的所有字段才能导出进度',
    },
    
    // 日本語 (Japonés)
    ja: {
        // Interfaz general
        language: '言語:',
        title: '熱力学サイクルシミュレーター',
        email: 'メール:',
        license: 'Apache 2.0 ライセンス',
        visit_counter: '訪問数:',
        
        // Tipos de procesos
        adiabatic: '断熱過程',
        isochoric: '等容過程',
        isothermal: '等温過程',
        isobaric: '等圧過程',
        linear: '線形 P-V',
        
        // Cycles
        random_cycle: 'ランダムサイクル',
        carnot_cycle: 'カルノーサイクル',
        otto_cycle: 'オットーサイクル',
        diesel_cycle: 'ディーゼルサイクル',
        rankine_cycle: 'ランキンサイクル',
        brayton_cycle: 'ブレイトンサイクル',
        generate_cycle: '新しいサイクルを生成',
        
        // 演習を共有
        share_exercise: '演習を共有',
        confirm_replace_shared_cycle: '共有された演習を表示しています。本当に新しいサイクルを生成しますか？共有された演習データは失われます。',
        
        // Datos del problema
        problem_data: '問題データ',
        gas: 'ガス:',
        gas_type: '単原子理想気体 (γ = 5/3)',
        r_constant: '定数 R:',
        amount: '物質量:',
        processes: 'プロセス:',
        point_data: 'ポイントデータ:',
        
        // Tabla de cálculos
        thermo_variables: '熱力学変数の計算',
        validate: '結果を検証',
        process: 'プロセス',
        heat: 'Q [J]',
        work: 'W [J]',
        internal_energy: 'ΔU [J]',
        enthalpy: 'ΔH [J]',
        entropy: 'ΔS [J/K]',
        
        // Para otros textos generados dinámicamente
        total_cycle: 'サイクル合計',
        correct: '正解',
        incorrect: '不正解',
        point: 'ポイント',
        process: 'プロセス',
        heat: 'Q [J]',
        work: 'W [J]',
        internal_energy: 'ΔU [J]',
        enthalpy: 'ΔH [J]',
        entropy: 'ΔS [J/K]',
        
        // Notification messages
        correct_answer: '正解！+{points} ポイント',
        incorrect_answer: '不正解。-10 ポイント',
        difficulty_level: 'レベル {level}',
        
        // Estado de variables
        state_variables_note: '<strong>重要な注意：</strong>閉じた熱力学サイクルでは、状態関数の合計変化（内部エネルギーΔU、エンタルピーΔH、エントロピーΔS）は常にゼロです。これはシステムが初期状態に戻るためです。サイクル合計では、これらの変数の正しい値は常にゼロです。',
        total_row_note: '<strong>「サイクル合計」行：</strong>この行は各列に入力された値の合計を示します。表に値を入力すると、フィールドは自動的に更新されます。',
        
        // Botones e instrucciones
        show_instructions: '使用説明を表示',
        hide_instructions: '説明を隠す',
        show_cycles_info: '熱力学サイクル情報を表示',
        hide_cycles_info: 'サイクル情報を非表示',
        instructions_title: '使用説明',
        instructions_text: 'このアプリケーションは様々な熱力学サイクルをシミュレートし、関連する熱力学変数の計算を可能にします。使用方法：',
        instructions_step1: 'ドロップダウンメニューからサイクルタイプ（カルノー、オットーなど）を選択します。',
        instructions_step2: '「新しいサイクルを生成」をクリックしてP-V図を作成します。',
        instructions_step3: '各プロセスの熱力学変数（Q、W、ΔUなど）を手動で計算します。',
        instructions_step4: '結果を表に入力し、「結果を検証」ボタンで検証します。',
        instructions_step5: '「エクササイズを共有」ボタンを使用して、エクササイズを他の人と共有できます。',
        
        // Etiquetas de ejes
        volume_axis: '体積 (L)',
        pressure_axis: '圧力 (kPa)',
        
        // Mensajes generados dinámicamente
        generating_cycle: '熱力学サイクルを生成中...',
        error_invalid_data: 'エラー：無効なサイクルデータ',
        generate_to_see_data: 'サイクルを生成して問題データを表示します。',
        gas_data_title: 'ガスデータ',
        share_exercise: 'エクササイズを共有',
        
        // Ciclo de Carnot
        carnot_title: 'カルノーサイクル',
        carnot_description: 'カルノーサイクルは、2つの等温過程と2つの断熱過程からなる可逆熱力学サイクルです。これは与えられた2つの温度間で可能な最も効率的な理論サイクルです。',
        carnot_processes: 'プロセス：',
        carnot_process1: '1→2：等温膨張（T一定）',
        carnot_process2: '2→3：断熱膨張（熱伝達なし）',
        carnot_process3: '3→4：等温圧縮（T一定）',
        carnot_process4: '4→1：断熱圧縮（熱伝達なし）',
        carnot_efficiency: '効率：',
        carnot_efficiency_explanation: 'ここでT₁は高温源の温度、T₂は低温源の温度です。',
        
        // Ciclo de Otto
        otto_title: 'オットーサイクル',
        otto_description: 'オットーサイクルは火花点火内燃機関の理想サイクルです。断熱過程と等容過程で構成されています。',
        otto_processes: 'プロセス：',
        otto_process1: '1→2：断熱圧縮',
        otto_process2: '2→3：等容加熱（等容）',
        otto_process3: '3→4：断熱膨張（出力）',
        otto_process4: '4→1：等容放熱（等容）',
        otto_efficiency: '効率：',
        otto_efficiency_explanation: 'ここでrは圧縮比、γは断熱指数です。',
        
        // Ciclo Diesel
        diesel_title: 'ディーゼルサイクル',
        diesel_description: 'ディーゼルサイクルは圧縮点火内燃機関の理想サイクルです。等圧加熱が特徴です。',
        diesel_processes: 'プロセス：',
        diesel_process1: '1→2：断熱圧縮',
        diesel_process2: '2→3：等圧加熱（等圧）',
        diesel_process3: '3→4：断熱膨張（出力）',
        diesel_process4: '4→1：等容放熱（等容）',
        diesel_efficiency: '効率：',
        diesel_efficiency_explanation: 'ここでrは圧縮比、αはカットオフ比、γは断熱指数です。',
        
        // Ciclo Rankine
        rankine_title: 'ランキンサイクル',
        rankine_description: 'ランキンサイクルは蒸気発電所の理想サイクルです。水を作動流体として使用し、熱を仕事に変換します。',
        rankine_processes: 'プロセス：',
        rankine_process1: '1→2：ポンプ内の等エントロピー圧縮',
        rankine_process2: '2→3：ボイラー内の等圧加熱',
        rankine_process3: '3→4：タービン内の等エントロピー膨張',
        rankine_process4: '4→1：凝縮器内の等圧放熱',
        rankine_efficiency: '効率：',
        rankine_efficiency_explanation: 'ここでhはサイクル内の異なる点での比エンタルピーです。',
        
        // Ciclo Brayton
        brayton_title: 'ブレイトンサイクル',
        brayton_description: 'ブレイトンサイクルはガスタービンとジェットエンジンの理想サイクルです。断熱過程と等圧過程で構成されています。',
        brayton_processes: 'プロセス：',
        brayton_process1: '1→2：圧縮機内の断熱圧縮',
        brayton_process2: '2→3：燃焼室内の等圧加熱',
        brayton_process3: '3→4：タービン内の断熱膨張',
        brayton_process4: '4→1：等圧放熱',
        brayton_efficiency: '効率：',
        brayton_efficiency_explanation: 'ここでrは圧力比、γは断熱指数です。',
        
        // Rankine efficiency subscripts
        net_work: '正味',
        heat_in: '入熱',
        
        // Gamificación
        total_points: '合計ポイント: ',
        points: 'ポイント',
        exercise_difficulty: 'エクササイズの難易度:',
        export_progress: '進捗をエクスポート',
        import_progress: '進捗をインポート',
        
        // Sistema de puntos en las instrucciones
        gamification_title: 'ポイントシステム',
        gamification_text: 'このアプリケーションには、進捗状況を測定するのに役立つポイントシステムが含まれています：',
        gamification_step1: '値を正しく検証するたびに、サイクルの難易度に基づいてポイントを獲得します。',
        gamification_step2: '不正解の回答はポイントの損失につながります。',
        gamification_step3: 'マイナスポイントが蓄積される可能性があります。',
        gamification_step4: 'サイクルの難易度は星で表示されます（1〜5★）。',
        gamification_step5: 'エネルギーバーは正解で増加し、誤りで減少します。',
        gamification_step6: '結果を検証してポイントを獲得するには、表の各セルに入力し、「結果を検証」をクリックする必要があります。',
        
        // Advertencia de exportación
        export_warning: '重要：表のすべてのフィールドを完了するまで、「進捗をエクスポート」ボタンは無効のままです。エクササイズを完全に完了した場合にのみ、進捗をエクスポートできます。',
        
        // Progreso en instrucciones
        progress_title: '進捗の保存と読み込み',
        progress_text: '以下の機能を使用して進捗を保存できます：',
        progress_step1: '「進捗をエクスポート」オプションを使用すると、現在のポイントと実績を含むファイルをダウンロードできます。このボタンは、エクササイズが完全に完了した場合にのみ有効になります。',
        progress_step2: '進捗をエクスポートする前に、サイクル内の各プロセスのすべてのQ、W、ΔU、ΔH、ΔS値を完了する必要があります。',
        progress_step3: '「進捗をインポート」を使用して、以前に保存した進捗ファイルを読み込みます。',
        progress_step4: 'セッション間でブラウザに進捗が自動的に保存されますが、データ損失を避けるために定期的にエクスポートすることをお勧めします。',
        
        // Nota sobre variáveis de estado
        state_variables_note: '<strong>重要な注意：</strong>閉じた熱力学サイクルでは、状態関数の合計変化（内部エネルギーΔU、エンタルピーΔH、エントロピーΔS）は常にゼロです。これはシステムが初期状態に戻るためです。サイクル合計では、これらの変数の正しい値は常にゼロです。',
        total_row_note: '<strong>「サイクル合計」行：</strong>この行は各列に入力された値の合計を示します。表に値を入力すると、フィールドは自動的に更新されます。',
        
        // エクスポートプログレスボタンのツールチップ用の新しいキー
        export_progress_tooltip: '進捗をエクスポートするには、表のすべてのフィールドを完了する必要があります',
    },
    // ... other languages ...
};

// Función para cambiar el idioma
function changeLanguage(lang) {
    // Guardar la preferencia de idioma en localStorage
    localStorage.setItem('preferred_language', lang);
    
    // Actualizar el atributo lang del elemento HTML
    document.documentElement.lang = lang;
    
    // Obtener todos los elementos con el atributo data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    
    // Actualizar el texto de cada elemento
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            // Si el elemento es un input o un option, actualizar el placeholder o el text
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[lang][key];
            } else if (element.tagName === 'OPTION') {
                element.text = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
    
    // Actualizar los tooltips
    const tooltipElements = document.querySelectorAll('[data-i18n-tooltip]');
    tooltipElements.forEach(element => {
        const key = 'export_progress_tooltip'; // En este caso sabemos que es esta clave
        if (translations[lang] && translations[lang][key]) {
            element.setAttribute('data-i18n-tooltip', translations[lang][key]);
        }
    });
    
    // Actualizar título de la página
    document.title = translations[lang].title;
    
    // Actualizar dinámicamente los textos del selector de ciclos
    updateCycleSelector(lang);
    
    // Actualizar específicamente los botones de instrucciones y ciclos
    updateInstructionButtons(lang);
    
    // Emitir un evento para que otros scripts puedan reaccionar al cambio de idioma
    const event = new CustomEvent('languageChanged', { detail: { language: lang } });
    document.dispatchEvent(event);
}

// Función para actualizar específicamente los botones de instrucciones y ciclos
function updateInstructionButtons(lang) {
    // Actualizar el botón de instrucciones
    const collapseInstructionsBtn = document.getElementById('collapse-instructions');
    if (collapseInstructionsBtn) {
        const instructions = document.querySelector('.instructions');
        if (instructions && instructions.classList.contains('collapsed')) {
            collapseInstructionsBtn.textContent = getTranslation('show_instructions', lang);
        } else {
            collapseInstructionsBtn.textContent = getTranslation('hide_instructions', lang);
        }
    }
    
    // Actualizar el botón de información de ciclos
    const toggleCyclesInfoBtn = document.getElementById('toggle-cycles-info');
    if (toggleCyclesInfoBtn) {
        const cyclesInfo = document.querySelector('.cycles-info');
        if (cyclesInfo && cyclesInfo.classList.contains('collapsed')) {
            toggleCyclesInfoBtn.textContent = getTranslation('show_cycles_info', lang);
        } else {
            toggleCyclesInfoBtn.textContent = getTranslation('hide_cycles_info', lang);
        }
    }
}

// Función para actualizar las opciones del selector de ciclos
function updateCycleSelector(lang) {
    const selector = document.getElementById('cycle-type-selector');
    if (selector) {
        Array.from(selector.options).forEach(option => {
            const key = `${option.value}_cycle`;
            if (translations[lang] && translations[lang][key]) {
                option.text = translations[lang][key];
            }
        });
    }
    
    // Actualizar también el botón de compartir
    const shareBtn = document.getElementById('share-btn');
    if (shareBtn && translations[lang] && translations[lang]['share_exercise']) {
        shareBtn.textContent = translations[lang]['share_exercise'];
    }
}

// Función para obtener una traducción
function getTranslation(key, lang) {
    lang = lang || getCurrentLanguage();
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    // Fallback al español si no se encuentra la traducción
    return translations.es[key] || key;
}

// Función para obtener el idioma actual
function getCurrentLanguage() {
    return localStorage.getItem('preferred_language') || 'es';
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el idioma guardado o usar español por defecto
    const savedLanguage = localStorage.getItem('preferred_language') || 'es';
    
    // Configurar el selector de idioma
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = savedLanguage;
        
        // Añadir evento para cambiar el idioma cuando se seleccione uno nuevo
        languageSelect.addEventListener('change', function() {
            changeLanguage(this.value);
        });
    }
    
    // Aplicar el idioma guardado
    changeLanguage(savedLanguage);
    
    // Asegurarse de que los botones de instrucciones tengan el texto correcto
    updateInstructionButtons(savedLanguage);
}); 