// attack, defense, magic, long_dist, intelligence, speed

import CardsData from "../store/cardsData.js";
import cardsData from "../store/cardsData.js";

class Card {
    constructor(id, card_name, img, stats) {
        this.canvas = canvas
        this.id = id
        this.card_name = card_name
        this.img = img
        this.stats = stats
    }

    render() {
        return (
            `<img alt=${this.card_name} src={this.img}></img>`
        )
    }
}

const enemyList = [1, 2, 3]
const allyList = [4, 5, 6]
const canvas = document.getElementById("canvas")
const playerCanvas = document.getElementById("player--canvas")
const enemyCanvas = document.getElementById("enemy--canvas")
const PlayerFieldRender = () => {
    const firstCard = document.getElementById("player--card1")
    const secondCard = document.getElementById("player--card2")
    const thirdCard = document.getElementById("player--card3")

    firstCard.children[0].setAttribute("src", CardsData[allyList[0]].img)
    secondCard.children[0].setAttribute("src", CardsData[allyList[1]].img)
    thirdCard.children[0].setAttribute("src", CardsData[allyList[2]].img)


}
const EnemyFieldRender = () => {
    const firstCard = document.getElementById("enemy--card1")
    const secondCard = document.getElementById("enemy--card2")
    const thirdCard = document.getElementById("enemy--card3")

    firstCard.children[0].setAttribute("src", CardsData[enemyList[0]].img)

    secondCard.children[0].setAttribute("src", CardsData[enemyList[1]].img)

    thirdCard.children[0].setAttribute("src", CardsData[enemyList[2]].img)


}
const renderModal = (text) => {
    const modal = document.getElementById("modal")
    modal.children[0].textContent = text
}
const displayModal = (text, timing) => {
    renderModal(text)
    showModal()
    setTimeout(closeModal, timing)
}
const showModal = () => {
    const modal = document.getElementById("modal")
    modal.classList.remove("disabled")
    modal.classList.remove("non_op")


}

const displayAttackModal = () => {

    showAttackModal()
    // setTimeout(closeAttackModal, timing)
}
const showAttackModal = () => {
    const modal = document.getElementById("attack_choose--modal")
    modal.classList.remove("disabled")
    modal.classList.remove("non_op")


}
const closeAttackModal = () => {
    const modal = document.getElementById("modal")
    modal.classList.add("non_op")
    setTimeout(() => {
        modal.classList.add("disabled")
    }, 1000)
}

const closeModal = () => {
    const modal = document.getElementById("attack_choose--modal")
    modal.classList.add("non_op")
    setTimeout(() => {
        modal.classList.add("disabled")
    }, 1000)
}
const turn = "player"
const playerCardTurnNumber = 0
const curEnemies = {
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
}
const curPlayers = {
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
}
const turnChooseEnemy = () => {
    for (const card of enemyCanvas.children) {
        card.classList.add("cardHover")
        card.addEventListener("click", () => {
            let card_id = card.getAttribute("card_id")
            displayAttackModal()
            // alert(cardsData[enemyList[card_id]].name)
        })
    }

}

const game = () => {
    if (turn === "player") {
        playerCanvas.children[playerCardTurnNumber].children[0].classList.add("turn")
        displayModal(`Ходит ${curPlayers[playerCardTurnNumber].name}`, 2000)
        turnChooseEnemy()
    }
}
document.addEventListener("DOMContentLoaded", () => {

    displayModal("Бой начался!", 2000)
    setTimeout(game, 3500)
    PlayerFieldRender()
    EnemyFieldRender()
});