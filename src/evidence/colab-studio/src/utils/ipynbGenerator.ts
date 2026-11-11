// Utility to construct a valid Jupyter Notebook (.ipynb) format JSON string
export interface NotebookCell {
  cell_type: 'code' | 'markdown';
  source: string[];
  execution_count?: number | null;
  outputs?: any[];
  metadata?: Record<string, any>;
}

export function createJupyterNotebook(cells: { type: 'code' | 'markdown'; content: string }[]): string {
  const notebookCells: NotebookCell[] = cells.map(cell => {
    // Split into lines preserving newlines
    const lines = cell.content.split('\n').map((line, idx, arr) => (idx === arr.length - 1 ? line : line + '\n'));
    if (cell.type === 'code') {
      return {
        cell_type: 'code',
        execution_count: null,
        metadata: {},
        outputs: [],
        source: lines,
      };
    } else {
      return {
        cell_type: 'markdown',
        metadata: {},
        source: lines,
      };
    }
  });

  const notebook = {
    nbformat: 4,
    nbformat_minor: 0,
    metadata: {
      colab: {
        provenance: [],
        gpuType: 'T4',
      },
      kernelspec: {
        name: 'python3',
        display_name: 'Python 3',
      },
      language_info: {
        name: 'python',
      },
      accelerator: 'GPU',
    },
    cells: notebookCells,
  };

  return JSON.stringify(notebook, null, 2);
}

export function downloadNotebookFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.ipynb') ? filename : `${filename}.ipynb`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function downloadJsonlFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'application/jsonl' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.jsonl') ? filename : `${filename}.jsonl`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
