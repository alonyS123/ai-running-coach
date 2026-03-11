require('dotenv').config();
const mongoose = require('mongoose');


const express = require('express');
const cors = require('cors');

const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const app = express();
const PORT = 3001;


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

const profileSchema = new mongoose.Schema({
  name: String,
  age: Number,
  currentWeeklyKm: Number,
  daysPerWeek: Number,
  weeksToGoal: Number,
  weight: Number,
  currentPR: String,
  goalType: String,
  fitnessLevel: String
})

const Profile = mongoose.model('Profile', profileSchema);

const planSchema = new mongoose.Schema({
  plan: mongoose.Schema.Types.Mixed
});

const Plan = mongoose.model('Plan', planSchema);




async function generatePlan(profile){

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const prompt = `You are an expert running coach and your job is to build a high quality running training plan that will help the runner improve his running in his preferred distance and help him break his PR. You will return JSON only with no extra text. The JSON should have a weeks array, and each week has a weekNumber and a days array,every day must have a dayIndex field no exeptions. Each day has: id in the format "weekNumber-dayIndex" (e.g. "1-1"), dayIndex for the day number, weekNumber, type for the workout type (e.g. easy, tempo, intervals, long_run), distanceKm for the total distance, description for a detailed explanation of the workout, and status which should always be "planned".

My name is ${profile.name}, my age is ${profile.age}, I am training to run ${profile.goalType}, my current PR at this distance is ${profile.currentPR}, I run ${profile.daysPerWeek} times a week, my current weekly distance is ${profile.currentWeeklyKm}km, my fitness level is ${profile.fitnessLevel}, my weight is ${profile.weight}kg, and I have a race in ${profile.weeksToGoal} weeks. Generate me a training plan that will help me improve as much as possible and break my PR.`;

const result = await model.generateContent(prompt);
const text = result.response.text();

const cleaned = text.replace(/```json|```/g, '').trim();

let plan = JSON.parse(cleaned);

for (const week of plan.weeks) {
  for (const day of week.days) {
    if (!day.dayIndex) {
      day.dayIndex = Number(day.id.split('-')[1]);
    }
  }
}

return plan;

}



app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Running Coach backend is running' });
});

app.get('/api/profile', async(req, res) => {

try{
  const profile = await Profile.findOne();
  res.json(profile);
}
catch(err){
  console.log('Error:', err.message);
   return res.status(400).json({error:err.message});
}

});


app.post('/api/profile', async(req, res) => {

  try{
    
    await Profile.deleteMany({});
    const profile = new Profile(req.body);
    await profile.save();

     res.status(201).json({
    message: 'Profile saved successfully',
    profile: profile
  });
  }
  catch(err)
  {
   console.log('Error:', err.message);
   return res.status(400).json({error:err.message});
  }
  
});

app.post('/api/plan/generate', async(req, res) => {
  try{
    await Plan.deleteMany({});
    const profile = await Profile.findOne();
    if(!profile)
    {
     return res.status(400).json({ message: 'No profile found. Please create a profile first.' });  
    }
    
   const  trainingPlan = await generatePlan(profile);

    
   const planDoc = new Plan({ plan: trainingPlan });
   await planDoc.save();

   res.status(201).json({
    message: 'Training plan generated successfully',
    plan: trainingPlan
  });

  }
  catch(err){
    console.log('Error:', err.message);
   return res.status(400).json({error:err.message});  
  }
});


app.get('/api/plan', async(req, res) => {

  try{
     const trainingPlan = await Plan.findOne();
     if (!trainingPlan) {
        return res.status(404).json({ message: 'No training plan found. Generate one first.' });
      }
      res.json(trainingPlan.plan);
  }
  catch(err){
     console.log('Error:', err.message);
     return res.status(400).json({error:err.message}); 
  }
 
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});


