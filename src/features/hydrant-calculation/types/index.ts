// Definição das peças e seus comprimentos equivalentes
export interface Peca {
	id: string;
	nome: string;
	comprimentoEquivalente: number;
	diametros: number[]; // diâmetros compatíveis em mm
}

// Peça adicionada pelo usuário
export interface PecaAdicionada {
	id: string;
	pecaId: string;
	quantidade: number;
	diametro: number;
}

// Lista de peças disponíveis
export const PECAS: Peca[] = [
	{
		id: "joelho90",
		nome: "Joelho 90°",
		comprimentoEquivalente: 2.0,
		diametros: [25, 32, 40, 50, 65, 80, 100],
	},
	{
		id: "joelho45",
		nome: "Joelho 45°",
		comprimentoEquivalente: 1.0,
		diametros: [25, 32, 40, 50, 65, 80, 100],
	},
	{
		id: "te_passagem_direita",
		nome: "Tê - Passagem Direita",
		comprimentoEquivalente: 4.3,
		diametros: [25, 32, 40, 50, 65, 80, 100],
	},
	{
		id: "te_passagem_direta",
		nome: "Tê - Passagem Direta",
		comprimentoEquivalente: 1.3,
		diametros: [25, 32, 40, 50, 65, 80, 100],
	},
	{
		id: "valvula_gaveta",
		nome: "Válvula de Gaveta",
		comprimentoEquivalente: 0.4,
		diametros: [25, 32, 40, 50, 65, 80, 100],
	},
	{
		id: "valvula_globo",
		nome: "Válvula de Globo",
		comprimentoEquivalente: 15.0,
		diametros: [25, 32, 40, 50, 65, 80, 100],
	},
	{
		id: "valvula_retencao_vertical",
		nome: "Válvula de Retenção Vertical",
		comprimentoEquivalente: 8.1,
		diametros: [25, 32, 40, 50, 65, 80, 100],
	},
	{
		id: "entrada_borda",
		nome: "Entrada de Borda",
		comprimentoEquivalente: 1.9,
		diametros: [25, 32, 40, 50, 65, 80, 100],
	},
];
