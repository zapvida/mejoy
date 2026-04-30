import Link from 'next/link';

interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  summary: string;
  readTime?: string;
}

interface BlogArticleCardProps {
  article: BlogArticle;
}

export function BlogArticleCard({ article }: BlogArticleCardProps) {
  return (
    <Link href={`/emagrecimento/blog/${article.slug}`} className="block">
      <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border-2 border-emerald-100 hover:shadow-xl transition-all hover:scale-[1.02] h-full">
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
            {article.category}
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 leading-tight">
          {article.title}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">
          {article.summary}
        </p>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <span className="text-xs text-gray-500">
            {article.readTime || '5 min de leitura'}
          </span>
          <span className="text-xs text-emerald-600 font-semibold">
            Ler mais →
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-semibold rounded">
            Conteúdo educativo – não substitui consulta
          </span>
        </div>
      </div>
    </Link>
  );
}

