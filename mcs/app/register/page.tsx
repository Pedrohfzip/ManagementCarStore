
'use client';

import { useEffect, useState } from 'react';
import loginProvider from '@/utils/usersApi';
import { FaUserPlus } from 'react-icons/fa';
import Notification from '@/components/Notification';
import { useRouter } from 'next/navigation';
import { FaCar, FaRoad, FaShieldAlt, FaPhone } from 'react-icons/fa';

export default function RegisterPage() {
	const router = useRouter();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [senha, setSenha] = useState('');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [carModel, setCarModel] = useState('');
	const [focusField, setFocusField] = useState<'name' | 'email' | 'senha' | null>(null);
	const [notif, setNotif] = useState<{ message: string, type: "success" | "error" } | null>(null);
	const [currentSlide, setCurrentSlide] = useState(0);

	type RegisterResponse = {
		erro?: string;
		// add other properties if needed
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);
		const role = "cliente"; // Define o papel padrão como "cliente"
		try {
			const response: RegisterResponse = await loginProvider.registerUser(name, email, senha, role );
			if (response?.erro) {
				setError(response.erro);
				setNotif({ message: response.erro, type: "error" });
			} else {
				setSuccess(true);
				setNotif({ message: "Registro realizado com sucesso!", type: "success" });
				setName('');
				setEmail('');
				setSenha('');
				// Aguarda 1.2s para mostrar a mensagem de sucesso, depois redireciona para login
				setTimeout(() => {
					router.push('/login');
				}, 1200);
			}
		} catch (err: any) {
			setError(err.message || 'Erro ao registrar.');
			setNotif({ message: err.message || 'Erro ao registrar.', type: "error" });
		} finally {
			setLoading(false);
		}
	};
	const carouselSlides = [
		{
			image: 'https://images.unsplash.com/photo-1705747401901-28363172fe7e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjYXIlMjBzaG93cm9vbXxlbnwxfHx8fDE3NzAyMDU3NDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
			icon: <FaCar className="text-6xl text-white mb-6" />,
			title: 'Seu carro dos sonhos',
			description: 'Encontre o veículo perfeito para você com as melhores condições do mercado'
		},
		{
			image: 'https://images.unsplash.com/photo-1646208199109-68610835342d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjYXIlMjBkcml2aW5nJTIwcm9hZHxlbnwxfHx8fDE3NzAyMTA2Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
			icon: <FaRoad className="text-6xl text-white mb-6" />,
			title: 'Test Drive Gratuito',
			description: 'Agende um test drive e sinta a experiência de dirigir o seu próximo carro'
		},
		{
			image: 'https://images.unsplash.com/photo-1758411897888-3ca658535fdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjYXIlMjBpbnRlcmlvciUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NzAyODYyNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
			icon: <FaShieldAlt className="text-6xl text-white mb-6" />,
			title: 'Garantia e Segurança',
			description: 'Todos os veículos com garantia estendida e as melhores taxas de financiamento'
		}
	];
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
		}, 4000);
		return () => clearInterval(timer);
	}, [carouselSlides.length]);

	return (
	<div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
			{/* Loading overlay */}
			{loading && (
				<div style={{
					position: 'fixed',
					inset: 0,
					zIndex: 9999,
					background: 'rgba(15,23,42,0.8)',
					backdropFilter: 'blur(6px)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					transition: 'opacity 0.3s',
				}}>
					<div className="flex flex-col items-center gap-3">
						<span className="loader-login mb-2"></span>
						<span className="text-orange-400 font-semibold animate-fadeInLogin">Enviando...</span>
					</div>
				</div>
			)}

			{/* Left side - Carousel */}
			<div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-black relative overflow-hidden">
				<div className="absolute inset-0 opacity-5 bg-pattern"></div>
				
				{/* Carousel slides */}
				<div className="w-full h-full relative">
					{carouselSlides.map((slide, index) => (
						<div 
							key={index} 
							className="absolute inset-0 transition-opacity duration-1000"
							style={{ opacity: currentSlide === index ? 1 : 0 }}
						>
							<div className="absolute inset-0">
								<img 
									src={slide.image} 
									alt={slide.title}
									className="w-full h-full object-cover opacity-40"
								/>
								<div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
							</div>
							<div className="relative h-full flex flex-col items-center justify-center text-center px-12 z-10">
								<div className="animate-popIn">
									{slide.icon}
								</div>
								<h2 className="text-5xl font-extrabold text-white mb-4 animate-fadeInLogin">
									{slide.title}
								</h2>
								<p className="text-xl text-slate-300 max-w-md animate-fadeInLogin">
									{slide.description}
								</p>
							</div>
						</div>
					))}
				</div>

				{/* Carousel dots */}
				<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
					{carouselSlides.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
								currentSlide === index 
									? 'bg-orange-500 w-8' 
									: 'bg-white/50 hover:bg-white/75'
							}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>

				{/* Logo/Brand */}
				<div className="absolute top-10 left-10 z-20">
					<div className="flex items-center gap-3">
						<div className="bg-orange-500 p-3 rounded-lg">
							<FaCar className="text-3xl text-white" />
						</div>
						<div>
							<h3 className="text-2xl font-bold text-white">AutoPremium</h3>
							<p className="text-sm text-slate-400">Concessionária</p>
						</div>
					</div>
				</div>
			</div>

			{/* Right side - Form */}
			<div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-slate-100">
				<form
					onSubmit={handleSubmit}
					className="relative bg-white p-8 lg:p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col gap-6 border border-slate-200 animate-slideInLogin"
				>

					<label className="flex flex-col gap-2 animate-fadeInLogin">
						<span className="font-semibold text-slate-700">Nome Completo</span>
						<input
							type="text"
							className={`border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 bg-slate-50 ${
								focusField === 'name' 
									? 'border-orange-500 shadow-lg bg-white' 
									: 'border-slate-200 hover:border-slate-300'
							}`}
							value={name}
							onChange={e => setName(e.target.value)}
							onFocus={() => setFocusField('name')}
							onBlur={() => setFocusField(null)}
							required
							autoComplete="name"
							placeholder="Digite seu nome"
						/>
					</label>

					<label className="flex flex-col gap-2 animate-fadeInLogin">
						<span className="font-semibold text-slate-700">Email</span>
						<input
							type="email"
							className={`border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 bg-slate-50 ${
								focusField === 'email' 
									? 'border-orange-500 shadow-lg bg-white' 
									: 'border-slate-200 hover:border-slate-300'
							}`}
							value={email}
							onChange={e => setEmail(e.target.value)}
							onFocus={() => setFocusField('email')}
							onBlur={() => setFocusField(null)}
							required
							autoComplete="email"
							placeholder="seu@email.com"
						/>
					</label>

					<label className="flex flex-col gap-2 animate-fadeInLogin">
						<span className="font-semibold text-slate-700">Telefone</span>
						<input
							type="tel"
							className={`border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 bg-slate-50 ${
								focusField === 'phone' 
									? 'border-orange-500 shadow-lg bg-white' 
									: 'border-slate-200 hover:border-slate-300'
							}`}
							// value={phone}
							onChange={e => setPhone(e.target.value)}
							onFocus={() => setFocusField('phone')}
							onBlur={() => setFocusField(null)}
							required
							autoComplete="tel"
							placeholder="(00) 00000-0000"
						/>
					</label>

					<label className="flex flex-col gap-2 animate-fadeInLogin">
						<span className="font-semibold text-slate-700">Modelo de Interesse</span>
						<select
							className={`border-2 rounded-xl px-4 py-3 focus:outline-none transition-all duration-200 bg-slate-50 ${
								focusField === 'carModel' 
									? 'border-orange-500 shadow-lg bg-white' 
									: 'border-slate-200 hover:border-slate-300'
							}`}
							value={carModel}
							onChange={e => setCarModel(e.target.value)}
							onFocus={() => setFocusField('carModel')}
							onBlur={() => setFocusField(null)}
							required
						>
							<option value="">Selecione um modelo</option>
							<option value="sedan">Sedan</option>
							<option value="suv">SUV</option>
							<option value="hatch">Hatchback</option>
							<option value="pickup">Pickup</option>
							<option value="esportivo">Esportivo</option>
						</select>
					</label>

					{error && (
						<div className="text-red-600 text-sm text-center bg-red-50 py-2 px-4 rounded-lg animate-fadeInLogin">
							{error}
						</div>
					)}
					{success && (
						<div className="text-green-600 text-sm text-center bg-green-50 py-2 px-4 rounded-lg animate-fadeInLogin">
							✓ Mensagem enviada! Em breve entraremos em contato.
						</div>
					)}

					<button
						type="submit"
						className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl py-3 font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-orange-300 mt-2"
						disabled={loading}
					>
						{loading ? 'Enviando...' : 'Agendar Test Drive'}
					</button>

					<div className="flex items-center justify-center gap-4 pt-2 text-sm text-slate-600 animate-fadeInLogin">
						<span className="flex items-center gap-1">
							<FaPhone className="text-orange-500" />
							(11) 99999-9999
						</span>
					</div>
				</form>
			</div>

			<style jsx global>{`
				@keyframes fadeInLogin {
					from { opacity: 0; }
					to { opacity: 1; }
				}
				.animate-fadeInLogin {
					animation: fadeInLogin 0.7s cubic-bezier(.4,0,.2,1);
				}
				@keyframes slideInLogin {
					from { opacity: 0; transform: translateX(60px) scale(0.98); }
					to { opacity: 1; transform: translateX(0) scale(1); }
				}
				.animate-slideInLogin {
					animation: slideInLogin 0.7s cubic-bezier(.4,0,.2,1);
				}
				@keyframes popIn {
					0% { transform: scale(0.7); opacity: 0; }
					80% { transform: scale(1.1); opacity: 1; }
					100% { transform: scale(1); }
				}
				.animate-popIn {
					animation: popIn 0.6s cubic-bezier(.4,0,.2,1);
				}
				.loader-login {
					width: 44px;
					height: 44px;
					border: 5px solid #f97316;
					border-top: 5px solid #e0e7ef;
					border-radius: 50%;
					animation: spinLogin 0.8s linear infinite;
				}
				@keyframes spinLogin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
				.bg-pattern {
					background-image: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
					background-size: 20px 20px;
				}
			`}</style>
		</div>
	);
}
