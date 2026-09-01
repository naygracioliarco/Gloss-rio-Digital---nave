import { useState, useMemo, useRef, useEffect } from "react";
import logoHorizontal from "@/imports/Logo_Nave_a_Vela_RGB-05.png";
import logoVertical from "@/imports/Logo_Nave_a_Vela_RGB-01.png";
import { GLOSSARY, TOP_AREAS, type GlossaryTerm } from "./data/glossary";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function normalizeLetter(str: string): string {
  return str[0].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
}

const AREA_COLORS: Record<string, string> = {
  "Educação":                "#2a9d8f",
  "Tecnologia":              "#6d28d9",
  "Inteligência Artificial": "#1561DE",
  "Segurança Digital":       "#e63946",
  "Computação":              "#0284c7",
  "Sustentabilidade":        "#16a34a",
  "Comunicação":             "#d97706",
  "Design":                  "#EE377D",
  "UX":                      "#db2777",
  "Dados":                   "#0891b2",
  "Programação":             "#ea580c",
  "Gestão":                  "#7c3aed",
  "Inovação":                "#be185d",
  "Pesquisa":                "#0369a1",
  "Redes de Computadores":   "#1d4ed8",
  "Ciência de Dados":        "#0e7490",
  "Cidadania Digital":       "#065f46",
  "Jogos Digitais":          "#92400e",
  "Eletrônica":              "#374151",
  "Ética":                   "#6b21a8",
};

function getColor(area: string) {
  return AREA_COLORS[area] ?? "#888";
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0,2),16)}, ${parseInt(h.slice(2,4),16)}, ${parseInt(h.slice(4,6),16)}`;
}

function copyToClipboard(text: string): Promise<void> {
  const fallback = () => new Promise<void>((resolve) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
    document.body.appendChild(ta);
    ta.focus(); ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    resolve();
  });

  if (!navigator.clipboard?.writeText) return fallback();
  return navigator.clipboard.writeText(text).catch(fallback);
}

function AreaTags({ areaLabel, primaryArea, size = "sm" }: { areaLabel: string; primaryArea: string; size?: "xs" | "sm" }) {
  const tags = areaLabel.split("|").map(t => t.trim()).filter(Boolean);
  const primaryColor = getColor(primaryArea);
  const px = size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs";
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, i) => {
        const color = i === 0 ? primaryColor : "#6b7280";
        const rgb = hexToRgb(color);
        return (
          <span
            key={tag}
            className={`inline-block font-medium rounded-full ${px}`}
            style={{ background: `rgba(${rgb}, 0.1)`, color, border: `1px solid rgba(${rgb}, 0.2)` }}
          >
            {tag}
          </span>
        );
      })}
    </div>
  );
}

function TermRow({ term }: { term: GlossaryTerm }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const color = getColor(term.area);
  const rgb = hexToRgb(color);

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    const text = `${term.term}\nÁrea: ${term.areaLabel}\n\nDefinição: ${term.definition}\n\nExemplo: ${term.example}`;
    copyToClipboard(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left py-3.5 flex items-start gap-3 group focus:outline-none"
      >
        {/* Barra colorida lateral */}
        <span className="w-1 self-stretch rounded-full shrink-0 mt-0.5" style={{ background: color, minHeight: 20 }} />
        <div className="flex-1 min-w-0">
          <span className="font-medium text-[15px] text-gray-900 group-hover:text-[#1561DE] transition-colors leading-snug block">
            {term.term}
          </span>
          {/* Tags inline no estado colapsado */}
          <div className="mt-1">
            <AreaTags areaLabel={term.areaLabel} primaryArea={term.area} size="xs" />
          </div>
        </div>
        <svg className={`w-4 h-4 shrink-0 mt-1 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="#EE377D" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="relative pt-3 pb-5 pl-4 pr-3 space-y-3 mx-1 mb-2 rounded-xl border border-gray-100 bg-gray-50/60 shadow-sm">
          <div className="absolute top-0 right-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all"
              style={copied
                ? { background: "#f0fdf4", color: "#16a34a", borderColor: "#bbf7d0" }
                : { background: "#f9fafb", color: "#6b7280", borderColor: "#e5e7eb" }}
            >
              {copied ? (
                <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Copiado!</>
              ) : (
                <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></svg>Copiar</>
              )}
            </button>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-gray-700 uppercase tracking-wide">Definição</span>
            <p className="text-sm text-gray-700 leading-relaxed mt-1">{term.definition}</p>
          </div>
          <div className="rounded-r-lg px-4 py-3" style={{ borderLeft: `3px solid ${color}`, background: `rgba(${rgb}, 0.05)` }}>
            <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color }}>Exemplo</span>
            <p className="text-sm text-gray-600 leading-relaxed mt-1 italic">{term.example}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Sidebar de áreas ── */
function AreaSidebar({ selected, onSelect }: { selected: string | null; onSelect: (a: string | null) => void }) {
  return (
    <nav className="space-y-0.5">
      <button
        onClick={() => onSelect(null)}
        className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
          !selected ? "bg-[#EE377D] text-white font-semibold" : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${!selected ? "bg-white/60" : "bg-gray-300"}`} />
        Todas as áreas
      </button>
      {TOP_AREAS.map(area => {
        const color = getColor(area);
        const active = selected === area;
        return (
          <button
            key={area}
            onClick={() => onSelect(active ? null : area)}
            className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
            style={active
              ? { background: `rgba(${hexToRgb(color)}, 0.1)`, color, fontWeight: 600 }
              : { color: "#4b5563" }}
            onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "#f3f4f6"; }}
            onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = ""; }}
          >
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
            {area}
          </button>
        );
      })}
    </nav>
  );
}

/* ── Menu mobile (bottom sheet) ── */
function MobileAreaMenu({ selected, onSelect, onClose }: { selected: string | null; onSelect: (a: string | null) => void; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 bg-black/40 cursor-pointer" onClick={onClose} />
      {/* Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl"
        style={{ maxHeight: "75vh", paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Filtrar por área</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-3" style={{ maxHeight: "calc(75vh - 60px)" }}>
          <button
            onClick={() => { onSelect(null); onClose(); }}
            className={`w-full text-left flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm mb-1 transition-colors ${
              !selected ? "bg-[#1561DE] text-white font-semibold" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${!selected ? "bg-white/60" : "bg-gray-300"}`} />
            Todas as áreas
          </button>
          {TOP_AREAS.map(area => {
            const color = getColor(area);
            const active = selected === area;
            return (
              <button
                key={area}
                onClick={() => { onSelect(active ? null : area); onClose(); }}
                className="w-full text-left flex items-center gap-2.5 px-3 py-3 rounded-xl text-sm mb-1 transition-colors"
                style={active
                  ? { background: `rgba(${hexToRgb(color)}, 0.1)`, color, fontWeight: 600 }
                  : { color: "#374151" }}
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                {area}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const availableLetters = useMemo(
    () => new Set(GLOSSARY.map(t => normalizeLetter(t.term))),
    []
  );

  // Normaliza string removendo acentos e caixa
  function normalize(s: string) {
    return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
  }

  // 0 = sem match | 1 = só definição | 2 = contém no nome | 3 = começa com nome | 4 = exato
  function relevance(t: GlossaryTerm, q: string): number {
    if (!q) return 3;
    const nq = normalize(q);
    const nterm = normalize(t.term);
    if (nterm === nq) return 4;
    if (nterm.startsWith(nq)) return 3;
    if (nterm.includes(nq)) return 2;
    if (normalize(t.definition).includes(nq)) return 1;
    return 0;
  }

  const { primary, suggestions, filtered } = useMemo(() => {
    const q = search.trim();
    const matchLetter = (t: GlossaryTerm) => !selectedLetter || normalizeLetter(t.term) === selectedLetter;
    const matchArea   = (t: GlossaryTerm) => !selectedArea || t.area === selectedArea || t.areaLabel.includes(selectedArea);

    const scored = GLOSSARY
      .map(t => ({ t, score: relevance(t, q) }))
      .filter(({ t, score }) => score > 0 && matchLetter(t) && matchArea(t))
      .sort((a, b) => b.score - a.score || a.t.term.localeCompare(b.t.term, "pt"));

    const primary     = scored.filter(({ score }) => score >= 2).map(({ t }) => t);
    const suggestions = scored.filter(({ score }) => score === 1).map(({ t }) => t);
    const filtered    = scored.map(({ t }) => t);
    return { primary, suggestions, filtered };
  }, [search, selectedLetter, selectedArea]);

  const grouped = useMemo(() => {
    const map: Record<string, GlossaryTerm[]> = {};
    for (const t of filtered) {
      const l = normalizeLetter(t.term);
      if (!map[l]) map[l] = [];
      map[l].push(t);
    }
    if (search.trim()) return [["", filtered]] as [string, GlossaryTerm[]][];
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered, search]);

  const hasFilters = !!(search || selectedLetter || selectedArea);
  function clearAll() { setSearch(""); setSelectedLetter(null); setSelectedArea(null); }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Lexend', sans-serif" }}>

      {/* ── HERO ── */}
      <section className="relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #0d47c4 0%, #1561DE 60%, #1a6ef5 100%)",
        paddingTop: "max(env(safe-area-inset-top), 0px)",
      }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: "radial-gradient(circle at 80% 20%, #EE377D 0%, transparent 50%), radial-gradient(circle at 10% 80%, #fff 0%, transparent 40%)"
        }} />
        <div className="relative max-w-5xl mx-auto px-5 pt-10 pb-8">
          <img src={logoVertical} alt="Nave a Vela" className="w-28 sm:w-36 mx-auto mb-6 object-contain"
            style={{ filter: "brightness(0) invert(1)" }} />
          <div className="text-center mb-6">
            <span className="inline-block bg-[#EE377D] text-white text-[11px] font-semibold px-3 py-1 rounded-full mb-3 tracking-widest uppercase">
              Glossário Digital
            </span>
            <h1 className="text-3xl sm:text-4xl font-semibold text-white leading-tight">Vocabulário da era digital</h1>
          </div>

          {/* Busca */}
          <div className="mx-auto" style={{ maxWidth: 480 }}>
            <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 shadow-xl transition-all duration-200"
              style={{ boxShadow: searchFocused ? "0 0 0 3px rgba(238,55,125,.35), 0 8px 32px rgba(0,0,0,.18)" : "0 8px 32px rgba(0,0,0,.18)" }}>
              <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                ref={searchRef}
                type="text" inputMode="search"
                placeholder="Buscar um termo…"
                value={search}
                onChange={e => { setSearch(e.target.value); setSelectedLetter(null); setSelectedArea(null); }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="flex-1 bg-transparent focus:outline-none placeholder-gray-400 min-w-0 text-gray-800"
                style={{ fontSize: 16 }}
              />
              {search && (
                <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {search && (
              <p className="text-center text-white/50 text-xs mt-2">
                {primary.length} resultado{primary.length !== 1 ? "s" : ""}
                {suggestions.length > 0 && ` · ${suggestions.length} sugestão${suggestions.length !== 1 ? "ões" : ""}`}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── LAYOUT PRINCIPAL ── */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="lg:grid lg:gap-8" style={{ gridTemplateColumns: "220px 1fr" }}>

          {/* ── SIDEBAR (desktop) ── */}
          <aside className="hidden lg:block pt-6 pb-10">
            <div className="sticky top-6">
              <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest mb-3 px-3">Área</p>
              <AreaSidebar selected={selectedArea} onSelect={a => { setSelectedArea(a); setSelectedLetter(null); setSearch(""); }} />
            </div>
          </aside>

          {/* ── CONTEÚDO ── */}
          <div className="min-w-0">

            {/* Barra de controles (mobile: sanduíche + letra; desktop: só letra) */}
            <div className="pt-5 pb-3">

              {/* Linha superior mobile: botão área + resumo */}
              <div className="flex items-center gap-3 mb-3 lg:hidden">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm transition-colors hover:border-[#1561DE] hover:text-[#1561DE]"
                  style={selectedArea ? { borderColor: getColor(selectedArea), color: getColor(selectedArea), background: `rgba(${hexToRgb(getColor(selectedArea))}, 0.06)` } : {}}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h6" />
                  </svg>
                  {selectedArea ?? "Todas as áreas"}
                  {selectedArea && (
                    <span
                      onClick={e => { e.stopPropagation(); setSelectedArea(null); }}
                      className="ml-1 text-gray-400 hover:text-black cursor-pointer"
                      role="button"
                    >✕</span>
                  )}
                </button>
                {hasFilters && (
                  <button onClick={clearAll} className="text-xs text-gray-400 hover:text-black underline underline-offset-2 shrink-0">
                    Limpar
                  </button>
                )}
              </div>

              {/* Limpar no desktop */}
              {hasFilters && (
                <div className="hidden lg:flex justify-end mb-2">
                  <button onClick={clearAll} className="text-xs text-gray-400 hover:text-black underline underline-offset-2">
                    Limpar filtros
                  </button>
                </div>
              )}

              {/* Alfabeto — flex-wrap para nunca cortar */}
              <div className="flex flex-wrap gap-1.5">
                {LETTERS.map(l => {
                  const has = availableLetters.has(l);
                  const active = selectedLetter === l;
                  return (
                    <button
                      key={l}
                      disabled={!has}
                      onClick={() => { setSelectedLetter(active ? null : l); setSearch(""); setSelectedArea(null); }}
                      className="w-8 h-8 text-xs font-semibold rounded-lg transition-colors"
                      style={
                        active ? { background: "#EE377D", color: "#fff" }
                        : has   ? { color: "#1561DE", background: "#f0f4ff" }
                                : { color: "#cbd5e1", background: "#f8fafc" }
                      }
                    >
                      {l}
                    </button>
                  );
                })}
              </div>

              {/* Resumo */}
              {hasFilters && (
                <p className="text-xs text-gray-400 mt-3">
                  {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                  {selectedArea && <> · <span style={{ color: getColor(selectedArea) }}>{selectedArea}</span></>}
                  {selectedLetter && <> · letra <strong className="text-[#EE377D]">{selectedLetter}</strong></>}
                  {search && <> · "<strong className="text-gray-600">{search}</strong>"</>}
                </p>
              )}
            </div>

            {/* Termos */}
            <main style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}>
              {filtered.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-5xl mb-4">🤷</p>
                  <p className="text-sm text-gray-400">
                    Nenhum resultado para <strong className="text-gray-700">"{search || selectedLetter}"</strong>
                  </p>
                  <button onClick={clearAll} className="mt-4 text-xs text-[#1561DE] underline underline-offset-2">
                    Limpar busca
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {search.trim() ? (
                    // ── Modo busca: principal + sugestões ──
                    <>
                      {primary.length > 0 && (
                        <section>
                          <div>{primary.map(t => <TermRow key={t.id} term={t} />)}</div>
                        </section>
                      )}
                      {suggestions.length > 0 && (
                        <section>
                          <div className="flex items-center gap-3 mb-3">
                            <div className="flex-1 h-px bg-gray-100" />
                            <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                              Também aborda esse tema
                            </span>
                            <div className="flex-1 h-px bg-gray-100" />
                          </div>
                          <div>{suggestions.map(t => <TermRow key={t.id} term={t} />)}</div>
                        </section>
                      )}
                    </>
                  ) : (
                    // ── Modo normal: agrupado por letra ──
                    grouped.map(([letter, terms]) => (
                      <section key={letter}>
                        <div className="flex items-baseline gap-3 mb-2">
                          <span className="text-5xl font-semibold text-[#EE377D] leading-none">{letter}</span>
                          <span className="text-xs text-gray-400">{terms.length}</span>
                        </div>
                        <div>{terms.map(t => <TermRow key={t.id} term={t} />)}</div>
                      </section>
                    ))
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-100 py-6 px-4 mt-4"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <img src={logoHorizontal} alt="Nave a Vela" className="h-6 object-contain opacity-60" />
          <p className="text-xs text-gray-500">Educação para a era digital</p>
        </div>
      </footer>

      {/* ── MENU MOBILE (bottom sheet) ── */}
      {mobileMenuOpen && (
        <MobileAreaMenu
          selected={selectedArea}
          onSelect={a => { setSelectedArea(a); setSelectedLetter(null); setSearch(""); }}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
