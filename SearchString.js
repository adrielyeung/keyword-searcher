// Load sample text
function loadText(filename, displayName) {
    // Load stop word list from config
    // Create a HTTP server request to load text
    // When text are uploaded, it is hosted on the server
    var xhrStopWord = new XMLHttpRequest();
    // Load stop word list from config
    var stopWordArray = [];
    var stopWordUrl = "config/stopwords.txt";

    resetUI("Sample text : " + displayName);

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
                setFileContent(xhr.responseText, stopWordArray);
            }
        };

        setTimeout(setTextNotFound(), 1000);
    }, 1000);
}

// Load text from user input
function loadTextFromInput() {
    var xhrStopWord = new XMLHttpRequest();
    var stopWordArray = [];
    var stopWordUrl = "config/stopwords.txt";

    if (document.getElementById("userContent").value.trim().length > 0) {
        if (document.getElementById("userTitle").value.trim().length === 0) {
            resetUI("Your text");
        } else {
            resetUI("Your text : " + document.getElementById("userTitle").value);
        }

        xhrStopWord.open("GET", stopWordUrl, true);
        xhrStopWord.send();

        xhrStopWord.onreadystatechange = function () {
            if (xhrStopWord.readyState === 4 && xhrStopWord.status === 200) {
                stopWordArray = xhrStopWord.responseText.split(/\s+/);
            }
        };

        setTimeout(function () {
            // Load text from textarea
            setFileContent(document.getElementById("userContent").value, stopWordArray);
        }, 1000);
    }
}

// Load text from URL
function loadTextFromHtml() {
    var userUrl = document.getElementById("userUrl").value;
    var allDivs;
    var htmlText = "";
    var titleText = "Site content";

    var xhrStopWord = new XMLHttpRequest();
    var stopWordArray = [];
    var stopWordUrl = "config/stopwords.txt";

    if (typeof userUrl !== "undefined" && userUrl.trim().length > 0) {
        xhrStopWord.open("GET", stopWordUrl, true);
        xhrStopWord.send();

        xhrStopWord.onreadystatechange = function () {
            if (xhrStopWord.readyState === 4 && xhrStopWord.status === 200) {
                stopWordArray = xhrStopWord.responseText.split(/\s+/);
            }
        };

        setTimeout(function () {
            // Use jQuery to extract site content
            $(document).ready(function () {
                $("#fileContent").load(userUrl, function () {
                    // After loading complete, extract text within all divs in fileContent
                    allDivs = document.getElementById("fileContent")
                        .getElementsByTagName('div');
                    titleText += " : " + document.getElementById("fileContent")
                        .getElementsByTagName('title')[0].innerHTML;
                    
                    for (var i = 0; i < allDivs.length; i++) {
                        htmlText += allDivs[i].innerText;
                    }
                    
                    resetUI(titleText);

                    setFileContent(htmlText, stopWordArray);
                });
            });
        }, 1000);
    }
}

// Load text from uploaded file
function loadTextFromFile() {
    // A file list is used, but the input element does not allow multiple inputs,
    // so max 1 file in this list
    var fileList = document.getElementById("userFile").files;
    var file;
    var filePath = document.getElementById("userFile").value;
    var filePathSplit = filePath.split("\\");
    var fileReader = new FileReader();
    var allowedExtensions = /(\.txt)$/i;

    var xhrStopWord = new XMLHttpRequest();
    var stopWordArray = [];
    var stopWordUrl = "config/stopwords.txt";

    if (typeof fileList !== "undefined" && fileList.length > 0) {
        file = fileList[0];
        if (!allowedExtensions.exec(filePath)) {
            alert("Only .txt files are allowed.");
            document.getElementById("userFile").value = "";
            return;
        }
        fileReader.onload = function(e) {
            $('#fileContent').html(e.target.result);
        };
    
        fileReader.readAsText(file);

        if (document.getElementById("userFileTitle").value.trim().length === 0) {
            // If user did not provide title,
            // use file name (the last part of file path splitted)
            resetUI("Upload file : " +
                filePathSplit[filePathSplit.length - 1]);
        } else {
            resetUI("Upload file : " +
                document.getElementById("userFileTitle").value);
        }

        xhrStopWord.open("GET", stopWordUrl, true);
        xhrStopWord.send();

        xhrStopWord.onreadystatechange = function () {
            if (xhrStopWord.readyState === 4 && xhrStopWord.status === 200) {
                stopWordArray = xhrStopWord.responseText.split(/\s+/);
            }
        };

        setTimeout(function () {
            setFileContent(document.getElementById("fileContent").innerHTML,
                stopWordArray);
        }, 1000);
    }
}

function setFileContent(currentText, stopWordArray) {
    getDocStats(currentText, stopWordArray);

    // FORMATTING: Remove line breaks and carriage returns
    // and replace with HTML <br/> tag
    // ?: defines a non-capturing group, i.e. the LB and CR chars
    // are not separately returned in a list
    currentText = currentText.replace(/(?:\r\n|\r|\n)/g, "<br/>");

    document.getElementById("fileContent").innerHTML = currentText;

    // Scroll to top
    document.getElementById("fileContent").scrollTop = 0;

    setTimeout(setTextNotFound(), 1000);

    enableSearchAndSave();
}

// Enable search, save file functions
function enableSearchAndSave() {
    document.getElementById("keyword").disabled = false;
    document.getElementById("performHighlight").disabled = false;
    document.getElementById("resetHighlight").disabled = false;
    document.getElementById("fileNameSave").disabled = false;
    document.getElementById("saveFile").disabled = false;
}

function resetUI(displayName) {
    resetSearchStat();
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("keyword").value = "";
    document.getElementById("fileContent").innerHTML = "Loading...";
    document.getElementById("mostUsed").innerHTML = "";
    document.getElementById("leastUsed").innerHTML = "";
    document.getElementById("docLength").innerHTML = "";
    document.getElementById("wordCount").innerHTML = "";
}

function resetSearchStat() {
    document.getElementById("searchStatSearch").innerHTML =
        "<strong id=\"searchStatSearchWord\"></strong>";
    document.getElementById("searchStatFound").innerHTML = "";
    document.getElementById("searchStatReplace").innerHTML =
        "<strong id=\"searchStatReplaceWord\"></strong>";
}

function setTextNotFound() {
    if (document.getElementById("fileContent").innerHTML === "Loading..." ||
        document.getElementById("fileContent").innerHTML.length === 0) {
        document.getElementById("fileContent").innerHTML = "Text not found";
    }
}

// Get the stats for the text
function getDocStats(fileContent, stopWordArray) {
    if (stopWordArray.length === 0) {
        alert("Stop word list cannot be loaded. " +
        "The most used words list will be affected.");
    }

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
    docLength.innerText = "Document Length : "
        + textWithoutLineBreaks.length + " character(s)";
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
        document.getElementById("searchStatSearch").innerHTML = "Search for : " + 
            "<strong id=\"searchStatSearchWord\">" + keyword + "</strong>";
        document.getElementById("searchStatFound").innerHTML = "Found matches : "
            + count + " time(s)";

        // Scroll to first match, and enable replace if there are matches
        if (count > 0) {
            document.getElementById("markme").scrollIntoView();
            toggleReplaceDisabled(false);
        }

        document.getElementById("resetReplace").disabled = true;
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

    resetSearchStat();
    toggleReplaceDisabled(true);
    document.getElementById("resetReplace").disabled = true;
}

function toggleReplaceDisabled(disabledBool) {
    document.getElementById("replaceWord").disabled = disabledBool;
    document.getElementById("replaceHighlight").disabled = disabledBool;
}

// Replace selected text with replaceWord
function replaceHighlight() {
    var replaceWord = document.getElementById("replaceWord").value;
    var spans = document.querySelectorAll("mark");

    var xhrStopWord = new XMLHttpRequest();
    var stopWordArray = [];
    var stopWordUrl = "config/stopwords.txt";

    // Replace all highlighted with replaceWord
    spans.forEach((span) =>
        span.innerHTML = replaceWord
    );

    document.getElementById("searchStatReplace").innerHTML =
        "Replaced with : <strong id=\"searchStatReplaceWord\">"
        + replaceWord + "</strong>";

    toggleReplaceDisabled(true);
    document.getElementById("resetReplace").disabled = false;

    // Reload doc stats after replacement
    xhrStopWord.open("GET", stopWordUrl, true);
    xhrStopWord.send();

    xhrStopWord.onreadystatechange = function () {
        if (xhrStopWord.readyState === 4 && xhrStopWord.status === 200) {
            stopWordArray = xhrStopWord.responseText.split(/\s+/);
            getDocStats(stripTags(document.getElementById("fileContent").innerHTML),
                stopWordArray);
        }
    };
}

// Reset replace text
function resetReplace() {
    var searchWord = document.getElementById("searchStatSearchWord").innerHTML;
    var spans = document.querySelectorAll("mark");

    var xhrStopWord = new XMLHttpRequest();
    var stopWordArray = [];
    var stopWordUrl = "config/stopwords.txt";

    // Replace all highlighted with searchWord
    spans.forEach((span) =>
        span.innerHTML = searchWord
    );

    document.getElementById("searchStatReplace").innerHTML =
        "<strong id=\"searchStatReplaceWord\"></strong>";
    
    toggleReplaceDisabled(false);
    document.getElementById("resetReplace").disabled = true;

    // Reload doc stats after replacement
    xhrStopWord.open("GET", stopWordUrl, true);
    xhrStopWord.send();

    xhrStopWord.onreadystatechange = function () {
        if (xhrStopWord.readyState === 4 && xhrStopWord.status === 200) {
            stopWordArray = xhrStopWord.responseText.split(/\s+/);
            getDocStats(stripTags(document.getElementById("fileContent").innerHTML),
                stopWordArray);
        }
    };
}

// Save as file
function saveFile() {
    var text = stripTags(document.getElementById("fileContent").innerHTML.trim());
    var textBlob = new Blob([text], {
        type: 'text/plain'
    });
    var textUrl = window.URL.createObjectURL(textBlob);
    var fileNameSave = document.getElementById("fileNameSave").value;

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameSave;
    downloadLink.innerHTML = "Download File";
    downloadLink.href = textUrl;
    downloadLink.onclick = destroyClickedElement;
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
}

function stripTags(text) {
    // Replace line breaks as newline
    text = text.replace(/<br\s*[\/]?>/g, "\n");

    // Strip all other inner tags
    text = text.replace(
        /<[\/]?\w+\s*(\w+\s*=\s*[\'\"\w]+\s*)*>|<\w+\s*(\w+\s*=\s*[\'\"\w]+\s*)*[\/]?>/g,
        "");
    return text;
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

// Unlock load text from HTML
function unlockHtml() {
    document.getElementById("userUrl").disabled = false;
    document.getElementById("userUrlButton").disabled = false;
}
