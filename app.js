document.addEventListener('DOMContentLoaded', () => {
    const priceElement = document.getElementById('bitcoin-price');
    const exchangeRateElement = document.getElementById('exchange-rate');
    const kimchiPremiumElement = document.getElementById('kimchi-premium');
    const hashrateElement = document.getElementById('bitcoin-hashrate');
    const ctx = document.getElementById('bitcoin-chart').getContext('2d');

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Bitcoin Price (USD)',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'time',
                    time: {
                        unit: 'minute'
                    },
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Price (USD)'
                    }
                }
            }
        }
    });

    const fetchPrices = async () => {
        try {
            console.log('Fetching prices...');
            const [usdResponse, krwResponse, exchangeRateResponse, hashrateResponse] = await Promise.all([
                fetch('https://cors-anywhere.herokuapp.com/https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
                fetch('https://cors-anywhere.herokuapp.com/https://api.upbit.com/v1/ticker?markets=KRW-BTC'),
                fetch('https://cors-anywhere.herokuapp.com/https://api.exchangerate-api.com/v4/latest/USD'),
                fetch('https://cors-anywhere.herokuapp.com/https://api.blockchair.com/bitcoin/stats')
            ]);

            if (!usdResponse.ok) {
                console.error('USD Price Fetch Error:', usdResponse.statusText);
                throw new Error('Failed to fetch USD price');
            }
            if (!krwResponse.ok) {
                console.error('KRW Price Fetch Error:', krwResponse.statusText);
                throw new Error('Failed to fetch KRW price');
            }
            if (!exchangeRateResponse.ok) {
                console.error('Exchange Rate Fetch Error:', exchangeRateResponse.statusText);
                throw new Error('Failed to fetch exchange rate');
            }
            if (!hashrateResponse.ok) {
                console.error('Hashrate Fetch Error:', hashrateResponse.statusText);
                throw new Error('Failed to fetch hashrate');
            }

            const usdData = await usdResponse.json();
            const krwData = await krwResponse.json();
            const exchangeRateData = await exchangeRateResponse.json();
            const hashrateData = await hashrateResponse.json();

            console.log('Fetched data:', { usdData, krwData, exchangeRateData, hashrateData });

            const usdPrice = usdData.bitcoin.usd;
            const krwPrice = krwData[0].trade_price;
            const exchangeRate = exchangeRateData.rates.KRW;
            const hashrate = hashrateData.data.hashrate_24h / 1e12; // TH/s 단위로 변환

            const krwPriceInUsd = krwPrice / exchangeRate;
            const premium = ((krwPriceInUsd / usdPrice) - 1) * 100;

            priceElement.innerText = `Current Bitcoin Price: $${usdPrice}`;
            exchangeRateElement.innerText = `Current Exchange Rate: 1 USD = ${exchangeRate} KRW`;
            kimchiPremiumElement.innerText = `Kimchi Premium: ${premium.toFixed(2)}%`;
            hashrateElement.innerText = `Current Bitcoin Hashrate: ${hashrate.toFixed(2)} TH/s`;

            const now = new Date();
            chart.data.labels.push(now);
            chart.data.datasets[0].data.push(usdPrice);

            if (chart.data.labels.length > 60) {
                chart.data.labels.shift();
                chart.data.datasets[0].data.shift();
            }

            chart.update();
        } catch (error) {
            console.error('Error fetching data:', error);
            priceElement.innerText = 'Failed to fetch Bitcoin price';
            exchangeRateElement.innerText = 'Failed to fetch exchange rate';
            kimchiPremiumElement.innerText = 'Failed to fetch Kimchi Premium';
            hashrateElement.innerText = 'Failed to fetch Bitcoin Hashrate';
            setTimeout(fetchPrices, 10000);  // 10초 후에 다시 시도
        }
    };

    fetchPrices();
    setInterval(fetchPrices, 30000);  // 30초마다 데이터 갱신
});
