const numpad = [...document.querySelectorAll('.numpad')];
const symbol = [...document.querySelectorAll('.symbol')]
const clear = document.querySelector(".clear");
const backspace = document.querySelector(".backspace");

// Calculator display
const expressionScreen = document.querySelector('.expScreen');
const inputScreen = document.querySelector('.inputScreen');

inputScreen.textContent = "0";

const number = {
    input: "0",
    first: 0,
    second: 0,
    result: 0,
};

const operator = {
    current: "",
    clickedEquals: false,
    isDot: false,
};

const add = function(a, b) {
    return a + b;
};

const subtract = function(a, b) {
    return a - b;
};

const multiply = function(a, b) {
    return a * b;
};

const divide = function(a, b) {
    return a / b;
};

const operate = function(operator, a, b) {
    switch(operator) {
        case "+": 
            return add(a,b);
        case "-": 
            return subtract(a,b);
        case "*": 
            return multiply(a,b);
        case "/": 
            return divide(a,b);
    }
};

const displayInput = function() {
    if (operator.clickedEquals) {
        displayExpression("");
        operator.clickedEquals = false;
    }

    if (number.input.length > 11) {
        inputScreen.style.fontSize = "3rem";
    }

    inputScreen.textContent = `${number.input}`;
};

const displayExpression = function(expression) {
    expressionScreen.textContent = `${expression}`;
};

/**
 * 
 * Gets user input for each button click and build each characters as a number
 * 
 */
const getInput = function(button) {
    let input = button.getAttribute("data-key");

    // You can't just input zeros!
    if (input == "0" && number.input == "0") {
        return;
    }
    
    // Numbers shouln't start with zero!
    if (input != "0" && number.input == "0") {
        number.input = "";
    }
    
    // Numbers (especially floats) can't have more than one decimal point!
    if (input == "." && operator.isDot) {
        return;
    }
    
    if (input == "." && !operator.isDot && number.input == "") {
        number.input = "0"+number.input + input;
        operator.isDot = true;
        return;
    }

    if (input == "." && !operator.isDot) {
        operator.isDot = true;
    }

    // Calculator can't display more than 16 characters!
    if (number.input.length > 15) {
        return;
    }


    number.input = number.input + input;
};

const doCalculate = function(button) {
    let mathSymbol = button.getAttribute("data-key");

    if (mathSymbol == "=" && number.first == 0 && number.second == 0) {
        return;
    }

    // Prevent starting an expression if value still zero
    if (number.input == "0.") {
        return;
    }

    // Allow changing operator while current input or 2nd number is still missing
    if (number.input == "0") {
        operator.current = mathSymbol;
        if (number.first != 0) {
            displayExpression(number.first + " " + operator.current);
        }
        return;
    }

    // Get first number
    if (number.first == 0 && mathSymbol != "=") {
        operator.current = mathSymbol;
        number.first = parseFloat(number.input);
        number.input = "0";
        operator.isDot = false;
        displayExpression(number.first + " " + operator.current);
        displayInput();
        inputScreen.style.fontSize = "4rem";

        // Exit function, so that the next input will be stored in number.second
        return;
    }
    
    number.second = parseFloat(number.input);

    // If user clicked "=", display result and reset everything
    if (mathSymbol == "=" && number.second != 0) {
        number.result = operate(operator.current, number.first, number.second);
        if (number.result.toString().length > 15) {
            number.result = number.result.toExponential(4);
        }
        displayExpression(number.result + " " + mathSymbol);
        number.first = 0;
        number.input = "0";
        displayInput();
        operator.clickedEquals = true;
    }
    
    if (number.first != 0 && operator.current && number.second != 0) {
        number.result = operate(operator.current, number.first, number.second);
        if (number.result.toString().length > 15) {
            number.result = number.result.toExponential(4);
        }
        displayExpression(number.result + " " + mathSymbol);
        number.first = number.result;
        number.input = "0";
        operator.isDot = false;
        displayInput();
        inputScreen.style.fontSize = "4rem";
        if (mathSymbol != "=") {
            operator.current = mathSymbol;
        }
    }
};

const clearAll = function() {
    number.input = 0;
    number.first = 0;
    number.second = 0;
    number.result = 0;

    operator.current = "";
    operator.clickedEquals = false
    operator.isDot = false;

    inputScreen.style.fontSize = "4rem";
    displayInput();
    displayExpression("");
}

const backSpace = function() {
    if (number.input.length == 1) {
        number.input = "0";
        displayInput();
        return;
    }

    if (number.input.length < 11) {
        inputScreen.style.fontSize = '4rem';
    }

    if (number.input) {
        number.input = number.input.slice(0, -1)
        displayInput();
    }
}

numpad.forEach(button => {
    button.addEventListener('click', () => {
        getInput(button);
        displayInput();
    });
});

symbol.forEach(button => {
    button.addEventListener('click', () => {
        doCalculate(button);
    });
});

clear.addEventListener('click', () => {
    clearAll();
});

backspace.addEventListener('click', () => {
    backSpace();
});

window.addEventListener('keydown', function(e) {
    const numpad = document.querySelector(`.numpad[data-key = "${e.key}"]`);
    
    if (!numpad) {
        return;
    }
    
    getInput(numpad);
    displayInput();
});

window.addEventListener('keypress', function(e) {
    const symbol = document.querySelector(`.symbol[data-key = "${e.key}"]`);
    
    if (!symbol) {
        return;
    }
    
    doCalculate(symbol);
});

document.onkeydown = function(evt) {
    const enter = document.querySelector('.enter');
    evt = evt || window.event;
    if (evt.key == "Escape" || evt.key == "c") {
        clearAll();
    }

    if (evt.key == "Backspace") {
        backSpace();
    }

    if (evt.key == "Enter") {
        doCalculate(enter);
        return;
    }

};