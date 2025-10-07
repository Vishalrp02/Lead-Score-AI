1️⃣ Clone the repository
git clone <your-repo-url>
cd <project-folder>

2️⃣ Install dependencies
npm install

stall
3️⃣ Configure environment variables
Create a .env file in the project root:
PORT=3000

4️⃣ Start the server
npm run dev # or nodemon server.js
Server will run at: http://localhost:3000

API Endpoints
1️⃣ Create Offer

POST /offer

Request Body (JSON):
{
"name": "AI Outreach Automation",
"value_props": ["24/7 outreach", "6x more meetings"],
"ideal_use_cases": ["B2B SaaS mid-market"]
}

Response:
"offer saved successfully"

2️⃣ Upload Leads CSV

POST /leads/upload

Form Data:

Key: file

Value: CSV file with headers:

name,role,company,industry,location,linkedin_bio

Response{
"message": "CSV parsed successfully",
"total_leads": 10,
"leads": [ ... ]
}

3️⃣ Run Scoring
POST /score

Uses latest uploaded leads and latest created offer.

Response:

{
"message": "Scoring completed successfully",
"total_leads": 10,
"results": [
{
"name": "Ava Patel",
"role": "Head of Growth",
"company": "FlowMetrics",
"intent": "High",
"ruleScore": 50,
"aiPoints": 50,
"finalScore": 100,
"reasoning": "Fits ICP SaaS mid-market and role is decision maker."
}
]
}

4️⃣ Get Results (No Re-score)

GET /results

Returns the last scoring results without recalculating.

[
{
"name": "Ava Patel",
"role": "Head of Growth",
"company": "FlowMetrics",
"intent": "High",
"score": 100,
"reasoning": "Fits ICP SaaS mid-market and role is decision maker."
}
]

Rule Logic & AI Prompts
Rule Layer (Max 50 points)
Criteria Points
Role relevance Decision maker (+20), Influencer (+10), Else 0
Industry match Exact ICP (+20), Adjacent (+10), Else 0
Data completeness All required fields present (+10)

AI Layer (Max 50 points)

Prompt sent to Gemini AI:
You are a sales assistant.

Given this product/offer:
{...offer JSON...}

And this prospect:
{...lead JSON...}

Classify the buying intent as High, Medium, or Low and explain in 1-2 sentences.
Respond in JSON:
{ "intent": "...", "reasoning": "..." }

Mapping:

High → 50 points

Medium → 30 points

Low → 10 points

Final Score = Rule Score + AI Points
# Lead-Score-AI
