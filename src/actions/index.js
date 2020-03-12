import axios from 'axios';

export const FETCH_BTC_EXCHANGE_RATES = 'FETCH_BTC_EXCHANGE_RATES';

export function fetchExchangeRatesBTC() {
	const url = 'https://blockchain.info/ticker';
	const request = axios.get(url);

	return {
		type: FETCH_BTC_EXCHANGE_RATES,
		payload: request
	};
}
