// src/lib/stripe.ts

import Stripe from 'stripe';

// Lê a chave secreta da Stripe das nossas variáveis de ambiente.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Uma verificação de segurança para garantir que o servidor não inicie
// se a chave secreta não for encontrada.
if (!stripeSecretKey) {
  throw new Error("A variável de ambiente STRIPE_SECRET_KEY não está definida.");
}

// Inicializa a instância do cliente da Stripe com a chave secreta e a versão da API.
export const stripe = new Stripe(stripeSecretKey, {
  // CORREÇÃO: Usando a versão da API que o seu pacote da Stripe espera.
  apiVersion: '2025-07-30.basil', 
  typescript: true,
});