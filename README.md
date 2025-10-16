# Vakinha Fácil

**Automatize vaquinhas coletivas em 3 cliques. Transparente, seguro e sem burocracia.**

## 💡 Core Idea

Vakinha Fácil is a platform designed to simplify and automate group fundraising (known as "vaquinhas" in Brazil). It eliminates the need for manual tracking in spreadsheets, reduces mistrust among participants, and streamlines the entire process of collecting and distributing money for shared goals.

The system handles recurring collections, payment reminders, and fund distribution automatically, providing a transparent and secure environment for all users.

---

## 🚀 Project Overview

This repository contains a high-fidelity frontend prototype for the Vakinha Fácil platform, built with React, TypeScript, and TailwindCSS. It showcases the complete user interface, including:

*   A detailed, multi-section public landing page.
*   An interactive dashboard for Group Administrators.
*   A comprehensive multi-view panel for System Administrators.

The prototype is populated with mock data to simulate a live environment and includes a functional AI-powered chatbot for support, using the Gemini API.

---

## ✨ Key Features

- **Automation:** Set up a `vaquinha`, and the platform handles automatic payment reminders and tracks contributions.
- **Transparency:** A real-time dashboard shows every participant's payment status, eliminating any potential for distrust.
- **Security:** The product vision includes integration with trusted payment gateways and CPF validation for participants.
- **Flexibility:** Perfect for any collective goal, such as trips, gifts, shared expenses, or group savings.
- **Multi-level Access:** The prototype demonstrates separate, feature-rich dashboards for Group Administrators and System Administrators.

---

## 👥 User Personas & Prototype Flows

The prototype is designed to demonstrate the experience for different user types:

### 1. System Administrator (Admin do Sistema)
The platform owner who oversees the entire operation.

**Prototype Workflow:**
*   **Login:** Clicks the "Admin do Sistema" button to access the secure System Admin dashboard.
*   **Monitor:** Views a global dashboard with panels for managing users, vaquinhas, finances, white-label clients, support tickets, gateway integrations, and platform settings.
*   **Interact:** The dashboard is populated with mock data to simulate a live environment, and many features, like forms and modals, are interactive.

### 2. Group Administrator (Gestor do Grupo)
The person responsible for creating and managing a specific `vaquinha`.

**Prototype Workflow:**
*   **Login:** Clicks the "Entrar" button to access the Group Admin dashboard.
*   **Track Progress:** Views a list of `vaquinhas` and can drill down into a detailed management view for a specific one.
*   **Manage:** The detail view shows mock data for participants, payment status, and available management actions (e.g., "Enviar lembrete," "Convidar").

### 3. Visitor / Participant (Visitante / Participante)
A potential user exploring the service or a member of a `vaquinha`.

**Prototype Workflow:**
*   **Explore:** Interacts with the full landing page to understand the product's features and value proposition.
*   **Get Help:** Engages with the AI Chatbot to ask questions about the service in real-time.

---

## 💰 Monetization Model

The prototype's UI showcases a flexible, multi-tiered pricing structure designed to cater to different user needs.

| Modelo          | Valor                         | Descrição                                                              |
| :-------------- | :---------------------------- | :--------------------------------------------------------------------- |
| **Uso Flexível**  | R$ 15 / vaquinha + 3% do valor| Ideal para eventos pontuais e vaquinhas únicas, sem compromisso mensal. |
| **Assinatura Pro**| R$ 19,90 / mês                | Para gestores de grupos frequentes, com vaquinhas ilimitadas e taxas reduzidas. |
| **White-Label**   | A partir de R$ 300 / mês      | Licencie a plataforma para usar com sua própria marca e modelo de negócio. |

---

## 🔧 Suporte e Manutenção

Esta seção detalha o plano de implementação para o sistema de suporte e manutenção da plataforma "Vakinha Fácil", utilizando Zendesk como a ferramenta central.

### 8.1. Configurar Suporte (Zendesk)

O sistema de suporte será configurado para incluir os seguintes componentes:

#### 1. Canais de Atendimento
- **E-mail**: `suporte@vakinhafacil.com.br`.
- **Chat ao vivo**: Integração com WhatsApp via Twilio.
- **Formulário de contato**: Disponível no site.

#### 2. Fluxo de Atendimento
- **Prioridades**:
  - **Alta**: Problemas com pagamentos.
  - **Média**: Dúvidas sobre funcionalidades.
  - **Baixa**: Sugestões de melhoria.
- **Resposta Automática**:
  ```
  Olá [Nome],
  Obrigado por entrar em contato! Sua solicitação (ID: #[Ticket ID]) foi recebida.
  Respondemos em até 24 horas.
  ```
- **Respostas Padrão (Macros)**:
  - "Como criar uma vaquinha?"
  - "Como convidar participantes?"
  - "Como receber o dinheiro?"

#### 3. Integração com Slack
- Notificar a equipe no canal `#suporte` do Slack sempre que um novo ticket for aberto.

#### 4. Base de Conhecimento (Knowledge Base)
- Criar artigos para os seguintes tópicos:
  - "Primeiros passos no Vakinha Fácil".
  - "Como configurar pagamentos recorrentes".
  - "Como solicitar a distribuição do valor arrecadado".

#### 5. Métricas e KPIs
- Acompanhar as seguintes métricas de performance:
  - Tempo médio de primeira resposta.
  - Taxa de resolução no primeiro contato.
  - Nível de satisfação do usuário (CSAT) através de pesquisa pós-atendimento.

### 8.2. Monitoramento e Analytics (Google Analytics + Power BI)

Configure um sistema de monitoramento e analytics para o "Vakinha Fácil" usando Google Analytics e Power BI. O sistema deve rastrear:

#### 1. Google Analytics
- **Eventos**:
  - `vaquinha_criada`: Quando um usuário cria uma vaquinha.
  - `participante_convidado`: Quando um participante é convidado.
  - `pagamento_realizado`: Quando um pagamento é confirmado.
  - `assinatura_contratada`: Quando um usuário assina o plano Premium.
- **Metas**:
  - Taxa de conversão (visitantes → usuários cadastrados).
  - Taxa de retenção (usuários que voltam após 30 dias).

#### 2. Power BI
- **Dashboards**:
  a) **Visão Geral**:
     - Receita mensal (por modelo: taxas, assinaturas, white-label).
     - Número de vaquinhas ativas.
     - Taxa de inadimplência.
  b) **Usuários**:
     - Crescimento de usuários (mês a mês).
     - Distribuição por tipo (admin_sistema, admin_grupo, participante).
  c) **Vaquinhas**:
     - Valor médio por vaquinha.
     - Tempo médio para atingir a meta.
     - Vaquinhas mais populares (por objetivo: viagem, presente, etc.).
  d) **Financeiro**:
     - Receita x Despesas.
     - ROI por canal de aquisição (Meta Ads, Google Ads, Afiliados).

#### 3. Alertas
- Configure alertas para:
  - Queda na taxa de conversão.
  - Aumento na inadimplência.
  - Falhas em pagamentos recorrentes.

---

## 📈 Etapa 9: Escalabilidade e Novas Funcionalidades

### 9.1. Adicionar Novos Recursos (Roadmap)

Planeje as próximas funcionalidades para o "Vakinha Fácil" com base no feedback dos usuários e dados de uso. Priorize:

#### 1. Recursos para 3 Meses
- **Vaquinhas Recorrentes**: Permita que usuários criem vaquinhas mensais automáticas (ex.: "Poupança familiar").
- **Metas Parciais**: Defina metas intermediárias (ex.: "Junte R$ 1.000 em 3 meses").
- **Integração com Nubank**: Permita pagamentos via Nubank.

#### 2. Recursos para 6 Meses
- **Vaquinhas para Empresas**: Recurso para empresas criarem vaquinhas para funcionários (ex.: "Fundo de Natal").
- **API Pública**: Permita que desenvolvedores integrem o Vakinha Fácil em seus apps.
- **Cashback**: Ofereça cashback para participantes que pagam em dia.

#### 3. Recursos para 12 Meses
- **Vaquinhas Internacionais**: Suporte a moedas estrangeiras (USD, EUR).
- **Investimentos**: Permita que o dinheiro arrecadado seja investido em rendimentos (parceria com corretoras).
- **Marketplace de Vaquinhas**: Usuários podem buscar vaquinhas públicas para participar (ex.: causas sociais).

#### 4. Melhorias Contínuas
- **IA Avançada**: Previsão de inadimplência com maior precisão.
- **Gamificação**: Badges e recompensas para participantes pontuais.
- **App para iOS**: Desenvolva versão nativa para iPhone.

### 9.2. Expansão para White-Label

Expanda o modelo de white-label do "Vakinha Fácil" para atrair mais empreendedores. Ações:

#### 1. Marketing para White-Label
- Crie uma landing page dedicada: `vakinhafacil.com.br/white-label`.
- Destaque:
  - "Tenha sua própria plataforma de vaquinhas em 24 horas."
  - "Sem necessidade de desenvolvimento."
  - "Suporte técnico incluso."
- Depoimentos de licenciados atuais.

#### 2. Planos White-Label

| Plano       | Valor/Mês | Recursos                                  |
|-------------|-----------|-------------------------------------------|
| Básico      | R$ 200    | Plataforma com sua marca, 50 vaquinhas/mês.|
| Premium     | R$ 500    | Vaquinhas ilimitadas, suporte prioritário.|
| Empresarial | R$ 1.000  | Integração com ERP, relatórios avançados. |

#### 3. Onboarding para Licenciados
- Vídeo tutorial: "Como personalizar sua plataforma".
- Suporte dedicado nos primeiros 30 dias.
- Template de e-mails para convidar seus primeiros usuários.

#### 4. Parcerias
- Ofereça white-label para:
  - Bancos digitais (ex.: Nubank, Inter).
  - Plataformas de eventos (ex.: Sympla, Eventbrite).
  - ONGs e instituições de caridade.
  
---

## 🏛️ Etapa 10: Manutenção e Atualizações

### 10.1. Plano de Manutenção

Crie um plano de manutenção contínua para o "Vakinha Fácil" com as seguintes ações:

#### 1. Atualizações Semanais
   - Verificar e aplicar atualizações de segurança (Node.js, React, Flutter).
   - Testar integrações com gateways de pagamento.

#### 2. Backup e Recuperação
   - Backup automático do banco de dados (PostgreSQL) diariamente na AWS S3.
   - Testar restauração do backup a cada 15 dias.

#### 3. Monitoramento
   - Use **New Relic** ou **Sentry** para monitorar:
     - Tempo de resposta da API.
     - Erros no frontend/backend.
     - Disponibilidade (uptime).
   - Configure alertas para:
     - Queda no servidor.
     - Erros críticos (ex.: falha em pagamentos).

#### 4. Atualizações de Recursos
   - A cada 3 meses, revise o roadmap e priorize novas funcionalidades.
   - Envie um e-mail para usuários com novidades:
     ```
     Subject: Novidades no Vakinha Fácil!
     Olá [Nome],
     Lançamos [Recurso Novo] para tornar suas vaquinhas ainda melhores.
     Confira: [Link]
     ```

#### 5. Suporte Contínuo
   - Treine a equipe de suporte mensalmente.
   - Atualize a base de conhecimento com novas dúvidas frequentes.
   
---
   
## MÓDULO 1: DASHBOARD PRINCIPAL

- **Ação**: Implementar e ativar um dashboard interativo com:
  - Gráficos de arrecadação total, vaquinhas ativas/encerradas, usuários ativos.
  - Indicadores de performance (taxa de conversão, ticket médio, crescimento mensal).
  - Alertas em tempo real para vaquinhas prestes a vencer ou pagamentos pendentes.
  - Atalhos rápidos para criar vaquinha, gerar relatório e verificar suporte.

---

## MÓDULO 2: GESTÃO DE USUÁRIOS

- **Ação**: Implementar e ativar:
  - Lista de usuários com filtros avançados (nome, e-mail, status, data de cadastro).
  - Sistema de perfis e permissões (admin, moderador, usuário comum).
  - Verificação de contas (upload e aprovação de documentos).
  - Histórico de atividades (log de ações: criações, doações, saques).
  - Opção para bloquear/desbloquear usuários.
