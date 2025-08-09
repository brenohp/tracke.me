# 3. Funcionalidades Detalhadas - CliendaApp (Versão 5.0)

**Versão:** 1.7
**Data da Última Atualização:** 07 de Agosto de 2025

Este documento serve como o guia mestre para o desenvolvimento do projeto CliendaApp, detalhando todas as funcionalidades e o seu status atual.

---

## ✅ Módulos Concluídos (Pronto para Lançamento)

* **Módulo 1: Fundação e Autenticação**
    * **Status:** Concluído
    * **Funcionalidades:** Cadastro, Login, gestão de sessão com subdomínios, `middleware` e layouts seguros.

* **Módulo 2: Site de Marketing**
    * **Status:** Concluído (v1)
    * **Funcionalidades:** Landing Page com secções de Herói, Funcionalidades, Planos e Contato.

* **Módulo 3: Dashboard do Cliente (SaaS Core)**
    * **Status:** Concluído
    * **Funcionalidades:** Dashboard Principal com relatórios, Gestão de Serviços, Clientes e Equipa, Gestão da Agenda manual e Configurações de Perfil/Jornada de Trabalho.

* **Módulo 4: Painel de Super-Administrador (v1)**
    * **Status:** Concluído
    * **Funcionalidades:** Acesso seguro, Dashboard com estatísticas, CRUD completo para gerir **Planos**, **Cupons** e visualização de **Negócios** e **Usuários**.

* **Módulo 5: Faturamento e Checkout**
    * **Status:** Concluído
    * **Funcionalidades:** Integração com Stripe, página de checkout, webhook para provisionamento de conta e portal do cliente para gestão de faturamento.

* **Módulo 6: Comunicação Essencial e Segurança**
    * **Status:** Concluído
    * **Funcionalidades:** Fluxo completo de E-mail de Confirmação de Conta e Recuperação de Senha.

* **Módulo 8: Notificações e Engajamento**
    * **Status:** Concluído
    * **Funcionalidades:** "Sininho" de notificações em tempo real com Pusher para eventos da aplicação e comunicados do admin/dashboard/_components/NotificationBell.tsx, src/lib/services/notification.service.ts, docs/funcionalidades_v2.md].

---

## 🚧 Módulos Pendentes (Roadmap de Lançamento e Expansão)

Com a plataforma tecnicamente completa, os próximos passos são garantir a retenção dos primeiros usuários e, em seguida, expandir o diferencial competitivo.

### **Módulo 7: Onboarding do Novo Usuário (Prioridade MÁXIMA)**
* **Status:** **Próxima Prioridade**
* **Objetivo:** Garantir que o primeiro contacto do cliente com a plataforma seja excecional, guiando-o para o sucesso e reduzindo drasticamente a probabilidade de cancelamento.
* **Funcionalidades:**
    * **7.1: Guia Passo a Passo:** Um modal ou uma série de ecrãs que aparecem no primeiro login.
    * **7.2: Tarefas Essenciais:** Incentivar o usuário a completar ações chave (Definir Jornada de Trabalho, Cadastrar 1º Serviço, Cadastrar 1º Cliente).

### **Módulo 9: IA e Automações (O Diferencial)**
* **Status:** Pendente
* **Objetivo:** Entregar a promessa principal de automação e redução de trabalho manual.
* **Funcionalidades (Faseado):**
    * **9.1 (Fase 1):** Lembretes automáticos e Confirmação de agendamento via WhatsApp.
    * **9.2 (Fase 2):** IA para agendamento de um único serviço iniciado pelo cliente.

### **Módulo 10: Funcionalidades Premium (Pós-Lançamento)**
* **Status:** Pendente
* **Objetivo:** Desenvolver os diferenciais e funcionalidades avançadas para planos superiores.
* **Funcionalidades:** Gestão de Pacotes de Serviços, Gestão de Estoque, Relatórios Avançados.