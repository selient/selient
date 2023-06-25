export function formatTime(ms) {
  const minutes = Math.floor((ms / 1000 / 60) % 60).toString().padStart(2, '0');
  const seconds = Math.floor((ms / 1000) % 60).toString().padStart(2, '0');
  const milliseconds = Math.floor((ms % 1000) / 16.67).toString().padStart(2, '0');
  return `${minutes}:${seconds}:${milliseconds}`;
}

export function getChangeBreakdown(coinTypes, total, paid) {
  const change = paid - total;
  let remaining = change;
  const breakdown = {};

  for (let i = 0; i < coinTypes.length; i += 1) {
    const coin = coinTypes[i];
    const count = Math.floor(remaining / coin);

    if (count > 0) {
      breakdown[coin] = count;
      remaining -= count * coin;
    }
  }

  return breakdown;
}

export function generateIntBetween(min, max) {
  const int = Math.floor(Math.random() * (max - min + 1)) + min;
  return int;
}

export function sumCoinsToAmount(coins) {
  return Object.keys(coins)
    .reduce((acc, key) => acc + (Number(key) * coins[key]), 0);
}
