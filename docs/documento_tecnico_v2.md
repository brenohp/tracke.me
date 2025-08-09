# Documento Técnico - CliendaApp.

Este documento visa detalhar as escolhas e diretrizes técnicas para o desenvolvimento do MVP do **CliendaApp**, garantindo padronização, escalabilidade e manutenibilidade do sistema.

---
## 1. Visão Geral da Arquitetura

* **1.1. Abordagem Arquitetural:**
    * **Microsserviços vs. Monolítico:** Para o MVP, a recomendação é iniciar com uma **arquitetura monolítica bem modularizada**. Isso permite um desenvolvimento mais rápido e com menor complexidade inicial. À medida que o **CliendaApp** crescer e a necessidade de escalabilidade independente de módulos se tornar evidente, podemos refatorar para microsserviços.
    * **Camadas:** O sistema será dividido em camadas bem definidas para separação de responsabilidades (ex: Camada de Apresentação, Camada de Negócios, Camada de Acesso a Dados).

---
## 2. Escolha de Tecnologias

Esta seção define as linguagens de programação, frameworks e bancos de dados que serão utilizados. A escolha visa equilibrar **produtividade, desempenho, comunidade e facilidade de contratação** (no futuro, se necessário).

* **2.1. Backend (Servidor):**
    * **Linguagem de Programação:** **Node.js / TypeScript** (Next.js atua tanto no frontend quanto no backend para as APIs).
    * **Framework/ORM:** **Next.js API Routes** para as APIs e **Prisma ORM** para interação com o banco de dados.
    * **Sistema de Gerenciamento de Banco de Dados (SGBD):** **PostgreSQL**.

* **2.2. Frontend (Interface do Usuário):**
    * **Linguagem de Programação:** **JavaScript / TypeScript**.
    * **Framework/Biblioteca:** **React.js** (utilizado dentro do **Next.js**).
    * **Estilização/Componentes UI:** **Tailwind CSS**.

* **2.3. Inteligência Artificial (IA) para WhatsApp:**
    * **Serviço/API:** Em aberto, mantendo as sugestões para pesquisa futura: **OpenAI GPT (via API), Google Gemini API, Dialogflow (para NLU/conversação), Wit.ai**.
    * **Integração WhatsApp:** Via **WhatsApp Business API oficial**. (Pesquisar provedores de acesso a essa API, como Twilio, Zenvia, etc., e seus custos).

* **2.4. Infraestrutura e Hospedagem:**
    * **Ambiente Inicial de Desenvolvimento:** **Localhost**.
    * **Provedor Cloud Futuro:** **Google Cloud Platform (GCP)** ou **DigitalOcean**.
    * **Tipo de Serviço:** De início, em localhost, o foco será no desenvolvimento. Para a nuvem, a escolha será entre PaaS (para simplificar deploy) ou IaaS (para maior controle).
    * **Containers:** Considerar o uso de **Docker** para empacotar a aplicação e suas dependências, facilitando a implantação futura em ambientes de nuvem.
    * **Orquestração (Futuro):** **Kubernetes** para escalabilidade e gerenciamento de containers em larga escala (não para o MVP).

---
## 3. Padrões de Desenvolvimento e Boas Práticas

* **3.1. Versionamento de Código:**
    * **Ferramenta:** **Git**.
    * **Plataforma:** **GitHub**.
    * **Estratégia de Branching:** [Sugestão: **Git Flow** ou **GitHub Flow** para equipes pequenas/MVP].
* **3.2. Testes:**
    * **Backend:** Testes unitários e de integração para as principais lógicas de negócio.
    * **Frontend:** Testes de componentes (básico para MVP).
* **3.3. Documentação:**
    * Documentação de API (ex: **Swagger/OpenAPI**).
    * Documentação interna de código (comentários claros).
    * Documentação de setup e deploy.
* **3.4. Padrões de Código:**
    * Utilização de linters e formatadores de código (ex: ESLint, Prettier para JS/TS) para garantir consistência.
    * Seguir convenções de nomenclatura (camelCase).
* **3.5. Segurança:**
    * Validação de dados de entrada (input validation).
    * Uso de HTTPS.
    * Armazenamento seguro de senhas (hashing).
    * Proteção contra ataques comuns (SQL Injection, XSS, CSRF).
    * Conformidade com a **LGPD (Lei Geral de Proteção de Dados)** desde o início, especialmente no tratamento de dados de clientes.

---
## 4. Padrões de Layout (UI/UX)

* **4.1. Design System (MVP):**
    * **Paleta de Cores (Padrão "Maré Noturna"):**
        ```javascript
        // tailwind.config.ts
        const config: Config = {
            content: [
                "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
                "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
                "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
            ],
            theme: {
                extend: {
                    colors: {
                        'brand-background': '#F7F7F7', // Fundo claro
                        'brand-primary': '#021B33',    // Azul escuro, quase preto (principal para texto/elementos chave)
                        'brand-accent': '#12577B',     // Azul acentuado (para botões, destaques)
                        'brand-accent-light': '#A9CFE5', // Azul claro (para fundos sutis, estados de hover)
                    },
                },
            },
            plugins: [],
        };
        ```
    * **Tipografia:** Definir fontes legíveis e modernas para títulos e corpo de texto.
    * **Componentes UI Reutilizáveis:** Foco na criação de componentes para **botões, campos de formulário, cards e modais**, garantindo consistência e agilidade.
    * **Foco Principal:** **Simplicidade, intuitividade e clareza** na interface do usuário.
* **4.2. Responsividade:**
    * Design **mobile-first**, garantindo que a experiência em smartphones e tablets seja tão boa quanto no desktop.
    * Layouts fluidos que se adaptam a diferentes tamanhos de tela.
* **4.3. Acessibilidade:**
    * Considerar padrões básicos de acessibilidade (cores de contraste, navegação por teclado).
* **4.4. Fluxos de Usuário:**
    * Priorizar fluxos de usuário intuitivos para as principais ações (agendar, cadastrar cliente, ver agenda).

---
## 5. Plano de Deploy e Manutenção (MVP)

* **5.1. Ambiente de Desenvolvimento:** Máquinas locais dos desenvolvedores.
* **5.2. Ambiente de Staging/Homologação:** Ambiente para testes internos antes de ir para produção (será implementado ao migrar para a nuvem).
* **5.3. Ambiente de Produção:** Ambiente real onde o **CliendaApp** estará disponível para os usuários (será implementado ao migrar para a nuvem).
* **5.4. Ferramentas de CI/CD (Integração Contínua/Entrega Contínua - Futuro):** Automatizar testes e deploy (não essencial para o MVP inicial, mas bom de pensar).
* **5.5. Monitoramento e Logs:** Ferramentas para monitorar a saúde da aplicação e coletar logs de erros.