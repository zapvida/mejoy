import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';

type FoodItem = {
  name: string;
  category: string;
  benefit: string;
  tip?: string;
  icon: string;
};

type ShoppingListData = {
  healthy: {
    fruits: FoodItem[];
    vegetables: FoodItem[];
    proteins: FoodItem[];
    grains: FoodItem[];
    dairy: FoodItem[];
    nuts: FoodItem[];
  };
  avoid: {
    processed: FoodItem[];
    sugary: FoodItem[];
    fried: FoodItem[];
    fattyMeats: FoodItem[];
  };
  curiosities: {
    icon: string;
    fact: string;
    explanation: string;
  }[];
};

const shoppingData: ShoppingListData = {
  healthy: {
    fruits: [
      { name: 'Maçã', category: 'Frutas', benefit: 'Rica em fibras e antioxidantes', tip: 'Prefira com casca', icon: '🍎' },
      { name: 'Banana', category: 'Frutas', benefit: 'Potássio para músculos e coração', tip: 'Madura tem mais açúcar', icon: '🍌' },
      { name: 'Laranja', category: 'Frutas', benefit: 'Vitamina C para imunidade', tip: 'Coma o bagaço também', icon: '🍊' },
      { name: 'Morango', category: 'Frutas', benefit: 'Antioxidantes anti-inflamatórios', tip: 'Lave bem antes de comer', icon: '🍓' },
      { name: 'Abacate', category: 'Frutas', benefit: 'Gorduras boas para o cérebro', tip: 'Amadurece fora da geladeira', icon: '🥑' }
    ],
    vegetables: [
      { name: 'Brócolis', category: 'Vegetais', benefit: 'Mais vitamina C que laranja!', tip: 'Cozinhe no vapor', icon: '🥬' },
      { name: 'Espinafre', category: 'Vegetais', benefit: 'Ferro e folato para energia', tip: 'Cru tem mais nutrientes', icon: '🥬' },
      { name: 'Tomate', category: 'Vegetais', benefit: 'Licopeno protege contra câncer', tip: 'Cozido libera mais licopeno', icon: '🍅' },
      { name: 'Cenoura', category: 'Vegetais', benefit: 'Betacaroteno para visão', tip: 'Crua mantém mais vitaminas', icon: '🥕' },
      { name: 'Abobrinha', category: 'Vegetais', benefit: 'Baixa caloria, alta fibra', tip: 'Pode comer com casca', icon: '🥒' }
    ],
    proteins: [
      { name: 'Peito de frango', category: 'Proteínas', benefit: 'Proteína magra para músculos', tip: 'Prefira grelhado', icon: '🍗' },
      { name: 'Salmão', category: 'Proteínas', benefit: 'Ômega-3 para cérebro e coração', tip: 'Selvagem é melhor', icon: '🐟' },
      { name: 'Ovos', category: 'Proteínas', benefit: 'Proteína completa e colina', tip: 'Gema tem nutrientes importantes', icon: '🥚' },
      { name: 'Tofu', category: 'Proteínas', benefit: 'Proteína vegetal completa', tip: 'Escolha o firme', icon: '🧀' },
      { name: 'Quinoa', category: 'Proteínas', benefit: 'Proteína completa + fibras', tip: 'Lave antes de cozinhar', icon: '🌾' }
    ],
    grains: [
      { name: 'Arroz integral', category: 'Grãos', benefit: 'Fibras e vitaminas B', tip: 'Demora mais para cozinhar', icon: '🍚' },
      { name: 'Aveia', category: 'Grãos', benefit: 'Beta-glucana reduz colesterol', tip: 'Farelo tem mais fibras', icon: '🌾' },
      { name: 'Quinoa', category: 'Grãos', benefit: 'Proteína completa + ferro', tip: 'Rinse antes de cozinhar', icon: '🌾' },
      { name: 'Trigo sarraceno', category: 'Grãos', benefit: 'Sem glúten, rico em magnésio', tip: 'Bom para celíacos', icon: '🌾' }
    ],
    dairy: [
      { name: 'Iogurte grego', category: 'Laticínios', benefit: 'Proteína + probióticos', tip: 'Natural sem açúcar', icon: '🥛' },
      { name: 'Leite desnatado', category: 'Laticínios', benefit: 'Cálcio sem gordura', tip: 'Fortificado com vitamina D', icon: '🥛' },
      { name: 'Queijo cottage', category: 'Laticínios', benefit: 'Proteína caseína de lenta digestão', tip: 'Baixo teor de gordura', icon: '🧀' }
    ],
    nuts: [
      { name: 'Amêndoas', category: 'Oleaginosas', benefit: 'Vitamina E + magnésio', tip: 'Um punhado por dia', icon: '🥜' },
      { name: 'Nozes', category: 'Oleaginosas', benefit: 'Ômega-3 vegetal', tip: 'Formato lembra o cérebro!', icon: '🥜' },
      { name: 'Chia', category: 'Sementes', benefit: 'Ômega-3 + fibras solúveis', tip: 'Expande no líquido', icon: '🌱' },
      { name: 'Linhaça', category: 'Sementes', benefit: 'Lignanas + ômega-3', tip: 'Moída é melhor absorvida', icon: '🌱' }
    ]
  },
  avoid: {
    processed: [
      { name: 'Salgadinhos', category: 'Processados', benefit: 'Alto sódio e gorduras trans', tip: 'Substitua por castanhas', icon: '🍿' },
      { name: 'Embutidos', category: 'Processados', benefit: 'Nitritos podem ser cancerígenos', tip: 'Prefira carnes frescas', icon: '🌭' },
      { name: 'Salsichas', category: 'Processados', benefit: 'Alto teor de sódio e conservantes', tip: 'Evite especialmente crianças', icon: '🌭' }
    ],
    sugary: [
      { name: 'Refrigerantes', category: 'Açucarados', benefit: 'Açúcar líquido sem nutrientes', tip: 'Substitua por água com gás', icon: '🥤' },
      { name: 'Sucos industrializados', category: 'Açucarados', benefit: 'Açúcar concentrado', tip: 'Prefira frutas inteiras', icon: '🧃' },
      { name: 'Doces industrializados', category: 'Açucarados', benefit: 'Açúcar + gorduras trans', tip: 'Frutas são doces naturais', icon: '🍭' }
    ],
    fried: [
      { name: 'Batatas fritas', category: 'Frituras', benefit: 'Acrilamida (potencial cancerígeno)', tip: 'Assadas são melhores', icon: '🍟' },
      { name: 'Salgados fritos', category: 'Frituras', benefit: 'Gorduras trans + sódio', tip: 'Prefira assados', icon: '🍤' }
    ],
    fattyMeats: [
      { name: 'Bacon', category: 'Carnes Gordas', benefit: 'Alto teor de gorduras saturadas', tip: 'Use esporadicamente', icon: '🥓' },
      { name: 'Linguiça', category: 'Carnes Gordas', benefit: 'Gordura + sódio + conservantes', tip: 'Prefira carnes magras', icon: '🌭' },
      { name: 'Carne gorda', category: 'Carnes Gordas', benefit: 'Gorduras saturadas', tip: 'Retire a gordura visível', icon: '🥩' }
    ]
  },
  curiosities: [
    {
      icon: '🧠',
      fact: 'Brócolis tem mais vitamina C que laranja!',
      explanation: '100g de brócolis tem 89mg de vitamina C vs 53mg da laranja'
    },
    {
      icon: '🥑',
      fact: 'Abacate tem gorduras boas que reduzem colesterol',
      explanation: 'As gorduras monoinsaturadas aumentam o HDL (colesterol bom)'
    },
    {
      icon: '🐟',
      fact: 'Salmão é rico em ômega-3 para o cérebro',
      explanation: 'DHA e EPA são essenciais para função cognitiva e memória'
    },
    {
      icon: '🥜',
      fact: 'Nozes têm formato de cérebro por uma razão!',
      explanation: 'Ricas em DHA, um ácido graxo essencial para neurônios'
    },
    {
      icon: '🌱',
      fact: 'Chia expande 12x seu tamanho no líquido',
      explanation: 'Cria gel que retarda digestão e mantém saciedade'
    }
  ]
};

type ShoppingListProps = {
  className?: string;
};

export function ShoppingList({ className }: ShoppingListProps) {
  const [activeTab, setActiveTab] = useState<'healthy' | 'avoid' | 'curiosities'>('healthy');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemName: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemName)) {
      newSelected.delete(itemName);
    } else {
      newSelected.add(itemName);
    }
    setSelectedItems(newSelected);
  };

  const renderFoodItems = (items: FoodItem[], _category: string) => (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <motion.div
          key={`${item.name}-${index}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className={clsx(
            'rounded-xl border p-3 cursor-pointer transition-all duration-200',
            selectedItems.has(item.name)
              ? 'bg-emerald-500/20 border-emerald-400/40 scale-105'
              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20',
            'print:bg-white print:border-slate-200 print:text-slate-900'
          )}
          onClick={() => toggleItem(item.name)}
        >
          <div className="flex items-start gap-3">
            <div className="text-xl flex-shrink-0">{item.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold text-white print:text-slate-900 text-sm">
                  {item.name}
                </h4>
                {selectedItems.has(item.name) && (
                  <span className="text-emerald-400">✓</span>
                )}
              </div>
              <p className="text-white/80 print:text-slate-700 text-xs leading-relaxed">
                {item.benefit}
              </p>
              {item.tip && (
                <p className="text-white/60 print:text-slate-500 text-xs mt-1">
                  💡 {item.tip}
                </p>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCuriosities = () => (
    <div className="space-y-4">
      {shoppingData.curiosities.map((curiosity, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="rounded-xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-4 print:bg-white print:border-slate-200"
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl flex-shrink-0">{curiosity.icon}</div>
            <div className="flex-1">
              <p className="font-semibold text-white print:text-slate-900 text-sm mb-1">
                {curiosity.fact}
              </p>
              <p className="text-white/70 print:text-slate-600 text-xs">
                {curiosity.explanation}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className={clsx('space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-3">
          <span className="text-3xl">🛒</span>
          <h2 className="text-2xl font-bold text-white print:text-slate-900">
            Lista de Supermercado Inteligente
          </h2>
        </div>
        <p className="text-white/70 print:text-slate-600 max-w-2xl mx-auto">
          Alimentos que fazem bem, que evitar e curiosidades nutricionais para sua próxima compra
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-white/5 rounded-2xl p-1 border border-white/10">
          {[
            { id: 'healthy', label: '✅ Comprar', icon: '🛒' },
            { id: 'avoid', label: '❌ Evitar', icon: '⚠️' },
            { id: 'curiosities', label: '💡 Curiosidades', icon: '🧠' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              )}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === 'healthy' && (
            <motion.div
              key="healthy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white print:text-slate-900 mb-4">
                  🥗 Alimentos Saudáveis para Comprar
                </h3>
                <p className="text-white/70 print:text-slate-600 text-sm mb-6">
                  Clique nos itens para marcar como selecionados
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(shoppingData.healthy).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-white print:text-slate-900 font-medium mb-3 capitalize">
                      {category === 'nuts' ? 'Oleaginosas e Sementes' : 
                       category === 'grains' ? 'Grãos Integrais' :
                       category === 'dairy' ? 'Laticínios' :
                       category === 'proteins' ? 'Proteínas' :
                       category === 'vegetables' ? 'Vegetais' : 'Frutas'}
                    </h4>
                    {renderFoodItems(items, category)}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'avoid' && (
            <motion.div
              key="avoid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white print:text-slate-900 mb-4">
                  ⚠️ Alimentos para Evitar
                </h3>
                <p className="text-white/70 print:text-slate-600 text-sm mb-6">
                  Conheça os riscos e alternativas saudáveis
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(shoppingData.avoid).map(([category, items]) => (
                  <div key={category}>
                    <h4 className="text-white print:text-slate-900 font-medium mb-3 capitalize">
                      {category === 'processed' ? 'Alimentos Processados' :
                       category === 'sugary' ? 'Açucarados' :
                       category === 'fried' ? 'Frituras' :
                       'Carnes Gordas'}
                    </h4>
                    {renderFoodItems(items, category)}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'curiosities' && (
            <motion.div
              key="curiosities"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-white print:text-slate-900 mb-4">
                  🧠 Curiosidades Nutricionais
                </h3>
                <p className="text-white/70 print:text-slate-600 text-sm">
                  Fatos interessantes sobre os alimentos que você consome
                </p>
              </div>
              {renderCuriosities()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Items Summary */}
      {selectedItems.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4"
        >
          <h4 className="text-emerald-200 font-semibold mb-2">
            📝 Itens Selecionados ({selectedItems.size})
          </h4>
          <div className="flex flex-wrap gap-2">
            {Array.from(selectedItems).map(item => (
              <span
                key={item}
                className="bg-emerald-500/20 text-emerald-200 px-2 py-1 rounded-full text-xs"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
