import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { X, Plus } from 'lucide-react';

interface ConfigurationFormProps {
  formData: {
    name: string;
    description: string;
    dataType: string;
    tags: string[];
  };
  onFormChange: (data: any) => void;
  disabled?: boolean;
}

export function ConfigurationForm({ formData, onFormChange, disabled = false }: ConfigurationFormProps) {
  const [newTag, setNewTag] = React.useState('');

  const handleInputChange = (field: string, value: string) => {
    onFormChange({
      ...formData,
      [field]: value
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      onFormChange({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onFormChange({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Card className="bg-[#16213e] border-[#0f3460]">
      <CardHeader>
        <CardTitle className="text-white">Configuración del Dataset</CardTitle>
        <p className="text-sm text-gray-400">
          Complete la información del dataset para su correcta clasificación
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Nombre del Dataset */}
        <div className="space-y-2">
          <Label htmlFor="dataset-name" className="text-gray-300">
            Nombre del Dataset *
          </Label>
          <Input
            id="dataset-name"
            placeholder="Ej: Dataset_Trafico_Web_2025"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={disabled}
            className="bg-[#0f3460] border-[#1a1a2e] text-white placeholder-gray-400"
          />
        </div>

        {/* Descripción */}
        <div className="space-y-2">
          <Label htmlFor="dataset-description" className="text-gray-300">
            Descripción
          </Label>
          <Textarea
            id="dataset-description"
            placeholder="Describe el contenido y propósito del dataset..."
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            disabled={disabled}
            className="bg-[#0f3460] border-[#1a1a2e] text-white placeholder-gray-400 min-h-20"
          />
        </div>

        {/* Tipo de Datos */}
        <div className="space-y-2">
          <Label className="text-gray-300">Tipo de Datos *</Label>
          <Select
            value={formData.dataType}
            onValueChange={(value) => handleInputChange('dataType', value)}
            disabled={disabled}
          >
            <SelectTrigger className="bg-[#0f3460] border-[#1a1a2e] text-white">
              <SelectValue placeholder="Selecciona el tipo de datos" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f3460] border-[#1a1a2e]">
              <SelectItem value="normal">Tráfico Normal</SelectItem>
              <SelectItem value="malicious">Tráfico Malicioso</SelectItem>
              <SelectItem value="mixed">Mixto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Etiquetas */}
        <div className="space-y-2">
          <Label className="text-gray-300">Etiquetas</Label>
          <div className="flex space-x-2">
            <Input
              placeholder="Agregar etiqueta..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              disabled={disabled}
              className="bg-[#0f3460] border-[#1a1a2e] text-white placeholder-gray-400 flex-1"
            />
            <Button
              type="button"
              size="icon"
              onClick={addTag}
              disabled={disabled || !newTag.trim()}
              className="bg-[#e94560] hover:bg-[#e94560]/90"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-[#0f3460] text-gray-300 hover:bg-[#1a1a2e]"
                >
                  {tag}
                  {!disabled && (
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-400"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}