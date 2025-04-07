"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Definição das peças e seus comprimentos equivalentes
interface Peca {
	id: string;
	nome: string;
	comprimentoEquivalente: number;
	diametros: number[]; // diâmetros compatíveis em mm
}

const PECAS: Peca[] = [
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
		id: "te_passagem",
		nome: "Tê - Passagem Direta",
		comprimentoEquivalente: 4.3,
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
		id: "valvula_retencao",
		nome: "Válvula de Retenção",
		comprimentoEquivalente: 4.0,
		diametros: [25, 32, 40, 50, 65, 80, 100],
	},
	{
		id: "reducao",
		nome: "Redução",
		comprimentoEquivalente: 1.0,
		diametros: [25, 32, 40, 50, 65, 80, 100],
	},
];

// Peça adicionada pelo usuário
interface PecaAdicionada {
	id: string;
	pecaId: string;
	quantidade: number;
	diametro: number;
}

const formSchema = z.object({
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
	distanciaMaisFavoravelReserva: z.number(),
});

export default function Page() {
	const [pecasAdicionadas, setPecasAdicionadas] = useState<PecaAdicionada[]>(
		[],
	);
	const [novaPeca, setNovaPeca] = useState({
		pecaId: "",
		quantidade: 1,
		diametro: 65,
	});

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
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
			distanciaMaisFavoravelReserva: 0,
		},
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

	const DIAMETRO_INTERNO_MANGUEIRA = form.watch("diametroMangueira") - 2;

	const VAZAO_M3_SEGUNDO = form.watch("vazaoMinMaisDesfavoravel") / 60000;

	const VELOCIDADE_MAIS_DESFAVORAVEL =
		VAZAO_M3_SEGUNDO / (0.785 * (DIAMETRO_INTERNO_MANGUEIRA * 10 ** -3) ** 2);

	const PERDA_CARGA_VALVULA_MAIS_DESFAVORAVEL =
		(5 * VELOCIDADE_MAIS_DESFAVORAVEL ** 2) / 19.6;

	const PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL =
		form.watch("pressaoMinMaisDesfavoravel") +
		PERDA_CARGA_VALVULA_MAIS_DESFAVORAVEL;

	const FATOR_VAZAO_K_MAIS_DESFAVORAVEL =
		form.watch("vazaoMinMaisDesfavoravel") /
		Math.sqrt(PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL);

	const COMPRIMENTO_EQUIVALENTE =
		Number(form.watch("distanciaHidrantes")) +
		calcularComprimentoEquivalenteTotal();

	const PERDA_CARGA_ATRITO =
		10.65 *
		VAZAO_M3_SEGUNDO ** 1.85 *
		form.watch("fatorHazenWilliamsTubulacao") ** -1.85 *
		(form.watch("diametroTubulacao") * 10 ** -3) ** -4.87 *
		COMPRIMENTO_EQUIVALENTE;

	const PRESSAO_SEGUNDO_MAIS_DESFAVORAVEL =
		PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL +
		Number(form.watch("distanciaHidrantes")) -
		PERDA_CARGA_ATRITO;

	const VAZAO_SEGUNDO_MAIS_DESFAVORAVEL =
		FATOR_VAZAO_K_MAIS_DESFAVORAVEL *
		Math.sqrt(PRESSAO_SEGUNDO_MAIS_DESFAVORAVEL);

	const VAZAO_TOTAL =
		form.watch("vazaoMinMaisDesfavoravel") + VAZAO_SEGUNDO_MAIS_DESFAVORAVEL;

	const VELOCIDADE_ACIMA_MAIS_DESFAVORAVEL =
		VAZAO_TOTAL /
		60000 /
		(0.785 * (Number(form.watch("diametroTubulacao")) * 10 ** -3) ** 2);

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
						<Separator
							orientation="vertical"
							className="mr-2 data-[orientation=vertical]:h-4"
						/>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem className="hidden md:block">
									<BreadcrumbLink href="#">
										Cálculo de Dimensionamento
									</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator className="hidden md:block" />
								<BreadcrumbItem>
									<BreadcrumbPage>Hidrantes</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</header>
				<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8 w-full"
						>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
								<FormField
									control={form.control}
									name="tipoReserva"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tipo de Reservatório</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Selecione o tipo de reservatório" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="superior">Superior</SelectItem>
													<SelectItem value="inferior">Inferior</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="tipoOcupacao"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tipo de Ocupação</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Selecione o tipo de ocupação" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="A2">
														A-2 (Multifamiliar)
													</SelectItem>
												</SelectContent>
											</Select>
											<FormDescription>
												Qual o tipo de ocupação da edificação?{" "}
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="area"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Área da Edificação (m²)</FormLabel>
											<FormControl>
												<Input type="number" min={100} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="reserva"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Volume da reserva técnica (m³)</FormLabel>
											<FormControl>
												<Input type="number" min={100} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="tipoSistema"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Tipo de Reservatório</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Selecione o tipo sistema de Combate" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="1">Tipo 1</SelectItem>
													<SelectItem value="2">Tipo 2</SelectItem>
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="pressaoMinMaisDesfavoravel"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Pressão mínima no hidrante mais desfavorável (mca)
											</FormLabel>
											<FormControl>
												<Input type="number" min={100} {...field} />
											</FormControl>
											<FormMessage />
											<FormDescription>
												Pressão na válvula angular do hidrante.
											</FormDescription>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="vazaoMinMaisDesfavoravel"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Vazão mínima no hidrante mais desfavorável (l/min)
											</FormLabel>
											<FormControl>
												<Input type="number" min={100} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="diametroMangueira"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Diâmetro da Mangueira (mm)</FormLabel>
											<FormControl>
												<Input type="number" min={30} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="diametroEsguicho"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Diâmetro do Esguicho (mm)</FormLabel>
											<FormControl>
												<Input type="number" min={30} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="diametroTubulacao"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Diâmetro da Tubulação (mm)</FormLabel>
											<FormControl>
												<Input type="number" min={30} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="fatorHazenWilliamsTubulacao"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												Fator de Hazen-Williams da tubulação (mm)
											</FormLabel>
											<FormControl>
												<Input type="number" min={30} {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<Separator />

							<h1 className="font-bold">
								Primeira Etapa - Vazão total do sistema
							</h1>

							<div className="grid grid-cols-1 md:grid-cols-1 gap-1 items-start">
								<p>
									Vazão Total = Soma das vazões dos dois hidrantes mais
									desfavoráveis
								</p>

								<p>QT = Qh5({form.watch("vazaoMinMaisDesfavoravel")}) + Qh4</p>
							</div>

							<Separator />

							<div className="grid grid-cols-1 md:grid-cols-1 gap-1 items-start">
								<p>
									Para encontrar a vazão do Segundo Hidrante mais desfavorável
									seguimos a sequência
								</p>
								<ol className="list-decimal ml-4">
									<li className="space-y-2">
										<p className="font-bold">
											Calculando Pressão no Hidrante mais Desfavorável.
										</p>
										<p>
											Para isso precisamos da perda de Carga da válvula angular
										</p>
										<p>
											Pch5 = Pressão Residual (Pr) + Perda de Charga do Esguicho
											(hesg) + Perda de Charga do Magueira (hman) + Perda de
											Carga da Válvula (hval) + Perda de Canalização (hcan) +/-
											Perda de Carga do Desnível (hd)
										</p>
										<p>
											Como não há perda de carga residual e já sei que a pressão
											na Válvula é {form.watch("pressaoMinMaisDesfavoravel")}{" "}
											mca
										</p>
										<p>
											Pch = {form.watch("pressaoMinMaisDesfavoravel")} + Perda
											de Carga da Válvula (hval)
										</p>
										<p>hval = k (coef singularidade) * (v²/2g)</p>
										<p>Para Válvula de Globo Angular k = 5</p>
										<p>
											Precisamos encontrar a velocidade que é dada por v = Q / A
										</p>
										<p>v = {VELOCIDADE_MAIS_DESFAVORAVEL.toFixed(2)} m/s</p>
										<p>
											hval ={PERDA_CARGA_VALVULA_MAIS_DESFAVORAVEL.toFixed(2)}
											mca
										</p>
										<p>
											Pch = {PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL.toFixed(2)} mca
										</p>
									</li>

									<li className="space-y-2">
										<p className="font-bold">
											Calculando Fator de Vazão (K) para o Hidrante mais
											desfavorável.
										</p>
										<p>K = Qdesf / √Pdesf</p>
										<p>
											K = {FATOR_VAZAO_K_MAIS_DESFAVORAVEL.toFixed(2)}{" "}
											l/min/mca½
										</p>
									</li>

									<li className="space-y-2">
										<p className="font-bold">
											Calculando a Pressão no segundo hidrante mais
											desfavorável.
										</p>
										<p>
											P2desf = Pdesf + Perda de Carga pelo desnível no trecho
											(hd) - Perda de Carga por atrito (h)
										</p>

										<FormField
											control={form.control}
											name="distanciaHidrantes"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Distâncias entre os hidrantes mais desfavoráveis (m)
													</FormLabel>
													<FormControl>
														<Input type="number" min={0} {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<p>
											Calculando Perda de Carga por atrito (h) por
											Hazen-Williams
										</p>
										<p>
											h = 10.65 * Q^(1.85) * C^(-1.85) * d^(-4.87) * Comprimento
											Equivalente Total (I){" "}
										</p>

										<div className="space-y-4 border p-4 rounded-lg">
											<h3 className="font-semibold">
												Adicionar Peças para Cálculo do Comprimento Equivalente
											</h3>
											<div className="flex gap-4">
												<Select
													value={novaPeca.pecaId}
													onValueChange={(valor) =>
														setNovaPeca({ ...novaPeca, pecaId: valor })
													}
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
														{PECAS.find(
															(p) => p.id === novaPeca.pecaId,
														)?.diametros.map((diametro) => (
															<SelectItem
																key={diametro}
																value={String(diametro)}
															>
																{diametro} mm
															</SelectItem>
														)) || []}
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
													const pecaBase = PECAS.find(
														(p) => p.id === peca.pecaId,
													);
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
																		(pecaBase?.comprimentoEquivalente || 0) *
																		peca.quantidade
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
														<span>
															{calcularComprimentoEquivalenteTotal().toFixed(2)}
															m
														</span>
													</div>
												)}
											</div>
										</div>

										<p>Comprimento Equivalente = {COMPRIMENTO_EQUIVALENTE}</p>

										<p>h = {PERDA_CARGA_ATRITO.toFixed(2)} mca</p>

										<p>
											P2desf = {PRESSAO_SEGUNDO_MAIS_DESFAVORAVEL.toFixed(2)}{" "}
											mca
										</p>
									</li>

									<li className="space-y-2">
										<p className="font-bold">
											Calculando a vazão (K) para o Segundo Hidrante mais
											desfavorável usando o fator de vazão.
										</p>
										<p>Q2desf = K * √P2desf</p>
										<p>
											Q = {VAZAO_SEGUNDO_MAIS_DESFAVORAVEL.toFixed(2)} l/min
										</p>
										<p>Qtotal = {VAZAO_TOTAL.toFixed(2)} l/min</p>
									</li>
								</ol>
							</div>

							<Separator />

							<div className="grid grid-cols-1 md:grid-cols-1 gap-1 items-start">
								<p>Encontramos agora a altura manométrica</p>
								<ol className="list-decimal ml-4">
									<li className="space-y-2">
										<p className="font-bold">
											Usamos a distância sempre do barrilete mais distante.
										</p>
										<p>
											ht = Pdesf + Perda de Charga do Magueira (hman) - Perda de
											Charga do Magueira (hman)
										</p>

										<FormField
											control={form.control}
											name="distanciaMaisFavoravelReserva"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Distâncias entre o hidrante mais desfavorável e
														reserva técnica (m)
													</FormLabel>
													<FormControl>
														<Input type="number" min={0} {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>
									</li>

									<li className="space-y-2">
										<p className="font-bold">
											Calculando a Velocidade para o trecho superior (para
											verificar diâmetro da tubulação)
										</p>
										<p>V = Qtotal / Area</p>
										<p>
											V = {VELOCIDADE_ACIMA_MAIS_DESFAVORAVEL.toFixed(2)} m/s
											(Deve ser menor que 5 m/s no recalque e 3 m/s na sucção)
										</p>
									</li>

									<li className="space-y-2">
										<p className="font-bold">
											Calculando a Perda de carga do Hidrante mais desfavorável
											até o reservatório.
										</p>
										<p>
											P2desf = Pdesf + Perda de Carga pelo desnível no trecho
											(hd) - Perda de Carga por atrito (h)
										</p>

										<FormField
											control={form.control}
											name="distanciaHidrantes"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Distâncias entre os hidrantes mais desfavoráveis (m)
													</FormLabel>
													<FormControl>
														<Input type="number" min={0} {...field} />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<p>
											Calculando Perda de Carga por atrito (h) por
											Hazen-Williams
										</p>
										<p>
											h = 10.65 * Q^(1.85) * C^(-1.85) * d^(-4.87) * Comprimento
											Equivalente Total (I){" "}
										</p>

										<div className="space-y-4 border p-4 rounded-lg">
											<h3 className="font-semibold">
												Adicionar Peças para Cálculo do Comprimento Equivalente
											</h3>
											<div className="flex gap-4">
												<Select
													value={novaPeca.pecaId}
													onValueChange={(valor) =>
														setNovaPeca({ ...novaPeca, pecaId: valor })
													}
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
														{PECAS.find(
															(p) => p.id === novaPeca.pecaId,
														)?.diametros.map((diametro) => (
															<SelectItem
																key={diametro}
																value={String(diametro)}
															>
																{diametro} mm
															</SelectItem>
														)) || []}
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
													const pecaBase = PECAS.find(
														(p) => p.id === peca.pecaId,
													);
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
																		(pecaBase?.comprimentoEquivalente || 0) *
																		peca.quantidade
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
														<span>
															{calcularComprimentoEquivalenteTotal().toFixed(2)}
															m
														</span>
													</div>
												)}
											</div>
										</div>

										<p>Comprimento Equivalente = {COMPRIMENTO_EQUIVALENTE}</p>

										<p>h = {PERDA_CARGA_ATRITO.toFixed(2)} mca</p>

										<p>
											P2desf = {PRESSAO_SEGUNDO_MAIS_DESFAVORAVEL.toFixed(2)}{" "}
											mca
										</p>
									</li>

									<li className="space-y-2">
										<p className="font-bold">
											Calculando a vazão (K) para o Segundo Hidrante mais
											desfavorável usando o fator de vazão.
										</p>
										<p>Q2desf = K * √P2desf</p>
										<p>
											Q = {VAZAO_SEGUNDO_MAIS_DESFAVORAVEL.toFixed(2)} l/min
										</p>
										<p>Qtotal = {VAZAO_TOTAL.toFixed(2)} l/min</p>
									</li>
								</ol>
							</div>

							<Button type="submit">Calcular</Button>
						</form>
					</Form>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
