"use client";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

// Types
interface Branch {
  id: string;
  countryIso2: string;
  countryIso3: string;
  countryName: string;
  branchName: string;
  city: string;
  address: string;
  status: BranchStatus;
  category: BranchCategory;
  color: string;
  employees: number;
  establishedDate: string;
}

enum BranchStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  UNDER_CONSTRUCTION = "UNDER_CONSTRUCTION",
  PLANNED = "PLANNED",
  CLOSED = "CLOSED",
}

enum BranchCategory {
  HEADQUARTERS = "HEADQUARTERS",
  REGIONAL_OFFICE = "REGIONAL_OFFICE",
  BRANCH_OFFICE = "BRANCH_OFFICE",
  WAREHOUSE = "WAREHOUSE",
  PRODUCTION = "PRODUCTION",
  REPRESENTATIVE = "REPRESENTATIVE",
}

interface CountryFeature {
  type: string;
  properties: {
    ISO_A2: string;
    ISO_A3: string;
    NAME: string;
    NAME_AZ?: string;
  };
  geometry: any;
}

// World GeoJSON data URL (can be replaced with local file)
const WORLD_COUNTRIES_GEOJSON =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

export default function CompanyBranchesMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [worldData, setWorldData] = useState<CountryFeature[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<BranchCategory | "ALL">(
    "ALL"
  );
  const [filterStatus, setFilterStatus] = useState<BranchStatus | "ALL">("ALL");

  // Mock filial məlumatları (real API-dan gələcək)
  useEffect(() => {
    const fetchBranches = async () => {
      // Real API call: const response = await fetch('/api/branches');
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
          color: "#7c3aed",
          employees: 150,
          establishedDate: "2020-01-15",
        },
        {
          id: "2",
          countryIso2: "TR",
          countryIso3: "TUR",
          countryName: "Türkiyə",
          branchName: "İstanbul Regional Office",
          city: "İstanbul",
          address: "Levent Mahallesi",
          status: BranchStatus.ACTIVE,
          category: BranchCategory.REGIONAL_OFFICE,
          color: "#2563eb",
          employees: 80,
          establishedDate: "2021-06-01",
        },
        {
          id: "3",
          countryIso2: "RU",
          countryIso3: "RUS",
          countryName: "Rusiya",
          branchName: "Moskva Branch",
          city: "Moskva",
          address: "Red Square District",
          status: BranchStatus.ACTIVE,
          category: BranchCategory.BRANCH_OFFICE,
          color: "#059669",
          employees: 45,
          establishedDate: "2022-03-15",
        },
        {
          id: "4",
          countryIso2: "CN",
          countryIso3: "CHN",
          countryName: "Çin",
          branchName: "Şanxay Production Center",
          city: "Şanxay",
          address: "Pudong District",
          status: BranchStatus.UNDER_CONSTRUCTION,
          category: BranchCategory.PRODUCTION,
          color: "#f59e0b",
          employees: 0,
          establishedDate: "2024-12-01",
        },
        {
          id: "5",
          countryIso2: "US",
          countryIso3: "USA",
          countryName: "ABŞ",
          branchName: "New York Representative",
          city: "New York",
          address: "Manhattan District",
          status: BranchStatus.PLANNED,
          category: BranchCategory.REPRESENTATIVE,
          color: "#3b82f6",
          employees: 0,
          establishedDate: "2025-06-01",
        },
        {
          id: "6",
          countryIso2: "DE",
          countryIso3: "DEU",
          countryName: "Almaniya",
          branchName: "Berlin Warehouse",
          city: "Berlin",
          address: "Brandenburg District",
          status: BranchStatus.ACTIVE,
          category: BranchCategory.WAREHOUSE,
          color: "#dc2626",
          employees: 25,
          establishedDate: "2023-09-10",
        },
        {
          id: "7",
          countryIso2: "FR",
          countryIso3: "FRA",
          countryName: "Fransa",
          branchName: "Paris Office",
          city: "Paris",
          address: "Champs-Élysées",
          status: BranchStatus.ACTIVE,
          category: BranchCategory.BRANCH_OFFICE,
          color: "#059669",
          employees: 35,
          establishedDate: "2022-11-20",
        },
        {
          id: "8",
          countryIso2: "GB",
          countryIso3: "GBR",
          countryName: "Böyük Britaniya",
          branchName: "London Office",
          city: "London",
          address: "City of London",
          status: BranchStatus.ACTIVE,
          category: BranchCategory.REGIONAL_OFFICE,
          color: "#2563eb",
          employees: 60,
          establishedDate: "2021-09-15",
        },
        {
          id: "9",
          countryIso2: "JP",
          countryIso3: "JPN",
          countryName: "Yaponiya",
          branchName: "Tokyo Representative",
          city: "Tokyo",
          address: "Shibuya District",
          status: BranchStatus.PLANNED,
          category: BranchCategory.REPRESENTATIVE,
          color: "#3b82f6",
          employees: 0,
          establishedDate: "2025-09-01",
        },
      ];
      setBranches(mockBranches);
    };

    fetchBranches();
  }, []);

  // World GeoJSON data yüklə
  useEffect(() => {
    const fetchWorldData = async () => {
      try {
        const response = await fetch(WORLD_COUNTRIES_GEOJSON);
        const data = await response.json();
        setWorldData(data.features);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading world data:", error);
        setIsLoading(false);
      }
    };

    fetchWorldData();
  }, []);

  // Filter branches based on category and status
  const filteredBranches = branches.filter((branch) => {
    const categoryMatch =
      filterCategory === "ALL" || branch.category === filterCategory;
    const statusMatch =
      filterStatus === "ALL" || branch.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  // Get countries with active branches
  const getCountryBranches = (iso3: string): Branch[] => {
    return filteredBranches.filter((branch) => branch.countryIso3 === iso3);
  };

  // SVG Map render
  useEffect(() => {
    if (!svgRef.current || worldData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1000;
    const height = 600;

    const projection = d3
      .geoNaturalEarth1()
      .scale(160)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    const g = svg.append("g");

    // Background
    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#f1f5f9");

    // Country paths
    g.selectAll("path")
      .data(worldData)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("class", "country")
      .style("fill", (d: CountryFeature) => {
        const countryBranches = getCountryBranches(d.properties.ISO_A3);
        if (countryBranches.length > 0) {
          // If multiple branches, show the primary one (headquarters first)
          const primaryBranch =
            countryBranches.find(
              (b) => b.category === BranchCategory.HEADQUARTERS
            ) ||
            countryBranches.find(
              (b) => b.category === BranchCategory.REGIONAL_OFFICE
            ) ||
            countryBranches[0];
          return primaryBranch.color;
        }
        return "#e2e8f0";
      })
      .style("stroke", "#ffffff")
      .style("stroke-width", "1px")
      .style("cursor", (d: CountryFeature) => {
        return getCountryBranches(d.properties.ISO_A3).length > 0
          ? "pointer"
          : "default";
      })
      .on("mouseover", function (event, d: CountryFeature) {
        const countryBranches = getCountryBranches(d.properties.ISO_A3);
        if (countryBranches.length > 0) {
          d3.select(this)
            .style("stroke-width", "3px")
            .style("filter", "brightness(1.1)");

          // Tooltip
          d3
            .select("body")
            .append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0,0,0,0.9)")
            .style("color", "white")
            .style("padding", "12px")
            .style("border-radius", "8px")
            .style("font-size", "14px")
            .style("pointer-events", "none")
            .style("z-index", "1000")
            .style("max-width", "300px")
            .style("left", event.pageX + 10 + "px")
            .style("top", event.pageY - 10 + "px").html(`
              <div style="font-weight: bold; font-size: 16px; margin-bottom: 8px;">${
                d.properties.NAME
              }</div>
              <div style="margin-bottom: 4px;"><strong>Filiallar sayı:</strong> ${
                countryBranches.length
              }</div>
              ${countryBranches
                .map(
                  (branch) => `
                <div style="display: flex; align-items: center; margin: 4px 0;">
                  <div style="width: 12px; height: 12px; border-radius: 2px; background-color: ${branch.color}; margin-right: 8px;"></div>
                  <span style="font-size: 13px;">${branch.branchName}</span>
                  <span style="font-size: 11px; opacity: 0.8; margin-left: 8px;">(${branch.employees} işçi)</span>
                </div>
              `
                )
                .join("")}
              <div style="font-size: 11px; opacity: 0.7; margin-top: 8px;">Klik edin ətraflı məlumat üçün</div>
            `);
        }
      })
      .on("mouseout", function (event, d: CountryFeature) {
        const countryBranches = getCountryBranches(d.properties.ISO_A3);
        if (countryBranches.length > 0) {
          d3.select(this).style("stroke-width", "1px").style("filter", "none");
        }
        d3.selectAll(".tooltip").remove();
      })
      .on("click", function (event, d: CountryFeature) {
        const countryBranches = getCountryBranches(d.properties.ISO_A3);
        if (countryBranches.length > 0) {
          setSelectedBranch(countryBranches[0]);
        }
      });

    // Zoom functionality
    const zoomBehavior = d3
      .zoom()
      .scaleExtent([0.5, 8])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoomBehavior as any);
  }, [worldData, filteredBranches]);

  const handleZoomIn = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg
        .transition()
        .duration(300)
        .call(d3.zoom().scaleBy as any, 1.5);
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg
        .transition()
        .duration(300)
        .call(d3.zoom().scaleBy as any, 0.75);
    }
  };

  const handleResetZoom = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg
        .transition()
        .duration(750)
        .call(d3.zoom().transform as any, d3.zoomIdentity);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">
            Şirkət filialları yüklənir...
          </div>
        </div>
      </div>
    );
  }

  // Stats calculations
  const totalEmployees = filteredBranches.reduce(
    (sum, branch) => sum + branch.employees,
    0
  );

  const countriesCount = new Set(filteredBranches.map((b) => b.countryIso2))
    .size;

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header with filters */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold">Şirkət Filialları</h1>
            <p className="text-blue-100 mt-1">
              Dünya üzrə filiallarımızın xəritəsi
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold">
                {filteredBranches.length}
              </div>
              <div className="text-xs text-blue-100">Filial</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold">{countriesCount}</div>
              <div className="text-xs text-blue-100">Ölkə</div>
            </div>
            <div className="bg-white/20 rounded-lg p-3">
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <div className="text-xs text-blue-100">İşçi</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-100">
              Kateqoriya Filter
            </label>
            <select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as BranchCategory | "ALL")
              }
              className="w-full p-2 rounded-md text-gray-900 text-sm"
            >
              <option value="ALL">
                Bütün kateqoriyalar ({branches.length})
              </option>
              {Object.values(BranchCategory).map((cat) => {
                const count = branches.filter((b) => b.category === cat).length;
                return (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, " ")} ({count})
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-blue-100">
              Status Filter
            </label>
            <select
              value={filterStatus}
              onChange={(e) =>
                setFilterStatus(e.target.value as BranchStatus | "ALL")
              }
              className="w-full p-2 rounded-md text-gray-900 text-sm"
            >
              <option value="ALL">Bütün statuslar ({branches.length})</option>
              {Object.values(BranchStatus).map((status) => {
                const count = branches.filter(
                  (b) => b.status === status
                ).length;
                return (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")} ({count})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gray-50">
        <svg
          ref={svgRef}
          width={1000}
          height={600}
          className="w-full h-auto"
          viewBox="0 0 1000 600"
        />

        {/* Selected Branch Details */}
        {selectedBranch && (
          <div className="absolute top-4 right-4 bg-white p-6 rounded-lg shadow-lg border max-w-80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">{selectedBranch.branchName}</h3>
              <button
                onClick={() => setSelectedBranch(null)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: selectedBranch.color }}
                ></div>
                <div>
                  <div className="font-medium">
                    {selectedBranch.countryName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {selectedBranch.city}
                  </div>
                </div>
              </div>

              <div className="text-sm space-y-2">
                <div>
                  <strong>Ünvan:</strong> {selectedBranch.address}
                </div>
                <div>
                  <strong>Kateqoriya:</strong>{" "}
                  {selectedBranch.category.replace(/_/g, " ")}
                </div>
                <div>
                  <strong>Status:</strong>
                  <span
                    className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      selectedBranch.status === BranchStatus.ACTIVE
                        ? "bg-green-100 text-green-700"
                        : selectedBranch.status ===
                          BranchStatus.UNDER_CONSTRUCTION
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {selectedBranch.status.replace(/_/g, " ")}
                  </span>
                </div>
                <div>
                  <strong>İşçi sayı:</strong> {selectedBranch.employees}
                </div>
                <div>
                  <strong>Quruluş tarixi:</strong>{" "}
                  {new Date(selectedBranch.establishedDate).toLocaleDateString(
                    "az-AZ"
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md border">
          <button
            onClick={handleZoomIn}
            className="block w-10 h-10 text-lg font-bold hover:bg-gray-100 rounded-t-lg transition-colors"
            title="Böyüt"
          >
            +
          </button>
          <button
            onClick={handleResetZoom}
            className="block w-10 h-8 text-xs hover:bg-gray-100 border-t border-b transition-colors"
            title="Sıfırla"
          >
            ⌂
          </button>
          <button
            onClick={handleZoomOut}
            className="block w-10 h-10 text-lg font-bold hover:bg-gray-100 rounded-b-lg transition-colors"
            title="Kiçilt"
          >
            −
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="p-6 border-t bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categories Legend */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Kateqoriyalar</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(BranchCategory).map((category) => {
                const categoryBranches = filteredBranches.filter(
                  (b) => b.category === category
                );
                if (categoryBranches.length === 0) return null;

                return (
                  <div
                    key={category}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <div
                      className="w-4 h-4 rounded"
                      style={{
                        backgroundColor:
                          categoryBranches[0]?.color || "#6b7280",
                      }}
                    ></div>
                    <span>
                      {category.replace(/_/g, " ")} ({categoryBranches.length})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status Legend */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">Statuslar</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.values(BranchStatus).map((status) => {
                const statusBranches = filteredBranches.filter(
                  (b) => b.status === status
                );
                if (statusBranches.length === 0) return null;

                return (
                  <div
                    key={status}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <div
                      className={`w-4 h-4 rounded ${
                        status === BranchStatus.ACTIVE
                          ? "bg-green-500"
                          : status === BranchStatus.UNDER_CONSTRUCTION
                          ? "bg-yellow-500"
                          : status === BranchStatus.PLANNED
                          ? "bg-blue-500"
                          : status === BranchStatus.INACTIVE
                          ? "bg-gray-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span>
                      {status.replace(/_/g, " ")} ({statusBranches.length})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          💡 <strong>İpucu:</strong> Ölkələrin üzərinə gəlin tooltip görmək
          üçün, klik edin ətraflı məlumat üçün
        </div>
      </div>
    </div>
  );
}
