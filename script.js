/* =========================================
   CALCULATOR VARIABLES
========================================= */

// Stores the number currently shown on the display.
let currentInput = "0";

// Stores the previous number entered by the user.
let previousInput = "";

// Stores the selected mathematical operator.
let operator = null;

// Tracks whether the calculator is ready for a new number.
let shouldResetDisplay = false;


// Get the display elements from HTML.
const currentDisplay = document.getElementById("currentValue");
const previousDisplay = document.getElementById("previousValue");


// Get all calculator buttons.
const buttons = document.querySelectorAll(".button");


/* =========================================
   UPDATE DISPLAY
========================================= */

/*
   This function updates the calculator screen
   with the current and previous values.
*/

function updateDisplay() {

    currentDisplay.textContent = currentInput;

    if (previousInput && operator) {
        previousDisplay.textContent =
            `${previousInput} ${getOperatorSymbol(operator)}`;
    } else {
        previousDisplay.textContent = "";
    }
}


/* =========================================
   GET OPERATOR SYMBOL
========================================= */

/*
   This function converts JavaScript operators
   into symbols that look better on the calculator.
*/

function getOperatorSymbol(operator) {

    const symbols = {
        "+": "+",
        "-": "−",
        "*": "×",
        "/": "÷"
    };

    return symbols[operator] || operator;
}


/* =========================================
   INPUT NUMBER
========================================= */

/*
   This function adds a number to the
   current calculator input.
*/

function inputNumber(number) {

    // Start a new number after an operation.
    if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    // Prevent unnecessary leading zeros.
    if (currentInput === "0") {
        currentInput = number;
    } else {
        currentInput += number;
    }

    updateDisplay();
}


/* =========================================
   INPUT DECIMAL
========================================= */

/*
   This function adds a decimal point to
   the current number.
*/

function inputDecimal() {

    // Start with 0. if the display needs resetting.
    if (shouldResetDisplay) {
        currentInput = "0.";
        shouldResetDisplay = false;
        updateDisplay();
        return;
    }

    // Prevent multiple decimal points.
    if (!currentInput.includes(".")) {
        currentInput += ".";
    }

    updateDisplay();
}


/* =========================================
   SELECT OPERATOR
========================================= */

/*
   This function stores the selected mathematical
   operator and prepares the calculator for the
   next number.
*/

function selectOperator(selectedOperator) {

    // If an operator already exists, calculate
    // the previous operation first.
    if (operator && previousInput !== "" && !shouldResetDisplay) {
        calculate();
    }

    previousInput = currentInput;
    operator = selectedOperator;

    shouldResetDisplay = true;

    updateDisplay();
}


/* =========================================
   CALCULATE RESULT
========================================= */

/*
   This function performs the selected arithmetic
   operation and displays the result.
*/

function calculate() {

    // Make sure there is enough information to calculate.
    if (operator === null || previousInput === "") {
        return;
    }

    const firstNumber = parseFloat(previousInput);
    const secondNumber = parseFloat(currentInput);

    let result;


    // Perform the correct mathematical operation.
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

            // Handle division by zero safely.
            if (secondNumber === 0) {

                currentInput = "Cannot divide by 0";
                previousInput = "";
                operator = null;
                shouldResetDisplay = true;

                updateDisplay();

                return;
            }

            result = firstNumber / secondNumber;
            break;

        default:
            return;
    }


    // Round very long decimal results.
    result = parseFloat(result.toFixed(10));

    currentInput = result.toString();

    previousInput = "";
    operator = null;

    shouldResetDisplay = true;

    updateDisplay();
}


/* =========================================
   CLEAR CALCULATOR
========================================= */

/*
   This function completely resets the calculator
   back to its initial state.
*/

function clearCalculator() {

    currentInput = "0";
    previousInput = "";
    operator = null;
    shouldResetDisplay = false;

    updateDisplay();
}


/* =========================================
   BACKSPACE
========================================= */

/*
   This function removes the last character
   from the current input.
*/

function deleteLastDigit() {

    // If the calculator is showing an error,
    // reset the calculator.
    if (currentInput === "Cannot divide by 0") {
        clearCalculator();
        return;
    }

    // Don't delete the final remaining digit.
    if (currentInput.length === 1) {
        currentInput = "0";
    } else {
        currentInput = currentInput.slice(0, -1);
    }

    updateDisplay();
}


/* =========================================
   PERCENTAGE
========================================= */

/*
   This function converts the current number
   into a percentage.
*/

function convertToPercentage() {

    const number = parseFloat(currentInput);

    if (isNaN(number)) {
        return;
    }

    currentInput = (number / 100).toString();

    updateDisplay();
}


/* =========================================
   BUTTON CLICK HANDLER
========================================= */

/*
   This function checks which calculator button
   was clicked and calls the appropriate function.
*/

function handleButtonClick(event) {

    const button = event.currentTarget;

    const number = button.dataset.number;
    const selectedOperator = button.dataset.operator;
    const action = button.dataset.action;


    // Handle number buttons.
    if (number !== undefined) {
        inputNumber(number);
        return;
    }


    // Handle operator buttons.
    if (selectedOperator !== undefined) {
        selectOperator(selectedOperator);
        return;
    }


    // Handle special calculator actions.
    switch (action) {

        case "clear":
            clearCalculator();
            break;

        case "backspace":
            deleteLastDigit();
            break;

        case "percentage":
            convertToPercentage();
            break;

        case "decimal":
            inputDecimal();
            break;

        case "calculate":
            calculate();
            break;
    }
}


/* =========================================
   ADD BUTTON EVENT LISTENERS
========================================= */

/*
   This function connects every calculator button
   to the handleButtonClick function.
*/

buttons.forEach(function(button) {

    button.addEventListener("click", handleButtonClick);

});


/* =========================================
   KEYBOARD SUPPORT
========================================= */

/*
   This function allows the user to operate the
   calculator using the computer keyboard.
*/

document.addEventListener("keydown", function(event) {

    const key = event.key;


    // Number keys.
    if (/^[0-9]$/.test(key)) {
        inputNumber(key);
        return;
    }


    // Decimal point.
    if (key === ".") {
        inputDecimal();
        return;
    }


    // Mathematical operators.
    if (["+", "-", "*", "/"].includes(key)) {
        selectOperator(key);
        return;
    }


    // Calculate result.
    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
        return;
    }


    // Clear calculator.
    if (key === "Escape") {
        clearCalculator();
        return;
    }


    // Backspace.
    if (key === "Backspace") {
        deleteLastDigit();
        return;
    }


    // Percentage.
    if (key === "%") {
        convertToPercentage();
    }

});


// Show the initial calculator state.
updateDisplay();