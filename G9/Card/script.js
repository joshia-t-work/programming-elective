let cards = document.querySelectorAll('.cards');
// generate cards

let cardData = [{
    id: 0,
    cardName: 'Bandit',
    imageUrl: 'https://palocoyeetusdez.github.io/My-Trading-card-Character/images/images.JPG',
    badge: 'Legendary ; Assasin',
    stats: [
        'Dash Damage: 565; Hit damage: 262',
        'Troop; Legendary; Arena:Rascal\'s hideout',
        'Dash one time from afar dealing 565 damage then starts hitting for 262 damage'
    ],
    author: "Ben Timothy Santoso",
    url: "https://palocoyeetusdez.github.io/My-Trading-card-Character/"
}, {
    id: 1,
    cardName: 'Skeleton',
    imageUrl: 'https://freepngimg.com/thumb/clash_of_clans/93511-skeleton-clash-of-figurine-royale-clans-android.png',
    badge: 'Common',
    stats: [
        'Health: 81',
        'Damage: 81',
        'Spawns 3 skeleton',
    ],
    author: "Benjamin Anderson Widjaja",
    url: "https://joselover.github.io/Programming-Trading-Card/"
}, {
    id: 2,
    cardName: 'Mega Knight',
    imageUrl: 'https://deasud3313131.github.io/Project1/images/Megaknight.jpg',
    badge: 'Heavy Tank',
    stats: [
        '1900hp',
        '560attack',
        'Jump on too enemy'
    ],
    author: "Bradley Ryuga",
    url: "https://deasud3313131.github.io/Project1/"
}, {
    id: 3,
    cardName: 'Pekka',
    imageUrl: 'https://derrikkkkkkkkkk.github.io/Pekka/images/images%20(2).jpg',
    badge: 'Big tank',
    stats: [
        '100000damage',
        '7831HP',
        'Can heal from killing enemy'
    ],
    author: "Derrick Edgard Phan",
    url: "https://derrikkkkkkkkkk.github.io/Pekka/"
}, {
    id: 4,
    cardName: 'Lionel Messi',
    imageUrl: 'https://obama826.github.io/messi-card/images/messi.png',
    badge: 'CAM',
    stats: [
        'DRIBBLING: 99999999999999',
        'PACE: 99999999999999',
        'DEFENSE: 99999999999999',
        'SKILLS: 99999999999999',
        'Numero 10'
    ],
    author: "Ethan Roderick Wijaya",
    url: "https://obama826.github.io/messi-card/?authuser=0"
}, {
    id: 5,
    cardName: 'Chaizard',
    imageUrl: 'https://jaaronnn.github.io/Programinghomework/images/charizard_ex.jpg',
    badge: 'Big tank',
    stats: [
        'fire',
        'Fireball',
        'Can summon fireball and fire'
    ],
    author: "Jaaron Leonardo Irving",
    url: "https://jaaronnn.github.io/Programinghomework/"
}, {
    id: 6,
    cardName: 'Derrick Rose',
    imageUrl: 'https://kinn1818.github.io/task/images/derrick-rose1.jpg',
    badge: 'Point Guard',
    stats: [
        '99 Speed ',
        '99 Dunk ',
        'Explosive'
    ],
    author: "Keane Moreno Prajogo",
    url: "https://kinn1818.github.io/task/"
}, {
    id: 7,
    cardName: 'P.E.K.K.A',
    imageUrl: 'https://palocoyeetusde.github.io/My-Trading-Card/images/P.E.K.K.A.jpg',
    badge: 'Troop',
    stats: [
        'Level 15: Health: 5464 Damage: 1186 Damage per second: 658',
        'A heavily armored, slow melee fighter. Swings from the hip, but packs a huge punch.',
        'Evolution: Each kill heal his health by 3.5%-15% with overheal of 50% extra hitpoints'
    ],
    author: "Keanu Nathanael Halim",
    url: "https://palocoyeetusde.github.io/My-Trading-Card/?authuser=0"
}, {
    id: 8,
    cardName: 'evo_wizard',
    imageUrl: 'https://kenneth945.github.io/card_assignment/images/evo_wizard.jpg',
    badge: 'rare card',
    stats: [
        '5 elixir',
        'area damage',
        'throws fireball'
    ],
    author: "Kenneth Efraim Lukmana",
    url: "https://kenneth945.github.io/card_assignment/?authuser=0"
}, {
    id: 9,
    cardName: 'Log',
    imageUrl: 'https://tuffmangomustard67.github.io/cr-deck/images/maxresdefault.jpg',
    badge: 'Light Spell',
    stats: [
        '2 Elixir',
        'Area Damage',
        'Ground-targeting spell'
    ],
    author: "Shane Dylano Irawan",
    url: "https://tuffmangomustard67.github.io/cr-deck/?authuser=0"
}, {
    id: 10,
    cardName: 'Mega Knight',
    imageUrl: 'https://idktheuser2323.github.io/My-Trading-Card/images/MegaKnightCardEvolution.webp',
    badge: 'LEGENDARY',
    stats: [
        'A high-HP ground troop damage dealer',
        'Jumps over enemies and crush them',
        'Evolution allows him to knockback enemies per hit'
    ],
    author: "Vitrovio Marcoo Darewi",
    url: "https://idktheuser2323.github.io/My-Trading-Card/?authuser=0"
}]

for (let i = 0; i < cardData.length; i++) {
    cardData[i].statLi = ""
    for (let j = 0; j < cardData[i].stats.length; j++) {
        cardData[i].statLi += `<li>${cardData[i].stats[j]}</li>`;
    }
}

for (let i = 0; i < cardData.length; i++) {
    let currentCardData = cardData[i];
    let card = document.createElement('a');
    card.className = `card-${currentCardData.id}`;
    card.setAttribute('aria-label', 'Your trading card');
    card.setAttribute('href', currentCardData.url);
    card.innerHTML = `
    <div class="card" aria-label="Your trading card">
        <img src="${currentCardData.imageUrl}"
          alt="Your card image" />
        <div class="content">
          <h2 class="name">${currentCardData.cardName}</h2>
          <span class="badge">${currentCardData.badge}</span>
          <p class="author">By: ${currentCardData.author}</p>

          <!-- STEP 2: Add extra stats/info using a list or paragraphs -->
          <ul class="stats">
            ${currentCardData.statLi}
          </ul>
        </div>
    </div>`;
    cards[0].appendChild(card);
    console.log(card);
}