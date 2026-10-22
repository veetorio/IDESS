import { NextRequest, NextResponse } from "next/server";
import type { RegisterPayload } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

/**
 * POST /api/auth/register
 * Cria uma nova conta no backend Spring.
 */
export async function POST(request: NextRequest) {
  let body: RegisterPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  try {
    const backendRes = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      let mensagem = "Erro ao criar conta.";
      try {
        const err = await backendRes.json();
        mensagem = err.message ?? mensagem;
      } catch {
        /* ignora */
      }
      return NextResponse.json({ message: mensagem }, { status: backendRes.status });
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Erro ao conectar com o servidor. Tente novamente." },
      { status: 503 }
    );
  }
}
