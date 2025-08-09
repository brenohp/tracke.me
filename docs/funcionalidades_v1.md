# 3. Funcionalidades Detalhadas do MVP - CliendaApp

Este módulo detalha as funcionalidades essenciais do MVP do **CliendaApp**, organizadas em tópicos para facilitar o desenvolvimento faseado.

---
## 3.1. Gerenciamento de Usuários e Acesso

**Objetivo:** Permitir que os proprietários de pequenos negócios e seus funcionários criem suas contas e acessem o sistema de forma segura e com níveis de permissão adequados.

**Funcionalidades Essenciais (MVP):**

* **Cadastro de Novo Negócio/Proprietário:**
    * Formulário de registro com campos: Nome Completo (Proprietário), E-mail (login), Senha (com confirmação), Nome do Negócio, Telefone do Negócio, Endereço Completo do Negócio.
    * Validação de e-mail (envio de link de confirmação para ativar a conta).
    * Termos de Uso e Política de Privacidade (checkbox de aceitação obrigatória).
* **Login de Usuário:**
    * Campos: E-mail e Senha.
    * Opção "Esqueci minha senha" (processo de recuperação via e-mail).
    * Lembrar-me (opcional, uso de cookies).
* **Gestão de Perfis (Dentro da Conta do Negócio):**
    * **Proprietário:** Acesso total a todas as funcionalidades e configurações do sistema. Pode adicionar/remover funcionários.
    * **Funcionário:** Acesso restrito apenas à sua própria agenda, clientes relacionados a ele e serviços. Não pode acessar relatórios financeiros nem configurações administrativas.
* **Adição/Remoção de Funcionários (Apenas Proprietário):**
    * Interface para o proprietário adicionar novos funcionários (Nome, E-mail, Senha provisória).
    * Funcionários recebem e-mail com dados de acesso provisórios.
    * Interface para o proprietário remover funcionários.
* **Edição de Perfil (Proprietário e Funcionário):**
    * Nome, E-mail (com reautenticação se houver mudança), Senha (com confirmação de senha antiga).
    * Dados do Negócio (apenas proprietário): Nome do Negócio, Telefone, Endereço.

---
## 3.2. Gerenciamento de Serviços

**Objetivo:** Capacitar o negócio a cadastrar, organizar e precificar os serviços que oferece aos seus clientes.

**Funcionalidades Essenciais (MVP):**

* **Cadastro de Serviço:**
    * Campos: **Nome do Serviço** (ex: "Corte Masculino", "Unhas de Gel", "Sobrancelha Fio a Fio").
    * **Descrição** (texto livre, opcional, para detalhes do serviço).
    * **Duração Estimada** (em minutos, fundamental para o agendamento).
    * **Preço** (valor numérico).
    * **Profissional(is) Habilitado(s):** Seleção de quais funcionários do negócio podem realizar aquele serviço.
    * **Status:** Ativo/Inativo (serviços inativos não aparecem para agendamento online).
* **Listagem de Serviços:**
    * Visualização de todos os serviços cadastrados com seus detalhes.
    * Funcionalidade de busca/filtro por nome.
* **Edição de Serviço:**
    * Permitir a modificação de qualquer campo de um serviço existente.
* **Exclusão de Serviço:**
    * Confirmação antes da exclusão (aviso se houver agendamentos futuros associados).

---
## 3.3. Gerenciamento de Clientes (CRM Simplificado)

**Objetivo:** Oferecer uma base centralizada para que o negócio possa registrar e consultar informações essenciais de seus clientes, incluindo histórico de agendamentos.

**Funcionalidades Essenciais (MVP):**

* **Cadastro de Cliente (Manual pelo Profissional):**
    * Campos: **Nome Completo**, **Telefone** (principal meio de contato, especialmente para WhatsApp), **E-mail** (opcional, para outros contatos/futuras notificações), **Observações** (campo de texto livre para anotações rápidas como preferências, restrições, etc.).
    * **Origem:** (Opcional no MVP, mas bom de pensar: Como o cliente chegou? Indicação, Instagram, etc.).
* **Listagem de Clientes:**
    * Visualização de todos os clientes cadastrados.
    * Funcionalidade de **busca por nome ou telefone**.
* **Perfil do Cliente:**
    * Visualização detalhada das informações do cliente.
    * **Histórico de Agendamentos:** Lista de todos os agendamentos passados e futuros do cliente (serviço, data, hora, profissional).
* **Edição de Cliente:**
    * Permitir a modificação de qualquer campo das informações do cliente.
* **Exclusão de Cliente:**
    * Confirmação antes da exclusão (aviso se houver agendamentos futuros associados).

---
## 3.4. Agendamento Online e Gestão da Agenda

**Objetivo:** Permitir que clientes agendem serviços de forma autônoma e que o profissional tenha uma visão clara e organizada de sua agenda e disponibilidade.

**Funcionalidades Essenciais (MVP):**

* **Página Pública de Agendamento (Link Compartilhável):**
    * Interface limpa e responsiva para o cliente agendar.
    * Passo a passo intuitivo:
        1.  **Seleção do Serviço:** Cliente escolhe um ou mais serviços.
        2.  **Seleção do Profissional:** Cliente pode escolher um profissional específico ou optar por "Qualquer Profissional" (se o serviço for feito por mais de um).
        3.  **Seleção de Data e Hora:** Mostra a disponibilidade em tempo real dos profissionais/serviços selecionados. Bloqueia horários já ocupados ou fora da jornada de trabalho.
        4.  **Informações do Cliente:** Campos para Nome Completo e Telefone (serão usados para cadastro se não existirem ou para vincular se já existir).
        5.  **Confirmação:** Resumo do agendamento antes da confirmação final.
* **Painel de Gestão de Agendamentos (Para o Negócio):**
    * **Visualização da Agenda:**
        * Visões por **Dia, Semana e Mês**.
        * Filtros por **Profissional**.
        * Exibição clara de cada agendamento (Cliente, Serviço, Horário, Status).
    * **Criação Manual de Agendamento (pelo Profissional):**
        * Permitir que o profissional agende um cliente diretamente pelo painel (útil para agendamentos por telefone/presenciais).
        * Busca rápida de cliente existente ou cadastro de novo cliente.
    * **Edição de Agendamento:**
        * Alterar data, hora, serviço, profissional ou cliente de um agendamento existente.
    * **Cancelamento de Agendamento:**
        * Alterar status para "Cancelado".
        * Opcional: Campo para motivo do cancelamento.
    * **Marcação de "Compareceu" / "Não Compareceu":**
        * Mudar o status do agendamento após a sua execução (útil para relatórios futuros).
* **Gerenciamento de Disponibilidade (Jornada de Trabalho):**
    * Definição dos dias da semana e horários de funcionamento do negócio.
    * Definição de horários de trabalho de cada **Profissional** (com pausas para almoço, etc.).
    * Bloqueio de horários específicos (férias, feriados, emergências) para o negócio ou para um profissional.

---
## 3.5. Automação e Notificações (Foco em WhatsApp IA)

**Objetivo:** Automatizar a comunicação com os clientes, com ênfase na integração de IA via WhatsApp para agendamentos, desmarcações e lembretes, proporcionando um atendimento personalizado.

**Funcionalidades Essenciais (MVP):**

* **Integração com WhatsApp Business API:**
    * Configuração inicial para conectar o número do WhatsApp do negócio ao **CliendaApp**. (NOTA: Requer pesquisa sobre custos e requisitos da API oficial do WhatsApp).
* **Lembretes Automáticos de Agendamento:**
    * Envio automático de mensagem via WhatsApp para o cliente um período antes do agendamento (ex: 24h ou 1h antes).
    * Mensagem customizável pelo negócio (ex: "Olá [NomeCliente], seu agendamento para [Serviço] com [NomeProfissional] é amanhã às [Hora] no [NomeNegócio]. Contamos com sua presença!").
    * Status de "Enviado" para o lembrete no agendamento.
* **Confirmação de Agendamento:**
    * Possibilidade de incluir na mensagem de lembrete um botão ou instrução para o cliente confirmar a presença.
    * Atualização do status do agendamento para "Confirmado" no painel do negócio após a interação do cliente.
* **Chatbot de IA para Agendamento e Desagendamento (Diferencial):**
    * **Recepção de Mensagens:** A IA deve ser capaz de interpretar mensagens de texto dos clientes via WhatsApp.
    * **Agendamento Iniciado pelo Cliente:**
        * Cliente pergunta: "Quero agendar um corte".
        * IA responde: "Olá! Para qual serviço você gostaria de agendar? E qual profissional prefere?" (ou lista serviços/profissionais disponíveis).
        * IA interage para coletar data e hora com base na disponibilidade do sistema.
        * IA confirma o agendamento com o cliente e o registra no **CliendaApp**.
    * **Desagendamento/Remarcação Iniciado pelo Cliente:**
        * Cliente: "Quero desmarcar meu horário de amanhã."
        * IA: "Ok, [NomeCliente]. Seu agendamento para [Serviço] com [NomeProfissional] em [Data] às [Hora] será cancelado. Confirma?"
        * Após a confirmação, IA atualiza o status do agendamento para "Cancelado" no sistema.
    * **Limitações da IA no MVP:** Começar com cenários mais diretos e evoluir. A IA deve saber quando encaminhar para um atendimento humano se a conversa ficar muito complexa.
* **Notificações para o Negócio:**
    * Alertas no painel do **CliendaApp** sobre novos agendamentos via WhatsApp, cancelamentos, ou quando a IA não conseguiu resolver uma solicitação.

---
## 3.6. Relatórios Básicos

**Objetivo:** Fornecer ao negócio insights rápidos sobre sua performance, como volume de agendamentos e serviços mais populares.

**Funcionalidades Essenciais (MVP):**

* **Relatório de Agendamentos por Período:**
    * Permite filtrar agendamentos por data (dia, semana, mês, período personalizado).
    * Exibe: Total de agendamentos, Total de agendamentos confirmados/realizados, Total de cancelamentos, Total de não comparecimentos.
    * Pode ter um gráfico simples de evolução.
* **Relatório de Serviços Mais Agendados:**
    * Lista os serviços mais populares em um período selecionado.
    * Exibe: Nome do serviço, Quantidade de vezes agendado.
* **Relatório de Performance por Profissional (Básico):**
    * Exibe o número de agendamentos realizados por cada profissional em um período.

---
## 3.7. Configurações e Personalização Básica

**Objetivo:** Permitir que o negócio personalize algumas informações e configurações básicas do seu perfil no **CliendaApp**.

**Funcionalidades Essenciais (MVP):**

* **Informações do Negócio:**
    * Edição de Nome do Negócio, Endereço, Telefone, E-mail de Contato.
* **Link de Agendamento Personalizado:**
    * O negócio recebe um link único (ex: `negocio.CliendaApp`) para compartilhar com seus clientes.
* **Configuração de Horário de Funcionamento:**
    * Definição dos dias da semana e horários de abertura/fechamento do estabelecimento.
* **Configuração de Lembretes:**
    * Definir o tempo (ex: 24h, 1h) para envio de lembretes via WhatsApp.
    * Campo para personalizar o texto dos lembretes padrão.
* **Integração WhatsApp:**
    * Configuração do Token/Chave da API do WhatsApp.
    * Ativar/Desativar o Chatbot de IA.