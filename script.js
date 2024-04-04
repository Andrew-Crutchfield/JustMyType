$(document).ready(function() {
    // Toggle between lowercase and uppercase keyboards
    $('.keyboard').show();
    $('.upkeyboard').hide();

    // Variable to track whether physical shift key is pressed
    var shiftKeyPressed = false;

    // Track if the real Shift key is pressed
    var realShiftDown = false;

    // Function to toggle keyboards
    function toggleKeyboards() {
        $('.keyboard').toggle(!realShiftDown);
        $('.upkeyboard').toggle(realShiftDown);
    }

    // Toggle between lowercase and uppercase keyboards when physical shift key is pressed
    $(document).on('keydown', function(event) {
        if (event.key === 'Shift') {
            realShiftDown = true;
            toggleKeyboards();
        }
    });

    $(document).on('keyup', function(event) {
        if (event.key === 'Shift') {
            realShiftDown = false;
            toggleKeyboards();
        }
    });

    // Allow typing even when Shift is down
    $(document).on('keydown', function(event) {
        // Handling character input
        if (!realShiftDown && event.key.length === 1 && event.key !== 'Shift') {
            let key = shiftKeyPressed ? event.key.toUpperCase() : event.key.toLowerCase();
            updateFeedback(key);
            if (sentenceIndex === sentences.length - 1 && letterIndex === sentences[sentenceIndex].length - 1) {
                updateWPM();
            }
            letterIndex++;
            if (letterIndex === sentences[sentenceIndex].length) {
                sentenceIndex++;
                letterIndex = 0;
                if (sentenceIndex < sentences.length) {
                    updateSentence();
                    $('#feedback').empty();
                }
            }
        }
    });

    // Typing game logic
    var sentences = [
        'ten ate neite ate nee enet ite ate inet ent eate', 
        'Too ato too nOt enot one totA not anot tOO aNot', 
        'oat itain oat tain nate eate tea anne inant nean', 
        'itant eate anot eat nato inate eat anot tain eat', 
        'nee ene ate ite tent tiet ent ine ene ete ene ate'
    ];
    var sentenceIndex = 0;
    var letterIndex = 0;
    var mistakes = 0;
    var startTime, endTime;

    function updateSentence() {
        $('#sentence').text(sentences[sentenceIndex]);
        $('#target-letter').text(sentences[sentenceIndex][letterIndex]);
    }

    function updateFeedback(key) {
        if (key === sentences[sentenceIndex][letterIndex]) {
            $('#feedback').append('<span class="text-success">&#10004;</span>');
        } else {
            $('#feedback').append('<span class="text-danger">&#10008;</span>');
            mistakes++;
        }
    }

    function updateWPM() {
        endTime = new Date();
        var elapsedTime = (endTime - startTime) / 1000 / 60; // in minutes
        var numberOfWords = sentences.join(' ').split(' ').length;
        var wpm = Math.round(numberOfWords / elapsedTime - 2 * mistakes);
        $('#wpm').text('Words per minute: ' + wpm);
    }

    function resetGame() {
        sentenceIndex = 0;
        letterIndex = 0;
        mistakes = 0;
        $('#feedback').empty();
        updateSentence();
        $('#wpm').empty();
    }

    updateSentence();

    $('#reset').on('click', function() {
        resetGame();
        startTime = new Date();
    });

    $(".upkey").on("click", function(e) {
        var newLetter = $(e.target).text();
        var previousText = $(".textContainer").text();
        $(".textContainer").text(previousText + newLetter);
    });

    $(".key").on("click", function(e) {
        // If the real Shift key is down, directly append the clicked key's text
        if (realShiftDown) {
            var newLetter = $(e.target).text().toUpperCase();
        } else {
            var newLetter = $(e.target).text();
        }
        var previousText = $(".textContainer").text();
        $(".textContainer").text(previousText + newLetter);
    });

    $(".shift").on("click", function(event) {
        shiftKeyPressed = !shiftKeyPressed;
        return false; // Prevent default action and stop further processing
    });
});
