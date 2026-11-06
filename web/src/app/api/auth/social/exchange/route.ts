import { NextRequest, NextResponse } from "next/server";
import type { AuthResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  if (
    typeof body !== "object" ||
    body === null ||
    !("ticket" in body) ||
    typeof body.ticket !== "string" ||
    !body.ticket
  ) {
    return NextResponse.json(
      { message: "Ticket de autenticação inválido." },
      { status: 400 }
    );
  }

  let resposta: Response;
  try {
    resposta = await fetch(`${API_URL}/auth/social/exchange`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ticket: body.ticket,
        telefone: "telefone" in body && typeof body.telefone === "string"
          ? body.telefone
          : undefined,
      }),
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao serviço de autenticação." },
      { status: 502 }
    );
  }

  if (!resposta.ok) {
    const erro = await resposta.json().catch(() => ({}));
    return NextResponse.json(
      { message: (erro as { message?: string }).message ?? "Não foi possível concluir o login social." },
      { status: resposta.status }
    );
  }

  const dados: AuthResponse = await resposta.json();
  const response = NextResponse.json({ usuario: dados.usuario });
  response.cookies.set("token", dados.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return response;
}
