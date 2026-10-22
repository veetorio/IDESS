import { describe, it, expect } from "vitest";
import { cn, formatarData, vagasRestantes, eventoDisponivel } from "@/lib/utils";

describe("utils", () => {
  describe("cn()", () => {
    it("combina classes sem conflito", () => {
      expect(cn("px-4", "py-2")).toBe("px-4 py-2");
    });

    it("resolve conflitos do tailwind", () => {
      expect(cn("px-4", "px-8")).toBe("px-8");
    });
  });

  describe("formatarData()", () => {
    it("formata data ISO para pt-BR", () => {
      const resultado = formatarData("2024-06-15T10:00:00Z");
      expect(resultado).toContain("junho");
      expect(resultado).toContain("2024");
    });
  });

  describe("vagasRestantes()", () => {
    it("retorna vagas restantes corretamente", () => {
      expect(vagasRestantes(30, 100)).toBe(70);
    });

    it("nunca retorna valor negativo", () => {
      expect(vagasRestantes(110, 100)).toBe(0);
    });
  });

  describe("eventoDisponivel()", () => {
    it("retorna true quando aberto e com vagas", () => {
      expect(eventoDisponivel(true, 5, 10)).toBe(true);
    });

    it("retorna false quando evento fechado", () => {
      expect(eventoDisponivel(false, 5, 10)).toBe(false);
    });

    it("retorna false quando vagas esgotadas", () => {
      expect(eventoDisponivel(true, 10, 10)).toBe(false);
    });
  });
});
