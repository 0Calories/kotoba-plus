import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	try {
		const { word } = await request.json();

		if (!word) {
			return NextResponse.json({ error: "Word is required" }, { status: 400 });
		}

		const prompt = `Analyze the Japanese word "${word}" and provide detailed information about:

1. **Common Usage Level**: How commonly used is this word? (Very common/Common/Uncommon/Rare)

2. **Register & Formality**:
   - Is it used in spoken language or mainly written?
   - Is it formal, casual, or neutral?
   - Is it literary, academic, or conversational?

3. **Age Demographics**:
   - Do younger people (20s) use this word regularly?
   - Is it more common among older generations?
   - Any generational differences in usage?

4. **Context & Situations**: Where would you typically encounter this word?

5. **Example Sentences**: Provide 2-3 natural example sentences with English translations that show how this word is actually used.

6. **Usage Notes**: Any important nuances, warnings, or cultural context a learner should know.

Please format your response clearly with headers and be specific about the contexts where this word is appropriate vs inappropriate.`;

		const response = await fetch("https://api.openai.com/v1/chat/completions", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: "gpt-4",
				messages: [
					{
						role: "system",
						content:
							"You are a Japanese language expert who helps learners understand the nuanced usage, formality levels, and cultural context of Japanese words. Focus on practical information that will help learners use words appropriately in real conversations.",
					},
					{
						role: "user",
						content: prompt,
					},
				],
				max_tokens: 800,
				temperature: 0.7,
			}),
		});

		if (!response.ok) {
			throw new Error(`OpenAI API error: ${response.status}`);
		}

		const data = await response.json();
		const analysis =
			data.choices[0]?.message?.content || "No analysis available";

		return NextResponse.json({ analysis });
	} catch (error) {
		console.error("Error in analyze API:", error);
		return NextResponse.json(
			{ error: "Failed to analyze word" },
			{ status: 500 },
		);
	}
}
