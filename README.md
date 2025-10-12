
# Vakinha Fácil

**Automatize vaquinhas coletivas em 3 cliques. Transparente, seguro e sem burocracia.**

## 💡 Core Idea

Vakinha Fácil is a platform designed to simplify and automate group fundraising (known as "vaquinhas" in Brazil). It eliminates the need for manual tracking in spreadsheets, reduces mistrust among participants, and streamlines the entire process of collecting and distributing money for shared goals.

The system handles recurring collections, payment reminders, and fund distribution automatically, providing a transparent and secure environment for all users.

---

## ✨ Key Features

- **Automation:** Set up a `vaquinha`, and the platform handles automatic payment reminders and tracks contributions.
- **Transparency:** A real-time dashboard shows every participant's payment status, eliminating any potential for distrust.
- **Security:** Integrates with trusted payment gateways like Mercado Pago and PicPay, and includes CPF validation for participants.
- **Flexibility:** Perfect for any collective goal, such as trips, gifts, shared expenses, or group savings.
- **Multi-level Access:** Separate, feature-rich dashboards for Group Administrators and System Administrators.

---

## 👥 User Personas & Flows

The platform is designed for three main user types:

### 1. System Administrator (Admin do Sistema)
The platform owner who oversees the entire operation.

**Workflow:**
1.  **Login:** Accesses the secure System Admin dashboard.
2.  **Monitor:** Views a global dashboard with key metrics: total revenue, active users, number of `vaquinhas`, etc.
3.  **Manage Users:** Lists, blocks, or verifies users' identities (CPF).
4.  **Oversee Vaquinhas:** Monitors the status of all `vaquinhas` (active, completed, delayed).
5.  **Financial Control:** Tracks revenue generated from fees, subscriptions, and white-label licenses.
6.  **Configuration:** Sets global parameters like default platform fees and transaction limits.
7.  **Support:** Manages support tickets and communicates with users.
8.  **Reporting:** Generates financial and user activity reports.

### 2. Group Administrator (Gestor do Grupo)
The person responsible for creating and managing a specific `vaquinha`.

**Workflow:**
1.  **Create Vaquinha:** Fills out a simple 3-step form:
    -   **Goal:** What is the money for? (e.g., "Viagem para a Bahia")
    -   **Terms:** Defines the monthly contribution, duration, and number of participants.
    -   **Confirmation:** Reviews and launches the `vaquinha`.
2.  **Invite Participants:** Shares a unique, personalized link via WhatsApp, email, or social media.
3.  **Track Progress:** Monitors the group's dashboard, which displays each participant's payment status in real-time.
4.  **Receive Notifications:** Gets automated alerts, such as "Maria's payment is late."
5.  **Distribute Funds:** Once the goal is met, requests an automatic distribution of the collected funds via Pix or bank transfer.

### 3. Participant (Participante)
A member of a `vaquinha` who contributes money.

**Workflow:**
1.  **Join:** Clicks the invitation link received from the Group Administrator.
2.  **Register:** Provides their name and CPF for validation, ensuring security.
3.  **Make Payments:** Contributes their share monthly using secure options like Pix, credit card, or bank slip (boleto).
4.  **View Status:** Can access a simple view to see the `vaquinha`'s overall progress and confirm their payment history.

---

## 💰 Monetization Model

Vakinha Fácil generates revenue through a flexible, multi-tiered pricing structure.

| Modelo | Como Funciona | Lucro Estimado (Mês) |
| :--- | :--- | :--- |
| **Taxa por Vaquinha** | Cobra R$ 15–R$ 20 por vaquinha criada. | R$ 1.500–R$ 4.000 |
| **% sobre Valor Total** | 3–5% do valor arrecadado (ex.: 5% de R$ 2.000 = R$ 100). | R$ 2.000–R$ 10.000 |
| **Assinatura Mensal** | Plano de R$ 19,90/mês para administradores (vaquinhas ilimitadas). | R$ 1.000–R$ 5.000 |
| **Pacotes Temáticos** | Venda templates prontos (ex.: "Vaquinha Viagem") por R$ 39,90. | R$ 1.000–R$ 4.000 |
| **White-Label** | Licencie a plataforma para empreendedores por R$ 200–R$ 500/mês. | R$ 2.000–R$ 10.000 |

**Combinação Recomendada:** Taxa por vaquinha (R$ 15) + 3% sobre valor total = **R$ 3.500–R$ 10.000/mês** com 100–200 vaquinhas ativas.

---

## 🛠️ Technologies & Integrations

| Área | Tecnologia/Integração | Custo Estimado (MVP) |
| :--- | :--- | :--- |
| **Frontend (Admin)** | React.js (painel superadmin) | R$ 5.000–R$ 10.000 |
| **Frontend (Grupo)** | Flutter (app mobile) + React (web) | R$ 7.000–R$ 12.000 |
| **Backend** | Node.js + PostgreSQL | R$ 4.000–R$ 8.000 |
| **Pagamentos** | Mercado Pago, PicPay, Stripe | Grátis (taxas por transação) |
| **Automação** | Twilio (SMS), SendGrid (e-mails), Firebase (notificações) | R$ 500–R$ 1.000/mês |
| **Segurança** | Validação de CPF (Serasa), criptografia (SSL) | R$ 1.500–R$ 3.000 |
| **Hosting** | AWS ou DigitalOcean | R$ 500–R$ 1.000/mês |
| **Custo Total do MVP** | | **R$ 25.000–R$ 50.000** |

---

## 🗃️ Database Structure

### `Usuários`
- `id`
- `nome`
- `email`
- `cpf`
- `telefone`
- `tipo` (admin_sistema/admin_grupo/participante)
- `data_cadastro`
- `status`

### `Vaquinhas`
- `id`
- `nome`
- `descricao`
- `valor_mensal`
- `prazo_meses`
- `data_inicio`
- `data_fim`
- `status`
- `admin_grupo_id`
- `taxa_aplicada`

### `Participantes`
- `id`
- `vaquinha_id`
- `usuario_id`
- `status_pagamento`
- `data_adesao`
- `valor_pago`

### `Pagamentos`
- `id`
- `participante_id`
- `valor`
- `data_pagamento`
- `metodo` (Pix/cartão/boleto)
- `comprovante`
- `status`

### `Distribuicoes`
- `id`
- `vaquinha_id`
- `valor_total`
- `data_distribuicao`
- `status`
- `metodo_saque` (Pix/conta)

### `Taxas`
- `id`
- `vaquinha_id`
- `valor_taxa`
- `data_cobranca`
- `status`
- `tipo` (fixa/porcentagem)

### `Assinaturas`
- `id`
- `usuario_id`
- `plano` (mensal/anual)
- `data_inicio`
- `data_fim`
- `valor`
- `status`

### `WhiteLabel`
- `id`
- `empresa`
- `contato`
- `plano`
- `data_inicio`
- `data_fim`
- `valor_mensal`
- `status`

---

## 🚀 How to Run Locally

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/vakinha-facil.git
    cd vakinha-facil
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add any necessary API keys (if applicable).
    ```
    # Example .env file
    API_KEY=your_gemini_api_key_here
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).
