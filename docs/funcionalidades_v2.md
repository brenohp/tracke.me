# Funcionalidades Detalhadas - CliendaApp

**Versão:** 1.2
**Data da Última Atualização:** 24 de Julho de 2025

Este documento serve como o guia mestre para o desenvolvimento do projeto CliendaApp, detalhando todas as funcionalidades planeadas e o seu status atual.

---

## ✅ Módulos Concluídos (Base Funcional)

### Módulo 1: Fundação e Autenticação
* **Status:** Concluído
* **Funcionalidades:** Cadastro, Login, gestão de sessão com subdomínios, `middleware` e layouts seguros.

### Módulo 2: Site de Marketing
* **Status:** Concluído (v1)
* **Funcionalidades:** Landing Page com secções de Herói, Funcionalidades, Planos e Contato.

### Módulo 3: Dashboard do Cliente (SaaS Core)
* **Status:** Concluído
* **Funcionalidades:**
    * **Dashboard Principal:** Relatórios básicos interativos e Serviços Populares.
    * **Gestão de Serviços, Clientes e Equipe:** CRUD completo para cada secção.
    * **Gestão da Agenda (Manual):** Calendário interativo com CRUD completo para agendamentos.
    * **Configurações:** Páginas para "Editar Perfil" e "Jornada de Trabalho".

### Módulo 4: Painel de Super-Administrador (v1)
* **Status:** Concluído (v1)
* **Funcionalidades:**
    * Acesso seguro para a `role` ADMIN.
    * Layout profissional com menu lateral.
    * Dashboard com estatísticas gerais da plataforma.
    * CRUD completo para gerir **Planos**.
    * Visualização de todos os **Negócios** e **Usuários** da plataforma.

---

## 🚧 Módulos Pendentes (Próximos Passos)

### Módulo 5: Faturamento e Checkout
* **Status:** **Próxima Prioridade**
* **Objetivo:** Construir o fluxo completo para um novo cliente assinar um plano.
* **Funcionalidades:**
    * **5.1: Gestão de Cupões (Admin):** Interface no painel de admin para criar, editar e visualizar cupões.
    * **5.2: Integração com Gateway de Pagamento:** Configurar o backend para comunicar com um serviço de pagamentos (ex: Stripe).
    * **5.3: Página de Checkout:** Página para onde o cliente é redirecionado ao escolher um plano. Conterá: Resumo do plano, campo para cupão, formulário de registo e formulário de pagamento.
    * **5.4: Gestão de Assinatura (Cliente):** Página `/settings/billing` no dashboard do cliente para ele ver o seu plano atual e gerir o seu pagamento.

### Módulo 6: Autenticação e Comunicação Essencial
* **Status:** Pendente
* **Objetivo:** Adicionar camadas essenciais de comunicação e segurança ao fluxo do usuário.
* **Funcionalidades:**
    * **6.1: E-mail de Confirmação de Conta:** Ao se registar, o usuário recebe um e-mail para validar o seu endereço.
    * **6.2: E-mail de Recuperação de Senha:** Implementar o fluxo "Esqueci minha senha".

### Módulo 7: Onboarding do Novo Usuário
* **Status:** Pendente
* **Objetivo:** Guiar o novo usuário pelas configurações iniciais para garantir que ele veja o valor do produto rapidamente.
* **Funcionalidades:**
    * **7.1: Guia Passo a Passo:** Um modal ou uma série de ecrãs que aparecem no primeiro login.
    * **7.2: Tarefas Essenciais:** Incentivar o usuário a completar ações chave (Definir Jornada de Trabalho, Cadastrar Serviço, etc.).
    * **7.3: Seleção do Tipo de Negócio:** Permitir que o usuário categorize o seu negócio para futuras personalizações.

### Módulo 8: IA e Automações (Configuração do Cliente)
* **Status:** Pendente
* **Objetivo:** Permitir que o cliente configure e personalize a automação de IA.
* **Funcionalidades:**
    * **8.1: Configuração da IA do WhatsApp:**
        * Área no dashboard para o usuário definir quando os lembretes de agendamento são enviados.
        * Opções para personalizar os estilos das mensagens automáticas.

### Módulo 9: Notificações e Suporte
* **Status:** Pendente
* **Objetivo:** Melhorar a comunicação e o suporte ao cliente.
* **Funcionalidades:**
    * **9.1: "Sininho" de Notificações:** Notificações em tempo real no dashboard do cliente (ex: Client X confirmou consulta ou Nova atualização, configura aqui as novas funcionalidades!).
    * **9.2: Sistema de Suporte com Tickets:** Área no dashboard do cliente e no painel de admin para gerir tickets.
    * **9.3: Chat de Suporte:** Implementação de um chat em tempo real.
    * **9.4: Notificações:** Notificações de atualizações vão ser lançadas e gerenciadas pelo painel administrador.

### Módulo 10: Controlo Avançado do Administrador
* **Status:** Pendente
* **Objetivo:** Dar ao admin controlo total sobre as funcionalidades da plataforma.
* **Funcionalidades:**
    * **10.1: Controlo de Funcionalidades da IA:** Painel para ativar/desativar globalmente os serviços de IA.
    * **10.2: Feature Flags (Controlo de Recursos):** Sistema para ativar ou desativar funcionalidades para planos ou usuários específicos.
    * **10.3: Configuração de Planos Avançada:** Definir o tempo de trial e as permissões de cada plano.

### Módulo 11: Funcionalidades Premium (Pós-Lançamento)
* **Status:** Pendente
* **Objetivo:** Desenvolver os diferenciais e funcionalidades avançadas.
* **Funcionalidades:**
    * **11.1: Gestão de Pacotes de Serviços.**
    * **11.2: Gestão de Estoque.**
    * **11.3: Relatórios Avançados.**







   