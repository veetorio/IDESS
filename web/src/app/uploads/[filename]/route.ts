import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
const NOME_IMAGEM =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|gif)$/i;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!NOME_IMAGEM.test(filename)) {
    return NextResponse.json(
      { message: "Imagem não encontrada." },
      { status: 404 }
    );
  }

  try {
    const imagem = await fetch(new URL(`/uploads/${filename}`, API_URL), {
      cache: "force-cache",
      next: { revalidate: 3600 },
    });
    if (!imagem.ok || !imagem.body) {
      return NextResponse.json(
        { message: "Imagem não encontrada." },
        { status: 404 }
      );
    }

    return new NextResponse(imagem.body, {
      status: 200,
      headers: {
        "Content-Type":
          imagem.headers.get("content-type") ?? "application/octet-stream",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível carregar a imagem." },
      { status: 503 }
    );
  }
}
