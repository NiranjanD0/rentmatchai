import React, { useState } from 'react';
import { ArrowLeft, MapPin, Sparkles, Heart, BedDouble, Bath, Maximize2, CheckCircle2, Check, MessageCircle, Building2, Edit3, Eye, EyeOff, Trash2, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { PROPERTY_STATUS } from '../constants/initialData.js';

const money = (n) => '₹' + Number(n).toLocaleString('en-IN');

export default function PropertyDetailsPage({
  property,
  isSaved,
  onToggleSave,
  onBack,
  onEdit,
  onToggleStatus,
  onDelete,
  onOpenEnquiry
}) {
  const { user } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!property) return null;

  const isOwner = Boolean(user && String(user.id) === String(property.listerId));
  const isInactive = property.status === PROPERTY_STATUS.INACTIVE;

  const images = property.gallery?.length ? property.gallery : [property.image];

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="wrap detail-page">
      {/* Back Button */}
      <button className="back" onClick={onBack}>
        <ArrowLeft size={16} /> Back to results
      </button>

      {/* Owner Management Notification Banner */}
      {isOwner && (
        <div className="owner-status-banner">
          <div className="owner-banner-text">
            <Building2 size={18} />
            <div>
              <strong>Owner Mode: You own this listing.</strong>
              <span>
                Current status is <strong>{property.status}</strong>. {isInactive ? 'This listing is hidden from public tenants.' : 'This listing is live on the public feed.'}
              </span>
            </div>
          </div>
          <div className="owner-banner-actions">
            <button className="btn-owner-banner edit" onClick={() => onEdit(property)}>
              <Edit3 size={14} /> Edit Details
            </button>
            <button
              className="btn-owner-banner status"
              onClick={() => onToggleStatus(property.id)}
            >
              {isInactive ? (
                <>
                  <Eye size={14} /> Reactivate
                </>
              ) : (
                <>
                  <EyeOff size={14} /> Deactivate
                </>
              )}
            </button>
            <button className="btn-owner-banner delete" onClick={() => onDelete(property)}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      )}

      {/* Header Info */}
      <div className="detail-title">
        <div>
          <div className="location">
            <MapPin size={14} /> {property.location}
          </div>
          <h1>{property.title}</h1>
          <p>
            {property.propertyType} · {property.bedrooms} bedrooms · {property.bathrooms || 1} bathrooms · {property.sqft || 900} sq ft
          </p>
        </div>

        <div className="detail-actions">
          {property.match && (
            <span className="match">
              <Sparkles size={13} /> {property.match}% match
            </span>
          )}
          <button
            className={`outline ${isSaved ? 'saved-active' : ''}`}
            onClick={() => onToggleSave(property.id)}
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved ? 'Saved to shortlist' : 'Save home'}
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gallery">
        <div className="gallery-main">
          <img src={images[activeImageIndex]} alt={property.title} />
          {images.length > 1 && (
            <>
              <button className="gallery-arrow left" onClick={prevImage} aria-label="Previous photo">
                ‹
              </button>
              <button className="gallery-arrow right" onClick={nextImage} aria-label="Next photo">
                ›
              </button>
              <span className="gallery-counter">
                {activeImageIndex + 1} / {images.length}
              </span>
            </>
          )}
          <span>Verified property photo</span>
        </div>

        <div className="gallery-side">
          <img
            src={images[1] || images[0]}
            alt="Interior view"
            onClick={() => setActiveImageIndex(1 % images.length)}
          />
          <div className="gallery-side-note">
            <Building2 size={20} />
            <div>
              <b>{property.propertyType || 'Apartment'} in {property.location}</b>
              <small>Lister: {property.listerName || 'Verified Host'}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Columns: Main Space Details + Rent Sidebar */}
      <div className="detail-columns">
        <div className="detail-left-col">
          {/* Section 1: The Space */}
          <section className="detail-section">
            <small className="kicker">THE SPACE</small>
            <h2>About this rental</h2>
            <p>{property.description}</p>

            <div className="facts">
              <div>
                <BedDouble />
                <b>{property.bedrooms} Bedrooms</b>
                <small>Living & sleeping rooms</small>
              </div>
              <div>
                <Bath />
                <b>{property.bathrooms || 1} Bathrooms</b>
                <small>Private sanitary spaces</small>
              </div>
              <div>
                <Maximize2 />
                <b>{property.sqft || 900} sq ft</b>
                <small>Approx carpet area</small>
              </div>
            </div>
          </section>

          {/* Section 2: Amenities */}
          <section className="detail-section">
            <small className="kicker">AMENITIES & SPECIFICATIONS</small>
            <h2>Included features</h2>
            <div className="amenities">
              {[...(property.amenities || []), property.furnishing, property.availableFrom].map(
                (item) => (
                  <span key={item}>
                    <CheckCircle2 size={16} /> {item}
                  </span>
                )
              )}
            </div>
          </section>

          {/* Section 3: Match Explanation (AI Concept) */}
          <section className="detail-section why">
            <Sparkles size={20} />
            <div>
              <small className="kicker">MATCH EXPLANATION · AI CONCEPT</small>
              <h2>Why this home could fit</h2>
              <p>
                Calculated weighted fit based on rent within budget, location in Gandhinagar, and specified amenities.
              </p>
              <div className="reason-tags">
                <span>
                  <Check size={13} /> Rent at {money(property.rent)}/mo
                </span>
                <span>
                  <Check size={13} /> {property.bedrooms} BHK spacious layout
                </span>
                <span>
                  <Check size={13} /> {property.commute || '15 min to campus'}
                </span>
              </div>
            </div>
          </section>

          {/* Section 4: Visit Checklist Questions */}
          <section className="detail-section">
            <small className="kicker">BE PREPARED FOR A VISIT</small>
            <h2>Recommended Landlord Visit Questions</h2>
            <ul className="questions">
              <li>What maintenance charges are covered in the {money(property.rent)} monthly rent?</li>
              <li>What are the exact security deposit refund clauses and notice periods?</li>
              <li>Is 24/7 water supply and power backup provided?</li>
              <li>Are visitor restrictions or gated community guidelines applicable?</li>
            </ul>
            <small className="muted">Visit questions assist tenants in evaluating homes thoroughly.</small>
          </section>
        </div>

        {/* Right Sticky Rent Box */}
        <aside className="rent-box">
          <small>MONTHLY RENT</small>
          <div className="rent-price">
            {money(property.rent)} <span>/ month</span>
          </div>

          <div className="rent-row">
            <span>Security deposit</span>
            <b>{money(property.deposit || property.rent * 2)}</b>
          </div>

          <div className="rent-row">
            <span>Furnishing</span>
            <b>{property.furnishing}</b>
          </div>

          <div className="rent-row">
            <span>Availability</span>
            <b>{property.availableFrom || 'Available now'}</b>
          </div>

          <div className="rent-row">
            <span>Lister Name</span>
            <b>{property.listerName || 'Verified Lister'}</b>
          </div>

          <div className="rent-row">
            <span>Commute estimate</span>
            <b>{property.commute || '15-20 min'}</b>
          </div>

          <button className="primary full" onClick={onOpenEnquiry}>
            <MessageCircle size={16} /> Contact / Enquire
          </button>

          <button
            className={`secondary full ${isSaved ? 'btn-saved-active' : ''}`}
            onClick={() => onToggleSave(property.id)}
          >
            <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
            {isSaved ? 'Saved to shortlist' : 'Save to shortlist'}
          </button>

          {isOwner && (
            <div className="rent-box-owner-tools">
              <span className="owner-tools-title">Lister Quick Actions</span>
              <button className="btn-edit-quick" onClick={() => onEdit(property)}>
                <Edit3 size={14} /> Edit Listing Details
              </button>
              <button
                className={`btn-toggle-quick ${isInactive ? 'react' : 'deact'}`}
                onClick={() => onToggleStatus(property.id)}
              >
                {isInactive ? 'Reactivate Property' : 'Deactivate Listing'}
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
