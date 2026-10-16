// DocumentService — abstraction for curriculum document delivery and demo content.
//
// V1: Returns structured demo document pages and metadata.
// FUTURE REPLACEMENT:
//   1. Fetch a time-limited signed URL from Cloudflare R2 via a Cloudflare Worker
//   2. Validate student entitlement using Supabase JWT
//   3. Render using PDF.js inside a canvas/iframe
//
// NOTE: Anti-copy controls belong at the delivery and server authorization layer,
// not by claiming client-side viewers make documents impossible to copy.

import { CourseService } from './CourseService';

export interface DocumentPageContent {
  pageNumber: number;
  sectionTitle: string;
  paragraphs: string[];
  clinicalCorrelate?: string;
  figureCaption?: string;
  figureIcon?: string;
}

export interface DocumentSearchResult {
  pageNumber: number;
  sectionTitle: string;
  snippet: string;
}

export interface DocumentSource {
  type: 'placeholder' | 'local' | 'r2';
  url?: string;
  title: string;
  pageCount: number;
  pages: DocumentPageContent[];
}

const SECTION_TEMPLATES: Array<{
  title: string;
  text: string;
  clinical: string;
  icon: string;
  figure: string;
}> = [
  {
    title: 'Anatomical Overview & Clinical Objectives',
    text: 'Comprehensive structural analysis of anatomical landmarks, osseous boundaries, and neurovascular relationships. Core knowledge for clinical diagnosis and physical examination.',
    clinical: 'Clinical Correlate: Palpation of bony landmarks is essential for regional anesthesia and surgical incision planning.',
    icon: '🦴',
    figure: 'Osseous boundaries and surface projection landmarks',
  },
  {
    title: 'Musculoskeletal Compartments & Fascial Spaces',
    text: 'Detailed description of muscular compartments, intermuscular septa, deep fascial investments, and biomechanical forces. Compartment pressure dynamics and functional innervation.',
    clinical: 'Clinical Correlate: Acute compartment syndrome requires rapid diagnosis to prevent ischemic neuromuscular contracture.',
    icon: '💪',
    figure: 'Transverse cross-section of fascial compartments and muscle groups',
  },
  {
    title: 'Arterial Blood Supply & Collateral Anastomoses',
    text: 'Main arterial trunks, branching patterns, deep perforators, and periarticular anastomotic networks providing collateral circulation during regional arterial compromise.',
    clinical: 'Clinical Correlate: Testing collateral flow via Allen or pulse volume evaluation before arterial catheterization.',
    icon: '🩸',
    figure: 'Arterial distribution and anastomotic arcade network',
  },
  {
    title: 'Venous Drainage & Deep Lymphatics',
    text: 'Superficial and deep paired venae comitantes, valvular arrangement, and regional lymph node basins collecting interstitial lymph drainage.',
    clinical: 'Clinical Correlate: Deep vein thrombosis (DVT) assessment using Wells criteria and ultrasound duplex flow.',
    icon: '🩺',
    figure: 'Venous valve architecture and lymphatic drainage basins',
  },
  {
    title: 'Peripheral Nerve Pathways & Dermatomes',
    text: 'Spinal root origins, plexus formation, peripheral trunk trajectories, cutaneous sensory dermatomes, and myotomal motor functional testing.',
    clinical: 'Clinical Correlate: Compressive entrapment neuropathies cause characteristic paresthesia and motor atrophy.',
    icon: '⚡',
    figure: 'Nerve course, motor branches, and sensory dermatome distribution',
  },
  {
    title: 'Histological Architecture & Cellular Differentiation',
    text: 'Microscopic examination of tissue layers: specialized epithelium, extracellular matrix composition, basement membrane integrity, and cellular junctions.',
    clinical: 'Clinical Correlate: Dysplasia and loss of cellular polarity are hallmarks evaluated in histopathology biopsies.',
    icon: '🔬',
    figure: 'High-power histological micrograph showing tissue morphology',
  },
  {
    title: 'Physiological Mechanisms & Homeostatic Regulation',
    text: 'Organ-system autoregulation, hemodynamic receptor response, electrolyte transport gradients, and neuroendocrine feedback systems.',
    clinical: 'Clinical Correlate: Autonomic dysfunction or receptor blockade alters steady-state hemodynamics.',
    icon: '❤️',
    figure: 'Physiological signaling pathways and feedback loops',
  },
  {
    title: 'Pathology & Morphological Alterations',
    text: 'Cellular response to stress, ischemic injury, leukocytic infiltration in acute inflammation, and vascular permeability shifts.',
    clinical: 'Clinical Correlate: Granulomatous vs purulent inflammatory patterns determine therapeutic approach.',
    icon: '🧫',
    figure: 'Pathological lesion presentation and inflammatory cell infiltration',
  },
  {
    title: 'Radiological Interpretation & Cross-Sectional Imaging',
    text: 'Correlation between anatomical structures and imaging modalities including plain radiographs, computed tomography (CT), and magnetic resonance imaging (MRI).',
    clinical: 'Clinical Correlate: Systematic review of soft tissue shadows, cortical bone continuity, and fat planes.',
    icon: '🩻',
    figure: 'Cross-sectional radiological imaging with annotated landmarks',
  },
  {
    title: 'Summary & Review Questions',
    text: 'High-yield consolidation of key anatomical, physiological, and pathological principles. Review of differential diagnoses and clinical board exam concepts.',
    clinical: 'Clinical Correlate: Integrated case analysis demonstrating holistic patient care and diagnostic reasoning.',
    icon: '📋',
    figure: 'Diagnostic algorithm and high-yield review matrix',
  },
];

function generatePages(lessonTitle: string, totalPages: number): DocumentPageContent[] {
  const pages: DocumentPageContent[] = [];
  for (let p = 1; p <= totalPages; p++) {
    const templateIdx = (p - 1) % SECTION_TEMPLATES.length;
    const template = SECTION_TEMPLATES[templateIdx];
    const cycle = Math.floor((p - 1) / SECTION_TEMPLATES.length) + 1;
    const titleSuffix = cycle > 1 ? ` (Part ${cycle})` : '';

    pages.push({
      pageNumber: p,
      sectionTitle: `${template.title}${titleSuffix}`,
      paragraphs: [
        `${lessonTitle} — Section ${p}. ${template.text}`,
        `Further examination reveals key morphological features that distinguish normal physiological architecture from pathological variants. Thorough inspection of surrounding tissue planes confirms baseline boundaries.`,
        `Specialized functional adaptations allow rapid metabolic response under systemic physiological stress or physical exertion.`,
      ],
      clinicalCorrelate: template.clinical,
      figureIcon: template.icon,
      figureCaption: `Figure ${p}.1: ${template.figure}`,
    });
  }
  return pages;
}

export const DocumentService = {
  async getDocumentSource(lessonId: string, courseId: string): Promise<DocumentSource> {
    // Brief local async simulation
    await new Promise(res => setTimeout(res, 20));

    const lesson = CourseService.getLesson(lessonId);
    const title = lesson?.title ?? `Lesson document — ${lessonId} (${courseId})`;
    const pageCount = lesson?.pageCount ?? 40;
    const pages = generatePages(title, pageCount);

    return {
      type: 'placeholder',
      url: undefined,
      title,
      pageCount,
      pages,
    };
  },

  searchDocument(source: DocumentSource, query: string): DocumentSearchResult[] {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: DocumentSearchResult[] = [];

    for (const page of source.pages) {
      let matchedSnippet = '';

      if (page.sectionTitle.toLowerCase().includes(q)) {
        matchedSnippet = `Heading match: "${page.sectionTitle}"`;
      } else {
        for (const p of page.paragraphs) {
          const idx = p.toLowerCase().indexOf(q);
          if (idx !== -1) {
            const start = Math.max(0, idx - 40);
            const end = Math.min(p.length, idx + q.length + 50);
            matchedSnippet = `${start > 0 ? '…' : ''}${p.slice(start, end)}${end < p.length ? '…' : ''}`;
            break;
          }
        }

        if (!matchedSnippet && page.clinicalCorrelate?.toLowerCase().includes(q)) {
          const cc = page.clinicalCorrelate;
          const idx = cc.toLowerCase().indexOf(q);
          const start = Math.max(0, idx - 30);
          const end = Math.min(cc.length, idx + q.length + 40);
          matchedSnippet = `${start > 0 ? '…' : ''}${cc.slice(start, end)}${end < cc.length ? '…' : ''}`;
        }

        if (!matchedSnippet && page.figureCaption?.toLowerCase().includes(q)) {
          matchedSnippet = `Figure caption: "${page.figureCaption}"`;
        }
      }

      if (matchedSnippet) {
        results.push({
          pageNumber: page.pageNumber,
          sectionTitle: page.sectionTitle,
          snippet: matchedSnippet,
        });
      }
    }

    return results;
  },
};
