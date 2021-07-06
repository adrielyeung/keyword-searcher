# keyword-searcher
A JavaScript front end app to enable analysis of keywords in text.
Built with HTML (Bootstrap), CSS, and functionality provided by Javascript.

Demo site hosted on my personal site: https://keywordsearcher.adrieltheexplorer.com

## How to use
1. Clone the repository into a local directory.
2. For local runs, it is preferred to run using **Live Server** extension in Visual Studio Code, this prevents the CORS (cross origin request) error from happening.
<img src="https://github.com/adrielyeung/keyword-searcher/blob/main/images/LiveServer_Img.PNG" alt="Live Server" width="70%" height="70%">

## Description
The front end, ```index.html```, is divided into several sections:
<img src="https://github.com/adrielyeung/keyword-searcher/blob/main/images/KeywordSearcher_Page_Img.PNG" alt="Keyword Searcher Front End Top" width="100%" height="100%">

1. Title area - Title of the text
2. Content area - Main content
3. Search area - Custom keyword search in main content. Highlights keywords found and displays number of keywords found.
4. Sample area - Select any example text for quick study of functionalities.
5. Insert text area - Custom text analysis as provided by user.

Functionality is provided by ```SearchString.js``` file.

Note: The title is **not included** in the below analysis.

### Most used / least used words analysis
The words with the highest and lowest number of counts are displayed in the most and least used words boxes respectively.

Note that a list of stopwords (```config/stopwords.txt```), i.e. words which occur commonly in a lot of texts (e.g. 'a', 'the' etc.) are excluded from the analysis.
You may use the search box to perform searches for these words.

### Text analysis stats
Displays the character and word counts of the text.

<img src="https://github.com/adrielyeung/keyword-searcher/blob/main/images/KeywordSearcher_Bottom_Img.PNG" alt="Keyword Searcher Front End Bottom" width="100%" height="100%">

## Future developments
1. Whole word / partial word searching option
2. Case sensitive search
3. Search and replace
4. Load text from URL

## Credits
To the Coder Foundry for their fantastic tutorial which this project is based on (https://www.youtube.com/watch?v=KEvLAe_2jXo).
