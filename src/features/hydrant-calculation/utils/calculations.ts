import type { PecaAdicionada } from "../types";
import { PECAS } from "../types";
import type { HydrantFormValues } from "../types/schema";

export function calcularComprimentoEquivalenteTotal(
	pecasAdicionadas: PecaAdicionada[],
): number {
	return pecasAdicionadas.reduce((total, peca) => {
		const pecaBase = PECAS.find((p) => p.id === peca.pecaId);
		return total + (pecaBase?.comprimentoEquivalente || 0) * peca.quantidade;
	}, 0);
}

export function calcularHidraulica(
	values: HydrantFormValues,
	pecasAdicionadas: PecaAdicionada[],
	pecasAdicionadas2: PecaAdicionada[],
) {
	// Constantes e cálculos
	const DIAMETRO_INTERNO_MANGUEIRA = values.diametroMangueira - 2;
	const VAZAO_M3_SEGUNDO = values.vazaoMinMaisDesfavoravel / 60000;
	const VELOCIDADE_MAIS_DESFAVORAVEL =
		VAZAO_M3_SEGUNDO / (0.785 * (DIAMETRO_INTERNO_MANGUEIRA * 10 ** -3) ** 2);
	const PERDA_CARGA_VALVULA_MAIS_DESFAVORAVEL =
		(5 * VELOCIDADE_MAIS_DESFAVORAVEL ** 2) / 19.6;
	const PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL =
		values.pressaoMinMaisDesfavoravel + PERDA_CARGA_VALVULA_MAIS_DESFAVORAVEL;
	const FATOR_VAZAO_K_MAIS_DESFAVORAVEL =
		values.vazaoMinMaisDesfavoravel /
		Math.sqrt(PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL);

	// Cálculos com comprimento equivalente 1
	const COMPRIMENTO_EQUIVALENTE =
		Number(values.distanciaHidrantes) +
		calcularComprimentoEquivalenteTotal(pecasAdicionadas);

	const PERDA_CARGA_ATRITO =
		10.65 *
		VAZAO_M3_SEGUNDO ** 1.85 *
		values.fatorHazenWilliamsTubulacao ** -1.85 *
		(values.diametroTubulacao * 10 ** -3) ** -4.87 *
		COMPRIMENTO_EQUIVALENTE;

	const PRESSAO_SEGUNDO_MAIS_DESFAVORAVEL =
		PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL +
		Number(values.distanciaHidrantes) -
		PERDA_CARGA_ATRITO;

	const VAZAO_SEGUNDO_MAIS_DESFAVORAVEL =
		FATOR_VAZAO_K_MAIS_DESFAVORAVEL *
		Math.sqrt(PRESSAO_SEGUNDO_MAIS_DESFAVORAVEL);

	const VAZAO_TOTAL =
		values.vazaoMinMaisDesfavoravel + VAZAO_SEGUNDO_MAIS_DESFAVORAVEL;

	const VAZAO_TOTAL_M3 = VAZAO_TOTAL / 60000;

	// Cálculos com comprimento equivalente 2
	const VELOCIDADE_ACIMA_MAIS_DESFAVORAVEL =
		VAZAO_TOTAL_M3 /
		(0.785 * (Number(values.diametroTubulacao) * 10 ** -3) ** 2);

	const COMPRIMENTO_EQUIVALENTE_ACIMA =
		Number(values.trechosRetilineosReservatorio) +
		calcularComprimentoEquivalenteTotal(pecasAdicionadas2);

	const PERDA_CARGA_ATRITO_ACIMA =
		10.65 *
		VAZAO_TOTAL_M3 ** 1.85 *
		values.fatorHazenWilliamsTubulacao ** -1.85 *
		(values.diametroTubulacao * 10 ** -3) ** -4.87 *
		COMPRIMENTO_EQUIVALENTE_ACIMA;

	const ALTURA_MANOMETRICA_TOTAL =
		PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL +
		PERDA_CARGA_ATRITO_ACIMA -
		Number(values.distanciaMaisDesfavoravelReserva);

	return {
		DIAMETRO_INTERNO_MANGUEIRA,
		VAZAO_M3_SEGUNDO,
		VELOCIDADE_MAIS_DESFAVORAVEL,
		PERDA_CARGA_VALVULA_MAIS_DESFAVORAVEL,
		PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL,
		FATOR_VAZAO_K_MAIS_DESFAVORAVEL,
		COMPRIMENTO_EQUIVALENTE,
		PERDA_CARGA_ATRITO,
		PRESSAO_SEGUNDO_MAIS_DESFAVORAVEL,
		VAZAO_SEGUNDO_MAIS_DESFAVORAVEL,
		VAZAO_TOTAL,
		VAZAO_TOTAL_M3,
		VELOCIDADE_ACIMA_MAIS_DESFAVORAVEL,
		COMPRIMENTO_EQUIVALENTE_ACIMA,
		PERDA_CARGA_ATRITO_ACIMA,
		ALTURA_MANOMETRICA_TOTAL,
	};
}
