import { useState } from "react";
import {
  X,
  Search,
  Package,
  Server,
  ShoppingCart,
  Zap,
  Calendar,
  Settings,
  Minus,
  Plus,
  Trash2,
  Check,
  ChevronDown,
} from "lucide-react";

interface ModePricing {
  setupFee: number;
  annualFee: number;
}

interface Promo {
  description: string;
  setupFeeDiscount: number;
  annualFeeDiscount: number;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  pricing: Record<string, ModePricing>;
  icon: string;
  category: string;
  promo?: Promo;
}

interface SelectedFeature extends Feature {
  renewal: boolean;
  aiMode: string;
  discount: number;
  quantity: number;
  notes: string;
}

const FEATURES: Feature[] = [
  {
    id: "i3host",
    name: "i3HOST",
    description:
      "Annual: i3Host Advanced Site Management. Single sign-on, NVR health monitor, application management, per server.",
    pricing: {
      i3Ai: { setupFee: 500, annualFee: 2499 },
      "i3Ai Cloud": { setupFee: 750, annualFee: 2999 },
    },
    icon: "server",
    category: "i3Host",
    promo: {
      description:
        "i3Host Promo: 1st year FREE - Setup Fee 100% off until June 1, 2026",
      setupFeeDiscount: 100,
      annualFeeDiscount: 100,
    },
  },
  {
    id: "vsc",
    name: "VSC",
    description:
      "Annual: Video Streaming, per server/ 10GB Streaming/month; Total 50GB Cloud storage. Streaming overages billed monthly.",
    pricing: {
      i3Ai: { setupFee: 200, annualFee: 899 },
      "i3Ai Cloud": { setupFee: 350, annualFee: 1199 },
    },
    icon: "package",
    category: "Safety & Security",
  },
  {
    id: "rs",
    name: "RS",
    description:
      "Annual: Video Streaming Relay, mthly Max 10GB Live/Search/Backup",
    pricing: {
      i3Ai: { setupFee: 300, annualFee: 1299 },
      "i3Ai Cloud": { setupFee: 450, annualFee: 1599 },
    },
    icon: "chart",
    category: "Safety & Security",
  },
  {
    id: "pos",
    name: "POS",
    description:
      "Annual: Process POS data (TLOG, TCP/IP, Serial), store securely on the Cloud. Req'd for ER and DM.",
    pricing: {
      i3Ai: { setupFee: 150, annualFee: 699 },
      "i3Ai Cloud": { setupFee: 250, annualFee: 899 },
    },
    icon: "activity",
    category: "Asset Protection",
  },
  {
    id: "pacdm",
    name: "PACDM",
    description: "Annual: Provide POS Data Analysis, per server",
    pricing: {
      i3Ai: { setupFee: 350, annualFee: 1599 },
      "i3Ai Cloud": { setupFee: 500, annualFee: 1999 },
    },
    icon: "alert",
    category: "Asset Protection",
  },
  {
    id: "ar",
    name: "AR",
    description:
      "Annual: CMS Audit weekly report, incl. CMS-HM (VaaS ONLY), per site",
    pricing: {
      i3Ai: { setupFee: 400, annualFee: 1899 },
      "i3Ai Cloud": { setupFee: 600, annualFee: 2299 },
    },
    icon: "cloud",
    category: "	Operational Insights",
  },
  {
    id: "dm",
    name: "DM",
    description:
      "Annual: Data mining/analysis & Ai: business intelligence processes to analyze sales data & customers to improve sales outcomes",
    pricing: {
      i3Ai: { setupFee: 450, annualFee: 2199 },
      "i3Ai Cloud": { setupFee: 650, annualFee: 2699 },
    },
    icon: "zap",
    category: "Predictive Analytics",
  },
  {
    id: "cb",
    name: "CB",
    description: "Annual: Concierge Tech Service, per server",
    pricing: {
      i3Ai: { setupFee: 200, annualFee: 999 },
      "i3Ai Cloud": { setupFee: 350, annualFee: 1299 },
    },
    icon: "globe",
    category: "Concierge",
  },
];

const AI_MODES = ["i3Ai", "i3Ai Cloud"];

const CATEGORIES = [
  "All",
  "i3Host",
  "Safety & Security",
  "Asset Protection",
  "Operational Insights",
  "Predictive Analytics",
  "Concierge",
];

export function CMSPackageSetupModal({ onClose }: { onClose: () => void }) {
  const [selectedFeatures, setSelectedFeatures] = useState<SelectedFeature[]>(
    [],
  );
  const [activeFeatureId, setActiveFeatureId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [packageId, setPackageId] = useState("CMS-01001");
  const [model, setModel] = useState("Enterprise");
  const [packageQuantity, setPackageQuantity] = useState(1);

  const description = selectedFeatures.map((f) => f.name).join(", ") || "—";

  // const oneTimeSetupFee = 1500;
  // const posSetupFee = 750;

  const activeFeature = selectedFeatures.find((f) => f.id === activeFeatureId);

  const handleFeatureSelect = (feature: Feature) => {
    const isSelected = selectedFeatures.some((f) => f.id === feature.id);

    if (isSelected) {
      setSelectedFeatures(selectedFeatures.filter((f) => f.id !== feature.id));
      if (activeFeatureId === feature.id) {
        setActiveFeatureId(null);
      }
    } else {
      const newFeature: SelectedFeature = {
        ...feature,
        renewal: false,
        aiMode: "i3Ai",
        discount: 0,
        quantity: 1,
        notes: "",
      };
      setSelectedFeatures([...selectedFeatures, newFeature]);
      setActiveFeatureId(feature.id);
    }
  };

  const handleUpdateFeature = (
    id: string,
    updates: Partial<SelectedFeature>,
  ) => {
    setSelectedFeatures(
      selectedFeatures.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    );
  };

  const handleRemoveFeature = (id: string) => {
    setSelectedFeatures(selectedFeatures.filter((f) => f.id !== id));
    if (activeFeatureId === id) {
      setActiveFeatureId(null);
    }
  };

  const getFeaturePricing = (feature: SelectedFeature) => {
    const pricing = feature.pricing[feature.aiMode] ?? feature.pricing["i3Ai"];
    const promoSetup = feature.promo?.setupFeeDiscount ?? 0;
    const promoAnnual = feature.promo?.annualFeeDiscount ?? 0;
    const setupFee = feature.renewal
      ? 0
      : pricing.setupFee * (1 - promoSetup / 100);
    const annualFee =
      pricing.annualFee * (1 - feature.discount / 100) * (1 - promoAnnual / 100);
    return {
      setupFee,
      annualFee,
      total: setupFee + annualFee,
    };
  };

  const calculateFeaturePrice = (feature: SelectedFeature) => {
    return getFeaturePricing(feature).total;
  };

  const totalFeatureSetup = selectedFeatures.reduce(
    (sum, f) => sum + getFeaturePricing(f).setupFee,
    0,
  );

  const annualPayment = selectedFeatures.reduce(
    (sum, f) => sum + getFeaturePricing(f).annualFee,
    0,
  );

  const totalDiscount = selectedFeatures.reduce((sum, f) => {
    const pricing = f.pricing[f.aiMode] ?? f.pricing["i3Ai"];
    return sum + (pricing.annualFee * f.discount) / 100;
  }, 0);

  const packageSubtotal = totalFeatureSetup + annualPayment - totalDiscount;
  const grandTotal = packageSubtotal * packageQuantity;

  const filteredFeatures = FEATURES.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilter === "All" || f.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const allFilteredSelected =
    filteredFeatures.length > 0 &&
    filteredFeatures.every((f) => selectedFeatures.some((s) => s.id === f.id));

  const handleToggleAll = () => {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredFeatures.map((f) => f.id));
      setSelectedFeatures(selectedFeatures.filter((f) => !filteredIds.has(f.id)));
      if (activeFeatureId && filteredIds.has(activeFeatureId)) {
        setActiveFeatureId(null);
      }
    } else {
      const existing = new Set(selectedFeatures.map((f) => f.id));
      const newFeatures: SelectedFeature[] = filteredFeatures
        .filter((f) => !existing.has(f.id))
        .map((f) => ({
          ...f,
          renewal: false,
          aiMode: "i3Ai",
          discount: 0,
          quantity: 1,
          notes: "",
        }));
      setSelectedFeatures([...selectedFeatures, ...newFeatures]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[1200px] max-h-[90vh] flex flex-col">
        {/* Fixed Header */}
        <div className="border-b border-gray-200 bg-white">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-brand-50 rounded-xl">
                  <Package className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 leading-tight">
                    CMS Package Setup
                  </h2>
                  <p className="text-sm text-gray-500">
                    Select and subscribe to professional services for your
                    server
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-12 gap-5 items-end">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Model
                </label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all outline-none"
                >
                  <option>U16</option>
                  <option>U21</option>
                  <option>U31</option>
                </select>
              </div>

              <div className="col-span-3">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Package ID
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    value={packageId}
                    onChange={(e) => setPackageId(e.target.value)}
                    placeholder="Search ID..."
                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                  />
                  <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 group-focus-within:text-brand-500 transition-colors" />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Package Qty
                </label>
                <div className="flex -space-x-px">
                  <button
                    onClick={() =>
                      setPackageQuantity(Math.max(1, packageQuantity - 1))
                    }
                    className="px-2.5 border border-gray-300 rounded-l-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <input
                    type="number"
                    value={packageQuantity}
                    className="w-full py-2 text-center border-y border-gray-300 text-sm font-semibold focus:outline-none focus:z-10 focus:ring-1 focus:ring-brand-500"
                    onChange={(e) =>
                      setPackageQuantity(Math.max(1, Number(e.target.value)))
                    }
                  />
                  <button
                    onClick={() => setPackageQuantity(packageQuantity + 1)}
                    className="px-2.5 border border-gray-300 rounded-r-lg hover:bg-gray-50 active:bg-gray-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="col-span-5">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 italic">
                  {description || "No description available"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Panel Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Feature Library */}
          <div className="w-[28%] border-r border-gray-200 bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <div className="flex gap-1 overflow-x-auto">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                      categoryFilter === cat
                        ? "bg-brand-100 text-brand-700"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
              <span className="text-xs text-gray-500">
                {filteredFeatures.length} feature{filteredFeatures.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={handleToggleAll}
                className="text-xs font-medium text-brand-600 hover:text-brand-800 transition-colors"
              >
                {allFilteredSelected ? "Unselect All" : "Select All"}
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {filteredFeatures.map((feature) => {
                const isSelected = selectedFeatures.some(
                  (f) => f.id === feature.id,
                );
                const isActive = activeFeatureId === feature.id;

                return (
                  <div
                    key={feature.id}
                    onClick={() => {
                      if (isSelected) {
                        setActiveFeatureId(feature.id);
                      }
                    }}
                    className={`bg-white rounded-xl p-3 border-2 cursor-pointer transition-all ${
                      isActive
                        ? "border-brand-500 shadow-md"
                        : isSelected
                          ? "border-brand-200 shadow-sm"
                          : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleFeatureSelect(feature)}
                        className="mt-1 w-4 h-4 text-brand-500 rounded focus:ring-2 focus:ring-brand-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {feature.icon === "server" && (
                            <Server className="w-4 h-4 text-brand-500" />
                          )}
                          {feature.icon === "package" && (
                            <Package className="w-4 h-4 text-purple-600" />
                          )}
                          {feature.icon === "zap" && (
                            <Zap className="w-4 h-4 text-yellow-600" />
                          )}
                          {!["server", "package", "zap"].includes(
                            feature.icon,
                          ) && <Settings className="w-4 h-4 text-gray-600" />}
                          <h4 className="font-semibold text-sm text-gray-900">
                            {feature.name}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {feature.description}
                        </p>
                        {feature.promo && (
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 border border-green-200 text-[11px] font-medium text-green-700">
                            <Zap className="w-3 h-3" />
                            {feature.name} Promo
                          </div>
                        )}
                        {/* <div className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium text-gray-700">
                          ${feature.basePrice.toLocaleString()}
                        </div> */}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Center Panel - Feature Configuration */}
          <div className="flex-1 bg-white p-6 overflow-y-auto">
            {!activeFeature ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Feature Selected
                </h3>
                <p className="text-sm text-gray-600 max-w-sm">
                  Select a feature from the left panel to configure its
                  settings, pricing, and options.
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    {activeFeature.icon === "server" && (
                      <Server className="w-6 h-6 text-brand-500" />
                    )}
                    {activeFeature.icon === "package" && (
                      <Package className="w-6 h-6 text-purple-600" />
                    )}
                    {activeFeature.icon === "zap" && (
                      <Zap className="w-6 h-6 text-yellow-600" />
                    )}
                    {!["server", "package", "zap"].includes(
                      activeFeature.icon,
                    ) && <Settings className="w-6 h-6 text-gray-600" />}
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {activeFeature.name}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">
                    {activeFeature.description}
                  </p>
                  {activeFeature.promo && (
                    <div className="mt-3 flex items-start gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl">
                      <Zap className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm font-medium text-green-800">
                        {activeFeature.promo.description}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  {/* Renewal Toggle */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="font-medium text-gray-900 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Annual Renewal
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          Enable for renewal items to waive one-time setup fees.
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          handleUpdateFeature(activeFeature.id, {
                            renewal: !activeFeature.renewal,
                          })
                        }
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                          activeFeature.renewal ? "bg-brand-500" : "bg-gray-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                            activeFeature.renewal
                              ? "translate-x-6"
                              : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* AI Mode Dropdown */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      AI Mode
                    </label>
                    <div className="relative">
                      <select
                        value={activeFeature.aiMode}
                        onChange={(e) =>
                          handleUpdateFeature(activeFeature.id, {
                            aiMode: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none bg-white"
                      >
                        {AI_MODES.map((mode) => (
                          <option key={mode} value={mode}>
                            {mode}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-3.5 w-4 h-4 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Discount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Discount Percentage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={activeFeature.discount}
                        onChange={(e) =>
                          handleUpdateFeature(activeFeature.id, {
                            discount: Number(e.target.value),
                          })
                        }
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                        placeholder="0"
                      />
                      <span className="absolute right-4 top-3.5 text-sm text-gray-500">
                        %
                      </span>
                    </div>
                  </div>

                  {/* Calculated Price */}
                  <div className="bg-brand-50 rounded-xl p-5 border border-brand-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-brand-900">
                          Setup Fee
                          {activeFeature.renewal && (
                            <span className="ml-2 text-xs font-normal text-green-700">
                              (waived with renewal)
                            </span>
                          )}
                        </div>
                        {!activeFeature.renewal && (
                          <div className="text-xs text-brand-700 mt-1">
                            <span className={activeFeature.promo?.setupFeeDiscount ? "line-through text-gray-400" : ""}>
                              $
                              {(
                                activeFeature.pricing[activeFeature.aiMode]
                                  ?.setupFee ?? 0
                              ).toLocaleString()}
                            </span>
                            {!!activeFeature.promo?.setupFeeDiscount && (
                              <span className="ml-1 text-green-600">
                                ({activeFeature.promo.setupFeeDiscount}% promo)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="text-xl font-bold text-brand-900">
                        $
                        {getFeaturePricing(
                          activeFeature,
                        ).setupFee.toLocaleString()}
                      </div>
                    </div>
                    <div className="border-t border-brand-200 pt-3 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-brand-900">
                          Annual Fee
                        </div>
                        <div className="text-xs text-brand-700 mt-1">
                          <span className={activeFeature.promo?.annualFeeDiscount ? "line-through text-gray-400" : ""}>
                            $
                            {(
                              activeFeature.pricing[activeFeature.aiMode]
                                ?.annualFee ?? 0
                            ).toLocaleString()}
                          </span>
                          {activeFeature.discount > 0 &&
                            ` - ${activeFeature.discount}% discount`}
                          {!!activeFeature.promo?.annualFeeDiscount && (
                            <span className="ml-1 text-green-600">
                              ({activeFeature.promo.annualFeeDiscount}% promo)
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xl font-bold text-brand-900">
                        $
                        {getFeaturePricing(
                          activeFeature,
                        ).annualFee.toLocaleString()}
                      </div>
                    </div>
                    <div className="border-t border-brand-200 pt-3 flex items-center justify-between">
                      <div className="text-sm font-semibold text-brand-900">
                        Total
                      </div>
                      <div className="text-2xl font-bold text-brand-900">
                        ${calculateFeaturePrice(activeFeature).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Notes / Comments
                    </label>
                    <textarea
                      value={activeFeature.notes}
                      onChange={(e) =>
                        handleUpdateFeature(activeFeature.id, {
                          notes: e.target.value,
                        })
                      }
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                      placeholder="Add any additional notes or special requirements..."
                    />
                  </div> */}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Package Summary */}
          <div className="w-[28%] border-l border-gray-200 bg-gray-50 flex flex-col overflow-y-auto">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Package Summary
              </h3>
            </div>

            <div className="flex-1 p-4 space-y-4">
              {/* Selected Features */}
              <div>
                <div className="text-xs font-medium text-gray-600 mb-2 uppercase tracking-wide">
                  Selected Features ({selectedFeatures.length})
                </div>
                <div className="space-y-2">
                  {selectedFeatures.length === 0 ? (
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                      <p className="text-xs text-gray-600">
                        No features selected
                      </p>
                    </div>
                  ) : (
                    selectedFeatures.map((feature) => (
                      <div
                        key={feature.id}
                        onClick={() => setActiveFeatureId(feature.id)}
                        className={`bg-white rounded-lg p-3 border-2 transition-all cursor-pointer ${
                          activeFeatureId === feature.id
                            ? "border-brand-500 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="flex items-center gap-2 w-full overflow-hidden">
                              <span className="font-semibold text-sm text-gray-900 truncate">
                                {feature.name}
                              </span>
                            </h4>
                            {/* <div className="flex items-center gap-2 mt-1">
                              {feature.discount > 0 && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                                  -{feature.discount}%
                                </span>
                              )}
                            </div> */}
                          </div>
                          <button
                            onClick={() => handleRemoveFeature(feature.id)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                          </button>
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Setup
                              {feature.renewal && (
                                <span className="ml-1.5 flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 border border-emerald-200">
                                  <Check className="w-2.5 h-2.5 mr-0.5" />
                                  Renewal
                                </span>
                              )}
                            </span>
                            <span className="font-medium text-gray-700">
                              $
                              {getFeaturePricing(
                                feature,
                              ).setupFee.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Annual
                              {feature.discount > 0 && (
                                <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-700">
                                  -{feature.discount}%
                                </span>
                              )}
                            </span>
                            <span className="font-medium text-gray-700">
                              $
                              {getFeaturePricing(
                                feature,
                              ).annualFee.toLocaleString()}
                            </span>
                          </div>
                          {feature.promo && (
                            <div className="flex items-center gap-1 mt-1">
                              <Zap className="w-3 h-3 text-green-600" />
                              <span className="text-[10px] font-medium text-green-700">
                                Promo applied
                              </span>
                            </div>
                          )}
                          {/* <div className="flex items-center justify-between border-t border-gray-100 pt-1">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold text-gray-900">
                              ${calculateFeaturePrice(feature).toLocaleString()}
                            </span>
                          </div> */}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              <div className="bg-white rounded-xl p-5 border-l-4 border-l-brand-500 border border-gray-200 shadow-md">
                {/* <h4 className="font-semibold text-sm text-gray-900 mb-3">
                  Pricing Breakdown
                </h4> */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Setup Fees</span>
                    <span className="font-medium text-gray-900">
                      ${totalFeatureSetup.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Annual Payment</span>
                    <span className="font-medium text-gray-900">
                      ${annualPayment.toLocaleString()}
                    </span>
                  </div>
                  {/* <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      One-time Setup
                    </span>
                    <span className="font-medium text-gray-900">
                      ${oneTimeSetupFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      POS Setup
                    </span>
                    <span className="font-medium text-gray-900">
                      ${posSetupFee.toLocaleString()}
                    </span>
                  </div> */}
                  {totalDiscount > 0 && (
                    <>
                      <div className="border-t border-gray-200 pt-2.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-green-600 font-medium">
                            Total Discount
                          </span>
                          <span className="font-medium text-green-600">
                            -${totalDiscount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                  {packageQuantity > 1 && (
                    <div className="border-t border-gray-200 pt-2.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Per Package</span>
                        <span className="font-medium text-gray-900">
                          ${packageSubtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-gray-600">
                          × {packageQuantity} packages
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="border-t border-gray-300 pt-2.5 mt-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-gray-900">
                        First Payment
                      </span>
                      <span className="text-xl font-bold text-brand-500">
                        ${grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="border-t border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-gray-600">First Payment</div>
                <div className="text-lg font-bold text-gray-900">
                  ${grandTotal.toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => {
                  console.log("Package saved:", {
                    packageId,
                    model,
                    description,
                    selectedFeatures,
                  });
                  onClose();
                }}
                className="px-8 py-2.5 bg-brand-500 text-white rounded-lg font-medium hover:bg-brand-600 transition-colors shadow-sm"
              >
                Save Package
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
