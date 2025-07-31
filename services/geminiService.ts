
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Use Vite's import.meta.env to access environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY environment variable not set. Gemini API calls will fail.");
  // For this context, we'll let it proceed, and the SDK will likely fail on calls.
}

// Initialize the AI client only if the API key is available.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;
const TEXT_MODEL = 'gemini-2.5-flash-preview-04-17';

async function generateGeminiText(prompt: string, systemInstruction?: string, requestJson: boolean = false): Promise<string> {
  if (!ai || !API_KEY) {
    console.error("Gemini API call attempted without a configured API_KEY.");
    throw new Error("API Key not configured. Please ensure the VITE_GEMINI_API_KEY environment variable is set in your .env file.");
  }

  if (typeof prompt !== 'string' || prompt.trim() === "") {
      console.error("Gemini API call attempted with invalid or empty prompt. Prompt:", prompt);
      throw new Error("Cannot make Gemini API call: The prompt is empty or invalid.");
  }

  try {
    const requestPayload: any = {
      model: TEXT_MODEL,
      contents: prompt,
      config: { // Restored config object
        ...(systemInstruction ? { systemInstruction } : {}),
        responseMimeType: requestJson ? "application/json" : "text/plain"
      }
    };
    // console.log("Gemini Request Payload:", JSON.stringify(requestPayload, null, 2));

    const response: GenerateContentResponse = await ai.models.generateContent(requestPayload);
    
    // console.log("Gemini Raw Response:", JSON.stringify(response, null, 2));

    return response.text;
  } catch (error) {
    console.error("Gemini API Error in generateGeminiText:", error); 
    
    let detailedErrorMessage = "An unknown error occurred with the Gemini API.";

    if (error instanceof Error) {
        detailedErrorMessage = error.message; 
        
        if (error.message.includes('{') && error.message.includes('}')) {
            try {
                let jsonErrorString = error.message;
                const fenceMatch = error.message.match(/^```json\s*\n?(.*?)\n?\s*```$/s);
                if (fenceMatch && fenceMatch[1]) {
                    jsonErrorString = fenceMatch[1];
                }

                const parsedJsonError = JSON.parse(jsonErrorString);
                if (parsedJsonError?.error?.message) {
                    detailedErrorMessage = parsedJsonError.error.message;
                } else if (parsedJsonError?.message) {
                    detailedErrorMessage = parsedJsonError.message;
                }
            } catch (e) {
                // If JSON parsing fails, stick with the original error.message
            }
        }
    } else if (typeof error === 'string') {
        detailedErrorMessage = error;
    }
    
    throw new Error(`Gemini API request failed: ${detailedErrorMessage}`);
  }
}

export const geminiService = {
  rephraseLine: async (line: string): Promise<string> => {
    const prompt = `Rephrase this line in a creative and evocative way, suitable for song lyrics. Return only the rephrased line, without any introductory text or quotation marks: "${line}"`;
    const systemInstruction = "You are a poetic assistant specializing in song lyrics. Think of styles ranging from Hemingway's stark clarity to Lou Reed's street poetry, the confessional intimacy of Elliott Smith, the sharp wit of Elvis Costello, the surreal wordplay of a Dadaist, or the abstract evocations of Brian Eno.";
    return generateGeminiText(prompt, systemInstruction);
  },

  reharmonizeChords: async (chords: string): Promise<string> => {
    const prompt = `Suggest an interesting and musically appropriate reharmonization for this chord progression: "${chords}". Keep it suitable for the original mood if possible, or offer a creative alternative. Provide only the new chord progression as a string (e.g., Am - Dm - G7 - Cmaj7). Do not include any explanatory text.`;
    const systemInstruction = "You are a music theory expert specializing in chord progressions, from simple folk to complex jazz, ambient textures, or indie rock.";
    return generateGeminiText(prompt, systemInstruction);
  },

  generateFullSong: async (theme: string, style: string): Promise<string> => {
    const prompt = `Compose a complete song draft with lyrics and chord suggestions based on the following:
Theme/Topic: "${theme}"
Musical Style/Mood: "${style}" (e.g., Mellow Folk Ballad, Gritty Punk Anthem, Surreal Indie Folk (think Big Thief), D'Angelo-esque Neo-Soul Groove, Warhol-inspired Art Pop, Outkast-style Experimental Hip-Hop, Brian Wilson-esque Pocket Symphony, Ambient Soundscape (Eno), Avant-Pop (Björk), Raw Alt-Rock (Nirvana), Articulate New Wave (Costello), Introspective Indie Folk (Elliott Smith), Story-Driven Hip-Hop (Kendrick Lamar)).

Structure the song clearly (e.g., Verse 1, Chorus, Verse 2, Chorus, Bridge, Chorus, Outro).
Lyrics should be evocative and tell a story or explore the theme, matching the specified style.
Chord suggestions should be placed above the relevant lyrics and fit the musical style.
Provide the full song draft.`;
    const systemInstruction = "You are a creative songwriting assistant. Generate complete song structures with lyrics and chords, adept at capturing a wide range of musical and lyrical styles, from classic to experimental.";
    return generateGeminiText(prompt, systemInstruction);
  },

  findRhymes: async (word: string): Promise<string[]> => {
    const prompt = `Provide a list of at least 10-15 diverse rhyming words (perfect rhymes, near rhymes, creative/slant rhymes, multi-syllable rhymes) for the word "${word}". Return the list as a JSON array of strings. For example, if the word is "time", you might return ["chime", "climb", "crime", "dime", "grime", "lime", "prime", "rhyme", "sublime", "paradigm", "one time", "nighttime", "lifetime"]. Only return the JSON array itself, with no other text or markdown.`;
    const systemInstruction = "You are a rhyming dictionary expert. Provide diverse and creative rhymes as a JSON array.";
    
    const rawResponse = await generateGeminiText(prompt, systemInstruction, true); // requestJson set to true
    
    let jsonStr = rawResponse.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }

    try {
      const parsedData = JSON.parse(jsonStr);
      if (Array.isArray(parsedData) && parsedData.every(item => typeof item === 'string')) {
        return parsedData;
      } else {
        console.error("Gemini API returned non-array or non-string array for rhymes:", parsedData);
        throw new Error("Rhyme data is not in the expected format (array of strings).");
      }
    } catch (e) {
      console.error("Failed to parse JSON response for rhymes:", e, "Raw response:", rawResponse);
      // Fallback removed to ensure stricter JSON handling as per previous request. If JSON fails, it's an error.
      throw new Error(`Failed to get rhymes. The API response was not parseable JSON. ${e instanceof Error ? e.message : String(e)}`);
    }
  },

  suggestSongStructure: async (idea: string): Promise<string> => {
    const prompt = `Based on the song theme/idea: "${idea}", suggest 3-4 distinct song structures.
Include common structures (e.g., Verse-Chorus-Verse-Chorus-Bridge-Chorus) but also consider less conventional or genre-specific structures (e.g., AABA, through-composed sections, or forms typical of indie rock, punk, artful R&B, experimental folk, art rock, or narrative hip-hop).
Clearly label each suggestion (e.g., 'Suggestion 1:', 'Suggestion 2:').
Format the response as a single block of text with each suggestion clearly separated by a blank line.
Return only the suggested structures and their labels.`;
    const systemInstruction = "You are an expert songwriter and music structure assistant. Provide clear, common, and creatively alternative song structures catering to diverse genres.";
    return generateGeminiText(prompt, systemInstruction);
  },

  generateMetaphors: async (concept: string): Promise<string> => {
    const prompt = `Generate 5-7 distinct and creative metaphors for the concept: "${concept}".
Each metaphor should be on a new line.
Aim for a range of styles, from the beautifully literal to the strikingly absurd or deeply observational.
Do not include any introductory or concluding text, or any numbering or bullet points. Just the metaphors.`;
    const systemInstruction = "You are a creative linguistic assistant specializing in crafting vivid metaphors for writers. Think of artists like Dalí, Björk's organic surrealism, or Kendrick Lamar's street-level observations.";
    return generateGeminiText(prompt, systemInstruction);
  },

  generateConceptualSparks: async (summaryNotes: string): Promise<string> => {
    const prompt = `Based on the following song concept notes from a Socratic dialogue:
---
${summaryNotes}
---
Please generate the following creative song sparks:
## Suggested Titles:
(Provide 2-3 unique and fitting song titles)

## Hook Ideas:
(Provide 3-4 distinct hook ideas. A hook is a short, memorable lyrical and/or conceptual phrase, typically 1-4 lines, that is catchy and central to a song. These should be varied.)

## Basic Song Structure:
(Suggest one common and fitting song structure, e.g., Verse-Chorus-Verse-Chorus-Bridge-Chorus)

## Chord Progression Idea:
(Suggest a simple 2-4 chord progression that might fit the mood, e.g., Am - G - C - F)

## Opening Lyrical Lines:
(Suggest 2-4 evocative opening lines for a first verse)

Format the output clearly with the specified markdown headers.
Ensure each category is distinct and provides creative, actionable ideas based on the input notes.
`;
    const systemInstruction = "You are a highly creative songwriting assistant. Your task is to analyze concept notes and generate inspiring, concrete starting points for a song, including titles, diverse hook ideas, structure, a fitting chord progression, and opening lyrics.";
    return generateGeminiText(prompt, systemInstruction);
  },

  generateHookIdeas: async (themeKeywords: string, desiredFeeling: string): Promise<string> => {
    const prompt = `Based on the following inputs:
Theme/Keywords: "${themeKeywords}"
Desired Feeling/Vibe: "${desiredFeeling}"

Generate 3-5 distinct hook ideas for a song.
A hook is a short (typically 1-4 lines), memorable lyrical and/or conceptual phrase that is catchy and central to a song, often forming the core of a chorus.
The hooks should vary in style and approach based on the input.
Each hook idea should be clearly separated by a double newline (a blank line).
Do not include any introductory text, numbering, or bullet points. Just the hook ideas.
`;
    const systemInstruction = "You are a master hook writer for songs. Generate concise, catchy, and emotionally resonant hook ideas based on the provided theme and feeling. Ensure each hook is distinct and stands alone.";
    return generateGeminiText(prompt, systemInstruction);
  },

  generateMelodyIdeas: async (keywordsMood: string): Promise<string> => {
    const prompt = `Based on the keywords/mood: "${keywordsMood}", generate 2-3 distinct textual descriptions of short melodic phrases or motifs.
Each description should be actionable for a songwriter. Consider including:
- Contour (e.g., ascending, descending, arch-shaped, jagged)
- Rhythmic ideas (e.g., syncopated, smooth, short staccato notes, long sustained notes)
- Scale/Key suggestions (e.g., major pentatonic, blues scale, minor key feel, modal)
- Prominent intervals or characteristic leaps.
- Overall feeling it evokes.

Format each melodic idea clearly, separated by a double newline (a blank line).
Do not include introductory text, numbering, or bullet points. Just the melodic idea descriptions.
`;
    const systemInstruction = "You are a creative music assistant. Describe melodic ideas textually, focusing on characteristics a songwriter can use for inspiration (contour, rhythm, harmony context, feeling).";
    return generateGeminiText(prompt, systemInstruction);
  },
};
