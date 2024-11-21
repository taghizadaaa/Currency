let currencies = {
    RUB: document.querySelector(".cedvel1"),
    USD: document.querySelector(".cedvel2"),
    EUR: document.querySelector(".cedvel3"),
    GBP: document.querySelector(".cedvel4"),
};

let targetCurrencies = {
    RUB: document.querySelector(".cedvel11"),
    USD: document.querySelector(".cedvel21"),
    EUR: document.querySelector(".cedvel31"),
    GBP: document.querySelector(".cedvel41"),
};

let input1 = document.querySelector(".input1");
let input2 = document.querySelector(".input2");
let text11 = document.querySelector(".text11");
let text12 = document.querySelector(".text12");

let solAd = "USD"; 
let sagAd = "RUB"; 
let rates = {};    
async function fetchExchangeRates() {
    try {
        let response = await fetch('https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_ePwYxikduilkO3NGz9uUPbfAgkr1ZuKDrBDgJZAt');
        let data = await response.json();
        rates = data.data;
        return rates;
    } catch (error) {
        console.error("Error fetching exchange rates:", error);
        return null;
    }
}


function updateCurrencyDetails() {
    let solRate = rates[solAd];
    let sagRate = rates[sagAd];
    if (!solRate || !sagRate) return;

    let solEmsal = sagRate / solRate;
    let sagEmsal = solRate / sagRate;

    if (solRate === sagRate) {
        solEmsal = 1;
        sagEmsal = 1;
    }

    text11.innerText = `1 ${solAd} = ${solEmsal === 1 ? solEmsal : solEmsal.toFixed(4)} ${sagAd}`;
    text12.innerText = `1 ${sagAd} = ${sagEmsal === 1 ? sagEmsal : sagEmsal.toFixed(4)} ${solAd}`;

    recalculateInputs(solEmsal, sagEmsal);
}

function recalculateInputs(solEmsal, sagEmsal) {
    let leftValue = parseFloat(input1.value);
    if (!isNaN(leftValue)) {
        let result = leftValue * solEmsal;

        if (result > 0) {
            if (result % 1 === 0) {
                input2.value = Math.round(result);
            } else {
                input2.value = result.toFixed(2);
            }
        } else {
            input2.value = ""; 
        }
    }
}

Object.keys(currencies).forEach((key) => {
    currencies[key].addEventListener("click", () => {
        solAd = key;
        highlightSelected(currencies, key);
        updateCurrencyDetails();
    });
});

Object.keys(targetCurrencies).forEach((key) => {
    targetCurrencies[key].addEventListener("click", () => {
        sagAd = key;
        highlightSelected(targetCurrencies, key);
        updateCurrencyDetails();
    });
});

function highlightSelected(group, selectedKey) {
    Object.keys(group).forEach((key) => {
        group[key].style.backgroundColor = key === selectedKey ? "#833cde" : "white";
    });
}

async function init() {
    await fetchExchangeRates();
    highlightSelected(currencies, solAd);
    highlightSelected(targetCurrencies, sagAd);
    updateCurrencyDetails();
}

init();

input1.addEventListener("input", () => {
    let solRate = rates[solAd];
    let sagRate = rates[sagAd];
    let solEmsal = sagRate / solRate;
    let sagEmsal = solRate / sagRate;

    if (solRate && sagRate) {
        recalculateInputs(solEmsal, sagEmsal);
    }
});