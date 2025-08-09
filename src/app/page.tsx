// Caminho: src/app/page.tsx

import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import PricingSection from '@/components/marketing/PricingSection';
import { MessageCircle, CalendarDays, Users, BarChart3, Package, BellRing, Mail } from 'lucide-react';
import Link from 'next/link';

export interface SerializablePlan {
  id: string;
  name: string;
  description: string | null;
  price: string;
  features: string;
  active: boolean;
}

// Dados de exemplo para testemunhos.
const testimonials = [
  {
    name: "Júlia Santos",
    role: "Dona de Salão de Beleza",
    quote: "O CliendaApp mudou o jogo. A IA no WhatsApp poupa-me 2 horas por dia. Os cancelamentos de última hora diminuíram 80% graças aos lembretes automáticos. Finalmente posso focar nas minhas clientes.",
    avatar: "JS"
  },
  {
    name: "Ricardo Mendes",
    role: "Barbeiro",
    quote: "Nunca pensei que um sistema pudesse ser tão fácil. Em 15 minutos configurei tudo. Os meus clientes adoram a facilidade de agendar sozinhos, e a minha agenda nunca esteve tão organizada e cheia.",
    avatar: "RM"
  },
  {
    name: "Mariana Costa",
    role: "Proprietária de Spa Terapêutico",
    quote: "O CliendaApp trouxe uma paz que eu não tinha. A IA lida com os agendamentos e eu consigo focar 100% no bem-estar das minhas clientes. É profissional, simples e eficaz. Recomendo de olhos fechados.",
    avatar: "MC"
  }
];


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
        {/* Seção Hero - MAIS IMPACTANTE */}
        <section className="pt-32 pb-24 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">
              A sua agenda cheia, <br /> <span className="text-brand-accent">sem o seu esforço.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              O CliendaApp é o seu recepcionista virtual. Deixe a nossa Inteligência Artificial agendar por si no WhatsApp e dedique-se ao que realmente importa: os seus clientes.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="#pricing" className="w-full sm:w-auto bg-brand-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-transform hover:scale-105">
                Começar Agora
              </Link>
              <Link href="#contact" className="w-full sm:w-auto text-brand-accent font-semibold hover:underline">
                Fale com um especialista
              </Link>
            </div>
          </div>
        </section>

        {/* Seção Features - FOCADA EM BENEFÍCIOS */}
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                  <span className="text-brand-accent font-semibold uppercase tracking-wider">Funcionalidades</span>
                  <h2 className="text-3xl md:text-4xl font-bold mt-2">Menos tempo a gerir, mais tempo a faturar</h2>
                  <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Ferramentas desenhadas para resolver os seus maiores desafios diários.</p>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-brand-background p-6 rounded-lg border border-gray-200"><MessageCircle className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Deixe o WhatsApp trabalhar por si</h3><p className="text-gray-600">A nossa IA responde, agenda e confirma horários 24/7, para que você não perca nenhum cliente, mesmo fora do horário de expediente.</p></div>
                  <div className="bg-brand-background p-6 rounded-lg border border-gray-200"><CalendarDays className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Tenha controle total da sua agenda</h3><p className="text-gray-600">Com uma visão diária, semanal ou mensal, organize os seus dias, defina os seus horários de trabalho e bloqueie datas com apenas um clique.</p></div>
                  <div className="bg-brand-background p-6 rounded-lg border border-gray-200"><Users className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Conheça os seus clientes a fundo</h3><p className="text-gray-600">Aceda ao histórico completo, anote preferências e informações importantes. Ofereça um serviço personalizado que os fará voltar sempre.</p></div>
                  <div className="bg-brand-background p-6 rounded-lg border border-gray-200"><Package className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Crie receita recorrente com pacotes</h3><p className="text-gray-600">Ofereça pacotes de serviços (ex: 4 cortes por mês) e garanta um fluxo de caixa previsível, aumentando a fidelidade dos seus clientes.</p></div>
                  <div className="bg-brand-background p-6 rounded-lg border border-gray-200"><BellRing className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Reduza as faltas a zero</h3><p className="text-gray-600">Diminua drasticamente o &quot;não comparecimento&quot; com lembretes automáticos e inteligentes enviados diretamente para o WhatsApp do seu cliente.</p></div>
                  <div className="bg-brand-background p-6 rounded-lg border border-gray-200"><BarChart3 className="h-10 w-10 text-brand-accent mb-4" /><h3 className="text-xl font-bold mb-2">Tome decisões baseadas em dados</h3><p className="text-gray-600">Descubra quais são os seus serviços mais rentáveis e os seus clientes mais fiéis com relatórios simples e diretos.</p></div>
                </div>
            </div>
        </section>
        
        {/* SEÇÃO ATUALIZADA: Prova Social (Testemunhos) */}
        <section id="testimonials" className="py-20 bg-brand-background">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">Amado por negócios como o seu</h2>
              <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">Não acredite apenas na nossa palavra. Veja o que os nossos clientes dizem.</p>
            </div>
            <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-lg shadow-lg border">
                  <p className="text-gray-700 italic">&quot;{testimonial.quote}&quot;</p>
                  <div className="flex items-center mt-6">
                    <div className="w-12 h-12 rounded-full bg-brand-accent-light flex items-center justify-center text-brand-primary font-bold text-xl">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-brand-primary">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Seção de Planos agora é dinâmica */}
        <PricingSection plans={serializablePlans} />

        {/* Seção Contato Geral */}
        <section id="contact" className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Pronto para transformar o seu negócio?</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">A nossa equipa está pronta para ajudar a encontrar o plano perfeito e a alavancar o seu negócio. Entre em contato!</p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-8">
                    <a href="mailto:contato@clienda.app" className="flex items-center gap-3 text-lg text-gray-700 hover:text-brand-accent"><Mail className="h-6 w-6"/><span className="font-semibold">contato@clienda.app</span></a>
                </div>
            </div>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-white border-t">
        <div className="container mx-auto px-6 py-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} CliendaApp. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}