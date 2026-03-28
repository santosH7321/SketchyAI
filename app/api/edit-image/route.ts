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
    const { imageBase64, prompt, userFiles, aspectRatio, maskBase64} = await request.json();

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


    if(maskBase64){
      contents.push({
        inlineData: { 
          mimeType: "image/png",
          data: cleanBase64Image(maskBase64),
        },
      });
    }


    if(userFiles && Array.isArray(userFiles) && userFiles.length > 0) {
      const processedFiles = userFiles.map((file) => {
        return {
          inlineData: { 
            mimeType: getMimeType(file.url),
            data: cleanBase64Image(file.url),
          },
        };
      });
      contents.push(...processedFiles);
    }

    const response = await ai.models.generateContent({
      model: process.env.AI_MODEL as string,
      contents,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio || undefined,
        },
      },
    });

    let imageData = null;
    let textResponse = "";

    const parts = response?.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part?.text) {
        textResponse += part.text;
      } else if (part?.inlineData) {
        imageData = part.inlineData.data;
      }
    }

    return NextResponse.json({
      success: true,
      result: `data:image/png;base64,${imageData}`,
      text: textResponse,
    });

  } catch (error: unknown) {
    console.error(error);

    const message =
      error instanceof Error ? error.message : typeof error === "string" ? error : String(error);

    return NextResponse.json({
      success: false,
      error: message,
    });
  }
}