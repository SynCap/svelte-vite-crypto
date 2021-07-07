/// <reference types="svelte" />


interface TCoin {
	id: string; // "bitcoin",
	icon: string; // "https://static.coinstats.app/coins/Bitcoin6l39t.png",
	name: string; // "Bitcoin",
	symbol: string; // "BTC",
	rank: number; // 1,
	price: number; // 40253.35093733178,
	priceBtc: number; // 1,
	volume: number; // 3091253515514.5273,
	marketCap: number; // 754151038186.2158,
	availableSupply: number; // 18735112,
	totalSupply: number; // 21000000,
	priceChange1h: number; // -0.07,
	priceChange1d: number; // 3.15,
	priceChange1w: number; // 19.75,
	websiteUrl?: string; // "https://bitcoin.org",
	twitterUrl?: string; // "https://twitter.com/btc",
	contractAddress?: string; // "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
	decimals?: number; // 18,
	exp: string[] /* [
		"https://blockchain.coinmarketcap.com/chain/bitcoin",
		"https://blockexplorer.one/btc/mainnet"
	] */;
}

interface TFetchQuery {
	start?: number,
	limit?: number,
}

type TCoinList = TCoin[]
