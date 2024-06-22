document.addEventListener('DOMContentLoaded', () => {
    const priceElement = document.getElementById('bitcoin-price');
    const exchangeRateElement = document.getElementById('exchange-rate');
    const kimchiPremiumElement = document.getElementById('kimchi-premium');
    const hashrateElement = document.getElementById('bitcoin-hashrate');

    const fetchPrices = async () => {
        try {
            const [usdResponse, krwResponse, exchangeRateResponse, hashrateResponse] = await Promise.all([
                fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
                fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC'),
                fetch('https://api.exchangerate-api.com/v4/latest/USD'),
                fetch('https://api.blockchain.info/q/hashrate') // 비트코인 해시레이트 API
            ]);

            if (!usdResponse.ok) {
                throw new Error('Failed to fetch USD price');
            }
            if (!krwResponse.ok) {
                throw new Error('Failed to fetch KRW price');
            }
            if (!exchangeRateResponse.ok) {
                throw new Error('Failed to fetch exchange rate');
            }
            if (!hashrateResponse.ok) {
                throw new Error('Failed to fetch hashrate');
            }

            const usdData = await usdResponse.json();
            const krwData = await krwResponse.json();
            const exchangeRateData = await exchangeRateResponse.json();
            const hashrateData = await hashrateResponse.text();

            const usdPrice = usdData.bitcoin.usd;
            const krwPrice = krwData[0].trade_price;
            const exchangeRate = exchangeRateData.rates.KRW;

            const krwPriceInUsd = krwPrice / exchangeRate;
            const premium = ((krwPriceInUsd / usdPrice) - 1) * 100;

            priceElement.innerText = `Current Bitcoin Price: $${usdPrice}`;
            exchangeRateElement.innerText = `Current Exchange Rate: 1 USD = ${exchangeRate} KRW`;
            kimchiPremiumElement.innerText = `Kimchi Premium: ${premium.toFixed(2)}%`;
            hashrateElement.innerText = `Current Bitcoin Hashrate: ${hashrateData} TH/s`;
        } catch (error) {
            priceElement.innerText = 'Failed to fetch Bitcoin price';
            exchangeRateElement.innerText = 'Failed to fetch exchange rate';
            kimchiPremiumElement.innerText = 'Failed to fetch Kimchi Premium';
            hashrateElement.innerText = 'Failed to fetch Bitcoin Hashrate';
            console.error('Error fetching data:', error);
            setTimeout(fetchPrices, 10000);  // 10초 후에 다시 시도
        }
    };

    fetchPrices();
    setInterval(fetchPrices, 30000);  // 30초마다 데이터 갱신
});
