import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface RouteContext {
  params: Promise<{ id: string }>;
}

async function encaminhar(
  request: NextRequest,
  context: RouteContext,
  method: "PUT" | "DELETE"
) {
  if (request.headers.get("origin") !== request.nextUrl.origin) {
    return NextResponse.json(
      { message: "Origem da requisição não autorizada." },
      { status: 403 }
    );
  }
  const token = request.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ message: "Não autenticado." }, { status: 401 });

  try {
    const { id } = await context.params;
    const body = method === "PUT" ? await request.formData() : undefined;
    const resposta = await fetch(`${API_URL}/projetos/${encodeURIComponent(id)}`, {
      method,
      headers: { Authorization: `Bearer ${token}` },
      body,
      cache: "no-store",
    });
    if (resposta.status === 204) return new NextResponse(null, { status: 204 });
    const dados = await resposta.json().catch(() => null);
    return NextResponse.json(dados ?? {}, { status: resposta.status });
  } catch {
    return NextResponse.json(
      { message: "Não foi possível conectar ao backend." },
      { status: 503 }
    );
  }
}

export function PUT(request: NextRequest, context: RouteContext) {
  return encaminhar(request, context, "PUT");
}

export function DELETE(request: NextRequest, context: RouteContext) {
  return encaminhar(request, context, "DELETE");
}
