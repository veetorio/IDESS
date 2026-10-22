import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas que exigem autenticação
const ROTAS_PROTEGIDAS = ["/minha-conta"];

// Rotas de autenticação (redireciona se já logado)
const ROTAS_AUTH = ["/entrar", "/cadastrar"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  const estaAutenticado = Boolean(token);

  // Rota protegida sem autenticação → redireciona para /entrar
  if (ROTAS_PROTEGIDAS.some((rota) => pathname.startsWith(rota))) {
    if (!estaAutenticado) {
      const url = new URL("/entrar", request.url);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Rota de auth com usuário já logado → redireciona para home
  if (ROTAS_AUTH.includes(pathname) && estaAutenticado) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
