// Campos, Formulario, etiquetas y mensajes  de error
const form = document.getElementById('age-form'); 
const dayInput = document.getElementById('day-input'); 
const monthInput = document.getElementById('month-input'); 
const yearInput = document.getElementById('year-input'); 

const dayLabel = dayInput.previousElementSibling; 
const monthLabel = monthInput.previousElementSibling;
const yearLabel = yearInput.previousElementSibling;

const dayErrorMsg = document.getElementById('day-error');
const monthErrorMsg = document.getElementById('month-error');
const yearErrorMsg = document.getElementById('year-error');

// Resultados 
const yearsResult = document.getElementById('years-result');
const monthsResult = document.getElementById('months-result');
const daysResult = document.getElementById('days-result');

// Escucha el botón de calcular y llama a handleSubmit
form.addEventListener('submit', handleSubmit);

// Función que se ejecuta cuando el usuario presiona el botón
function handleSubmit(e) {
// Evita que la página se recargue al enviar el formulario.
    e.preventDefault();

// Obtiene los números ingresados por el usuario.
    const day = parseInt(dayInput.value.trim());
    const month = parseInt(monthInput.value.trim());
    const year = parseInt(yearInput.value.trim());
    
// Ejecuta las reglas de validación (el corazón de la lógica).
    const isValid = validateInputs(day, month, year);

// Si la validación es correcta, calcula la edad y le pone la animacion a los números si no hay error
    if (isValid) {
        calculateAge(day, month, year); 
    } else {
        resetResults();
    }
}

// Verifica si la fecha es correcta, válida y no es futura, Devuelve true si todo está bien
function validateInputs(day, month, year) {
    let isValid = true;
    
    // Limpia cualquier error visible antes de volver a validar.
    resetErrors();

    // aca nos aseguramos de mostrar los mensajes para que el corriga cualquier error
    // en este caso si el campo esta vacio
    if (!day) {
        displayError(dayInput, dayLabel, dayErrorMsg, 'Este campo es obligatorio');
        isValid = false;
    }
    if (!month) {
        displayError(monthInput, monthLabel, monthErrorMsg, 'Este campo es obligatorio');
        isValid = false;
    }
    if (!year) {
        displayError(yearInput, yearLabel, yearErrorMsg, 'Este campo es obligatorio');
        isValid = false;
    }

    if (!isValid) return false; // Si falta un campo, no seguimos.

    //en este caso si el rango de la fecha no es valido
    if (day < 1 || day > 31) {
        displayError(dayInput, dayLabel, dayErrorMsg, 'Debe ser un día válido (1-31)');
        isValid = false;
    }
    if (month < 1 || month > 12) {
        displayError(monthInput, monthLabel, monthErrorMsg, 'Debe ser un mes válido (1-12)');
        isValid = false;
    }
    
    // aca validamos que no venga del futuro el usuario 
    const currentDate = new Date(); // agarramos la Fecha de hoy.
    const inputDate = new Date(year, month - 1, day); // y comparamos con Fecha ingresada.
    
    if (inputDate > currentDate) {
        displayError(yearInput, yearLabel, yearErrorMsg, 'La fecha no puede estar en el futuro');
        displayError(dayInput, dayLabel); 
        displayError(monthInput, monthLabel);
        isValid = false;
    }
    
    // años bisiestos
    const dateCheck = new Date(year, month - 1, day);
    
    // si los valores NO coinciden (dateCheck con los valores originales del usuario), la fecha entonces esta mal, no existe 
    if (dateCheck.getDate() !== day || dateCheck.getMonth() !== month - 1 || dateCheck.getFullYear() !== year) {
        displayError(dayInput, dayLabel, dayErrorMsg, 'La fecha no es válida');
        displayError(monthInput, monthLabel); 
        displayError(yearInput, yearLabel);
        isValid = false;
    }

    return isValid;
}

    // * Calcula la diferencia exacta entre la fecha de nacimiento y hoy.
function calculateAge(birthDay, birthMonth, birthYear) {
    const today = new Date();
    const birthDate = new Date(birthYear, birthMonth - 1, birthDay); 

    //Calcular diferencia en años, meses y días 
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    // Ajuste de dias
    if (days < 0) {
        months--;
        const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0); 
        days += prevMonth.getDate();     }

    // Ajuste de meses 
    if (months < 0) {
        years--;
        months += 12; 
    }
    
    //Mostrar resultados con animación
    startAnimation(yearsResult, years);
    startAnimation(monthsResult, months);
    startAnimation(daysResult, days);
}

// Animación y UI
//Hace que el número cuente de 0 hasta el resultado final.
 
function startAnimation(element, finalValue) {
    let currentValue = 0;
    const duration = 1000; //duración de animacion, es un segundo.
    const intervalTime = 20; 
    
    // Calcula cuánto debe sumar en cada paso para terminar en el tiempo correcto.
    const step = finalValue / (duration / intervalTime); 

    // Muestra los guiones antes de empezar a contar.
    element.textContent = '--';

    const timer = setInterval(() => {
        currentValue += step;

        if (currentValue >= finalValue) {
            // Cuando llega al final, detiene el conteo y pone el número exacto.
            clearInterval(timer);
            element.textContent = finalValue;
        } else {
            // Muestra el número actual redondeado.
            element.textContent = Math.floor(currentValue);
        }
    }, intervalTime);
}

//error
function displayError(inputElement, labelElement, messageElement = null, message = '') {
    inputElement.classList.add('input-error');
    labelElement.classList.add('label-error');
    if (messageElement) {
        messageElement.textContent = message;
    }
}

// Quita los errores visuales de la pantalla.
function resetErrors() {
    const inputs = [dayInput, monthInput, yearInput];
    const labels = [dayLabel, monthLabel, yearLabel];
    const messages = [dayErrorMsg, monthErrorMsg, yearErrorMsg];

    inputs.forEach(el => el.classList.remove('input-error'));
    labels.forEach(el => el.classList.remove('label-error'));
    messages.forEach(el => el.textContent = ''); // Limpia el texto de error.
}

// Vuelve a poner los resultados de edad en '--'.
function resetResults() {
    yearsResult.textContent = '--';
    monthsResult.textContent = '--';
    daysResult.textContent = '--';
}