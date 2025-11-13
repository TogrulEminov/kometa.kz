// components/BranchesMapClient.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import MapLegend from "../mapLegend";
import BranchModal from "../branchModal";
import { BranchItem } from "@/src/services/interface";
import worldGeoJSON from "@/public/data/world.geo.json";
import { useTranslations } from "next-intl";

interface Props {
  branches: BranchItem[];
}

export default function BranchesMapClient({ branches }: Props) {
  const [worldData, setWorldData] = useState<any>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchItem | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const t = useTranslations("branches");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const branchMap = new Map(branches.map((b) => [b.isoCode, b]));

  useEffect(() => {
    setWorldData(worldGeoJSON);
  }, []);

  // Helper function to get country color based on branch type and status
  const getCountryColor = (branch: BranchItem) => {
    return branch.status === "ACTIVE" ? "#10b981" : "#3b82f6"; // Green/Blue for office
  };

  // Draw map
  useEffect(() => {
    if (!svgRef.current || !worldData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 1200;
    const height = 600;

    const projection = d3
      .geoNaturalEarth1()
      .scale(200)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);
    const g = svg.append("g");

    // Ocean background
    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent");

    // Draw countries
    g.selectAll("path")
      .data(worldData.features)
      .enter()
      .append("path")
      .attr("d", path as any)
      .attr("fill", (d: any) => {
        const isoCode = d.properties.ISO_A3;
        const branch = branchMap.get(isoCode);

        if (!branch) return "#f1f5f9";
        return getCountryColor(branch);
      })
      .attr("stroke", "#ffffff")
      .attr("stroke-width", "1")
      .style("cursor", (d: any) => {
        const isoCode = d.properties.ISO_A3;
        return branchMap.has(isoCode) ? "pointer" : "default";
      })
      .on("mouseover", function (event, d: any) {
        const isoCode = d.properties.ISO_A3;
        const branch = branchMap.get(isoCode);

        if (branch) {
          setHoveredCountry(branch.countryName);
          d3.select(this)
            .attr("stroke-width", "2")
            .style("filter", "brightness(1.15)");

          if (tooltipRef.current) {
            tooltipRef.current.style.display = "block";
            tooltipRef.current.style.left = `${event.pageX + 10}px`;
            tooltipRef.current.style.top = `${event.pageY - 30}px`;
          }
        }
      })
      .on("mousemove", function (event) {
        if (tooltipRef.current) {
          tooltipRef.current.style.left = `${event.pageX + 10}px`;
          tooltipRef.current.style.top = `${event.pageY - 30}px`;
        }
      })
      .on("mouseout", function () {
        setHoveredCountry(null);
        d3.select(this).attr("stroke-width", "1").style("filter", "none");

        if (tooltipRef.current) {
          tooltipRef.current.style.display = "none";
        }
      })
      .on("click", function (event, d: any) {
        const isoCode = d.properties.ISO_A3;
        const branch = branchMap.get(isoCode);
        if (branch) {
          setSelectedBranch(branch);
        }
      });
  }, [worldData, branches, branchMap]);

  return (
    <>
      <div className="overflow-hidden">
        {/* Desktop - Map View */}
        <div className="hidden lg:block relative w-full lg:h-150">
          {!worldData ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-700 font-medium">{t("loadingMap")}</p>
              </div>
            </div>
          ) : (
            <>
              <svg
                ref={svgRef}
                width="100%"
                height="100%"
                viewBox="0 0 1200 600"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-full"
              />

              {/* Tooltip */}
              {hoveredCountry && (
                <div
                  ref={tooltipRef}
                  className="absolute bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold pointer-events-none z-50 shadow-xl border border-gray-700"
                  style={{ display: "none" }}
                >
                  {hoveredCountry}
                </div>
              )}

              {/* Legend */}
              <MapLegend />
            </>
          )}
        </div>

        {/* Mobile - Card List */}
        <div className="lg:hidden">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-4">
            {branches.map((branch) => (
              <div
                key={branch.id}
                onClick={() => setSelectedBranch(branch)}
                className={`bg-white rounded-xl border-2 p-5 cursor-pointer transition-all duration-200 hover:shadow-lg active:scale-95 border-[#dee2e6] hover:border-ui-4`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <strong className="text-lg font-bold text-[#003751] mb-2">
                      {branch.countryName}
                    </strong>
                    <span
                      className={`text-xs font-mono font-semibold px-2 py-1 rounded border text-ui-4 bg-[#effaff] border-ui-4/20`}
                    >
                      {branch.isoCode}
                    </span>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#effaff] border border-ui-4/20`}
                  >
                    <svg
                      className="w-6 h-6 text-ui-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1.5 text-sm text-[#575a7b]">
                    <svg
                      className={`w-4 h-4  text-ui-4`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <span className="font-semibold">
                      {branch.offices.length} {t("office")}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border  bg-[#effaff] text-[#003751] border-ui-4/30`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full bg-ui-4`} />
                  {branch.status === "ACTIVE"
                    ? "Fəaliyyətdə"
                    : "Planlaşdırılıb"}
                </div>

                {/* Arrow */}
                <div className="mt-4 flex items-center justify-end">
                  <svg
                    className={`w-5 h-5 text-ui-4`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal - Shared for both Desktop and Mobile */}
      {selectedBranch && (
        <BranchModal
          branch={selectedBranch}
          onClose={() => setSelectedBranch(null)}
        />
      )}
    </>
  );
}
