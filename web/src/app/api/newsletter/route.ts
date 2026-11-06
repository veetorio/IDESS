import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Não autenticado." }, { status: 401 });
  }

  try {
    const resposta = await fetch(`${API_URL}/newsletter`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const dados = await resposta.json().catch(() => null);
    return NextResponse.json(dados ?? [], { status: resposta.status });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao backend." },
      { status: 503 }
    );
  }
}
