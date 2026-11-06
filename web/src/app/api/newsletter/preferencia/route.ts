import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

function origemValida(request: NextRequest) {
  return request.headers.get("origin") === request.nextUrl.origin;
}

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  try {
    const resposta = await fetch(`${API_URL}/newsletter/preferencia`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const dados = await resposta.json().catch(() => ({}));
    return NextResponse.json(dados, { status: resposta.status });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao backend." },
      { status: 503 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (!origemValida(request)) {
    return NextResponse.json(
      { message: "Origem da requisição não autorizada." },
      { status: 403 }
    );
  }

  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  try {
    const corpo = await request.json();
    const resposta = await fetch(`${API_URL}/newsletter/preferencia`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(corpo),
      cache: "no-store",
    });
    const dados = await resposta.json().catch(() => ({}));
    return NextResponse.json(dados, { status: resposta.status });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível atualizar sua preferência." },
      { status: 503 }
    );
  }
}
