// src/app/checkout/page.tsx

"use client";

import { useState, useEffect, Suspense, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
// 1. Loader2 foi adicionado à importação
import { Eye, EyeOff, Building, User, CreditCard, Check, X, Loader2 } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string;
}
interface AppliedCoupon {
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_TRIAL';
  discountValue: string | null;
}

function CheckoutForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [businessName, setBusinessName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);

  useEffect(() => {
    const planId = searchParams.get('planId');
    if (!planId) {
      toast.error('Para se registrar, por favor, escolha um plano primeiro.');
      router.push('/');
      return;
    }
    const fetchPlan = async () => {
      try {
        const response = await fetch(`/api/plans/${planId}`);
        if (!response.ok) throw new Error('Plano não encontrado');
        const data = await response.json();
        setPlan(data);
      } catch (error) { // 'error' agora é usado
        console.error("Falha ao buscar detalhes do plano:", error);
        toast.error('Não foi possível carregar os detalhes do plano.');
        router.push('/');
      } finally {
        setIsLoadingPlan(false);
      }
    };
    fetchPlan();
  }, [searchParams, router]);

  const handleApplyCoupon = async () => {
    if (!couponCode) {
      toast.error('Por favor, insira um código de cupom.');
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponCode }),
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }
      toast.success(`Cupom "${data.coupon.code}" aplicado!`);
      setAppliedCoupon(data.coupon);
    } catch (error: unknown) {
      setAppliedCoupon(null);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro ao validar o cupom.');
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Cupom removido.');
  };

  const finalPrice = useMemo(() => {
    if (!plan) return 0;
    const basePrice = Number(plan.price);
    if (!appliedCoupon) return basePrice;

    if (appliedCoupon.discountType === 'FREE_TRIAL') return 0;
    if (appliedCoupon.discountType === 'PERCENTAGE' && appliedCoupon.discountValue) {
      const discount = basePrice * (Number(appliedCoupon.discountValue) / 100);
      return Math.max(0, basePrice - discount);
    }
    if (appliedCoupon.discountType === 'FIXED' && appliedCoupon.discountValue) {
      return Math.max(0, basePrice - Number(appliedCoupon.discountValue));
    }
    return basePrice;
  }, [plan, appliedCoupon]);

  // 2. Função handleSubmit restaurada
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!plan) return;
    setIsLoading(true);

    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          userName: ownerName,
          userEmail: email,
          userPassword: password,
          businessName,
          businessSubdomain: subdomain,
          couponCode: appliedCoupon ? appliedCoupon.code : '',
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Falha ao criar a sessão de checkout.');
      }
      
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe.js não foi carregado corretamente.');
      }
      
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      
      if (error) {
        console.error('Erro ao redirecionar para a Stripe:', error);
        toast.error(error.message || 'Ocorreu um erro ao redirecionar para o pagamento.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocorreu um erro desconhecido.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoadingPlan || !plan) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  const featuresList = plan.features ? JSON.parse(plan.features) : [];

  return (
    <div className="min-h-screen bg-brand-background py-12 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* 3. Código do formulário de cadastro restaurado */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-brand-primary mb-6">Crie sua Conta</h1>
          <form onSubmit={handleSubmit} id="checkout-form" className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-accent flex items-center gap-2"><User size={22}/> Detalhes da Conta</h2>
              <Input id="ownerName" type="text" required value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Seu nome completo" />
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Seu melhor email" />
              <div className="relative">
                <Input id="password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Crie uma senha forte" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-accent">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="relative">
                <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirme sua senha" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-brand-accent">
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-accent flex items-center gap-2"><Building size={22}/> Informações do Negócio</h2>
              <Input id="businessName" type="text" required value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Nome do seu Negócio" />
              <div>
                <label htmlFor="subdomain" className="text-sm font-medium text-brand-primary">Seu endereço no CliendaApp</label>
                <div className="flex items-center mt-1">
                  <Input id="subdomain" type="text" required value={subdomain} onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="ex-minha-barbearia" className="rounded-r-none" />
                  <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 h-10">.clienda.app</span>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="lg:mt-16">
          <div className="bg-white p-8 rounded-lg shadow-md sticky top-8">
            <h2 className="text-2xl font-bold text-brand-primary mb-6">Resumo da Assinatura</h2>
            <div className="space-y-4 text-brand-primary">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">Plano Selecionado:</span>
                <span className="font-bold text-brand-accent">{plan.name}</span>
              </div>
              {featuresList.length > 0 && (
                <div className="pt-2">
                  <span className="font-semibold text-sm">Benefícios incluídos:</span>
                  <ul className="space-y-2 mt-2 text-gray-600">
                    {featuresList.map((feature: string, index: number) => (
                      <li key={index} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-green-500 flex-shrink-0"/><span>{feature}</span></li>
                    ))}
                  </ul>
                </div>
              )}
              <hr/>
              <div className="space-y-2">
                <label htmlFor="coupon" className="text-sm font-medium">Cupom de Desconto</label>
                <div className="flex gap-2">
                  <Input id="coupon" type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} placeholder="Ex: PROMO10" className="flex-grow" disabled={!!appliedCoupon}/>
                  {!appliedCoupon ? (
                    <Button type="button" variant="outline" onClick={handleApplyCoupon} disabled={isApplyingCoupon}>
                      {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Aplicar'}
                    </Button>
                  ) : (
                    // 4. Variante do botão corrigida
                    <Button type="button" variant="destructive" onClick={handleRemoveCoupon}>
                      <X className="h-4 w-4 mr-1"/> Remover
                    </Button>
                  )}
                </div>
              </div>
              <hr/>
              <div className="space-y-2">
                {appliedCoupon && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Preço Original:</span>
                    <span className="line-through">R$ {Number(plan.price).toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-xl font-bold items-baseline">
                  <span>Total Mensal:</span>
                  <span>R$ {finalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button type="submit" form="checkout-form" disabled={isLoading} className="w-full text-lg py-3">
                {isLoading ? 'Processando...' : 'Prosseguir para Pagamento'}
              </Button>
            </div>
             <div className="mt-4 text-xs text-gray-500 text-center flex items-center gap-2 justify-center"><CreditCard size={14} /> Pagamento seguro via Stripe</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}