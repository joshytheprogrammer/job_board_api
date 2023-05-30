const brain = require('brain.js');

const trainRecommendationModel = (numericData) => {
  const trainingData = numericData.map(job => {
    const input = job.features;
    const output = job.status === 'ongoing' ? 1 : 0;
    return { input, output };
  });

  const net = new brain.NeuralNetwork({
    learningRate: 0.1, // Adjust the learning rate as needed
    iterations: 1000, // Increase the number of iterations if necessary
    errorThresh: 0.005, // Set a smaller error threshold to define when to stop training
  });

  net.train(trainingData);

  return net;
};

const generateRecommendations = (userPreferences, model) => {
  console.log("\n Generating...")

  return userPreferences.map(preference => {
    const prediction = model.run(preference);
    return { job: jobData[prediction], score: prediction };
  });
};

module.exports = { trainRecommendationModel, generateRecommendations };
