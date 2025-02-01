class Calculator {
    constructor() {
        this.displayValue = '0';
        this.firstOperand = null;
        this.waitingForSecondOperand = false;
        this.operator = null;
        this.history = '';
        this.powerYBase = null;
        
        this.initialize();
    }

    initialize() {
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeThemeSwitcher();
        this.initializeModeSwitcher();
    }

    initializeElements() {
        this.display = document.querySelector('.result');
        this.historyDisplay = document.querySelector('.history');
        this.buttons = document.querySelector('.buttons');
        this.scientificPanel = document.querySelector('.scientific-panel');
        this.calculator = document.querySelector('.calculator');
    }

    initializeEventListeners() {
        this.buttons.addEventListener('click', (event) => {
            const { target } = event;
            if (!target.matches('button')) return;

            if (target.classList.contains('operator')) {
                this.handleOperator(target.dataset.action);
            } else if (target.classList.contains('decimal')) {
                this.inputDecimal();
            } else if (target.classList.contains('number')) {
                this.inputDigit(target.textContent);
            }
            this.updateDisplay();
        });

        this.scientificPanel.addEventListener('click', (event) => {
            const { target } = event;
            if (!target.matches('button')) return;
            this.handleScientific(target.dataset.action);
            this.updateDisplay();
        });

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            if (/[0-9]/.test(key)) {
                this.inputDigit(key);
            } else if (key === '.') {
                this.inputDecimal();
            } else if (['+', '-', '*', '/', '=', 'Enter'].includes(key)) {
                const operatorMap = {
                    '+': 'add',
                    '-': 'subtract',
                    '*': 'multiply',
                    '/': 'divide',
                    '=': 'equals',
                    'Enter': 'equals'
                };
                this.handleOperator(operatorMap[key]);
            } else if (key === 'Backspace') {
                this.handleOperator('backspace');
            } else if (key === 'Escape') {
                this.handleOperator('clear');
            }
            this.updateDisplay();
        });
    }

    initializeThemeSwitcher() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('calculatorTheme') || 'light';
        if (savedTheme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        }

        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                html.setAttribute('data-theme', 'dark');
                localStorage.setItem('calculatorTheme', 'dark');
            } else {
                html.removeAttribute('data-theme');
                localStorage.setItem('calculatorTheme', 'light');
            }
        });
    }

    initializeModeSwitcher() {
        const modeSelect = document.getElementById('calculator-mode');
        modeSelect.addEventListener('change', () => {
            this.calculator.setAttribute('data-mode', modeSelect.value);
        });
    }

    updateDisplay() {
        this.display.textContent = this.displayValue;
        this.historyDisplay.textContent = this.history;
    }

    inputDigit(digit) {
        if (this.waitingForSecondOperand) {
            this.displayValue = digit;
            this.waitingForSecondOperand = false;
        } else {
            this.displayValue = this.displayValue === '0' ? digit : this.displayValue + digit;
        }
    }

    inputDecimal() {
        if (this.waitingForSecondOperand) {
            this.displayValue = '0.';
            this.waitingForSecondOperand = false;
            return;
        }
        if (!this.displayValue.includes('.')) {
            this.displayValue += '.';
        }
    }

    handleOperator(operator) {
        const inputValue = parseFloat(this.displayValue);

        if (operator === 'clear') {
            this.displayValue = '0';
            this.firstOperand = null;
            this.waitingForSecondOperand = false;
            this.operator = null;
            this.history = '';
            return;
        }

        if (operator === 'backspace') {
            this.displayValue = this.displayValue.slice(0, -1);
            if (this.displayValue === '') this.displayValue = '0';
            return;
        }

        if (operator === 'percent') {
            this.displayValue = (parseFloat(this.displayValue) / 100).toString();
            return;
        }

        if (this.firstOperand === null && !isNaN(inputValue)) {
            this.firstOperand = inputValue;
        } else if (this.operator) {
            const result = this.calculate(this.firstOperand, inputValue, this.operator);
            this.displayValue = `${parseFloat(result.toFixed(7))}`;
            this.firstOperand = result;
        }

        this.waitingForSecondOperand = true;
        this.operator = operator;
        
        if (operator === 'equals') {
            this.history = '';
            this.firstOperand = null;
            this.operator = null;
            this.waitingForSecondOperand = false;
        } else if (operator !== 'clear' && operator !== 'backspace') {
            this.history = `${this.firstOperand} ${this.getOperatorSymbol(operator)}`;
        }
    }

    handleScientific(action) {
        const number = parseFloat(this.displayValue);
        let result;

        switch (action) {
            case 'sin':
                result = Math.sin(number * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(number * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(number * Math.PI / 180);
                break;
            case 'asin':
                result = Math.asin(number) * 180 / Math.PI;
                break;
            case 'acos':
                result = Math.acos(number) * 180 / Math.PI;
                break;
            case 'atan':
                result = Math.atan(number) * 180 / Math.PI;
                break;
            case 'sinh':
                result = Math.sinh(number);
                break;
            case 'cosh':
                result = Math.cosh(number);
                break;
            case 'tanh':
                result = Math.tanh(number);
                break;
            case 'sqrt':
                result = Math.sqrt(number);
                break;
            case 'power':
                result = Math.pow(number, 2);
                break;
            case 'cube':
                result = Math.pow(number, 3);
                break;
            case 'power-y':
                if (this.powerYBase === null) {
                    this.powerYBase = number;
                    this.history = `${number} ^`;
                    return;
                } else {
                    result = Math.pow(this.powerYBase, number);
                    this.powerYBase = null;
                }
                break;
            case 'log':
                result = Math.log10(number);
                break;
            case 'ln':
                result = Math.log(number);
                break;
            case 'pi':
                result = Math.PI;
                break;
            case 'e':
                result = Math.E;
                break;
            case 'factorial':
                result = this.factorial(number);
                break;
            case 'inverse':
                result = 1 / number;
                break;
            case 'abs':
                result = Math.abs(number);
                break;
            case 'exp':
                result = Math.exp(number);
                break;
            case 'rand':
                result = Math.random();
                break;
            case 'floor':
                result = Math.floor(number);
                break;
            case 'ceil':
                result = Math.ceil(number);
                break;
        }

        if (!isNaN(result)) {
            this.displayValue = parseFloat(result.toFixed(7)).toString();
        }
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0) return 1;
        let result = 1;
        for (let i = 1; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    calculate(firstOperand, secondOperand, operator) {
        switch (operator) {
            case 'add':
                return firstOperand + secondOperand;
            case 'subtract':
                return firstOperand - secondOperand;
            case 'multiply':
                return firstOperand * secondOperand;
            case 'divide':
                return secondOperand !== 0 ? firstOperand / secondOperand : 'Error';
            default:
                return secondOperand;
        }
    }

    getOperatorSymbol(operator) {
        const symbols = {
            add: '+',
            subtract: '-',
            multiply: '×',
            divide: '÷'
        };
        return symbols[operator] || '';
    }
}

// Initialize the calculator
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
