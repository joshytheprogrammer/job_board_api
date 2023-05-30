// const axios = require('axios');
// const natural = require('natural');
// const vocabulary = new natural.TfIdf();
// const { preprocessData, convertToNumericData } = require('./utils/preprocess');
// const { trainRecommendationModel, generateRecommendations } = require('./models/jobRecommendation');

// const dotenv = require("dotenv");
// const jwt = require('jsonwebtoken');

// dotenv.config();

// const accessToken = jwt.sign({ }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10m' });

// const convertUserPreferencesToNumeric = (userPreferences, vocabulary) => {
//   return userPreferences.map(preference => {
//     const { keywords } = preference;

//     const keywordTokens = keywords.map(keyword => keyword.toLowerCase());
//     const filteredKeywords = keywordTokens.filter(token => !stopwords.includes(token));
//     const stemmedKeywords = filteredKeywords.map(token => stemmer.stem(token));

//     const keywordVector = vocabulary.tfidfs(stemmedKeywords);
    
//     return {
//       features: keywordVector,
//     };
//   });
// };

// const fetchData = async () => {
//   try {
//     const response = await axios.get('http://127.0.0.1:5000/api/job/recent', {
//       headers: {
//         Authorization: accessToken,
//       },
//     });
//     const jobData = response.data.jobs;

//     // Preprocess and convert to numeric data
//     const preprocessedData = preprocessData(jobData, vocabulary);
//     const numericData = convertToNumericData(preprocessedData, vocabulary);

//     console.log("Started training")
    
//     // Train the recommendation model
//     const model = trainRecommendationModel(numericData);

//     console.log("Finished training")

//     // Generate recommendations for a user
//     const userPreferences = [
//       {
//         userId: "3ovD5UBLoWSQiqykzEOx2mZi",
//         keywords: [
//           "cloud computing",
//           "tutoring",
//           "backend development",
//           "content creation",
//           "frontend development"
//         ]
//       },
//       // Other user preferences...
//     ];
    

//     // Convert user preferences to numeric vectors
//     const numericUserPreferences = convertUserPreferencesToNumeric(userPreferences, vocabulary);

//     const recommendations = generateRecommendations(numericUserPreferences, model);

//     console.log(recommendations);
//   } catch (error) {
//     console.error('Error during training:', error);
//   }
// };

// fetchData();
