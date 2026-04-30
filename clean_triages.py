#!/usr/bin/env python3
import os
import re

def clean_triage_file(file_path):
    """Remove dados básicos duplicados de um arquivo de triagem"""
    if not os.path.exists(file_path):
        print(f"⚠️  {file_path} não encontrado")
        return
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Backup
    backup_path = f"{file_path}.backup"
    with open(backup_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    # Remove dados básicos duplicados
    # Padrão para encontrar e remover o bloco de dados básicos
    pattern = r'  \{\s*type: \'select\',\s*name: \'sexo\',.*?categoriaIA: \'dados_basicos\',\s*\},.*?\{\s*type: \'input\',\s*name: \'altura\',.*?categoriaIA: \'dados_basicos\',\s*\},'
    
    # Substituir por string vazia
    cleaned_content = re.sub(pattern, '', content, flags=re.DOTALL)
    
    # Se não encontrou o padrão, tentar padrão mais simples
    if cleaned_content == content:
        # Padrão mais simples - remover linhas individuais
        lines = content.split('\n')
        cleaned_lines = []
        skip_next = False
        
        for i, line in enumerate(lines):
            if skip_next:
                skip_next = False
                continue
                
            # Se encontrar início de dados básicos, pular até encontrar sintomas principais
            if "name: 'sexo'" in line and "categoriaIA: 'dados_basicos'" in line:
                # Pular esta linha e as próximas até encontrar sintomas principais
                j = i
                while j < len(lines) and "setor_sintomas" not in lines[j]:
                    j += 1
                # Voltar uma linha para incluir o setor de sintomas
                if j < len(lines):
                    cleaned_lines.append(lines[j])
                skip_next = True
                continue
            
            # Se não é linha de dados básicos, manter
            if not any(x in line for x in ["name: 'sexo'", "name: 'idade'", "name: 'peso'", "name: 'altura'"]) or "categoriaIA: 'dados_basicos'" not in line:
                cleaned_lines.append(line)
        
        cleaned_content = '\n'.join(cleaned_lines)
    
    # Escrever arquivo limpo
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(cleaned_content)
    
    print(f"✅ {file_path} processado")

# Lista de arquivos para processar
triage_files = [
    "src/forms/coluna.ts",
    "src/forms/biohacking.ts", 
    "src/forms/bucal.ts",
    "src/forms/crianca.ts",
    "src/forms/microbioma.ts",
    "src/forms/dor-cronica.ts",
    "src/forms/tireoide.ts",
    "src/forms/cancer.ts",
    "src/forms/respiratoria.ts",
    "src/forms/auditiva.ts",
    "src/forms/ocular.ts",
    "src/forms/pele.ts",
    "src/forms/mama.ts",
    "src/forms/vitalidade.ts",
    "src/forms/longevidade.ts",
    "src/forms/hepatica.ts",
    "src/forms/micronutrientes.ts",
    "src/forms/trabalhador.ts",
    "src/forms/alergias.ts",
    "src/forms/gestante.ts",
    "src/forms/mental.ts",
    "src/forms/sono.ts"
]

print("Removendo dados básicos duplicados das triagens...")
for file_path in triage_files:
    clean_triage_file(file_path)

print("✅ Limpeza concluída!")
