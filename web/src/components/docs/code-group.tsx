"use client";

import { Fragment, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { CodeSample } from "../../lib/framework/types";
import { DocsCopyButton } from "./document-primitives";

interface CodeGroupProps {
  id: string;
  samples: CodeSample[];
  title?: string;
  defaultSampleId?: string;
}

function SampleCode({ sample }: { sample: CodeSample }) {
  const lineEndings = sample.code.match(/\r\n|\n|\r/g) ?? [];
  return (
    <pre className="docs-code-pre" tabIndex={0} aria-label={`${sample.label}代码`}>
      <code className="docs-code">
        {sample.lines.length ? sample.lines.map((line, index) => (
          <Fragment key={`${index}-${line.number}`}>
            <span className="docs-code-line" data-highlighted={sample.highlightLines?.includes(index + 1) || undefined} dangerouslySetInnerHTML={{ __html: line.html }} />
            {lineEndings[index] ?? ""}
          </Fragment>
        )) : sample.code}
      </code>
    </pre>
  );
}

function SourceDetails({ sample }: { sample: CodeSample }) {
  if (!sample.sourcePath && !sample.sourceHash && !sample.checkpoint) return null;
  return (
    <details className="docs-source-details">
      <summary>版本与来源</summary>
      <dl className="docs-source-meta">
        {sample.sourcePath && <><dt>来源</dt><dd><code>{sample.sourcePath}</code></dd></>}
        {sample.sourceHash && <><dt>SHA-256</dt><dd><code>{sample.sourceHash}</code></dd></>}
        {sample.checkpoint && <><dt>检查点</dt><dd><code>{sample.checkpoint}</code></dd></>}
      </dl>
    </details>
  );
}

function SourceReference({ sample }: { sample: CodeSample }) {
  if (!sample.sourceUrl && !sample.sourcePath && !sample.sourceHash && !sample.checkpoint) return null;
  return <div className="docs-code-reference">
    {sample.sourceUrl && <a className="docs-code-source-link" href={sample.sourceUrl} target="_blank" rel="noreferrer">查看源码 ↗</a>}
    <SourceDetails sample={sample} />
  </div>;
}

export function CodeGroup({ id, samples, title, defaultSampleId }: CodeGroupProps) {
  const initialSample = samples.find((sample) => sample.id === defaultSampleId) ?? samples[0];
  const [selectedId, setSelectedId] = useState(initialSample?.id ?? "");
  const [enhanced, setEnhanced] = useState(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const selectedSample = samples.find((sample) => sample.id === selectedId) ?? initialSample;

  useEffect(() => setEnhanced(true), []);

  if (!selectedSample) {
    return <div id={id} className="docs-code-example"><p className="docs-code-empty">暂无代码</p></div>;
  }

  function handleTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex = index;
    switch (event.key) {
      case "ArrowRight": nextIndex = (index + 1) % samples.length; break;
      case "ArrowLeft": nextIndex = (index - 1 + samples.length) % samples.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = samples.length - 1; break;
      case "Enter":
      case " ": break;
      default: return;
    }
    event.preventDefault();
    setSelectedId(samples[nextIndex].id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div id={id} className="docs-code-example" data-enhanced={enhanced} data-active-sample={selectedSample.id}>
      {samples.length > 1 && <div className="docs-code-tabs" role="tablist" aria-label={title ? `${title}版本` : "代码版本"} aria-orientation="horizontal">
        {samples.map((sample, index) => (
          <button
            key={sample.id}
            ref={(node) => { tabRefs.current[index] = node; }}
            id={`${id}-tab-${sample.id}`}
            type="button"
            className="docs-code-tab"
            role="tab"
            aria-selected={sample.id === selectedSample.id}
            aria-controls={`${id}-panel-${sample.id}`}
            tabIndex={sample.id === selectedSample.id ? 0 : -1}
            disabled={!enhanced}
            onClick={() => setSelectedId(sample.id)}
            onKeyDown={(event) => handleTabKey(event, index)}
          >{sample.label}</button>
        ))}
      </div>}
      <div className="docs-code-group">
        <div className="docs-code-copy"><DocsCopyButton text={selectedSample.code} label="复制代码" iconOnly /></div>
        {samples.map((sample) => (
          <div
            key={sample.id}
            id={`${id}-panel-${sample.id}`}
            className="docs-code-panel"
            role="tabpanel"
            aria-labelledby={samples.length > 1 ? `${id}-tab-${sample.id}` : undefined}
            aria-label={samples.length === 1 ? sample.label : undefined}
            tabIndex={sample.id === selectedSample.id ? 0 : -1}
            hidden={sample.id !== selectedSample.id}
          >
            <SampleCode sample={sample} />
          </div>
        ))}
      </div>
      <SourceReference sample={selectedSample} />
      {samples.length > 1 && (
        <details className="docs-code-fallback">
          <summary>查看其他版本</summary>
          {samples.filter((sample) => sample.id !== selectedSample.id).map((sample) => (
            <div className="docs-code-fallback-sample" key={sample.id}>
              <p className="docs-code-fallback-label">{sample.label}</p>
              <div className="docs-code-group"><SampleCode sample={sample} /></div>
              <SourceReference sample={sample} />
            </div>
          ))}
        </details>
      )}
    </div>
  );
}
