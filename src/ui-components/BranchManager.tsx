"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Branch, BranchStatus, BranchCategory } from "@/src/types/branch.types";

const branchSchema = z.object({
  countryIso2: z.string().length(2, "ISO2 kodu 2 hərf olmalıdır"),
  branchName: z.string().min(1, "Filial adı mütləqdir"),
  city: z.string().min(1, "Şəhər mütləqdir"),
  address: z.string().min(1, "Ünvan mütləqdir"),
  status: z.nativeEnum(BranchStatus),
  category: z.nativeEnum(BranchCategory),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Düzgün rəng kodu"),
  employees: z.number().min(0, "İşçi sayı minimum 0 olmalıdır"),
  establishedDate: z.string(),
});

type BranchInput = z.infer<typeof branchSchema>;

// Mock ölkə məlumatları
const AVAILABLE_COUNTRIES = [
  { iso2: "AZ", iso3: "AZE", name: "Azərbaycan" },
  { iso2: "TR", iso3: "TUR", name: "Türkiyə" },
  { iso2: "RU", iso3: "RUS", name: "Rusiya" },
  { iso2: "CN", iso3: "CHN", name: "Çin" },
  { iso2: "US", iso3: "USA", name: "ABŞ" },
  { iso2: "DE", iso3: "DEU", name: "Almaniya" },
];

// Status colors mapping
const STATUS_COLORS = {
  [BranchStatus.ACTIVE]: "#10b981",
  [BranchStatus.INACTIVE]: "#6b7280",
  [BranchStatus.UNDER_CONSTRUCTION]: "#f59e0b",
  [BranchStatus.PLANNED]: "#3b82f6",
  [BranchStatus.CLOSED]: "#ef4444",
};

// Category colors mapping
const CATEGORY_COLORS = {
  [BranchCategory.HEADQUARTERS]: "#7c3aed",
  [BranchCategory.REGIONAL_OFFICE]: "#2563eb",
  [BranchCategory.BRANCH_OFFICE]: "#059669",
  [BranchCategory.WAREHOUSE]: "#dc2626",
  [BranchCategory.PRODUCTION]: "#ea580c",
  [BranchCategory.REPRESENTATIVE]: "#9333ea",
};

export default function BranchManager() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<
    BranchCategory | "ALL"
  >("ALL");
  const [selectedStatus, setSelectedStatus] = useState<BranchStatus | "ALL">(
    "ALL"
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<BranchInput>({
    resolver: zodResolver(branchSchema),
    defaultValues: {
      status: BranchStatus.ACTIVE,
      category: BranchCategory.BRANCH_OFFICE,
      color: STATUS_COLORS[BranchStatus.ACTIVE],
      employees: 0,
    },
  });

  const selectedCountry = watch("countryIso2");
  const selectedCat = watch("category");
  const selectedStat = watch("status");

  // Ölkə seçildikdə avtomatik məlumat doldur
  useEffect(() => {
    const country = AVAILABLE_COUNTRIES.find((c) => c.iso2 === selectedCountry);
    if (country) {
      // Auto set some defaults based on country
      setValue(
        "color",
        STATUS_COLORS[selectedStat] || CATEGORY_COLORS[selectedCat]
      );
    }
  }, [selectedCountry, selectedCat, selectedStat, setValue]);

  // Mock API calls
  useEffect(() => {
    // Load existing branches
    const mockBranches: Branch[] = [
      {
        id: "1",
        countryIso2: "AZ",
        countryIso3: "AZE",
        countryName: "Azərbaycan",
        branchName: "Baş Ofis",
        city: "Bakı",
        address: "28 May küçəsi 5",
        status: BranchStatus.ACTIVE,
        category: BranchCategory.HEADQUARTERS,
        color: CATEGORY_COLORS[BranchCategory.HEADQUARTERS],
        employees: 150,
        establishedDate: "2020-01-15",
        coordinates: { lat: 40.4093, lng: 49.8671 },
      },
      {
        id: "2",
        countryIso2: "TR",
        countryIso3: "TUR",
        countryName: "Türkiyə",
        branchName: "İstanbul Filialı",
        city: "İstanbul",
        address: "Levent Mahallesi",
        status: BranchStatus.ACTIVE,
        category: BranchCategory.REGIONAL_OFFICE,
        color: CATEGORY_COLORS[BranchCategory.REGIONAL_OFFICE],
        employees: 80,
        establishedDate: "2021-06-01",
        coordinates: { lat: 41.0082, lng: 28.9784 },
      },
      {
        id: "3",
        countryIso2: "CN",
        countryIso3: "CHN",
        countryName: "Çin",
        branchName: "Şanxay Filialı",
        city: "Şanxay",
        address: "Pudong District",
        status: BranchStatus.UNDER_CONSTRUCTION,
        category: BranchCategory.BRANCH_OFFICE,
        color: STATUS_COLORS[BranchStatus.UNDER_CONSTRUCTION],
        employees: 0,
        establishedDate: "2024-12-01",
      },
    ];
    setBranches(mockBranches);
  }, []);

  const onSubmit = async (data: BranchInput) => {
    const country = AVAILABLE_COUNTRIES.find(
      (c) => c.iso2 === data.countryIso2
    );
    if (!country) return;

    const newBranch: Branch = {
      ...data,
      id: editingBranch?.id || Date.now().toString(),
      countryIso3: country.iso3,
      countryName: country.name,
      employees: Number(data.employees),
    };

    if (editingBranch) {
      setBranches((prev) =>
        prev.map((b) => (b.id === editingBranch.id ? newBranch : b))
      );
      setEditingBranch(null);
    } else {
      setBranches((prev) => [...prev, newBranch]);
    }
    reset();
  };

  const startEdit = (branch: Branch) => {
    setEditingBranch(branch);
    reset(branch);
  };

  const deleteBranch = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  // Filter branches
  const filteredBranches = branches.filter((branch) => {
    const categoryMatch =
      selectedCategory === "ALL" || branch.category === selectedCategory;
    const statusMatch =
      selectedStatus === "ALL" || branch.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

  // Get unique countries with branches
  const countriesWithBranches = AVAILABLE_COUNTRIES.filter((country) =>
    branches.some((branch) => branch.countryIso2 === country.iso2)
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Filial İdarəetməsi</h1>
        <p className="text-gray-600 mt-2">
          Şirkətin dünya üzrə filiallarını idarə edin
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Ümumi Filiallar</h3>
          <p className="text-2xl font-bold text-gray-900">{branches.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Aktiv Filiallar</h3>
          <p className="text-2xl font-bold text-green-600">
            {branches.filter((b) => b.status === BranchStatus.ACTIVE).length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Ölkə Sayı</h3>
          <p className="text-2xl font-bold text-blue-600">
            {countriesWithBranches.length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border">
          <h3 className="text-sm font-medium text-gray-600">Ümumi İşçi</h3>
          <p className="text-2xl font-bold text-purple-600">
            {branches.reduce((sum, b) => sum + b.employees, 0)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h2 className="text-xl font-semibold mb-4">
              {editingBranch ? "Filialı Redaktə Et" : "Yeni Filial Əlavə Et"}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Country Select */}
              <div>
                <label className="block text-sm font-medium mb-2">Ölkə</label>
                <select
                  {...register("countryIso2")}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Ölkə seçin</option>
                  {AVAILABLE_COUNTRIES.map((country) => (
                    <option key={country.iso2} value={country.iso2}>
                      {country.name} ({country.iso2})
                    </option>
                  ))}
                </select>
                {errors.countryIso2 && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.countryIso2.message}
                  </p>
                )}
              </div>

              {/* Branch Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Filial Adı
                </label>
                <input
                  {...register("branchName")}
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Məsələn: Bakı Filialı"
                />
                {errors.branchName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.branchName.message}
                  </p>
                )}
              </div>

              {/* City & Address */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Şəhər
                  </label>
                  <input
                    {...register("city")}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Şəhər adı"
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.city.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Ünvan
                  </label>
                  <input
                    {...register("address")}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    placeholder="Tam ünvan"
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Kateqoriya
                  </label>
                  <select
                    {...register("category")}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(BranchCategory).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    {Object.values(BranchStatus).map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Employees & Date */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    İşçi Sayı
                  </label>
                  <input
                    {...register("employees", { valueAsNumber: true })}
                    type="number"
                    min="0"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.employees && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.employees.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quruluş Tarixi
                  </label>
                  <input
                    {...register("establishedDate")}
                    type="date"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.establishedDate && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.establishedDate.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Color */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Xəritə Rəngi
                </label>
                <input
                  {...register("color")}
                  type="color"
                  className="w-full h-10 border rounded-md"
                />
                {errors.color && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.color.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingBranch ? "Yenilə" : "Əlavə Et"}
                </button>
                {editingBranch && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingBranch(null);
                      reset();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Ləğv Et
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Branch List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md border">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Filiallar Siyahısı</h2>
                <span className="text-sm text-gray-500">
                  {filteredBranches.length} nəticə
                </span>
              </div>

              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Kateqoriya
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) =>
                      setSelectedCategory(
                        e.target.value as BranchCategory | "ALL"
                      )
                    }
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="ALL">Bütün kateqoriyalar</option>
                    {Object.values(BranchCategory).map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as BranchStatus | "ALL")
                    }
                    className="w-full p-2 border rounded-md text-sm"
                  >
                    <option value="ALL">Bütün statuslar</option>
                    {Object.values(BranchStatus).map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {filteredBranches.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  Filial tapılmadı
                </div>
              ) : (
                <div className="divide-y">
                  {filteredBranches.map((branch) => (
                    <div key={branch.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: branch.color }}
                            ></div>
                            <h3 className="font-semibold text-gray-900">
                              {branch.branchName}
                            </h3>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                branch.status === BranchStatus.ACTIVE
                                  ? "bg-green-100 text-green-700"
                                  : branch.status ===
                                    BranchStatus.UNDER_CONSTRUCTION
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {branch.status.replace(/_/g, " ")}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>
                              📍 {branch.city}, {branch.countryName}
                            </p>
                            <p>🏢 {branch.category.replace(/_/g, " ")}</p>
                            <p>👥 {branch.employees} işçi</p>
                            <p>
                              📅{" "}
                              {new Date(
                                branch.establishedDate
                              ).toLocaleDateString("az-AZ")}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => startEdit(branch)}
                            className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-300 rounded hover:bg-blue-50"
                          >
                            Redaktə
                          </button>
                          <button
                            onClick={() => deleteBranch(branch.id)}
                            className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-300 rounded hover:bg-red-50"
                          >
                            Sil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
