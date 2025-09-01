const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const generateAIBlueprint = async (userData) => {
  const systemPrompt = `You are an expert AI strategist for ZYNIQ. Your task is to generate a strategic blueprint for a client based on their inputs. Respond ONLY with a valid JSON object. The JSON object must have three keys: "headline" (a short, impactful title for the strategy), "key_points" (an array of 3-4 short, actionable bullet points), and "recommendation" (a concluding paragraph suggesting next steps).`;
  
  let userQuery = "Client self-assessment data:\n" + 
    Object.entries(userData).map(([k,v]) => `- ${k}: ${v}`).join('\n');

  try {
    const response = await fetch(`${BACKEND_URL}/api/generate-blueprint`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        system_prompt: systemPrompt,
        user_query: userQuery
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.blueprint;
  } catch (error) {
    console.error('AI Blueprint generation failed:', error);
    throw error;
  }
};