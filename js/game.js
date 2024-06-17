import CardsData from "../store/cardsData.js";

window.Telegram.WebApp.ready();
window.Telegram.WebApp.expand();

function sendResultToTelegram(data, info) {
    let res = {
        data: data,
        info: info
    };
    window.Telegram.WebApp.sendData(JSON.stringify(res));
}

function closeWebApp() {
    window.Telegram.WebApp.close();
}

class Card {
    constructor(id, card_name, img, stats) {
        this.canvas = canvas;
        this.id = id;
        this.card_name = card_name;
        this.img = img;
        this.stats = stats;
    }

    render() {
        return `<img alt=${this.card_name} src=${this.img}></img>`;
    }
}

function getDataFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    if (dataParam) {
        try {
            return JSON.parse(decodeURIComponent(dataParam));
        } catch (e) {
            console.error("Failed to parse 'data' parameter from URL", e);
            return [1, 2, 3, 4, 5, 6];
        }
    }
    return [1, 2, 3, 4, 5, 6];
}

function getInfoFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const infoParam = urlParams.get('info');
    if (infoParam) {
        try {
            return decodeURIComponent(infoParam);
        } catch (e) {
            console.error("Failed to parse 'info' parameter from URL", e);
            return "wrong_data";
        }
    }
    return "wrong_data";
}

const data = getDataFromUrl();
const info = getInfoFromUrl();
const allyList = data.slice(0, 3);
const enemyList = data.slice(3, 6);
console.log(allyList, enemyList);
const canvas = document.getElementById("canvas");
const playerCanvas = document.getElementById("player--canvas");
const enemyCanvas = document.getElementById("enemy--canvas");

const PlayerFieldRender = () => {
    const firstCard = document.getElementById("player--card1");
    const secondCard = document.getElementById("player--card2");
    const thirdCard = document.getElementById("player--card3");

    firstCard.children[0].setAttribute("src", CardsData[allyList[0]].img);
    secondCard.children[0].setAttribute("src", CardsData[allyList[1]].img);
    thirdCard.children[0].setAttribute("src", CardsData[allyList[2]].img);
};

const EnemyFieldRender = () => {
    const firstCard = document.getElementById("enemy--card1");
    const secondCard = document.getElementById("enemy--card2");
    const thirdCard = document.getElementById("enemy--card3");

    firstCard.children[0].setAttribute("src", CardsData[enemyList[0]].img);
    secondCard.children[0].setAttribute("src", CardsData[enemyList[1]].img);
    thirdCard.children[0].setAttribute("src", CardsData[enemyList[2]].img);
};

const renderModal = (text) => {
    const modal = document.getElementById("modal");
    modal.children[0].textContent = text;
};

const displayModal = (text, timing, callback) => {
    renderModal(text);
    showModal();
    setTimeout(() => {
        closeModal(callback);
    }, timing);
};

const showModal = () => {
    const modal = document.getElementById("modal");
    modal.classList.remove("disabled");
    modal.classList.remove("non_op");
};

const displayAttackModal = (data, card_id, callback) => {
    showAttackModal(data, card_id);
    const modal = document.getElementById("attack_choose--modal");
    const handleClose = () => {
        modal.removeEventListener("close", handleClose);
        if (callback) callback();
    };
    modal.addEventListener("close", handleClose);
};

const showAttackModal = (data, card_id) => {
    const modal = document.getElementById("attack_choose--modal");
    modal.children[0].textContent = `Вы атакуете ${data.name}!`;
    modal.showModal();
};

const closeAttackModal = () => {
    const modal = document.getElementById("attack_choose--modal");
    modal.close();
};

const closeModal = (callback) => {
    const modal = document.getElementById("modal");
    modal.classList.add("non_op");
    setTimeout(() => {
        modal.classList.add("disabled");
        if (callback) callback();
    }, 1000);
};

let playerCardTurnNumber = 0;
let turn = "player";
let curAttackType = -1;
let gameOver = false;

let curEnemies = {
    0: {
        name: CardsData[enemyList[0]].name,
        stats: {...CardsData[enemyList[0]].stats},
        isAlive: true,
        hp: 300
    },
    1: {
        name: CardsData[enemyList[1]].name,
        stats: {...CardsData[enemyList[1]].stats},
        isAlive: true,
        hp: 300
    },
    2: {
        name: CardsData[enemyList[2]].name,
        stats: {...CardsData[enemyList[2]].stats},
        isAlive: true,
        hp: 300
    }
};

let curPlayers = {
    0: {
        name: CardsData[allyList[0]].name,
        stats: {...CardsData[allyList[0]].stats},
        isAlive: true,
        hp: 300
    },
    1: {
        name: CardsData[allyList[1]].name,
        stats: {...CardsData[allyList[1]].stats},
        isAlive: true,
        hp: 300
    },
    2: {
        name: CardsData[allyList[2]].name,
        stats: {...CardsData[allyList[2]].stats},
        isAlive: true,
        hp: 300
    }
};

const turnChooseEnemy = () => {
    if (gameOver) return;

    for (let card of enemyCanvas.children) {
        card.classList.add("cardHover");
        card.addEventListener("click", () => {
            if (gameOver) return;

            let card_id = card.getAttribute("card_id");
            displayAttackModal(CardsData[enemyList[card_id]], card_id, () => {
                if (curAttackType === "sword") {
                    swordAnim(card_id);
                } else if (curAttackType === "long") {
                    longAnim(card_id);
                } else if (curAttackType === "magic") {
                    magicAnim(card_id);
                }
                performAttack("player", playerCardTurnNumber, card_id, () => {
                    checkGameOver();
                    if (!gameOver) {
                        turn = "computer";
                        setTimeout(handleComputerTurn, 1000);
                    }
                });
            });
        });
    }
};

const setAttackType = (type) => {
    curAttackType = type;
};

document.querySelectorAll('.attack_choose_button').forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
        setAttackType(button.value);
        closeAttackModal();
    });
});

const game = () => {
    if (gameOver) return;

    if (turn === "player") {
        handlePlayerTurn();
    } else {
        handleComputerTurn();
    }
};

const handlePlayerTurn = () => {
    if (gameOver) return;

    if (curPlayers[playerCardTurnNumber].isAlive) {
        const currentPlayerCard = playerCanvas.children[playerCardTurnNumber].children[0];
        currentPlayerCard.classList.add("turn");
        displayModal(`Ходит ${curPlayers[playerCardTurnNumber].name}`, 2000, () => {
            turnChooseEnemy();
        });
    } else {
        nextPlayerTurn();
    }
};

const handleComputerTurn = () => {
    if (gameOver) return;

    const cardToAttack = getWeakestPlayerCard();
    if (cardToAttack !== null) {
        const attackingCard = getAliveComputerCard();
        if (attackingCard !== null) {
            displayModal(`Компьютер атакует!`, 2000, () => {
                performAttack("computer", attackingCard, cardToAttack, () => {
                    checkGameOver();
                    if (!gameOver) {
                        turn = "player";
                        nextPlayerTurn();
                    }
                });
            });
        }
    }
};

const performAttack = (attacker, attackingCardIndex, targetCardIndex, callback) => {
    if (gameOver) return;

    const attackerCard = attacker === "player" ? curPlayers[attackingCardIndex] : curEnemies[attackingCardIndex];
    const targetCard = attacker === "player" ? curEnemies[targetCardIndex] : curPlayers[targetCardIndex];

    const damage = calculateDamage(attackerCard, targetCard);
    targetCard.hp -= damage;

    displayDamage(attacker === "player" ? 'enemy' : 'player', targetCardIndex, damage);

    if (targetCard.hp <= 0) {
        targetCard.isAlive = false;
        document.getElementById(`${attacker === "player" ? 'enemy' : 'player'}--card${Number(targetCardIndex) + 1}`).classList.add("dead");
    }

    if (callback) {
        callback();
    }
};

const calculateDamage = (attackerCard, targetCard) => {
    const attackerStats = attackerCard.stats;
    const targetStats = targetCard.stats;

    let hitChance, damage;

    switch (curAttackType) {
        case "sword":
            hitChance = attackerStats.attack / targetStats.defense;
            damage = hitChance >= Math.random() ? (attackerStats.attack ** 2 / targetStats.defense) : 0;
            break;
        case "long":
            hitChance = ((attackerStats.attack + attackerStats.long_dist + attackerStats.intelligence) / 3) / targetStats.defense;
            damage = hitChance >= Math.random() ? (hitChance * (attackerStats.attack + Math.floor(Math.random() * (30 - 10 + 1)) + 10)) : 0;
            break;
        case "magic":
            hitChance = ((attackerStats.attack + attackerStats.magic + attackerStats.intelligence) / 3) / targetStats.defense;
            damage = hitChance >= Math.random() ? ((attackerStats.magic / targetStats.defense) * (2 * attackerStats.attack)) : 0;
            break;
        default:
            damage = 0;
            break;
    }

    return Math.round(damage);
};

const displayDamage = (targetType, targetCardIndex, damage) => {
    console.log(`#${targetType}--card${parseInt(targetCardIndex) + 1}`);
    const targetElement = document.querySelector(`#${targetType}--card${parseInt(targetCardIndex) + 1}`);
    if (targetElement) {
        const damageElement = document.createElement('div');
        damageElement.classList.add("xp");
        damageElement.classList.add('damage-display');
        damageElement.textContent = `-${damage}xp`;
        targetElement.appendChild(damageElement);
        setTimeout(() => {
            damageElement.remove();
        }, 2000);
    }
};

const nextPlayerTurn = () => {
    if (gameOver) return;

    const currentPlayerCard = playerCanvas.children[playerCardTurnNumber].children[0];
    currentPlayerCard.classList.remove("turn");
    playerCardTurnNumber = (playerCardTurnNumber + 1) % Object.keys(curPlayers).length;
    if (curPlayers[playerCardTurnNumber].isAlive) {
        game();
    } else {
        nextPlayerTurn();
    }
};

const getWeakestPlayerCard = () => {
    let weakestCardIndex = null;
    let lowestHp = Infinity;

    Object.keys(curPlayers).forEach(index => {
        const card = curPlayers[index];
        if (card.isAlive && card.hp < lowestHp) {
            lowestHp = card.hp;
            weakestCardIndex = index;
        }
    });

    return weakestCardIndex;
};

const getAliveComputerCard = () => {
    return Object.keys(curEnemies).find(index => curEnemies[index].isAlive);
};

const checkGameOver = () => {
    const playerAlive = Object.values(curPlayers).some(card => card.isAlive);
    const enemyAlive = Object.values(curEnemies).some(card => card.isAlive);

    if (!playerAlive || !enemyAlive) {
        gameOver = true;

        if (!playerAlive) {
            displayModal("Вы проиграли!", 2000, () => {
                sendResultToTelegram("lose", "lose");
                setTimeout(closeWebApp, 1000);
            });
        } else if (!enemyAlive) {
            displayModal("Вы выиграли!", 2000, () => {
                sendResultToTelegram(enemyList, info);
                setTimeout(closeWebApp, 1000);
            });
        }
    }
};

const swordAnim = (card_id) => {
    enemyCanvas.children[card_id].children[1].classList.remove("disabled");
    setTimeout(() => {
        enemyCanvas.children[card_id].children[1].classList.add("disabled");
    }, 2000);
};

const longAnim = (card_id) => {
    enemyCanvas.children[card_id].children[2].classList.remove("disabled");
    setTimeout(() => {
        enemyCanvas.children[card_id].children[2].classList.add("disabled");
    }, 1000);
    enemyCanvas.children[card_id].children[3].classList.remove("disabled");
    setTimeout(() => {
        enemyCanvas.children[card_id].children[3].classList.add("disabled");
    }, 1000);
};

const magicAnim = (card_id) => {
    enemyCanvas.children[card_id].classList.add("magicAttack");
    setTimeout(() => {
        enemyCanvas.children[card_id].classList.remove("magicAttack");
    }, 2000);
};

document.addEventListener("DOMContentLoaded", () => {
    displayModal("Бой начался!", 2000, () => {
        setTimeout(game, 500);
    });
    PlayerFieldRender();
    EnemyFieldRender();
});
