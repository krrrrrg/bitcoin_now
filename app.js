document.addEventListener('DOMContentLoaded', () => {
    const priceElement = document.getElementById('bitcoin-price');
    const kimchiPremiumElement = document.getElementById('kimchi-premium');

    // 비트코인 가격 가져오기
    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            priceElement.innerText = `Current Bitcoin Price: $${data.bitcoin.usd}`;
        })
        .catch(error => {
            priceElement.innerText = 'Failed to fetch Bitcoin price';
            console.error('Error fetching Bitcoin price:', error);
        });

    // 김치 프리미엄 계산
    const fetchPrices = async () => {
        try {
            const [usdResponse, krwResponse] = await Promise.all([
                fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
                fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC')
            ]);

            const usdData = await usdResponse.json();
            const krwData = await krw
