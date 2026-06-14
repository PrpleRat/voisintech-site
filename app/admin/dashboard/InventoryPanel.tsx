"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Package, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { formatPrice, parseSpecs, type PcSpecs, type StoreCategory } from "@/lib/store-utils";

interface StoreItemRow {
  id: string;
  name: string;
  description: string;
  category: string;
  buyPriceCents: number;
  sellPriceCents: number;
  quantity: number;
  visibleOnStore: boolean;
  specs: string | null;
  imageUrl: string | null;
}

interface PackItemRow {
  id: string;
  itemId: string;
  quantity: number;
  item: StoreItemRow;
}

interface StorePackRow {
  id: string;
  name: string;
  description: string;
  sellPriceCents: number;
  visibleOnStore: boolean;
  items: PackItemRow[];
}

interface ItemForm {
  name: string;
  description: string;
  category: StoreCategory;
  buyPriceEuros: string;
  sellPriceEuros: string;
  quantity: string;
  visibleOnStore: boolean;
  imageUrl: string;
  specs: PcSpecs;
}

interface PackLineForm {
  itemId: string;
  quantity: string;
}

interface PackForm {
  name: string;
  description: string;
  sellPriceEuros: string;
  visibleOnStore: boolean;
  lines: PackLineForm[];
}

const emptyItemForm = (): ItemForm => ({
  name: "",
  description: "",
  category: "accessory",
  buyPriceEuros: "0",
  sellPriceEuros: "",
  quantity: "0",
  visibleOnStore: true,
  imageUrl: "",
  specs: {},
});

const emptyPackForm = (): PackForm => ({
  name: "",
  description: "",
  sellPriceEuros: "",
  visibleOnStore: true,
  lines: [{ itemId: "", quantity: "1" }],
});

const categoryLabels: Record<StoreCategory, string> = {
  accessory: "Accessoire",
  pc: "PC reconditionné",
  other: "Autre",
};

function eurosToCents(value: string): number {
  const n = parseFloat(value.replace(",", "."));
  if (Number.isNaN(n)) return 0;
  return Math.round(n * 100);
}

function centsToEurosInput(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

function itemToForm(item: StoreItemRow): ItemForm {
  const specs = parseSpecs(item.specs) || {};
  return {
    name: item.name,
    description: item.description,
    category: item.category as StoreCategory,
    buyPriceEuros: centsToEurosInput(item.buyPriceCents),
    sellPriceEuros: centsToEurosInput(item.sellPriceCents),
    quantity: String(item.quantity),
    visibleOnStore: item.visibleOnStore,
    imageUrl: item.imageUrl || "",
    specs: {
      cpu: specs.cpu || "",
      ram: specs.ram || "",
      storage: specs.storage || "",
      screen: specs.screen || "",
    },
  };
}

function packToForm(pack: StorePackRow): PackForm {
  return {
    name: pack.name,
    description: pack.description,
    sellPriceEuros: centsToEurosInput(pack.sellPriceCents),
    visibleOnStore: pack.visibleOnStore,
    lines:
      pack.items.length > 0
        ? pack.items.map((pi) => ({ itemId: pi.itemId, quantity: String(pi.quantity) }))
        : [{ itemId: "", quantity: "1" }],
  };
}

async function apiPost(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Erreur serveur");
  }
  return res.json();
}

export function InventoryPanel() {
  const [items, setItems] = useState<StoreItemRow[]>([]);
  const [packs, setPacks] = useState<StorePackRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [subTab, setSubTab] = useState<"items" | "packs">("items");
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showPackForm, setShowPackForm] = useState(false);
  const [itemForm, setItemForm] = useState<ItemForm>(emptyItemForm());
  const [packForm, setPackForm] = useState<PackForm>(emptyPackForm());

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      if (!res.ok) throw new Error("Non autorisé");
      const data = await res.json();
      setItems(data.items || []);
      setPacks(data.packs || []);
    } catch {
      alert("Impossible de charger l'inventaire.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const resetItemForm = () => {
    setItemForm(emptyItemForm());
    setEditingItemId(null);
    setShowItemForm(false);
  };

  const resetPackForm = () => {
    setPackForm(emptyPackForm());
    setEditingPackId(null);
    setShowPackForm(false);
  };

  const startEditItem = (item: StoreItemRow) => {
    setItemForm(itemToForm(item));
    setEditingItemId(item.id);
    setShowItemForm(true);
    setSubTab("items");
  };

  const startEditPack = (pack: StorePackRow) => {
    setPackForm(packToForm(pack));
    setEditingPackId(pack.id);
    setShowPackForm(true);
    setSubTab("packs");
  };

  const submitItem = async () => {
    if (!itemForm.name.trim() || !itemForm.sellPriceEuros.trim()) {
      alert("Nom et prix de vente requis.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: itemForm.name.trim(),
        description: itemForm.description.trim(),
        category: itemForm.category,
        buyPriceCents: eurosToCents(itemForm.buyPriceEuros),
        sellPriceCents: eurosToCents(itemForm.sellPriceEuros),
        quantity: parseInt(itemForm.quantity, 10) || 0,
        visibleOnStore: itemForm.visibleOnStore,
        imageUrl: itemForm.imageUrl.trim() || null,
        specs:
          itemForm.category === "pc"
            ? {
                cpu: itemForm.specs.cpu?.trim(),
                ram: itemForm.specs.ram?.trim(),
                storage: itemForm.specs.storage?.trim(),
                screen: itemForm.specs.screen?.trim(),
              }
            : null,
      };

      if (editingItemId) {
        await apiPost({ action: "update-item", id: editingItemId, ...payload });
      } else {
        await apiPost({ action: "create-item", ...payload });
      }
      resetItemForm();
      await loadData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item: StoreItemRow) => {
    if (!window.confirm(`Supprimer « ${item.name} » ?`)) return;
    setSaving(true);
    try {
      await apiPost({ action: "delete-item", id: item.id });
      await loadData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const submitPack = async () => {
    if (!packForm.name.trim() || !packForm.sellPriceEuros.trim()) {
      alert("Nom et prix de vente requis.");
      return;
    }

    const lines = packForm.lines
      .filter((l) => l.itemId)
      .map((l) => ({ itemId: l.itemId, quantity: parseInt(l.quantity, 10) || 1 }));

    if (lines.length === 0) {
      alert("Ajoutez au moins un article au pack.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: packForm.name.trim(),
        description: packForm.description.trim(),
        sellPriceCents: eurosToCents(packForm.sellPriceEuros),
        visibleOnStore: packForm.visibleOnStore,
        items: lines,
      };

      if (editingPackId) {
        await apiPost({ action: "update-pack", id: editingPackId, ...payload });
      } else {
        await apiPost({ action: "create-pack", ...payload });
      }
      resetPackForm();
      await loadData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const deletePack = async (pack: StorePackRow) => {
    if (!window.confirm(`Supprimer le pack « ${pack.name} » ?`)) return;
    setSaving(true);
    try {
      await apiPost({ action: "delete-pack", id: pack.id });
      await loadData();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3">
        <Button
          variant={subTab === "items" ? "default" : "outline"}
          onClick={() => setSubTab("items")}
        >
          <Package className="h-4 w-4" aria-hidden="true" />
          Stock ({items.length})
        </Button>
        <Button
          variant={subTab === "packs" ? "default" : "outline"}
          onClick={() => setSubTab("packs")}
        >
          <Boxes className="h-4 w-4" aria-hidden="true" />
          Packs ({packs.length})
        </Button>
      </div>

      {subTab === "items" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <p className="text-gray-600 text-sm">
              Gérez accessoires, PC reconditionnés et autres articles.
            </p>
            <Button
              size="sm"
              onClick={() => {
                resetItemForm();
                setShowItemForm(true);
              }}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Ajouter un article
            </Button>
          </div>

          {showItemForm && (
            <article className="card space-y-4">
              <h3 className="text-lg font-bold">
                {editingItemId ? "Modifier l'article" : "Nouvel article"}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="item-name">Nom</Label>
                  <Input
                    id="item-name"
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="item-category">Catégorie</Label>
                  <select
                    id="item-category"
                    className="flex h-12 w-full rounded-xl border-2 border-gray-200 bg-white px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    value={itemForm.category}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, category: e.target.value as StoreCategory })
                    }
                  >
                    <option value="accessory">Accessoire</option>
                    <option value="pc">PC reconditionné</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="item-desc">Description</Label>
                  <Textarea
                    id="item-desc"
                    value={itemForm.description}
                    onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="item-buy">Prix d&apos;achat (€)</Label>
                  <Input
                    id="item-buy"
                    inputMode="decimal"
                    value={itemForm.buyPriceEuros}
                    onChange={(e) => setItemForm({ ...itemForm, buyPriceEuros: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="item-sell">Prix de vente (€)</Label>
                  <Input
                    id="item-sell"
                    inputMode="decimal"
                    value={itemForm.sellPriceEuros}
                    onChange={(e) => setItemForm({ ...itemForm, sellPriceEuros: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="item-qty">Quantité en stock</Label>
                  <Input
                    id="item-qty"
                    type="number"
                    min={0}
                    value={itemForm.quantity}
                    onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="item-image">URL image (optionnel)</Label>
                  <Input
                    id="item-image"
                    value={itemForm.imageUrl}
                    onChange={(e) => setItemForm({ ...itemForm, imageUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                {itemForm.category === "pc" && (
                  <>
                    <div>
                      <Label htmlFor="spec-cpu">Processeur</Label>
                      <Input
                        id="spec-cpu"
                        value={itemForm.specs.cpu || ""}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            specs: { ...itemForm.specs, cpu: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="spec-ram">RAM</Label>
                      <Input
                        id="spec-ram"
                        value={itemForm.specs.ram || ""}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            specs: { ...itemForm.specs, ram: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="spec-storage">Stockage</Label>
                      <Input
                        id="spec-storage"
                        value={itemForm.specs.storage || ""}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            specs: { ...itemForm.specs, storage: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="spec-screen">Écran</Label>
                      <Input
                        id="spec-screen"
                        value={itemForm.specs.screen || ""}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            specs: { ...itemForm.specs, screen: e.target.value },
                          })
                        }
                      />
                    </div>
                  </>
                )}
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={itemForm.visibleOnStore}
                  onCheckedChange={(v) =>
                    setItemForm({ ...itemForm, visibleOnStore: v === true })
                  }
                />
                <span className="text-sm">Visible sur la boutique (/materiel)</span>
              </label>
              <div className="flex gap-3">
                <Button onClick={submitItem} disabled={saving}>
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </Button>
                <Button variant="outline" onClick={resetItemForm}>
                  Annuler
                </Button>
              </div>
            </article>
          )}

          {items.map((item) => (
            <article key={item.id} className="card">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {categoryLabels[item.category as StoreCategory] || item.category}
                    </span>
                    {!item.visibleOnStore && (
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        Pack uniquement
                      </span>
                    )}
                    {item.quantity === 0 && (
                      <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        Rupture
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-bold text-xl">{formatPrice(item.sellPriceCents)}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Stock : {item.quantity} — Achat : {formatPrice(item.buyPriceCents)}
                  </p>
                  {item.description && (
                    <p className="text-gray-600 text-sm mt-2">{item.description}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEditItem(item)}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    disabled={saving}
                    onClick={() => deleteItem(item)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </article>
          ))}

          {items.length === 0 && !showItemForm && (
            <p className="text-center text-gray-500 py-12">Aucun article en stock</p>
          )}
        </div>
      )}

      {subTab === "packs" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <p className="text-gray-600 text-sm">
              Composez des packs à partir du stock. Les packs indisponibles (stock insuffisant) ne
              s&apos;affichent pas sur le site.
            </p>
            <Button
              size="sm"
              onClick={() => {
                resetPackForm();
                setShowPackForm(true);
              }}
              disabled={items.length === 0}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Créer un pack
            </Button>
          </div>

          {showPackForm && (
            <article className="card space-y-4">
              <h3 className="text-lg font-bold">
                {editingPackId ? "Modifier le pack" : "Nouveau pack"}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pack-name">Nom</Label>
                  <Input
                    id="pack-name"
                    value={packForm.name}
                    onChange={(e) => setPackForm({ ...packForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="pack-sell">Prix de vente (€)</Label>
                  <Input
                    id="pack-sell"
                    inputMode="decimal"
                    value={packForm.sellPriceEuros}
                    onChange={(e) => setPackForm({ ...packForm, sellPriceEuros: e.target.value })}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="pack-desc">Description</Label>
                  <Textarea
                    id="pack-desc"
                    value={packForm.description}
                    onChange={(e) => setPackForm({ ...packForm, description: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Composition</Label>
                {packForm.lines.map((line, idx) => (
                  <div key={idx} className="flex flex-wrap gap-2 items-center">
                    <select
                      className="flex h-10 min-w-[200px] flex-1 rounded-lg border-2 border-gray-200 bg-white px-3 text-sm"
                      value={line.itemId}
                      onChange={(e) => {
                        const lines = [...packForm.lines];
                        lines[idx] = { ...lines[idx], itemId: e.target.value };
                        setPackForm({ ...packForm, lines });
                      }}
                    >
                      <option value="">— Choisir un article —</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} (stock: {item.quantity})
                        </option>
                      ))}
                    </select>
                    <Input
                      type="number"
                      min={1}
                      className="w-24 h-10"
                      value={line.quantity}
                      onChange={(e) => {
                        const lines = [...packForm.lines];
                        lines[idx] = { ...lines[idx], quantity: e.target.value };
                        setPackForm({ ...packForm, lines });
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => {
                        const lines = packForm.lines.filter((_, i) => i !== idx);
                        setPackForm({
                          ...packForm,
                          lines: lines.length ? lines : [{ itemId: "", quantity: "1" }],
                        });
                      }}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setPackForm({
                      ...packForm,
                      lines: [...packForm.lines, { itemId: "", quantity: "1" }],
                    })
                  }
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Ajouter une ligne
                </Button>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={packForm.visibleOnStore}
                  onCheckedChange={(v) =>
                    setPackForm({ ...packForm, visibleOnStore: v === true })
                  }
                />
                <span className="text-sm">Visible sur la boutique (/materiel)</span>
              </label>

              <div className="flex gap-3">
                <Button onClick={submitPack} disabled={saving}>
                  {saving ? "Enregistrement…" : "Enregistrer"}
                </Button>
                <Button variant="outline" onClick={resetPackForm}>
                  Annuler
                </Button>
              </div>
            </article>
          )}

          {packs.map((pack) => (
            <article key={pack.id} className="card">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold">{pack.name}</h3>
                    {!pack.visibleOnStore && (
                      <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        Masqué
                      </span>
                    )}
                  </div>
                  <p className="text-primary font-bold text-xl">{formatPrice(pack.sellPriceCents)}</p>
                  {pack.description && (
                    <p className="text-gray-600 text-sm mt-2">{pack.description}</p>
                  )}
                  <ul className="text-sm text-gray-600 mt-3 space-y-1">
                    {pack.items.map((pi) => (
                      <li key={pi.id}>
                        {pi.quantity}× {pi.item.name}
                        {pi.item.quantity < pi.quantity && (
                          <span className="text-red-600 ml-2">(stock insuffisant)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => startEditPack(pack)}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    disabled={saving}
                    onClick={() => deletePack(pack)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </article>
          ))}

          {packs.length === 0 && !showPackForm && (
            <p className="text-center text-gray-500 py-12">Aucun pack configuré</p>
          )}
        </div>
      )}
    </div>
  );
}
