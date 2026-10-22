import { NextRequest, NextResponse } from "next/server";
import type { AuthResponse } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Encaminha as credenciais para o backend Spring
    const resposta = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => ({}));
      return NextResponse.json(
        { message: (erro as { message?: string }).message ?? "Credenciais inválidas" },
        { status: resposta.status }
      );
    }

    const dados: AuthResponse = await resposta.json();

    // Seta o JWT em cookie httpOnly — não acessível via JavaScript
    const response = NextResponse.json(
      { usuario: dados.usuario },
      { status: 200 }
    );

    response.cookies.set("token", dados.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // 8 horas de validade
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "Erro interno. Tente novamente." },
      { status: 500 }
    );
  }
}
