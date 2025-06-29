// src/app/[subdomain]/dashboard/services/page.tsx

"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Briefcase, PlusCircle, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";

// Definindo um tipo para o nosso objeto de serviço para segurança de tipos
type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration: number;
};

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        // O navegador envia o cookie de autenticação automaticamente
        const response = await fetch('/api/services');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar os serviços.');
        }

        const data = await response.json();
        setServices(data);

      } catch (error) {
        toast.error('Não foi possível carregar os serviços.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  return (
    <div>
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brand-primary flex items-center">
          <Briefcase className="mr-3 text-brand-accent" />
          Meus Serviços
        </h1>
        <Link href="/dashboard/services/new">
          <Button>
            <PlusCircle size={20} className="mr-2" />
            Adicionar Serviço
          </Button>
        </Link>
      </header>

      {isLoading ? (
        <div className="flex justify-center items-center mt-16">
          <LoaderCircle className="animate-spin text-brand-accent" size={48} />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center mt-16 bg-white p-8 rounded-lg shadow">
          <h3 className="text-xl font-semibold text-brand-primary">Nenhum serviço encontrado</h3>
          <p className="text-gray-500 mt-2">Comece adicionando o primeiro serviço do seu negócio.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duração</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-brand-primary">{service.name}</div>
                    <div className="text-sm text-gray-500 truncate max-w-xs">{service.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.duration} min</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a href="#" className="text-brand-accent hover:text-brand-primary">Editar</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}