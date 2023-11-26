let portfolio = {};
let money = 100000;  // The initial amount of money you have.
let btcBalance = 0;
// Function to search for stocks
function searchStocks() {
    let searchTerm = document.getElementById('stock-search').value;
    
    // Make an API request to get the stock price
    // Replace "YOUR_API_KEY" with your actual API key
    fetch(`https://cloud.iexapis.com/stable/stock/${searchTerm}/quote?token=pk_326cb2595cf1495daaf12ab64b2c68a4`)
    .then(response => response.json())
    .then(data => {
        const price = data.latestPrice;

        // Create the stock info div
        const stockInfoDiv = document.getElementById('stock-info');
        stockInfoDiv.innerHTML = `
            <h2>${data.companyName}</h2>
            <p>Current Price: $${price.toFixed(2)}</p>
            <input type="number" id="stock-amount" min="1" value="1">
            <button onclick="buyStock('${searchTerm}', ${price})">Buy</button>
            <button onclick="sellStock('${searchTerm}', ${price})">Sell</button>
        `;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// Function to buy stocks
function buyStock(stockSymbol, price) {
    let amount = document.getElementById('stock-amount').value;

    if (money >= price * amount) {
        money -= price * amount;
        if (!portfolio[stockSymbol]) {
            portfolio[stockSymbol] = {shares: 0, buyingPrice: price};
        }
        portfolio[stockSymbol].shares += Number(amount);
        document.getElementById('messages').innerHTML = `Bought ${amount} of ${stockSymbol} at $${price.toFixed(2)} each. Total: $${(price*amount).toFixed(2)}`;
    } else {
        document.getElementById('messages').innerHTML = "Not enough money to buy this stock.";
    }
    updatePortfolioView();
}

// Function to sell stocks
function sellStock(stockSymbol, price) {
    let amount = document.getElementById('stock-amount').value;

    if (portfolio[stockSymbol] && portfolio[stockSymbol].shares >= amount) {
        money += price * amount;
        let profit = (price - portfolio[stockSymbol].buyingPrice) * amount;
        portfolio[stockSymbol].shares -= Number(amount);
        if (portfolio[stockSymbol].shares === 0) {
            delete portfolio[stockSymbol];
        }
        document.getElementById('messages').innerHTML = `Sold ${amount} of ${stockSymbol} at $${price.toFixed(2)} each. Total: $${(price*amount).toFixed(2)}. Profit: $${profit.toFixed(2)}`;
    } else {
        document.getElementById('messages').innerHTML = "You don't own enough of this stock to sell.";
    }
    updatePortfolioView();
}

// Function to update portfolio view

function updatePortfolioView() {
    const portfolioDiv = document.getElementById('portfolio');
    portfolioDiv.innerHTML = '<h2>Portfolio:</h2>';
    for (let stock in portfolio) {
        portfolioDiv.innerHTML += `<p>${stock}: ${portfolio[stock].shares}</p>`;
    }
    portfolioDiv.innerHTML += `<p>Money: $${money.toFixed(2)}</p>`;
    portfolioDiv.innerHTML += `<p>Bitcoin: ${btcBalance.toFixed(8)}</p>`; // Display Bitcoin balance
}

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', searchStocks);

// Event listener for the portfolio toggle button
document.getElementById('toggle-portfolio').addEventListener('click', function() {
    const portfolioDiv = document.getElementById('portfolio');
    if (portfolioDiv.style.display === 'none') {
        portfolioDiv.style.display = 'block';
        this.textContent = 'Hide Portfolio';
        updatePortfolioView();
    } else {
        portfolioDiv.style.display = 'none';
        this.textContent = 'Show Portfolio';
    }
});


function convertCurrency() {
    const conversionType = document.getElementById('conversion-type').value;
    const amount = document.getElementById('conversion-amount').value;

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
    .then(response => response.json())
    .then(data => {
        const btcPrice = data.bitcoin.usd;
        let convertedAmount;

        if (conversionType === 'btcToUsd') {
            if (btcBalance >= amount) { // Check if enough BTC balance
                convertedAmount = btcPrice * amount;
                document.getElementById('conversion-result').innerText = `${amount} Bitcoin = ${convertedAmount.toFixed(2)} USD`;
                btcBalance -= amount; // Reduce BTC balance
                money += convertedAmount; // Increase money balance
            } else {
                document.getElementById('conversion-result').innerText = `Insufficient Bitcoin balance.`;
            }
        } else if (conversionType === 'usdToBtc') {
            if (money >= amount) { // Check if enough money balance
                convertedAmount = amount / btcPrice;
                document.getElementById('conversion-result').innerText = `${amount} USD = ${convertedAmount.toFixed(8)} Bitcoin`;
                money -= amount; // Reduce money balance
                btcBalance += convertedAmount; // Increase BTC balance
            } else {
                document.getElementById('conversion-result').innerText = `Insufficient money.`;
            }
        }

        // Update portfolio view after conversion
        updatePortfolioView();
    })
    .catch(error => {
        console.error('Error:', error);
    });
}