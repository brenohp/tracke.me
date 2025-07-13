// Caminho: src/app/page.tsx
import Header from '@/components/Header';
// 1. Novos ícones importados
import { MessageCircle, CalendarDays, Users, BarChart3, Package, BellRing, Mail, Phone, Check, Star } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="bg-brand-background text-brand-primary">
      <Header />
      
      <main>
        {/* Secção Principal (Hero) */}
        <section className="pt-32 pb-24 text-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tighter">
              A gestão da sua agenda,
              <br />
              <span className="text-brand-accent">finalmente no automático.</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
              O Tracke.me usa Inteligência Artificial para que os seus clientes agendem horários pelo WhatsApp, enquanto você organiza tudo num só lugar. Simples, rápido e profissional.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
              <Link href="#pricing" className="w-full sm:w-auto bg-brand-accent text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-transform hover:scale-105">
                Ver Planos e Preços
              </Link>
            </div>
          </div>
        </section>

        {/* Secção de Funcionalidades */}
        <section id="features" className="py-20 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                  <span className="text-brand-accent font-semibold">FUNCIONALIDADES</span>
                  <h2 className="text-3xl md:text-4xl font-bold mt-2">Tudo o que você precisa para crescer</h2>
                  <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                      Ferramentas poderosas e intuitivas para elevar o nível do seu atendimento e gestão.
                  </p>
                </div>

                {/* 2. Grid agora com 3 colunas para melhor visualização */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-brand-background p-6 rounded-lg">
                    <MessageCircle className="h-10 w-10 text-brand-accent mb-4" />
                    <h3 className="text-xl font-bold mb-2">Agendamento por IA</h3>
                    <p className="text-gray-600">O seu assistente virtual 24/7. Deixe a nossa IA marcar, desmarcar e confirmar agendamentos via WhatsApp.</p>
                  </div>
                  <div className="bg-brand-background p-6 rounded-lg">
                    <CalendarDays className="h-10 w-10 text-brand-accent mb-4" />
                    <h3 className="text-xl font-bold mb-2">Agenda Inteligente</h3>
                    <p className="text-gray-600">Visualize e gira seus compromissos por dia, semana ou mês. Defina seus horários e bloqueios com facilidade.</p>
                  </div>
                  <div className="bg-brand-background p-6 rounded-lg">
                    <Users className="h-10 w-10 text-brand-accent mb-4" />
                    <h3 className="text-xl font-bold mb-2">Base de Clientes (CRM)</h3>
                    <p className="text-gray-600">Tenha o histórico de cada cliente na palma da sua mão. Anote preferências e nunca mais perca um contato importante.</p>
                  </div>
                  {/* NOVOS CARDS ADICIONADOS */}
                  <div className="bg-brand-background p-6 rounded-lg">
                    <Package className="h-10 w-10 text-brand-accent mb-4" />
                    <h3 className="text-xl font-bold mb-2">Gestão de Pacotes</h3>
                    <p className="text-gray-600">Crie pacotes de serviços (ex: 4 cortes por mês) e aumente a fidelidade e o faturamento recorrente dos seus clientes.</p>
                  </div>
                  <div className="bg-brand-background p-6 rounded-lg">
                    <BellRing className="h-10 w-10 text-brand-accent mb-4" />
                    <h3 className="text-xl font-bold mb-2">Lembretes Automáticos</h3>
                    <p className="text-gray-600">Reduza as faltas e no-shows com lembretes automáticos enviados diretamente para o WhatsApp do seu cliente.</p>
                  </div>
                  <div className="bg-brand-background p-6 rounded-lg">
                    <BarChart3 className="h-10 w-10 text-brand-accent mb-4" />
                    <h3 className="text-xl font-bold mb-2">Relatórios Simples</h3>
                    <p className="text-gray-600">Entenda a performance do seu negócio com relatórios de agendamentos e serviços mais populares.</p>
                  </div>
                </div>
            </div>
        </section>

        {/* Secção de Planos */}
       {/* Secção de Planos (ATUALIZADA) */}
        <section id="pricing" className="py-20 bg-brand-background">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Um plano para cada fase do seu negócio.</h2>
                <p className="mt-4 text-lg text-gray-600">Escolha o plano ideal para você. Cancele quando quiser.</p>
                
                <div className="grid lg:grid-cols-3 gap-8 mt-12 max-w-7xl mx-auto">
                    
                    {/* Plano Teste Grátis */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border flex flex-col">
                        <h3 className="text-2xl font-bold text-brand-primary">Teste Grátis</h3>
                        <p className="mt-2 text-gray-500">Experimente as funcionalidades essenciais por 7 dias.</p>
                        <p className="text-5xl font-bold my-6">Grátis</p>
                        <ul className="space-y-4 text-left flex-grow">
                            <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3"/> Até 20 Agendamentos</li>
                            <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3"/> Gestão de Clientes</li>
                            <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3"/> 1 Membro na Equipe</li>
                        </ul>
                        {/* CORREÇÃO: Link alterado para a secção de planos */}
                        <Link href="#pricing" className="block w-full mt-8 bg-gray-200 text-brand-primary px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all">
                            Começar Agora
                        </Link>
                    </div>
                    
                    {/* Plano Essentials */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-brand-accent relative flex flex-col">
                        <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                            <span className="bg-brand-accent text-white text-xs font-bold uppercase px-3 py-1 rounded-full">Mais Popular</span>
                        </div>
                        <h3 className="text-2xl font-bold text-brand-primary">Essentials</h3>
                        <p className="mt-2 text-gray-500">O ideal para organizar e profissionalizar o seu atendimento.</p>
                        <p className="text-5xl font-bold my-6">R$ 49<span className="text-lg font-normal text-gray-500">,90/mês</span></p>
                        <ul className="space-y-4 text-left flex-grow">
                            <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3"/> Agendamentos Ilimitados</li>
                            <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3"/> Gestão de Clientes (CRM)</li>
                            <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3"/> Gestão de Serviços</li>
                            <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3"/> Gestão de Equipe (até 3 membros)</li>
                            <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3"/> Relatórios Básicos de Performance</li>
                            <li className="flex items-center"><Check className="h-5 w-5 text-green-500 mr-3"/> Suporte via Email e Chat</li>
                        </ul>
                        {/* CORREÇÃO: Link alterado para a secção de planos */}
                        <Link href="#pricing" className="block w-full mt-8 bg-brand-accent text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all">
                            Iniciar Teste de 7 Dias
                        </Link>
                    </div>

                    {/* Plano Premium */}
                    <div className="bg-white p-8 rounded-xl shadow-lg border flex flex-col">
                        <h3 className="text-2xl font-bold text-brand-primary">Premium</h3>
                        <p className="mt-2 text-gray-500">Para negócios que querem escalar com automação total.</p>
                        <p className="text-5xl font-bold my-6">R$ 249<span className="text-lg font-normal text-gray-500">,90/mês</span></p>
                        <ul className="space-y-4 text-left flex-grow">
                            <li className="flex items-center"><Star className="h-5 w-5 text-yellow-500 mr-3"/> **Tudo do plano Essentials, e mais:**</li>
                            <li className="flex items-center"><Star className="h-5 w-5 text-yellow-500 mr-3"/> **Automação com IA no WhatsApp**</li>
                            <li className="flex items-center"><Star className="h-5 w-5 text-yellow-500 mr-3"/> Lembretes e Confirmações Automáticas</li>
                            <li className="flex items-center"><Star className="h-5 w-5 text-yellow-500 mr-3"/> Gestão de Pacotes e Estoque</li>
                            <li className="flex items-center"><Star className="h-5 w-5 text-yellow-500 mr-3"/> Relatórios Avançados com Insights</li>
                            <li className="flex items-center"><Star className="h-5 w-5 text-yellow-500 mr-3"/> Suporte Prioritário por Telefone</li>
                        </ul>
                        {/* CORREÇÃO: Link alterado para a secção de planos */}
                        <Link href="#pricing" className="block w-full mt-8 bg-white text-brand-accent px-8 py-3 rounded-lg font-semibold text-lg border border-brand-accent hover:bg-brand-accent-light transition-all">
                            Iniciar Teste de 7 Dias
                        </Link>
                    </div>
                </div>
            </div>
        </section>


        {/* =================================== */}
        {/* 3. NOVA SECÇÃO DE CONTATO           */}
        {/* =================================== */}
        <section id="contact" className="py-20 bg-white">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold">Tem alguma dúvida?</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                    A nossa equipe está pronta para ajudar a encontrar o plano perfeito e a alavancar o seu negócio. Entre em contato!
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-8">
                    <a href="mailto:contato@tracke.me" className="flex items-center gap-3 text-lg text-gray-700 hover:text-brand-accent">
                        <Mail className="h-6 w-6"/>
                        <span className="font-semibold">contato@tracke.me</span>
                    </a>
                    <a href="https://wa.me/5516999999999" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-lg text-gray-700 hover:text-brand-accent">
                        <Phone className="h-6 w-6"/>
                        <span className="font-semibold">+55 (16) 99999-9999</span>
                    </a>
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