import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const {imageBase64, prompt} = await request.json()

    return NextResponse.json({imageBase64, prompt})
}