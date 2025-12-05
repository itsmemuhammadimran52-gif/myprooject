/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import { GoogleGenAI, GenerateContentResponse, Modality } from "@google/genai";

// Declare Vite environment variable
declare const __VITE_GEMINI_API_KEY__: string;

// Helper function to convert a data URL string to a Gemini API Part
const dataUrlToPart = (dataUrl: string): { inlineData: { mimeType: string; data: string; } } => {
    const arr = dataUrl.split(',');
    if (arr.length < 2) throw new Error("Invalid data URL");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || !mimeMatch[1]) throw new Error("Could not parse MIME type from data URL");
    
    const mimeType = mimeMatch[1];
    const data = arr[1];
    return { inlineData: { mimeType, data } };
};

const handleApiResponse = (
    response: GenerateContentResponse,
    context: string // e.g., "thumbnail"
): string => {
    // 1. Check for prompt blocking first
    if (response.promptFeedback?.blockReason) {
        const { blockReason } = response.promptFeedback;
        // Provide a more user-friendly and actionable message.
        const userMessage = `Your request was blocked for safety reasons (${blockReason}). Please try rephrasing your title or custom prompt with more neutral language.`;
        console.error(userMessage, { response });
        throw new Error(userMessage);
    }

    // 2. Try to find the image part in the response candidates
    const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePartFromResponse?.inlineData) {
        const { mimeType, data } = imagePartFromResponse.inlineData;
        console.log(`Received image data (${mimeType}) for ${context}`);
        return `data:${mimeType};base64,${data}`;
    }

    // 3. If no image, check for other finish reasons for a more specific error
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
        let userMessage = `Image generation failed. Reason: ${finishReason}. `;
        switch (finishReason) {
            case 'SAFETY':
                userMessage += 'The request may have violated safety policies. Please adjust your text prompts and try again.';
                break;
            case 'RECITATION':
                 userMessage += 'The response was blocked to avoid reciting sensitive or copyrighted material. Please try a more original prompt.';
                break;
            default:
                userMessage += 'An unexpected issue occurred. Please try modifying your request.';
                break;
        }
        console.error(userMessage, { response });
        throw new Error(userMessage);
    }
    
    // 4. Fallback for when no image is returned without a clear reason
    const textFeedback = response.text?.trim();
    // Create a more helpful fallback message
    let errorMessage = `The AI model did not return an image for the ${context}. `;
    if (textFeedback) {
        // Show a snippet of any text response, as it might be a hint (e.g., an error message from the model)
        errorMessage += `It responded with: "${textFeedback.substring(0, 150)}...". `;
    }
    errorMessage += "This can happen if the request is too complex or unclear. Please try simplifying your title or custom background prompt.";


    console.error(`Model response did not contain an image part for ${context}.`, { response });
    throw new Error(errorMessage);
};


/**
 * Generates two A/B test variations of a YouTube-style thumbnail using generative AI.
 * @returns An array of promises, each resolving to a data URL of a generated thumbnail variation.
 */
export const generateThumbnail = (
    croppedImageDataUrl: string,
    category: string,
    title: string,
    emotion: string,
    emotionIntensity: number,
    textColor: string,
    fontStyle: string,
    backgroundStyle: string,
    outlineThickness: string,
    outlineColor: string,
    addWatermark: boolean,
    secondaryCroppedImageDataUrl: string | null | undefined,
    customBackgroundPrompt: string | null | undefined,
    difficulty: string = 'Medium',
): Promise<string>[] => {
    console.log(`Starting thumbnail A/B variation generation with options:`, { category, emotion, emotionIntensity, difficulty, textColor, fontStyle, backgroundStyle, outlineThickness, outlineColor, hasSecondImage: !!secondaryCroppedImageDataUrl, customBackgroundPrompt });
    const ai = new GoogleGenAI({ apiKey: __VITE_GEMINI_API_KEY__ });
    
    const imageParts: any[] = [dataUrlToPart(croppedImageDataUrl)];

    const getIntensityDirectives = (intensity: number) => {
        let face, colors, textAndAccents;

        if (intensity <= 30) {
            face = 'subtle and nuanced. Avoid caricature. The emotion should be understated and realistic.';
            colors = 'use a soft, gentle, and harmonious color palette. The background tone should be calm and not overpowering. Contrast should be low to moderate.';
            textAndAccents = 'Text should be clean and clear, but not overly bold or stylized. Avoid adding extra graphic accents.';
        } else if (intensity <= 70) {
            face = 'clear and well-defined, representing a standard, genuine emotional expression. It should be easily readable but not overly dramatic.';
            colors = 'use a balanced and professional color palette with good contrast. The background should be engaging but not distracting. This is the standard for high-quality thumbnails.';
            textAndAccents = 'Text must be bold and highly readable with strong outlines, as is standard for high-CTR thumbnails.';
        } else { // 71-100
            face = 'highly exaggerated and dramatic. The expression should be pushed to its maximum for a high-energy, "over-the-top" look. Think classic, expressive YouTube reaction faces.';
            colors = 'use extremely vibrant, high-contrast, and saturated colors. The background must be visually loud and designed to grab attention instantly. Strong contrasting colors are mandatory.';
            textAndAccents = 'Text must be exceptionally bold and impactful, using strong outlines, shadows, and possibly gradients. You MUST add dynamic graphic accents like glows, action lines, or highlighted circles to enhance the high-energy feel.';
        }
        return { face, colors, textAndAccents };
    };
    const intensityDirectives = getIntensityDirectives(emotionIntensity);

    let secondaryImagePrompt = '';
    if (secondaryCroppedImageDataUrl) {
        imageParts.push(dataUrlToPart(secondaryCroppedImageDataUrl));
        if (category === "Before & After") {
            secondaryImagePrompt = `
- **Composite Instructions:** Two images are provided: a "Before" shot (first image) and an "After" shot (second image). Create a split-screen composition. The "Before" image on the left, "After" on the right. Add small "BEFORE" and "AFTER" text labels to each side. The main title text should overlay the entire image.
`;
        } else if (category === "Product Review") {
             secondaryImagePrompt = `
- **Composite Instructions:** Two images are provided: the reviewer's face (first image) and a product (second image). The reviewer's face is the primary subject. Cut out the product from the second image and feature it prominently next to the reviewer.
`;
        } else if (category === "Food") {
            secondaryImagePrompt = `
- **Composite Instructions:** Two images are provided: a person's face (first image) and a picture of food (second image). The person's face is the primary subject. Cut out the food from the second image and feature it prominently next to the person's face reaction. Make the food look delicious and appealing.
`;
        }
    }
    
    let categorySpecificInstructions = '';
    if (category === 'MrBeast Style') {
        categorySpecificInstructions = `
**Category-Specific Instructions for "MrBeast Style":**
- **Overall Vibe:** Energetic, high-contrast, and slightly exaggerated. Everything should feel LOUD and exciting.
- **Color Palette:** You MUST use extremely vibrant and saturated colors. High contrast is critical (e.g., bright yellows, cyans, magentas against dark backgrounds).
- **Subject Enhancement:** The person's face should have a very energetic expression (as per the emotion input) and a thick, distinct colored outline or glow to make it pop dramatically from the background.
- **Graphic Elements:** If appropriate for the title, incorporate classic high-energy elements like glowing arrows, circles highlighting something, or subtle shockwave/explosion effects in the background.
`;
    }

    let customBackgroundPromptInstruction = '';
    if (backgroundStyle === 'Custom' && customBackgroundPrompt && customBackgroundPrompt.trim()) {
        customBackgroundPromptInstruction = `
- **Custom Background Generation:** The user has provided a specific prompt for the background. You MUST generate a background that accurately matches the following description: "${customBackgroundPrompt}". This instruction overrides the general 'Background Style' selection.
`;
    }
    
    let difficultyInstruction = '';
    switch (difficulty) {
        case 'Easy':
            difficultyInstruction = `
- **Design Complexity:** Easy. Create a simple, clean, and minimalist design. Focus on a single subject with very clear, readable text and a basic, uncluttered background. Avoid complex effects or multiple graphic elements.`;
            break;
        case 'Hard':
            difficultyInstruction = `
- **Design Complexity:** Hard. Create a complex, high-energy, multi-element composition. Use advanced text effects (e.g., gradients, textures, multiple strokes), intricate background details, and incorporate secondary graphic elements like glowing arrows, circles, or action lines to maximize visual impact. This is for a "busy," high-CTR style similar to top creators.`;
            break;
        case 'Medium':
        default:
            difficultyInstruction = `
- **Design Complexity:** Medium. Create a balanced and professional design. Use standard high-CTR techniques like bold text with strong outlines, contrasting colors, and a dynamic composition that draws the eye without being overly cluttered. This is the standard for most popular YouTube thumbnails.`;
            break;
    }

    const basePrompt = `You are an expert YouTube thumbnail designer AI. Your task is to create a viral, eye-catching, high-click-through-rate (CTR) thumbnail based on the following instructions. The overall goal is a vibrant, high-contrast, and lively exaggerated YouTube thumbnail look that demands clicks. Adapt the background and any generated subjects to perfectly match the given category (e.g., food, finance, gaming).

**Inputs:**
- **Base Image:** An image of a person's face (unless it's a "Before & After" shot). It has been cropped to 16:9.
- **Category:** ${category}
- **Title Text:** "${title}"
- **Desired Emotion:** ${emotion}
- **Emotion Intensity:** ${emotionIntensity}%
- **Difficulty Level:** ${difficulty}
- **Customization:**
    - Text Color: ${textColor}
    - Font Style: ${fontStyle}
    - Background Style: ${backgroundStyle}
    - Text Outline Thickness: ${outlineThickness}
    - Text Outline Color: ${outlineColor}
${secondaryImagePrompt}
${customBackgroundPromptInstruction}
${categorySpecificInstructions}
${difficultyInstruction}

**Core Instructions:**
1.  **Face Transformation (ABSOLUTE CRITICAL REQUIREMENT):** This is the single most important instruction. Your primary task is to **completely change the person's facial expression** to strictly match the requested emotion: **'${emotion}'** with an intensity of **${emotionIntensity}%**.
    -   **Expression Style:** The expression must be **${intensityDirectives.face}**
    -   **Identity Preservation:** The final face must still look like the original person, but with the new expression.
    -   **DO NOT** just enhance or slightly modify the original expression. You **MUST** generate a completely new facial structure matching the emotion and intensity.
    -   (This instruction is overridden for "Before & After" shots; for those, follow their specific composite instructions).
2.  **Composition:** Place the transformed, cut-out face as the large, central subject, making it occupy approximately 50-70% of the thumbnail space. The composition must be dynamic and follow principles of visual hierarchy to draw the viewer's eye to the most important elements (face and text). If two images are provided, follow the specific composite instructions outlined in the 'Inputs' section.
3.  **Background Generation & Color:**
    - Your background generation method depends on the user's selection:
        - **If a "Custom Background Generation" instruction is provided above, you MUST follow it and ignore the other background options.**
        - Otherwise, if "Background Style" is NOT "AI Choice" (e.g., "Gradient", "Abstract"), you **MUST** generate a new background in that specified style: "${backgroundStyle}".
        - Otherwise, if "Background Style" IS "AI Choice", generate a new, exciting background that perfectly matches the "${category}" theme.
    -   The background should be vibrant, high-quality, photorealistic, and well-composed. Crucially, its color palette must follow this directive: **${intensityDirectives.colors}**
4.  **Text Application (CRITICAL FOR CTR):** You will now act as a world-class graphic designer with over 12 years of experience specializing in viral YouTube thumbnails. The text is the most important element for clicks after the face. Your text design MUST be premium, professional, and adhere to these non-negotiable rules:
    -   **Font Choice & Style:**
        -   You MUST use an ultra-bold, condensed, and impactful sans-serif font (e.g., Anton, Bebas Neue, Komi-san style). The font must be extremely easy to read at a glance, even on small mobile screens.
        -   The user will provide the title, but you should lay it out to feel like **bold, short, punchy text**, emphasizing keywords with larger sizes if necessary.
        -   If the user specified a "Font Style" other than "AI Choice", interpret it within these professional constraints (e.g., "Modern" means a clean, bold sans-serif).
    -   **Color & Contrast (NON-NEGOTIABLE):**
        -   The text color MUST be vibrant and have extreme contrast with the background. Use color psychology: bright yellows for excitement, reds for urgency, white for clarity.
        -   If the user specified a "Text Color" other than "AI Choice", you MUST use it, but ensure the surrounding effects make it pop.
    -   **Readability Effects (MANDATORY):**
        -   The text MUST have a combination of strong effects to lift it off the background. This is not optional.
        -   You MUST apply a thick, clean outline. If the user specified an "Outline Color" and "Thickness" other than "AI Choice", use those settings. Otherwise, use a contrasting color like black or white.
        -   In addition to the outline, you MUST add a soft drop shadow or an outer glow to create depth and further separate the text from the background elements.
    -   **Placement & Composition:**
        -   Position the text strategically, often using the rule of thirds, **placing it at the top or bottom of the image.** It MUST NOT cover the subject's face or the most critical parts of the image.
        -   Slightly rotating the text (e.g., -2 to 5 degrees) can add a dynamic, energetic feel.
        -   If the title has multiple lines, use variations in font size to create a clear visual hierarchy, emphasizing the most important words.
    -   **Styling based on Intensity:** You must also adhere to this directive: **${intensityDirectives.textAndAccents}**
    -   **Overall Goal:** The final text should look like it was designed by a top-tier creator. It must be sharp, bold, and so readable it's impossible to ignore. Avoid cheap, thin, or flat-looking text at all costs. Add the title text "${title}" following these strict rules.
5.  **Final Polish:** Apply professional color grading and lighting to the entire image to make it cohesive and visually striking, in the style of a top-tier YouTube creator. This final polish should be akin to applying a professional, purpose-built filter that enhances the mood and genre of the video. The visual style **MUST** be appropriate for the chosen category: "${category}". As part of this polish, incorporate vibrant accent colors like red, yellow, green, or gold for highlights, glows, or secondary graphic elements to maximize visual excitement and contrast. For example, a "Gaming" thumbnail should be vibrant and high-contrast, while a "Documentary" thumbnail should have a more serious, cinematic tone.

**Strict Output Requirements:**
- **DIMENSIONS (ABSOLUTE & NON-NEGOTIABLE):** The final image you output **MUST be exactly 1280 pixels wide and 720 pixels high**. This is a strict technical requirement. Do not deviate from this size.
- **ASPECT RATIO:** The final image **MUST have a 16:9 aspect ratio**.
${addWatermark ? `- **WATERMARK:** You MUST add a neat, semi-transparent watermark of the text 'MADE BY PRO THUMBNAIL GENERATOR' in the bottom-right corner. It should have about 60-70% opacity and be legible but not overpower the main content. Use a clean, simple white font.` : ''}
- **FORMAT:** You must return **ONLY the final image data**. Do not output any text, descriptions, or explanations.`;
    
    const variationPrompts = [
        `\n**Variation Instruction:** For this first version, create a thumbnail with a BRIGHT, high-energy, and vibrant color palette. Use dynamic angles and a clean, modern aesthetic. Make it feel exciting, professional, and loud.`,
        `\n**Variation Instruction:** For this second, distinctly different version, create a thumbnail with a DARKER, more cinematic, and dramatic color palette. Focus on creating a sense of mood and premium quality with professional, realistic lighting and shadows. Make it feel intense and high-stakes.`
    ];

    const generationPromises = variationPrompts.map((variationPrompt, index) => {
        const fullPrompt = basePrompt + variationPrompt;
        const allParts = [...imageParts, { text: fullPrompt }];

        console.log(`Sending variation ${index + 1} to model...`);
        return ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: allParts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        }).then(response => {
            console.log(`Received response from model for thumbnail variation ${index + 1}.`, response);
            return handleApiResponse(response, `thumbnail variation ${index + 1}`);
        });
    });

    return generationPromises;
};


/**
 * Applies a stylistic filter to a given image using generative AI.
 * @param baseImageDataUrl The data URL of the image to be edited.
 * @param filterPrompt The text prompt describing the filter to apply.
 * @param addWatermark Whether to add/maintain a watermark on the image.
 * @returns A promise that resolves to the data URL of the edited image.
 */
export const applyFilter = async (
    baseImageDataUrl: string,
    filterPrompt: string,
    addWatermark: boolean,
): Promise<string> => {
    console.log(`Starting filter application with prompt:`, { filterPrompt });
    const ai = new GoogleGenAI({ apiKey: __VITE_GEMINI_API_KEY__ });
    
    const parts = [
        dataUrlToPart(baseImageDataUrl),
        {
            text: `You are an expert photo editor AI. Your primary function is to apply a professional, artistic filter to the provided image based on a specific style.

**CRITICAL: Style Adherence**
You MUST strictly adhere to the defined artistic styles below. When the user's prompt matches one of these styles, you are required to reproduce it with extreme accuracy and professional quality. Do not deviate or mix styles unless explicitly asked.

**Style Library & Definitions:**

-   **Cinematic:**
    *   **Goal:** Emulate the look of a high-budget feature film.
    *   **Color Grading:** MUST apply a distinct color grade. The Teal and Orange palette is a classic choice, pushing cool tones (blues, teals) into shadows and warm tones (oranges, yellows) into highlights and skin tones.
    *   **Lighting & Contrast:** Create deep, rich shadows and controlled highlights. Increase contrast to add drama and depth. Avoid flat lighting. A subtle bloom or halation on bright light sources is a plus.

-   **Vintage:**
    *   **Goal:** Recreate the aesthetic of old analog film photography (e.g., from the 1960s-1980s).
    *   **Color Palette:** MUST shift colors towards warm tones. Introduce a subtle sepia, yellow, or faded green cast to the overall image. Desaturate colors slightly to give a faded, aged look.
    *   **Texture:** MUST add a noticeable but realistic film grain.
    *   **Optics:** Introduce subtle optical imperfections like light leaks (a soft red/orange glow from the edges) or slight vignetting (darkening of the corners).

-   **Synthwave / Retrowave:**
    *   **Goal:** Capture the 80s retro-futuristic neon aesthetic.
    *   **Colors:** MUST use a palette dominated by neon magenta, electric blue, vibrant cyan, and deep purples.
    *   **Lighting:** Add glowing, neon-like effects, especially around the edges of the main subject.
    *   **Elements:** Can incorporate subtle 80s graphic elements like a digital grid pattern in the background or faint horizontal scan lines.

-   **Anime:**
    *   **Goal:** Transform the photo into a vibrant, high-quality Japanese anime art style.
    *   **Lines:** MUST apply bold, clean, and dynamic outlines to characters and key objects.
    *   **Shading:** Use cel-shading (hard-edged shadows) instead of smooth gradients.
    *   **Colors:** MUST use highly saturated, bright, and vibrant colors.
    *   **Face:** Eyes should be expressive and slightly enlarged, typical of the anime style.

-   **Lomo / Lomography:**
    *   **Goal:** Emulate the look of a Lomography toy camera.
    *   **Effects:** MUST apply high-contrast, heavily oversaturated colors, and dark vignetting around the edges.
    *   **Colors:** Colors are often shifted, creating a cross-processed look (e.g., blues turning green, yellows turning red).

-   **Harmonize:**
    *   **Goal:** A technical correction to make the foreground subject look naturally integrated with the background. This is NOT a creative style.
    *   **Actions:** Analyze the background's lighting (direction, color temperature, softness) and color palette. Apply realistic adjustments to the foreground subject to match. This includes color balancing, adjusting shadow/highlight intensity, and ensuring light wraps around the subject correctly.

**User Instruction:**
Your task is to apply the following filter instruction to the entire image: "${filterPrompt}"

**Quality Guidelines:**
- The result must look professional and high-quality, not like a cheap filter.
- Maintain the sharpness and detail of the original image's subject.

**Strict Output Requirements:**
- **DIMENSIONS (ABSOLUTE & NON-NEGOTIABLE):** The final image you output **MUST be exactly 1280 pixels wide and 720 pixels high**.
- **ASPECT RATIO:** The final image **MUST have a 16:9 aspect ratio**.
- **NO ADDITIONS:** Do NOT add, remove, or change any of the existing elements in the image (like text or faces) unless the prompt specifically asks for it. Only modify the overall style of the image based on the instruction.
${addWatermark ? `- **WATERMARK:** You MUST add a neat, semi-transparent watermark of the text 'MADE BY PRO THUMBNAIL GENERATOR' in the bottom-right corner. It should have about 60-70% opacity and be legible but not overpower the main content. If a watermark is already present, please maintain or cleanly replace it.` : `- **WATERMARK:** Do NOT add a watermark. If one exists from the input image, REMOVE it completely.`}
- **FORMAT:** You must return ONLY the final image data. Do not output any text, descriptions, or explanations.`
        },
    ];

    console.log('Sending image and filter prompt to the model...');
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    console.log('Received response from model for filter.', response);

    return handleApiResponse(response, 'filter');
};

/**
 * Changes the background of a given image using generative AI.
 * @param baseImageDataUrl The data URL of the image to be edited. The subject should be prominent.
 * @param backgroundPrompt The text prompt describing the new background to generate.
 * @param addWatermark Whether to add/maintain a watermark on the image.
 * @returns A promise that resolves to the data URL of the edited image.
 */
export const changeBackground = async (
    baseImageDataUrl: string,
    backgroundPrompt: string,
    addWatermark: boolean,
): Promise<string> => {
    console.log(`Starting background change with prompt:`, { backgroundPrompt });
    const ai = new GoogleGenAI({ apiKey: __VITE_GEMINI_API_KEY__ });
    
    const parts = [
        dataUrlToPart(baseImageDataUrl),
        {
            text: `You are an expert photo editor AI. Your task is to replace the background of the provided image.

**Core Instructions:**
1.  **Identify and Isolate Subject:** The image contains a primary subject (likely a person) and potentially text overlays. Your first and most critical task is to perfectly identify and isolate the primary human subject(s) and any text elements. Create a precise cutout mask.
2.  **Generate New Background:** Generate a new, photorealistic and well-composed background based *only* on the following user prompt: "${backgroundPrompt}". The background should be high-quality, visually compelling, and have a clear sense of depth and realistic lighting.
3.  **Composite Image:** Place the original, isolated subject(s) and text elements seamlessly onto the newly generated background. Ensure lighting, shadows, highlights, and color grading are consistent between the subject and the new background to create a seamless and believable final image. Do not alter the subject or the text themselves.

**Strict Output Requirements:**
- **DIMENSIONS (ABSOLUTE & NON-NEGOTIABLE):** The final image you output **MUST be exactly 1280 pixels wide and 720 pixels high**.
- **ASPECT RATIO:** The final image **MUST have a 16:9 aspect ratio**.
- **SUBJECT INTEGRITY:** Do NOT change the subject's appearance, expression, or any text that was part of the original image. Only replace the background behind them.
${addWatermark ? `- **WATERMARK:** You MUST add a neat, semi-transparent watermark of the text 'MADE BY PRO THUMBNAIL GENERATOR' in the bottom-right corner. It should have about 60-70% opacity and be legible but not overpower the main content. If a watermark is already present, please maintain or cleanly replace it.` : `- **WATERMARK:** Do NOT add a watermark. If one exists from the input image, REMOVE it completely.`}
- **FORMAT:** You must return ONLY the final image data. Do not output any text, descriptions, or explanations.`
        },
    ];

    console.log('Sending image and background prompt to the model...');
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    console.log('Received response from model for background change.', response);

    return handleApiResponse(response, 'background change');
};

/**
 * Applies a user-uploaded image as the new background for a given image using generative AI.
 * @param baseImageDataUrl The data URL of the image to be edited. The subject should be prominent.
 * @param customBgImageDataUrl The data URL of the user-uploaded image to be used as the new background.
 * @param addWatermark Whether to add/maintain a watermark on the image.
 * @returns A promise that resolves to the data URL of the edited image.
 */
export const applyCustomBackground = async (
    baseImageDataUrl: string,
    customBgImageDataUrl: string,
    addWatermark: boolean,
): Promise<string> => {
    console.log(`Starting custom background application...`);
    const ai = new GoogleGenAI({ apiKey: __VITE_GEMINI_API_KEY__ });
    
    const parts = [
        dataUrlToPart(baseImageDataUrl),
        dataUrlToPart(customBgImageDataUrl),
        {
            text: `You are an expert photo editor AI. Your task is to replace the background of the first image with the second image.

**Inputs:**
1.  **Primary Image:** The FIRST image provided. It contains the subject (likely a person) and text overlays that must be preserved.
2.  **New Background Image:** The SECOND image provided. This is the new background you must use.

**Core Instructions:**
1.  **Isolate Subject:** From the **Primary Image**, perfectly identify and isolate the main subject(s) and any text elements. Create a precise cutout.
2.  **Composite:** Place the isolated subject and text from the Primary Image seamlessly onto the **New Background Image**. Do not alter the subject or text themselves.
3.  **Integration:** Ensure lighting, shadows, and color grading are consistent between the subject and the new background for a cohesive final image.

**Strict Output Requirements:**
- **DIMENSIONS (ABSOLUTE & NON-NEGOTIABLE):** The final image you output **MUST be exactly 1280 pixels wide and 720 pixels high**.
- **ASPECT RATIO:** The final image **MUST have a 16:9 aspect ratio**.
- **SUBJECT INTEGRITY:** Do NOT change the subject's appearance, expression, or any text. Only replace the background.
${addWatermark ? `- **WATERMARK:** You MUST add a neat, semi-transparent watermark of the text 'MADE BY PRO THUMBNAIL GENERATOR' in the bottom-right corner. It should have about 60-70% opacity and be legible but not overpower the main content. If a watermark is already present, please maintain or cleanly replace it.` : `- **WATERMARK:** Do NOT add a watermark. If one exists from the input image, REMOVE it completely.`}
- **FORMAT:** You must return ONLY the final image data. Do not output any text, descriptions, or explanations.`
        },
    ];

    console.log('Sending images and custom background prompt to the model...');
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    console.log('Received response from model for custom background change.', response);

    return handleApiResponse(response, 'custom background');
};


/**
 * Upscales an image to 4K resolution using generative AI.
 * @param baseImageDataUrl The data URL of the image to be upscaled.
 * @param addWatermark Whether to add/maintain a watermark on the image.
 * @returns A promise that resolves to the data URL of the 4K upscaled image.
 */
export const upscaleImage = async (
    baseImageDataUrl: string,
    addWatermark: boolean,
): Promise<string> => {
    console.log(`Starting image upscaling...`);
    const ai = new GoogleGenAI({ apiKey: __VITE_GEMINI_API_KEY__ });

    const parts = [
        dataUrlToPart(baseImageDataUrl),
        {
            text: `You are an expert image processing AI specializing in high-fidelity upscaling.
**Instruction:** Upscale the provided image to 4K resolution (3840x2160). Enhance details, improve sharpness, and ensure maximum clarity. Do not add, remove, or alter any content or elements within the image. The output must be a photorealistic, high-quality version of the original.

**Strict Output Requirements:**
- **DIMENSIONS (ABSOLUTE & NON-NEGOTIABLE):** The final image you output **MUST be exactly 3840 pixels wide and 2160 pixels high**.
- **ASPECT RATIO:** The final image **MUST have a 16:9 aspect ratio**.
- **CONTENT INTEGRITY:** Do NOT change the subject's appearance, expression, text, or any other elements. Only increase the resolution and enhance existing details.
${addWatermark ? `- **WATERMARK:** You MUST add a neat, semi-transparent watermark of the text 'MADE BY PRO THUMBNAIL GENERATOR' in the bottom-right corner. It should have about 60-70% opacity and be legible but not overpower the main content, and be proportionally sized for the 4K resolution. If a watermark is already present, please upscale it cleanly or replace it.` : `- **WATERMARK:** Do NOT add a watermark. If one exists from the input image, REMOVE it completely during the upscaling process.`}
- **FORMAT:** You must return ONLY the final image data. Do not output any text, descriptions, or explanations.`
        },
    ];

    console.log('Sending image and upscale prompt to the model...');
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    console.log('Received response from model for upscaling.', response);

    return handleApiResponse(response, 'upscale');
};

/**
 * Re-creates an existing YouTube thumbnail with a modern, high-CTR style.
 * @param originalThumbnailDataUrl The data URL of the original thumbnail to be analyzed and re-created.
 * @param characterImageDataUrl Optional. The data URL of a new character to replace any person in the original.
 * @param customText Optional. New text to use for the thumbnail's title.
 * @param addWatermark Whether to add a watermark to the image.
 * @returns An array of promises, each resolving to a data URL of a re-created thumbnail variation.
 */
export const recreateThumbnail = (
    originalThumbnailDataUrl: string,
    characterImageDataUrl: string | null,
    customText: string | null,
    addWatermark: boolean,
): Promise<string>[] => {
    console.log(`Starting thumbnail re-creation with options:`, { hasCharacterImage: !!characterImageDataUrl, customText });
    const ai = new GoogleGenAI({ apiKey: __VITE_GEMINI_API_KEY__ });
    
    const imageParts: any[] = [
        { text: 'Image 1: Original thumbnail to edit.' }, 
        dataUrlToPart(originalThumbnailDataUrl)
    ];

    if (characterImageDataUrl) {
        imageParts.push({ text: 'Image 2: New character to use.' });
        imageParts.push(dataUrlToPart(characterImageDataUrl));
    }
    
    const basePrompt = `You are an expert photo editor AI specializing in modernizing YouTube thumbnails. Your task is to perform a series of precise edits on an existing thumbnail (Image 1).

**CRITICAL TASK: Character Replacement**
This is your highest priority and an absolute requirement.
1.  **Isolate New Character:** Perfectly identify and cut out the **entire person (the character, including their body, pose, and clothing)** from **Image 2**. Do not just take the face.
2.  **Identify Original Character:** Locate the primary person/character within **Image 1**.
3.  **Replace and Composite:** REMOVE the original character completely from Image 1. Then, place the new cut-out character from Image 2 into the scene.
4.  **Seamless Integration:** The new character MUST be seamlessly blended into the existing background and scene of Image 1. You must meticulously match the lighting, shadows, color temperature, and grain of the original background. The new character should look like they were naturally part of the original scene. Do not change the background itself, only blend the new character into it.

**Secondary Task: Modernization & Text Update**
After the character replacement is complete, perform these enhancements:
1.  **Text Modernization:**
    -   ${customText && customText.trim() ? `You MUST use the following new title text: "${customText}". Remove all old text from Image 1.` : 'Take the existing text from Image 1.'}
    -   You will now redesign this text as a world-class graphic designer with over 12 years of experience. Your text design MUST be premium, professional, and adhere to these non-negotiable rules:
        -   **Font:** You MUST use an ultra-bold, condensed, and impactful sans-serif font (e.g., Anton, Komi-san style) that is extremely readable.
        -   **Color & Contrast:** The text color MUST be vibrant and have extreme contrast with the background.
        -   **Effects (MANDATORY):** The text MUST have a combination of a thick, clean, outline AND a soft drop shadow or outer glow to create depth and make it pop.
        -   **Placement:** Position the text strategically. It MUST NOT cover the new character's face or key focal points.
    -   **Goal:** The final text should look sharp, bold, and like it was designed by a top-tier creator. Avoid cheap or flat-looking text.
2.  **Enhancements:**
    -   **Keep the original background and layout.** Do not generate a new background.
    -   Apply professional, cinematic color grading to the ENTIRE image (new character included) to make it more vibrant and cohesive.
    -   Improve overall sharpness and clarity.
    -   Add subtle, modern effects (like glows, particles, or dynamic lighting) that complement the original style but make it more engaging.

The final output should be a high-quality, modernized version of the original thumbnail, but with the new person and updated text.

**Strict Output Requirements:**
- **DIMENSIONS (ABSOLUTE & NON-NEGOTIABLE):** The final image you output **MUST be exactly 1280 pixels wide and 720 pixels high**.
- **ASPECT RATIO:** The final image **MUST have a 16:9 aspect ratio**.
${addWatermark ? `- **WATERMARK:** You MUST add a neat, semi-transparent watermark of the text 'MADE BY PRO THUMBNAIL GENERATOR' in the bottom-right corner. It should have about 60-70% opacity and be legible but not overpower the main content.` : ''}
- **FORMAT:** You must return **ONLY the final image data**. Do not output any text or descriptions.`;


    const variationPrompts = [
        `\n**Variation Instruction A:** For this version, lean into a BRIGHT and BOLD aesthetic. Use vibrant, saturated colors and high-energy graphic elements. Make it feel exciting and loud.`,
        `\n**Variation Instruction B:** For this second, different version, aim for a more CINEMATIC and DRAMATIC look. Use deeper colors, strong shadows, and realistic lighting to create a premium, high-stakes feel.`
    ];

    const generationPromises = variationPrompts.map((variationPrompt, index) => {
        const fullPrompt = basePrompt + variationPrompt;
        const allParts = [...imageParts, { text: fullPrompt }];

        console.log(`Sending re-create variation ${index + 1} to model...`);
        return ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: allParts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        }).then(response => {
            console.log(`Received response from model for re-create variation ${index + 1}.`, response);
            return handleApiResponse(response, `re-created thumbnail variation ${index + 1}`);
        });
    });

    return generationPromises;
};

/**
 * Generates a complete, professional YouTube thumbnail from a single short text prompt.
 * @param prompt The user's short idea for the thumbnail.
 * @param addWatermark Whether to add a watermark to the image.
 * @returns A promise that resolves to the data URL of the generated thumbnail.
 */
export const generateProThumbnail = async (
    prompt: string,
    addWatermark: boolean
): Promise<string> => {
    console.log(`Starting PRO thumbnail generation with prompt:`, { prompt });
    const ai = new GoogleGenAI({ apiKey: __VITE_GEMINI_API_KEY__ });

    // Step 1: Create a blank 1280x720 canvas data URL using code
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.fillStyle = '#121212'; // Fill with a neutral dark color
        ctx.fillRect(0, 0, 1280, 720);
    }
    const blankCanvasDataUrl = canvas.toDataURL('image/png');
    const blankCanvasPart = dataUrlToPart(blankCanvasDataUrl);
    
    // Step 2: Update the prompt to instruct the AI to use the provided canvas
    const fullPrompt = `You are an elite YouTube thumbnail designer AI. Your task is to use the provided blank image as a canvas to create a complete, professional, 16:9 YouTube thumbnail.

**ABSOLUTE & NON-NEGOTIABLE CORE REQUIREMENT:**
An image of a blank, black 1280x720 canvas is provided. You **MUST** use this as the base for your creation. Your final output image **MUST** be the exact same dimensions (1280x720) and completely filled with your design. There must be NO blank areas, letterboxing, or pillarboxing. The entire 1280x720 canvas must be replaced by your generated visual content.

**User's Idea:** "${prompt}"

**Your Creative Process (Follow these steps in order):**

1.  **Analyze and Detect Category (Internal Step):**
    *   First, analyze the user's idea: "${prompt}".
    *   From the idea, determine the most fitting category from this list: **Finance, Food, Travel, Gaming, Tech, Health & Fitness, Beauty, Education, News, Lifestyle, Other.**
    *   You will use this detected category to heavily influence all subsequent design choices. For example, a 'Finance' thumbnail needs a professional, data-driven feel (graphs, charts, currency symbols), while a 'Gaming' thumbnail should be energetic and vibrant (in-game aesthetics, neon glows).

2.  **Replace the Canvas & Create Background:**
    *   Take the provided blank 1280x720 canvas image.
    *   Based on the user's idea and the **category you just detected**, completely replace the blank canvas with a vibrant, high-contrast, full-bleed background that is **thematically perfect for that category**. It should be visually interesting but not distract from the main subject.

3.  **Generate and Place the Main Subject:**
    *   Identify the core subject from the user's idea (e.g., "crypto rocket" -> a rocket with crypto symbols, "delicious pizza" -> a pizza).
    *   Generate a large, bold, high-quality version of this subject, **styled appropriately for the detected category**.
    *   **Place this subject onto the background you created in Step 2.** The subject should be the clear focal point and occupy 50-70% of the thumbnail space. The composition must be dynamic.

4.  **Apply High-CTR Text:**
    *   Extract 2-4 short, punchy keywords from the user's idea for the text.
    *   **Overlay this text on the image composition from Step 3.**
    *   **Font:** You MUST use an ultra-bold, condensed sans-serif font like Impact or Arial Black.
    *   **Styling (MANDATORY):**
        *   **Color:** The text **MUST** be either bright yellow (#FFD700) or pure white (#FFFFFF).
        *   **Outline:** The text **MUST** have a thick, clean, solid black outline for maximum readability.
        *   **Effects:** Add a subtle drop shadow for extra depth.
    *   **Placement:** Position the text at the top or bottom, ensuring it doesn't cover the main subject's important details.

**Final Review & Output:**
-   Confirm that the final composite image is **exactly 1280x720 pixels, using the provided blank image as the template.**
-   Confirm that the background fills the **entire 16:9 frame with no blank areas**.
-   The overall style must be professional, modern, and commercial, like a top YouTube creator's thumbnail.
${addWatermark ? `- Add a neat, semi-transparent watermark 'MADE BY PRO THUMBNAIL GENERATOR' in the bottom-right corner. It should have about 60-70% opacity and be legible but not overpowering.` : ''}
-   Return **ONLY the final 1280x720 image data**. Do not output text or explanations.`;
    
    // Step 3: Combine the blank canvas part and the text prompt part
    const parts = [
        blankCanvasPart,
        { text: fullPrompt }
    ];

    console.log('Sending PRO prompt with blank canvas to the model...');
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: parts },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });
    console.log('Received response from model for PRO thumbnail.', response);

    return handleApiResponse(response, 'pro thumbnail');
};