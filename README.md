# keyword-searcher
A JavaScript front end app to enable analysis of keywords in text.
Built with HTML (Bootstrap), CSS, and functionality provided by Javascript.

Demo site hosted on my personal site: https://keywordsearcher.adrieltheexplorer.com .

## What's new - 13/7/2021
1. Search and Replace
2. Save to .txt file
3. Load from .txt file
4. Load from URL (require cross origin request (CORS) permission)

## How to use
1. Clone the repository into a local directory.
2. For local runs, it is preferred to run using **Live Server** extension in Visual Studio Code, this prevents the CORS (cross origin request) error from happening.
<img src="https://github.com/adrielyeung/keyword-searcher/blob/main/images/LiveServer_Img.PNG" alt="Live Server" width="70%" height="70%">

## Description
The front end, ```index.html```, is divided into several sections:
<img src="https://github.com/adrielyeung/keyword-searcher/blob/main/images/KeywordSearcher_Page_Img.PNG" alt="Keyword Searcher Front End Top" width="100%" height="100%">

1. Title area - Title of the text
2. Content area - Main content
3. Search area - Custom keyword search in Content area. Highlights keywords found and displays number of keywords found. Allows for replacement of all found keywords.
4. Save file area - Save all text in Content area (including replaced keywords) as .txt file.
5. Analysis area - Analysis of most used, least used words, character and word counts (see below).

<img src="https://github.com/adrielyeung/keyword-searcher/blob/main/images/KeywordSearcher_Bottom_Img.PNG" alt="Keyword Searcher Front End Bottom" width="50%" height="50%">

6. Sample area - Select any example text for quick study of functionalities.
7. Insert text area - Custom text analysis as input by user.
8. Upload file area - Custom .txt file analysis as uploaded by user.
9. Load URL area - Website content analysis (advanced - need to enable cross origin request (CORS)). For users who do not understand this concept, recommended to copy and paste text from the external website into the "Insert text area" instead.

Functionality is provided by ```SearchString.js``` file.

Note: The title is **not included** in the below analysis.

### Most used / least used words analysis
The words with the highest and lowest number of counts are displayed in the most and least used words boxes respectively.

Note that a list of stopwords (```config/stopwords.txt```), i.e. words which occur commonly in a lot of texts (e.g. 'a', 'the' etc.) are excluded from the analysis.
You may use the search box to perform searches for these words.

### Text analysis stats
Displays the character and word counts of the text.

## Future developments
1. Whole word / partial word searching option
2. Case sensitive search

## Credits
- The Coder Foundry for their fantastic tutorial which this project is based on (https://www.youtube.com/watch?v=KEvLAe_2jXo).
- Logomakr for the free logo (https://logomakr.com/).
