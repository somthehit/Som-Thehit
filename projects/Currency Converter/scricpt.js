// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = '8630ffd1713f388da8efed12';
    const BASE_URL = 'https://v6.exchangerate-api.com/v6';

    // DOM Elements
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');
    const amount = document.getElementById('amount');
    const convertBtn = document.getElementById('convert');
    const result = document.getElementById('result');
    const rate = document.getElementById('rate');
    const convertedAmount = document.getElementById('converted-amount');
    const swapBtn = document.getElementById('swap');
    const ctx = document.getElementById('rateChart')?.getContext('2d');

    let chart;

    // Define currencies object
    const currencies = {
        USD: "United States Dollar",
        EUR: "Euro",
        GBP: "British Pound Sterling",
        JPY: "Japanese Yen",
        AUD: "Australian Dollar",
        CAD: "Canadian Dollar",
        CHF: "Swiss Franc",
        CNY: "Chinese Yuan",
        INR: "Indian Rupee",
        NZD: "New Zealand Dollar",
        KRW: "South Korean Won",
        DKK: "Danish Krone",
        AED: "United Arab Emirates Dirham",
        AFN: "Afghan Afghani",
        ALL: "Albanian Lek",
        AMD: "Armenian Dram",
        ANG: "Netherlands Antillean Guilder",
        AOA: "Angolan Kwanza",
        ARS: "Argentine Peso",
        AWG: "Aruban Florin",
        AZN: "Azerbaijani Manat",
        BAM: "Bosnia-Herzegovina Convertible Mark",
        BBD: "Barbadian Dollar",
        BDT: "Bangladeshi Taka",
        BGN: "Bulgarian Lev",
        BHD: "Bahraini Dinar",
        BIF: "Burundian Franc",
        BMD: "Bermudian Dollar",
        BND: "Brunei Dollar",
        BOB: "Bolivian Boliviano",
        BRL: "Brazilian Real",
        BSD: "Bahamian Dollar",
        BTN: "Bhutanese Ngultrum",
        BWP: "Botswana Pula",
        BYN: "Belarusian Ruble",
        BZD: "Belize Dollar",
        CDF: "Congolese Franc",
        CLP: "Chilean Peso",
        COP: "Colombian Peso",
        CRC: "Costa Rican Colón",
        CUP: "Cuban Peso",
        CVE: "Cape Verdean Escudo",
        CZK: "Czech Koruna",
        DJF: "Djiboutian Franc",
        DOP: "Dominican Peso",
        DZD: "Algerian Dinar",
        EGP: "Egyptian Pound",
        ERN: "Eritrean Nakfa",
        ETB: "Ethiopian Birr",
        FJD: "Fijian Dollar",
        FKP: "Falkland Islands Pound",
        FOK: "Faroese Króna",
        GEL: "Georgian Lari",
        GGP: "Guernsey Pound",
        GHS: "Ghanaian Cedi",
        GIP: "Gibraltar Pound",
        GMD: "Gambian Dalasi",
        GNF: "Guinean Franc",
        GTQ: "Guatemalan Quetzal",
        GYD: "Guyanese Dollar",
        HKD: "Hong Kong Dollar",
        HNL: "Honduran Lempira",
        HRK: "Croatian Kuna",
        HTG: "Haitian Gourde",
        HUF: "Hungarian Forint",
        IDR: "Indonesian Rupiah",
        ILS: "Israeli New Shekel",
        IMP: "Isle of Man Pound",
        IQD: "Iraqi Dinar",
        IRR: "Iranian Rial",
        ISK: "Icelandic Króna",
        JEP: "Jersey Pound",
        JMD: "Jamaican Dollar",
        JOD: "Jordanian Dinar",
        KES: "Kenyan Shilling",
        KGS: "Kyrgyzstani Som",
        KHR: "Cambodian Riel",
        KID: "Kiribati Dollar",
        KMF: "Comorian Franc",
        KWD: "Kuwaiti Dinar",
        KYD: "Cayman Islands Dollar",
        KZT: "Kazakhstani Tenge",
        LAK: "Lao Kip",
        LBP: "Lebanese Pound",
        LKR: "Sri Lankan Rupee",
        LRD: "Liberian Dollar",
        LSL: "Lesotho Loti",
        LYD: "Libyan Dinar",
        MAD: "Moroccan Dirham",
        MDL: "Moldovan Leu",
        MGA: "Malagasy Ariary",
        MKD: "Macedonian Denar",
        MMK: "Myanmar Kyat",
        MNT: "Mongolian Tögrög",
        MOP: "Macanese Pataca",
        MRU: "Mauritanian Ouguiya",
        MUR: "Mauritian Rupee",
        MVR: "Maldivian Rufiyaa",
        MWK: "Malawian Kwacha",
        MXN: "Mexican Peso",
        MYR: "Malaysian Ringgit",
        MZN: "Mozambican Metical",
        NAD: "Namibian Dollar",
        NGN: "Nigerian Naira",
        NIO: "Nicaraguan Córdoba",
        NOK: "Norwegian Krone",
        NPR: "Nepalese Rupee",
        OMR: "Omani Rial",
        PAB: "Panamanian Balboa",
        PEN: "Peruvian Sol",
        PGK: "Papua New Guinean Kina",
        PHP: "Philippine Peso",
        PKR: "Pakistani Rupee",
        PLN: "Polish Złoty",
        PYG: "Paraguayan Guaraní",
        QAR: "Qatari Riyal",
        RON: "Romanian Leu",
        RSD: "Serbian Dinar",
        RUB: "Russian Ruble",
        RWF: "Rwandan Franc",
        SAR: "Saudi Riyal",
        SBD: "Solomon Islands Dollar",
        SCR: "Seychellois Rupee",
        SDG: "Sudanese Pound",
        SEK: "Swedish Krona",
        SGD: "Singapore Dollar",
        SHP: "Saint Helena Pound",
        SLE: "Sierra Leonean Leone",
        SOS: "Somali Shilling",
        SRD: "Surinamese Dollar",
        SSP: "South Sudanese Pound",
        STN: "São Tomé and Príncipe Dobra",
        SYP: "Syrian Pound",
        SZL: "Eswatini Lilangeni",
        THB: "Thai Baht",
        TJS: "Tajikistani Somoni",
        TMT: "Turkmenistan Manat",
        TND: "Tunisian Dinar",
        TOP: "Tongan Paʻanga",
        TRY: "Turkish Lira",
        TTD: "Trinidad and Tobago Dollar",
        TVD: "Tuvaluan Dollar",
        TWD: "New Taiwan Dollar",
        TZS: "Tanzanian Shilling",
        UAH: "Ukrainian Hryvnia",
        UGX: "Ugandan Shilling",
        UYU: "Uruguayan Peso",
        UZS: "Uzbekistani Soʻm",
        VES: "Venezuelan Bolívar Soberano",
        VND: "Vietnamese Đồng",
        VUV: "Vanuatu Vatu",
        WST: "Samoan Tālā",
        XAF: "Central African CFA Franc",
        XCD: "East Caribbean Dollar",
        XDR: "Special Drawing Rights",
        XOF: "West African CFA Franc",
        XPF: "CFP Franc",
        YER: "Yemeni Rial",
        ZAR: "South African Rand",
        ZMW: "Zambian Kwacha",
        ZWL: "Zimbabwean Dollar"
    };

    // Populate currency dropdowns
    function populateCurrencies() {
        try {
            // Clear existing options
            fromCurrency.innerHTML = '';
            toCurrency.innerHTML = '';
            
            // Sort currencies by their full names
            const sortedCurrencies = Object.entries(currencies).sort((a, b) => a[1].localeCompare(b[1]));
            
            // Add all currency options
            sortedCurrencies.forEach(([code, name]) => {
                const option1 = new Option(`${code} - ${name}`, code);
                const option2 = new Option(`${code} - ${name}`, code);
                fromCurrency.add(option1);
                toCurrency.add(option2);
            });
            
            // Set default values
            fromCurrency.value = 'USD';
            toCurrency.value = 'EUR';
        } catch (error) {
            console.error('Error populating currencies:', error);
            showError('Failed to load currencies. Please refresh the page.');
        }
    }

    // Show error message
    function showError(message) {
        result.innerHTML = `<p class="error">${message}</p>`;
        if (chart) {
            chart.destroy();
            chart = null;
        }
    }

    // Convert currency with loading state
    async function convertCurrency() {
        if (!fromCurrency.value || !toCurrency.value) {
            showError('Please select both currencies');
            return;
        }

        try {
            // Show loading state
            convertBtn.disabled = true;
            convertBtn.textContent = 'Converting...';
            result.style.opacity = '0.5';

            const fromValue = fromCurrency.value;
            const toValue = toCurrency.value;
            const amountValue = parseFloat(amount.value) || 1;

            const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${fromValue}`);
            if (!response.ok) {
                throw new Error('API request failed');
            }

            const data = await response.json();
            if (data.result === 'success') {
                const conversionRate = data.conversion_rates[toValue];
                const converted = (amountValue * conversionRate).toFixed(2);
                
                // Format numbers for better readability
                const formattedAmount = new Intl.NumberFormat(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(amountValue);
                
                const formattedConverted = new Intl.NumberFormat(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(converted);

                rate.textContent = `${conversionRate.toFixed(4)} ${toValue}`;
                convertedAmount.textContent = `${formattedAmount} ${fromValue} = ${formattedConverted} ${toValue}`;
                
                // Update chart
                if (ctx) {
                    updateChart(fromValue, toValue);
                }
            } else {
                throw new Error('Conversion failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showError('Could not convert currency. Please try again.');
        } finally {
            // Reset loading state
            convertBtn.disabled = false;
            convertBtn.textContent = 'Convert';
            result.style.opacity = '1';
        }
    }

    // Swap currencies with animation
    function swapCurrencies() {
        const temp = fromCurrency.value;
        
        // Add rotation animation to swap icon
        swapBtn.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            swapBtn.style.transform = 'rotate(0deg)';
        }, 300);
        
        fromCurrency.value = toCurrency.value;
        toCurrency.value = temp;
        convertCurrency();
    }

    // Update chart with historical data
    async function updateChart(fromCurrency, toCurrency) {
        try {
            if (!ctx) return;

            const dates = [];
            const rates = [];
            const today = new Date();
            
            // Show loading state in chart area
            if (chart) {
                chart.destroy();
            }

            // Create loading chart
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Loading...'],
                    datasets: [{
                        data: [0],
                        borderColor: '#667eea'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
            
            // Get last 7 days of data
            for (let i = 6; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                dates.push(date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                }));
                
                const response = await fetch(`${BASE_URL}/${API_KEY}/latest/${fromCurrency}`);
                if (!response.ok) throw new Error('Failed to fetch historical data');
                
                const data = await response.json();
                if (data.result !== 'success') throw new Error('Invalid historical data');
                
                rates.push(data.conversion_rates[toCurrency]);
            }

            // Destroy loading chart
            chart.destroy();

            // Create actual chart
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dates,
                    datasets: [{
                        label: `${currencies[fromCurrency]} to ${currencies[toCurrency]}`,
                        data: rates,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.3,
                        fill: true,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 12
                                }
                            }
                        },
                        tooltip: {
                            callbacks: {
                                label: (context) => {
                                    return `Exchange Rate: ${context.raw.toFixed(4)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: false,
                            ticks: {
                                callback: (value) => value.toFixed(4)
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    }
                }
            });
        } catch (error) {
            console.error('Error updating chart:', error);
            if (chart) {
                chart.destroy();
                chart = null;
            }
        }
    }

    // Add input validation
    amount.addEventListener('input', (e) => {
        const value = e.target.value;
        if (value < 0) {
            e.target.value = Math.abs(value);
        }
    });

    // Event listeners
    convertBtn.addEventListener('click', convertCurrency);
    swapBtn.addEventListener('click', swapCurrencies);
    amount.addEventListener('input', debounce(convertCurrency, 500));
    fromCurrency.addEventListener('change', convertCurrency);
    toCurrency.addEventListener('change', convertCurrency);

    // Debounce function to limit API calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize
    populateCurrencies();
    convertCurrency();
});