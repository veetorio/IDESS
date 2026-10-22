import { NextRequest, NextResponse } from "next/server";
import { usuarioDoToken, tokenExpirado } from "@/lib/auth";

/**
 * Retorna os dados do usuário autenticado a partir do cookie JWT.
 * Usado pelo AuthContext para hidratar o estado no cliente.
 */
export async function GET(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token || tokenExpirado(token)) {
    return NextResponse.json({ usuario: null }, { status: 200 });
  }

  const usuario = usuarioDoToken(token);
  return NextResponse.json({ usuario }, { status: 200 });
}
