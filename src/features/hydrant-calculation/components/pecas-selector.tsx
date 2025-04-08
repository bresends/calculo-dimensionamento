import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { PECAS, Peca, type PecaAdicionada } from "../types";

interface PecasSelectorProps {
	pecasAdicionadas: PecaAdicionada[];
	setPecasAdicionadas: (pecas: PecaAdicionada[]) => void;
	title?: string;
}

export function PecasSelector({
	pecasAdicionadas,
	setPecasAdicionadas,
	title = "Adicionar Peças para Cálculo do Comprimento Equivalente",
}: PecasSelectorProps) {
	const [novaPeca, setNovaPeca] = useState({
		pecaId: "",
		quantidade: 1,
		diametro: 65,
	});

	const adicionarPeca = () => {
		if (novaPeca.pecaId) {
			setPecasAdicionadas([
				...pecasAdicionadas,
				{
					id: Math.random().toString(36).substr(2, 9),
					...novaPeca,
				},
			]);
			setNovaPeca({
				pecaId: "",
				quantidade: 1,
				diametro: 65,
			});
		}
	};

	const removerPeca = (id: string) => {
		setPecasAdicionadas(pecasAdicionadas.filter((p) => p.id !== id));
	};

	const calcularComprimentoEquivalenteTotal = () => {
		return pecasAdicionadas.reduce((total, peca) => {
			const pecaBase = PECAS.find((p) => p.id === peca.pecaId);
			return total + (pecaBase?.comprimentoEquivalente || 0) * peca.quantidade;
		}, 0);
	};

	return (
		<div className="space-y-4 border p-4 rounded-lg">
			<h3 className="font-semibold">{title}</h3>
			<div className="flex gap-4">
				<Select
					value={novaPeca.pecaId}
					onValueChange={(valor) => setNovaPeca({ ...novaPeca, pecaId: valor })}
				>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Selecione uma peça" />
					</SelectTrigger>
					<SelectContent>
						{PECAS.map((peca) => (
							<SelectItem key={peca.id} value={peca.id}>
								{peca.nome}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select
					value={String(novaPeca.diametro)}
					onValueChange={(valor) =>
						setNovaPeca({
							...novaPeca,
							diametro: Number(valor),
						})
					}
				>
					<SelectTrigger className="w-[200px]">
						<SelectValue placeholder="Selecione o diâmetro" />
					</SelectTrigger>
					<SelectContent>
						{PECAS.find((p) => p.id === novaPeca.pecaId)?.diametros.map(
							(diametro) => (
								<SelectItem key={diametro} value={String(diametro)}>
									{diametro} mm
								</SelectItem>
							),
						) || []}
					</SelectContent>
				</Select>

				<Input
					type="number"
					min={1}
					value={novaPeca.quantidade}
					onChange={(e) =>
						setNovaPeca({
							...novaPeca,
							quantidade: Number.parseInt(e.target.value) || 1,
						})
					}
					className="w-[100px]"
					placeholder="Qtd"
				/>

				<Button
					type="button"
					onClick={adicionarPeca}
					disabled={!novaPeca.pecaId}
				>
					<Plus className="w-4 h-4 mr-2" />
					Adicionar
				</Button>
			</div>

			<div className="space-y-2">
				{pecasAdicionadas.map((peca) => {
					const pecaBase = PECAS.find((p) => p.id === peca.pecaId);
					return (
						<div
							key={peca.id}
							className="flex items-center justify-between bg-muted p-2 rounded"
						>
							<span>
								{pecaBase?.nome} - {peca.diametro}mm (x
								{peca.quantidade})
							</span>
							<div className="flex items-center gap-4">
								<span>
									{(
										(pecaBase?.comprimentoEquivalente || 0) * peca.quantidade
									).toFixed(2)}
									m
								</span>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => removerPeca(peca.id)}
								>
									<Trash2 className="w-4 h-4" />
								</Button>
							</div>
						</div>
					);
				})}

				{pecasAdicionadas.length > 0 && (
					<div className="flex justify-between items-center font-semibold pt-2 border-t">
						<span>Comprimento Equivalente Total:</span>
						<span>{calcularComprimentoEquivalenteTotal().toFixed(2)}m</span>
					</div>
				)}
			</div>
		</div>
	);
}
