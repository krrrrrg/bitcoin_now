document.addEventListener('DOMContentLoaded', () => {
    const priceElement = document.getElementById('bitcoin-price');

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(response => response.json())
        .then(data => {
            priceElement.innerText = `Current Bitcoin Price: $${data.bitcoin.usd}`;
        })
        .catch(error => {
            priceElement.innerText = 'Failed to fetch Bitcoin price';
            console.error('Error fetching Bitcoin price:', error);
        });
});
