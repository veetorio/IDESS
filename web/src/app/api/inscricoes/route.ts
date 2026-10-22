import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/** GET — lista as inscrições do usuário autenticado */
export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const resposta = await fetch(`${API_URL}/inscricoes`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!resposta.ok) {
    return NextResponse.json(
      { message: "Erro ao buscar inscrições" },
      { status: resposta.status }
    );
  }

  const dados = await resposta.json();
  return NextResponse.json(dados);
}

/** POST — inscreve o usuário autenticado em um evento */
export async function POST(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  const body = await request.json();

  const resposta = await fetch(`${API_URL}/inscricoes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    return NextResponse.json(
      { message: (erro as { message?: string }).message ?? "Erro ao realizar inscrição" },
      { status: resposta.status }
    );
  }

  const dados = await resposta.json();
  return NextResponse.json(dados, { status: 201 });
}
