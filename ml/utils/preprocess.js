const natural = require('natural');
const { WordTokenizer, PorterStemmer, stopwords } = natural;

const tokenizer = new WordTokenizer();
const stemmer = PorterStemmer;

const preprocessData = (jobData, vocabulary) => {
  return jobData.map(job => {
    const cleanedTitle = job.title.toLowerCase().replace(/[^\w\s]/g, '');
    const cleanedDesc = job.desc.toLowerCase().replace(/[^\w\s]/g, '');

    const titleTokens = tokenizer.tokenize(cleanedTitle);
    const descTokens = tokenizer.tokenize(cleanedDesc);
    const keywordTokens = job.keywords.map(keyword => keyword.toLowerCase());

    const filteredTitle = titleTokens.filter(token => !stopwords.includes(token));
    const filteredDesc = descTokens.filter(token => !stopwords.includes(token));
    const filteredKeywords = keywordTokens.filter(token => !stopwords.includes(token));

    const stemmedTitle = filteredTitle.map(token => stemmer.stem(token));
    const stemmedDesc = filteredDesc.map(token => stemmer.stem(token));
    const stemmedKeywords = filteredKeywords.map(token => stemmer.stem(token));

    stemmedTitle.forEach(token => vocabulary.addDocument(token));
    stemmedDesc.forEach(token => vocabulary.addDocument(token));
    stemmedKeywords.forEach(token => vocabulary.addDocument(token));

    return {
      ...job,
      titleTokens: stemmedTitle,
      descTokens: stemmedDesc,
      keywordTokens: stemmedKeywords,
    };
  });
};

const convertToNumericData = (preprocessedData, vocabulary) => {
  return preprocessedData.map(job => {
    const { titleTokens, descTokens, keywordTokens } = job;
    
    const titleVector = vocabulary.tfidfs(titleTokens);
    const descVector = vocabulary.tfidfs(descTokens);
    const keywordVector = vocabulary.tfidfs(keywordTokens);
    const numericVector = titleVector.concat(descVector).concat(keywordVector);

    return {
      ...job,
      features: numericVector,
    };
  });
};


module.exports = { preprocessData, convertToNumericData };
