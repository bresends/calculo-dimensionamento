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
import { useForm } from "react-hook-form";
import { z } from "zod";

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
});

export default function Page() {
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
		},
	});

	const DIAMETRO_INTERNO_MANGUEIRA = form.watch("diametroMangueira") - 2;

	const VELOCIDADE_MAIS_DESFAVORAVEL =
		form.watch("vazaoMinMaisDesfavoravel") /
		60000 /
		(0.785 * (DIAMETRO_INTERNO_MANGUEIRA * 10 ** -3) ** 2);

	const PERDA_CARGA_VALVULA_MAIS_DESFAVORAVEL =
		(5 * VELOCIDADE_MAIS_DESFAVORAVEL ** 2) / 19.6;

	const PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL =
		form.watch("pressaoMinMaisDesfavoravel") +
		PERDA_CARGA_VALVULA_MAIS_DESFAVORAVEL;

	const FATOR_VAZAO_K_MAIS_DESFAVORAVEL =
		form.watch("vazaoMinMaisDesfavoravel") /
		Math.sqrt(PRESSAO_HIDRANTE_MAIS_DESFAVORAVEL);

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

										<p>
											K = {FATOR_VAZAO_K_MAIS_DESFAVORAVEL.toFixed(2)}{" "}
											l/min/mca½
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
