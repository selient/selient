import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../style/index.module.css';
import {
  formatTime,
  getChangeBreakdown,
  generateIntBetween,
  sumCoinsToAmount,
} from '../utils';
import {
  coinTypes,
  initialPayment,
  initialGame,
  defaultCoins,
  paymentResultMap,
  initialWallet,
} from '../constants';

function GamePlay() {
  const [wallet, setWallet] = useState(initialWallet);
  const [game, setGame] = useState(initialGame);
  const navigate = useNavigate();

  useEffect(() => {
    if (game.timeLeft <= 0) {
      navigate('/end', { state: { game } });
    }
  }, [game, navigate]);

  useEffect(() => {
    setGame((prevGame) => ({
      ...prevGame,
      price: generateIntBetween(100, 200),
    }));
    const timerId = setInterval(() => {
      setGame((prevGame) => ({
        ...prevGame,
        timeLeft: prevGame.timeLeft - 10,
      }));
    }, 10);

    return () => clearInterval(timerId);
  }, []);

  const handleCoinClick = (denomination) => {
    if (wallet.coins[denomination] <= 0) {
      return false;
    }
    setGame((prevGame) => ({
      ...prevGame,
      pendingPayment: {
        ...prevGame.pendingPayment,
        coins: {
          ...prevGame.pendingPayment.coins,
          [denomination]: prevGame.pendingPayment.coins[denomination] + 1,
        },
        amount: prevGame.pendingPayment.amount + Number(denomination),
      },
    }));

    setWallet((prevWallet) => ({
      ...prevWallet,
      coins: {
        ...prevWallet.coins,
        [denomination]: prevWallet.coins[denomination] - 1,
      },
      amount: prevWallet.amount - Number(denomination),
    }));
    return true;
  };

  const handlePaymentClick = (denomination) => {
    if (game.pendingPayment.coins[denomination] <= 0) {
      return false;
    }
    setGame((prevGame) => ({
      ...prevGame,
      pendingPayment: {
        ...prevGame.pendingPayment,
        coins: {
          ...prevGame.pendingPayment.coins,
          [denomination]: prevGame.pendingPayment.coins[denomination] - 1,
        },
        amount: prevGame.pendingPayment.amount - Number(denomination),
      },
    }));

    setWallet((prevWallet) => ({
      ...prevWallet,
      coins: {
        ...prevWallet.coins,
        [denomination]: prevWallet.coins[denomination] + 1,
      },
      amount: prevWallet.amount + Number(denomination),
    }));
    return true;
  };

  const topUpWallet = () => {
    const added = Math.floor((5000 - wallet.amount) / 1000);
    setWallet((prevWallet) => {
      const updatedCoins = {
        ...prevWallet.coins,
        1000: prevWallet.coins[1000] + added,
      };
      const updatedAmount = prevWallet.amount + 1000 * added;

      return {
        ...prevWallet,
        coins: updatedCoins,
        amount: updatedAmount,
      };
    });
  };

  const handlePaymentResult = (returnCoins) => {
    let isGreatPayment = true;

    Object.keys(returnCoins).forEach((key) => {
      const denomination = Number(key);
      if (wallet.coins[denomination] + returnCoins[denomination] > defaultCoins[denomination]) {
        isGreatPayment = false;
      }
    });

    const isMissedPayment = !!Object.keys(returnCoins)
      .find((key) => game.pendingPayment.coins[key] > 0);

    const isPerfectPayment = sumCoinsToAmount(returnCoins) === 0;

    let result = null;

    // TODO: combo

    if (isMissedPayment) {
      result = 'missed';
    } else if (isPerfectPayment) {
      result = 'perfect';
    } else if (isGreatPayment) {
      result = 'great';
    } else if (!isGreatPayment) {
      result = 'good';
    }

    return paymentResultMap[result];
  };

  const handleChange = (g) => {
    if (g.pendingPayment.amount < g.price) {
      return '';
    }
    return g.pendingPayment.amount - g.price;
  };

  const handlePayment = () => {
    if (game.pendingPayment.amount < game.price) {
      return false;
    }

    const returnCoins = getChangeBreakdown(coinTypes, game.price, game.pendingPayment.amount);

    Object.keys(returnCoins).forEach((key) => {
      const denomination = Number(key);

      setWallet((prevWallet) => ({
        ...prevWallet,
        coins: {
          ...prevWallet.coins,
          [denomination]: prevWallet.coins[denomination] + returnCoins[denomination],
        },
        amount: prevWallet.amount + (denomination * returnCoins[denomination]),
      }));
    });

    if (wallet.amount < 5000) {
      topUpWallet();
    }
    const nextPrice = generateIntBetween(0, 5000);
    // let nextPrice = null;
    // if (Math.random() < 0.3) {
    //   nextPrice = generateExactPayableAmountFromWallet(wallet.coins);
    // } else {
    //   nextPrice = generateRandomAmount(wallet.amount);
    // }

    const { score, time: timeAdjust } = handlePaymentResult(returnCoins);

    setGame((prevGame) => ({
      ...prevGame,
      price: nextPrice,
      pendingPayment: initialPayment,
      score: prevGame.score + score,
      timeLeft: prevGame.timeLeft + timeAdjust,
    }));

    return true;
  };

  return (
    <div>
      <h1>Coin Game</h1>
      <div>
        <section className={styles.flexContainer}>
          <div>
            <h3>Time</h3>
            <p>{formatTime(game.timeLeft)}</p>
          </div>
          <div>
            <h3>Score</h3>
            <div>{game.score}</div>
          </div>
        </section>
        <section className={styles.flexContainer}>
          <div>
            <h3>Price</h3>
            <p>
              {game.price}
            </p>
          </div>
          <div>
            <h3>Amount</h3>
            <p>
              {game.pendingPayment.amount}
            </p>
          </div>
          <div>
            <h3>Change</h3>
            <p>
              {handleChange(game)}
            </p>
          </div>
        </section>

        <h2>Pending Payment</h2>
        <div className={styles.coinContainer}>
          {Object.keys(game.pendingPayment.coins).map((key) => (
            <button type="button" className={styles.coinItem} key={key} onClick={() => handlePaymentClick(key)}>
              {`${key} yen: ${game.pendingPayment.coins[key]}`}
            </button>
          ))}
        </div>

        <button type="button" className={styles.payButton} onClick={handlePayment}>Pay!</button>

        <h2>Wallet</h2>
        <div className={styles.coinContainer}>
          {Object.keys(wallet.coins).map((key) => (
            <button type="button" className={styles.coinItem} key={key} onClick={() => handleCoinClick(key)}>
              <span className={styles.coinButtonText}>{`${key} yen`}</span>
              <span className={styles.coinButtonText}>{`${wallet.coins[key]}`}</span>
            </button>
          ))}
        </div>
        {/* <h3>Amount</h3>
        <p>{wallet.amount}</p> */}
      </div>

    </div>
  );
}

export default GamePlay;
