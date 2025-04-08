import { z } from "zod";

export const hydrantFormSchema = z.object({
	tipoReserva: z.enum(["superior", "inferior"]),
	tipoOcupacao: z.enum(["A2"]),
	area: z.number(),
	reserva: z.number(),
	tipoSistema: z.enum(["1", "2"]),
	pressaoMinMaisDesfavoravel: z.number(),
	vazaoMinMaisDesfavoravel: z.number(),
	diametroMangueira: z.number(),
	diametroEsguicho: z.number(),
	diametroTubulacao: z.number(),
	fatorHazenWilliamsTubulacao: z.number(),
	distanciaHidrantes: z.number(),
	distanciaMaisDesfavoravelReserva: z.number(),
	trechosRetilineosReservatorio: z.number(),
});

export type HydrantFormValues = z.infer<typeof hydrantFormSchema>;

export const defaultFormValues: Partial<HydrantFormValues> = {
	tipoReserva: "superior",
	tipoOcupacao: "A2",
	area: 100,
	reserva: 100,
	pressaoMinMaisDesfavoravel: 30,
	vazaoMinMaisDesfavoravel: 150,
	diametroMangueira: 40,
	diametroEsguicho: 40,
	diametroTubulacao: 63,
	fatorHazenWilliamsTubulacao: 120,
	distanciaHidrantes: 0,
	distanciaMaisDesfavoravelReserva: 0,
	trechosRetilineosReservatorio: 0,
};
