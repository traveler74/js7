const words = [
    {question: 'Кто мяукает?', answer: 'кошка'},
    {question: 'Кто пищит?', answer: 'мышка'},
    {question: 'Кто гавкает?', answer: 'собака'},
    {question: 'Кто мычит?', answer: 'корова'},
    {question: 'Кто крякает?', answer: 'утка'},
    {question: 'Кто воет?', answer: 'волк'},
    {question: 'Кто поёт по утрам?', answer: 'петух'},
    {question: 'Кто каркает?', answer: 'ворона'},
    {question: 'Кто квакает?', answer: 'лягушка'},
    {question: 'Кто жужжит?', answer: 'пчела'}
]

let word = []
let questNum = 0
let secret = []
let scores = 0
let moveScores = 0
let errors = 0

let currentSector = 0
let currentDeg = 0

const sectors = [0,300,100,750,800,150,850,350,900,450,500,100,250,50,950,100]

const giftPrice = [200, 400, 500]
const prizePrice = [1000, 2000, 3000]

$(document).ready(start)

// подготовка игры
function start() {
    questNum = Math.floor(Math.random()*words.length)
    word = words[questNum].answer.toUpperCase().split('')
    for (i in word) {
        secret.push('*')
    }
    $('#question').text(words[questNum].question)
    $('#word').text(secret.join(' '))
    nextMove()
    $('#hatOnHost, #piculesOnHost, #glassesOnHost, #prizes button, #prizesWrap h2')
            .prop('hidden', true)
}

// крутим колесо
// wheelWrap img
function spinWheel() {
    let randSector = Math.floor(Math.random()*16+1)
    currentSector += randSector
    console.log(currentSector)
    if (currentSector > 16) {
        currentSector = currentSector % 16
    }
    console.log(currentSector)
    let randDeg = randSector*22.5
    currentDeg += randDeg
    console.log(currentDeg, randDeg)
    if ($('#spin').classList !== 'spinWheel') {

        document.documentElement.style.setProperty('--spinDeg', randDeg+360 + 'deg');
        // document.documentElement.style.setProperty('--currentDeg', randDeg);
        $('#spin').addClass('spinWheel')
    }
    setTimeout(function (){
        $('#spin').removeClass('spinWheel')
        // moveScores = Math.floor(Math.random()*15+1)*50
        moveScores = sectors[currentSector-1]
        document.documentElement.style.setProperty('--currentDeg', currentDeg + 'deg');
        // console.log(randSector, randDeg)
        makeGuess()
    },1400)
}

// угадываем букву
function guess() {
    let letter = $('#guessLetter').val().toUpperCase()
    if (word.indexOf(letter) == -1) {
        errors += 1
        if (errors > 2) {
            fail()
            return
        }
    }
    if (secret.indexOf(letter) == -1) {
        for (w in word) {
            if (letter == word[w]) {
                secret[w] = letter
                scores += moveScores
                $('#scores').text('У вас ' + scores + ' очков')
            }
        }
    } else {
            $('#moveScores').text('Такая буква уже есть. Назовите другую')
            return
    }
    $('#word').text(secret.join(' '))
    nextMove()
    check()
}

// проверяем слово
function check() {
    if (secret.indexOf('*') == -1) {
        $('#moveScores').text('Вы победили! Забирайте призы. Для новой игры обновите страницу')
        $('#guessLetter, #submitLetter, #guessWord, #submitWord')
            .prop('disabled', true)
        $('#spin').prop('disabled', true)
        $('#prizes button, #prizesWrap h2')
            .prop('hidden', false)
    }
}

//проигрыш
function fail() {
    $('#moveScores').text('Вы проиграли. Для новой игры обновите страницу')
    $('#guessLetter, #submitLetter, #guessWord, #submitWord')
            .prop('disabled', true)
        $('#spin').prop('disabled', true)
}

// подготовка к следующему ходу
function nextMove() {

    if (word.indexOf($('#guessLetter').val().toUpperCase()) != -1) {
        $('#moveScores').text('Крутите барабан')
    } else if (!errors){$('#moveScores').text('Крутите барабан')}
        else {$('#moveScores').text('Нет такой буквы. Осталось попыток: '
            + (3 - errors) + '. Крутите барабан')}

    $('#guessLetter, #submitLetter, #guessWord, #submitWord')
        .prop('disabled', true)
    $('#spin').prop('disabled', false)
    $('#guessLetter').val('')
    $('#guessWord').val('')
}

// подготовка к следующему угадыванию
function makeGuess() {
    $('#guessLetter, #submitLetter, #guessWord, #submitWord')
            .prop('disabled', false)
    $('#spin').prop('disabled', true)
    $('#moveScores').text('На барабане ' + moveScores + ' очков. Назовите букву')
}

// подарить ведущему подарок
function makeGift(number) {
    if (scores >= giftPrice[number]) {
        scores -= giftPrice[number]
        $('#scores').text('У вас ' + scores + ' очков')
        switch (number) {
            case 0: $('#hatOnHost').prop('hidden', false);
                    $('#hat img, #hat p').prop('hidden', true);
                    break;
            case 1: $('#piculesOnHost').prop('hidden', false);
                    $('#picules img, #picules p').prop('hidden', true);
                    break;
            case 2: $('#glassesOnHost').prop('hidden', false);
                    $('#glasses img, #glasses p').prop('hidden', true);
                    break;
        }
    }
}


//забрать призы
function getPrize(number) {
    if (scores >= prizePrice[number]) {
        scores -= prizePrice[number]
        $('#scores').text('У вас ' + scores + ' очков')
        switch (number) {
            case 0: $('#banana img, #banana p').prop('hidden', true);
                    break;
            case 1: $('#tv img, #tv p').prop('hidden', true);
                    break;
            case 2: $('#car img, #car p').prop('hidden', true);
                    break;
        }
    }
}


$('#spin').click(spinWheel)
$('#submitLetter').click(guess)

$('#hat').click(function (){makeGift(0)})
$('#picules').click(function (){makeGift(1)})
$('#glasses').click(function (){makeGift(2)})

$('#banana').click(function (){getPrize(0)})
$('#tv').click(function (){getPrize(1)})
$('#car').click(function (){getPrize(2)})
