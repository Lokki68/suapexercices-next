import { exportScenarioPDF } from "@/lib/pdf/exportScenario";
import { Scenario } from "@/types";
import { Download, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ScenarioActionsProps {
  scenario: Scenario;
  type: string;
  contraintes?: string;
  isPremium: boolean;
  savedScenarioId?: string;
  onSaved?: (id: string) => void;
  onDeleted?: () => void;
}

export default function ScenarioActions({
  scenario,
  type,
  contraintes,
  isPremium,
  savedScenarioId,
  onSaved,
  onDeleted,
}: ScenarioActionsProps) {
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [title, setTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleExportPdf = () => {
    if (!isPremium) {
      alert("⭐ Fonctionnalité Premium uniquement");
      return;
    }

    exportScenarioPDF(scenario, type, title || undefined);
  };

  const handleSave = async () => {
    if (!isPremium) {
      alert("⭐ Fonctionnalité Premium uniquement");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/scenarios/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          scenario,
          type,
          contraintes,
          title: title || `Scenario ${type}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur de sauvegarde");
      }

      const data = await response.json();
      onSaved?.(data.id);
      setDialogOpen(false);
      alert("Scénario sauvegardé !");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!savedScenarioId) return;

    if (!confirm("Etes-vous sur de vouloir supprimer ce scénario ?")) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/scenarios/${savedScenarioId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur de suppression");
      }

      onDeleted?.();
      alert("Scénario supprimé !");
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la suppression");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        onClick={handleExportPdf}
        variant="outline"
        className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-gray-300"
        disabled={!isPremium}
      >
        <Download className="mr-2 h-45 w-4" />
        Export PDF {!isPremium && "🔒"}
      </Button>

      {!savedScenarioId && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-gray-300"
              disabled={!isPremium}
            >
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder {!isPremium && "🔒"}
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 border-gray-700 text-gray-300">
            <DialogHeader>
              <DialogTitle>Sauvegarder le scénario</DialogTitle>
              <DialogDescription>
                Donnez un titre à votre scénario pour le retrouver facilement
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Titre du scénario</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Scénario ${type}`}
                  className="bg-gray-900 border-gray-700 mt-2"
                />
              </div>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {saving ? "Sauvegarde en cours..." : "Sauvegarder"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {savedScenarioId && (
        <Button
          variant="outline"
          className="bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-gray-300"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleting ? "Suppression en cours..." : "Supprimer"}
        </Button>
      )}
    </div>
  );
}
