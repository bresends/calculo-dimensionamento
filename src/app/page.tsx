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
import { PecasSelector } from "@/features/hydrant-calculation/components/pecas-selector";
import type { PecaAdicionada } from "@/features/hydrant-calculation/types";
import {
	defaultFormValues,
	hydrantFormSchema,
} from "@/features/hydrant-calculation/types/schema";
import { calcularHidraulica } from "@/features/hydrant-calculation/utils/calculations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

export default function Page() {
	const [pecasAdicionadas, setPecasAdicionadas] = useState<PecaAdicionada[]>(
		[],
	);
	const [pecasAdicionadas2, setPecasAdicionadas2] = useState<PecaAdicionada[]>(
		[],
	);

	const form = useForm<z.infer<typeof hydrantFormSchema>>({
		resolver: zodResolver(hydrantFormSchema),
		defaultValues: defaultFormValues,
	});

	// Get form values to pass to calculations
	const formValues = form.watch();

	// Calculate all hydraulic values
	const calculations = calcularHidraulica(
		formValues,
		pecasAdicionadas,
		pecasAdicionadas2,
	);

	function onSubmit(values: z.infer<typeof hydrantFormSchema>) {
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
										<p>
											v = {calculations.VELOCIDADE_MAIS_DESFAVORAVEL.toFixed(2)}{" "}
											m/s
										</p>
										<p>
											hval =
											{calculations.PERDA_CARGA_VALVULA_MAIS_DESFAVORAVEL.toFixed(
												2,
											)}
											mca
										</p>
										<p>
											Pch ={" "}
											{calculations.PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL.toFixed(
												2,
											)}{" "}
											mca
										</p>
									</li>

									<li className="space-y-2">
										<p className="font-bold">
											Calculando Fator de Vazão (K) para o Hidrante mais
											desfavorável.
										</p>
										<p>K = Qdesf / √Pdesf</p>
										<p>
											K ={" "}
											{calculations.FATOR_VAZAO_K_MAIS_DESFAVORAVEL.toFixed(2)}{" "}
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

										<PecasSelector
											pecasAdicionadas={pecasAdicionadas}
											setPecasAdicionadas={setPecasAdicionadas}
										/>

										<p>
											Comprimento Equivalente ={" "}
											{calculations.COMPRIMENTO_EQUIVALENTE}
										</p>

										<p>h = {calculations.PERDA_CARGA_ATRITO.toFixed(2)} mca</p>

										<p>
											P2desf ={" "}
											{calculations.PRESSAO_SEGUNDO_MAIS_DESFAVORAVEL.toFixed(
												2,
											)}{" "}
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
											Q ={" "}
											{calculations.VAZAO_SEGUNDO_MAIS_DESFAVORAVEL.toFixed(2)}{" "}
											l/min
										</p>
										<p>Qtotal = {calculations.VAZAO_TOTAL.toFixed(2)} l/min</p>
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
											ht = Pdesf + Perda pelo atrito (hdesf) - Perda pelo
											desnível (h)
										</p>

										<FormField
											control={form.control}
											name="distanciaMaisDesfavoravelReserva"
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
											V ={" "}
											{calculations.VELOCIDADE_ACIMA_MAIS_DESFAVORAVEL.toFixed(
												2,
											)}{" "}
											m/s (Deve ser menor que 5 m/s no recalque e 3 m/s na
											sucção)
										</p>
									</li>

									<li className="space-y-2">
										<FormField
											control={form.control}
											name="trechosRetilineosReservatorio"
											render={({ field }) => (
												<FormItem>
													<FormLabel>
														Somatória dos trechos retilíneos até o reservatório
														(m)
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

										<PecasSelector
											pecasAdicionadas={pecasAdicionadas2}
											setPecasAdicionadas={setPecasAdicionadas2}
											title="Adicionar Peças para Cálculo do Comprimento Equivalente até o Reservatório"
										/>

										<p>
											Comprimento Equivalente ={" "}
											{calculations.COMPRIMENTO_EQUIVALENTE_ACIMA.toFixed(2)} m
										</p>

										<p>
											h = {calculations.PERDA_CARGA_ATRITO_ACIMA.toFixed(2)} mca
										</p>

										<p>
											Altura Manométrica Total ={" "}
											{calculations.ALTURA_MANOMETRICA_TOTAL.toFixed(2)} mca
										</p>
									</li>

									<li className="space-y-2">
										<p className="font-bold">
											Resultado Final: Especificação da bomba
										</p>
										<p>Qtotal = {calculations.VAZAO_TOTAL.toFixed(2)} l/min</p>
										<p>
											Altura Manométrica Total ={" "}
											{calculations.ALTURA_MANOMETRICA_TOTAL.toFixed(2)} mca
										</p>
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
