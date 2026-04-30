# 🎯 STRIPE PRODUTOS E PREÇOS CRIADOS (TEST MODE)

## PRODUTOS:
- **Alloe Health Basic**: `prod_TEMtEc8hJAXqRH`
- **Alloe Health Plus**: `prod_TEMt7Y6N1GmhxR`

## PREÇOS:
- **Basic Mensal (R$ 29,00)**: `price_1SHuA02Nl0Zqe3RCIkDBZQ7w`
- **Basic Anual (R$ 290,00)**: `price_1SHuA42Nl0Zqe3RCYhkKpPh8`
- **Plus Mensal (R$ 49,00)**: `price_1SHuA92Nl0Zqe3RCjhTsVpT6`
- **Plus Anual (R$ 490,00)**: `price_1SHuAC2Nl0Zqe3RCMRAhzA2k`

## PRÓXIMOS PASSOS:
1. ✅ Produtos e preços criados
2. 🔄 Atualizar variáveis de ambiente no Vercel
3. 🔄 Deploy final
4. 🔄 Teste em produção

## COMANDOS PARA ATUALIZAR ENVS:
```bash
vercel env rm STRIPE_PRICE_BASIC_M production
echo "price_1SHuA02Nl0Zqe3RCIkDBZQ7w" | vercel env add STRIPE_PRICE_BASIC_M production

vercel env rm STRIPE_PRICE_BASIC_Y production
echo "price_1SHuA42Nl0Zqe3RCYhkKpPh8" | vercel env add STRIPE_PRICE_BASIC_Y production

vercel env rm STRIPE_PRICE_PLUS_M production
echo "price_1SHuA92Nl0Zqe3RCjhTsVpT6" | vercel env add STRIPE_PRICE_PLUS_M production

vercel env rm STRIPE_PRICE_PLUS_Y production
echo "price_1SHuAC2Nl0Zqe3RCMRAhzA2k" | vercel env add STRIPE_PRICE_PLUS_Y production
```
