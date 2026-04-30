// src/components/patient/PatientBasicsForm.tsx
// Componente para coleta de dados básicos do paciente (peso, altura, sexo, data nascimento)

import { useState, useEffect } from 'react';

import { Card } from '@/components/ui/Card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// TODO(backcompat-2025-10-23) - Componentes Card compatibilidade
const CardContent = ({ children }: any) => <div className="p-6">{children}</div>;
const CardDescription = ({ children }: any) => <p className="text-sm text-gray-600">{children}</p>;
const CardHeader = ({ children }: any) => <div className="px-6 py-4 border-b">{children}</div>;
const CardTitle = ({ children }: any) => <h3 className="text-lg font-semibold">{children}</h3>;
import { PatientBasics, validatePatientBasics, createPatientProfile, persistPatientProfile } from '@/features/patient/profile';

interface PatientBasicsFormProps {
  onComplete: (profile: ReturnType<typeof createPatientProfile>) => void;
  initialData?: Partial<PatientBasics>;
  title?: string;
  description?: string;
}

export function PatientBasicsForm({ 
  onComplete, 
  initialData = {},
  title = "Dados Básicos",
  description = "Preencha seus dados para personalizar sua triagem"
}: PatientBasicsFormProps) {
  const [formData, setFormData] = useState<Partial<PatientBasics>>({
    sex: "M",
    birthDateISO: "",
    weightKg: 0,
    heightCm: 0,
    ...initialData
  });
  
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validar dados
    const validationErrors = validatePatientBasics(formData);
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Criar perfil completo
      const profile = createPatientProfile(formData as PatientBasics);
      
      // Persistir no localStorage
      persistPatientProfile(profile);
      
      // Chamar callback
      onComplete(profile);
      
    } catch (error) {
      console.error('Error creating patient profile:', error);
      setErrors(['Erro ao processar dados. Tente novamente.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof PatientBasics, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erros quando usuário começar a digitar
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Sexo */}
          <div className="space-y-2">
            <Label htmlFor="sex">Sexo</Label>
            <Select 
              {...{ 
                value: formData.sex, 
                onValueChange: (v: any) => handleInputChange('sex', v) 
              } as any}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione seu sexo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="M">Masculino</SelectItem>
                <SelectItem value="F">Feminino</SelectItem>
                <SelectItem value="Outro">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data de Nascimento */}
          <div className="space-y-2">
            <Label htmlFor="birthDate">Data de Nascimento</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDateISO}
              onChange={(e) => handleInputChange('birthDateISO', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Peso */}
          <div className="space-y-2">
            <Label htmlFor="weight">Peso (kg)</Label>
            <Input
              id="weight"
              type="number"
              min="20"
              max="300"
              step="0.1"
              value={formData.weightKg || ''}
              onChange={(e) => handleInputChange('weightKg', parseFloat(e.target.value) || 0)}
              placeholder="Ex: 70.5"
              required
            />
          </div>

          {/* Altura */}
          <div className="space-y-2">
            <Label htmlFor="height">Altura (cm)</Label>
            <Input
              id="height"
              type="number"
              min="100"
              max="250"
              step="0.1"
              value={formData.heightCm || ''}
              onChange={(e) => handleInputChange('heightCm', parseFloat(e.target.value) || 0)}
              placeholder="Ex: 175"
              required
            />
          </div>

          {/* Erros */}
          {errors.length > 0 && (
            <Alert variant="destructive">
              <AlertDescription>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {/* Botão de Submit */}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processando...' : 'Continuar'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

/**
 * Hook para usar o perfil do paciente
 */
export function usePatientProfile() {
  const [profile, setProfile] = useState<ReturnType<typeof createPatientProfile> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Carregar perfil persistido
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem('ah.patientProfile.v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          setProfile(parsed);
        }
      } catch (error) {
        console.warn('Failed to load patient profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const updateProfile = (newProfile: ReturnType<typeof createPatientProfile>) => {
    setProfile(newProfile);
    persistPatientProfile(newProfile);
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem('ah.patientProfile.v1');
  };

  return {
    profile,
    isLoading,
    updateProfile,
    clearProfile,
    hasProfile: !!profile
  };
}
