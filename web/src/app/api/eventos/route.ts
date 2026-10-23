import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json(
      { message: "Origem da requisição não autorizada." },
      { status: 403 }
    );
  }

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  let body: FormData;
  try {
    if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
      throw new TypeError("Expected multipart/form-data");
    }
    body = await request.formData();
  } catch {
    return NextResponse.json(
      { message: "Envie os dados do evento em multipart/form-data." },
      { status: 400 }
    );
  }

  try {
    const resposta = await fetch(`${API_URL}/eventos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
      cache: "no-store",
    });

    const dados = await resposta.json().catch(() => null);
    return NextResponse.json(dados ?? {}, { status: resposta.status });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao backend." },
      { status: 503 }
    );
  }
}
