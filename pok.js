 // Player setup
  const player = 'Red'
  // var playerID = 25
  const playerLevel = 5
  const playerPokemon = {
    'name': 'Pikachu',
    'hp': 35,
    'atk': 70,
    'def': 30
  }
  const hpPlayerTotal = playerPokemon.hp
  let hpPlayer = hpPlayerTotal
  // var playerBaseAttack = playerPokemon.atk
  // var playerBaseDefense = playerPokemon.def
  $('.player .level').text(playerLevel)
  $('.player .hp').text(hpPlayerTotal)
  $('.player .hpTotal').text(hpPlayerTotal)
  $('.player .name').text(playerPokemon.name.toUpperCase())
  $('#move0').html('TACKLE')
  $('#move1').html('TAIL WHIP')
  $('#move2').html('-')

  // Foe setup
  const foe = 'Blue'
  // var foeID = 133
  const foePokemon = {
    'name': 'Eevee',
    'hp': 40,
    'atk': 55,
    'def': 50
  }
  const hpFoeFull = foePokemon.hp
  let hpFoe = hpFoeFull
  // var foeBaseAttack = foePokemon.atk
  let foeBaseDefense = foePokemon.def
  $('.foe .level').text(playerLevel)
  $('.foe .name').text(foePokemon.name.toUpperCase())

  // Hide all menus except dialog
  const hider = () => {
    $('.window.menu').hide()
    $('.window.item').hide()
    $('.window.pkmn').hide()
    $('.window.fight').hide()
  }

  // Reset to battle ready mode for turn or cancel
  const reset = () => {
    $('.text1').text('')
    $('.text2').text('')
    $('.window.item').hide()
    $('.window.pkmn').hide()
    $('.window.fight').hide()
    $('.window.menu').show()
  }

  // Health bar width calculation and health numbers
  const healthbar = (current, total) => {
    const hpCurrent = current
    const hpTotal = total
    const percentTotal = 100
    const percentCurrent = hpCurrent * percentTotal / hpTotal
    return percentCurrent
  }

