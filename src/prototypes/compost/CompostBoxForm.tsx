// File: components/compost/CompostBoxForm.tsx
import React from 'react';
import { X } from 'lucide-react';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from './ui/Dialog';
import { CompostBox } from './data/compostInitialData';

interface CompostBoxFormProps {
  box?: CompostBox | null;
  onSubmit: (boxData: Partial<CompostBox>) => void;
  onClose: () => void;
}

interface FormSubmitData {
  id?: number;
  name: string;
  fillLevel: number;
  temperature: number;
  moisture: 'sec' | 'optimal' | 'humide';
  materials: string[];
  schedule: any[];
  history: any[];
}

/**
 * Form component for adding or editing compost boxes
 * 
 * @param box - The box to edit (null if adding a new box)
 * @param onSubmit - Function to call when form is submitted
 * @param onClose - Function to call when form is closed
 */
const CompostBoxForm: React.FC<CompostBoxFormProps> = ({ box = null, onSubmit, onClose }) => (
  <Dialog open={true} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="flex justify-between items-center">
          <DialogTitle>{box ? 'Modifier le Bac' : 'Ajouter un Nouveau Bac'}</DialogTitle>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <DialogDescription>
          {box ? 'Modifier les informations du bac de compost' : 'Ajouter un nouveau bac de compost au site'}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const materialsString = formData.get('materials')?.toString() || '';
        
        const formSubmitData: FormSubmitData = {
          id: box?.id,
          name: formData.get('name')?.toString() || '',
          fillLevel: parseInt(formData.get('fillLevel')?.toString() || '0'),
          temperature: parseInt(formData.get('temperature')?.toString() || '20'),
          moisture: (formData.get('moisture')?.toString() || 'optimal') as 'sec' | 'optimal' | 'humide',
          materials: materialsString ? materialsString.split(',').map(m => m.trim()) : [],
          schedule: box?.schedule || [],
          history: box?.history || []
        };
        onSubmit(formSubmitData);
      }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input
            name="name"
            defaultValue={box?.name}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Niveau de Remplissage (%)</label>
          <input
            name="fillLevel"
            type="number"
            defaultValue={box?.fillLevel || 0}
            className="w-full p-2 border rounded"
            min="0"
            max="100"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Température (°C)</label>
          <input
            name="temperature"
            type="number"
            defaultValue={box?.temperature || 20}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Niveau d'Humidité</label>
          <select
            name="moisture"
            defaultValue={box?.moisture || 'optimal'}
            className="w-full p-2 border rounded"
          >
            <option value="sec">Sec</option>
            <option value="optimal">Optimal</option>
            <option value="humide">Humide</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Matériaux</label>
          <input
            name="materials"
            defaultValue={box?.materials?.join(', ') || ''}
            className="w-full p-2 border rounded"
            placeholder="Entrez les matériaux séparés par des virgules"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
            Annuler
          </button>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
            Enregistrer
          </button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

export default CompostBoxForm;