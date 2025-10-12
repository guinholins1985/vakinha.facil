
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

Vakinha Fácil generates revenue through a flexible, multi-tiered pricing structure:

| Plan        | Price           | Key Features                                       | Target Audience      |
|-------------|-----------------|----------------------------------------------------|----------------------|
| **Básico**    | Free            | 1 active `vaquinha`, 5% fee on total amount collected. | Individuals, small groups |
| **Premium**   | R$ 19,90/month  | Unlimited `vaquinhas`, reduced 3% fee, priority support. | Power users, teams |
| **White-Label**| R$ 300/month    | Use the platform with your own brand.              | Entrepreneurs, businesses |

---

## 🛠️ Technical Stack

- **Frontend:** React, Tailwind CSS
- **State Management:** React Hooks (`useState`)
- **Backend (Conceptual):** Node.js with a framework like Express.js
- **Database (Conceptual):** PostgreSQL or MongoDB for storing user and `vaquinha` data.
- **Payment Gateway Integration:** Mercado Pago, PicPay
- **Authentication:** JWT (JSON Web Tokens) for securing user sessions.

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
