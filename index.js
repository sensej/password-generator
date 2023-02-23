const outputField = document.querySelector('#mainInput');
const passwordLengthRange = document.querySelector('#passwordLength');
const appCheckboxes = document.querySelectorAll('.app-checkbox');
const copyBtn = document.querySelector('.app-btn');

const rangeOutputField = document.querySelector('.app-range__output');
rangeOutputField.textContent = passwordLengthRange.value;
rangeOutputField.style.marginLeft = `calc(${passwordLengthRange.value}% + (-14px))`;

const characterList = {
    letters: Array.from(Array(26)).map((_, index) => index + 65).map(item => String.fromCharCode(item)),
    symbols: ['!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', ']', '^', '_', '{', '}'],
    numbers: Array.from(Array(10).keys()),
};

passwordLengthRange.addEventListener('input', () => {
    rangeOutputField.textContent = passwordLengthRange.value;
    rangeOutputField.style.marginLeft = `calc(${passwordLengthRange.value}% + (-14px))`;

    generateRandomPassword();
});

function generateRandomPassword () {
    const allCharacters = checkRules();
    const result = [];

    for (let i = 0; i < passwordLengthRange.value; i++) {
        result.push(allCharacters[Math.floor(Math.random() * allCharacters.length)]);
    }

    outputField.value = result.join('');
}

appCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => {

        generateRandomPassword();
    })
})

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

copyBtn.addEventListener('click', e => {
    // outputField.select();
    // outputField.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(outputField.value);
})

generateRandomPassword();
