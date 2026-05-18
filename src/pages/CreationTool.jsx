import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlog, saveBlog, deleteBlog, generateParagraphId } from "../data/storage";
import { useAuth } from "../context/AuthContext";
import LocationInput from "../components/LocationInput";
import "./CreationTool.css";

const MAX_RATIO = 21 / 9;
const MIN_RATIO = 9 / 21;
const MAX_DIM = 960;
const JPEG_QUALITY = 0.82;

function compressAndValidateImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ratio = img.width / img.height;
      if (ratio > MAX_RATIO || ratio < MIN_RATIO) {
        reject("Aspect ratio must be between 9:21 and 21:9.");
        return;
      }
      let w = img.width, h = img.height;
      if (w > MAX_DIM || h > MAX_DIM) {
        if (w >= h) { h = Math.round(h * MAX_DIM / w); w = MAX_DIM; }
        else { w = Math.round(w * MAX_DIM / h); h = MAX_DIM; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d").drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", JPEG_QUALITY));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject("Invalid image file."); };
    img.src = url;
  });
}

function DeleteConfirmModal({ onConfirm, onClose }) {
  return (
    <div className="delete-modal-overlay" onClick={onClose}>
      <div className="delete-modal" onClick={e => e.stopPropagation()}>
        <button className="delete-modal__close" onClick={onClose}>✕</button>
        <h3 className="delete-modal__title">Delete this blog?</h3>
        <p className="delete-modal__body">This action cannot be undone.</p>
        <button className="delete-modal__confirm" onClick={onConfirm}>Delete Blog</button>
      </div>
    </div>
  );
}

function ParagraphCard({ para, index, total, activeId, onEdit, onSave, onDelete, onMove }) {
  const isEditing = activeId === para.id;
  const [draft, setDraft] = useState({ ...para });
  const [imgError, setImgError] = useState("");
  const imgInputRef = useRef(null);

  useEffect(() => {
    if (isEditing) { setDraft({ ...para }); setImgError(""); }
  }, [isEditing]);

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImgError("");
    try {
      const base64 = await compressAndValidateImage(file);
      setDraft(d => ({ ...d, image: base64 }));
    } catch (err) {
      setImgError(err);
    }
    e.target.value = "";
  }

  if (!isEditing) {
    return (
      <div className="para-card para-card--saved">
        <div className="para-card__drag-bar">
          <button className="para-card__move-btn" disabled={index === 0} onClick={() => onMove(para.id, -1)} title="Move up">▲</button>
          <span className="para-card__order">#{index + 1}</span>
          <button className="para-card__move-btn" disabled={index === total - 1} onClick={() => onMove(para.id, 1)} title="Move down">▼</button>
        </div>
        <div className="para-card__preview" onClick={() => onEdit(para.id)}>
          {para.heading && <h3 className="para-card__preview-heading">{para.heading}</h3>}
          {para.image && <img src={para.image} className="para-card__preview-img" alt="" />}
          {para.location && <span className="para-card__preview-loc">📍 {para.location.name}</span>}
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
        <button className="para-card__move-btn" disabled={index === 0} onClick={() => onMove(para.id, -1)} title="Move up">▲</button>
        <span className="para-card__order">#{index + 1}</span>
        <button className="para-card__move-btn" disabled={index === total - 1} onClick={() => onMove(para.id, 1)} title="Move down">▼</button>
      </div>
      <div className="para-card__fields">
        <input
          className="para-card__heading-input"
          type="text"
          placeholder="Paragraph heading (bold, large)"
          value={draft.heading}
          onChange={e => setDraft(d => ({ ...d, heading: e.target.value }))}
        />
        <div className="para-card__image-section">
          {draft.image && (
            <div className="para-card__image-preview-wrap">
              <img src={draft.image} className="para-card__image-preview" alt="" />
              <button
                className="para-card__image-remove"
                onClick={() => setDraft(d => ({ ...d, image: null }))}
                title="Remove image"
              >✕</button>
            </div>
          )}
          <label className="para-card__image-upload-btn">
            {draft.image ? "Change Image" : "＋ Add Paragraph Image"}
            <input ref={imgInputRef} type="file" accept="image/*" hidden onChange={handleImageUpload} />
          </label>
          {imgError && <p className="para-card__image-error">{imgError}</p>}
        </div>
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
        <button className="para-card__cancel" onClick={() => onEdit(null)}>Cancel</button>
        <button className="para-card__save" onClick={() => onSave(draft)}>Save Paragraph</button>
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
  const [thumbnail, setThumbnail] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [thumbError, setThumbError] = useState("");
  const thumbInputRef = useRef(null);

  useEffect(() => {
    async function load() {
      const b = await getBlog(id);
      if (!b) { navigate("/create"); return; }
      if (b.author !== user?.username) { navigate("/create"); return; }
      setBlog(b);
      setTitle(b.title);
      setThumbnail(b.thumbnail || "");
      setParagraphs(b.paragraphs || []);
    }
    load();
  }, [id]);

  async function handleThumbnailUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setThumbError("");
    try {
      const base64 = await compressAndValidateImage(file);
      setThumbnail(base64);
    } catch (err) {
      setThumbError(err);
    }
    e.target.value = "";
  }

  function handleSaveParagraph(draft) {
    setParagraphs(prev => prev.map(p => p.id === draft.id ? { ...draft } : p));
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
    const newPara = { id: generateParagraphId(), heading: "", body: "", location: null, image: null };
    setParagraphs(prev => [...prev, newPara]);
    setActiveId(newPara.id);
  }

  async function handleBlogSave() {
    if (!blog) return;
    const updated = { ...blog, title: title || "Untitled Blog", thumbnail, paragraphs };
    try {
      await saveBlog(updated);
      setBlog(updated);
      setSaved(true);
      setSaveError("");
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setSaveError("Save failed. Try smaller images.");
    }
  }

  async function handleDeleteBlog() {
    await deleteBlog(id);
    navigate("/create");
  }

  function handleEditParagraph(paraId) {
    if (paraId === null) { setActiveId(null); return; }
    if (activeId && activeId !== paraId) return;
    setActiveId(paraId);
  }

  if (!blog) return null;

  return (
    <main className="creation-tool">
      <div className="creation-tool__inner">
        <div className="creation-tool__toprow">
          <button className="creation-tool__back" onClick={() => navigate("/create")}>← Back</button>
          <div className="creation-tool__toprow-right">
            {saveError && <span className="creation-tool__save-error">{saveError}</span>}
            <button className="creation-tool__delete-btn" onClick={() => setShowDeleteConfirm(true)}>
              Delete Blog
            </button>
            <button className="creation-tool__publish" onClick={handleBlogSave}>
              {saved ? "✓ Saved!" : "Save Blog"}
            </button>
          </div>
        </div>

        <input
          className="creation-tool__title-input"
          type="text"
          placeholder="Blog title..."
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <div className="creation-tool__thumbnail-section">
          {thumbnail && (
            <div className="creation-tool__thumbnail-preview-wrap">
              <img src={thumbnail} className="creation-tool__thumbnail-preview" alt="Thumbnail" />
              <button
                className="creation-tool__thumbnail-remove"
                onClick={() => setThumbnail("")}
                title="Remove thumbnail"
              >✕</button>
            </div>
          )}
          <label className="creation-tool__thumbnail-btn">
            {thumbnail ? "Change Thumbnail" : "＋ Add Thumbnail"}
            <input ref={thumbInputRef} type="file" accept="image/*" hidden onChange={handleThumbnailUpload} />
          </label>
          {thumbError && <p className="creation-tool__thumb-error">{thumbError}</p>}
        </div>

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
              onClick={async () => { await handleBlogSave(); navigate(`/blog/${id}`); }}
            >
              Save &amp; Preview →
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={handleDeleteBlog}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
    </main>
  );
}
