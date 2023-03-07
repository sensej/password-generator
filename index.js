const outputField = document.querySelector('#mainInput');
const passwordLengthRange = document.querySelector('#passwordLength');
const appCheckboxes = document.querySelectorAll('.app-checkbox');
const copyBtn = document.querySelector('.app-btn');
const refreshBtn = document.querySelector('.app-btn-refresh');
const passwordsHistoryList = document.querySelector('.app-password__list');
const passwordStrongList = document.querySelector('.app-password-strong');

const rangeOutputField = document.querySelector('.app-range__output');
rangeOutputField.textContent = passwordLengthRange.value;
rangeOutputField.style.left = `calc(${passwordLengthRange.value}% + (-14px))`;

const clearHistoryBtn = document.querySelector('.app-btn-clear');

const characterList = {
    letters: Array.from(Array(26)).map((_, index) => index + 65).map(item => String.fromCharCode(item)),
    symbols: ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '=', '?', '@', '[', ']', '^', '_', '{', '}'],
    numbers: Array.from(Array(10).keys()),
};

appCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => {

        generateRandomPassword();
    })
});

// Копируем пароль из нужного элемента в истории
function copyPassword() {
    if(event.target.parentElement.classList.contains('app-password__list-item-btn')) {
        const passwordHistory = event.target.parentElement.previousElementSibling.textContent;

        navigator.clipboard.writeText(passwordHistory);
    }
}

// Генерируем новый пароль
function generateRandomPassword () {
    const allCharacters = checkRules();
    const randomCharactersArr = [];
    for (let i = 0; i < passwordLengthRange.value; i++) {
        randomCharactersArr.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }

    if (randomCharactersArr.length === 0 || allCharacters.length === 0) {
        outputField.value = '';
        return null;
    }

    const passwordHistoryListItem = `
        <li class="app-password__list-item" onclick="copyPassword()">
           <span class="app-password__list-item-text">${randomCharactersArr.join('')}</span>
             <button class="app-password__list-item-btn">
                <img src="src/copy.png" alt="">
             </button>
        </li>    
    `;

    passwordsHistoryList.insertAdjacentHTML('afterbegin', passwordHistoryListItem);

    checkStrong(randomCharactersArr.join(''));

    if (clearHistoryBtn.classList.contains('hide')) clearHistoryBtn.classList.toggle('hide');

    outputField.value = randomCharactersArr.join('');
}

// Проверяем правила для пароля
function checkRules () {
    let possibleCharacters = [];
    appCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            if (checkbox.id === 'numbers') {
                possibleCharacters.push(...characterList.numbers);
            }

            if (checkbox.id === 'symbols') {
                possibleCharacters.push(...characterList.symbols);
            }

            if (checkbox.id === 'uppercase') {
                possibleCharacters.push(...characterList.letters);
                possibleCharacters = possibleCharacters.join('').toUpperCase().split('');
            }

            if (checkbox.id === 'lowercase') {
                possibleCharacters.push(...characterList.letters.join('').toLowerCase().split(''))
            }
        }
    });

    return possibleCharacters;
}

// Проверка силы пароля
function checkStrong(password) {
    const passwordStrongListItems = passwordStrongList.querySelectorAll('.app-password-strong__item');
    let strong = 0;
    let containNumbers = password.match(/\d/);
    let containSymbols = password.match(/[^a-zA-Z\d]/);

    if (strong === 0) {
        passwordStrongListItems.forEach(item => item.style.backgroundColor = 'var(--blue-color)');
    }

    if (password.length > 11) {
        strong = 1;
        passwordStrongListItems.forEach(item => item.style.backgroundColor = 'var(--blue-color)');
    }

    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strong = 2;
        passwordStrongListItems.forEach(item => item.style.backgroundColor = 'var(--blue-color)');
    }

    if (password.length > 35 && containSymbols && containNumbers) {
        strong = 3;
        passwordStrongListItems.forEach(item => item.style.backgroundColor = 'var(--blue-color)');
    }

    if (password.length > 50 && containSymbols && containNumbers) {
        strong = 4;
        passwordStrongListItems.forEach(item => item.style.backgroundColor = 'var(--blue-color)');
    }

    for (let k = passwordStrongListItems.length - 1; k > passwordStrongListItems.length - 1 - strong; k--) {
        passwordStrongListItems[k].style.backgroundColor = 'var(--red-color, red)';
    }
}

// Копируем пароль из главного инпута при нажатии на кнопку
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputField.value);
})

// Копируем пароль при нажатии на инпут
outputField.addEventListener('click', () => {
    outputField.select();
    outputField.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(outputField.value);
});

// При изменении ренджа меняем значение и регулируем местоположение выводимого значения над ползунком
passwordLengthRange.addEventListener('input', () => {
    rangeOutputField.textContent = passwordLengthRange.value;
    rangeOutputField.style.left = `calc(${passwordLengthRange.value}% + (-14px))`;

    generateRandomPassword();
});

// Обновляем случайный пароль
refreshBtn.addEventListener('click', () => generateRandomPassword());

// Очищаем историю паролей
clearHistoryBtn.addEventListener('click', () => {
    passwordsHistoryList.innerHTML = '';
    clearHistoryBtn.classList.add('hide');
});

generateRandomPassword();
