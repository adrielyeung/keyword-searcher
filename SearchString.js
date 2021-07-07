// Load a text from disk
function loadText(filename, displayName) {
    // Load stop word list from config
    // Create a HTTP server request to load text
    // When text are uploaded, it is hosted on the server
    var xhrStopWord = new XMLHttpRequest();
    // Load stop word list from config
    var stopWordArray = [];
    var stopWordUrl = "config/stopwords.txt";

    resetUI(displayName);

    // Initialises the connection, asynchronous request
    // meaning screen is not frozen while execution
    xhrStopWord.open("GET", stopWordUrl, true);
    xhrStopWord.send();

    // On ready state change event, calling anonymous function
    // every time the request state changes
    xhrStopWord.onreadystatechange = function () {
        // Ready state 0 = unsent, 1 = opened,
        // 2 = header received, 3 = loading, 4 = done
        if (xhrStopWord.readyState === 4 && xhrStopWord.status === 200) {
            // Load response text as current text
            stopWordArray = xhrStopWord.responseText.split(/\s+/);
        }
    };

    setTimeout(function () {
        // Load text
        var currentText = "";
        var url = "text/" + filename;

        // Create a HTTP server request to load text
        // When text are uploaded, it is hosted on the server
        var xhr = new XMLHttpRequest();
        // Initialises the connection, asynchronous request
        // meaning screen is not frozen while execution
        xhr.open("GET", url, true);
        xhr.send();

        // On ready state change event, calling anonymous function
        // every time the request state changes
        xhr.onreadystatechange = function () {
            // Ready state 0 = unsent, 1 = opened,
            // 2 = header received, 3 = loading, 4 = done
            if (xhr.readyState === 4 && xhr.status === 200) {
                // Load response text as current text
                // FORMATTING: Remove line breaks and carriage returns
                // and replace with HTML <br> tag
                // ?: defines a non-capturing group, i.e. the LB and CR chars
                // are not separately returned in a list
                currentText = xhr.responseText;

                if (stopWordArray.length === 0) {
                    alert("Stop word list cannot be loaded. " +
                          "The most used words list will be affected.");
                }

                getDocStats(currentText, stopWordArray);

                currentText = currentText.replace(/(?:\r\n|\r|\n)/g, "<br>");

                document.getElementById("fileContent").innerHTML = currentText;

                // Scroll to top
                document.getElementById("fileContent").scrollTop = 0;
            }
        };

        setTimeout(setTextNotFound(), 1000);
    }, 1000);
}

// Load text from user input
function loadTextFromInput() {
    // Load stop word list from config
    // Create a HTTP server request to load text
    // When text are uploaded, it is hosted on the server
    var xhrStopWord = new XMLHttpRequest();

    // Load stop word list from config
    var stopWordArray = [];
    var stopWordUrl = "config/stopwords.txt";

    if (document.getElementById("userContent").value.trim().length > 0) {
        if (document.getElementById("userTitle").value.trim().length === 0) {
            resetUI("Your text");
        } else {
            resetUI(document.getElementById("userTitle").value);
        }

        // Initialises the connection, asynchronous request
        // meaning screen is not frozen while execution
        xhrStopWord.open("GET", stopWordUrl, true);
        xhrStopWord.send();

        // On ready state change event, calling anonymous function
        // every time the request state changes
        xhrStopWord.onreadystatechange = function () {
            // Ready state 0 = unsent, 1 = opened,
            // 2 = header received, 3 = loading, 4 = done
            if (xhrStopWord.readyState === 4 && xhrStopWord.status === 200) {
                // Load response text as current text
                stopWordArray = xhrStopWord.responseText.split(/\s+/);
            }
        };

        // Timeout - wait for stop word to populate before loading text
        setTimeout(function () {
            // Load text from textarea
            // FORMATTING: Remove line breaks and carriage returns
            // and replace with HTML <br> tag
            // ?: defines a non-capturing group, i.e. the LB and CR chars
            // are not separately returned in a list
            var currentText = document.getElementById("userContent").value;

            if (stopWordArray.length === 0) {
                alert("Stop word list cannot be loaded. " +
                "The most used words list will be affected.");
            }

            getDocStats(currentText, stopWordArray);

            currentText = currentText.replace(/(?:\r\n|\r|\n)/g, "<br>");

            document.getElementById("fileContent").innerHTML = currentText;

            // Scroll to top
            document.getElementById("fileContent").scrollTop = 0;

            setTimeout(setTextNotFound(), 1000);
        }, 1000);
    }
}

function resetUI(displayName) {
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchStat").innerHTML = "";
    document.getElementById("keyword").value = "";
    document.getElementById("fileContent").innerHTML = "Loading...";
    document.getElementById("mostUsed").innerHTML = "";
    document.getElementById("leastUsed").innerHTML = "";
    document.getElementById("docLength").innerHTML = "";
    document.getElementById("wordCount").innerHTML = "";
}

function setTextNotFound() {
    if (document.getElementById("fileContent").innerHTML === "Loading..." ||
        document.getElementById("fileContent").innerHTML.length === 0) {
        document.getElementById("fileContent").innerHTML = "Text not found";
    }
}

// Get the stats for the text
function getDocStats(fileContent, stopWordArray) {
    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");

    var text = fileContent.toLowerCase();
    // Matches any chars between spaces (a word)
    var wordArray = text.match(/\b\S+\b/g);
    var textWithoutLineBreaks = text.replace(/(?:\r\n|\r|\n)/g, "");

    // JavaScript object
    var wordDictionary = {};

    // Filter out stop words
    var useWordArray = filterStopWords(wordArray, stopWordArray);

    var wordList;
    var top5Words;
    var least5Words;

    // Count words in useWordArray (filtered)
    useWordArray.forEach(function (wordValue) {
        if (wordDictionary[wordValue] > 0) {
            wordDictionary[wordValue] += 1;
        } else {
            wordDictionary[wordValue] = 1;
        }
    });

    // Sort the array
    wordList = sortProperties(wordDictionary);

    // Return top 5 words
    top5Words = wordList.slice(0, 5);
    // Return least used 5 words
    least5Words = wordList.slice(-5);

    // Write the values to the page
    ULTemplate(top5Words, document.getElementById("mostUsed"));
    ULTemplate(least5Words, document.getElementById("leastUsed"));

    // Get document stats
    docLength.innerText = "Document Length : " + textWithoutLineBreaks.length
                        + " character(s)";
    wordCount.innerText = "Word Count : " + wordArray.length
                        + " word(s)";
}

function ULTemplate(items, element) {
    var rowTemplate = document.getElementById("template-ul-items");
    var templateHTML = rowTemplate.innerHTML;
    var resultsHTML = "";

    items.forEach((item) =>
        resultsHTML += templateHTML.replace("{{val}}", item[0] + " : "
                    + item[1] + " time(s)")
    );

    element.innerHTML = resultsHTML;
}

function sortProperties(object) {
    // First convert object to array
    var rtnArray = Object.entries(object);

    // Sort the array based on comparer function
    rtnArray.sort(function (first, second) {
        return second[1] - first[1];
    });

    return rtnArray;
}

function filterStopWords(wordArray, stopWordArray) {
    var stopObject = {};
    var outputArray = [];

    // Load stop words into object
    stopWordArray.forEach((stopWord) =>
        stopObject[stopWord.trim().toLowerCase()] = true
    );

    // Add words which are not "stopped" into output
    wordArray.forEach(function (word) {
            if (!stopObject[word.trim().toLowerCase()]) {
                outputArray.push(word.trim().toLowerCase());
            }
        }
    );

    return outputArray;
}

// Highlight the words in search
function performHighlight() {
    // Read keyword
    var keyword = document.getElementById("keyword").value;
    var display;
    var re;
    var replaceText;
    var bookContent;
    var newContent;
    var count;

    if (keyword.length > 0) {
        display = document.getElementById("fileContent");

        newContent = "";

        resetHighlight();

        // Auto generate regexp with option "gi" - global and insensitive
        re = new RegExp(keyword, "gi");
        // String format into $&
        replaceText = "<mark id='markme'>$&</mark>";
        bookContent = display.innerHTML;

        // Highlight the elements
        newContent = bookContent.replace(re, replaceText);


        // Display new content
        display.innerHTML = newContent;
        // Count number of highlighted
        count = document.querySelectorAll("mark").length;
        document.getElementById("searchStat").innerHTML = "Search for : "
            + keyword + "<br>Found matches : " + count + " time(s)";

        // Scroll to first match if there are matches
        if (count > 0) {
            document.getElementById("markme").scrollIntoView();
        }
    }
}

// Reset highlighted
function resetHighlight() {
    // Find all currently highlighted items
    // Look for tags named "mark", <mark></mark>
    var spans = document.querySelectorAll("mark");

    // Remove highlight mark for all currently highlighted
    // <mark id='highlight'>abc</mark> -> abc
    spans.forEach((span) =>
        span.outerHTML = span.innerHTML
    );

    document.getElementById("searchStat").innerHTML = "";
}