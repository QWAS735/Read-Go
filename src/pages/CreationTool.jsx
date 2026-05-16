import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlog, saveBlog, generateParagraphId } from "../data/storage";
import { useAuth } from "../context/AuthContext";
import LocationInput from "../components/LocationInput";
import "./CreationTool.css";

function ParagraphCard({ para, index, total, activeId, onEdit, onSave, onDelete, onMove }) {
  const isEditing = activeId === para.id;
  const [draft, setDraft] = useState({ ...para });

  useEffect(() => {
    if (isEditing) setDraft({ ...para });
  }, [isEditing]);

  if (!isEditing) {
    return (
      <div className="para-card para-card--saved">
        <div className="para-card__drag-bar">
          <button
            className="para-card__move-btn"
            disabled={index === 0}
            onClick={() => onMove(para.id, -1)}
            title="Move up"
          >▲</button>
          <span className="para-card__order">#{index + 1}</span>
          <button
            className="para-card__move-btn"
            disabled={index === total - 1}
            onClick={() => onMove(para.id, 1)}
            title="Move down"
          >▼</button>
        </div>
        <div className="para-card__preview" onClick={() => onEdit(para.id)}>
          {para.heading && <h3 className="para-card__preview-heading">{para.heading}</h3>}
          {para.location && (
            <span className="para-card__preview-loc">📍 {para.location.name}</span>
          )}
          <p className="para-card__preview-body">
            {para.body.length > 120 ? para.body.slice(0, 117) + "…" : para.body || <em>Empty</em>}
          </p>
        </div>
        <button className="para-card__delete" onClick={() => onDelete(para.id)} title="Delete paragraph">✕</button>
      </div>
    );
  }

  return (
    <div className="para-card para-card--editing">
      <div className="para-card__drag-bar">
        <button
          className="para-card__move-btn"
          disabled={index === 0}
          onClick={() => onMove(para.id, -1)}
          title="Move up"
        >▲</button>
        <span className="para-card__order">#{index + 1}</span>
        <button
          className="para-card__move-btn"
          disabled={index === total - 1}
          onClick={() => onMove(para.id, 1)}
          title="Move down"
        >▼</button>
      </div>
      <div className="para-card__fields">
        <input
          className="para-card__heading-input"
          type="text"
          placeholder="Paragraph heading (bold, large)"
          value={draft.heading}
          onChange={e => setDraft(d => ({ ...d, heading: e.target.value }))}
        />
        <textarea
          className="para-card__body-input"
          placeholder="Paragraph body..."
          value={draft.body}
          onChange={e => setDraft(d => ({ ...d, body: e.target.value }))}
          rows={6}
        />
        <LocationInput
          value={draft.location}
          onChange={loc => setDraft(d => ({ ...d, location: loc }))}
        />
      </div>
      <div className="para-card__actions">
        <button
          className="para-card__cancel"
          onClick={() => onEdit(null)}
        >
          Cancel
        </button>
        <button
          className="para-card__save"
          onClick={() => onSave(draft)}
        >
          Save Paragraph
        </button>
      </div>
    </div>
  );
}

export default function CreationTool() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const b = getBlog(id);
    if (!b) { navigate("/create"); return; }
    if (b.author !== user?.username) { navigate("/create"); return; }
    setBlog(b);
    setTitle(b.title);
    setParagraphs(b.paragraphs || []);
  }, [id]);

  function handleSaveParagraph(draft) {
    setParagraphs(prev =>
      prev.map(p => p.id === draft.id ? { ...draft } : p)
    );
    setActiveId(null);
  }

  function handleDeleteParagraph(paraId) {
    if (activeId === paraId) setActiveId(null);
    setParagraphs(prev => prev.filter(p => p.id !== paraId));
  }

  function handleMove(paraId, dir) {
    setParagraphs(prev => {
      const idx = prev.findIndex(p => p.id === paraId);
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[next]] = [arr[next], arr[idx]];
      return arr;
    });
  }

  function handleAddParagraph() {
    if (activeId) return;
    const newPara = {
      id: generateParagraphId(),
      heading: "",
      body: "",
      location: null,
    };
    setParagraphs(prev => [...prev, newPara]);
    setActiveId(newPara.id);
  }

  function handleBlogSave() {
    if (!blog) return;
    const updated = {
      ...blog,
      title: title || "Untitled Blog",
      paragraphs,
    };
    saveBlog(updated);
    setBlog(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleEditParagraph(paraId) {
    if (activeId && activeId !== paraId) return;
    setActiveId(paraId);
  }

  if (!blog) return null;

  return (
    <main className="creation-tool">
      <div className="creation-tool__inner">
        <div className="creation-tool__toprow">
          <button className="creation-tool__back" onClick={() => navigate("/create")}>← Back</button>
          <button className="creation-tool__publish" onClick={handleBlogSave}>
            {saved ? "✓ Saved!" : "Save Blog"}
          </button>
        </div>

        {/* Row 0: Title */}
        <input
          className="creation-tool__title-input"
          type="text"
          placeholder="Blog title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        {/* Row 1: Paragraphs + Add */}
        <div className="creation-tool__paragraphs">
          {paragraphs.map((p, i) => (
            <ParagraphCard
              key={p.id}
              para={p}
              index={i}
              total={paragraphs.length}
              activeId={activeId}
              onEdit={handleEditParagraph}
              onSave={handleSaveParagraph}
              onDelete={handleDeleteParagraph}
              onMove={handleMove}
            />
          ))}
          <button
            className={`creation-tool__add-para ${activeId ? "creation-tool__add-para--disabled" : ""}`}
            onClick={handleAddParagraph}
            disabled={!!activeId}
            title={activeId ? "Save the current paragraph first" : "Add paragraph"}
          >
            <span className="creation-tool__add-plus">+</span>
            <span>Add Paragraph</span>
          </button>
        </div>

        {paragraphs.length > 0 && (
          <div className="creation-tool__preview-link">
            <button
              className="creation-tool__preview-btn"
              onClick={() => { handleBlogSave(); navigate(`/blog/${id}`); }}
            >
              Save &amp; Preview →
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
