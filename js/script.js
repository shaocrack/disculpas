// Mensajes de disculpa
const mensajes = [
    "Sé que he cometido un error y quiero disculparme de todo corazón.",
    "Eres una persona muy especial y no quiero que nuestro vínculo se dañe.",
    "Valoro mucho nuestra amistad y quiero hacer lo posible por arreglarlo.",
    "Me arrepiento sinceramente y quiero que me des una oportunidad.",
    "Eres muy importante para mí y quiero que me perdones.",
    "Prometo ser mejor y no volver a cometer el mismo error.",
    "Tu amistad significa mucho para mí y quiero conservarla.",
    "Sé que puedo contar contigo y quiero que confíes en mí de nuevo."
];

let mensajeActual = 0;
let score = 0;
let cards = [];
let flippedCards = [];
let matchedPairs = 0;

// Elementos del DOM
const heartElement = document.getElementById('heart');
const gameElement = document.getElementById('game');
const gameArea = document.getElementById('gameArea');
const scoreElement = document.getElementById('score');
const messageElement = document.querySelector('.message');
const backgroundMusic = document.getElementById('backgroundMusic');
const startButton = document.getElementById('startButton');

// Reproducir música de fondo
window.addEventListener('load', () => {
    backgroundMusic.play().catch(error => {
        console.log("La reproducción automática fue bloqueada");
    });
});

// Iniciar cuando se hace clic en el botón
startButton.addEventListener('click', () => {
    startButton.classList.add('hidden');
    startSequence();
});

// Secuencia automática
function startSequence() {
    // Mostrar mensajes
    let messageInterval = setInterval(() => {
        messageElement.classList.add('fade');
        setTimeout(() => {
            mensajeActual = (mensajeActual + 1) % mensajes.length;
            messageElement.textContent = mensajes[mensajeActual];
            messageElement.classList.remove('fade');
        }, 500);
    }, 3000);

    // Después de mostrar todos los mensajes, mostrar el corazón
    setTimeout(() => {
        clearInterval(messageInterval);
        messageElement.classList.add('fade');
        setTimeout(() => {
            messageElement.style.display = 'none';
            heartElement.classList.remove('hidden');
            
            // Después de mostrar el corazón, iniciar el juego
            setTimeout(() => {
                heartElement.classList.add('hidden');
                gameElement.classList.remove('hidden');
                startMemoryGame();
            }, 3000);
        }, 500);
    }, mensajes.length * 3000);
}

// Lógica del juego de memoria
function startMemoryGame() {
    score = 0;
    matchedPairs = 0;
    scoreElement.textContent = score;
    gameArea.innerHTML = '';
    cards = [];
    flippedCards = [];
    
    // Crear pares de cartas con el mismo emoji (solo 4 cartas - 2 pares)
    const emoji = '❤️';
    const cardValues = Array(4).fill(emoji); // 2 pares
    shuffleArray(cardValues);
    
    // Crear el tablero
    cardValues.forEach((value, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.value = value;
        card.dataset.index = index;
        card.innerHTML = '<div class="card-inner"><div class="card-front">❓</div><div class="card-back">' + value + '</div></div>';
        card.addEventListener('click', flipCard);
        gameArea.appendChild(card);
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function flipCard() {
    if (flippedCards.length === 2) return;
    if (this.classList.contains('flipped')) return;
    
    this.classList.add('flipped');
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
        setTimeout(checkMatch, 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.value === card2.dataset.value;
    
    if (match) {
        matchedPairs++;
        score += 20;
        scoreElement.textContent = score;
        
        if (matchedPairs === 2) {
            setTimeout(() => {
                const finalMessage = document.createElement('div');
                finalMessage.className = 'final-message';
                finalMessage.innerHTML = `
                    <h2>¡Felicidades!</h2>
                    <p>Has completado el juego de memoria y sabes....</p>
                    <p class="hug-message">¿Me regalarias un abrazo? 🤗</p>
                `;
                document.body.appendChild(finalMessage);
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 1000);
    }
    
    // Limpiar las cartas volteadas después de cada intento
    flippedCards = [];
}

// Añadir estilos para el juego de memoria y el mensaje final
const style = document.createElement('style');
style.textContent = `
    .memory-card {
        width: 80px;
        height: 80px;
        margin: 5px;
        perspective: 1000px;
        cursor: pointer;
        display: inline-block;
    }

    .card-inner {
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        transition: transform 0.6s;
        transform-style: preserve-3d;
    }

    .memory-card.flipped .card-inner {
        transform: rotateY(180deg);
    }

    .card-front, .card-back {
        position: absolute;
        width: 100%;
        height: 100%;
        backface-visibility: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 2em;
        border-radius: 10px;
        background: white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    .card-back {
        transform: rotateY(180deg);
        background: #ff4b4b;
        color: white;
    }

    #gameArea {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
        padding: 20px;
    }

    .final-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(255, 255, 255, 0.95);
        padding: 30px;
        border-radius: 20px;
        text-align: center;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: fadeIn 0.5s ease-in-out;
    }

    .hug-message {
        font-size: 1.5em;
        color: #ff4b4b;
        margin-top: 20px;
        font-family: 'Dancing Script', cursive;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -60%); }
        to { opacity: 1; transform: translate(-50%, -50%); }
    }
`;
document.head.appendChild(style); 