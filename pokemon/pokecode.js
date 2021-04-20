const pokeGrid = document.querySelector('.pokeGrid')
const loadButton = document.querySelector('.loadPokemon')
const fetchButton = document.querySelector('#fetchSelectedPokemon')
const newButton = document.querySelector('#newPokemon')

class Pokemon {
  constructor(name, height, weight, abilities, moves, types) {
    this.id = 900
    this.name = name
    this.height = height
    this.weight = weight
    this.abilities = abilities
    this.moves = moves
    this.types = types
  }
}

loadButton.addEventListener('click', () => loadPage())

newButton.addEventListener('click', () => {
  let pokeName = prompt('What is the name of your new Pokemon?')
  let pokeHeight = prompt('What is the height of your Pokemon?')
  let pokeWeight = prompt('Pokemon weight?')
  let newPokemon = new Pokemon(
    pokeName,
    pokeHeight,
    pokeWeight,
    ['eat', 'sleep'],
    ['study', 'game'],
    [
      {
        type: {
          name: 'normal',
        },
      },
    ],
  )
  populatePokeCard(newPokemon)
})

fetchButton.addEventListener('click', () => {
  let pokeNameOrId = prompt('Enter Pokemon ID or Name:').toLowerCase()
  console.log(pokeNameOrId)
  getAPIData(`https://pokeapi.co/api/v2/pokemon/${pokeNameOrId}`).then((data) =>
    populatePokeCard(data),
  )
})

async function getAPIData(url) {
  try {
    const response = await fetch(url) // try getting data from the API at the url
    const data = await response.json() // convert the response into JSON
    return data // return the data from the fuction to whoever called it
  } catch (error) {
    // must have been an error
    console.log(error)
  }
}

function loadPage() {
  getAPIData(`https://pokeapi.co/api/v2/pokemon?limit=150`).then(
    async (data) => {
      for (const singlePokemon of data.results) {
        await getAPIData(singlePokemon.url).then((pokeData) =>
          populatePokeCard(pokeData),
        )
      }
    },
  )
}

function populatePokeCard(singlePokemon) {
  // console.log(singlePokemon)
  let pokeScene = document.createElement('div')
  pokeScene.className = 'scene'
  let pokeCard = document.createElement('div')
  pokeCard.className = 'card'
  pokeCard.addEventListener('click', () => {
    pokeCard.classList.toggle('is-flipped')
  })
  pokeCard.appendChild(populateCardFront(singlePokemon))
  pokeCard.appendChild(populateCardBack(singlePokemon))
  pokeScene.appendChild(pokeCard)
  pokeGrid.appendChild(pokeScene)
}

function populateCardFront(pokemon) {
  console.log(pokemon)
  let pokeFront = document.createElement('div')
  pokeFront.className = 'card__face card__face--front'
  let frontLabel = document.createElement('p')
  frontLabel.textContent = pokemon.name
  let frontImage = document.createElement('img')
  frontImage.src = getImageFileName(pokemon)

  let pokeType1 = pokemon.types[0].type.name
  if (pokemon.types.length > 1) {
    let pokeType2 = pokemon.types[1].type.name
    pokeFront.style.setProperty(
      'background',
      `linear-gradient(${getPokeTypeColor(pokeType1)}, ${getPokeTypeColor(
        pokeType2,
      )})`,
    )
  } else {
    pokeFront.style.setProperty('background', getPokeTypeColor(pokeType1))
  }

  pokeFront.appendChild(frontLabel)
  pokeFront.appendChild(frontImage)
  return pokeFront
}

function populateCardBack(pokemon) {
  let pokeBack = document.createElement('div')
  pokeBack.className = 'card__face card__face--back'
  let backLabel = document.createElement('p')
  backLabel.textContent = `Moves: ${pokemon.moves.length}`
  pokeBack.appendChild(backLabel)

  pokemon.types.forEach((pokeType) => {
    let backType = document.createElement('p')
    backType.textContent = pokeType.type.name
    pokeBack.appendChild(backType)
  })
  return pokeBack
}

function getImageFileName(pokemon) {
  let pokeId
  if (pokemon.id < 10) pokeId = `00${pokemon.id}`
  if (pokemon.id > 9 && pokemon.id < 100) pokeId = `0${pokemon.id}`
  if (pokemon.id > 99 && pokemon.id < 810) pokeId = pokemon.id
  if (pokemon.id === 900) {
    return `images/pokeball.png`
  }
  return `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${pokeId}.png`
}

function getPokeTypeColor(pokeType) {
  let color
  switch (pokeType) {
    case 'grass':
      color = '#0F0'
      break
    case 'fire':
      color = '#F00'
      break
    case 'water':
      color = '#00F'
      break
    case 'bug':
      color = '#7fff00'
      break
    case 'normal':
      color = '#f5f5dc'
      break
    case 'flying':
      color = '#00ffff'
      break
    case 'poison':
      color = '#c300ff'
      break
    case 'electric':
      color = '#c8ff00'
      break
    default:
      color = '#777'
  }
  return color
}
