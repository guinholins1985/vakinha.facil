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