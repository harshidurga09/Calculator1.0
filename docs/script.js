
const display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

let currentInput = "0";
let firstNumber = null;
let operator = null;
let waitingForSecondNumber = false;
let expressionPrefix = "";

function updateDisplay() {
    if (operator !== null) {
        display.value =expressionPrefix+currentInput;
    } else {
        display.value =currentInput;
    }
}

function clearCalculator() {
    currentInput = "0";
    firstNumber = null;
    operator = null;
    waitingForSecondNumber = false;
    expressionPrefix = "";
    updateDisplay();
}

function deleteNumber() {
    if (waitingForSecondNumber) {
        return;
    }

    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = "0";
    }

    updateDisplay();
}

function inputNumber(value) {
    if (waitingForSecondNumber) {
        currentInput = value;
        waitingForSecondNumber = false;
    } else if (currentInput === "0") {
        currentInput = value;
    } else {
        currentInput += value;
    }

    updateDisplay();
}

function inputDecimal() {
    if (waitingForSecondNumber) {
        currentInput = "0.";
        waitingForSecondNumber = false;
    } else if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {

    // If an operator already exists and the second number
    // has been entered, calculate the previous operation.
    if (operator !== null && !waitingForSecondNumber) {
        calculate();
    }

    // If an operator exists but the second number
    // has not been entered, replace the operator.
    firstNumber = Number(currentInput);
    operator = selectedOperator;
    waitingForSecondNumber = true;

    let symbol = selectedOperator;

    if (selectedOperator === "*") symbol = "×";
    if (selectedOperator === "/") symbol = "÷";
    if (selectedOperator === "-") symbol = "−";

    expressionPrefix = currentInput + " " + symbol + " ";

    display.value = expressionPrefix;
}

function calculate() {
    if (operator === null || waitingForSecondNumber) {
        return;
    }

    const secondNumber = Number(currentInput);
    let result;

    switch (operator) {
        case "+":
            result = firstNumber + secondNumber;
            break;

        case "-":
            result = firstNumber - secondNumber;
            break;

        case "*":
            result = firstNumber * secondNumber;
            break;

        case "/":
            if (secondNumber === 0) {
                currentInput = "Cannot divide by zero";
                firstNumber = null;
                operator = null;
                expressionPrefix = "";
                waitingForSecondNumber = true;
                display.value = currentInput;
                return;
            }

            result = firstNumber / secondNumber;
            break;

        case "%":
            result = firstNumber % secondNumber;
            break;
    }

    currentInput = String(Number(result.toPrecision(12)));

    firstNumber = null;
    operator = null;
    expressionPrefix = "";
    waitingForSecondNumber = true;

    updateDisplay();
}

// Button click handling
buttons.forEach(button => {
    button.addEventListener("click", () => {

        const value = button.dataset.value;
        const action = button.dataset.action;

        if (action === "clear") {
            clearCalculator();
        }

        else if (action === "delete") {
            deleteNumber();
        }

        else if (action === "calculate") {
            calculate();
        }

        else if (value === ".") {
            inputDecimal();
        }

        else if (["+", "-", "*", "/", "%"].includes(value)) {
            chooseOperator(value);
        }

        else {
            inputNumber(value);
        }
    });
});



