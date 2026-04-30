'use client';

import { useState } from 'react';
import { BlogArticleCard } from './BlogArticleCard';

interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  summary: string;
  readTime?: string;
}

const allArticles: BlogArticle[] = [
  {
    slug: 'o-que-mudou-nas-regras-anvisa',
    title: 'O que mudou nas regras da ANVISA sobre remédios para emagrecer',
    category: 'MEDICAMENTOS',
    summary: 'Entenda as novas regulamentações da ANVISA para medicamentos de emagrecimento e como isso afeta o tratamento.',
    readTime: '8 min',
  },
  {
    slug: 'semaglutida-tirzepatida-similares',
    title: 'Semaglutida, tirzepatida e similares: o que você precisa saber antes de usar',
    category: 'MEDICAMENTOS',
    summary: 'Guia completo sobre as classes de medicamentos modernos para obesidade, como funcionam e quando são indicados.',
    readTime: '10 min',
  },
  {
    slug: 'suporte-nutricional-emagrecimento',
    title: 'Como o suporte nutricional muda o jogo no emagrecimento',
    category: 'ESTILO DE VIDA',
    summary: 'A importância da nutrição no tratamento da obesidade e como a orientação nutricional pode potencializar os resultados.',
    readTime: '6 min',
  },
  {
    slug: 'sono-estresse-peso',
    title: 'Sono, estresse e peso: por que você não consegue emagrecer só com dieta',
    category: 'ESTILO DE VIDA',
    summary: 'Entenda como sono inadequado e estresse crônico podem sabotar seus esforços de emagrecimento e o que fazer.',
    readTime: '7 min',
  },
  {
    slug: 'emagrecimento-feminino-hormonios',
    title: 'Emagrecimento feminino: hormônios, ciclo e particularidades',
    category: 'ESTILO DE VIDA',
    summary: 'As particularidades do emagrecimento em mulheres, incluindo a influência dos hormônios e do ciclo menstrual.',
    readTime: '9 min',
  },
  {
    slug: 'obesidade-doenca-cronica',
    title: 'Obesidade é doença crônica: por que isso importa',
    category: 'EDUCAÇÃO',
    summary: 'Entenda por que a obesidade é reconhecida como doença crônica e como isso muda a abordagem do tratamento.',
    readTime: '5 min',
  },
];

const categories = ['TODOS', 'MEDICAMENTOS', 'ESTILO DE VIDA', 'EDUCAÇÃO'];

export function BlogArticlesSection() {
  const [selectedCategory, setSelectedCategory] = useState('TODOS');

  const filteredArticles =
    selectedCategory === 'TODOS'
      ? allArticles
      : allArticles.filter((article) => article.category === selectedCategory);

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 sm:mb-10 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                selectedCategory === category
                  ? 'bg-gradient-to-r from-emerald-600 to-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredArticles.map((article) => (
            <BlogArticleCard key={article.slug} article={article} />
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">Nenhum artigo encontrado nesta categoria.</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="bg-gradient-to-br from-emerald-50 to-orange-50 rounded-xl sm:rounded-2xl p-8 sm:p-10 border-2 border-emerald-200 max-w-2xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              Ficou em dúvida?
            </h3>
            <p className="text-base sm:text-lg text-gray-700 mb-6">
              Como médico, sei que dúvidas são normais. Fale com um de nossos especialistas e tire todas as suas dúvidas sobre emagrecimento e tratamento.
            </p>
            <a
              href="/triagem/emagrecimento"
              onClick={() => {
                if (typeof window !== 'undefined' && (window as any).analytics) {
                  (window as any).analytics.track('triagem_emagrecimento_cta_blog');
                }
              }}
              className="inline-block bg-gradient-to-r from-emerald-600 to-orange-600 text-white font-bold py-3 sm:py-4 px-8 rounded-lg hover:shadow-lg transition-all hover:scale-105 text-base sm:text-lg"
            >
              Quero tirar minhas dúvidas com um médico
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

