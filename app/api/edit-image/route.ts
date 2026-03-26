import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";


function getMimeType(dataUrl: string): string {
  const match = dataUrl.match(
    /^data:(image\/[a-zA-Z+]+);base64,/,
  );

  return match ? match[1] : "image/png";
}


function cleanBase64Image(dataUrl: string): string {
  return dataUrl.replace(/^data:(.*);base64,/, "");
}

export async function POST(request: Request) {
  try {
    const { imageBase64, prompt } = await request.json();

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    const contents = [
      { text: prompt },
      {
        inlineData: { 
          mimeType: getMimeType(imageBase64),
          data: cleanBase64Image(imageBase64),
        },
      },
    ];

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents,
    });

    let generatedImage = null;
    let textResponse = "";

    const parts = response?.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part?.text) {
        textResponse += part.text;
      } else if (part?.inlineData) {
        generatedImage = part.inlineData.data;
      }
    }

    return NextResponse.json({
      success: true,
      image: generatedImage,
      text: textResponse,
    });

  } catch (error: any) {
    console.error(error);

    return NextResponse.json({
      success: false,
      error: error.message,
    });
  }
}