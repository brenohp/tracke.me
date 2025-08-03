// Caminho: src/app/updates/page.tsx

import Header from '@/components/Header';
// 1. CORREÇÃO: 'PaintBrush' alterado para 'Paintbrush'
import { Rocket, Sparkles, Paintbrush } from 'lucide-react';

// Dados de exemplo para as atualizações
const updates = [
  {
    version: "v1.2.0",
    date: "27 de Julho, 2025", // Data atualizada
    title: "Módulo de Notificações em Tempo Real!",
    icon: Sparkles,
    description: "Agora você recebe notificações instantâneas para novos agendamentos, confirmações e cancelamentos, além de comunicados importantes da nossa equipe. Mantenha-se sempre atualizado!",
    category: "Novo Recurso",
  },
  {
    version: "v1.1.0",
    date: "15 de Julho, 2025", // Data atualizada
    title: "Página de Dados do Negócio",
    icon: Rocket,
    description: "Adicionamos uma nova seção nas configurações onde você pode editar o nome, telefone e agora também o endereço completo do seu negócio.",
    category: "Melhoria",
  },
  {
    version: "v1.0.5",
    date: "01 de Julho, 2025", // Data atualizada
    title: "Melhorias na Interface",
    // 2. CORREÇÃO: Ícone usado com o nome correto
    icon: Paintbrush,
    description: "Realizamos diversos ajustes visuais na plataforma para tornar a sua experiência de uso ainda mais agradável e intuitiva. Corrigimos pequenos bugs e melhoramos a responsividade em várias telas.",
    category: "Ajustes",
  },
];

export default function UpdatesPage() {
  return (
    <div className="bg-brand-background min-h-screen">
      <Header />
      <main className="container mx-auto px-6 py-24 md:py-32">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-brand-primary">
            O que há de novo no CliendaApp?
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Estamos sempre trabalhando para melhorar sua experiência. Confira aqui as últimas novidades e melhorias da plataforma.
          </p>
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <div className="space-y-12">
            {updates.map((update) => (
              <div key={update.version} className="relative pl-8">
                {/* Linha do tempo vertical */}
                <div className="absolute left-0 top-1 h-full w-0.5 bg-brand-accent-light"></div>
                <div className="absolute left-[-9px] top-1 h-5 w-5 rounded-full bg-brand-accent border-4 border-brand-background"></div>

                <p className="text-sm font-semibold text-brand-accent">{update.date}</p>
                <h2 className="mt-2 text-2xl font-bold text-brand-primary">{update.title}</h2>
                <p className="mt-3 text-gray-700">{update.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}