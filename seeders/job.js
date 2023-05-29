const Job = require('../models/Job');

// Generate a random string
function generateRandomString(length) {
  const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return result;
}

// Generate random title
function generateRandomTitle() {
  const prefixes = [
    'UI/UX',
    'Senior',
    'Junior',
    'Experienced',
    'Entry-level',
    'Lead',
    'Full Stack',
    'Frontend',
    'Backend',
    'DevOps',
    'Data',
    'Digital',
    'Marketing',
    'Content',
    'Product',
    'Technical',
    'Cooking',
    'Tutoring',
    'Cleaning',
    'Delivery',
    'Customer Service',
  ];
  const jobTitles = [
    'Designer',
    'Developer',
    'Engineer',
    'Analyst',
    'Specialist',
    'Manager',
    'Architect',
    'Scientist',
    'Strategist',
    'Consultant',
    'Coordinator',
    'Administrator',
    'Chef',
    'Tutor',
    'Cleaner',
    'Driver',
    'Representative',
  ];
  return `${randomChoice(prefixes)} ${randomChoice(jobTitles)} Wanted!`;
}

// Generate random description
function generateRandomDescription() {
  const prefixes = [
    'We are looking for',
    'Seeking a',
    'Join our team as a',
    'Exciting opportunity for a',
    'We have an opening for a',
  ];
  const skills = [
    'UI/UX design',
    'web development',
    'data analysis',
    'digital marketing',
    'software engineering',
    'graphic design',
    'project management',
    'content writing',
    'product management',
    'machine learning',
    'cloud computing',
    'cybersecurity',
    'business intelligence',
    'data science',
    'network administration',
    'cooking',
    'tutoring',
    'cleaning',
    'delivery',
    'customer service',
  ];
  const companies = [
    '@LogicLegends',
    '@TechGurus',
    '@InnovativeSolutions',
    '@DigitalMasters',
    '@CreativeMinds',
  ];
  const actions = [
    'to create innovative designs',
    'to develop cutting-edge applications',
    'to analyze complex datasets',
    'to drive successful marketing campaigns',
    'to build robust software solutions',
    'to design engaging user experiences',
    'to manage projects and teams',
    'to optimize website performance',
    'to implement AI and ML algorithms',
    'to ensure network security',
    'to prepare delicious meals',
    'to provide tutoring services',
    'to maintain cleanliness',
    'to handle deliveries',
    'to offer exceptional customer service',
  ];
  return `${randomChoice(prefixes)} ${randomChoice(skills)} ${randomChoice(companies)} ${randomChoice(actions)}.`;
}

// Generate random keywords
function generateRandomKeywords() {
  const skills = [
    'UI designers',
    'UI/UX',
    'web design',
    'frontend development',
    'backend development',
    'full stack development',
    'mobile app development',
    'data analysis',
    'digital marketing',
    'content creation',
    'product management',
    'cloud computing',
    'artificial intelligence',
    'machine learning',
    'cybersecurity',
    'cooking',
    'tutoring',
    'cleaning',
    'delivery',
    'customer service',
  ];
  const numKeywords = getRandomInt(2, 5);
  const selectedSkills = [];
  while (selectedSkills.length < numKeywords) {
    const skill = randomChoice(skills);
    if (!selectedSkills.includes(skill)) {
      selectedSkills.push(skill);
    }
  }
  return selectedSkills;
}

// Generate random tags
function generateRandomTags() {
  const tags = [
    'technology',
    'business',
    'design',
    'marketing',
    'development',
    'data',
    'cooking',
    'tutoring',
    'cleaning',
    'delivery',
    'customer service',
    'programming',
    'finance',
    'education',
    'management',
    'consulting',
    'writing',
    'analysis',
    'art',
    'communication',
    'engineering',
    'healthcare',
    'hospitality',
    'research',
    'sales',
    'social media',
    'leadership',
    'customer relations',
    'administration',
    'graphic design',
    'public speaking',
    'logistics',
    'problem-solving',
    'teamwork',
    'creativity',
    'finance',
    'project management',
    'software development',
    'market research',
    'web design',
    'data analysis',
    'culinary arts',
    'teaching',
    'cleaning services',
    'package delivery',
    'client satisfaction',
    'business strategy',
    'networking',
    'financial planning',
    'educational support',
    'food preparation',
    'customer support',
    'coding',
    'data science',
    'entrepreneurship',
    'event planning',
    'interpersonal skills',
    'content creation',
    'system administration',
    'budgeting',
    'digital marketing',
    'instructional design',
    'housekeeping',
    'logistics management',
    'customer experience',
    'software engineering',
    'marketing strategy',
    'menu planning',
    'tutoring services',
    'cleaning techniques',
    'supply chain',
    'project coordination',
    'menu development',
    'delivery logistics',
    'customer retention',
    'programming languages',
    'financial analysis',
    'classroom management',
    'food safety',
    'order fulfillment',
    'customer satisfaction',
    'frontend development',
    'backend development',
    'time management',
    'menu design',
    'route optimization',
    'client communication',
    'business development',
    'educational programs',
    'meal preparation',
    'vehicle maintenance',
    'customer care',
    'database management',
    'market analysis',
    'food presentation',
    'delivery tracking',
    'client management',
    'market trends',
    'instructional strategies',
    'inventory management',
    'client relations',
    'UX design',
    'business analytics',
    'educational materials',
    'recipe development',
    'fleet management',
    'customer inquiries',
    'data visualization',
  ];
  const numTags = getRandomInt(1, 3);
  const selectedTags = [];
  while (selectedTags.length < numTags) {
    const tag = randomChoice(tags);
    if (!selectedTags.includes(tag)) {
      selectedTags.push(tag);
    }
  }
  return selectedTags;
}

function getRandomCreator() {
  let creators = ["64357044eaeb192334df425d", "645c1f965f3c53f2f5ccc486", "6474d6dd59a21f8cf79eddbc", "6474d70c517ed724fa4b5ce0", "6474d70d517ed724fa4b5ce4"]

  if (creators.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * creators.length);
  return creators[randomIndex];
}

// Generate random data
function generateRandomData() {
  const data = [];
  for (let i = 0; i < 10000; i++) {
    const job = {
      creator_id: getRandomCreator(),
      title: generateRandomTitle(),
      desc: generateRandomDescription(),
      keywords: generateRandomKeywords(),
      offer: {
        lowest: getRandomInt(1000, 100000),
        highest: getRandomInt(3000, 100000),
      },
      status: 'ongoing',
      // tags: generateRandomTags(),
    };
    data.push(job);
  }
  return data;
}

// Helper function to get a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to choose a random element from an array
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate random data
const randomData = generateRandomData();

// console.log(randomData)

// Seed the database
Job.insertMany(randomData).then(() => {
  console.log("Seeded over 10,000 Jobs successfully")
}).catch((e) => {
  console.log(e)
})
