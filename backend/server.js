const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const Groq = require('groq-sdk');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize Groq Client
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Helper to validate API Key
const hasApiKey = () => !!process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here';

app.post('/api/optimize', async (req, res) => {
    const { code, language } = req.body;

    if (!code || !language) {
        return res.status(400).json({ error: "Code and language are required" });
    }

    if (!hasApiKey()) {
        return res.status(500).json({
            error: "Server Configuration Error",
            details: "GROQ_API_KEY is missing in .env file in the backend folder."
        });
    }

    try {
        const systemPrompt = `
You are an expert Senior Software Engineer and Code Optimizer.
Your goal is to optimize the user's code for Time Complexity, Space Complexity, and Readability.

You MUST return the result in valid JSON format with the following structure:
{
    "original": "string (the original code)",
    "optimized": "string (the optimized code)",
    "explanation": ["string (point 1)", "string (point 2)"],
    "timeComplexity": { 
        "before": "string (e.g. O(n^2))", 
        "after": "string (e.g. O(n))" 
    }
}

Rules:
1. Detect inefficient patterns (O(n^2), O(n^3), redundant operations).
2. Rewrite the code in the same language (${language}) to be most efficient.
3. Provide clear, educational explanations in the 'explanation' array.
4. Estimate logical 'before' and 'after' Big-O complexity.
5. If the code is already optimal, clean it up and state that it is optimal in the explanation.
`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Optimize this ${language} code:\n\n${code}` }
            ],
            model: "llama-3.3-70b-versatile", // Using a strong model for code
            temperature: 0.1,
            response_format: { type: "json_object" }
        });

        const resultArg = completion.choices[0]?.message?.content;

        if (!resultArg) {
            throw new Error("No response from AI");
        }

        const parsedResult = JSON.parse(resultArg);

        // Ensure the response structure is safe for frontend
        const safeResponse = {
            original: code,
            optimized: parsedResult.optimized || "// Could not generate optimization",
            explanation: parsedResult.explanation || ["Optimization complete."],
            timeComplexity: {
                before: parsedResult.timeComplexity?.before || "Unknown",
                after: parsedResult.timeComplexity?.after || "Unknown"
            }
        };

        res.json(safeResponse);

    } catch (error) {
        console.error("Groq API Error:", error);
        res.status(500).json({
            error: "AI Optimization Failed",
            details: error.message
        });
    }
});

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    if (!hasApiKey()) {
        return res.json({ reply: "I cannot chat right now because the GROQ_API_KEY is missing in the backend settings." });
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are CodeRefine AI, a helpful assistant integrated into a code editor. Keep answers short, technical, and helpful." },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 150
        });

        const reply = completion.choices[0]?.message?.content || "I'm not sure how to respond to that.";
        res.json({ reply });

    } catch (error) {
        console.error("Groq Chat Error:", error);
        res.json({ reply: "Sorry, I'm having trouble connecting to my brain right now." });
    }
});

const server = app.listen(PORT, () => {
    console.log(`CodeRefine Backend running on http://localhost:${PORT}`);
    console.log(`- Environment: ${hasApiKey() ? 'Groq API Enabled' : 'Missing API Key'}`);
});

server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.error(`[ERROR] Port ${PORT} is already in use.`);
    } else {
        console.error(e);
    }
});

