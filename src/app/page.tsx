// Caminho: src/app/page.tsx

import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import PricingSection from '@/components/marketing/PricingSection';
// ALTERAÇÃO: 'Check' foi removido da lista de importação abaixo
import { MessageCircle, CalendarDays, Users, BarChart3, Package, BellRing, Mail, Phone, Star } from 'lucide-react';
import Link from 'next/link';

export interface SerializablePlan {
  id: string;
  name: string;
  description: string | null;
  price: string;
  features: string;
  active: boolean;
}

export default async function LandingPage() {
  
  const activePlans = await prisma.plan.findMany({
    where: { active: true },
    orderBy: { price: 'asc' },
  });

  const serializablePlans: SerializablePlan[] = activePlans.map(plan => ({
    ...plan,
    price: plan.price.toString(),
    features: JSON.stringify(plan.features), 
  }));

  return (
    <div className="bg-brand-background text-brand-primary">
      <Header />
      
      <main>
        {/* Seção Hero */}
        <section className="pt-32 pb-24 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">A gestão da sua agenda,<br /><span className="text-brand-accent">finalmente no automático.</span></h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">O Tracke.me usa Inteligência Artificial para que os seus clientes agendem horários pelo WhatsApp, enquanto você organiza tudo num só lugar. Simples, rápido e profissional.</p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="#pricing" className="w-full sm:w-auto bg-brand-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-transform hover:scale-105">Ver Planos e Preços</Link>
            </div>
          </div>
        </section>

        {/* Seção Features */}
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                  <span className="text-brand-accent font-semibold">FUNCIONALIDADES</span>
                  <h2 className="text-3xl md:text-4xl font-bold mt-2">Tudo o que você precisa para crescer</h2>
                  <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Ferramentas poderosas e intuitivas para elevar o nível do seu atendimento e gestão.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-brand-background p-6 rounded-lg"><MessageCircle className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Agendamento por IA</h3><p className="text-gray-600">O seu assistente virtual 24/7. Deixe a nossa IA marcar, desmarcar e confirmar agendamentos via WhatsApp.</p></div>
                  <div className="bg-brand-background p-6 rounded-lg"><CalendarDays className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Agenda Inteligente</h3><p className="text-gray-600">Visualize e gira seus compromissos por dia, semana ou mês. Defina seus horários e bloqueios com facilidade.</p></div>
                  <div className="bg-brand-background p-6 rounded-lg"><Users className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Base de Clientes (CRM)</h3><p className="text-gray-600">Tenha o histórico de cada cliente na palma da sua mão. Anote preferências e nunca mais perca um contato importante.</p></div>
                  <div className="bg-brand-background p-6 rounded-lg"><Package className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Gestão de Pacotes</h3><p className="text-gray-600">Crie pacotes de serviços (ex: 4 cortes por mês) e aumente a fidelidade e o faturamento recorrente dos seus clientes.</p></div>
                  <div className="bg-brand-background p-6 rounded-lg"><BellRing className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Lembretes Automáticos</h3><p className="text-gray-600">Reduza as faltas e no-shows com lembretes automáticos enviados diretamente para o WhatsApp do seu cliente.</p></div>
                  <div className="bg-brand-background p-6 rounded-lg"><BarChart3 className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Relatórios Simples</h3><p className="text-gray-600">Entenda a performance do seu negócio com relatórios de agendamentos e serviços mais populares.</p></div>
                </div>
            </div>
        </section>

        {/* Seção de Planos agora é dinâmica */}
        <PricingSection plans={serializablePlans} />

        {/* Seção Premium Services */}
        <section id="premium-services" className="py-20 bg-brand-accent-light">
          <div className="container mx-auto px-6 text-center">
              <Star className="h-10 w-10 text-brand-accent mx-auto mb-4" /><h2 className="text-3xl font-bold text-brand-primary">Leve sua gestão para o próximo nível</h2>
              <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">Gosta do nosso serviço e nossa interface e deseja funcionalidades e serviços <span className="font-semibold text-brand-primary">personalizadas premium</span>? Entre em contato com nossa equipe!</p>
              <div className="mt-8">
                  <Link href="mailto:premium@tracke.me?subject=Contato%20para%20Serviços%20Premium" className="bg-brand-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-transform hover:scale-105">Solicitar Orçamento Premium</Link>
              </div>
          </div>
        </section>

        {/* Seção Contato Geral */}
        <section id="contact" className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Tem alguma dúvida?</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">A nossa equipe está pronta para ajudar a encontrar o plano perfeito e a alavancar o seu negócio. Entre em contato!</p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-8">
                    <a href="mailto:contato@tracke.me" className="flex items-center gap-3 text-lg text-gray-700 hover:text-brand-accent"><Mail className="h-6 w-6"/><span className="font-semibold">contato@tracke.me</span></a>
                    <a href="https://wa.me/5516999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg text-gray-700 hover:text-brand-accent"><Phone className="h-6 w-6"/><span className="font-semibold">+55 (16) 99999-9999</span></a>
                </div>
            </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Tracke.me. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}